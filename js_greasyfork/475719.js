// ==UserScript==
// @name         SCBOY论坛自建表情包
// @namespace    *://www.scboy.cc/
// @version      1.1.6
// @description  允许你创建自己的表情包。从论坛里面收集图片，拖到饥饿的兔子头像上，即可保存。
// @author       RustyHare
// @match        *://www.scboy.cc/*
// @exclude      https://www.scboy.cc/plugin/xn_ueditor/ueditor/dialogs/emotion/emotion.html?v1.2
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475719/SCBOY%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%BB%BA%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/475719/SCBOY%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%BB%BA%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==


// feature: 分类；
// feature: 导入与导出；
// feature: 拖拽整理（我得加一个暂存区，像微信那样子，还得有分类能力）
// feature: 统一图片大小；更大的预览(做完了)
// feature: 标签改名，管理
// bug: 回车会变成换行，是input和textarea的问题（修好了）
// bug: iframe内也会出现。不能这样子。（修好了）
// lookup: IOS Stay app 能装用户脚本但是格式不对（这我咋办，我又没有苹果）（整好了，是换行的问题）（传了个新版本）
// bug: 直接把图片拖进去，会导致let targetTagid = document.getElementById("imageSetTooltipTags").dataset.active;找不到元素。（修好了）

// 我的背好疼。

// 给读这个代码的人：注意我的变量作用域！别用错作用域了！
unsafeWindow.imageSetPopper = {};
unsafeWindow.imageSetFloatingIcon = {};
unsafeWindow.imageSetTooltip = {};
unsafeWindow.rhImagePreview = {};
// 怎么存呢？
// 首先开一个表来表示所有的分类，自增主键（bushi
var imageSet = GM_getValue("imageSet");
if (typeof (imageSet) == "undefined") {
    imageSet = {
        primaryKey: 0,
        tags: {
            "0": {
                name: "默认",
                data: []
            }
        },
    };
    GM_setValue("imageSet", imageSet);
} else if (typeof (imageSet[0]) != "undefined") {
    // 从1.0.x的数据迁移到1.1.x，打个备份先
    GM_setValue("backupImageSet", imageSet);
    let newImageSet = {
        primaryKey: 1,
        tags: {
            "0": {
                name: "默认",
                data: imageSet
            },
            "1": {
                name: "土豆",
                data: []
            }
        }
    };
    GM_setValue("imageSet", newImageSet);
    imageSet = newImageSet;
}
for (let tag in imageSet.tags) {
    for (let i = 0; i < imageSet.tags[tag].data.length; i++) {
        imageSet.tags[tag].data[i] = imageSet.tags[tag].data[i].replace("img.scboy.cc", "www.scboy.cc");
    }
}
GM_setValue("imageSet", imageSet);


function attachFloatingIcon() {

    let floatingIcon = document.createElement("DIV");
    floatingIcon.id = "rhPluginEntry";
    floatingIcon.style.position = "fixed";
    floatingIcon.style.top = "8%";
    floatingIcon.style.right = "20px";
    floatingIcon.style.width = "48px";
    floatingIcon.style.height = "48px";
    floatingIcon.innerHTML = '<img class="avatar-4" style="width:48px;height:48px;" src="https://www.scboy.cc/upload/avatar/000/35548.png?1677763023">';
    floatingIcon.ondragover = function (event) {
        event.preventDefault();
    }
    floatingIcon.ondrop = function (event) {
        let target = document.getElementById("imageSetTooltipTags");
        let targetTagid = target ? target.dataset.active : 0;
        event.preventDefault();
        let data = event.dataTransfer.getData("text/uri-list").toLowerCase();
        try {
            let u = new URL(data);
        } catch (e) {
            // -1: not a good url
            return "-1: 这不是一个好的URL";
        }
        if (data.indexOf("jpg") == -1 && data.indexOf("png") == -1 && data.indexOf("gif") == -1 && data.indexOf("webp") == -1 && data.indexOf("jpeg") == -1 && data.indexOf("bmp") == -1) {
            // -2: not an image (perhaps)
            return "-2: 这也许不是一个图片的URL。请尝试把它上传到论坛，存为有常见扩展名的图片再添加";
        }
        // -3: already exists
        if (imageSet.tags[targetTagid].data.indexOf(data) != -1) {
            return "-3: 已有这张图片";
        }
        imageSet.tags[targetTagid].data.push(data);
        GM_setValue("imageSet", imageSet);
        try {
            imageSetTooltip.showImagesByTag();
        } catch (e) {
            console.log("me no want fix awa me lazy awa");
        }
        return "0: 添加成功";
    }
    floatingIcon.onclick = function (_event) {
        if (!unsafeWindow.imageSetPopper.element) {
            unsafeWindow.imageSetPopper.element = new Popper(unsafeWindow.imageSetFloatingIcon.element, unsafeWindow.imageSetTooltip.element, { placement: 'left-start' })
        }
        unsafeWindow.imageSetTooltip.element.style.display = (unsafeWindow.imageSetTooltip.element.style.display == "block" ? "none" : "block");
        unsafeWindow.imageSetTooltip.showTooltip();
    }
    document.body.appendChild(floatingIcon);
    unsafeWindow.imageSetFloatingIcon.element = floatingIcon;
};

function attachTooltip() {

    let tooltip = document.createElement("DIV");
    tooltip.style.display = "none";
    tooltip.style.width = "500px";
    tooltip.style.height = "600px";
    tooltip.style.backgroundColor = "#F5F5F5";
    tooltip.style.zIndex = 65535;
    tooltip.style.borderRadius = "5px";
    tooltip.ondragover = function (event) {
        event.preventDefault();
    }
    tooltip.ondrop = function (event) {
        event.preventDefault();
        let targetTagid;
        if (event.target.dataset.tagid != undefined) {
            targetTagid = event.target.dataset.tagid;
        } else {
            targetTagid = document.getElementById("imageSetTooltipTags").dataset.active;
        }
        let data = event.dataTransfer.getData("text/uri-list").toLowerCase();
        try {
            let u = new URL(data);
        } catch (e) {
            return -1;
        }
        if (data.indexOf("jpg") == -1 && data.indexOf("png") == -1 && data.indexOf("gif") == -1 && data.indexOf("webp") == -1 && data.indexOf("jpeg") == -1 && data.indexOf("bmp") == -1) {
            return -2;
        }
        if (imageSet.tags[targetTagid].data.indexOf(data) != -1) {
            return -3;
        }
        imageSet.tags[targetTagid].data.push(data);
        GM_setValue("imageSet", imageSet);
        imageSetTooltip.showImagesByTag();
        return 0;
    }
    document.body.appendChild(tooltip);
    unsafeWindow.imageSetTooltip.element = tooltip;
    // 改写：现在将tooltip的框架改为单独的函数，直接往里塞。
    unsafeWindow.imageSetTooltip.showTooltip = function (_event) {
        unsafeWindow.imageSetTooltip.element.innerHTML = `
                <div class="container" style="height:100%;">
                    <div class="row" style="height:40px;background-color: #CFCFCF;">
                        <div class="col-lg-3" style="height:40px;">
                            🥔🌱v1.1.6
                        </div>
                        <div class="col-lg-3" style="height:40px;">
                            <button style="width: 100%; height: 24px; margin-top: 16px; border: 0px; cursor: pointer; background-color: #FFEB3B;" id="imageSetTooltipButtonEdit" onclick="imageSetTooltip.editTags(event)">编辑</button>
                        </div>
                        <div class="col-lg-3" style="height:40px;">
                            <button style="width: 100%; height: 24px; margin-top: 16px; border: 0px; cursor: pointer; background-color: #FFEB3B;" onclick="imageSetTooltip.saveAsFile()">导出</button>
                        </div>
                        <div class="col-lg-3" style="height:40px;">
                            <button style="width: 100%; height: 24px; margin-top: 16px; border: 0px; cursor: pointer; background-color: #FFEB3B;" onclick="imageSetTooltip.loadFromFile()">导入</button>
                        </div>
                    </div>
                    <div class="row" style="height:560px;">
                        <div class="col-lg-2" style="height:560px; background-color: #CFCFCF; overflow: hidden; padding-left: 2px;">
                            <div style="overflow: hidden scroll; width: 130px; height:560px;">
                                <table style="width: 130px; padding-top: 10px; padding-left: 0px; border-collapse: separate; border-spacing: 0px 16px; table-layout: fixed;">
                                    <thead>
                                        <tr>
                                            <th style="width:10%;"></th>
                                            <th style="width:90%;"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="imageSetTooltipTags" data-active="`+ ((!!document.getElementById("imageSetTooltipTags")) ? document.getElementById("imageSetTooltipTags").dataset.active : "0") + `">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col-lg-10" style="overflow: hidden; height: 560px; z-index: 65537; ">
                            <div style="display:flex;flex-wrap:wrap;width:420px;height:540px;overflow-x:hidden;overflow-y:scroll;align-content:flex-start;margin-top: 10px;" id="imageSetTooltipScrollArea">

                            </div>
                        </div>
                    </div>
                </div>
            `;
        // 塞完了框架，往里塞标签
        unsafeWindow.imageSetTooltip.showTags();
        unsafeWindow.imageSetTooltip.showImagesByTag();
    }
    // 需要添加：渲染所有标签的函数，这玩意儿不管图片，只管tag
    unsafeWindow.imageSetTooltip.showTags = function (_event = {}) {
        let imageSetTooltipTags = document.getElementById("imageSetTooltipTags");
        imageSetTooltipTags.innerHTML = "";
        for (t in imageSet.tags) {
            let tag = imageSet.tags[t];
            let tagRow = document.createElement("TR")
            tagRow.style.height = "16px";
            tagRow.style.backgroundColor = "#FFEB3B";
            tagRow.dataset.tagid = t;
            tagRow.onclick = unsafeWindow.imageSetTooltip.switchTag;
            tagRow.innerHTML = `
            <th style="background-color: #CFCFCF; "></th>
            <th style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; box-shadow: -2px 2px 2px 1px #9C9C9C; cursor: pointer;" data-tagid="` + t + `">` + tag.name + `</th>`

            imageSetTooltipTags.appendChild(tagRow);
        }
    }

    unsafeWindow.imageSetTooltip.editTags = function (_event) {
        unsafeWindow.imageSetTooltip.sortable = new Sortable(imageSetTooltipScrollArea, {
            animation: 100,
            onEnd(event) {
                let targetTagid = event.originalEvent.target.dataset.tagid;
                let activeTag = document.getElementById("imageSetTooltipTags").dataset.active;
                let scrollArea = document.getElementById("imageSetTooltipScrollArea");
                let sortedImgs = [];
                if (!!targetTagid) {
                    if (imageSet.tags[targetTagid].data.indexOf(event.item.dataset.imgSrc) == -1) {
                        imageSet.tags[targetTagid].data.push(event.item.dataset.imgSrc);
                    }
                }
                for (let i = 0; i < scrollArea.children.length; i++) {
                    sortedImgs.push(scrollArea.children[i].dataset.imgSrc);
                    scrollArea.children[i].dataset.imgid = i;
                    scrollArea.children[i].children[1].dataset.imgid = i;
                }
                imageSet.tags[activeTag].data = sortedImgs;
                GM_setValue("imageSet", imageSet);
            }
        });
        let btn = document.getElementById("imageSetTooltipButtonEdit");
        btn.innerText = "保存";
        btn.onclick = unsafeWindow.imageSetTooltip.saveTags;
        let imageSetTooltipTags = document.getElementById("imageSetTooltipTags");
        imageSetTooltipTags.innerHTML = "";
        for (t in imageSet.tags) {
            let tag = imageSet.tags[t];
            let tagRow = document.createElement("TR")
            tagRow.style.height = "16px";
            tagRow.style.backgroundColor = "#FFEB3B";
            tagRow.dataset.tagid = t;
            tagRow.onclick = unsafeWindow.imageSetTooltip.switchTag;
            tagRow.innerHTML = `<th style="background-color: #CFCFCF; cursor: pointer; " onclick="imageSetTooltip.removeTag(event)" data-tagid="` + t + `">x</th><th style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; box-shadow: -2px 2px 2px 1px #9C9C9C; cursor: pointer;" data-tagid="` + t + `">` + `<input style="max-width:70px; "oninput="imageSetTooltip.changeTagName(event)" data-tagid="` + t + `" value="` + tag.name + `">` + `</th>`
            imageSetTooltipTags.appendChild(tagRow);
        }
        let tagRow = document.createElement("TR")
        tagRow.style.height = "16px";
        tagRow.style.backgroundColor = "#FFEB3B";
        tagRow.onclick = unsafeWindow.imageSetTooltip.addTag;
        tagRow.innerHTML = `<th style="background-color: #CFCFCF;"> </th> <th style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; box-shadow: -2px 2px 2px 1px #9C9C9C; cursor: pointer; ">+</th>`
        imageSetTooltipTags.appendChild(tagRow);
    }

    unsafeWindow.imageSetTooltip.changeTagName = function (event) {
        let targetTagid = event.target.dataset.tagid;
        let value = !event.target.value ? "标签" : event.target.value;
        imageSet.tags[targetTagid].name = value;
        GM_setValue("imageSet", imageSet);
    }

    unsafeWindow.imageSetTooltip.removeTag = function (event) {
        if (parseInt(event.target.dataset.tagid)) {
            delete imageSet.tags[event.target.dataset.tagid];
            unsafeWindow.imageSetTooltip.editTags();
            GM_setValue("imageSet", imageSet);
        }
    }


    unsafeWindow.imageSetTooltip.saveTags = function (_event) {
        unsafeWindow.imageSetTooltip.sortable = null;
        document.getElementById("imageSetTooltipTags").dataset.active = "0";
        unsafeWindow.imageSetTooltip.showImagesByTag();
        let btn = document.getElementById("imageSetTooltipButtonEdit");
        btn.innerText = "编辑";
        btn.onclick = unsafeWindow.imageSetTooltip.editTags;
        unsafeWindow.imageSetTooltip.showTags();
    }

    // 增加标签
    unsafeWindow.imageSetTooltip.addTag = function () {
        imageSet["primaryKey"] += 1;
        let newTagObject = {
            name: imageSet["primaryKey"].toString(),
            data: []
        }
        imageSet.tags[imageSet["primaryKey"].toString()] = newTagObject;
        unsafeWindow.imageSetTooltip.editTags();
        GM_setValue("imageSet", imageSet);
    }

    // 点击标签的时候，切换框体中的图片
    unsafeWindow.imageSetTooltip.switchTag = function (event) {
        document.getElementById("imageSetTooltipTags").dataset.active = event.target.dataset.tagid;
        unsafeWindow.imageSetTooltip.showImagesByTag({});
    }

    // 需要添加：标签点击的时候，更改imageSetTooltip.element.dataset.activeTag的值，并根据此值来改变
    // 别学我这写法啊
    unsafeWindow.imageSetTooltip.showImagesByTag = function (_event) {
        let activeTag = document.getElementById("imageSetTooltipTags").dataset.active;
        let data = imageSet.tags[activeTag].data;
        let scrollArea = document.getElementById("imageSetTooltipScrollArea");
        scrollArea.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            let imgFrm = document.createElement("DIV")
            imgFrm.style.display = "inline";
            imgFrm.style.position = "relative";
            imgFrm.style.lineHeight = "95px";
            imgFrm.style.width = "95px";
            imgFrm.style.height = "95px";
            imgFrm.style.border = "1px solid #DCDCDC";
            imgFrm.style.textAlign = "center";
            imgFrm.onmouseenter = rhEnterPreview;
            imgFrm.onmouseleave = rhLeavePreview;
            imgFrm.onclick = addAWAImage;
            imgFrm.dataset.imgSrc = data[i];
            imgFrm.dataset.tagid = activeTag;
            imgFrm.dataset.imgid = i.toString();
            imgFrm.innerHTML = `
                    <h6 style="display:inline">
                        <span class="label label-info" data-url="` + data[i] + `"onclick="removeImageByURL(event)" style="position: absolute;top: 5px;right: 0px;line-height: 0;cursor: pointer;">x</span>
                    </h6>
                    <img src=` + data[i] + ` data-img-src="` + data[i] + `" style="padding:8px;vertical-align:middle;max-width:100%;max-height:100%;" data-imgid="` + i.toString() + `" data-tagid="` + activeTag + `">
                `
            scrollArea.appendChild(imgFrm)
        }



        unsafeWindow.imageSetTooltip.saveAsFile = function (_event = {}) {
            let json = JSON.stringify(imageSet);
            let blob = new Blob([json], { type: 'application/json' });
            let url = URL.createObjectURL(blob);
            let link = document.createElement('A');
            link.href = url;
            link.download = "ImageSetSave.awa";
            link.click();
        }

        unsafeWindow.imageSetTooltip.loadFromFile = function (_event = {}) {
            let finput = document.createElement("INPUT");
            finput.type = "file";
            finput.accept = ".awa";
            finput.onchange = function (e) {
                let fileReader = new FileReader();
                fileReader.onload = function (event) {
                    try {
                        let json = JSON.parse(event.target.result);
                        console.log(json);
                        if (!!json.primaryKey && !!json.tags) {
                            imageSet = json;
                            GM_setValue("imageSet", imageSet);
                        }
                        unsafeWindow.imageSetTooltip.showTags();
                        unsafeWindow.imageSetTooltip.showImagesByTag();
                    } catch (e) {
                        console.log(e)
                    }

                }
                fileReader.readAsText(finput.files[0]);
            }
            finput.click();
        }


    }



};

// 0920:添加预览功能
function attachImagePreview() {
    unsafeWindow.rhImagePreview.element = document.createElement("IMG");
    unsafeWindow.rhImagePreview.element.style.display = "none";
    unsafeWindow.rhImagePreview.element.id = "rhImagePreview";
    unsafeWindow.rhImagePreview.element.style.zIndex = 65538;
    unsafeWindow.rhImagePreview.element.style.width = "30%";
    unsafeWindow.rhImagePreview.element.style.maxHeight = "80%";
    document.body.appendChild(unsafeWindow.rhImagePreview.element)
};


// 这个方法会修改原有的快速回帖槽位
function injectReplyForm() {
    let form = document.getElementById("quick_reply_form")
    if (!!form) {
        // 我假定[0]是doctype的那个Input
        form.children[0].value = 0;
        // 把原来那个改掉
        let originalTextarea = document.getElementById("message");
        originalTextarea.name = "fakeMessage";

        replacedTextarea = document.createElement("input");
        replacedTextarea.type = "hidden";
        replacedTextarea.name = "message";
        replacedTextarea.id = "replacedTextarea";
        form.appendChild(replacedTextarea);
        // 狸猫换太子！
        originalTextarea.oninput = function (event) {
            document.getElementById("replacedTextarea").value = parseEmojiMark(document.getElementById("message").value);
        }
        form.onmousemove = function (event) {
            document.getElementById("replacedTextarea").value = parseEmojiMark(document.getElementById("message").value);
        }
    }
};

// remove in release
unsafeWindow.clearImg = function () {
    GM_setValue("imageSet", [])
};

// click handler
unsafeWindow.removeImageByURL = function (e) {
    e.stopPropagation();
    let activeTag = document.getElementById("imageSetTooltipTags").dataset.active;
    imageSet.tags[activeTag].data.splice(imageSet.tags[activeTag].data.indexOf(e.target.dataset.url), 1);
    GM_setValue("imageSet", imageSet);
    imageSetTooltip.showImagesByTag();
};

// quick reply handler
unsafeWindow.parseEmojiMark = function (message) {
    message = message.replaceAll("\n", "<br>");
    // 0924: 我终于决定使用regexp了。
    let re = /\[awa_\d+_\d+\]/;
    let res;
    let mark;
    let pattern;
    while ((res = re.exec(message)) !== null) {
        mark = res[0].split("_");
        pattern = `<img src=` + imageSet.tags[mark[1]].data[parseInt(mark[2])] + ` style="max-height:220px; min-height: 40px;" />`
        message = message.replace(res[0], pattern);
    }
    return message;
};

// dynamically add image to the input in one single function
unsafeWindow.addAWAImage = function (e) {
    if (typeof (UE) != "undefined") {
        let awa = UE.getEditor('msg_container');
        let ins = `<img src="` + e.target.dataset.imgSrc + `" style="max-height:240px; min-height: 50px;" />`;
        awa.execCommand('inserthtml', ins);
    } else {
        $('#message').insertAtCaret('[awa_' + e.target.dataset.tagid + '_' + e.target.dataset.imgid + ']');
        $('#message').trigger("input");
    }
};

unsafeWindow.rhEnterPreview = function (e) {
    unsafeWindow.rhImagePreview.popper = new Popper(unsafeWindow.imageSetTooltip.element, unsafeWindow.rhImagePreview.element, { placement: 'left-start' });
    unsafeWindow.rhImagePreview.popper.reference = unsafeWindow.imageSetTooltip.element;
    unsafeWindow.rhImagePreview.element.style.display = "block";
    unsafeWindow.rhImagePreview.element.src = e.target.dataset.imgSrc;
};

unsafeWindow.rhLeavePreview = function (_e) {
    unsafeWindow.rhImagePreview.element.style.display = "none";
};

function main() {
    attachFloatingIcon();
    attachTooltip();
    attachImagePreview();
    injectReplyForm();
}


if (window.addEventListener != null) {
    window.addEventListener("load", main, false);
} else if (window.attachEvent != null) {
    window.attachEvent("onload", main);
}

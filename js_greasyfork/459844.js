// ==UserScript==
// @name         虎扑网红鬼畜表情图屏蔽缩小
// @namespace    http://tampermonkey.net/
// @version      2.6
// @license      MIT
// @description  去tm的鬼畜网红图,摸鱼万岁
// @author       zwxbest
// @match        https://bbs.hupu.com/*.html
// @match        https://m.hupu.com/bbs/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @resource     bootstrap https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      gitee.com

// @downloadURL https://update.greasyfork.org/scripts/459844/%E8%99%8E%E6%89%91%E7%BD%91%E7%BA%A2%E9%AC%BC%E7%95%9C%E8%A1%A8%E6%83%85%E5%9B%BE%E5%B1%8F%E8%94%BD%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/459844/%E8%99%8E%E6%89%91%E7%BD%91%E7%BA%A2%E9%AC%BC%E7%95%9C%E8%A1%A8%E6%83%85%E5%9B%BE%E5%B1%8F%E8%94%BD%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==



let isPC = true;

// 要屏蔽的图片，勾选中的才屏蔽
let GM_KEY_SHOW_IMAGE = "show_image_urls";
// 勾选中的图片id
let GM_KEY_BLOCK_ID = "block_ids";
let GM_KEY_BLOCK_ALL = "block_all";
let GM_KEY_SMALL_ALL = "small_all"


class Menu {
    constructor(name, func, id) {
        this.name = name;
        this.func = func;
        this.id = id;
    }
}

let curElemnt = null

document.body.onmousemove = (event) => {
    curElemnt = event.target;
};

let menus = [];
menus.push(new Menu("➕添加屏蔽图", settingAdd, -1));
menus.push(new Menu("🚫图片屏蔽", settingSwitch, -1));
menus.push(new Menu("🐌缩小回复中的全部图片", settingSmall, -1));
menus.push(new Menu("❌屏蔽回复中的全部图片", settingBockAll, -1));
menus.push(new Menu("➰合并官方屏蔽图配置", settingRemote, -1));
menus.push(new Menu("❗重置", settingReset, -1));

function blockAllImage() {
    let classname = isPC ? ".reply-list-content img" : ".discuss-card__images";
    $(classname).each(function (i, e) {
        let style = $(e).attr("style") ? $(e).attr("style") : "";
        if (!style.includes("display:none;")) {
            $(e).attr("style", style + "display:none;");
        }
    })

}

function smallAllImage() {
    let classname = isPC ? ".reply-list-content img" : ".discuss-card__images img";
    $(classname).each(function (i, e) {
        let style = $(e).attr("style") ? $(e).attr("style") : "";
        if (!style.includes("max-height:80px;")) {
            $(e).attr("style", style + "max-height:80px;");
        }
    })

}

(function () {
    'use strict';
    registerMenu();

    let url = window.location.href;
    isPC = !url.includes("m.hupu.com");

    let blockAll = GM_getValue(GM_KEY_BLOCK_ALL, false);
    if (blockAll) {
        console.log("block all -------------")
        $(document).ready(function () {
            blockAllImage()
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    console.log(mutation.type)
                    if (mutation.type === 'childList') {
                        blockAllImage()
                    }
                });
            });
            var config = { childList: true,  attributes: true,subtree: true};
            observer.observe(document, config);
        });
    } else {
        var bootCSS = GM_getResourceText("bootstrap");
        GM_addStyle(bootCSS);


        initShowImage();
        let blockIds = getBlockId();
        let parentClass = isPC ? ".post-reply-list" : ".hp-m-post-page";
        $(document).ready(function () {
            $(parentClass).each(function (i, e) {
                removeImg(e, blockIds);
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        console.log(mutation.type)
                        if (mutation.type === 'childList') {
                            removeImg(e, blockIds);
                        }
                    });
                });
                var config = { childList: true,  attributes: true,subtree: true};
                observer.observe(e, config);
            })
        });
    }

    let smallAll = GM_getValue(GM_KEY_SMALL_ALL, false);
    if (smallAll) {
        $(document).ready(function () {
            smallAllImage();
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    console.log(mutation.type)
                    if (mutation.type === 'childList') {
                        smallAllImage()
                    }
                });
            });
            var config = { childList: true,  attributes: true,subtree: true};
            observer.observe(document, config);
        });
    }


})();

function registerMenu() {
    let blockAll = GM_getValue(GM_KEY_BLOCK_ALL, false);
    if (blockAll) {
        menus[3].name = "✔️已屏蔽回帖中所有图片"
    }
    let smallAll = GM_getValue(GM_KEY_SMALL_ALL, false);
    if (smallAll) {
        menus[2].name = "✔️已缩小回帖中所有图片"
    }
    for (let m of menus) {
        m.id = GM_registerMenuCommand(m.name, m.func, "");
    }
}


function checkImgSuffix(url) {
    let urlLower = url.toLowerCase();
    let suffixs = [".jpg", ".png", ".jpeg", ".gif", ".webp"];
    // console.log(urlLower);
    for (let s of suffixs) {
        if (urlLower.includes(s)) {
            return true;
        }
    }
    return false;
}


function initShowImage() {
    let showImage = GM_getValue(GM_KEY_SHOW_IMAGE, []);
    if (showImage.length === 0) {
        settingRemote()
    }
}

function getImageAndId(image) {
    let id = "";//如果url中没有找到标识字符串，用乱码代替，这样不会匹配任何图片
    let index = image.indexOf("thread_");
    if (index > -1) {
        for (let i = index + 7; i < image.length; i++) {
            if (image[i] >= 'a' && image[i] <= 'z') {
                break;
            }
            id += image[i];
        }
    } else {
        let splits = image.split("/");
        for (let split of splits) {
            if (checkImgSuffix(split)) {
                let split2 = split.split(".");
                id = split2[0];
                break;
            }
        }
    }
    return [id, image];
}


//e是.image-wrapper
function removeImg(e, blockIds) {
    let imgClass = isPC ? ".thread-img" : "img.hupu-fufu-lazy-img";
    let imgParent = isPC ? ".image-wrapper" : ".discuss-card__images";

    $(e).find(imgClass).each(function (i2, e2) {
        let src = $(e2).attr("src");
        for (let black of blockIds) {
            if (src.includes(black)) {
                $(e2).parents(imgParent).first().remove();
                break;
            }
        }
    });
}

function selectCheckbox(e) {
    let checked = e.checked;
    let id = $(e).attr("id");
    let checkIds = getBlockId();
    if (checked) {
        checkIds.add(id);
    } else {
        checkIds.delete(id);
    }
    setBlockId(checkIds)
}

function settingSwitch() {
    // 初始化打开开关
    addUI();
    let checkIds = getBlockId();
    let allChecked = true;
    $(".hp-cbx").each(function (i, e) {
        $(e).click(function () {
            selectCheckbox(this)
        })
        let id = $(e).attr("id");
        if (checkIds.has(id)) {
            $(e).prop("checked", true);
        } else {
            allChecked = false;
        }
    })
    if (allChecked) {
        $("#z_all").prop("checked", true);
    }

}

function addUI() {
    clearUI();
    $("body").append("<div id=\"setting1\" style='right: 10px;top: 100px;background: #f8f8f8;color:#ffffff;overflow: auto;overflow-x:hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 200px;border-radius: 4px;border-style:solid;\n" +
        " border-width:1px; border-color:black;'>\n" +
        "    <div style=\"margin-bottom: 20px\"><span id=\"z_title\" style=\"color:black;\">选择要屏蔽的图</span></div>\n" +
        "    <table id=\"z_table\" border=\"0\" style=\"width: 100%;border-collapse:collapse;\">\n" +
        "    <!--<table id=\"z_table\" class=\"table\" border=\"0\" >-->\n" +
        "        <tr>\n" +
        "            <td style=\"width: 200px;\"><div style=\"color:black;\">全选</div>\n" +
        "                <input type=\"checkbox\" id=\"z_all\"/></td>\n" +
        "            <td style=\"width: 200px;\"></td>\n" +
        "            <td style=\"width: 80px;\"></td>\n" +
        "        </tr>\n" +
        "    </table>\n" +
        "</div>");

    let imageMap = getImageMap()
    for (let key of imageMap.keys()) {
        let value = imageMap.get(key);
        let tr = `<tr>
             <td style="width: 200px;"><input type="checkbox" id="${key}" class="hp-cbx"/></td>
             <td><img src="${value}" height="50px"/></td>
             <td><button class="btn btn-default z_img_del_btn">删除</button></td>
            </tr>`
        $("#z_table").append(tr)
    }

    let divStyle = $("#setting1").attr("style");
    if (isPC) {
        divStyle = divStyle + ";max-height: 666px;"
    } else {
        divStyle = divStyle + ";max-height: 600px;"
    }
    $("#setting1").attr("style", divStyle);
    $("#z_all").each(function (i, e) {
        $(e).click(function () {
            if (e.checked) {
                $(".hp-cbx").prop("checked", false);
            } else {
                $(".hp-cbx").prop("checked", true);
            }
            $(".hp-cbx").trigger("click");
        })
    })

    $("td").each(function (i, e) {
        let style = $(e).attr("style") ? $(e).attr("style") : "";
        $(e).attr("style", style + "border-bottom :1px solid black;")
    })

    $(".z_img_del_btn").each(function (i, e) {
        $(e).click(function () {
            let url = $(this).parent().parent().find("img").first().attr("src");
            // 删除屏蔽备选图
            deleteShowImage(url)
            // 删除屏蔽id
            deleteBlockId(url)

            $(this).parent().parent().remove();
        })
    })
}

function clearUI() {
    $("#setting1").remove();
    $("#setting3").remove();
}

function settingSmall() {
    let smallAll = GM_getValue(GM_KEY_SMALL_ALL, false);
    let title = smallAll ? "此操作将恢复回复图片正常大小" : "此操作将缩小回复中的所有图片";
    let r = window.confirm(title);
    if (r) {
        GM_setValue(GM_KEY_SMALL_ALL, !smallAll);
        location.reload();
    }

}


//手动添加
function settingAdd() {
    if (curElemnt !== null) {
        var nodetype = curElemnt.nodeName.toUpperCase();
        if (nodetype === "IMG"){
            var imgsrc =  $(curElemnt).attr("src");
            addShowImage(imgsrc)
            //更新屏蔽id
            addBlockId(imgsrc)
            location.reload();
            return;
        }
    }
    clearUI();
    $("body").append("<div id=\"setting3\" style='right: 10px;top: 100px;background: #f8f8f8;overflow: auto;overflow-x:hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 300px;border-radius: 4px;border-style:solid;\n" +
        " border-width:1px; border-color:black;'>\n" +
        "    <form>\n" +
        "        <div class=\"form-group\">\n" +
        "            <label for=\"z_input_img\">图片链接</label>\n" +
        "            <div><img alt = \"img\" id=\"z_img\" src=\"\" style=\"max-height: 100px\" hidden/></div>\n" +
        "            <input type=\"text\" class=\"form-control\" id=\"z_input_img\" placeholder=\"图片链接\">\n" +
        "            <label id=\"z_input_img_err\" style=\"color:red\" hidden>图片链接无效</label>\n" +
        "        </div>\n" +
        "        <button type=\"submit\" id=\"z_submit\" class=\"btn btn-default\">添加</button>\n" +
        "    </form>\n" +
        "</div>");

    $("#z_input_img").blur(function () {
        checkValid()
    })

    $("#z_submit").click(function () {
        let valid = checkValid();
        if (valid) {
            //保存url到配置中，插入到前面
            let value = $("#z_input_img").val();
            addShowImage(value)
            //更新屏蔽id
            addBlockId(value)

            $("#setting3").remove();
            location.reload();
        }
    })


    function checkValid() {
        let value = $("#z_input_img").val();
        if (!value.includes("http")) {
            $("#z_img").attr("hidden", true);
            $("#z_input_img_err").attr("hidden", false);
            return false;
        } else if (!checkImgSuffix(value)) {
            $("#z_img").attr("hidden", true);
            $("#z_input_img_err").attr("hidden", false);
            return false;
        } else {
            $("#z_input_img_err").attr("hidden", true);
            $("#z_img").attr("src", value);
            $("#z_img").attr("hidden", false);
            return true;
        }
    }
}

function settingReset() {
    let r = window.confirm("此操作将重置所有的配置！");
    if (r) {
        GM_deleteValue(GM_KEY_SHOW_IMAGE);
        GM_deleteValue(GM_KEY_BLOCK_ID);
        GM_deleteValue(GM_KEY_SMALL_ALL);
        GM_deleteValue(GM_KEY_BLOCK_ALL);
        location.reload();
    }
}

//屏蔽全站图片
function settingBockAll() {
    let blockAll = GM_getValue(GM_KEY_BLOCK_ALL, false);
    let title = blockAll ? "此操作将显示回复中的图片" : "此操作将屏蔽回复中的所有图片";
    let r = window.confirm(title);
    if (r) {
        GM_setValue(GM_KEY_BLOCK_ALL, !blockAll);
        location.reload();
    }
}

function settingRemote() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://gitee.com/zhvxiao/tm_config/raw/master/hupu.txt",
        headers: {
            "Content-Type": "text/plain; charset=utf-8"
        },
        onload: function (response) {
            console.log("请求官方屏蔽配置成功");
            // console.log(response.responseText);
            mergeBlockImage(response.responseText)
        },
        onerror: function (response) {
            console.log("请求官方屏蔽配置失败");
        }
    })
}

function mergeBlockImage(iamgestext) {
    //     按照换行分割
    let images = iamgestext.split("\n");
    addShowImage(...images)
    addBlockId(...images)

    location.reload()
}

function addBlockId(...urls) {
    let checkIds = new Set(GM_getValue(GM_KEY_BLOCK_ID, []));
    for (let url of urls) {
        //更新屏蔽id
        let idImage = getImageAndId(url)
        if (idImage[0] !== "") {
            checkIds.add(idImage[0]);
        }
    }
    GM_setValue(GM_KEY_BLOCK_ID, Array.from(checkIds));
}

function deleteBlockId(...urls) {
    let checkIds = new Set(GM_getValue(GM_KEY_BLOCK_ID, []));
    for (let url of urls) {
        //更新屏蔽id
        let idImage = getImageAndId(url)
        if (idImage[0] !== "") {
            checkIds.delete(idImage[0]);
        }
    }
    GM_setValue(GM_KEY_BLOCK_ID, Array.from(checkIds));
}

function getBlockId() {
    return new Set(GM_getValue(GM_KEY_BLOCK_ID, []));
}

function setBlockId(ids) {
    GM_setValue(GM_KEY_BLOCK_ID, Array.from(ids));
}

function getImageMap() {
    let allIamges = GM_getValue(GM_KEY_SHOW_IMAGE, []);
    let imageMap = new Map();
    for (let image of allIamges) {
        let idImage = getImageAndId(image);
        if (idImage[0] !== "") {
            imageMap.set(idImage[0], idImage[1]);
        }
    }
    return imageMap;
}

function addShowImage(...images) {
    let allIamges = GM_getValue(GM_KEY_SHOW_IMAGE, []);
    let imageMap = getImageMap();

    for (let img of images) {
        let id = getImageAndId(img)[0]
        if (id !== "" && !imageMap.has(id)) {
            // 排在最前面
            allIamges.splice(0, 0, img)
        }
    }
    GM_setValue(GM_KEY_SHOW_IMAGE, allIamges);
}

function deleteShowImage(image) {
    let allIamges = new Set(GM_getValue(GM_KEY_SHOW_IMAGE, []));
    allIamges.delete(image)
    GM_setValue(GM_KEY_SHOW_IMAGE, Array.from(allIamges));
}

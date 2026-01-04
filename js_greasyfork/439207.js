// ==UserScript==
// @name         btsync 1.4.111 批量添加 Key
// @namespace    https://userscript.snomiao.com/
// @version      0.4.1
// @description  在添加Key左边增加一个按钮，功能为批量添加Key
// @author       snomiao@gmail.com
// @match        http://localhost:8888/gui/
// @match        http://127.0.0.1:8888/gui/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439207/btsync%2014111%20%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/439207/btsync%2014111%20%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%20Key.meta.js
// ==/UserScript==

function 睡(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function 转WIN路径为WSL路径(path) {
    return path.replace(
        /^([A-Z]):(.*)/,
        (a, disk, path) =>
            `/mnt/${ 
            disk.toLowerCase() 
            }/${ 
            path
                .split("\\")
                .filter((e) => e)
                .join("/")}`
    );
}
var { app } = window;
async function 尝试到(ms, fn) {
    let ret;
    const t = +new Date();
    while (!(ret = await fn()))
        if (+new Date() > t + ms) throw "TimeOut";
        else await 睡(1);
    return ret;
}
async function 等元素(ms, sel, el = document) {
    return await 尝试到(ms, () => el.querySelector(sel));
}
async function 等元素消失(ms, sel, el = document) {
    return await 尝试到(ms, () => !el.querySelector(sel));
}
// function 绑定Click到元素(f, 元素) {
//     return (元素.addEventListener("click", f), 元素);
// }
function 新元素(innerHTML, attributes = {}) {
    return Object.assign(
        Object.assign(document.createElement("div"), { innerHTML }).children[0],
        attributes
    );
}
function 解析行(line) {
    var m = line.trim().match(/^(\S*?(\b[A|B][0-9A-Z]{32}\b))$/);
    m = m || line.trim().match(/^(\S*?)\s+#?(\b[A|B][0-9A-Z]{32}\b)$/);
    return (m && { path: 转WIN路径为WSL路径(m[1]), key: m[2] }) || null;
}
async function 异步循环(fn, array) {
    for (let index = 0; index < array.length; index++) {
        await fn(array[index], index, array);
    }
}
async function 批量添加行(text) {
    var lines = text.split(/\r?\n/).filter((e) => e);
    var objs = lines.map(解析行).filter((e) => e);
    console.debug("正在添加Keys：", objs);
    await 异步循环(模拟操作添加Key, objs);
}
// async function 打开添加KeyPath窗口() {
//     var enterKeyDialog = new app.view.EnterKey({
//         addFolderView: app.addFolderView,
//     }); // we need to pass a reference to addFolderView to EnterKey
//     var child = enterKeyDialog.insert();
//     child.open();
//     return await 尝试到(60e3, () => child.el);
// }
async function 模拟操作添加Key({ key, path }) {
    console.log("正在添加：", key, path);
    console.debug("正在", "await 等元素消失(60e3, `.modal-backdrop.fade.in`);");
    await 等元素消失(60e3, `.modal-backdrop.fade.in`);
    console.debug(
        "正在",
        'await 等元素消失(60e3, `#add-folder-dialog[aria-hidden="false"]`);'
    );
    await 等元素消失(60e3, `#add-folder-dialog[aria-hidden="false"]`);
    console.debug(
        "正在",
        'await 等元素消失(60e3, `#enter-key-dialog[aria-hidden="false"]`);'
    );
    await 等元素消失(60e3, `#enter-key-dialog[aria-hidden="false"]`);
    // var panel = await 打开添加KeyPath窗口();
    await 睡(200);
    console.debug(
        +new Date() / 1000,
        "正在",
        "(await 等元素(60e3, `#enter-link-button`)).click();"
    );
    (await 等元素(60e3, `#enter-link-button`)).click();
    await 睡(200);
    console.debug(
        +new Date() / 1000,
        "正在",
        "(await 等元素(60e3, `#enter-key-key`)).value = key;"
    );
    (await 等元素(60e3, `#enter-key-key`)).value = key;
    await 睡(200);
    console.debug(
        +new Date() / 1000,
        "正在",
        "(await 等元素(60e3, `#enter-key-next`)).click();"
    );
    (await 等元素(60e3, `#enter-key-next`)).click();
    await 睡(200);
    console.debug(
        +new Date() / 1000,
        "正在",
        '(await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-directory`)).value = path;'
    );
    (
        await 等元素(
            60e3,
            `#add-folder-dialog[aria-hidden="false"] #add-directory`
        )
    ).value = path;
    // await 睡(200);
    console.debug(
        +new Date() / 1000,
        "正在",
        '(await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-ok.btn`)).click();'
    );
    (
        await 等元素(
            60e3,
            `#add-folder-dialog[aria-hidden="false"] #add-ok.btn`
        )
    ).click();
    await 睡(200);

    await 睡(200);
    console.debug(
        +new Date() / 1000,
        "正在",
        'const 错误提示元素 = (await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-error`));'
    );
    const 错误提示元素 = await 等元素(
        60e3,
        `#add-folder-dialog[aria-hidden="false"] #add-error`
    );
    const 错误 = await 尝试到(60e3, () => 错误提示元素.innerText);
    console.error("btsync-batch err:", 错误);
    await 睡(200);
    console.debug(
        +new Date() / 1000,
        "正在",
        '(await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-cancel`)).click();'
    );
    (
        await 等元素(
            60e3,
            `#add-folder-dialog[aria-hidden="false"] #add-cancel`
        )
    ).click();
    await 睡(200);
    console.debug(
        +new Date() / 1000,
        "正在",
        'await 等元素消失(60e3, `#add-folder-dialog[aria-hidden="false"]`);'
    );
    await 等元素消失(60e3, `#add-folder-dialog[aria-hidden="false"]`);
    return true;

    // var keyElement = await Promise.race([
    //     等元素(60e3, `#confirm-dialog[aria-hidden="false"] #okButton`),
    //     等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-error`),
    // ]);
    // console.log(keyElement)
    // if (keyElement.id == "add-error") {
    // }
    // throw 'X';
    // await 睡(200);
    // console.debug(+new Date() / 1000, '正在', 'const 错误提示元素 = (await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-error`));');
    // const 错误提示元素 = (await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-error`));
    // const 错误 = await 尝试到(60e3, () => 错误提示元素.innerText);
    // console.error("btsync-batch err:", 错误);
    // await 睡(200);
    // console.debug(+new Date() / 1000, '正在', '(await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-cancel`)).click();');
    // (await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-cancel`)).click();
    // await 睡(200);
    // console.debug(+new Date() / 1000, '正在', 'await 等元素消失(60e3, `#add-folder-dialog[aria-hidden="false"]`);');
    // await 等元素消失(60e3, `#add-folder-dialog[aria-hidden="false"]`);
    // return true
    // var re = await Promise.race([
    //     (async () => {
    //         await 睡(100);
    //         console.debug(
    //             +new Date() / 1000,
    //             '正在',
    //             '(await 等元素(60e3, `#confirm-dialog[aria-hidden="false"] #okButton`)).click();'
    //         );
    //         (
    //             await 等元素(
    //                 60e3,
    //                 `#confirm-dialog[aria-hidden="false"] #okButton`
    //             )
    //         ).click();
    //         console.info('已覆盖');
    //         return true;
    //     })(),
    //     (async () => {
    //         await 睡(200);
    //         console.debug(
    //             +new Date() / 1000,
    //             '正在',
    //             'const 错误提示元素 = (await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-error`));'
    //         );
    //         const 错误提示元素 = await 等元素(
    //             60e3,
    //             `#add-folder-dialog[aria-hidden="false"] #add-error`
    //         );
    //         const 错误 = await 尝试到(60e3, () => 错误提示元素.innerText);
    //         console.error('btsync-batch err:', 错误);
    //         await 睡(200);
    //         console.debug(
    //             +new Date() / 1000,
    //             '正在',
    //             '(await 等元素(60e3, `#add-folder-dialog[aria-hidden="false"] #add-cancel`)).click();'
    //         );
    //         (
    //             await 等元素(
    //                 60e3,
    //                 `#add-folder-dialog[aria-hidden="false"] #add-cancel`
    //             )
    //         ).click();
    //         await 睡(200);
    //         console.debug(
    //             +new Date() / 1000,
    //             '正在',
    //             'await 等元素消失(60e3, `#add-folder-dialog[aria-hidden="false"]`);'
    //         );
    //         await 等元素消失(60e3, `#add-folder-dialog[aria-hidden="false"]`);
    //         return true;
    //     })(),
    //     // 睡(40000)
    // ]);
    // var ret = re || console.error('btsync-batch err: 超时 at', path);
    // console.log(ret);
    // return ret;
}
// test_模拟操作添加Key()
async function openBatch添加KeyPath() {
    var enterKeyDialog = new app.view.EnterKey({
        addFolderView: app.addFolderView,
    }); // we need to pass a reference to addFolderView to EnterKey
    var child = enterKeyDialog.insert();
    child.open();
    var el = await 尝试到(60e3, () => child.el);
    (
        await 等元素(60e3, ".modal-header h2", el)
    ).innerHTML = `Enter a group of /path #key`;
    (await 等元素(60e3, ".modal-body", el)).innerHTML = `
    <div class="form-group">
        <label for="keyInput">{{#}}</label>
        <div class="input-group">
            <textarea id="enter-list-path-key" type="text" class="form-control"></textarea>
            <br>
            <br>
            <div class="input-group-btn">
                <button id="enter-list-path-key-go" class="btn btn-primary" type="button" style="min-height: 40rem;">Go</button>
            </div>
        </div>
    </div>`;
    el.querySelector(
        ".modal-body label"
    ).innerHTML = `Input your /path #key split in lines`;
    var textarea = el.querySelector(".modal-body textarea");
    textarea.style.lineHeight = "1em";
    textarea.style.minHeight = "40rem";
    textarea.style.fontSize = "1.2rem";
    textarea.placeholder = `
#key is in path:
/path/to/folder#AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/path/to/folder#BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/path/to/folder@AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/path/to/folder@BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
C:\\path\\to\\folder#AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
C:\\path\\to\\folder#BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
C:\\path\\to\\folder@AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
C:\\path\\to\\folder@BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

#key is not in path:
/path/to/folder AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/path/to/folder BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/path/to/folder #AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
/path/to/folder #BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
C:\\path\\to\\folder AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
C:\\path\\to\\folder BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
C:\\path\\to\\folder #AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
C:\\path\\to\\folder #BXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        `.trim();
    // var textarea = el.querySelector(".modal-body textarea");
    (await 等元素(60e3, ".modal-body button", el)).addEventListener(
        "click",
        async () => {
            (await 等元素(60e3, ".modal-header button.close", el)).click();
            批量添加行(textarea.value);
        }
    );
}

async function addBatchAddButton() {
    console.log("启动");
    function 尝试移除元素(e) {
        return e && e.parentElement.removeChild(e);
    }
    尝试移除元素(document.querySelector("#batch-enter-link-button"));
    var 栏 = await 等元素(60e3, "#topButtons");
    var 单个添加按钮 = await 等元素(60e3, "#enter-link-button", 栏);
    var 批量添加按钮 = 新元素(
        `
                <a  id="batch-enter-link-button" 
                    role="button"
                    class="btn btn-naked"
                    title=""
                    data-original-title="Enter a group of /path #key"
                    style="background: repeating-linear-gradient(45deg, black, transparent 100px);">
                    <span class="mycon mycon-enterlink-naked"></span>
                </a>`,
        { onclick: openBatch添加KeyPath }
    );
    栏.insertBefore(批量添加按钮, 单个添加按钮);
}
addBatchAddButton();

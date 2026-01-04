// ==UserScript==
// @name        编程猫发帖助手
// @namespace   https://shequ.codemao.cn/user/15753247
// @match       *://shequ.codemao.cn/community*
// @grant       none
// @icon        https://shequ.codemao.cn/favicon.ico
// @version     0.1.0-2023.08.06
// @author      smyluke
// @license     MIT
// @description 编程猫论坛发帖辅助工具，包含防屏蔽、MarkDown、HTML、帖子更新、帖子协作等功能
// @require     https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/472554/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%8F%91%E5%B8%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/472554/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%8F%91%E5%B8%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
'use strict';

const SERVER = 'https://smyluke.pythonanywhere.com',
    HOST = 'smyluke.pythonanywhere.com',
    BOARD_DATA = {
        "热门活动": 17,
        "积木编程乐园": 2,
        "工作室&师徒": 10,
        "你问我答": 5,
        "神奇代码岛": 3,
        "图书馆": 6,
        "CoCo应用创作": 27,
        "Python乐园": 11,
        "源码精灵": 26,
        "NOC编程猫比赛": 13,
        "灌水池塘": 7,
        "通天塔": 4,
        "训练师小课堂": 28
    },
    GET_FORUM_DATA = 'getForumData',
    SET_DATA = 'setData',
    version = 'v0.1.0-2023.08.06';

setTimeout(() => {
    try {
        const optionsDiv = document.querySelector('.r-community-c-forum_sender--bottom_options'),
            forumEditDiv = optionsDiv.parentNode.children[2],
            forumTypeDiv = document.createElement('div'),
            sendButton = document.createElement('a'),
            saveButton = document.createElement('a'),
            manageButton = document.createElement('a'),
            tokenInput = document.createElement('input'),
            idInput = document.createElement('input'),
            space = document.createElement('span'),
            forumTypeSelectButton_richText = document.createElement('div'),
            forumTypeSelectButton_markDown = document.createElement('div'),
            forumTypeSelectButton_HTML = document.createElement('div'),
            markDownEdit = document.createElement('iframe'),
            HTMLEdit = document.createElement('iframe'),
            css = document.createElement('style'),
            help = document.createElement('div'),
            helpShowMoreButton = document.createElement('a'),
            manageBoard = document.createElement('div'),
            manager = new ForumManager(localStorage, manageBoard);
        let helpShowMore = true;

        globalThis.CodemaoForumHelper_forumManager = manager;

        optionsDiv.innerHTML = '';

        tokenInput.classList.add('infoInput');
        tokenInput.placeholder = '帖子token';
        optionsDiv.appendChild(tokenInput);
        space.innerHTML = '&nbsp;'.repeat(20);
        optionsDiv.appendChild(space);
        idInput.classList.add('infoInput');
        idInput.placeholder = '帖子id';
        optionsDiv.appendChild(idInput);

        optionsDiv.appendChild(document.createElement('br'));

        sendButton.innerText = '发布';
        saveButton.innerText = '保存';
        manageButton.innerText = '管理';
        sendButton.classList.add('r-community-c-forum_sender--option');
        saveButton.classList.add('r-community-c-forum_sender--option');
        manageButton.classList.add('r-community-c-forum_sender--option');
        optionsDiv.appendChild(sendButton);
        optionsDiv.appendChild(saveButton);
        optionsDiv.appendChild(manageButton);

        help.style.marginLeft = help.style.marginRight = '50px';
        helpShowMoreButton.style.color = '#5AD9AA';
        helpShowMoreButton.style.fontWeight = 'bold';
        helpShowMoreButton.onclick = () => {
            if (helpShowMore) {
                help.innerHTML = `当前版本：${version}
<br>
注意事项：
<br>
1.MarkDown/HTML类型帖子完全使用Editor.md的语法，支持流程图、表格、目录、TeX等……
<br>
`;
                helpShowMoreButton.innerText = '展开 ∨';
                help.appendChild(helpShowMoreButton);
            } else {
                help.innerHTML = `当前版本：${version}
<br>
注意事项：
<br>
1.MarkDown/HTML类型帖子完全使用Editor.md的语法，支持流程图、表格、目录、TeX等，具体语法参考<a href="http://editor.md.ipandao.com/" style="color: #2cc9ff" target="_blank">这里</a>；
<br>
2.MarkDown/HTML中的表情可能会无法加载；
<br>
3.帖子token自动随机生成，相当于是帖子的密码，帖子的编辑不限账号，只需要有token和id就可以；
<br>
4.插件自带帖子管理器，会自动记录使用过的token和id；
<br>
5.请不要在帖子中进行xss注入或发布违规内容，违者会对帖子进行删除，情节严重或多次违规将封禁ip；
<br>
6.发布帖子时若帖子未创建，会自动进行创建；
<br>
7.开启编创协MarkDown编辑器等其它插件可能会产生不兼容等情况，如遇到问题请先尝试关闭除本插件外的所有插件。
<br>
8.开启AdGuard等防广告扩展可能会对MarkDown/HTML的部分图标进行屏蔽。
<br>
`;
                helpShowMoreButton.innerText = '\n收起 ∧';
                help.appendChild(helpShowMoreButton);
            }
            helpShowMore = !helpShowMore;
        }
        helpShowMoreButton.click();
        optionsDiv.parentNode.appendChild(help);

        forumTypeDiv.classList.add('r-community-c-forum_sender--type_select');
        forumEditDiv.insertBefore(forumTypeDiv, forumEditDiv.children[1]);
        forumTypeSelectButton_richText.innerText = '富文本';
        forumTypeSelectButton_markDown.innerText = 'MarkDown/HTML';
        forumTypeSelectButton_HTML.innerText = 'HTML';
        forumTypeDiv.appendChild(forumTypeSelectButton_richText);
        forumTypeDiv.appendChild(forumTypeSelectButton_markDown);
        forumTypeDiv.appendChild(forumTypeSelectButton_HTML);
        forumTypeSelectButton_richText.style.color = 'red';
        forumTypeSelectButton_richText.style.borderColor = 'red';

        markDownEdit.src = `${SERVER}/static/MDEdit.html`;
        markDownEdit.style.display = 'none';
        markDownEdit.style.height = '600px';
        markDownEdit.style.width = '100%';
        markDownEdit.id = 'markDownEdit';
        document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").appendChild(markDownEdit);

        HTMLEdit.src = `${SERVER}/static/HTMLEdit.html`;
        HTMLEdit.style.display = 'none';
        HTMLEdit.style.height = '600px';
        HTMLEdit.style.width = '100%';
        HTMLEdit.id = 'HTMLEdit';
        document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").appendChild(HTMLEdit);

        document.querySelector(".c-model_box--content_wrap > div").appendChild(manageBoard)
        manager.elementInit();

        forumTypeSelectButton_richText.onclick = () => {
            document.querySelector(".r-community-c-forum_sender--container").style.width = '856px';
            forumTypeSelectButton_markDown.style.color = 'black';
            forumTypeSelectButton_markDown.style.borderColor = 'black';
            forumTypeSelectButton_HTML.style.color = 'black';
            forumTypeSelectButton_HTML.style.borderColor = 'black';
            forumTypeSelectButton_richText.style.color = 'red';
            forumTypeSelectButton_richText.style.borderColor = 'red';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[0].style.display = 'block';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[1].style.display = 'none';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[2].style.display = 'none';
        };

        forumTypeSelectButton_markDown.onclick = () => {
            document.querySelector(".r-community-c-forum_sender--container").style.width = 'auto';
            forumTypeSelectButton_richText.style.color = 'black';
            forumTypeSelectButton_richText.style.borderColor = 'black';
            forumTypeSelectButton_HTML.style.color = 'black';
            forumTypeSelectButton_HTML.style.borderColor = 'black';
            forumTypeSelectButton_markDown.style.color = 'red';
            forumTypeSelectButton_markDown.style.borderColor = 'red';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[1].style.display = 'block';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[0].style.display = 'none';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[2].style.display = 'none';
        };

        forumTypeSelectButton_HTML.onclick = () => {
            document.querySelector(".r-community-c-forum_sender--container").style.width = 'auto';
            forumTypeSelectButton_richText.style.color = 'black';
            forumTypeSelectButton_richText.style.borderColor = 'black';
            forumTypeSelectButton_markDown.style.color = 'black';
            forumTypeSelectButton_markDown.style.borderColor = 'black';
            forumTypeSelectButton_HTML.style.color = 'red';
            forumTypeSelectButton_HTML.style.borderColor = 'red';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[2].style.display = 'block';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[0].style.display = 'none';
            document.querySelector(".r-community-c-forum_sender--container > div:nth-child(3)").children[1].style.display = 'none';
        };

        document.querySelector("div.r-community-c-forum_sender--container > div:nth-child(1) > input").placeholder = '【发帖关键字】请输入标题（50字符以内）';

        sendButton.onclick = async () => {
            await sendForum(tokenInput, idInput, forumTypeSelectButton_richText, forumTypeSelectButton_markDown, markDownEdit, HTMLEdit);
        };
        saveButton.onclick = async () => {
            await saveForum(tokenInput, idInput, forumTypeSelectButton_richText, forumTypeSelectButton_markDown, markDownEdit, HTMLEdit);
        };
        manageButton.onclick = () => {
            manager.display();
        };

        css.innerHTML = `
.r-community-c-forum_sender--option {
    margin: 30px;
}

.r-community-c-forum_sender--type_select {
    width: 100%;
    height: 35px;
    margin-bottom: 20px;
    text-align: center;
}

.r-community-c-forum_sender--type_select:hover {
    font-size: 15px;
    cursor: pointer;
}

.r-community-c-forum_sender--type_select > div {
    display: inline-block;
    width: 32%;
    height: 100%;
    border-style: solid;
    border-color: hsla(0,0%,40%,.28);
    border-width: 1px;
    border-radius: 4px;
    margin: 5px;
    text-align: center;
    line-height: 35px;
    font-size: 15px;
}

.infoInput {
    padding: 5px;
    border-style: solid;
    border-width: 2px !important;
    border-color: rgba(128,128,128,0.5);
    width: 200px;
    align-self: center;
}

.infoInput:focus {
    border-color: black;
}

.forum:hover {
    background-color: rgba(252,194,51,0.5);
}

.forumSelect {
    background-color: rgba(252,194,51,0.8) !important;
}

.forumManagerButton {
    display: inline-block;
    text-align: center;
    width: 100px;
    padding: 5px 0;
    background: #fec433;
    border-radius: 4px;
    color: #fff;
    margin: 15px;
}

.forumManagerButton:hover {
    color: white;
    background: #ffbb10
}

.lockedButton {
    background-color: #cccc !important;
    color: #000 !important;
    cursor: default;
}
    `;
        document.head.appendChild(css);

        console.log('----- 编程猫发帖助手 运行成功 -----');
    } catch (e) {

    }
}, 3000);

class Forum {
    constructor(token, id, name, type, time) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.type = type;
        this.time = time;
    }

    async updateInfo(name, type, token) {
        this.token = token;
        axios({
            method: 'POST',
            url: SERVER + '/forum/update/info',
            data: {
                id: this.id,
                token: this.token,
                title: name,
                type: type
            }
        }).then(res => {
            if (res.status === 201) {
                this.time = new Date().valueOf();
                this.name = name;
                this.type = type;
                CodemaoForumHelper_forumManager.save();
                return true;
            } else {
                err(res);
                return false;
            }
        });
    }

    get data() {
        return {
            token: this.token,
            id: this.id,
            name: this.name,
            type: this.type,
            time: this.time
        };
    }

    elementShow(parent) {
        const element = document.createElement('div');
        element.classList.add('forum');
        element.style.width = '100%';
        element.style.height = '10%';
        element.style.padding = '2%';
        element.style.borderStyle = 'solid';
        element.style.borderColor = 'rgba(0,0,0,0.45)';
        element.style.borderWidth = '1px';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'bold';
        element.style.whiteSpace = 'pre';
        element.innerText = `${this.id}    ${this.name}\n${new Date(this.time).toLocaleString()}     ${['富文本', 'MarkDown/HTML', 'HTML'][this.type]}`;
        element.forum = this;
        parent.appendChild(element);
        return element;
    }
}

class ForumManager {
    constructor(storage, element) {
        this.storage = storage;
        this.element = element;
        this.forums = [];
        if (!storage.getItem('CodemaoForumHelperData')) storage.setItem('CodemaoForumHelperData', '[]');
        for (const forum of JSON.parse(storage.getItem('CodemaoForumHelperData'))) this.forums.push(new Forum(forum['token'], forum['id'], forum['name'], forum['type'], forum['time']));
    }

    elementInit() {
        this.element.style.display = 'none';
        this.element.style.width = '110%';
        this.element.style.height = '70%';
        this.element.style.borderRadius = '4px';
        this.element.style.position = 'absolute';
        this.element.style.top = '50%';
        this.element.style.left = '50%';
        this.element.style.transform = 'translate(-50%,-50%)';
        this.element.style.zIndex = '2';
        this.element.style.background = '#fff';
        this.element.style.boxShadow = '0 6px 28px 0 rgba(0,0,0,.12)'
        this.mask = document.createElement('div');
        this.mask.style.display = 'none';
        this.mask.style.position = 'absolute';
        this.mask.style.top = this.mask.style.bottom = this.mask.style.left = this.mask.style.right = '0';
        this.mask.style.background = 'rgba(0,0,0,0.3)';
        this.element.parentElement.appendChild(this.mask);
        this.closeButton = document.createElement('a');
        this.closeButton.style.position = 'absolute';
        this.closeButton.style.right = '20px';
        this.closeButton.style.top = '10px';
        this.closeButton.style.padding = '10px'
        this.element.appendChild(this.closeButton);
        this.closeIcon = document.createElement('i');
        this.closeIcon.style.background = 'url(https://cdn-community.codemao.cn/community_frontend/asset/bind_phone_close_9b02e.svg) no-repeat -5px -5px';
        this.closeIcon.style.width = this.closeIcon.style.height = '14px';
        this.closeIcon.style.display = 'inline-block';
        this.closeButton.appendChild(this.closeIcon);
        this.closeButton.close = this.close;
        this.closeButton.onclick = () => {
            this.close();
        };
        this.forumShowBox = document.createElement('div');
        this.forumShowBox.id = 'forumShowBox';
        this.forumShowBox.style.borderStyle = 'solid';
        this.forumShowBox.style.borderColor = 'rgba(0,0,0,0.45)';
        this.forumShowBox.style.borderWidth = '1px';
        this.forumShowBox.style.width = '40%';
        this.forumShowBox.style.height = '80%';
        this.forumShowBox.style.margin = '5%';
        this.forumShowBox.style.overflowY = 'auto';
        this.forumShowBox.style.display = 'inline-block';
        this.element.appendChild(this.forumShowBox);
        for (const forum of this.forums) forum.elementShow(this.forumShowBox).onclick = ({srcElement}) => {
            this.forumOnclick(srcElement);
        };
        this.selectedForum = null;
        this.optionsDiv = document.createElement('div');
        this.optionsDiv.style.width = '45%'
        this.optionsDiv.style.height = '100%';
        this.optionsDiv.style.position = 'absolute';
        this.optionsDiv.style.top = '50px';
        this.optionsDiv.style.display = 'inline-block';
        this.element.appendChild(this.optionsDiv)
        this.tokenInput = document.createElement('input');
        this.tokenInput.classList.add('infoInput');
        this.tokenInput.placeholder = '帖子token';
        this.optionsDiv.appendChild(this.tokenInput);
        this.space = document.createElement('span');
        this.space.innerHTML = '&nbsp;'.repeat(5);
        this.optionsDiv.appendChild(this.space);
        this.idInput = document.createElement('input');
        this.idInput.classList.add('infoInput');
        this.idInput.placeholder = '帖子id';
        this.optionsDiv.appendChild(this.idInput);
        this.newForumButton = document.createElement('a');
        this.openButton = document.createElement('a');
        this.deleteButton = document.createElement('a');
        this.newForumButton.innerText = '添加';
        this.openButton.innerText = '打开';
        this.deleteButton.innerText = '删除';
        this.newForumButton.classList.add('forumManagerButton');
        this.openButton.classList.add('forumManagerButton');
        this.deleteButton.classList.add('forumManagerButton');
        this.openButton.classList.add('lockedButton');
        this.deleteButton.classList.add('lockedButton');
        this.newForumButton.onclick = () => CodemaoForumHelper_forumManager.newForumButtonOnclick();
        this.openButton.onclick = () => CodemaoForumHelper_forumManager.openButtonOnclick();
        this.deleteButton.onclick = () => CodemaoForumHelper_forumManager.deleteButtonOnclick();
        this.optionsDiv.appendChild(this.newForumButton);
        this.optionsDiv.appendChild(this.openButton);
        this.optionsDiv.appendChild(this.deleteButton);
    }

    forumOnclick(element) {
        this.selectedForum && this.selectedForum.classList.remove('forumSelect');
        this.selectedForum = element;
        element.classList.add('forumSelect');
        this.openButton.classList.remove('lockedButton');
        this.deleteButton.classList.remove('lockedButton');
        this.tokenInput.value = element.forum.token;
        this.idInput.value = element.forum.id;
    }

    display() {
        this.element.style.display = 'inline-block';
        this.mask.style.display = 'inline-block';
    }

    close() {
        this.element.style.display = 'none';
        this.mask.style.display = 'none';
    }

    appendForum(token, id, name, type) {
        for (const f of this.forums) if (f.id === id) return [f, false];
        const time = new Date().valueOf(),
            forum = new Forum(token, id, name, type, time);
        this.forums.push(forum);
        forum.elementShow(this.forumShowBox).onclick = ({srcElement}) => {
            this.forumOnclick(srcElement);
        };
        this.save();
        return [forum, true];
    }

    save() {
        this.storage.setItem('CodemaoForumHelperData', JSON.stringify(this.data));
    }

    async newForumButtonOnclick() {
        if (this.tokenInput.value && this.idInput.value) {
            const res = await getForumInfo(this.idInput.value);
            if (res.status === 200) {
                const result = this.appendForum(this.tokenInput.value, this.idInput.value, res.data[1], res.data[2]);
                if (!result[1]) alert('帖子已存在！');
            } else err(res);
        } else alert('请输入token和id！');
    }

    async openButtonOnclick() {
        if (this.selectedForum) {
            const forum = this.selectedForum.forum;
            document.querySelector("div.r-community-c-forum_sender--container > div:nth-child(1) > input").value = forum.name;
            document.querySelector(".r-community-c-forum_sender--type_select").children[forum.type].click();
            document.querySelector(".r-community-c-forum_sender--bottom_options > input:nth-child(1)").value = forum.token;
            document.querySelector(".r-community-c-forum_sender--bottom_options > input:nth-child(3)").value = forum.id;
            this.close();
            if (forum.type === 0) {
                const res = await getForumData(forum.id);
                if (res.status === 200) {
                    document.querySelector("#react-tinymce-0_ifr").contentDocument.body.innerHTML = res.data;
                } else err(res);
            } else if (forum.type === 1) {
                const res = await waitMessageResponse(document.querySelector('#markDownEdit'), SET_DATA + forum.id);
                if (res.startsWith('error: ')) alert(res);
            } else {
                const res = await waitMessageResponse(document.querySelector('#HTMLEdit'), SET_DATA + forum.id);
                if (res.startsWith('error: ')) alert(res);
            }
        }
    }

    deleteButtonOnclick() {
        if (this.selectedForum) {
            const forum = this.selectedForum;
            forum.remove();
            this.forums = this.forums.filter(f => f !== forum.forum);
            this.save();
            this.selectedForum = null;
            this.openButton.classList.add('lockedButton');
            this.deleteButton.classList.add('lockedButton');
        }
    }

    get data() {
        return this.forums.map(forum => forum.data);
    }
}

function err(res) {
    alert(`错误\n状态码：${res.status}\n错误信息：${res.data}`);
}

function suc(res) {
    alert(`操作成功：${res.data}`);
}

async function waitMessageResponse(iframe, text) {
    return new Promise(resolve => {
        const res = ({data}) => {
            resolve(data);
            removeEventListener('message', res);
        };
        addEventListener('message', res);
        iframe.contentWindow.postMessage(text, '*');
        setTimeout(() => removeEventListener('message', res), 5000);
    });
}

async function saveForum(tokenInput, idInput, forumTypeSelectButton_richText, forumTypeSelectButton_markDown, markDownEdit, HTMLEdit) {
    let type,
        token = tokenInput.value,
        id = parseInt(idInput.value),
        name = document.querySelector("div.r-community-c-forum_sender--container > div:nth-child(1) > input").value,
        data;
    if (forumTypeSelectButton_richText.style.color === 'red') type = 0;
    else if (forumTypeSelectButton_markDown.style.color === 'red') type = 1;
    else type = 2;
    if (type === 0) data = document.querySelector("#react-tinymce-0_ifr").contentDocument.body.innerHTML;
    else if (type === 1) {
        data = await waitMessageResponse(markDownEdit, GET_FORUM_DATA);
    } else {
        data = await waitMessageResponse(HTMLEdit, GET_FORUM_DATA);
    }
    if (token) {
        axios({
            method: 'POST',
            url: SERVER + '/forum/update/data',
            data: {
                id: id,
                token: token,
                data: data
            }
        }).then(async res => {
            suc(res);
            await CodemaoForumHelper_forumManager.appendForum(token, id, name, type)[0].updateInfo(name, type, token);
        }).catch(err);
    } else {
        axios({
            method: 'POST',
            url: SERVER + '/forum/create',
            data: {
                title: name,
                type: type,
                data: data
            }
        }).then(async res => {
            alert('操作成功：创建成功（success-0003）');
            [id, token] = res.data.split(' ');
            tokenInput.value = token;
            idInput.value = id;
            await CodemaoForumHelper_forumManager.appendForum(token, parseInt(id), name, type, token);
        }).catch(err);
    }
}

async function sendForum(tokenInput, idInput, forumTypeSelectButton_richText, forumTypeSelectButton_markDown, markDownEdit, HTMLEdit) {
    let type,
        token = tokenInput.value,
        id = parseInt(idInput.value),
        name = document.querySelector("div.r-community-c-forum_sender--container > div:nth-child(1) > input").value,
        data;
    if (forumTypeSelectButton_richText.style.color === 'red') type = 0;
    else if (forumTypeSelectButton_markDown.style.color === 'red') type = 1;
    else type = 2;
    if (type === 0) data = document.querySelector("#react-tinymce-0_ifr").contentDocument.body.innerHTML;
    else if (type === 1) {
        data = await waitMessageResponse(markDownEdit, GET_FORUM_DATA);
    } else {
        data = await waitMessageResponse(HTMLEdit, GET_FORUM_DATA);
    }
    if (token) {
        axios({
            method: 'POST',
            url: SERVER + '/forum/update/data',
            data: {
                id: id,
                token: token,
                data: data
            }
        }).then(async () => {
            await CodemaoForumHelper_forumManager.appendForum(token, id, name, type)[0].updateInfo(name, type);
            if (getBoardId()) {
                const response = await sendForumApi(name, id, getBoardId());
                if (response.status === 201) {
                    open('https://shequ.codemao.cn/community/' + response.data.id);
                } else err(response);
            } else alert('请选择板块！');
        }).catch(err);
    } else {
        axios({
            method: 'POST',
            url: SERVER + '/forum/create',
            data: {
                title: name,
                type: type,
                data: data
            }
        }).then(async res => {
            [id, token] = res.data.split(' ');
            tokenInput.value = token;
            idInput.value = id;
            await CodemaoForumHelper_forumManager.appendForum(token, parseInt(id), name, type);
            if (getBoardId()) {
                const response = await sendForumApi(name, id, getBoardId());
                if (response.status === 201) {
                    open('https://shequ.codemao.cn/community/' + response.data.id);
                } else err(response);
            } else alert('请选择板块！');
        }).catch(err);
    }
}

async function sendForumApi(title, id, boardId) {
    while (title.length < 5) title += '\u200B';
    return new Promise(resolve => axios({
        method: 'POST',
        url: 'https://api.codemao.cn/web/forums/boards/' + boardId + '/posts',
        data: {
            title: title,
            content: '<iframe src="//' + HOST + '/forum/' + id + '" style="width: 1000px; height: 1000px" allowfullscreen="true"></iframe>'
        },
        withCredentials: true
    }).then(resolve).catch(resolve));
}

function getBoardId() {
    const board = document.querySelector('.r-community-c-forum_sender--active');
    if (board === null) return false;
    return BOARD_DATA[board.innerText];
}

async function getForumInfo(id) {
    return new Promise(resolve => axios({
        method: 'GET',
        url: SERVER + '/forum/info/' + id
    }).then(resolve).catch(resolve));
}

async function getForumData(id) {
    return new Promise(resolve => axios({
        method: 'GET',
        url: SERVER + '/forum/data/' + id
    }).then(resolve).catch(resolve));
}

globalThis._axios = axios;
axios = (arg) => {
    arg.validateStatus = () => true;
    return _axios(arg);
}

for (const key of ['forum_sender_board', 'forum_sender_content', 'forum_sender_title']) {
    localStorage.removeItem(key);
}

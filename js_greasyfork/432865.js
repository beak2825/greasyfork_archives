// ==UserScript==
// @name         TutorDBOps Helper
// @namespace    http://tpdbops.tutorabc.com/
// @version      0.62
// @description  try to improve TutorDBOps
// @author       Tex
// @match        http://tpdbops.tutorabc.com/mysqlmanage/select_*
// @icon         https://www.google.com/s2/favicons?domain=tutorabc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432865/TutorDBOps%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/432865/TutorDBOps%20Helper.meta.js
// ==/UserScript==

(function() {
    const isMssqlPage = location.pathname.includes('mssql');

    const dbopsStorage = {
        prefix: isMssqlPage ? 'dbops-mssql-' : 'dbops-mysql-',
        set:(key, value) => localStorage.setItem(dbopsStorage.prefix+key, value),
        get:(key) => localStorage.getItem(dbopsStorage.prefix+key),
    }
    function addCss(cssString) {
        const head = document.getElementsByTagName('head')[0];
        const newCss = document.createElement('style');
        newCss.type = "text/css";
        newCss.innerHTML = cssString;
        head.appendChild(newCss);
    }
    function loadScript(url, callback) {
        if(!url) return;
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        head.appendChild(script);
        script.src = url;
        script.onload = script.onreadystagechange = function() {
            console.log('loaded:', url);
            callback && callback();
        }
    }

    const searchBtn = document.getElementById("search");
    function submitSql() {
        searchBtn.click();
    }

    function collapse(showLeftArea) {
        // hide sidebar
        const sidebar = document.querySelector("#container > aside");
        sidebar.style.width = showLeftArea? '230px' : '0px';
        sidebar.style.opacity = showLeftArea? '1' : '0';
        sidebar.style['z-index'] = showLeftArea? 'unset' : '-1';
        //  remove right area margin left
        const rightblock = document.querySelector("#container > section");
        rightblock.style['margin-left'] = showLeftArea ? '230px':'0px';
    }

    function aceLoadCallback() {
        ace.config.loadModule('ace/ext/textarea', function(m) {
            const textArea = document.querySelector("form div > textarea");
            m.transformTextarea(textArea, {fontSize: '14px', mode: isMssqlPage ? 'sqlserver':'mysql', theme: 'cobalt', showPrintMargin: false });
        })
    }

    loadScript('https://ajaxorg.github.io/ace-builds/src-noconflict/ace.js', aceLoadCallback);

    const storageVal = dbopsStorage.get('showLeftArea');
    let showLeftArea = storageVal === 'true' ?? true;
    collapse(showLeftArea)

    function toggleRightArea() {
        // toggle state
        showLeftArea = !showLeftArea;
        dbopsStorage.set('showLeftArea',showLeftArea);
        collapse(showLeftArea)
    }

    const hint = document.querySelector("div.box.box-success > form > table > tbody > tr > td:nth-child(2)");
    hint.style.display = 'none';

    const executePlanBtn = document.querySelector("div.box.box-success > form > table > tbody > tr > td:nth-child(1) > div > div > button:nth-child(7)")
    const hostTitle = document.querySelector("form > div.box-header.with-border.table_sort_form > a:nth-child(1) > input");
    const dbTitle = document.querySelector("form > div.box-header.with-border.table_sort_form > a:nth-child(3) > input");
    if(executePlanBtn) executePlanBtn.innerText="查看執行計畫";
    searchBtn.innerText="執行"
    hostTitle.value="主機 (雙擊輸入框清空)"
    dbTitle.value="資料庫"

    const hostSelector = document.querySelector("#doc-vld-post-1");
    const dbSelector = document.querySelector("#doc-vld-level-1")

    const storedHost = dbopsStorage.get('host');
    const storedDB = dbopsStorage.get('db');

    const hosts = Array.from(hostSelector.children).map(e => e.value);
    const hostInput = document.createElement('input');
    hostInput.setAttribute("list", "hostlist");
    hostInput.id='hosts';
    hostInput.name='hosts';
    hostInput.placeholder="請選擇主機";
    hostInput.className="topInput"
    hostInput.ondblclick = (e) => {
        e.target.value='';
    }
    if(storedHost) hostInput.value = storedHost;
    const hostDataList = document.createElement('datalist');
    hostDataList.id = 'hostlist';
    hosts.forEach(e => {
        const op = document.createElement('option');
        op.value = e;
        hostDataList.appendChild(op)
    });

    const hostAnchor = document.querySelector("form > div.box-header.with-border.table_sort_form > a:nth-child(1)");
    hostAnchor.parentNode.insertBefore(hostDataList, hostAnchor.nextSibling);
    hostAnchor.parentNode.insertBefore(hostInput, hostAnchor.nextSibling);

    //hostSelector.remove();
    hostSelector.style.display="none";
    hostSelector.removeAttribute("required");
    hostSelector.name="hh";


    function updateDBInput(val, callback) {
        fetch('http://tpdbops.tutorabc.com/mysqlmanage/ipdbname/'+val)
            .then(r => r.json())
            .then(dbs => {
            dbDataList.replaceChildren(null);
            dbInput.value='';
            dbs.forEach((e, index) => {
                const op = document.createElement('option');
                op.value = e;
                dbDataList.appendChild(op)
            })
            const dbAnchor = document.querySelector("form > div.box-header.with-border.table_sort_form > a:nth-child(5)");
            dbAnchor.parentNode.insertBefore(dbDataList, dbAnchor.nextSibling);
            dbAnchor.parentNode.insertBefore(dbInput, dbAnchor.nextSibling);
            callback();
        })
    }

    const dbInput = document.createElement('input');
    dbInput.setAttribute("list", "dblist");
    dbInput.id='dbs';
    dbInput.name='dbs';
    dbInput.placeholder="請選擇資料庫";
    dbInput.className="topInput"
    dbInput.ondblclick = (e) => {
        e.target.value='';
    }
    if(storedHost && storedDB) {
        updateDBInput(storedHost, () => {dbInput.value = storedDB})
    };
    const dbDataList = document.createElement('datalist');
    dbDataList.id='dblist'
    hostInput.onchange = (e) => {
        dbopsStorage.set('host',e.target.value);
        updateDBInput(e.target.value)
        hostSelector.value=e.target.value;
    }

    dbInput.onchange = (e) => {
        dbopsStorage.set('db',e.target.value);
        dbSelector.value=e.target.value;
    }

    //dbSelector.remove();
    dbSelector.style.display="none";
    dbSelector.removeAttribute("required");
    dbSelector.name="dd";

    // autofocus sql textarea
    const sqlTextArea = document.querySelector("form > table > tbody > tr > td:nth-child(1) > div > div > textarea")
    sqlTextArea.focus();

    // enroll event
    document.onkeydown = function(e) {
        if(e.code === 'Enter' && e.ctrlKey) {
            submitSql();
        }
        if(e.code === 'KeyB' && e.ctrlKey) {
            toggleRightArea();
        }
    }

    addCss(`
       * {
        font-family: Consolas;
        font-weight: bold;
        font-size: 14px;
       }
       .form-group, div.box.box-success > form > table {
         width: 100%;
       }
       textarea.form-control {
         width: 100% !important;
         height: 60vh;
       }
       table.table-hover, small{
         transform: rotateX(180deg);
       }
       .box-footer {
       transform: rotateX(180deg);
       }
       .box-footer ~ .box-footer{
         margin-top: 30px;
         overflow: unset !important;
         overflow-x: auto !important;
       }
       .box-footer table {
         width: 99%;
         margin: 0 auto;
       }
       .topInput {
         margin-left: 10px;
         width: 250px;
       }
       .table_sort_form > a:nth-child(1) > input {
         cursor: default;
       }
       .table_sort_form > a:nth-child(3) > input {
         cursor: default;
       }
       form > table > tbody > tr > td:nth-child(1) > div > div > div {
         width: 100% !important;
       ]
    `)
})();


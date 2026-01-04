// ==UserScript==
// @name         custom Script
// @namespace    https://greasyfork.org/zh-CN/scripts/418877-custom-script
// @version      0.1
// @description  快捷键执行自定义脚本
// @author       neysummer2000
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/418877/custom%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/418877/custom%20Script.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
#_rightMenu {
	z-index: 999999;
	background-color: rgba(0, 0, 0, 0.8);
	padding: 20px 20px 20px 0px;
    display: none;
    min-width: 100px;
    min-height: 100px;
    position: absolute;
    border: 1px solid black;
}

#_rightMenu a {
	color: white;
}

#_rightMenu li {
	border-bottom: 1px solid black;
	cursor: pointer;
}

#_rightMenu li:hover {
	background-color: rgba(0, 0, 0, 0.4);
}
`);

    var container = document.createElement("div");
    container.id = '_rightMenu';
    container.style.display = 'none';
    container.appendChild(document.createElement("ul"));
    document.body.appendChild(container);

    var g_menu = document.getElementById('_rightMenu');
    var g_scripts = [
        {
            name: 'open as popup',
            script: `
			var select = getSelectHtml();
			var s = getString(select, 'href="', '"');
			if(s == '') s = getString(select, 'src="', '"');
			if(s == '') s = select;
			if(s.substr(0, 4) == 'http'){
				window.open(s, new Date().getTime().toString(), 'height=1080, width=1920, top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no,status=no');
			}
			`
		},
    ];
    var a, li;
    var g_b_show = false;
    for(var script of g_scripts){
        li = document.createElement('li');

        a = document.createElement('a');
        a.href = 'javascript: void(0);';
        a.innerText = script.name;
        a.onclick = function(){
            eval(script.script);
            hideMenu();
        }

        li.appendChild(a);
        _rightMenu.children[0].appendChild(li);
    }

    var movex; var movey;
    document.addEventListener('mousemove', function(e){
        e=e  || window.event;
        if(e.pageX || e.pageY)
        {
            movex=e.pageX;
            movey=e.pageY;

            if(g_b_show){
                var x = g_menu.offsetLeft;
                var y = g_menu.offsetTop;
                if(movex < x || movex > x + g_menu.offsetWidth ||  movey < y || movey > y + g_menu.offsetHeight){
                    hideMenu();
                }
            }
        }
    });

    window.addEventListener('keydown', function(e){
        if(e.altKey && e.code == 'KeyM'){
            showMenu(movex, movey);
        }
    });

    g_menu.onblur = function(e){
        hideMenu();
    }
    function showMenu(x, y){
        g_menu.style.left = x+'px';
        g_menu.style.top = y+'px';
        g_menu.style.display = 'unset';
        g_b_show = true;
    }

    function hideMenu(){
        g_menu.style.display = 'none';
        g_b_show = false;
    }

    function getSelectHtml(){
        if(window.getSelection){
            documentFragment =  window.getSelection().getRangeAt(0).cloneContents();
        }else if(document.selection){
            documentFragment =  document.selection.createRange().HtmlText;
        }
        var selectedHtml = '';
        for(var i=0;i<documentFragment.childNodes.length;i++){
            var childNode = documentFragment.childNodes[i];
            if(childNode.nodeType==3){ // Text 节点
                selectedHtml+=childNode.nodeValue;
            }else{
                var nodeHtml = childNode.outerHTML;
                selectedHtml+=nodeHtml;
            }
        }
        return selectedHtml;
    }

    function getString(str, s, e){
        var i_start = str.indexOf(s);
        if(i_start != -1){
            i_start += s.length;
            var i_end = str.indexOf(e, i_start);
            if(i_end != -1){
                return str.substr(i_start, i_end - i_start);
            }
        }
        return '';
    }

})();
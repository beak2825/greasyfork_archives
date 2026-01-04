// ==UserScript==
// @name         DC - 快速切換Workspace
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速切換Workspace
// @author       ＪＯＨＮＡＴＨＡＮ
// @match        *://*/*swagger/static*
// @match        *://localhost:3000/pages*
// @match        *://design.91app.com/pages*
// @match        *://design.qa.91dev.tw/pages*

// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/utils/Draggable.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499017/DC%20-%20%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9BWorkspace.user.js
// @updateURL https://update.greasyfork.org/scripts/499017/DC%20-%20%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9BWorkspace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var htmlContent = `
      <div class="window draggable resizable" style="width: 200px; height: 300px;">
        <div class="inner">
          <iframe src="/auth/workspace-select?iframe"></iframe>
        </div>
      </div>
        `;

    // 将HTML插入到ID为'container'的元素中
    $('body').append(htmlContent);


    $(document).ready(function() {
        $('.window').each(function() {
            createWindow(this);
        });
        init();
        changeTitle();
    });

    function init() {
        // the ui-resizable-handles are added here
        $('.resizable').resizable();
        // makes GSAP Draggable avoid clicks on the resize handles
        $('.ui-resizable-handle').attr('data-clickable', true);
        $('.maximize').attr('data-clickable', true);
        // make the element draggable
        Draggable.create('.draggable', {
            onPress: function() {
                $(this.target).addClass('ui-resizable-resizing');
            },
            onRelease: function() {
                $(this.target).removeClass('ui-resizable-resizing');
            }
        });
        $('.resizable').dblclick(function() {
            var win = $(this);
            toggleSize(win);
        });
        // attach callback to maximize-button
        $('.maximize').click(function() {
            var win = $(this).parent().parent();
            toggleSize(win);
        });
    }

    function createWindow(container) {
        var titleBar = createTitleBar();
        var maxBtn = createMaxBtn();
        titleBar.append(maxBtn);
        // create title-text
        var $this = $(container);
        var $inner = $this.children('.inner');
        var title = $inner.children('iframe')[0].src;
        var titlespan = document.createElement('span');
        titlespan.appendChild(document.createTextNode(title));
        titleBar.append(titlespan);
        $inner.before(titleBar);
    }

    function createTitleBar() {
        // create titlebar
        let titleBar = document.createElement('div');
        titleBar.className = 'winTitle';
        $(titleBar).css({
            position: 'absolute',
            top: '0px',
            width: '100%',
            height: '27px',
            padding: '4px',
            boxSizing: 'border-box'
        });
        return titleBar;
    }

    function createMaxBtn() {
        // create button to maximize window
        var maxBtn = document.createElement('button');
        maxBtn.className = 'maximize cross';
        $(maxBtn).data({
            maximized: false,
            pWidth: window.innerWidth,
            pHeight: window.innerHeight,
            pTransform: 'translate3d(0,0,0)'
        });
        $(maxBtn).css({
            position: 'absolute',
            right: '4px'
        });
        return maxBtn;
    }

    function toggleSize(win) {
        var newTransform, newWidth, newHeight;
        if (!$(win).data('maximized')) {
            $(win).data({
                maximized: true,
                pWidth: win.width(),
                pHeight: win.height(),
                pTransform: win.css('transform')
            });
            newTransform = 'translate3d(0, 0, 0)';
            newWidth = '100vw';
            newHeight = '100vh';
        } else {
            var data = $(win).data();
            newTransform = data.pTransform;
            newWidth = data.pWidth;
            newHeight = data.pHeight;
            $(win).data('maximized', false);
        }
        $(win).css({
            transform: newTransform,
            width: newWidth,
            height: newHeight
        });
    }

    function changeTitle() {
        var hostname = window.location.hostname;
        var titlePrefix = '';

        if (hostname === 'localhost') {
            titlePrefix = '(Local) ';
        } else if (hostname === 'design.qa.91dev.tw') {
            titlePrefix = '(QA) ';
        } else if (hostname === 'design.91app.com') {
            titlePrefix = '(Prod) ';
        }

        if (titlePrefix) {
            document.title = titlePrefix + document.title;
        }
    }

    //const my_css = GM_getResourceText("IMPORTED_CSS");
    //GM_addStyle(my_css);
    GM_addStyle(`
        .draggable {
          box-shadow: 0 0 4px 0 #000;
          position: absolute;
          bottom: 0;
          right: 0;
          min-width: 50px;
          width: 350px;
          min-height: 50px;
          height: 50vh;
          background: #FFF;
          padding-top: 27px;
        }

        .ui-resizable-se {
          width: 0px;
          height: 0px;
          position: absolute;
          bottom: -1px;
          right: 0;
          border-style: solid;
          border-width: 0 0 20px 20px;
          border-color: transparent transparent #AAA transparent;
          background: none;
          transition: border 200ms ease-out;
        }

        .ui-resizable-se:hover {
          border-color: transparent transparent #FF00FF transparent;
        }

        .ui-resizable-resizing::after {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          height: 200%;
          width: 200%;
          margin: -50% -50%;
        }

        .winTitle span {
          display: block;
          position: absolute;
          width: calc(100% - 28px);
          height: calc(100% - 8px);
          overflow: hidden;
          font-size: 14px;
          white-space: nowrap;
        }

        .inner {
          width: 100%;
          height: 100%;
        }

        iframe {
          width: 100%;
          height: 100%;
          border: none;
          border-top: 1px solid black;
        }

        /*CROSS CSS*/
        /*Cross variables for easy adaptation*/
        .maximize {
          background: transparent;
          border: none;
        }

        .maximize:hover {
          background: #FF00FF;
        }

        .cross {
          width: 16px;
          height: 16px;
          margin: 0 auto;
          position: relative;
          -moz-transition: background 0.2s ease-out;
          -o-transition: background 0.2s ease-out;
          -webkit-transition: background 0.2s ease-out;
          transition: background 0.2s ease-out;
        }

        .cross:hover {
          background: #FF00FF;
          cursor: pointer;
        }

        .cross:before, .cross:after {
          content: "";
          display: block;
          background: black;
          -moz-border-radius: 1px;
          -webkit-border-radius: 1px;
          border-radius: 1px;
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          /* absolute centering */
        }

        .cross:before {
          width: 2px;
          height: 100%;
        }

        .cross:after {
          height: 2px;
          width: 100%;
        }
    `);

})();
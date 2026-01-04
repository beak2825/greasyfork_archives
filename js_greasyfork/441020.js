// ==UserScript==
// @name       stickyNotes
// @namespace  sticky notes
// @version     v1.70
// @author      zhus@live.cn
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @description  Press "shift + left key" to add sticky notes in any webpage wherever you like
// @include      /^https?://*/
// @exclude      /^https?://www.baidu.com/*/
// @exclude      /^https?://www\.google\./
// @exclude      /^https?://\.bing\./
// @encoding    utf-8
// @connect     192.168.196.9
// @connect     192.168.196.6
// @grant        GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_registerMenuCommand
// @license      GPL license
// @downloadURL https://update.greasyfork.org/scripts/441020/stickyNotes.user.js
// @updateURL https://update.greasyfork.org/scripts/441020/stickyNotes.meta.js
// ==/UserScript==
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function ($) {

    $.fn.draggable = function (options) {
        var settings = $.extend({
            handle: undefined,
            msg: {},
            callfunction: function () { }
        }, options);
        var _eleFunc = function () {
            var x0, y0,
                ele = $(this),
                handle;
            handle = (settings.handle === undefined ? ele : ele.find(settings.handle).eq(0) === undefined ? ele : ele.find(settings.handle).eq(0));
            ele.css({
                position: "absolute"
            }); //make sure that the "postion" is "absolute"
            handle.bind('mousedown', function (e0) {
                handle.css({
                    cursor: "move"
                }); //set the appearance of cursor
                x0 = ele.offset().left - e0.pageX; //*1
                y0 = ele.offset().top - e0.pageY; //*1
                $(document).bind('mousemove', function (e1) { //bind the mousemove event, caution:this event must be bind to "document"
                    ele.css({
                        left: x0 + e1.pageX,
                        top: y0 + e1.pageY
                    }); //this expression and the expression of *1 equal to "ele.origin_offset+mouse.current_offset-mouse.origin_offset"
                });
                $(document).one('mouseup', settings.msg, function (e) { //when the mouse up,unbind the mousemove event,bind only once
                    settings.callfunction(e); //callback function
                    $(document).unbind('mousemove');
                    handle.css({
                        cursor: "auto"
                    });
                });
            });
        };
        return this.each(_eleFunc);
    };
})(jQuery);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

var pNote = (function ($) {
    const server = 'http://192.168.196.9:6080/'; //写上自己的服务器地址。
    var day = new Date();
    var mark = parseInt(String(day.getMonth()) + String(day.getDate()) + String(day.getHours()));
    console.log('pnote', mark);

    function showMsg(message) {
        GM_notification({
            title: location.host,
            text: message,
            timeout: 2000,

        })
    };

    function isJson(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }

            } catch (e) {
                console.log('error：' + str + '!!!' + e);
                return false;
            }
        };
        showMsg('It is not a string!');
    };

    function getPost(flag, data = '') {
        return new Promise(res => {
            console.log('start load');
            GM_xmlhttpRequest({
                method: flag,
                headers: { 'Content-Type': 'application/json', 'host': location.hostname },
                data: data,
                url: server,
                timeout: 50000,
                onload: (r) => {
                    if (flag === 'GET') {
                        console.log('get')
                        if (r.response !== 'no' && isJson(r.responseText)) {
                            console.log(r.response);
                            localStorage.setItem('wxz-sto', r.responseText);
                        } // get 方法只会回传 no 或者 data数据
                    } else if (flag === 'POST') {
                        console.log('post')
                        if (r.response === 'ok') {
                            showMsg('upload done');
                            //console.log('upload done');
                        } else {
                            alert('upload err'); // post方法会回传 ok no 或者 err 三种
                        }
                    };
                    res()
                },
                onerror: (r) =>{
                    console.log(r)
                    showMsg('请求失败');
                }
            })
        })
    };

    function setCSS() {
        var css = '	<style type="text/css">\
	.wxz-noteDiv{\
	z-index:99;\
	box-shadow:0 0 9px rgba(0,0,0,.9);\
	background:#FFCC00;\
	width:200px;\
	position:absolute;\
    opacity:0.8;\
	outline:0 none;\
}\
.wxz-noteDiv-head{\
	background:#FFCC00;\
	outline:0 none;\
	text-align:center;\
	 width:200px;\
	 line-height: initial;\
	 font:13px/1.5 "微软雅黑",arial,serif;\
}\
.wxz-noteDiv-head-title{\
	text-align:center;\
}\
.wxz-noteDiv-head-close{\
	cursor:pointer;\
	position:absolute;\
	right:5px;\
}\
.wxz-noteDiv-content{\
	background:#FFFF66 ;\
	padding:5px 9px;\
	font:13px/1.5 "微软雅黑",arial,serif;\
	word-wrap:break-word;\
	min-height:200px;\
	outline:0 none;\
	text-align:left;\
}\
	</style>';
        $('head:first').append(css);
    }

    async function getSTO() {
        //import localStorage.mysto to stotage
        var sto;
        if (!localStorage.getItem('down-note') || mark - parseInt(localStorage.getItem('down-note')) > 4 ) {
            console.log('syncing')
            await getPost('GET'); //4小时同步一次，减少读服务器。
            localStorage.setItem('down-note', mark);
        };
        var data = localStorage.getItem('wxz-sto');
        if (data !== null && data && isJson(data)) {
            sto = JSON.parse(localStorage.getItem('wxz-sto'));
        } else {
            sto = {};
            localStorage.setItem('wxz-sto', sto);
        }
        return sto;
    }

    function upDateSTO(storage) {
        var data = JSON.stringify(storage)
        if(isJson(data)){
            localStorage.setItem('wxz-sto', data); //update localStorage.mysto with storage
            getPost('POST', data);
        } else {
            showMsg('data is not json');
        };
    }

    async function addNoteToStorage(keyName, x, y, text) {
        try{
            let storage = await getSTO(); //just call for add notes  not for update or delete
            var path = {},
                temp = {}
            temp.keyName = keyName;
            temp.x = x;
            temp.y = y;
            temp.text = text;
            if (storage[location.pathname] !== undefined) {
                path = storage[location.pathname];
            }
            path[temp.keyName] = temp; //save notes to path
            storage[location.pathname] = path;
            upDateSTO(storage); //update local storage
            path = null;
            temp = null;
            storage = null;
        }catch(e){
            showMsg(e)
        }
    };


    async function removeNoteFromStorage(keyName) {
        try{
            let storage = await getSTO();
            var path = {}
            path = storage[location.pathname];
            if (path !== undefined) {
                delete path[keyName];
                if (Object.keys(path).length === 0) {
                    delete storage[location.pathname];
                } else {
                    storage[location.pathname] = path;
                }
                //update the localStorage.pathname
                upDateSTO(storage);
            }
            path = null;
            storage = null;
        }
        catch(e){
            showMsg(e)
        }
    };

    function save(keyName) {
        var
            x, y, text,
            selector = "div[keyName='" + keyName + "']";
        x = $(selector).css('left');
        y = $(selector).css('top');
        text = $(selector).find('.wxz-noteDiv-content').html();
        addNoteToStorage(keyName, x, y, text);
        $(selector).find('.wxz-noteDiv-head-flag').text('');
    }

    function del(keyName) {
        if (confirm("Do you like to delete the noteï¼")) {
            var selector = "div[keyName='" + keyName + "']";
            $(selector).remove();
            removeNoteFromStorage(keyName);
        }
    }

    function show(keyName, x, y, text) {
        var
            html = '<div class="wxz-noteDiv" >\
<div class="wxz-noteDiv-head">\
<nobr class="wxz-noteDiv-head-flag">*</nobr><nobr class="wxz-noteDiv-head-title"></nobr><nobr class="wxz-noteDiv-head-close">X</nobr>\
</div>\
<div class="wxz-noteDiv-content" contenteditable="true"></div>\
</div>',
            thisNote,
            tempTime = new Date(parseInt(keyName, 10));
        thisNote = $(html);
        thisNote.appendTo('body:first');
        thisNote.attr('keyName', keyName);
        thisNote.find('.wxz-noteDiv-head-title').html(tempTime.toDateString());
        //set the coordinate
        thisNote.css({
            position: 'absolute',
            top: y,
            left: x
        });
        //write text to content
        thisNote.find('.wxz-noteDiv-content').html(text);
        // draggable;
        thisNote.draggable({
            handle: '.wxz-noteDiv-head',
            msg: {
                msg: keyName
            },
            callfunction: function (e) {
                save(e.data.msg);
            }
        }
        );
        //bind click event
        thisNote.find('.wxz-noteDiv-head-close').bind('click', {
            msg: keyName
        }, function (e) {
            del(e.data.msg);
        });
        //save when it lost focus
        thisNote.focusout({
            msg: keyName
        }, function (e) {
            save(e.data.msg);
        });
        thisNote.focusin(function () {
            thisNote.find('.wxz-noteDiv-head-flag').text('*');
        });

    }

    async function loadNotes() {
        try {
            let storage = await getSTO();
            var noteList;
            if (storage[location.pathname] !== undefined) {
                noteList = storage[location.pathname];
                $.each(noteList, function (i, e) {
                    show(e.keyName, e.x, e.y, e.text);
                });
                $('.wxz-noteDiv-head-flag').text('');
            }
            console.log('load notes successfully');
        }catch(e){
            showMsg(e);
        }
    }

    // function showNotes() {
    // 	$("wxz-noteDiv").css({
    // 		'display': 'inline'
    // 	});
    // }

    // function closeNotes() {
    // 	$("wxz-noteDiv").css({
    // 		'display': 'none'
    // 	});
    // }

    return {
        init: function () {
            setCSS();
            loadNotes();
            $("body").mousedown(function (e) {
                if (e.shiftKey) {
                    var
                        x = e.pageX,
                        y = e.pageY,
                        keyName = (new Date()).getTime();
                    // keyName = e.timeStamp;//a bug in firefox since 2004
                    e.preventDefault();
                    show(keyName, x, y, '');
                    console.log('new note');
                }
            });
            console.log('initialized successfully');
        }

    };

})(jQuery);

pNote.init();
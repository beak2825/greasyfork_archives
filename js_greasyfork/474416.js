// ==UserScript==
// @name         Code Browser Bookmark
// @namespace    http://tampermonkey.net/
// @version      230111.2238
// @description  Add code bookmark in code-browser
// @author       Bing
// @match        https://codebrowser.dev/*
// @icon         https://codebrowser.dev/img/favico.svg
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/474416/Code%20Browser%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/474416/Code%20Browser%20Bookmark.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const marked_linenumber_style = 'background: dodgerblue !important;color: white !important;border-top-left-radius: 50% !important;border-bottom-left-radius: 50% !important;';
    const marked_bnt_style = 'border-radius: 50%;cursor: pointer;border: solid rgb(0, 0, 0, 1) 0.6ex;';
    const view_style = 'visibility: visible;user-select: none;position: fixed;top: 5px;left: ' + (window.innerWidth - 400) + 'px;z-index: 9999;background: rgb(239, 239, 239);border-radius: 5px;width: fit-content;text-overflow: ellipsis;white-space: nowrap;';
    const view_visible = function () {
        if (!view_box || view_box.style == '') {
            return view_style;
        }
        view_box.style.visibility = 'visible';
    };

    const unmarked_bnt_style = 'border-radius: 50%;cursor: pointer;border: solid rgb(0, 0, 0, 0.2) 0.6ex;'
    const unmarked_linenumber_style = '';
    const view_hidden = function () {
        if (!view_box || view_box.style == '') {
            return view_style;
        }
        view_box.style.visibility = 'hidden';
    };

    var host = 'https://codebrowser.dev';
    var file_name = window.location.pathname;
    var book_marks = {};
    let local_marks = window.localStorage.getItem('code-browser-bookmarks');
    if (local_marks) {
        try {
            book_marks = JSON.parse(local_marks);
        } catch {
            book_marks = {};
        }
    }

    if (!('status' in book_marks)) {
        book_marks.status = {};
    }
    if (!('style' in book_marks.status)) {
        book_marks.status.style = '';
    }
    if (!('top_bar_hide_btn_style' in book_marks.status)) {
        book_marks.status.top_bar_hide_btn_style = '';
    }
    if (!('content_style' in book_marks.status)) {
        book_marks.status.content_style = '';
    }
    if (!('content_scroll_top' in book_marks.status)) {
        book_marks.status.content_scroll_top = 0;
    }
    if (!('content_scroll_left' in book_marks.status)) {
        book_marks.status.content_scroll_left = 0;
    }


    var view_box = document.querySelector('#code-browser-view-box');
    update_view_box();


    function store_marks() {
        window.localStorage.setItem('code-browser-bookmarks', JSON.stringify(book_marks));
    }

    function get_code_lines() {
        let code_table = document.querySelector('#content > table.code');
        if (!code_table) {
            return [];
        }

        let lines = code_table.querySelectorAll('tbody > tr');
        return lines;
    }

    function gen_mark_bnt() {
        let mark_container = document.createElement('td');
        mark_container.className = 'code-browser-bookmark-container';
        mark_container.style = 'text-align: right;vertical-align: middle;margin: auto;width: 1ex;cursor: pointer;'
        mark_container.setAttribute('marked', false);

        let mark_container_bnt = document.createElement('div');
        mark_container_bnt.className = 'code-browser-bookmark-bnt';
        mark_container_bnt.style = unmarked_bnt_style;

        mark_container.appendChild(mark_container_bnt);
        mark_container.onclick = on_mark_bnt_click;

        return mark_container;
    }

    function on_mark_bnt_click() {
        let mark_container = this;

        function update_bnt() {
            let line_info = gen_line_info();
            if (!line_info) {
                return;
            }
            let mark_bnt = mark_container.querySelector('.code-browser-bookmark-bnt');
            let is_marked = mark_container.getAttribute('marked') == 'true';

            mark_container.setAttribute('marked', !is_marked);
            mark_bnt.style = is_marked ? unmarked_bnt_style : marked_bnt_style;
            mark_container.parentNode.querySelector('th').style = is_marked ? unmarked_linenumber_style : marked_linenumber_style;

            if (is_marked) {
                remove_mark(line_info);
            } else {
                add_mark(line_info);
            }
        }

        function gen_line_info() {
            let line = mark_container.parentNode;
            let line_number = line.querySelector('th').innerText;
            let line_content = line.querySelectorAll('td')[1].innerText.trim();
            if (!line.querySelector('th > a')) {
                return null;
            }
            let line_mark = line.querySelector('th > a').getAttribute('href');
            return {
                'number': line_number,
                'content': line_content,
                'mark': line_mark,
            };
        }

        function add_mark(line_info) {
            if (!(file_name in book_marks)) {
                book_marks[file_name] = {
                    'status': {},
                    'list': []
                }
            }
            book_marks[file_name].list.push(line_info);
            update_marks();
        }

        function remove_mark(line_info) {
            if (file_name in book_marks) {
                for (let index in book_marks[file_name].list) {
                    if (book_marks[file_name].list[index].number == line_info.number) {
                        book_marks[file_name].list[index] = book_marks[file_name].list[0];
                        book_marks[file_name].list.shift();
                        break;
                    }
                }
                if (book_marks[file_name].list.length == 0) {
                    delete book_marks[file_name];
                }
            }
            update_marks();
        }

        function update_marks() {
            if (file_name in book_marks) {
                book_marks[file_name].list = book_marks[file_name].list.sort(function (a, b) {
                    return parseInt(a.number) - parseInt(b.number);
                });
            }
            store_marks();
            update_view_box();
        }

        update_bnt();
    }

    function update_view_box() {
        function gen_mark_list_view_line(number, content, link) {
            let mark_line = document.createElement('span');
            let mark_line_del_bnt = document.createElement('span');
            let mark_line_jump = document.createElement('a');
            let mark_line_number = document.createElement('span');
            let mark_line_content = document.createElement('span');
            mark_line_del_bnt.innerText = '-';
            mark_line_jump.href = link;
            mark_line_number.innerText = number;
            mark_line_content.innerText = content;

            mark_line.style = 'display: block;text-decoration: none;border: none;line-height: 1.8rem;';
            mark_line_del_bnt.style = 'float: left; margin-right: 1rem; width: 1rem; text-align: right; cursor: pointer;';
            mark_line_number.style = 'display: inline-block;text-align: left;width: 5ex;color: blue;';
            mark_line_content.style = 'margin-left: 0.5rem;';

            mark_line_del_bnt.onclick = function () {
                let block = mark_line.parentNode.getAttribute('block');
                let is_current_block = block == file_name;
                if (is_current_block) {
                    document.getElementById(number).style = unmarked_linenumber_style;
                    document.getElementById(number).parentNode.querySelector('.code-browser-bookmark-bnt').style = unmarked_bnt_style;
                }

                let block_ele = mark_line.parentNode;
                mark_line.remove();
                book_marks[block].list = book_marks[block].list.filter(item => item.number != number);
                if (book_marks[block].list.length == 0) {
                    delete book_marks[block];
                    block_ele.remove();
                }
                store_marks();
            };

            mark_line.appendChild(mark_line_del_bnt);
            mark_line_jump.appendChild(mark_line_number);
            mark_line_jump.appendChild(mark_line_content);
            mark_line.appendChild(mark_line_jump);

            return mark_line;
        }

        function gen_mark_list_view_file(block, marks) {
            let file_block = document.createElement('div');
            let file_block_title = document.createElement('div');
            let file_block_del_bnt = document.createElement('span');
            let file_block_title_bnt = document.createElement('span');
            let unfold = !('unfold' in marks.status) || (marks.status.unfold == true);
            file_block.setAttribute('block', block);
            file_block_title_bnt.innerText = block.replace('.html', '').slice(1);
            file_block_del_bnt.innerText = '-';
            file_block_del_bnt.style = 'float: left; margin-right: 0.1rem; width: 1rem; text-align: left; cursor: pointer;';
            file_block_title.appendChild(file_block_del_bnt);
            file_block_title.appendChild(file_block_title_bnt);
            file_block_title.style = 'cursor: pointer;';
            file_block_title_bnt.onclick = on_block_fold_unfold;
            file_block_del_bnt.onclick = delete_block;
            file_block.appendChild(file_block_title);

            function draw_block_lines() {
                marks.list.forEach(function (line) {
                    let number = line.number;
                    let content = line.content;
                    let link = host + block + line.mark;
                    let view_line = gen_mark_list_view_line(number, content, link);
                    file_block.appendChild(view_line);
                });
            }
            function on_block_fold_unfold() {
                let unfold = (!('unfold' in book_marks[block].status)) || (book_marks[block].status.unfold == true);
                if (unfold) {
                    file_block.innerHTML = '';
                    file_block.appendChild(file_block_title);
                } else {
                    draw_block_lines();
                }
                book_marks[block].status.unfold = !unfold;
                store_marks();
            }
            function delete_block() {
                file_block.remove();
                delete book_marks[block];
                store_marks();
            }

            if (unfold) {
                draw_block_lines();
            }
            return file_block;
        }

        function enable_view_drag() {
            let top_bar = document.createElement('div');
            let top_bar_hide_btn = document.createElement('span');
            top_bar_hide_btn.innerText = "(●'◡'●)";
            top_bar_hide_btn.style = 'cursor: pointer; visibility: visible;';
            top_bar_hide_btn.ondblclick = hidden_view;
            top_bar.id = '#code-browser-view-boxbar';
            top_bar.style = 'width: 100%;text-align: center;margin-bottom: 1ex;padding: 1ex 0;cursor: move;background: darkgray;';

            if (book_marks.status.top_bar_hide_btn_style != '') {
                top_bar_hide_btn.style = book_marks.status.top_bar_hide_btn_style;
            }

            top_bar.appendChild(top_bar_hide_btn);
            view_box.appendChild(top_bar);
            dragElement(view_box, top_bar);

            function hidden_view() {
                let view = document.getElementById('#code-browser-view-box');
                let hidden = view.getAttribute('visibility') == 'hidden';
                if (hidden) {
                    view.setAttribute('visibility', 'visible');
                    top_bar_hide_btn.style = 'cursor: pointer; visibility: visible;';
                    view_visible();
                } else {
                    view.setAttribute('visibility', 'hidden');
                    top_bar_hide_btn.style = 'cursor: pointer;background: rgb(0, 0, 0, 0.2);padding: 5px 10px;border-radius: 10px;color: darkslateblue;visibility: visible;';
                    view_hidden();
                }

                book_marks.status.style = view_box.style.cssText;
                book_marks.status.top_bar_hide_btn_style = top_bar_hide_btn.style.cssText;
                store_marks();
            }

            function dragElement(elmnt, drag_bar) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                drag_bar.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    /* stop moving when mouse button is released:*/
                    document.onmouseup = null;
                    document.onmousemove = null;

                    book_marks.status.style = view_box.style.cssText;
                    store_marks();
                }
            }
        }

        function enable_view_content() {
            let content = document.createElement('div');
            content.id = '#code-browser-view-boxcontent';
            content.style = 'overflow: scroll;padding-left: 20px;padding-right: 20px;width: 300px;height: 400px;resize: both;';
            content.scrollTop = 0;
            content.scrollLeft = 0;
            if (book_marks.status.content_style != '') {
                content.style = book_marks.status.content_style;
            }

            content.onmouseup = function () {
                book_marks.status.content_style = content.style.cssText;
                store_marks();
            }
            content.onscroll = function () {
                book_marks.status.content_scroll_top = content.scrollTop;
                book_marks.status.content_scroll_left = content.scrollLeft;
                store_marks();
            }
            view_box.appendChild(content);
        }

        function clear_view_content() {
            document.getElementById('#code-browser-view-boxcontent').innerHTML = "";
        }

        function update_view_content(ele) {
            document.getElementById('#code-browser-view-boxcontent').appendChild(ele);
        }

        if (!view_box) {
            view_box = document.createElement('div');
            view_box.id = '#code-browser-view-box';
            view_box.style = view_style;
            if (book_marks.status.style != '') {
                view_box.style = book_marks.status.style;
            }

            enable_view_drag();
            enable_view_content();
            document.body.appendChild(view_box);
        }
        clear_view_content();
        for (let block in book_marks) {
            if (block == 'status') {
                continue;
            }
            if (book_marks[block].list.length == 0) {
                delete book_marks[block];
                store_marks();
                continue;
            }

            let file_block = gen_mark_list_view_file(block, book_marks[block]);
            update_view_content(file_block);

            if (book_marks.status.content_scroll_top != '') {
                document.getElementById('#code-browser-view-boxcontent').scrollTop = parseFloat(book_marks.status.content_scroll_top);
            }
            if (book_marks.status.content_scroll_left != '') {
                document.getElementById('#code-browser-view-boxcontent').scrollLeft = parseFloat(book_marks.status.content_scroll_left);
            }
        }
    }

    function on_mark_bnt_hover() {
        let mark_container = this;
        let line = mark_container.parentNode;
        let is_hover = !(line.getAttribute('hover') == 'true');

        if (is_hover) {
            line.style = 'background: #000';
            line.setAttribute('hover', true);
        } else {
            line.style = 'background: #fff';
            line.setAttribute('hover', false);
        }
    }

    let lines = get_code_lines();
    lines.forEach(function (line) {
        let mark_bnt = gen_mark_bnt();
        line.insertBefore(mark_bnt, line.firstChild);
    });

    if (file_name in book_marks) {
        for (let i in book_marks[file_name].list) {
            let number = book_marks[file_name].list[i].number;
            let marked_line = document.querySelectorAll('th')[parseInt(number) - 1].parentNode;
            let marked_line_bnt = marked_line.querySelector('.code-browser-bookmark-bnt');
            marked_line_bnt.parentNode.setAttribute('marked', true);

            marked_line_bnt.style = marked_bnt_style;
            marked_line.querySelector('th').style = marked_linenumber_style;
        }
    }
})();
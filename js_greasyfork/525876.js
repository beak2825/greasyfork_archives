// ==UserScript==
// @name         用户备注
// @version      3.5
// @description  为用户添加显式备注防改名，如果需要长备注可以使用详细备注。
// @author       age_anime
// @match        https://bgm.tv/*
// @match        https://chii.in/*
// @match        https://bangumi.tv/*
// @license      MIT
// @namespace https://greasyfork.org/users/1426310
// @downloadURL https://update.greasyfork.org/scripts/525876/%E7%94%A8%E6%88%B7%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/525876/%E7%94%A8%E6%88%B7%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 1.3版本说明：功能：无新功能。使用体验优化：增加对详细备注的修改框，不用挤在原生的一行弹窗里进行修改。不再兼容更早期的版本（未在bangumi上线），以优化加载速度。
    // 组件函数功能说明：（数据保存在本地，显示和修改在前端，可直接修改和清除）
    // displayUserNote(userId, note)：在指定用户的用户名旁边显示备注标签
    // markUserNotes()：显示对应的备注标签
    // openSecondaryNoteEditor()：详细备注编辑界面
    // openUserNoteManager()：用户备注管理界面
    // openColorManager()：颜色管理界面
    // addButtonFunctions()：添加功能按钮
    const defaultNoteColors = {
        "预设0": "#40E0D0",
        "预设1": "#BB44BB",
        "预设2": "#000000",
        "预设3": "#DD6D22",
        "预设4": "#CC3333",
        "预设5": "#DD6D22",
    };
    let noteColors = JSON.parse(localStorage.getItem('userNoteColors_')) || defaultNoteColors;

    // 用户备注配置（默认为空白）
    let userNoteTable_AGE = JSON.parse(localStorage.getItem('userNoteTable_AGE')) || {};

    // 迁移旧版本数据结构
    function migrateUserNotes() {
        let needMigration = false;

        // 检查是否需要兼容
        Object.keys(userNoteTable_AGE).forEach(userId => {
            if (typeof userNoteTable_AGE[userId] === 'string') {
                needMigration = true;
            }
        });

        if (needMigration) {
            const newUserNoteTable = {};

            // 旧版本兼容：兼容v3.4（b1.2）之前的版本
            Object.keys(userNoteTable_AGE).forEach(userId => {
                if (typeof userNoteTable_AGE[userId] === 'string') {
                    newUserNoteTable[userId] = [userNoteTable_AGE[userId], ""];
                } else {
                    newUserNoteTable[userId] = userNoteTable_AGE[userId];
                }
            });

            userNoteTable_AGE = newUserNoteTable;
            localStorage.setItem('userNoteTable_AGE', JSON.stringify(userNoteTable_AGE));
        }
    }

    migrateUserNotes();

    const defaultNote = "…";
    const defaultColor = "rgba(255, 255, 255, 0)";
    const defaultNoteColor = "rgba(102, 170, 85, 0.2)";
    const defaultSecondaryNote = "点击修改详细备注...";

    function displayUserNote(userId, notes) {
        const userAnchor = $("strong a.l[href='/user/" + userId + "']");
        if (userAnchor.length > 0 && userAnchor.next(".note-badge").length === 0) {
            let primaryNote, secondaryNote;

            if (Array.isArray(notes)) {
                [primaryNote, secondaryNote] = notes;
                secondaryNote = secondaryNote || "";
            } else {
                primaryNote = notes;
                secondaryNote = "";
            }
            const badgeColor = (primaryNote === defaultNote) ? defaultColor : (noteColors[primaryNote] || defaultNoteColor);
            const noteColorSet = badgeColor === defaultColor ? "#9F9F9F" : "#FFF";

            const badge = $(`
            <span class="note-badge" style="
                background: ${badgeColor};
                font-size: 10px;
                padding: 1px 4px;
                color: ${noteColorSet};
                border-radius: 6px;
                line-height: 150%;
                display: inline-block;
                cursor: pointer;
                position: relative;
            " title="双击修改备注">${primaryNote}</span>`);

            const badgeId = 'note-badge-' + userId + '-' + Math.random().toString(36).substr(2, 9);
            badge.attr('id', badgeId);
            badge.attr('data-user-id', userId);
            badge.attr('data-primary-note', primaryNote);
            badge.attr('data-secondary-note', secondaryNote);
            badge.attr('data-secondary-loaded', 'false');
            // 一级备注点击事件
            badge.click(function(e) {
                const userId = $(this).attr('data-user-id');
                const primaryNote = $(this).attr('data-primary-note');
                const storedSecondaryNote = $(this).attr('data-secondary-note');
                const secondaryLoaded = $(this).attr('data-secondary-loaded') === 'true';

                const $target = $(e.target);
                const isInteractiveElement = $target.is('a, button, [contenteditable="true"], input, select, textarea');

                const isSecondaryArea = $target.closest('.secondary-note').length > 0;

                // 处理二级备注点击
                if (isSecondaryArea) {
                    if (isInteractiveElement) {
                        return;
                    }

                    // 处理二级备注编辑
                    openSecondaryNoteEditor($target.closest('.secondary-note'), storedSecondaryNote, userId, primaryNote);
                    e.stopPropagation();
                    return;
                }

                // 处理一级备注逻辑
                let currentSecondaryBadge = $(this).find('.secondary-note');
                if (!secondaryLoaded) {
                        currentSecondaryBadge = $(`
                        <div class="secondary-note" style="
                            display: none;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            width: 200px;
                            background: white;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            padding: 5px;
                            margin-top: 5px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                            z-index: 1000;
                            font-size: 12px;
                            color: ${storedSecondaryNote ? '#333' : '#999'};
                            cursor: pointer;
                            max-height: 400px;
                            overflow-y: auto;
                            word-wrap: break-word;
                            resize: both;
                        " title="点击编辑">${storedSecondaryNote || defaultSecondaryNote}</div>`);
                        currentSecondaryBadge.on('click', 'a', function(e) {
                        e.stopPropagation();
                    });

                    $(this).append(currentSecondaryBadge);
                    $(this).attr('data-secondary-loaded', 'true');
                }

                if (currentSecondaryBadge.is(':visible')) {
                    // 保持原生弹框样式
                    const newNote = prompt("请输入新的备注：", primaryNote);
                    if (newNote !== null) {
                        const trimmedNote = newNote.trim();
                        if (trimmedNote === "" || trimmedNote === defaultNote) {
                            delete userNoteTable_AGE[userId];
                            localStorage.setItem('userNoteTable_AGE', JSON.stringify(userNoteTable_AGE));
                            $(this).remove();
                        } else if (trimmedNote !== primaryNote) {
                            if (Array.isArray(userNoteTable_AGE[userId])) {
                                userNoteTable_AGE[userId][0] = trimmedNote;
                            } else {
                                userNoteTable_AGE[userId] = [trimmedNote, storedSecondaryNote];
                            }
                            localStorage.setItem('userNoteTable_AGE', JSON.stringify(userNoteTable_AGE));
                            $(this).contents().first().replaceWith(document.createTextNode(trimmedNote));
                            const newBadgeColor = noteColors[trimmedNote] || defaultNoteColor;
                            $(this).css("background", newBadgeColor);
                            $(this).attr('data-primary-note', trimmedNote);
                        }
                    }
                } else {
                    $('.secondary-note').hide();
                    currentSecondaryBadge.show();
                }
            });

            // 点击其他区域关闭二级备注
            if (!window.noteClickHandlerAdded) {
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.note-badge').length) {
                        $('.secondary-note').hide();
                    }
                });
                window.noteClickHandlerAdded = true;
            }

            userAnchor.after(badge);
        }
    }

    // 打开二级备注编辑器
    function openSecondaryNoteEditor(secondaryNoteElement, currentNote, userId, primaryNote) {
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        zIndex: '9999',
        width: '300px'
    });

    const title = document.createElement('h3');
    title.textContent = '编辑详细备注';
    title.style.marginTop = '0';
    title.style.color = '#333';

    const noteTextarea = document.createElement('textarea');
    noteTextarea.value = currentNote;
    noteTextarea.style.width = '100%';
    noteTextarea.style.height = '150px';
    noteTextarea.style.padding = '5px';
    noteTextarea.style.boxSizing = 'border-box';
    noteTextarea.style.resize = 'vertical';

    // 添加链接
    const linkForm = document.createElement('div');
    linkForm.style.margin = '10px 0';
    linkForm.style.padding = '10px';
    linkForm.style.backgroundColor = '#f5f5f5';
    linkForm.style.borderRadius = '4px';

    const linkLabel = document.createElement('label');
    linkLabel.textContent = '添加链接:';
    linkLabel.style.color = 'black';
    linkLabel.style.display = 'block';
    linkLabel.style.marginBottom = '5px';

    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'URL:';
    urlLabel.style.color = 'black';
    urlLabel.style.display = 'inline-block';
    urlLabel.style.width = '50px';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'https://';
    urlInput.style.width = 'calc(100% - 60px)';
    urlInput.style.marginBottom = '5px';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = '标题:';
    titleLabel.style.color = 'black';
    titleLabel.style.display = 'inline-block';
    titleLabel.style.width = '50px';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = '链接标题';
    titleInput.style.width = 'calc(100% - 60px)';

    const addLinkButton = document.createElement('button');
    addLinkButton.textContent = '插入链接';
    addLinkButton.style.marginTop = '5px';
    addLinkButton.onclick = () => {
        const linkUrl = urlInput.value.trim();
        const linkTitle = titleInput.value.trim() || '链接';
        
        if (linkUrl) {
            const selectionStart = noteTextarea.selectionStart;
            const selectionEnd = noteTextarea.selectionEnd;
            const selectedText = noteTextarea.value.substring(selectionStart, selectionEnd);
            const finalTitle = selectedText || linkTitle;
            const linkHtml = `<a href="${linkUrl}" style="color:blue;" rel="nofollow">${finalTitle}</a>`;
            const beforeText = noteTextarea.value.substring(0, selectionStart);
            const afterText = noteTextarea.value.substring(selectionEnd);
            
            noteTextarea.value = beforeText + linkHtml + afterText;
            urlInput.value = '';
            titleInput.value = '';
            // 将光标定位到插入的内容之后
            const newCursorPos = selectionStart + linkHtml.length;
            noteTextarea.setSelectionRange(newCursorPos, newCursorPos);
            noteTextarea.focus();
        }
    };

    linkForm.append(linkLabel, urlLabel, urlInput, document.createElement('br'), 
                   titleLabel, titleInput, document.createElement('br'), addLinkButton);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'text-align: right; margin-top: 15px;';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => modal.remove();

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';
    saveBtn.style.marginLeft = '8px';
    saveBtn.onclick = () => {
        const newSecondaryNote = noteTextarea.value.trim();
        if (primaryNote === defaultNote && newSecondaryNote === "") {
            delete userNoteTable_AGE[userId];
            localStorage.setItem('userNoteTable_AGE', JSON.stringify(userNoteTable_AGE));
            secondaryNoteElement.closest('.note-badge').remove();
        } else {
            if (Array.isArray(userNoteTable_AGE[userId])) {
                userNoteTable_AGE[userId][1] = newSecondaryNote;
            } else {
                userNoteTable_AGE[userId] = [primaryNote, newSecondaryNote];
            }
            localStorage.setItem('userNoteTable_AGE', JSON.stringify(userNoteTable_AGE));
            secondaryNoteElement.text(newSecondaryNote || defaultSecondaryNote)
                   .css('color', newSecondaryNote ? '#333' : '#999');
            secondaryNoteElement.closest('.note-badge').attr('data-secondary-note', newSecondaryNote);
        }
        modal.remove();
    };

    buttonContainer.append(cancelBtn, saveBtn);
    modal.append(title, noteTextarea, linkForm, buttonContainer);
    document.body.appendChild(modal);
}

    function markUserNotes() {
        $(".note-badge").remove();
        $("strong a.l:not(.avatar)").each(function () {
            const userLink = $(this).attr("href");
            const userId = userLink.split("/").pop();
            const notes = userNoteTable_AGE[userId] || defaultNote;
            displayUserNote(userId, notes);
        });
    }

    // 按钮颜色管理区
    function openColorManager() {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: '9999',
            width: '300px'
        });

        // 添加颜色
        const form = document.createElement('div');
        form.style.marginBottom = '5px';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = '名称：';
        nameLabel.style.color = '#333333';
        nameLabel.style.marginRight = '5px';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.style.minWidth = '240px';
        nameInput.style.width = 'auto';
        nameInput.style.height = '22px';
        nameInput.style.marginRight = '5px';
        nameInput.style.position = 'relative';
        nameInput.style.top = '-5px';

        const colorLabel = document.createElement('label');
        colorLabel.textContent = '颜色：';
        colorLabel.style.color = '#333333';
        colorLabel.style.marginRight = '5px';

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.style.marginRight = '5px';

        const addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.onclick = () => {
            const name = nameInput.value.trim();
            const color = colorInput.value;
            if (name && color) {
                noteColors[name] = color;
                textarea.value = JSON.stringify(noteColors, null, 4);
                nameInput.value = '';
                colorInput.value = '#000000';
            } else {
                alert('名称和颜色不能为空！');
            }
        };

        form.append(nameLabel, nameInput, colorLabel, colorInput, addButton);

        const textarea = document.createElement('textarea');
        textarea.style.cssText = 'width: 100%; height: 200px; margin-bottom: 10px;';
        textarea.value = JSON.stringify(noteColors, null, 4);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'text-align: right;';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.onclick = () => modal.remove();

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.marginLeft = '8px';
        saveBtn.onclick = () => {
            try {
                const newColors = JSON.parse(textarea.value);
                if (typeof newColors !== 'object' || newColors === null) {
                    throw new Error('请输入有效的JSON对象');
                }
                localStorage.setItem('userNoteColors_', JSON.stringify(newColors));
                noteColors = newColors;
                document.querySelectorAll('.note-badge').forEach(badge => {
                    const note = badge.textContent;
                    badge.style.backgroundColor = noteColors[note] || defaultNoteColor;
                });
                modal.remove();
            } catch (error) {
                alert('错误: 请检查JSON格式（其他行的末尾是有英文逗号的，最后一行的末尾是没有逗号的！），还不会就把错误代码和JSON内容放在AI里面问问： ' + error.message);
            }
        };

        buttonContainer.append(cancelBtn, saveBtn);
        modal.append(form, textarea, buttonContainer);
        document.body.appendChild(modal);
    }
    // 用户备注管理区
    function openUserNoteManager() {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: '9999',
            width: '300px'
        });

        // 添加上方输入框
        const form = document.createElement('div');
        form.style.marginBottom = '10px';

        const idInput = document.createElement('input');
        idInput.placeholder = '用户ID';
        idInput.style.marginRight = '5px';

        const noteInput = document.createElement('input');
        noteInput.placeholder = '备注';
        noteInput.style.marginRight = '5px';

        const secondaryNoteInput = document.createElement('input');
        secondaryNoteInput.placeholder = '详细备注（可选）';
        secondaryNoteInput.style.marginRight = '5px';
        secondaryNoteInput.style.width = '100%';

        const addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.onclick = () => {
            const userId = idInput.value.trim();
            const note = noteInput.value.trim();
            const secondaryNote = secondaryNoteInput.value.trim();
            if (userId && note) {
                userNoteTable_AGE[userId] = [note, secondaryNote];
                textarea.value = JSON.stringify(userNoteTable_AGE, null, 4);
                idInput.value = '';
                noteInput.value = '';
                secondaryNoteInput.value = '';
            }
        };

        form.append(idInput, noteInput, document.createElement('br'), secondaryNoteInput, addButton);
        // JSON编辑区
        const textarea = document.createElement('textarea');
        textarea.style.cssText = 'width: 100%; height: 200px; margin: 10px 0;';
        textarea.value = JSON.stringify(userNoteTable_AGE, null, 4);
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'text-align: right;';
        const importBtn = document.createElement('button');
        importBtn.textContent = '导入';
        importBtn.onclick = () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/json";
            input.onchange = function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        try {
                            const imported = JSON.parse(e.target.result);
                            userNoteTable_AGE = imported; // 直接替换当前内容
                            textarea.value = JSON.stringify(userNoteTable_AGE, null, 4);
                            localStorage.setItem('userNoteTable_AGE', JSON.stringify(userNoteTable_AGE));
                            markUserNotes(); // 刷新页面显示
                            alert("导入成功！");
                        } catch (error) {
                            alert("错误: 请检查JSON格式（其他行的末尾是有英文逗号的，最后一行的末尾是没有逗号的！），还不会就把错误代码和JSON内容放在AI里面询问：" + error);
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        };
        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出';
        exportBtn.style.marginLeft = '5px';
        exportBtn.onclick = () => {
            const blob = new Blob([textarea.value], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `user_notes_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.marginLeft = '5px';
        cancelBtn.onclick = () => modal.remove();

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.marginLeft = '5px';
        saveBtn.onclick = () => {
            try {
                const newNotes = JSON.parse(textarea.value);
                localStorage.setItem('userNoteTable_AGE', JSON.stringify(newNotes));
                userNoteTable_AGE = newNotes;
                markUserNotes();
                modal.remove();
            } catch (error) {
                alert('JSON格式错误：' + error.message);
            }
        };

        buttonContainer.append(importBtn, exportBtn, cancelBtn, saveBtn);
        modal.append(form, textarea, buttonContainer);
        document.body.appendChild(modal);
    }

    function addButtonFunctions() {
        const badgeUserPanel = document.querySelector("ul#badgeUserPanel");
        if (badgeUserPanel) {
            // 用户备注管理按钮
            const userNoteLi = document.createElement('li');
            const userNoteBtn = document.createElement('a');
            userNoteBtn.href = '#';
            userNoteBtn.textContent = '管理用户备注';
            userNoteBtn.onclick = (e) => { e.preventDefault(); openUserNoteManager(); };
            userNoteLi.appendChild(userNoteBtn);
            // 颜色管理按钮
            const colorLi = document.createElement('li');
            const colorBtn = document.createElement('a');
            colorBtn.href = '#';
            colorBtn.textContent = '管理颜色配置';
            colorBtn.onclick = (e) => { e.preventDefault(); openColorManager(); };
            colorLi.appendChild(colorBtn);

            badgeUserPanel.append(userNoteLi, colorLi);
        }
    }
    if (document.body) {
        markUserNotes();
    } else {
        window.onload = markUserNotes;
    }
    setTimeout(addButtonFunctions, 200);
})();
// ==UserScript==
// @name         卡巴姆特
// @namespace    https://github.com/123ldkop/kater-baha
// @version      1.5.0
// @description  將卡特介面改成類巴哈
// @match        https://kater.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kater.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454730/%E5%8D%A1%E5%B7%B4%E5%A7%86%E7%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/454730/%E5%8D%A1%E5%B7%B4%E5%A7%86%E7%89%B9.meta.js
// ==/UserScript==
 
(() => {
 
    (function BHload() {
        'use strict';
        const updateTime = "卡巴姆特";
        try {
            flarum.core.app.translator.addTranslations({
                "core.forum.composer_discussion.title": "發文",
                "core.forum.index.all_discussions_link": "文章列表",
                "core.forum.index.start_discussion_button": "發文",
                "kabamut.name": "卡巴姆特",
                "kabamut.nav.froum_rule": '站規',
                "kabamut.settings.beta_version": "beta測試版",
                "kabamut.settings.bala_cursor": "拔辣滑鼠游標",
                "kabamut.settings.preview": "顯示文章預覽",
                "kabamut.settings.notification": "卡特原版通知欄"
            });
        }
        catch {
            setTimeout(BHload, 1000);
            return;
        }
 
        var config = {
            beta_version: false,
            bala_cursor: false,
            preview: true,
            notification: false,
            customTags: null
        };
        try {
            config = Object.assign(config, JSON.parse(document.cookie.split('kabamut=')[1].split(';')[0]));
        }
        catch {
        }

        BH_style();
 
        (() => {
            var BH_store = {
                data: {
                    notifications: {},
                    discussions: {},
                    posts: {},
                    users: {}
                }
            };
 
            const admin = (() => {
                const admin_list = document.createElement('div');
                admin_list.id = 'BH_adminList';
 
                const xhr = new XMLHttpRequest();
                xhr.open("GET", `/api/users?filter[group]=1,4`);
                xhr.onload = () => {
 
                    const users = JSON.parse(xhr.response).data;
 
                    users.map(user => {
                        const div = document.createElement('div');
                        div.className = 'BH_adminItem';
 
                        const img = document.createElement('img');
                        img.className = 'BH_adminItemImg';
                        img.src = user.attributes.avatarUrl || "";
                        img.addEventListener('error', () => img.style.display = "none");
                        div.appendChild(img);
 
                        const userBlock = document.createElement('div');
                        userBlock.className = 'BH_adminItemBlock';
                        div.appendChild(userBlock);
 
                        const userCover = document.createElement('img');
                        userCover.className = 'BH_adminItemCover';
                        userCover.src = user.attributes.cover_thumbnail || "";
                        userCover.addEventListener('error', () => userCover.style.display = 'none');
                        userBlock.appendChild(userCover);
 
                        const userAvatar = document.createElement('img');
                        userAvatar.className = 'BH_adminItemAvatar';
                        userAvatar.src = user.attributes.avatarUrl || "";
                        userAvatar.addEventListener('error', () => userCover.style.display = 'none');
                        userBlock.appendChild(userAvatar);
 
                        const userName = document.createElement('div');
                        userName.className = 'BH_adminItemName';
                        userName.innerText = user.attributes.displayName;
                        userBlock.appendChild(userName);
 
                        const userId = document.createElement('div');
                        userId.className = 'BH_adminItemId';
                        userBlock.appendChild(userId);
 
                        const a = document.createElement('a');
                        a.innerText = user.attributes.username;
                        a.href = `/u/${user.attributes.username}`;
                        userId.appendChild(a);
                        userAvatar.addEventListener('click', (e) => {
                            if (!e.ctrlKey) a.click();
                        });
 
                        admin_list.appendChild(div);
                    });
 
                    append();
                }
                xhr.send();
 
                function append() {
                    const path = location.pathname;
                    if (path != "/" && !/^\/d\//.test(path)) return;
                    const parent = document.querySelector('.IndexPage .container') || document.querySelector('.Hero .container');
                    if (parent) parent.appendChild(admin_list);
                }
                return {
                    append: append
                }
            })();
 
            const multiImageUpload = (() => {
                var loading = false;
                const imgurClientID = app.forum.data.attributes["imgur-upload.client-id"];
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
 
                var uploading = false;
                const multiImage_iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M432 112V96a48.14 48.14 0 00-48-48H64a48.14 48.14 0 00-48 48v256a48.14 48.14 0 0048 48h16" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><rect x="96" y="128" width="400" height="336" rx="45.99" ry="45.99" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><ellipse cx="372.92" cy="219.64" rx="30.77" ry="30.55" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="M342.15 372.17L255 285.78a30.93 30.93 0 00-42.18-1.21L96 387.64M265.23 464l118.59-117.73a31 31 0 0141.46-1.87L496 402.91" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`;
                const multiImage_icon = document.createElement('button');
                multiImage_icon.className = 'Button hasIcon imgur-multi-upload-button hasIcon';
 
                const multiImage_li = document.createElement('li');
                multiImage_li.className = 'item-imgur-multi-upload';
                multiImage_li.addEventListener('click', () => {
                    if (uploading) return;
                    input.click();
                });
                multiImage_li.appendChild(multiImage_icon);
 
                input.addEventListener('change', (e) => {
                    uploading = true;
                    multiImage_icon.classList.remove('Button--icon');
                    multiImage_icon.innerText = "Uplaoding...";
                    Imgur(Array.prototype.slice.call(input.files));
                });
 
 
 
                async function Imgur(files) {
                    const form = new FormData();
                    form.append('image', files.shift());
                    const response = await fetch('https://api.imgur.com/3/image', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Client-ID ${imgurClientID}`
                        },
                        body: form
                    });
                    var res = await response.json();
                    const textrea = document.querySelector('.TextEditor-editor');
                    if (textrea == null) return;
                    if (res.success) textrea.value += `\n[URL=${res.data.link}][IMG]${res.data.link}[/IMG][/URL]`;
                    if (files.length > 0) Imgur(files);
                    else {
                        multiImage_icon.innerHTML = multiImage_iconSvg;
                        uploading = false;
                    }
                }
 
                function load() {
                    const singleImage = document.querySelector('.item-imgur-upload');
                    if (singleImage == null) {
                        setTimeout(load, 1000);
                        return;
                    }
 
                    if (document.querySelector('.item-imgur-multi-upload')) return;
                    multiImage_icon.classList.add('Button--icon');
                    multiImage_icon.innerHTML = multiImage_iconSvg;
                    singleImage.parentElement.insertBefore(multiImage_li, singleImage);
                    loading = false;
                }
 
                return {
                    append: () => {
                        if (loading) return;
                        loading = true;
                        load();
                    }
                }
            })();
 
            const BHmenu = (() => {
                var mode = "";
 
                const header = document.createElement('div');
                header.id = 'BH_header';
                document.getElementById('header').appendChild(header);
 
                const menu = document.createElement('div');
                menu.id = 'BH_headerMenu';
                header.appendChild(menu);
 
                const menu_focus = document.createElement('div');
                menu_focus.id = 'BH_headerMenuFocus';
                menu.appendChild(menu_focus);
 
                const tagItem = (() => {
                    var li = document.createElement('li');
                    li.style.display = 'none';
 
                    return {
                        get: () => {
                            return li;
                        },
                        find: (tagName) => {
                            const tag = Object.values(app.store.data.tags).find(e => e.data.attributes.slug == tagName);
                            li = document.createElement('li');
                            li.className = `item-tag${tag.data.id}`;
                            const a = document.createElement('a');
                            a.className = 'TagLinkButton hasIcon';
                            a.href = `/t/${tag.data.attributes.slug}`;
                            li.appendChild(a);
 
                            const span = document.createElement('span');
                            span.innerText = tag.data.attributes.name;
                            span.className = 'Button-label';
                            a.appendChild(span);
                        },
                        set: (element) => {
                            const clone = element.cloneNode(true);
                            clone.addEventListener('click', (e) => {
                                if (!e.ctrlKey) clone.querySelector('a').click();
                            });
                            menu.replaceChild(clone, li);
                            li = clone;
                            li.style.display = 'block';
                        },
                        hide: () => li.style.display = 'none'
                    }
                })();
 
                const replyBtn = document.createElement('li');
                replyBtn.id = 'BH-replay';
                replyBtn.addEventListener('click', () => {
                    document.querySelector('.SplitDropdown-button').click();
                    multiImageUpload.append();
                });
 
                function setFocusOut() {
                    const childs = menu.querySelector(".Dropdown-menu") || menu;
                    var child = menu.querySelector('.item-allDiscussions') || menu.querySelector('.item-posts');
                    if (child == null) return;
                    for (let i = 0; i < childs.childNodes.length; i++) {
                        if (childs.childNodes[i].className.indexOf('active') > -1) child = childs.childNodes[i];
                    }
                    menu_focus.style.left = `${child.offsetLeft}px`;
                    menu_focus.style.width = `${child.offsetWidth}px`;
                }
 
                return {
                    get: () => {
                        return mode;
                    },
                    clear: () => {
                        menu.innerHTML = "";
                    },
                    setTag: tagItem.find,
                    setReply: (e) => {
                        if (e) {
                            replyBtn.innerText = e;
                            return;
                        }
                        menu.appendChild(replyBtn);
                    },
                    create: () => {
                        const li_list = {
                            "core.forum.index.all_discussions_link": '/',
                            "fof-gamification.forum.nav.name": '/rankings',
                            "flarum-subscriptions.forum.badge.following_tooltip": '/following',
                            "clarkwinkelmann-bookmarks.forum.badge": '/bookmarks',
                            "flarum-tags.forum.index.tags_link": '/tags',
                            "kabamut.nav.froum_rule": '/d/87762'
                        };
                        mode = 'd';
                        menu.appendChild(menu_focus);
                        Object.keys(li_list).map((id, i) => {
                            const li = document.createElement('li');
                            if (i == 0) li.className = 'item-allDiscussions active';
 
                            const a = document.createElement('a');
                            a.className = 'BH_item-link';
                            a.href = li_list[id];
                            li.appendChild(a);
 
                            const span = document.createElement('span');
                            span.className = 'Button-label';
                            span.innerText = app.translator.translations[id];
                            a.appendChild(span);
 
                            li.addEventListener('click', (e) => {
                                if (!e.ctrlKey) a.click();
                            });
 
                            li.addEventListener('mouseenter', () => {
                                setTimeout(() => {
                                    menu_focus.style.left = `${li.offsetLeft}px`;
                                    menu_focus.style.width = `${li.offsetWidth}px`;
                                }, 10);
                            });
                            li.addEventListener('mouseout', setFocusOut);
 
                            menu.appendChild(li);
                        });
 
                        menu.appendChild(replyBtn);
                    },
                    discussions: () => {
                        mode = 'd';
                        menu.appendChild(menu_focus);
                        (function setMenu() {
                            var item_list;
                            try {
                                item_list = document.querySelector('.item-nav').querySelector('.Dropdown-menu.dropdown-menu ').childNodes;
                            }
                            catch {
                                setTimeout(setMenu, 1000);
                                return;
                            }
 
                            Array.prototype.slice.call(item_list).map(item => {
                                if (/allDiscussions|rankings|following|bookmarks|tags|separator/.test(item.className)) {
                                    if (menu.querySelector(`.${item.className.replace('active').trim()}`)) return;
                                    menu.appendChild(item);
 
                                    if (/separator/.test(item.className)) {
                                        item.className = 'item-forum_rule';
                                        const span = document.createElement('span');
                                        span.className = 'Button-label';
                                        span.innerText = app.translator.translations["kabamut.nav.froum_rule"];
 
                                        const a = document.createElement('a');
                                        a.href = '/d/87762';
                                        a.appendChild(span);
                                        item.appendChild(a);
                                    }
 
                                    item.addEventListener('click', (e) => {
                                        if (!e.ctrlKey) {
                                            Array.prototype.slice.call(menu.childNodes).map(i => i.classList.remove('active'));
                                            item.classList.add('active');
 
                                            item.querySelector('a').click();
                                            tagItem.hide();
                                        }
                                    });
 
                                    item.addEventListener('mouseenter', (e) => {
                                        setTimeout(() => {
                                            menu_focus.style.left = `${item.offsetLeft}px`;
                                            menu_focus.style.width = `${item.offsetWidth}px`;
                                        }, 10);
                                    });
                                    item.addEventListener('mouseout', setFocusOut);
 
                                    if (/allDiscussions/.test(item.className)) {
                                        const tag = tagItem.get();
                                        menu.appendChild(tag);
                                        if (tag.style.display != 'none') {
                                            item.classList.remove('active');
                                            tag.classList.add('active');
                                            tag.addEventListener('click', (e) => {
                                                if (!e.ctrlKey) tag.querySelector('a').click();
                                            });
                                        }
                                    }
                                }
                                else item.addEventListener('click', (e) => {
                                    if (!e.ctrlKey) tagItem.set(item);
                                });
                            });
                            setFocusOut();
                        })();
 
                        (function setPostBtn() {
                            try {
                                const postBtn = document.querySelector(".item-newDiscussion.App-primaryControl");
                                postBtn.querySelector('button').style.pointerEvents = 'auto';
                                menu.appendChild(postBtn);
                                postBtn.addEventListener('click', multiImageUpload.append);
                            }
                            catch {
                                setTimeout(setPostBtn, 1000);
                                return;
                            }
                        })();
                    },
                    user: () => {
                        mode = 'u';
                        menu.appendChild(menu_focus);
                        (function setMenu() {
                            var userMenu = document.querySelector('ul.affix-top') || document.querySelector('ul.affix') || document.querySelector('.item-nav');
                            if (userMenu) {
                                userMenu = userMenu.querySelector('.Dropdown-menu');
                                menu.appendChild(userMenu);
                                const childs = userMenu.childNodes;
                                for (let i = 0; i < childs.length; i++) {
                                    const child = childs[i];
                                    child.addEventListener('click', (e) => {
                                        if (!e.ctrlKey) {
                                            Array.prototype.slice.call(childs).map(i => i.classList.remove('active'));
                                            child.classList.add('active');
                                            child.querySelector('a').click();
                                        }
                                    });
 
                                    child.addEventListener('mouseenter', () => {
                                        setTimeout(() => {
                                            menu_focus.style.left = `${child.offsetLeft}px`;
                                            menu_focus.style.width = `${child.offsetWidth}px`;
                                        }, 10);
                                    });
                                    child.addEventListener('mouseout', setFocusOut);
                                }
                                setFocusOut();
                            }
                            else setTimeout(setMenu, 1000);
                        })();
                    }
                }
            })();
 
            const settings = (() => {
 
                const ul = document.createElement('ul');
 
                Object.keys(config).map(configName => {
                    if (!app.translator.translations[`kabamut.settings.${configName}`]) return;
                    const text = document.createTextNode(app.translator.translations[`kabamut.settings.${configName}`]);
 
                    const inputDisplay = document.createElement('div');
                    inputDisplay.className = 'Checkbox-display';
                    inputDisplay.ariaHidden = true;
 
                    const label = document.createElement('label');
                    label.className = `Checkbox on Checkbox--switch`;
 
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = true;
                    input.addEventListener('change', () => {
                        if (input.checked) label.className = label.className.replace(/off/, 'on');
                        else label.className = label.className.replace(/on/, 'off');
                        config[configName] = input.checked;
                        saveSettings();
                    });
                    label.appendChild(input);
                    label.appendChild(inputDisplay);
                    label.appendChild(text);
 
                    if (!config[configName]) {
                        input.checked = false;
                        label.className = label.className.replace(/on/, 'off');
                    }
 
                    const li = document.createElement('li');
                    li.className = `item-${configName}`;
                    li.appendChild(label);
                    ul.appendChild(li);
                });
 
                const fieldset = document.createElement('fieldset');
                fieldset.className = 'Settings-kabamut';
                fieldset.innerHTML = `<legend>${app.translator.translations["kabamut.name"]}</legend>`;
                fieldset.appendChild(ul);
 
                const item_li = document.createElement('li');
                item_li.className = 'item-kabamut';
                item_li.appendChild(fieldset);
 
                function saveSettings() {
                    document.cookie = `kabamut=${JSON.stringify(config)}; expires=Thu Jan 01 2122 00:00:00 GMT`;
                }
 
                return {
                    load: () => {
                        document.querySelector('.SettingsPage > ul').appendChild(item_li);
                    },
                    save: saveSettings
                }
            })();
 
            const CustomTags = (() => {
 
                const CustomTagsSelect = (() => {
                    const tagsSelect = document.createElement('div');
                    tagsSelect.className = 'BH_tagsSelect';
 
                    const tagsSelectClose = document.createElement('div');
                    tagsSelectClose.className = 'BH_tagsSelectClose';
                    tagsSelect.appendChild(tagsSelectClose);
                    tagsSelectClose.addEventListener('click', hide);
 
                    const tagsSelectMain = document.createElement('div');
                    tagsSelectMain.className = 'BH_tagsSelectMain';
                    tagsSelect.appendChild(tagsSelectMain);
 
                    const tagsSelectNavBorder = document.createElement('div');
                    tagsSelectNavBorder.className = 'BH_tagsSelectNavBorder';
                    tagsSelectMain.appendChild(tagsSelectNavBorder);
 
                    const tagsSelectNav = document.createElement('div');
                    tagsSelectNav.className = 'BH_tagsSelectNav';
                    tagsSelectNavBorder.appendChild(tagsSelectNav);
 
                    const nowTags = (config.customTags) ? `,${config.customTags},` : '';
 
                    Object.values(app.store.data.tags).map(tag => {
                        const tagItem = document.createElement('div');
                        tagItem.className = 'tagsSelectItem';
 
                        const tagCheckbox = document.createElement('input');
                        tagCheckbox.type = 'checkbox';
                        tagCheckbox.dataset.tagName = tag.data.attributes.slug;
                        if (nowTags.indexOf(tag.data.attributes.slug) > -1) tagCheckbox.checked = true;
                        tagItem.appendChild(tagCheckbox);
 
                        const tagCheck = document.createElement('div');
                        tagCheck.className = 'tagsSelectItemCheck';
                        tagItem.appendChild(tagCheck);
 
                        const tagIcon = document.createElement('i');
                        tagIcon.className = tag.data.attributes.icon;
                        tagIcon.classList.add("Button-icon", "icon");
                        tagItem.appendChild(tagIcon);
 
                        const tagName = document.createElement('span');
                        tagName.innerText = tag.data.attributes.name;
                        tagItem.appendChild(tagName);
 
                        tagsSelectNav.appendChild(tagItem);
                    });
 
                    const tagsSelectConfirm = document.createElement('button');
                    tagsSelectConfirm.className = 'tagsSelectButton';
                    tagsSelectConfirm.innerText = "確認";
                    tagsSelectMain.appendChild(tagsSelectConfirm);
                    tagsSelectConfirm.addEventListener('click', () => {
                        const input_list = Array.prototype.slice.call(tagsSelectNav.getElementsByTagName('input'))
                        const slugs = input_list.filter(input => input.checked).map(input => input.dataset.tagName).toString();
                        config.customTags = (slugs == "") ? null : slugs;
                        settings.save();
                        hide();
                        CustomTags.discussions();
                    });
 
                    const tagsSelectClear = document.createElement('button');
                    tagsSelectClear.className = 'tagsSelectButton';
                    tagsSelectClear.innerText = "清除";
                    tagsSelectMain.appendChild(tagsSelectClear);
                    tagsSelectClear.addEventListener('click', () => {
                        Array.prototype.slice.call(tagsSelectNav.getElementsByTagName('input')).forEach(input => input.checked = false);
                    });
 
                    function hide() {
                        document.body.style.overflowY = 'auto';
                        document.body.removeChild(tagsSelect);
                    }
 
                    return {
                        show: () => {
                            document.body.style.overflowY = 'hidden';
                            document.body.appendChild(tagsSelect);
                        },
                        hide: hide
                    }
                })();
 
 
                const span = document.createElement('span');
                span.className = 'Button-label';
                span.innerText = '自訂';
 
                const a = document.createElement('a');
                a.appendChild(span);
 
                const li = document.createElement('li');
                li.className = 'item-tagCustom';
                li.appendChild(a);
                li.addEventListener('click', CustomTagsSelect.show);
 
 
 
                return {
                    append: async () => {
                        if (document.querySelector('.item-tagCustom')) return;
                        document.querySelector('.item-nav .Dropdown-menu').appendChild(li);
                    },
                    discussions: () => {
                        app.discussions.refreshParams({
                            include: 'user,lastPostedUser,tags,tags.parent,firstPost',
                            tags: config.customTags,
                            onFollowing: false,
                            bookmarked: false
                        });
                    }
                }
            })();
 
 
            const welcomeImage = (() => {
                const BH_welcomeImage = document.createElement('div');
                BH_welcomeImage.className = "BH_welcomeImage";
 
                const img = document.createElement('img');
                BH_welcomeImage.appendChild(img);
 
                function selectMode() {
                    var dark = false;
                    try {
                        dark = /dark/.test(document.querySelector('.nightmode').href);
                    }
                    catch {
                        dark = (document.querySelector('.nightmode-dark') != null);
                    }
                    
                    if (dark) {
                        img.src = "https://i.imgur.com/jPVrNbs.png";
                    } else {
                        img.src = "https://i.imgur.com/GIXE34y.png";
                    }
                }
 
 
                return {
                    append: () => {
                        selectMode();
                        if (location.pathname.replace(/\//, '') != "") return;
                        const home = document.querySelector('.IndexPage .container');
                        if (home == null || home.querySelector('.BH_welcomeImage')) return;
                        home.insertBefore(BH_welcomeImage, home.querySelector('div'));
                    },
                    selectMode: selectMode
                }
            })();
 
            setInterval(() => {
                if (app.current.data.kabamut) return;
                var route = app.current.data.routeName;
                app.current.data.kabamut = route;
                welcomeImage.append();
                if (route == 'kabamut') return;
                switch (route.replace(/\..*/g, '')) {
                    case "tag":
                        BHmenu.clear();
                        BHmenu.discussions();
                        CustomTags.append();
                        admin.append();
                        break;
                    case "index":
                        if (/[?&]q=/.test(location.search)) app.current.data.kabamut = 'search';
                        BHmenu.clear();
                        BHmenu.discussions();
                        CustomTags.append();
                        admin.append();
                        if (config.customTags && app.current.data.kabamut != 'search') CustomTags.discussions();
                        break;
                    case "user":
                        BHmenu.clear();
                        BHmenu.user();
                        break;
                    case "discussion":
                        if (BHmenu.get() != 'd') {
                            BHmenu.clear();
                            BHmenu.create();
                        }
                        else BHmenu.setReply();
                        admin.append();
                        break;
                    case "settings":
                        BHmenu.clear();
                        BHmenu.user();
                        settings.load();
                        break;
                }
            }, 1000);
 
 
            (function setLang() {
                try {
                    BHmenu.setReply(app.translator.translations["core.forum.discussion_controls.reply_button"]);
                    const alertId = app.alerts.show(updateTime);
                    setTimeout(() => app.alerts.clear(alertId), 3000);
                }
                catch {
                    setTimeout(setLang, 1000);
                }
            })();
 
            (function search() {
                const head = document.querySelector(".container");
                const search = document.querySelector(".item-search");
 
                if (search) {
                    search.parentNode.removeChild(search);
                    head.appendChild(search);
                }
                else setTimeout(search, 1000);
            })();
 
            (function headerItem() {
                try {
                    const locale = document.querySelector(".item-locale");
                    locale.parentNode.removeChild(locale);
                }
                catch {
                    setTimeout(headerItem, 1000);
                    return;
                }
                const itemSession = document.querySelector(".item-session");
                const itemSessionBtn = itemSession.querySelector(".Dropdown-toggle");
                const clientMenu = itemSession.querySelector('.Dropdown-menu').querySelector('.item-profile');
                const clientUrl = clientMenu.querySelector('a');
                clientUrl.style.display = 'none';
                const childs = itemSessionBtn.childNodes;
                for (let i = 0; i < childs.length; i++) {
                    const child = childs[i];
                    itemSessionBtn.removeChild(child);
                    if (child.className != 'Button-label') {
                        if (child.className.trim() == 'Avatar' && window.app.session.user) {
                            child.addEventListener('click', (e) => {
                                if (!e.ctrlKey) clientUrl.click();
                            });
                        }
                        itemSession.appendChild(child);
                    };
                }
 
                const client = document.createElement('div');
                client.className = "BH_Client";
                client.addEventListener('click', (e) => {
                    if (!e.ctrlKey) clientUrl.click();
                });
 
                const clientAvatar = document.createElement('img');
                clientAvatar.className = 'BH_ClientAvatar';
                clientAvatar.src = window.app.session.user.data.attributes.avatarUrl;
                client.appendChild(clientAvatar);
 
                const clientName = document.createElement('div');
                clientName.className = 'BH_ClientName';
                clientName.innerText = window.app.session.user.data.attributes.displayName;
                client.appendChild(clientName);
 
                const clientId = document.createElement('div');
                clientId.className = 'BH_ClientId';
                clientId.innerText = window.app.session.user.data.attributes.username;
                client.appendChild(clientId);
 
                clientMenu.querySelector('a').innerHTML = "";
                clientMenu.appendChild(client);
 
                (function setSelectModeEvent() {
                    const modeItem = itemSession.querySelector('.Dropdown-menu .item-nightmode') || itemSession.querySelector('.Dropdown-menu .item-daymode');
                    modeItem.querySelector('button').addEventListener('click', () => {
                        setTimeout(() => {
                            welcomeImage.selectMode();
                            setSelectModeEvent();
                        }, 10)
                    });
                })()
            })();
 
            (function PreviewImage() {
                (function getDiscussionTimer() {
                    const discussion = document.querySelector('.DiscussionListItem');
                    if (!/index|search|following|tag/.test(app.current.data.kabamut) || discussion == null || !config.preview) {
                        Timer(getDiscussionTimer, 1000);
                        return;
                    }
                    (function getDiscussion(msgID) {
                        const discussion = document.querySelector('.DiscussionListItem');
                        if (discussion == null) {
                            app.alerts.clear(msgID);
                            Timer(getDiscussionTimer, 1000);
                            return;
                        }
 
                        discussion.classList.remove('DiscussionListItem');
                        discussion.classList.add('BH_DiscussionListItem');
                        try {
                            const id = discussion.parentNode.dataset.id;
                            setPreviewImage(discussion, id);
                        }
                        catch {
 
                        }
                        getDiscussion(msgID);
                    })(app.alerts.show("preview image loading"));
                })();
 
                async function setPreviewImage(element, id) {
                    const discussion = app.store.data.discussions[id].data;
                    const post = app.store.data.posts[discussion.relationships.firstPost.data.id];
                    const contentHTML = post.data.attributes.contentHtml;
                    const div = document.createElement('div');
                    div.innerHTML = contentHTML;
 
                    const previewTag = setPreviewTag(element, discussion);
                    if (/<img/.test(contentHTML)) {
                        const img = div.querySelector('img');
                        const previewImg = document.createElement('img');
                        previewImg.className = 'BH_previewImage';
                        previewImg.src = img.src;
                        if (detailsCheck(div) || r18Check(discussion)) previewImg.dataset.blur = true;
                        previewTag.appendChild(previewImg);
                        img.addEventListener('error', () => {
                            previewTag.removeChild(img);
                        })
                    }
 
                    if (app.current.data.kabamut == 'search') return;
                    var content = div.innerText.replace(/\n/g, '');
                    if (content.length > 100) content = content.substring(0, 100) + '...';
                    const previewContent = document.createElement('div');
                    previewContent.className = 'BH_previewContent';
                    previewContent.innerText = content;
                    element.querySelector('.DiscussionListItem-main').appendChild(previewContent);
                }
 
                function detailsCheck(body) {
                    if (/<details .*<img.*<\/details>/.test(body.innerHTML)) {
                        return (function perntNode(element) {
                            if (element.tagName == 'DETAILS') return true;
                            if (element.parentNode) return perntNode(element.parentNode);
                            return false;
                        })(body.querySelector('img'));
                    }
                    else false;
                }
 
                function r18Check(discussion) {
                    if (app.current.data.routeName == 'tag') return false;
                    const tags = discussion.relationships.tags.data.filter(tag => /^7$|10|19|22|38|39|44|45|46/.test(tag.id));
                    return (tags.length > 0);
                }
 
                function setPreviewTag(element, discussion) {
 
                    const tags = discussion.relationships.tags.data.map(tag => app.store.data.tags[tag.id].data.attributes);
 
                    const previewImg = document.createElement('div');
                    previewImg.className = 'BH_previewImage';
                    if (tags.length > 1) {
                        var text = "";
 
                        const max = tags.length - 1;
                        var borderColor = "";
                        tags.map((tag, i) => {
                            const color = (tag.color != "") ? tag.color : "#FFFFFF";
                            borderColor += `,${color} ${Math.floor(100 * (i / max))}%`;
                            text += ` <span style="color:${color}">${tag.name}</span>`;
                        });
 
                        previewImg.innerHTML = text;
                        previewImg.style.borderImage = `linear-gradient(135deg${borderColor})`;
                        previewImg.style.borderImageSlice = '1';
                    }
                    else {
                        previewImg.dataset.text = tags[0].name;
                        previewImg.style.color = tags[0].color;
                        previewImg.style.borderColor = tags[0].color;
                    }
 
                    element.appendChild(previewImg);
                    return previewImg;
                }
            })();
 
            (function notifications() {
                if (config.notification) return;
 
                const originalNotifications = document.querySelector('.item-notifications');
                if (originalNotifications == null) {
                    setTimeout(notifications, 1000);
                    return;
                }
 
                const IconUrl = '/assets/favicon-gtoqtyic.png';
                var IconUrl_alert;
                const iconElement = document.createElement('link');
                iconElement.rel = 'icon';
                iconElement.href = IconUrl;
                document.head.appendChild(iconElement);
                (() => {
                    const canvas = document.createElement('canvas');
                    const icon = new Image();
                    icon.onload = () => {
                        canvas.width = icon.width;
                        canvas.height = icon.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(icon, 0, 0);
                        ctx.beginPath();
                        ctx.fillStyle = "#F00";
                        ctx.arc(52, 12, 12, 0, 2 * Math.PI);
                        ctx.fill();
 
                        const dataURL = canvas.toDataURL('image/png');
                        const base64 = atob(dataURL.split(',')[1]);
                        const array = []
                        for (let i = 0; i < base64.length; i++) {
                            array.push(base64.charCodeAt(i))
                        }
                        const iconFile = new Blob([new Uint8Array(array)], { type: 'image/png' });
                        IconUrl_alert = URL.createObjectURL(iconFile);
                    }
                    icon.src = IconUrl;
                })();
 
                var notifications_list = {};
                var notifications_num = 0;
                var notifications_next = "";
                var notifications_state = "";
                const notificationNoreadNum = document.createElement('span');
                notificationNoreadNum.id = 'BH_notificationNoreadNum';
 
                const notificationsTable = document.createElement('div');
                notificationsTable.id = 'BH_notificationsTable';
 
                const notificationsTableBorder = document.createElement('div');
                notificationsTableBorder.id = 'BH_notificationsTableBorder';
                notificationsTableBorder.appendChild(notificationsTable);
 
                const notificationBtn = document.createElement('li');
                notificationBtn.id = 'BH_notificationBtn';
                notificationBtn.appendChild(notificationNoreadNum);
 
                const notificationsLi = document.createElement('li');
                notificationsLi.id = 'BH_notificationLi';
                notificationsLi.appendChild(notificationBtn);
                notificationsLi.appendChild(notificationsTableBorder);
 
                originalNotifications.parentNode.insertBefore(notificationsLi, originalNotifications);
                originalNotifications.parentNode.removeChild(originalNotifications);
 
                notificationsTable.addEventListener('scroll', (e) => {
                    if (notifications_state == "" && notificationsTable.scrollTop == notificationsTable.scrollTopMax) {
                        notifications_state = "loading";
                        getNotification(notifications_next, (res) => {
                            if (res.links.next) notifications_next = res.links.next;
                            else notifications_state = "end";
                            res.data.map(data => {
                                if (BH_store.data.notifications[data.id]) return;
                                BH_store.data.notifications[data.id] = data;
                                const id = `${data.attributes.contentType}${data.relationships.subject.data.type}${data.relationships.subject.data.id}`;
                                if (data.attributes.contentType != 'postMentioned' && notifications_list[id]) return;
 
                                const notification = createNotificationItem(data);
                                if (!data.attributes.isRead) {
                                    notifications_num++;
                                    notification.item.classList.add('BH_noRead');
                                }
                                notifications_list[id] = notification;
                                notificationsTable.appendChild(notification.item);
                            });
                            notifications_state = "";
                        });
                    }
                });
 
                notificationBtn.addEventListener('click', () => {
                    Object.values(notifications_list).map(item => item.updateTime());
                    setTimeout(() => notificationsTableBorder.style.display = 'block', 10);
                    if (notifications_num > 0) allRead();
                    notifications_num = 0;
                    notificationNoreadNum.style.display = 'none';
                });
 
                function allRead() {
                    iconElement.href = IconUrl;
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", `/api/notifications/read`);
                    xhr.setRequestHeader('X-CSRF-Token', app.session.csrfToken);
                    xhr.send();
                }
 
                document.addEventListener('click', () => {
                    if (notificationsTableBorder.style.display == 'block') {
                        notificationsTableBorder.style.display = 'none';
                        (function removeNoRead() {
                            const item = notificationsTable.querySelector('.BH_noRead');
                            if (item) {
                                item.classList.remove('BH_noRead');
                                removeNoRead();
                            }
                        })();
                    }
                });
                getNotification("page[limit]=30&sort=-createdAt", (res) => {
                    notifications_next = res.links.next;
                    res.data.map(data => {
                        BH_store.data.notifications[data.id] = data;
                        const id = `${data.attributes.contentType}${data.relationships.subject.data.type}${data.relationships.subject.data.id}`;
 
                        if (data.attributes.contentType != 'postMentioned' && notifications_list[id]) return;
 
                        const notification = createNotificationItem(data);
                        if (!data.attributes.isRead) {
                            notifications_num++;
                            notification.item.classList.add('BH_noRead');
                        }
                        notifications_list[id] = notification;
                        notificationsTable.appendChild(notification.item);
                    });
 
                    setNotificationNoreadNum();
                });
 
                function getNotificationTimer() {
                    setTimeout(getNotificationTimer, 300000);
                    getNotification('page[limit]=20&sort=-createdAt', (res) => {
                        res.data.filter(e => e.attributes.isRead == false).reverse().map(data => {
                            if (BH_store.data.notifications[data.id]) return;
                            BH_store.data.notifications[data.id] = data;
 
                            const notification = createNotificationItem(data);
                            notifications_num++;
                            notification.item.classList.add('BH_noRead');
 
 
                            const id = `${data.attributes.contentType}${data.relationships.subject.data.type}${data.relationships.subject.data.id}`;
                            if (data.attributes.contentType != 'postMentioned' && notifications_list[id]) {
                                notifications_list[id].item.parentNode.removeChild(notifications_list[id].item);
                                notifications_list[id] = notification;
                            }
 
                            notificationsTable.insertBefore(notification.item, notificationsTable.firstChild);
                        });
                        setNotificationNoreadNum();
                    });
                }
                Timer(getNotificationTimer, 300000);
 
                function setNotificationNoreadNum() {
                    if (notifications_num > 0) {
                        notificationNoreadNum.innerText = (notifications_num > 99) ? '99+' : notifications_num;
                        notificationNoreadNum.style.display = 'block';
                        iconElement.href = IconUrl_alert;
                    }
                    else notificationNoreadNum.style.display = 'none';
                }
 
                function createNotificationItem(data) {
                    const notificationItem = document.createElement('div');
                    notificationItem.className = 'BH_notificationItem';
 
                    const userID = data.relationships.fromUser.data.id;
                    const fromUser = BH_store.data.users[userID] || app.store.data.users[userID];
                    const notificationFromUser = document.createElement('img');
                    notificationFromUser.className = 'BH_notificationFromUser';
                    notificationFromUser.src = fromUser.data.attributes.avatarUrl;
                    notificationItem.appendChild(notificationFromUser);
                    notificationFromUser.addEventListener('error', () => {
                        const notificationFromUserText = document.createElement('div');
                        notificationFromUserText.className = 'BH_notificationFromUser';
                        var bgColor = parseInt(fromUser.data.id).toString(16);
                        while (bgColor.length < 6) bgColor += 'f';
                        notificationFromUserText.style.backgroundColor = `#${bgColor}`;
                        notificationFromUserText.innerText = fromUser.data.attributes.displayName[0];
                        notificationItem.replaceChild(notificationFromUserText, notificationFromUser);
                    });
 
                    const notificationText = document.createElement('div');
                    notificationText.className = 'BH_notificationText';
                    notificationItem.appendChild(notificationText);
 
                    const notificationTitleText = document.createElement('p');
                    notificationTitleText.className = 'BH_notificationTitleText';
                    notificationText.appendChild(notificationTitleText);
 
                    var url = "";
                    var post;
                    var discussion;
                    switch (data.relationships.subject.data.type) {
                        case "posts":
                            post = BH_store.data.posts[data.relationships.subject.data.id];
                            discussion = BH_store.data.discussions[post.data.relationships.discussion.data.id];
                            url = `/d/${discussion.data.id}/${post.data.attributes.number}`;
                            break;
                        case "discussions":
                            discussion = BH_store.data.discussions[data.relationships.subject.data.id];
                            url = `/d/${discussion.data.id}/${data.attributes.content.postNumber}`;
                            break;
                    }
 
                    const discussionTitle = discussion.data.attributes.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
 
                    switch (data.attributes.contentType) {
                        case "vote":
                            const div = document.createElement('div');
                            div.innerHTML = post.data.attributes.contentHtml;
 
                            notificationTitleText.innerHTML = `在 <span class="BH_notificationLinkText">${discussionTitle}</span> 中獲得了推<br>`;
                            const notificationContentText = document.createElement('p');
                            notificationContentText.className = 'BH_notificationContentText';
                            notificationContentText.innerText = div.innerText.replace(/\n/g, '');
                            notificationText.appendChild(notificationContentText);
                            break;
                        case "newPost":
                            notificationTitleText.innerHTML = `在 <span class="BH_notificationLinkText">${discussionTitle}</span> 中有了新的回應`;
                            break;
                        case "postMentioned":
                            notificationTitleText.innerHTML = `<span class="BH_notificationLinkText">${fromUser.data.attributes.displayName}</span> 在回覆中提到了你`;
                            break;
                    }
 
                    const notificationTime = document.createElement('span');
                    notificationTime.className = 'BH_notificationTime';
                    notificationTime.innerText = getTime(data.attributes.createdAt);
                    notificationItem.appendChild(notificationTime);
 
                    notificationItem.addEventListener('click', () => {
                        window.open(url);
                    });
 
                    return {
                        item: notificationItem,
                        updateTime: () => {
                            notificationTime.innerText = getTime(data.attributes.createdAt);
                        }
                    };
                }
 
                function getTime(timeText) {
                    const time = new Date(timeText);
                    const ms = parseInt(new Date() - time);
                    const s = ms / 1000;
                    const m = s / 60;
                    const h = m / 60;
                    const d = h / 24;
                    const t = [d, h, m, s];
                    const f = ["天", "小時", "分鐘", "秒"];
 
 
                    for (let i = 0; i < t.length; i++) {
                        if (Math.floor(t[i]) > 0) return `${Math.floor(t[i])}${f[i]}前`;
                    }
                    return "";
                }
 
                async function getNotification(url, callback) {
                    if (!/http/.test(url)) url = `/api/notifications?${url}`;
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", url);
                    xhr.onload = () => {
                        const res = JSON.parse(xhr.response);
                        res.included.map(item => {
                            BH_store.data[item.type][item.id] = { data: item };
                        });
                        if (callback) callback(res);
                    }
                    xhr.send();
                }
            })();
 
            (function DiscussionElement() {
                const DiscussionImageElement = (() => {
                    const fullScreenImageBorder = document.createElement('div');
                    fullScreenImageBorder.id = 'BH_fullScreenImageBorder';
 
                    const fullScreenImageClose = document.createElement('div');
                    fullScreenImageClose.id = 'BH_fullScreenImageClose';
                    fullScreenImageBorder.appendChild(fullScreenImageClose);
                    fullScreenImageClose.addEventListener('click', () => {
                        document.body.removeChild(fullScreenImageBorder);
                        document.body.style.overflowY = 'scroll';
                    });
 
                    var ImgMove;
                    var mouseMove;
                    var ImgResize = 1;
                    const fullScreenImage = document.createElement('img');
                    fullScreenImage.id = 'BH_fullScreenImage';
                    fullScreenImageBorder.appendChild(fullScreenImage);
                    fullScreenImage.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                    });
                    fullScreenImageBorder.addEventListener('mousedown', (e) => mouseMove = { x: e.clientX, y: e.clientY });
                    fullScreenImageBorder.addEventListener('mousemove', (e) => {
                        if (mouseMove) {
                            ImgMove.x += e.clientX - mouseMove.x;
                            ImgMove.y += e.clientY - mouseMove.y;
                            mouseMove = {
                                x: e.clientX,
                                y: e.clientY
                            };
                            fullScreenImage.style.top = `calc(50% - ${fullScreenImage.height / 2 - ImgMove.y}px)`;
                            fullScreenImage.style.left = `calc(50% - ${fullScreenImage.width / 2 - ImgMove.x}px)`;
                        }
                    });
                    fullScreenImageBorder.addEventListener('mouseup', () => {
                        mouseMove = null;
                    });
 
                    fullScreenImage.addEventListener('wheel', (e) => {
                        if (e.wheelDeltaY > 0) {
                            ImgResize += 0.1;
                            fullScreenImage.style.transformOrigin = `${e.layerX}px ${e.layerY}px`;
                        }
                        else if (ImgResize > 1) ImgResize -= 0.1;
                        fullScreenImage.style.transform = `scale(${ImgResize})`;
                    });
 
                    const fullScreenImageUrl = document.createElement('div');
                    fullScreenImageUrl.id = 'BH_fullScreenImageUrl';
                    fullScreenImageBorder.appendChild(fullScreenImageUrl);
                    fullScreenImageUrl.addEventListener('click', () => window.open(fullScreenImageUrl.dataset.url));
 
                    function imgVisible(img) {
                        fullScreenImage.style.display = 'none';
                        const Img = new Image();
                        Img.addEventListener('error', (e) => {
                            console.log(e);
                        });
                        Img.addEventListener('load', () => {
                            fullScreenImage.src = Img.src;
                            const maxWidth = window.innerWidth - 100;
                            const maxHeight = window.innerHeight - 100;
                            const widthS = maxWidth / Img.width;
                            const heightS = maxHeight / Img.height;
 
                            if (widthS < 1 || heightS < 1) {
                                if (widthS < heightS) {
                                    fullScreenImage.width = Img.width * widthS;
                                    fullScreenImage.height = Img.height * widthS;
                                }
                                else {
                                    fullScreenImage.width = Img.width * heightS;
                                    fullScreenImage.height = Img.height * heightS;
                                }
                            }
                            else {
                                fullScreenImage.width = Img.width;
                                fullScreenImage.height = Img.height;
                            }
                            ImgResize = 1;
                            ImgMove = {
                                x: 0,
                                y: 0
                            };
                            fullScreenImage.style.top = `calc(50% - ${fullScreenImage.height / 2}px)`;
                            fullScreenImage.style.left = `calc(50% - ${fullScreenImage.width / 2}px)`;
                            fullScreenImage.style.transform = `scale(${ImgResize})`;
                            fullScreenImage.style.display = 'block';
                        });
                        Img.src = img.src.replace(/h\./, '.');
                        if (img.parentNode.tagName == 'A') {
                            const url = img.parentNode.href;
                            fullScreenImageUrl.dataset.url = url;
                            fullScreenImageUrl.innerText = url;
                            fullScreenImageUrl.style.display = 'block';
                        }
                        else fullScreenImageUrl.style.display = 'none';
                        document.body.appendChild(fullScreenImageBorder);
                        document.body.style.overflowY = 'hidden';
                    }
 
                    return {
                        load: imgVisible
                    }
                })();
 
                const AlonePostsElement = (() => {
 
                    const AlonePosts = (() => {
 
                        var state = "";
                        var nextUrl = "";
                        var discussionID = "";
 
                        const alonePosts = document.createElement('div');
                        alonePosts.className = 'BH_alonePosts';
 
                        const alonePostsClose = document.createElement('div');
                        alonePostsClose.className = 'BH_alonePosts-close';
                        alonePostsClose.addEventListener('click', close);
                        alonePosts.appendChild(alonePostsClose);
 
 
                        const postUser = document.createElement('div');
                        postUser.className = 'BH_alonePosts-user'
                        alonePosts.appendChild(postUser);
 
                        const postUserBackgroundColor = document.createElement('div');
                        postUserBackgroundColor.className = 'BH_alonePosts-userBackground';
                        postUser.appendChild(postUserBackgroundColor);
 
                        const postUserBackground = document.createElement('img');
                        postUserBackground.className = 'BH_alonePosts-userBackground';
                        postUserBackground.addEventListener('load', () => {
                            postUserBackground.style.display = 'block';
                            postUserBackgroundColor.style.backgroundColor = 'transparent';
                        });
                        postUser.appendChild(postUserBackground);
 
                        const postUserAvatar = document.createElement('div');
                        postUserAvatar.className = 'BH_alonePosts-userAvatar';
                        postUser.appendChild(postUserAvatar);
 
                        const postUserName = document.createElement('li');
                        postUserName.className = 'BH_alonePosts-userName';
                        postUser.appendChild(postUserName);
 
                        const postStreamBorder = document.createElement('div');
                        postStreamBorder.className = 'BH_alonePosts-postStreamBorder';
                        alonePosts.appendChild(postStreamBorder);
 
                        const postStream = document.createElement('div');
                        postStream.className = 'BH_alonePosts-postStream';
                        postStreamBorder.appendChild(postStream);
                        postStream.addEventListener('scroll', () => {
                            if (postStream.scrollTop != postStream.scrollTopMax || state != "") return;
                            state = 'loading';
                            appendPosts(nextUrl);
                        });
 
                        function appendPosts(url) {
                            const xhr = new XMLHttpRequest();
                            xhr.open("GET", url);
                            xhr.setRequestHeader('X-CSRF-Token', app.session.csrfToken);
                            xhr.onload = () => {
                                const res = JSON.parse(xhr.response);
                                nextUrl = res.links.next || null;
                                if (nextUrl == null) state = 'end';
                                else state = "";
                                res.data.map(PostItem);
                            }
                            xhr.send();
                        }
 
                        function PostItem(post) {
                            if (post.attributes.contentType != "comment") return;
                            const postItem = document.createElement('div');
                            postItem.className = 'BH_alonePosts-item';
 
                            const content = document.createElement('div');
                            content.className = 'BH_alonePosts-content Post-body';
                            content.innerHTML = post.attributes.contentHtml;
                            postItem.appendChild(content);
 
                            const a = document.createElement('a');
                            a.className = 'BH_alonePosts-link';
                            a.href = `/d/${discussionID}/${post.attributes.number}`;
                            postItem.appendChild(a);
 
                            const num = document.createElement('span');
                            num.className = 'BH_alonePosts-number';
                            num.innerText = post.attributes.number + flarum.core.app.translator.translations["kater-gamificationextend.forum.louceng"];
                            a.appendChild(num);
 
                            postStream.appendChild(postItem);
                        }
 
                        function close() {
                            document.body.removeChild(alonePosts);
                            document.body.style.overflowY = 'scroll';
                        }
 
                        function setUser(uid) {
                            const user = app.store.data.users[uid].data.attributes;
                            if (user.avatarUrl == "") postUserAvatar.innerText = user.displayName[0];
                            else {
                                postUserAvatar.innerHTML = "";
                                postUserAvatar.style.backgroundImage = `url("${user.avatarUrl}")`;
                            }
 
                            var bgColor = parseInt(uid).toString(16);
                            while (bgColor.length < 6) bgColor += 'f';
                            postUserBackgroundColor.style.backgroundColor = `#${bgColor}`;
 
                            postUserBackground.style.display = 'none';
                            postUserBackground.src = user.cover_thumbnail || user.cover;
                            postUserName.innerText = user.displayName;
                        }
 
                        return {
                            setUser: (e) => {
                                document.body.style.overflowY = 'hidden';
                                state = "";
                                postStream.innerHTML = "";
                                const userName = e.target.dataset.id;
                                const userUID = e.target.dataset.uid;
                                discussionID = location.href.split('/d/')[1].split('/')[0];
                                setUser(userUID);
                                appendPosts(`/api/posts?filter[discussion]=${discussionID}&filter[author]=${userName}&page[offset]=0&page[limit]=50`);
                                document.body.appendChild(alonePosts);
                            }
                        }
                    })();
 
 
                    function MenuCheck(button) {
                        const menu = button.parentNode.querySelector('.Dropdown-menu');
                        if (menu.querySelector('.item-alonePosts')) return null;
                        return menu;
                    }
 
                    function getUser(menu) {
                        const postElement = menu.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        const postID = postElement.dataset.id;
                        const post = app.store.data.posts[postID];
                        const userID = post.data.relationships.user.data.id;
                        return app.store.data.users[userID].data;
                    }
 
                    function alonePostsButton(author) {
                        const element = document.createElement('li');
                        element.className = 'item-alonePosts';
 
                        const button = document.createElement('button');
                        button.className = 'hasIcon';
                        button.type = 'button';
                        button.dataset.id = author.attributes.slug;
                        button.dataset.uid = author.id;
                        element.appendChild(button);
 
                        const icon = document.createElement('i');
                        icon.className = 'icon fas fa-alonePosts Button-icon';
                        button.appendChild(icon);
 
                        const span = document.createElement('span');
                        span.className = 'Button-Label';
                        span.innerText = "看他的文";
                        button.appendChild(span);
 
                        button.addEventListener('click', AlonePosts.setUser);
 
                        return element;
                    }
 
 
 
                    return {
                        set: (button) => {
                            const menu = MenuCheck(button);
                            if (!menu) return;
                            const author = getUser(menu);
                            menu.appendChild(alonePostsButton(author));
                        }
                    }
                })();
 
                document.addEventListener('click', (e) => {
                    if (!/^\/d\//.test(location.pathname)) return;
                    if (e.target.id != "" || e.target.className != "") {
                        switch (e.target.tagName) {
                            case "BUTTON":
                                if (/Post-controls/.test(e.target.parentNode.className)) AlonePostsElement.set(e.target);
                                break;
                        }
 
                    }
                    else {
                        switch (e.target.tagName) {
                            case "IMG":
                                e.preventDefault();
                                DiscussionImageElement.load(e.target);
                                break;
                            case "A":
                                e.preventDefault();
                                window.open(e.target.href);
                                break;
                        }
                    }
                });
            })();
 
            (function BalaCursor() {
                if (!config.bala_cursor) return;
                const cursor = document.createElement('div');
                cursor.id = 'cursor';
                document.body.appendChild(cursor);
 
                document.addEventListener('mousemove', (e) => {
                    cursor.style.top = `${e.clientY}px`;
                    cursor.style.left = `${e.clientX}px`;
                });
 
                const style = document.createElement('style');
                style.innerHTML = `
                .sideNav .Dropdown--select .Dropdown-menu > li > a,
                .sideNav .Dropdown--select .Dropdown-menu li,
                .unread .DiscussionListItem-count,
                .DiscussionList-discussions,
                .BH_DiscussionListItem,
                .Button,
                button,
                input,
                body,
                span,
                a {
                    cursor:none;
                }
                `;
 
                document.body.appendChild(style);
            })();
 
            function Timer(call, t) {
                if (t == null) window.requestAnimationFrame(call);
                else setTimeout(() => window.requestAnimationFrame(call), t);
            }
        })();
    })();
 
    function BH_style() {
        const style = document.createElement('style');
        document.body.appendChild(style);
        style.innerHTML = `
        #cursor {
            position: fixed;
            width: 0px;
            height: 0px;
            border-radius: 100%;
            background-color: #FFF;
            pointer-events: none;
            z-index: 1002;
        }
        
        #cursor::before {
            content: "";
            position: absolute;
            top: -4px;
            left: -4px;
            width: 32px;
            height: 32px;
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAt9SURBVFhHrVcHUFXpFb4PBbMurihFUZqVIu3R+6NJ70gRaSIoKKK4imBDVAQFQSkCiwpIE5SiIk0EpIN0pdu3JJtkZjOT3UwmyXx/jvhmMjtpm82emTP33nf//3zf+b7z35nHnSuwd0srcS7dq6srygmjqMc/rnI0oK9yzG+hdMR7smRgR+n1xw4hF6sEm48X2K4ULvtlYlecSkhajR3Lb4gYjkkUqBf1+aa1fBnC2t/vZu1vglnnuwjW9j6IPXrlx6pGPP5WOuT421v91mO3uqyr8jsEkfmtAr30coGUsNzPCxM3mYgTX7j+tbjPk9XNO7H2hSDWPheMx7OB6FyIRvNsEBpmdrCHc96sfs6dyHgQQX/25O1OVjPpwIr7jb7L7zKaKWi3OJNYpL9WWPZ/i7Nl27Pvznmxumkn9nDaGT0vQ9H3Khod83vRPr8P7XO7iVDw4nPbbCiapneheSaQPZ71Z220r2nBlTW9dGal/RZ/KnxiGh+YpvmpsPR/j+L+nVk5HY4sr2s7Kx1yQsOUN7oX9mLsy/MYenMYvQtR6JyNoN+iMfI2FT3zH56D0T4TiMFXJ9E1dwBtdP90Zjc650mZ166s5pnD12UdtpFCiH8fmQ1up+7SptJhD3az1xHZj81wu88BLbMB6JgLxPi7c5h4l4gBItE3H4m+hRg8e52A0XcpGCLw3vlYtE774/5zbzRPkW3TQWgndQZeh7KnbzzZnT7bvqIGgbYQ7p8j5b71NzmdVqx82BMl/W4o7XPF9VYBbnXb4iEV7ZyPRudcEMaIyNRX6Rh9HY+J95mYfJ9DxC7hxVdX8fx9Oh5P+eL+pBfqJv1QPbad1AlG6wtvtL0ka557svIOu2gh5I8judbyTxmtViyrzZw6d0ZRrxPKej1w7YEZsluMUNlvtShv98JRIpCP2V8XkQ1nMPgygUjcwMw3ZXj57UNMfVmAfiL7ZDqYiDihey4SXTNBaJxwRsO0M7s3asvKOpxChbD/iKP5/L9ktAhYSr0B0gn0Zrcjqke8UdbniDyyI7/FDDUDruiYiUTndAR1XECZiWevjmD0TTpmf9OE8fe3Mf42D5PvMjH88gRZsBvds7HonolAx1QQ7o+5omrEkpU+tWH5NS46QuiPEXpW/YfEMgOWfFcP15utUDvmg4ZJfzx6vpPuvVHYsh25jwzRMOJD8idhYP4wXVNJiQrKWwSejqGFy6RGBWa+qiZlzpAdAeiciULzhB+aJvzRNO6Phglv1E84sIJm8+cHD25eJoTnOLcopfnIS8rsTCkfGQ+NQB8WVA2649G4Dx6RnzWjnqgcdMTdQTqac9EYe3OBOs+izMTUN0VkQRGBnqKTkERDeg5Nk+FkWTTaZ/ejhfbXDbsRkZ3onArFnT4blPQas5xGoxwhPMd5Hdh0LSZTix0rUMe5O5rIbbVASZc9Ho7sQOtkMFqeB+D+uDuKn5qjesCRZD2Ima8rMPW+GM3jQeh4Qadj7jBan4egvJ9Oz0QCzcHnpJ4HakdciZA/vfNdzAejXlTHkhW0Gv85rYyvuEgg4PNte+ILDdnxfB1cqNJB4VMbFHZtx+0eB9wbcCEJffCYitc980Zusz7KaTaaX+zB09l4dJHP/dR5/1w8Jt/m0tDFkf/HaHA9cKvLCnXjO3F3xAkVQ9aoGBSgbtQZJZ02KO6wZAn52tmLBOxDFXT2paqxY3k67MxtHbLBELlPzFA6YId7JHvtkDMVDadOQgncjSwyx80OS5T0WJEyPkQmhD5GlzDyOoOGNJLW+eJWpykNsRN9F8LR+GIXWWiNG0/5qB4W4ItWQ1y7b8JO5ul+Z+OxTpJzD1GUiEzd9ruIFGUWlaaCkze1kdtkQRvIil4rVPTbo4K6Lu52pqsXbrbZ4sYT68VOrrfqofaZDxonQ9D0gvwec6Fh88KDMXc6yta4M+CGWx02yG7QRU6TPpESIKeZT0fcgKWUG7PwOBWjRRUOZGhOx1zdxmIytRFfyEdCoRpOl2ggrdYIibfVcaXeEDfaaYC67VAz7IWKHlcUPSECzabIbaTiLVoo7jFD7bgLygctUTlgSeucyQqystuGCNsgk2pcqdfCpXvqSK3is7RqU3bsklH4IoGgkwpVCYXa7GC6Js6WG+NitTGSq0yJiAZO3NhK3pugasgeDc+DyUt7+lraoaLXjYYqEOU9zshq1EN+G8neb0MqeC6urR1zRD0pUjvqRN8SE1yu1sGVB9pIq9NByh09XCjVYQdOa15eJBCerLbjzG1DduiKNjucpY7ku0TinglSaoyRR5J/8dgSBU+MUT7kiDs02WWDNnhAR6tm2BtZj0xwtlQFqdV8pFSr0/BR9wRa2mNK9tmQGtZIKtmEhHxlJNMpS67QwrliPk7m8dneBM2KRQL2EVKysVc1/ngoYxuLOL8BJ27ykVZvjqwmS2Q8sCAbtHCxUgfny7fhWqMpCtsFyG7Ux40OCxS0mdEaY5ws2ozj+fK4UquFwsfm5LsWMh9qU+cEWKZM5DSQ2aCPJLI0IUcFx6/qsYg4fu0igQ8RcXFT95EcVRaQIIOYTDWcrzDApVpjSkMk0f3+S0rYe0EecXmqOHVDhUhupMJquHhHA+n1JGuVGq7U6SGlUhtJxVuQTKAXy7YRcU1k1OkivU4L5+k5imrEXFZG7CU95rln000hPMeFJEqH7kmWIgJr2I5YCYSeoYUZyjiWp0GEtiAyZSN2n1aCV/QKHLmmSkD62J+yDrHZG5DTYIJcmvTMem1cqFTGoYw1OJAii9P51EgxdU7DnHlPH1FJ6xGRuBl7Tm+EX7Qys3GTDxbCf4yA+FUT4cmKzHW/BNwOrCASSgg6pYCws/KLGZggC+cICbjT+6A4acTlqOI0AZwo2Irzt7VJEXXEXpVD1EV5hJyQQfhZGXyeuZmA1yAqUQ4RJxXgHrYaDoGrmFfYpm8FAkUJIfTHCEuSsTlwRZ6FJCow9+gPJCSwI1YKYYnrcSRLjZTYhENXN2Ff8kYCUkP8dfIyV52UkYX/sZXwOywO35jVCDoqjX3UbXCCJLz2r4BvtBRs/cXhtU8aQUcU4Bclz5z95M8LYX8cgfHiDaHnJJjvUSnYhX0KwU4x2AYug+8RaRzL1aCjqY79qYqITFbEwdSNCD66FjYB4nAI/gTmPkvJIolFIsEJq+F/dBUsfcVg6LwMDkGS8DkgjYBDsszWe+X3kpLcOiHkjyPskLKyZ/RSeB8RZZ4xn8GMihq6L4FlwHJ4HZRByHElBMSuh0u4OKx9RWHlIwYT90+g6yAKMy8xmHuLwi54OTyjPoMTkRJ4LYem5RIYOIjBwm05M3FexjSMxQ4J4f512O9eGuMSyWN24RyzCRaBkbsIDFxFoCrgoGLBg4XPZwS6HFtNeNBzEoVHhCTUBKJQ0KX35ktg6LIMurZLoWcnCkPHT6FhLoathkuZlvVypmYkXimE+c9htWtJtuM+jlnt5DFdRx74djwom/OgYMhBXp+DkhEP+lTciOTVtaPuvFaAb78cOvaiUDURwXpNHjboL4WykegiuIb5MsY3W1UvLP/TwsKPl2Xhy2P6bjxm4MSRAjwoGXBQoNxsKoJNRkugpCcCWU0OW4wIzFQUWwyWYL06Bzltem8oRmREmabFrxjfdEUBxzGesPRPDwOHJT56Drw/6LrwmJo1x5SoewXKdXwOa7Q4SKpykFLjIK1C91s+XteoiWCdBimgI8LUjZcS+MpkYbmfF5rGnMxWM+4mKcC2mnNsowHH5LU4tk6dY7KUa7ZRqvIgo8ajZx6T0+IxRcoNWkt+UNVbFiYs8//HWg3OQkGHd19Og/e9rAbH1n4AV+GY9FYek9pC98q8xZTZwv1eTo2XrKKzXFa49ZeN1XLcenF5zmyVIue/Sp6Ll1jPpUvKcRmrFLi4lWs5L06c+4n/ljnu7y4iLCooGS1QAAAAAElFTkSuQmCC');
        }
        
        .App {
            padding-top: 72px;
        }
        
        #header {
            background-image: linear-gradient(to right, #117e96 0%, #116b80 35%, #125b6b 80%);
            height: 35px;
            padding: 0;
        }
        
        .App-header .container {
            max-width: 1250px;
            padding: 0;
        }
        
        .item-search {
            float: left;
            position: relative;
            margin-left: 20px;
            list-style: none;
        }
        
        .Search {
            width: 208px;
        }
        
        .Search.focused {
            margin-left: 0;
        }
        
        .Search.focused input {
            width: 208px;
        }
        
        .Search-input::before {
            float: right;
            margin-right: 0;
            right: 4px;
            position: absolute;
            color: #117e96;
            width: 28px;
            height: 30px;
            line-height: 36px;
            padding: 0;
            font-size: 20px;
        }
        
        .App-header .FormControl {
            background-color: #FFF;
            height: 28px;
            margin: 3px 0;
            color: black;
            width: 208px;
            padding-left: 10px;
        }
        
        .App-header .FormControl:focus {
            background-color: #FFF;
            height: 28px;
            margin: 3px 0;
            color: black;
            width: 208px;
            padding-left: 10px;
        }
        
        .LoadingIndicator-container.LoadingIndicator-container--inline.LoadingIndicator-container--small,
        .icon .fas .fa-times-circle {
            display: none;
        }
        
        .item-session {
            height: 36px;
        }
        
        .item-session .Avatar {
            float: right;
            width: 25px;
            height: 25px;
            margin-top: 5px;
        }
        
        .item-session .ButtonGroup {
            float: right;
        }
        
        .item-session .Dropdown-toggle {
            height: 36px;
            padding: 12px;
        }
        
        .item-session .Dropdown-toggle::before {
            content: "";
            position: absolute;
            top: 12px;
            left: 8px;
            width: 7px;
            height: 7px;
            border-style: solid;
            border-width: 0 0 2px 2px;
            border-color: transparent transparent white white;
            transform: rotate(-45deg);
        }
        
        .App-header .Button:active,
        .App-header .Button.active,
        .App-header .Button:focus,
        .App-header .Button.focus,
        .App-header .open>.Dropdown-toggle.Button {
            color: #FFF;
            background: transparent;
        }
        
        .App-header .Button,
        .App-header .Button:hover {
            color: #FFF;
            background: transparent;
        }
        
        img.Header-logo {
            margin-bottom: 1px;
        }
        
        .Dropdown-menu.dropdown-menu.Dropdown-menu--right {
            width: 260px;
        }
        
        .fa-bell::before {
            content: "";
            background-image: url("https://i2.bahamut.com.tw/navicon_notification_dark.png");
            background-size: 24px;
            background-repeat: no-repeat;
            position: absolute;
            margin: 6px;
            width: 24px;
            height: 24px;
            top: 0px;
            left: 0px;
        }
        
        .NotificationsDropdown.open.fa-bell {
            background: #249db8;
        }
        
        .NotificationsDropdown.open.fa-bell::before {
            background-image: url(https://i2.bahamut.com.tw/navicon_notification_active.png);
        }
        
        .BH_Client {
            width: 260px;
            padding: 8px 12px 6px 12px;
            height: 72px;
        }
        
        .BH_Client:hover {
            background-color: var(--control-bg);
        }
        
        .BH_ClientAvatar {
            width: 54px;
            height: 54px;
            border: solid 3px white;
            border-radius: 100%;
            margin: 2px;
            float: left;
        }
        
        .BH_ClientName {
            float: left;
            color: var(--text-color);
            display: block;
            margin-left: 10px;
            max-width: 168px;
            font-size: 15px;
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: bold;
            margin-top: 8px;
            cursor: default;
        }
        
        .BH_ClientId {
            color: #33CCCC;
            font-size: 12px;
            line-height: 1.2;
            font-weight: normal;
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: 10px;
            float: left;
            margin-top: 6px;
            cursor: default;
        }
        
        .sideNavContainer {
            display: block;
        }
        
        .sideNav,
        .sideNav>ul {
            width: 100%;
        }
        
        .sideNav .Dropdown--select .Dropdown-menu li {
            float: left;
            border: solid 1px var(--shadow-color);
            background: var(--button-toggled-color);
            margin: 2px;
            width: calc(12.5% - 4px);
            height: 38px;
            border-radius: 5px;
        }
        
        .sideNav .Dropdown--select .Dropdown-menu li.active {
            background-color: #00B0B6;
        }
        
        .sideNav .Dropdown--select .Dropdown-menu>li>a {
            padding-left: 0px;
            color: var(--text-color);
            text-align: center;
        }
        
        .sideNav .Dropdown--select .Dropdown-menu>li>a .Button-icon {
            display: none;
        }
        
        .sideNav .Dropdown--select .Dropdown-menu li .Button-label {
            text-align: center;
            font-size: 14px;
        }
        
        .sideNav .Dropdown--select .Dropdown-menu li.active .Button-label {
            color: #FFF;
        }
        
        #BH_header {
            position: relative;
            height: 40px;
            width: 100%;
            background-color: var(--body-bg);
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
        }
        
        #BH_headerMenu {
            position: relative;
            height: 40px;
            width: 1100px;
            margin: 0 auto;
        }
        
        #BH_headerMenu li {
            position: relative;
            height: 40px;
            font-size: 15px;
            list-style: none;
            float: left;
            line-height: 40px;
            text-align: center;
            padding: 0 12px;
        }
        
        #BH_headerMenu li:hover .Button-label {
            color: #00B0B6;
        }
        
        #BH_headerMenu li+li::before {
            content: "";
            position: absolute;
            top: 8px;
            left: 0px;
            width: 1px;
            bottom: 8px;
            background-color: #555;
            pointer-events: none;
        }
        
        #BH_headerMenu li.Dropdown-separator {
            display: none;
        }
        
        #BH_headerMenu li a {
            pointer-events: none;
            padding: 0px;
        }
        
        #BH_headerMenu .Dropdown-menu>li.active>a {
            background: transparent;
        }
        
        #BH_headerMenu .icon {
            display: none;
        }
        
        #BH_headerMenu .Button-label {
            color: var(--text-color);
        }
        
        #BH_headerMenu .item-allDiscussions .Button-label {
            color: #00B0B6;
        }
        
        #BH_headerMenu li.active .Button-label {
            color: #00B0B6;
        }
        
        #BH_headerMenu li.item-newDiscussion {
            position: absolute;
            right: 0px;
            width: 60px;
            text-align: center;
            background-color: #00B0B6;
            border-radius: 3px;
            margin: 3px 0;
            height: 32px;
            line-height: 32px;
            color: #FFF;
            cursor: pointer;
            overflow: hidden;
            padding: 0;
        }
        
        #BH_headerMenu li#BH-replay {
            position: absolute;
            right: 0px;
            width: 60px;
            text-align: center;
            background-color: #00B0B6;
            border-radius: 3px;
            margin: 3px 0;
            height: 32px;
            line-height: 32px;
            color: #FFF;
            cursor: pointer;
            overflow: hidden;
            padding: 0;
        }
        
        #BH_headerMenu li#BH-replay::before {
            display: none;
        }
        
        .sideNav .ButtonGroup {
            display: inline-block;
            width: 100%;
        }
        
        #BH_headerMenu li.item-newDiscussion::before {
            display: none;
        }
        
        #BH_headerMenu li.item-newDiscussion button {
            padding: 0;
        }
        
        #BH_headerMenu li.item-newDiscussion .Button-label {
            color: white;
        }
        
        #BH_headerMenu li.item-newDiscussion:hover .Button-label {
            color: white;
        }
        
        .item-nav .item-allDiscussions,
        .item-nav .item-rankings,
        .item-nav .item-following,
        .item-nav .item-bookmarks,
        .item-nav .item-tags,
        .item-nav .Dropdown-separator,
        .sideNav .item-newDiscussion {
            display: none;
        }
        
        .TagsPage-nav.IndexPage-nav.sideNav {
            display: none;
        }
        
        .Composer:not(.fullScreen) {
            margin-left: 0;
            margin-right: 0;
        }
        
        #BH_headerMenuFocus {
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 84px;
            height: 4px;
            background-color: #00B0B6;
            transition-duration: 500ms;
            box-shadow: 0 0 2px 0px #33cccc;
            pointer-events: none;
        }
        
        #BH_headerMenu .Dropdown-menu {
            display: block;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: transparent;
            box-shadow: none;
        }
        
        ul.affix {
            display: none;
        }
        
        ul.affix-top {
            display: none;
        }
        
        .BH_welcomeImage {
            position: relative;
            top: 0px;
            left: 0px;
            width: 1070px;
            height: 320px;
            margin: 8px auto -24px auto;
        }
        
        .BH_welcomeImage img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .DiscussionPage-nav>ul {
            margin-top: 90px;
        }
        
        #BH_adminList {
            position: absolute;
            top: 80px;
            left: calc(50% + 550px);
            padding: 4px 8px;
            color: var(--text-color);
            text-align: left;
            background: var(--button-toggled-color);
            border: solid 1px var(--shadow-color);
            border-radius: 3px;
        }
        
        .Hero #BH_adminList {
            top: 240px;
            left: calc(50% + 385px);
        }
        
        #BH_adminList::before {
            content: "板務人員:";
            position: relative;
            float: left;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            padding: 0 4px;
        }
        
        .BH_adminItem {
            position: relative;
            top: 0px;
            left: 0px;
            width: 30px;
            height: 30px;
            margin: 5px;
            float: left;
            box-shadow: 0 0 1px white;
        }
        
        .BH_adminItemImg {
            width: 30px;
            height: 30px;
            border-radius: 3px;
        }
        
        .BH_adminItemBlock {
            position: absolute;
            top: 100%;
            right: -20px;
            width: 500px;
            height: 0px;
            background-color: #F9FAFE;
            border-radius: 7px;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
            transition-duration: 150ms;
            z-index: 3;
        }
        
        .BH_adminItem:hover .BH_adminItemBlock {
            opacity: 1;
            pointer-events: all;
            height: 160px;
        }
        
        .BH_adminItemCover {
            width: 500px;
            height: 100px;
            object-fit: cover;
        }
        
        .BH_adminItemAvatar {
            position: absolute;
            top: 50px;
            left: 20px;
            width: 100px;
            height: 100px;
            background-color: #EEE;
            border: solid 3px white;
            border-radius: 3px;
        }
        
        .BH_adminItemName {
            position: absolute;
            top: 100px;
            left: 120px;
            right: 0px;
            color: black;
            height: 24px;
            padding-left: 10px;
            font-size: 16px;
            line-height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: bold;
        }
        
        .BH_adminItemId {
            position: absolute;
            top: 120px;
            left: 120px;
            right: 0px;
            color: #00B0B6;
            height: 18px;
            padding-left: 10px;
            font-size: 12px;
            line-height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .BH_adminItemId a {
            color: #00B0B6;
        }
        
        .BH_DiscussionListItem {
            position: relative;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 130px;
            margin: 10px 0;
            background-color: #5551;
            border-radius: 7px;
            cursor: default;
        }
        
        .BH_DiscussionListItem:hover {
            background-color: #9991;
        }
        
        .BH_DiscussionListItem:hover a {
            text-decoration: none;
        }
        
        .BH_DiscussionListItem .DiscussionListItem-title {
            margin-right: 90px;
        }
        
        .IndexPage .BH_DiscussionListItem .item-tags {
            margin-right: -90px;
            top: 40px;
        }
        
        .BH_previewImage {
            position: absolute;
            top: 5px;
            left: 5px;
            width: 240px;
            height: 120px;
            object-fit: cover;
        }
        
        img.BH_previewImage {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            width: 100%;
            height: 100%;
        }
        
        img.BH_previewImage[data-blur="true"] {
            filter: blur(10px);
        }
        
        div.BH_previewImage {
            background-color: var(--button-bg);
            border: solid 2px white;
            text-align: center;
            font-size: 20px;
            line-height: 116px;
            overflow: hidden;
        }
        
        .BH_DiscussionListItem .DiscussionListItem-content {
            position: absolute;
            top: 0px;
            left: 240px;
            right: 0px;
            bottom: 0px;
            padding-left: 20px;
            padding-right: 80px;
        }
        
        .BH_DiscussionListItem .DiscussionListItem-author {
            margin-left: 0px;
        }
        
        .BH_DiscussionListItem .Avatar {
            margin-right: 10px;
        }
        
        .BH_DiscussionListItem .DiscussionListItem-badges {
            position: absolute;
            top: -5px;
        }
        
        .BH_DiscussionListItem .ButtonGroup {
            display: none;
        }
        
        #BH_notificationBtn {
            position: relative;
            top: 0px;
            left: 0px;
            width: 36px;
            height: 36px;
            cursor: pointer;
        }
        
        #BH_notificationBtn::before {
            content: "";
            filter: brightness(20);
            position: absolute;
            top: 0px;
            left: 0px;
            width: 36px;
            height: 36px;
            background-image: url("https://i2.bahamut.com.tw/navicon_notification_dark.png");
            background-size: 24px;
            background-repeat: no-repeat;
            background-position: 50%;
        }
        
        #BH_notificationsTableBorder {
            display: none;
            position: absolute;
            width: 400px;
            height: 480px;
            overflow: hidden;
            background-color: var(--button-bg);
            padding-left: 0;
            z-index: 1;
            box-shadow: 0 0 20px 4px #0008;
            border-radius: 3px;
            margin-left: -50px;
            border: solid transparent 10px;
        }
        
        #BH_notificationsTable {
            width: 420px;
            height: 460px;
            overflow-x: hidden;
            overflow-y: scroll;
        }
        
        #BH_notificationNoreadNum {
            float: right;
            background-color: #F34;
            font-size: 10px;
            color: white;
            padding: 0 2px;
            border-radius: 3px;
            pointer-events: none;
            min-width: 15px;
            text-align: center;
        }
        
        .BH_notificationItem {
            position: relative;
            width: 380px;
            height: 72px;
            overflow: hidden;
            border-radius: 7px;
        }
        
        .BH_noRead {
            background-color: var(--button-bg-active);
        }
        
        .BH_notificationItem:hover {
            background-color: var(--button-bg-hover);
        }
        
        .BH_notificationItem::before {
            content: "";
            position: absolute;
            top: 0px;
            left: 10px;
            right: 10px;
            bottom: 0px;
            border-style: solid;
            border-color: #FFF3;
            border-width: 1px 0;
        }
        
        .BH_notificationFromUser {
            position: relative;
            width: 44px;
            height: 44px;
            margin: 15px 10px;
            border-radius: 100%;
            float: left;
            line-height: 44px;
            text-align: center;
            font-size: 30px;
            color: white;
            pointer-events: none;
        }
        
        .BH_notificationLinkText {
            margin: 0 2px;
            color: var(--link-color);
        }
        
        .BH_notificationText {
            position: relative;
            width: 316px;
            color: var(--text-color);
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            line-height: 18px;
            cursor: default;
            float: left;
            margin: 8px 0;
        }
        
        .BH_notificationTitleText {
            max-height: 36px;
            margin-bottom: 0;
        }
        
        .BH_notificationContentText {
            color: #AAA;
            height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            margin-right: 60px;
            margin-bottom: 0;
        }
        
        .BH_notificationTime {
            color: #777;
            font-size: 12px;
            bottom: 6px;
            position: absolute;
            line-height: 14px;
            right: 6px;
        }
        
        div.BH_previewImage::before {
            content: attr(data-text);
        }
        
        .BH_previewContent {
            margin: 5px 0 0 -45px;
            height: 60px;
        }
        
        #BH_fullScreenImageBorder {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100vw;
            height: 100vh;
            background-color: #0007;
            z-index: 1001;
        }
        
        #BH_fullScreenImageClose {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
        
        #BH_fullScreenImage {
            position: absolute;
        }
        
        #BH_fullScreenImageUrl {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100vw;
            height: 36px;
            line-height: 36px;
            background-color: #222;
            font-size: 20px;
            text-align: center;
            cursor: pointer;
        }
        
        .item-imgur-multi-upload svg {
            width: 20px;
            margin: -6px;
        }
        
        .Button-Label,
        i.icon {
            pointer-events: none;
        }
        
        .fa-alonePosts::before {
            content: "\f007";
        }
        
        .BH_alonePosts {
            position: fixed;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            background-color: #000A;
            z-index: 1000;
        }
        
        .BH_alonePosts-close {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
        }
        
        .BH_alonePosts-user {
            position: relative;
            width: 550px;
            height: 144px;
            margin: 10px auto;
            background-color: #000;
            border-radius: 3px;
            overflow: hidden;
            padding: 20px;
            list-style: none;
        }
        
        .BH_alonePosts-userBackground {
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.5;
        }
        
        .BH_alonePosts-userAvatar {
            position: absolute;
            width: 100px;
            height: 100px;
            margin: 2px;
            border-radius: 100%;
            overflow: hidden;
            color: white;
            text-align: center;
            line-height: 100px;
            font-size: 60px;
        }
        
        .BH_alonePosts-userName {
            position: relative;
            margin: 10px 0 10px 144px;
            font-size: 20px;
        }
        
        .BH_alonePosts-postStreamBorder {
            position: relative;
            width: 880px;
            height: calc(100% - 184px);
            margin: 0 auto;
            overflow: hidden;
            background-color: var(--body-bg-faded);
            border-radius: 5px;
        }
        
        .BH_alonePosts-postStream {
            position: absolute;
            top: 0px;
            left: 0px;
            right: -20px;
            bottom: 0px;
            overflow: hidden scroll;
        }
        
        .BH_alonePosts-item {
            position: relative;
            width: 860px;
            margin: 10px;
            padding-top: 25px;
        }
        
        .BH_alonePosts-item+.BH_alonePosts-item {
            border-top: solid var(--control-color) 1px;
        }
        
        .BH_alonePosts-number {
            position: absolute;
            top: 0px;
            right: 0px;
        }
        
        .BH_alonePosts-item img {
            max-width: 100%;
        }
        
        .BH_tagsSelect {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100vw;
            height: 100vh;
            background-color: #000A;
            z-index: 1000;
        }
        
        .BH_tagsSelectClose {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
        }
        
        .BH_tagsSelectMain {
            position: absolute;
            top: calc(50% - 250px);
            left: calc(50% - 300px);
            width: 600px;
            height: 500px;
            background-color: var(--body-bg-faded);
            border-radius: 7px;
            border: solid 3px var(--button-primary-bg-active);
        }
        
        .BH_tagsSelectNavBorder {
            position: relative;
            height: 420px;
            margin: 10px;
            overflow: hidden;
        }
        
        .BH_tagsSelectNav {
            position: relative;
            width: calc(100% + 20px);
            height: 100%;
            overflow-y: scroll;
        }
        
        .tagsSelectItem {
            position: relative;
            width: 181px;
            height: 42px;
            margin: 5px;
            background-color: var(--button-bg);
            border-radius: var(--border-radius);
            float: left;
            line-height: 42px;
            overflow: hidden;
        }
        
        .tagsSelectItem .icon {
            font-size: 16px;
            margin-left: 10px;
        }
        
        .tagsSelectItem input {
            opacity: 0;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        
        .tagsSelectItemCheck {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
        }
        
        .tagsSelectItem input:checked+.tagsSelectItemCheck {
            border: solid 2px #4B6;
            border-radius: 7px;
        }
        
        .tagsSelectButton {
            position: relative;
            width: 120px;
            height: 32px;
            margin: 12px;
            background-color: var(--button-bg);
            border: none;
            border-radius: var(--border-radius);
        }
        
        .tagsSelectItem:hover,
        .tagsSelectButton:hover {
            background-color: var(--button-bg-hover);
        }
        
        .tagsSelectItem:active,
        .tagsSelectButton:active {
            background-color: var(--button-bg-active);
        }
`;
    }
})();
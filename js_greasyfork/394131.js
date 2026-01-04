// ==UserScript==
// @name         bangumi 手机端布局
// @namespace    http://tampermonkey.net/
// @author       鈴宮華緋
// @description  手机端布局
// @version      0.3
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\//
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/394131/bangumi%20%E6%89%8B%E6%9C%BA%E7%AB%AF%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/394131/bangumi%20%E6%89%8B%E6%9C%BA%E7%AB%AF%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(function () {
    if (!navigator.userAgent.match(/mobile/i)) {
        return;
    }
    // 动画时长
    const animeSpeed = 200;
    let html = $('html');
    // 保存之前点击的菜单栏 index
    let preMenuIndex = -1;

    let navMenuBackgroundColor = 'white';
    let navMenuColor = '#777';
    let floatListBoxBackgroundColor = '#fafafa';
    let floatListShadow = 'inset 0 0 5px #ccc';
    let idBadgerNeueBackgroundColor = 'rgba(254, 254, 254, 0.9)';
    let idBadgerNeueColor = 'white';
    let selectColor = 'black';
    if (html.attr('data-theme') == 'dark') {
        navMenuBackgroundColor = 'rgb(45, 46, 47)';
        navMenuColor = 'white';
        floatListBoxBackgroundColor = 'rgb(60, 61, 62)';
        floatListShadow = 'inset 0 0 5px #333';
        idBadgerNeueBackgroundColor = 'rgba(45, 46, 47, 0.9)';
        idBadgerNeueColor = 'rgb(200, 200, 200)';
        selectColor = 'white';
    }

    // ==== menu ==== 一级菜单的按钮
    let menuCompact = $('label.menuCompact');
    menuCompact.hide();
    // menu box 二级菜单容器
    let navNeue = $('#navNeue2');
    navNeue.css({
        'display': 'block',
        'float': 'none',
        'opacity': 'initial',
    });
    // menu 二级菜单
    let navMenuNeue = $('#navMenuNeue');
    let items = navMenuNeue.children('li');
    items.css({
        'width': '33.3%',
        'background': 'rgba(0, 0, 0, 0)',
        'float': 'left',
    }).attr('show', 'hide');
    items.children('a').css({
        'background': 'rgba(0, 0, 0, 0)',
    });
    // 二级菜单的容器
    let floatListBox = $('<div>');
    floatListBox.css({
        'background': floatListBoxBackgroundColor,
        'box-shadow': floatListShadow,
        'clear': 'both',
    });
    // 二级菜单的容器arr
    let floatListBoxArr = [];
    floatListBox.addClass('floatListBox');
    for (let num = 1; num <= items.length; num++) {
        let item = items.eq(num - 1);
        item.attr('index', num);
        if (item.children('ul').length == 0) {
            item.append('<ul class=\'clearit\'>');
        }
        let tempa = item.children('a').clone().attr('class', 'nav');
        let templi = $('<li>');
        templi.append(tempa);
        item.children('ul').prepend(templi);
        // 添加二级菜单容器到指定位置
        if (num % 3 == 0 || (num % 3 != 0 && num == items.length)) {
            let temp = floatListBox.clone();
            floatListBoxArr.push(temp);
            temp.attr('target', num / 3);
            item.after(temp);
        }
    }
    items.children('a').attr('href', 'javascript:void(0)').removeClass('focus anime').addClass('top'); //a标签失效
    for (let num = 1; num <= items.length; num++) { // 将二级菜单放入容器
        if (items.eq(num - 1).children('ul')) {
            let ul = items.eq(num - 1).children('ul');
            ul.css({
                'display': 'none',
            });
            ul.attr('target', num);
            ul.children('li').css({
                'width': '33.3%',
                'color': '#f09199',
                'float': 'left',
            }).children('a').css({
                'color': '#f09199',
            });
            ul.find('div.sep').parent().css({
                'display': 'block',
                'width': '100%',
                'background': '#f09199',
                'color': 'white',
                'text-align': 'center',
                'float': 'none',
                'clear': 'both',
            });
            floatListBoxArr[parseInt((num - 1) / 3)].append(ul);
        }
    }
    items.click(function () {
        let num = $(this).attr('index');
        let sameRowFlag = false;
        let listBoxArr_num = parseInt((num - 1) / 3);
        let pre_listBoxArr_num = parseInt((preMenuIndex - 1) / 3);
        if (listBoxArr_num == pre_listBoxArr_num && preMenuIndex != -1) {
            sameRowFlag = true;
        }
        preMenuIndex = num;
        for (let i = 0; i < floatListBoxArr.length; i++) {
            if (sameRowFlag) {
                floatListBoxArr[i].children('ul').hide();
            } else {
                floatListBoxArr[i].children('ul').slideUp(animeSpeed);
            }
        }
        items.css({
            'background-color': navMenuBackgroundColor,
            'color': navMenuColor,
        }).children('a').css({
            'color': navMenuColor,
        });
        if ($(this).attr('show') != 'show') {
            items.attr('show', 'hide');
            $(this).attr('show', 'show');
            $(this).css({
                'background-color': '#f09199',
                'color': 'white',
            }).children('a').css({
                'color': 'white',
            });
            // 展开动画
            if (sameRowFlag) {
                floatListBoxArr[listBoxArr_num].children('[target=' + num + ']').show();
            } else {
                floatListBoxArr[listBoxArr_num].children('[target=' + num + ']').slideDown(animeSpeed);
            }
        } else {
            $(this).children('a').css({
                'color': '#777',
            });
            $(this).attr('show', 'hide');
        }
    });
    // search input
    let headerSearchWrapper = $('#headerSearchWrapper');
    headerSearchWrapper.css({
        'position': 'relative',
        'top': 0,
        'left': 0,
        'right': 0,
        'width': '100%',
    });
    let searchInputBox = headerSearchWrapper.find('#headerSearch');
    searchInputBox.css({
        'position': 'relative',
        'width': '-webkit-fill-available',
        'margin': '10px 10px 10px 10px',
        '-moz-border-radius': '100px',
        '-webkit-border-radius': '100px',
        'border-radius': '100px',
        '-moz-box-shadow': 'none',
        '-webkit-box-shadow': 'none',
        'box-shadow': 'none',
        'border': '1px solid #DDD',
        'background-color': 'rgba(255, 255, 255, 0.2)',
    }).find('select').css({
        'padding': '4px 0 4px 5px',
        'min-width': '35px',
        'border': 'none',
        'outline': 'none',
        'box-shadow': 'none',
        'background-color': 'transparent',
        'background-image': 'none',
        '-webkit-appearance': 'none',
        '-moz-appearance': 'none',
        'appearance': 'none',
        '-moz-border-radius': '0',
        '-webkit-border-radius': '0',
        'border-radius': '0',
        'border-right': '1px solid #DDD',
        'color': selectColor,
    }).find('option').css({
        'color': 'black',
    });
    let searchText = searchInputBox.find('#search_text');
    searchText.css({
        'width': 'calc(80% - 20px)',
        'background': 'transparent',
        'line-height': '25px',
        'box-shadow': 'none',
    });
    // header
    let main = $('#main');
    main.prepend(navNeue);
    main.prepend(headerSearchWrapper);
    let clear = $('<div></div>');
    clear.css('clear', 'both');
    navNeue.after(clear);
    // ==== side bar
    let idBadgerNeue = $('div.idBadgerNeue');
    idBadgerNeue.css({
        'display': 'block',
        'position': 'fixed',
        'top': 0,
        'bottom': 0,
        'right': '-200px',
        'width': '200px',
        'height': '100%',
        'background': idBadgerNeueBackgroundColor,
        // 'border': 'solid 1px red',
        'margin': 0,
        'padding': 0,
        'box-shadow': '0 0 5px #888',
        'backdrop-filter': 'blur(5px)',
        'z-index': '100',
    });
    // head image
    let head = idBadgerNeue.find('a.avatar');
    head.css({
        'position': 'absolute',
        'left': '50%',
        'top': '20px',
        'transform': 'translateX(-50%)'
    });
    let headImage = head.find('span.avatarNeue');
    headImage.css({
        'width': '75px',
        'height': '75px',
        'border-radius': '5px',
    });
    headImage.attr('style', $(headImage).attr('style').replace('/s/', '/l/'));
    let badgeUserPanel = $('#badgeUserPanel');
    badgeUserPanel.css({
        'display': 'block',
        'position': 'relative',
        'top': '115px',
        'left': 0,
        'width': '100%',
        'background': 'none',
        'box-shadow': 'none',
        'backdrop-filter': 'none',
        'border-radius': 0,
    });
    // ==== bottom bar
    let dock = $('#dock');
    dock.hide();
    // ==== cover
    let cover = $('<div></div>');
    cover.css({
        'display': 'none',
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'background': 'rgba(100, 100, 100, 0.5)',
        'z-index': '99',
    });
    cover.click(function () {
        idBadgerNeue.animate({
            'right': '-200px',
        }, animeSpeed);
        setTimeout(function () {
            cover.hide();
        }, animeSpeed);
    });
    // ==== side bar button
    let sideBarBtn = $('<button>▟</button>');
    sideBarBtn.css({
        'position': 'relative',
        'top': 0,
        'height': '50px',
        'width': '40px',
        'background': 'none',
        'color': '#f09199',
        'font-size': '18px',
        'text-line': '50px',
        'border': 'none',
        'margin': '0',
        'float': 'right',
        'outline': 'none',
    });
    sideBarBtn.click(function () {
        idBadgerNeue.animate({
            'right': 0,
        }, animeSpeed);
        cover.show();
    });
    let headerNeueInner = $('div.headerNeueInner');
    headerNeueInner.append(sideBarBtn);
    html.append(idBadgerNeue);
    html.append(cover);
    // ======================
    let prgManagerMain = $('#prgManagerMain');
    let subjects = $("#prgManagerMain").find(".infoWrapper");
    // 列表式格子优化
    prgManagerMain.width('100%');
    prgManagerMain.find('#cloumnSubjectInfo').css({
        'width': 'auto',
    }).find('.infoWrapper').css({
    }).find('.header').css({
        'box-sizing': 'border-box',
        'height': '100%',
        'overflow-y': 'auto',
        'padding-bottom': '16px',
    }).find('.headerInner').css({
        'width': '100%',
        'margin': 0,
        'display': 'inline-block',
    }).find('.progressBar').css({
        'height': 'auto',
    }).find('form').css({
        'clear': 'both',
    }).parent('.progressBar').next('.tip_i').find('a').css({
        'display': 'inline-block',
    });
    prgManagerMain.find('#cloumnSubjectInfo').find('.header').each(function () {
        let children = $(this).children();
        if (children.find('.epGird').length == 0) {
            $(this).empty().append(children).append($(this).siblings().clone());
        }
    });
    if (prgManagerMain.find('.cloumnSubjects').css('display') != 'none') {
        $('#cloumnSubjectInfo').width(`${prgManagerMain.width() - prgManagerMain.find('.cloumnSubjects').width() - 3}px`);
    };
    $('#switchNormalManager').click(function () {
        $('#cloumnSubjectInfo').width(`${prgManagerMain.width() - prgManagerMain.find('.cloumnSubjects').width() - 3}px`);
        subjects.removeAttr('style');
    });
    $('#switchTinyManager').click(function () {
    });
    // 分类按钮生效
    $('#prgCatrgoryFilter').find('a').click(function () {
        subjects.removeAttr('style');
        let subject_type = $(this).attr('subject_type');
        let num = 0;
        for (let i = 0; i < subjects.length; i++) {
            let subject = subjects.eq(i);
            if (subject.attr('subject_type') != subject_type && subject_type != 0) {
                subject.hide();
            } else {
                subject.show();
                num++;
                if (num % 2 != 0) {
                    subject.addClass('odd');
                } else {
                    subject.removeClass('odd');
                }
            }
        }
    });
    // 重新实现一次左侧点击，右侧不相关的条目隐藏
    $('#prgSubjectList').find('a.subjectItem').click(function () {
        let subject_id = $(this).attr('subject_id');
        subjects.hide();
        $(`#subjectPanel_${subject_id}`).show();
    });
})();
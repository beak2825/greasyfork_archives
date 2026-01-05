// ==UserScript==
// @name EmotiMi
// @version 0.9
// @Author   @EdvardGrieg
// @description Emoticones en la sección: Mi Taringa! y en los perfiles de usuarios...
// @match       http*://www.taringa.net/*
// @namespace EmotiMi
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27923/EmotiMi.user.js
// @updateURL https://update.greasyfork.org/scripts/27923/EmotiMi.meta.js
// ==/UserScript==
/* jshint -W097 */
//Estilos
GM_addStyle(".emoji_container * {-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } .emoji_container {display: none; width: 50%; margin-left: auto; margin-right: auto; background-color: #fff; box-shadow: 9px 7px 12px 2px rgba(0, 0, 0, 0.176); } .emoji_container ul {list-style: none; padding-left: 0; margin: 0; } .emoji_content {width: 100%; margin-left: auto; margin-right: auto; overflow-y: overlay; padding: 1px;} .emoji_content ul {} .emoji_content ul li {width: 50px; height: 50px; float: left; border: 1px dotted #e3e3e3; margin-top: 1px; margin-left: 1px; margin-right: 1px;} .emoji_content ul li a {display: block; line-height: 50px; text-align: center; cursor: pointer; } .emoji_content ul li a img {vertical-align: middle; max-width: 50px; max-height: 50px; } .emoji_content .mCSB_scrollTools {width: 10px; } .emoji_content .mCSB_outside + .mCS-minimal-dark.mCSB_scrollTools_vertical, .emoji_content .mCSB_outside + .mCS-minimal.mCSB_scrollTools_vertical {margin: 5px 0; } /*.emoji_tab {background-color: #f7f7f7; border-top: 0px solid #e3e3e3; color: #666; height: 32px; position: center; }*/ /*.emoji_tab_prev {border-top: 4px solid transparent; border-bottom: 4px solid transparent; border-right: 4px dashed; cursor: pointer; left: 8px; top: 12px; position: absolute; display: inline-block; height: 0; vertical-align: middle; width: 0; }*/ .emoji_tab_next {border-top: 4px solid transparent; border-bottom: 4px solid transparent; border-left: 4px dashed; cursor: pointer; right: 7px; top: 12px; position: absolute; display: inline-block; height: 0; vertical-align: middle; width: 0; } .emoji_tab_list {left: 22px; overflow: hidden; position: absolute; top: 0; width: 500px; } .emoji_tab_list ul {width: 1500px; transition: all 0.8s ease 0s; } .emoji_tab_list ul li {border-top: 0 none; cursor: pointer; float: left; height: 22px; line-height: 22px; margin: 5px 4px 0 0; font-size: 12px; border-radius: 3px; text-align: center; width: 68px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .emoji_tab_list ul li:hover {background: #e5e5e5; } .emoji_tab_list ul li.selected {color: #fff; background: steelblue; } .emoji_preview {position: absolute; top: 0; border: 1px solid #c8c8c8; border-radius: 50%; width: 65px; height: 65px; background: #ffffff; text-align: center; line-height: 65px; box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.176); z-index: 2; display: none; } .emoji_preview img {vertical-align: middle; max-width: 42px; max-height: 42px; } .CazaDiv{ width: 45px; position: fixed; top: 50%; left: 5%; overflow: auto; border: 1px solid grey;  border-radius: 50%;} .emoji_btn {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; width: 10px; height: 10px; cursor: pointer; border: 1px solid rgba(255,255,255,0.12); -webkit-border-radius: 10px; border-radius: 10px; -o-text-overflow: clip; text-overflow: clip; background: url('//k60.kn3.net/1/6/B/D/A/0/537.png'); background-repeat: no-repeat; background-position: 50% 50%; -webkit-background-origin: padding-box; background-origin: padding-box; -webkit-background-clip: border-box; background-clip: border-box; -webkit-background-size: auto auto; background-size: auto auto; -webkit-transition: all 100ms cubic-bezier(0.42, 0, 0.58, 1); -moz-transition: all 100ms cubic-bezier(0.42, 0, 0.58, 1); -o-transition: all 100ms cubic-bezier(0.42, 0, 0.58, 1); transition: all 100ms cubic-bezier(0.42, 0, 0.58, 1); } .emoji_btn:hover {border: 1px solid rgba(0,0,0,0); -webkit-border-radius: 20px; border-radius: 20px; background: url('//k61.kn3.net/F/0/B/B/9/9/290.png'), rgba(255,233,0,0.20); background-repeat: no-repeat; background-position: 50% 50%; -webkit-background-origin: padding-box; background-origin: padding-box; -webkit-background-clip: border-box; background-clip: border-box; -webkit-background-size: auto auto; background-size: auto auto; }");
/**
- Utilisé el Plug-In Emoji Picker:
http://www.jqueryscript.net/text/Multifunctional-Emoji-Picker-Plugin-For-jQuery-emoji-js.html
hice algunos cambios para poder adaptarlo a Taringa...
 */
(function ($, window, document) {

    var PLUGIN_NAME = 'emoji',
        VERSION = '1.1.0',
        DEFAULTS = {
            showTab: true,
            animation: 'fade',
            icons: []
        };

    window.emoji_index = 0;

    function Plugin(element, options) {
        this.$content = $(element);
        this.options = options;
        this.index = emoji_index;
        switch (options.animation) {
            case 'none':
                this.showFunc = 'show';
                this.hideFunc = 'hide';
                this.toggleFunc = 'toggle';
                break;
            case 'slide':
                this.showFunc = 'slideDown';
                this.hideFunc = 'slideUp';
                this.toggleFunc = 'slideToggle';
                break;
            case 'fade':
                this.showFunc = 'fadeIn';
                this.hideFunc = 'fadeOut';
                this.toggleFunc = 'fadeToggle';
                break;
            default :
                this.showFunc = 'fadeIn';
                this.hideFunc = 'fadeOut';
                this.toggleFunc = 'fadeToggle';
                break;
        }
        this._init();
    }

    Plugin.prototype = {
        _init: function () {
            var that = this;
            var btn = this.options.button;
            var newBtn,
                contentTop,
                contentLeft,
                btnTop,
                btnLeft;
            var ix = that.index;
            if (!btn) {
                var ava = $('.my-shout-textarea-wall.clearfix');
                var ShO = $('.my-shout-attach-options');
                var elll = $('#my-shout-body-mi');
                //Botón con emoji
                newBtn = '<center><div id="CDiv" class="CazaDiv" style="position: fixed;"><button type="button" class="emoji_btn" id="emoji_btn_' + ix + '"></button></div></center>'; //
                contentTop = this.$content.offset().top + this.$content.outerHeight() + 10;
                contentLeft = this.$content.offset().left + 2;
                $('body').append(newBtn);
                $('#CDiv').draggable();
                $('#emoji_btn_' + ix).css({'top': contentTop + 'px', 'left': contentLeft + 'px'});
                btn = '#emoji_btn_' + ix;
            }

            var showTab = this.options.showTab;
            var iconsGroup = this.options.icons;
            var groupLength = iconsGroup.length;
            if (groupLength === 0) {
                alert('Missing icons config!');
                return false;
            }

            var emoji_container = '<div class="emoji_container" id="emoji_container_' + ix + '">';
            //Esto hace que el div del botón emoji sea "arrastrable"
            $('#emoji_container_' + ix + '').draggable();
            var emoji_content = '<div class="emoji_content">';
            var emoji_tab = '<div class="emoji_tab" style="' + (groupLength === 1 && !showTab ? 'display:none;' : '') + '"><div class="emoji_tab_prev"></div><div class="emoji_tab_list"><ul>';
            var panel,
                name,
                path,
                maxNum,
                excludeNums,
                file,
                placeholder,
                alias,
                title,
                index,
                notation;
            for (var i = 0; i < groupLength; i++) {
                name = iconsGroup[i].name || 'group' + (i + 1);
                path = iconsGroup[i].path;
                maxNum = iconsGroup[i].maxNum;
                excludeNums = iconsGroup[i].excludeNums;
                file = iconsGroup[i].file || '.gif';
                placeholder = iconsGroup[i].placeholder || '#em' + (i + 1) + '_{alias}#';
                alias = iconsGroup[i].alias;
                title = iconsGroup[i].title;
                index = 0;
                if (!path || !maxNum) {
                    alert('The ' + i + ' index of icon groups has error config!');
                    continue;
                }
                panel = '<div id="emoji' + i + '" class="emoji_icons" style="' + (i === 0 ? '' : 'display:none;') + '"><ul>';
                for (var j = 1; j <= maxNum; j++) {
                    if (excludeNums && excludeNums.indexOf(j) >= 0) {
                        continue;
                    }
                    if (alias) {
                        if (typeof alias !== 'object') {
                            alert('Error config about alias!');
                            break;
                        }
                        notation = placeholder.replace(new RegExp('{alias}', 'gi'), alias[j].toString());
                    } else {
                        notation = placeholder.replace(new RegExp('{alias}', 'gi'), j.toString());
                    }
                    panel += '<li><a data-emoji_code="' + notation + '" data-index="' + index + '" title="' + (title && title[j] ? title[j] : '') + '"><img src="' + path + j + file + '"/></a></li>';
                    index++;
                }
                panel += '</ul></div>';
                emoji_content += panel;
                //emoji_tab += '<li data-emoji_tab="emoji' + i + '" class="' + (i === 0 ? 'selected' : '') + '" title="' + name + '">' + name + '</li>';
            }
            emoji_content += '</div>';
            //emoji_tab += '</ul></div><div class="emoji_tab_next"></div></div>';
            var emoji_preview = '<div class="emoji_preview"><img/></div>';
            emoji_container += emoji_content;
            emoji_container += emoji_tab;
            emoji_container += emoji_preview;

            $(emoji_container).appendTo($('body'));

            btnTop = $(btn).offset().top + $(btn).outerHeight() + 10;
            btnLeft = $(btn).offset().left;
            $('#emoji_container_' + ix).css({'top': btnTop + 'px', 'left': btnLeft + 'px'});

            /*$('#emoji_container_' + ix + ' .emoji_content').mCustomScrollbar({
                theme: 'minimal-dark',
                scrollbarPosition: 'inside',
                mouseWheel: {
                    scrollAmount: 275
                }
            });*/

            var pageCount = groupLength % 8 === 0 ? parseInt(groupLength / 8) : parseInt(groupLength / 8) + 1;
            var pageIndex = 1;
            $(document).on({
                'click': function (e) {
                    var target = e.target;
                    var field = that.$content[0];
                    var code,
                        tab,
                        imgSrc,
                        insertHtml;
                    if (target === $(btn)[0]) {
                        $('#emoji_container_' + ix)[that.toggleFunc]();
                        that.$content.focus();
                    } else if ($(target).parents('#emoji_container_' + ix).length > 0) {
                        code = $(target).data('emoji_code') || $(target).parent().data('emoji_code');
                        tab = $(target).data('emoji_tab');
                        if (code) {
                            if (field.nodeName === 'DIV') {
                                imgSrc = $('#emoji_container_' + ix + ' a[data-emoji_code="' + code + '"] img').attr('src');
                                insertHtml = '<img class="emoji_icon" src="' + imgSrc + '"/>';
                                that._insertAtCursor(field, insertHtml, false);
                            } else {
                                that._insertAtCursor(field, code);
                            }
                            that.hide();
                        }
                        else if (tab) {
                            if (!$(target).hasClass('selected')) {
                                $('#emoji_container_' + ix + ' .emoji_icons').hide();
                                $('#emoji_container_' + ix + ' #' + tab).show();
                                $(target).addClass('selected').siblings().removeClass('selected');
                            }
                        } else if ($(target).hasClass('emoji_tab_prev')) {
                            if (pageIndex > 1) {
                                $('#emoji_container_' + ix + ' .emoji_tab_list ul').css('margin-left', ('-503' * (pageIndex - 2)) + 'px');
                                pageIndex--;
                            }

                        } else if ($(target).hasClass('emoji_tab_next')) {
                            if (pageIndex < pageCount) {
                                $('#emoji_container_' + ix + ' .emoji_tab_list ul').css('margin-left', ('-503' * pageIndex) + 'px');
                                pageIndex++;
                            }
                        }
                        that.$content.focus();
                    } else if ($('#emoji_container_' + ix + ':visible').length > 0) {
                        that.hide();
                        that.$content.focus();
                    }
                }
            });

            $('#emoji_container_' + ix + ' .emoji_icons a').mouseenter(function () {
                var index = $(this).data('index');
                if (parseInt(index / 5) % 2 === 0) {
                    $('#emoji_container_' + ix + ' .emoji_preview').css({'left': 'auto', 'right': 0});
                } else {
                    $('#emoji_container_' + ix + ' .emoji_preview').css({'left': 0, 'right': 'auto'});
                }
                var src = $(this).find('img').attr('src');
                $('#emoji_container_' + ix + ' .emoji_preview img').attr('src', src).parent().show();
            });

            $('#emoji_container_' + ix + ' .emoji_icons a').mouseleave(function () {
                $('#emoji_container_' + ix + ' .emoji_preview img').removeAttr('src').parent().hide();
            });
        },

        _insertAtCursor: function (field, value, selectPastedContent) {
            var sel, range;
            if (field.nodeName === 'DIV') {
                field.focus();
                if (window.getSelection) {
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();
                        var el = document.createElement('div');
                        el.innerHTML = value;
                        var frag = document.createDocumentFragment(), node, lastNode;
                        while ((node = el.firstChild)) {
                            lastNode = frag.appendChild(node);
                        }
                        var firstNode = frag.firstChild;
                        range.insertNode(frag);

                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            if (selectPastedContent) {
                                range.setStartBefore(firstNode);
                            } else {
                                range.collapse(true);
                            }
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                } else if ((sel = document.selection) && sel.type !== 'Control') {
                    var originalRange = sel.createRange();
                    originalRange.collapse(true);
                    sel.createRange().pasteHTML(html);
                    if (selectPastedContent) {
                        range = sel.createRange();
                        range.setEndPoint('StartToStart', originalRange);
                        range.select();
                    }
                }
            } else {
                if (document.selection) {
                    field.focus();
                    sel = document.selection.createRange();
                    sel.text = value;
                    sel.select();
                }
                else if (field.selectionStart || field.selectionStart === 0) {
                    var startPos = field.selectionStart;
                    var endPos = field.selectionEnd;
                    var restoreTop = field.scrollTop;
                    field.value = field.value.substring(0, startPos) + value + field.value.substring(endPos, field.value.length);
                    if (restoreTop > 0) {
                        field.scrollTop = restoreTop;
                    }
                    field.focus();
                    field.selectionStart = startPos + value.length;
                    field.selectionEnd = startPos + value.length;
                } else {
                    field.value += value;
                    field.focus();
                }
            }

        },

        show: function () {
            $('#emoji_container_' + this.index)[this.showFunc]();
        },

        hide: function () {
            $('#emoji_container_' + this.index)[this.hideFunc]();
        },

        toggle: function () {
            $('#emoji_container_' + this.index)[this.toggleFunc]();
        }
    };

    function fn(option) {
        emoji_index++;
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('plugin_' + PLUGIN_NAME + emoji_index);
            var options = $.extend({}, DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) $this.data('plugin_' + PLUGIN_NAME + emoji_index, (data = new Plugin(this, options)));
            if (typeof option === 'string') data[option]();
        });
    }

    $.fn[PLUGIN_NAME] = fn;
    $.fn[PLUGIN_NAME].Constructor = Plugin;

}(jQuery, window, document));

(function ($, window, document) {

    var PLUGIN_NAME = 'emojiParse',
        VERSION = '1.1.0',
        DEFAULTS = {
            icons: []
        };

    function Plugin(element, options) {
        this.$content = $(element);
        this.options = options;
        this._init();
    }

    Plugin.prototype = {
        _init: function () {
            var that = this;
            var iconsGroup = this.options.icons;
            var groupLength = iconsGroup.length;
            var path,
                file,
                placeholder,
                alias,
                pattern,
                regexp,
                revertAlias = {};
            if (groupLength > 0) {
                for (var i = 0; i < groupLength; i++) {
                    path = iconsGroup[i].path;
                    file = iconsGroup[i].file || '.gif';
                    placeholder = iconsGroup[i].placeholder;
                    alias = iconsGroup[i].alias;
                    if (!path) {
                        alert('Path not config!');
                        continue;
                    }
                    if (alias) {
                        for (var attr in alias) {
                            if (alias.hasOwnProperty(attr)) {
                                revertAlias[alias[attr]] = attr;
                            }
                        }
                        pattern = placeholder.replace(new RegExp('{alias}', 'gi'), '([\\s\\S]+?)');
                        regexp = new RegExp(pattern, 'gm');
                        that.$content.html(that.$content.html().replace(regexp, function ($0, $1) {
                            var n = revertAlias[$1];
                            if (n) {
                                return '<img class="emoji_icon" src="' + path + n + file + '"/>';
                            } else {
                                return $0;
                            }
                        }));
                    } else {
                        pattern = placeholder.replace(new RegExp('{alias}', 'gi'), '(\\d+?)');
                        that.$content.html(that.$content.html().replace(new RegExp(pattern, 'gm'), '<img class="emoji_icon" src="' + path + '$1' + file + '"/>'));
                    }
                }
            }
        }
    };

    function fn(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('plugin_' + PLUGIN_NAME);
            var options = $.extend({}, DEFAULTS, $this.data(), typeof option === 'object' && option);

            if (!data) $this.data('plugin_' + PLUGIN_NAME, (data = new Plugin(this, options)));
            if (typeof option === 'string') data[option]();
        });
    }

    $.fn[PLUGIN_NAME] = fn;
    $.fn[PLUGIN_NAME].Constructor = Plugin;

}(jQuery, window, document));

//Para poder utilizarlo en los perfiles de usuarios y hacer un wallpost

$('#my-shout-body-wall').emoji({


    // show emoji groups
    showTab: true,

    // 'fade', slide' or 'none'
    animation: 'fade',

    icons: [{
        name: "EmotiMiWall", // Emoji name
        path: "//emoj/", // ACÁ SE AGREGA LA CARPETA EN DONDE VAN A ESTAR LOS EMOJIS!!
        maxNum: 53,
        file: ".gif", // file extension name
        placeholder: " {alias} ",
        excludeNums: [50], // exclude emoji icons
        title: {}, // titles of emoji icons
        alias: {
            1: ":RodolfoGS:",
            2: ":)",
            3: ";)",
            4: ":winky:",
            5: ":grin:",
            6: ":alaba:",
            7: "8|",
            8: ":cool:",
            9: "X(",
            10: ":cry:",
            11: ":crying:",
            12: ":F",
            13: ":lpmqtp:",
            14: ":love:",
            15: ":D",
            16: ":lala:",
            17: ":idiot:",
            18: ":|",
            19: ":headbang:",
            20: "^^",
            21: ":noo:",
            22: ":oops:",
            23: ":roll:",
            24: ":?",
            25: ":(",
            26: ":shrug:",
            27: ":twisted:",
            28: ":mario:",
            29: ":zombie:",
            30: ":RIP:",
            31: ":info:",
            32: ":]",
            33: ":globo:",
            34: ":fantasma:",
            35: ":bobo:",
            36: ":alien:",
            37: ":metal:",
            38: ":man:",
            39: ":q:",
            40: ":OK:",
            41: ":buenpost:",
            42: ":smiley:",
            43: ":wink:",
            44: ":clap:",
            45: ":ok_hand:",
            46: ":heart:",
            47: ":question:",
            48: ":exclamation:",
            49: ":musical_note:",
            50: ":poop:",
            51: ":flushed:",
            52: ":heart_eyes:",
            53: ":eyes:"
        },
    }]
});
// Para utilizarlo en Mi Taringa!
$("#my-shout-body-mi").emoji({

    // show emoji groups
    showTab: true,

    // 'fade', slide' or 'none'
    animation: 'fade',

    icons: [{
        name: "EmotiMiWall", // Emoji name
        path: "//problem.webcindario.com/emoj/", // path to the emoji icons
        maxNum: 53,
        file: ".gif", // file extension name
        placeholder: " {alias} ",
        excludeNums: [50], // exclude emoji icons
        title: {}, // titles of emoji icons
        alias: {
            1: ":RodolfoGS:",
            2: ":)",
            3: ";)",
            4: ":winky:",
            5: ":grin:",
            6: ":alaba:",
            7: "8|",
            8: ":cool:",
            9: "X(",
            10: ":cry:",
            11: ":crying:",
            12: ":F",
            13: ":lpmqtp:",
            14: ":love:",
            15: ":D",
            16: ":lala:",
            17: ":idiot:",
            18: ":|",
            19: ":headbang:",
            20: "^^",
            21: ":noo:",
            22: ":oops:",
            23: ":roll:",
            24: ":?",
            25: ":(",
            26: ":shrug:",
            27: ":twisted:",
            28: ":mario:",
            29: ":zombie:",
            30: ":RIP:",
            31: ":info:",
            32: ":]",
            33: ":globo:",
            34: ":fantasma:",
            35: ":bobo:",
            36: ":alien:",
            37: ":metal:",
            38: ":man:",
            39: ":q:",
            40: ":OK:",
            41: ":buenpost:",
            42: ":smiley:",
            43: ":wink:",
            44: ":clap:",
            45: ":ok_hand:",
            46: ":heart:",
            47: ":question:",
            48: ":exclamation:",
            49: ":musical_note:",
            50: ":poop:",
            51: ":flushed:",
            52: ":heart_eyes:",
            53: ":eyes:"
        },
    }]
});
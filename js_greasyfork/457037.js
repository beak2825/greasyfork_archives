// ==UserScript==
// @name          Wanikani Reorder Ultimate 2
// @namespace     https://www.wanikani.com
// @description   Learn in the order you want to.
// @version       2.3.2
// @include       /^https://(www|preview).wanikani.com/(lesson|review)/session/
// @grant         none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457037/Wanikani%20Reorder%20Ultimate%202.user.js
// @updateURL https://update.greasyfork.org/scripts/457037/Wanikani%20Reorder%20Ultimate%202.meta.js
// ==/UserScript==

// Original source:  https://gist.github.com/xMunch/6beafa1a79a77386cd92/raw/WKU.user.js
// Wanikani thread:  https://community.wanikani.com/t/reorder-ultimate-23-2022/59834
// Author: xMunch
// Maintainer: keRLos

window.reorder = {};

(function(gobj) {

    /* globals $, jQuery, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Reorder Ultimate 2';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    // HTML5 Sortable jQuery Plugin
    // http://farhadi.ir/projects/html5sortable
    // Copyright 2012, Ali Farhadi
    // Released under the MIT license.
    (function(e){var t,n=e();e.fn.sortable=function(r){var i=String(r);r=e.extend({connectWith:false},r);return this.each(function(){var s;if(/^enable|disable|destroy$/.test(i)){s=e(this).children(e(this).data("items")).attr("draggable",i=="enable");if(i=="destroy"){s.add(this).removeData("connectWith items").off("dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s");}return;}var o,u;s=e(this).children(r.items);var a=e("<"+(/^ul|ol$/i.test(this.tagName)?"li":"div")+' class="sortable-placeholder">');s.find(r.handle).mousedown(function(){o=true;}).mouseup(function(){o=false;});e(this).data("items",r.items);n=n.add(a);if(r.connectWith){e(r.connectWith).add(this).data("connectWith",r.connectWith);}s.attr("draggable","true").on("dragstart.h5s",function(n){if(r.handle&&!o){return false;}o=false;var i=n.originalEvent.dataTransfer;i.effectAllowed="move";i.setData("Text","dummy");u=(t=e(this)).addClass("sortable-dragging").index();}).on("dragend.h5s",function(){if(!t){return;}t.removeClass("sortable-dragging").show();n.detach();if(u!=t.index()){t.parent().trigger("sortupdate",{item:t});}t=null;}).not("a[href], img").on("selectstart.h5s",function(){if(this.dragDrop&&this.dragDrop()){return false;}}).end().add([this,a]).on("dragover.h5s dragenter.h5s drop.h5s",function(i){if(!s.is(t)&&r.connectWith!==e(t).parent().data("connectWith")){return true;}if(i.type=="drop"){i.stopPropagation();n.filter(":visible").after(t);t.trigger("dragend.h5s");return false;}i.preventDefault();i.originalEvent.dataTransfer.dropEffect="move";if(s.is(this)){if(r.forcePlaceholderSize){a.height(t.outerHeight());}t.hide();e(this)[a.index()<e(this).index()?"after":"before"](a);n.not(a).detach();}else if(!n.is(this)&&!e(this).children(r.items).length){n.detach();e(this).append(a);}return false;});});};})(jQuery);

    var rad_levels, kan_levels, voc_levels;

    function storage_set(name, value) {localStorage[name] = JSON.stringify(value);}
    function storage_get(name) {try {return JSON.parse(localStorage[name]);} catch(err) {return null;};}

    var ui_css =
        '.ui, .ui-small {'+
        '	list-style: none;'+
        '	color: rgb(255, 255, 255);'+
        '	border-radius: 6px;'+
        '	margin: 5px;'+
        '	padding: 5px;'+
        '	min-height: 30px;'+
        '	background: rgb(85, 85, 85);'+
        '}'+
        '.ui-small {text-align: right; margin-bottom: 5px;}'+
        '.center {margin: 0 auto;}'+
        '#left {min-width: 150px; min-height: 150px;}'+
        '#mid {padding-top: 20px; text-align: center;}'+
        '#right {min-width: 150px; min-height: 150px; text-align: right;}'+
        '.unsorted, .hidden {display: none !important; visibility: none !important}'+
        'item[id^=level-] {background: gray}'+
        '.sortable {padding: 0}'+
        '.sortable item {'+
        '    display: inline-block;'+
        '    font-size: 12px;'+
        '    height: 20px;'+
        '    width: 55px;'+
        '    list-style: none;'+
        '    border-radius: 6px;'+
        '    text-align: center;'+
        '    margin: 5px;'+
        '    padding: 5px 15px;'+
        '    border: 1px solid rgb(51, 51, 51)'+
        '}'+
        '.sortable-placeholder {'+
        '    display: inline !important;'+
        '    border: 1px dashed #CCC !important;'+
        '    background: none;'+
        '    padding: 6px 40px !important'+
        '}'+
        '#priority, #priority2 {'+
        '    background: url("data:image/png;base64,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");'+
        '    background-repeat: no-repeat;'+
        '    width: 150px;'+
        '    height: 150px;'+
        '    display: block'+
        '}'+
        '#priority {float: right;}'+
        '.balance {background-position: -1px -1px !important}'+
        '.balance2 {background-position: -153px -1px !important}'+
        '.level-heavy {background-position: -1px -153px !important}'+
        '.meaning-heavy {background-position: -153px -153px !important}'+
        '.reading-heavy {background-position: -305px -1px !important}'+
        '.type-heavy {background-position: -305px -153px !important}'+
        '#overlay {'+
        '  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATAAAAEwCAMAAAAHJd3BAAAC4lBMVEUAAAAAAACAgIBVVVVAQEBmZmZVVVVJSUlgYGBVVVVNTU1GRkZVVVVOTk5JSUlVVVVQUFBLS0tRUVFNTU1RUVFOTk5VVVVSUlJOTk5SUlJPT09NTU1QUFBNTU1TU1NQUFBOTk5OTk5TU1NNTU1NU01RUVFPT09OTk5OTlNRUVFSUlJQUFBOTk5QUFBPT09PT09SUlJOTk5RUVFQUFBOTk5QUFBPT09PT09PU09TT09RUVFSUlJRUVFPT09OTk5OTlJSTk5RUVFQUFBPT09PUk9RUVFRUVFQUFBRUVFQUFBQUFBPT09PT09RUVFQUFBQUFBPT09QUFBPT09PUk9RUVFQUFBQUFBQUFJQUlBPT09PT1FRUVFQUFBPT09PT1FRUVFQUFBQUFBQUFJSUFBRUVFQUFBQUFBPT09QUFBQUFBQUFJPT09PUU9RUVFQUFBRUVFQUFBQUFBPT09PUU9QUFBQUFBQUlBRUVFQUFBQUlBSUFBQUFBSUFBQUFBQUVBRUFBRUVFRUVFQUFBQUFBPT09QUFBQUVBRUFBPT09QUFBRUFBRUVFQUFBQUFBRUVFQUFBQUlBQUFBPT09PT09PUU9QUFBQUFBQUFBRUVFQUFBQUFFQUFBRUVFPT09PUU9RT09QUFBQUFJSUFBQUFBQUFJQUlBQUFBQUFBQUFBQUFFQUVBQUFBQUFBRUVFQUFBQUFBRUFBRUVFPT09PT1FRT09QUFBQUFBQUFJQUFBRUFBQUFBQUFBSUFBQUFBRUFBQUFBQUFBQUFFRUFBQUFBQUFBRUFBQUFBPT09PUU9RT09QUFBQUFBQUVBQUFBQUFBQUFFRUFBQUFBQUFBQUFFQUVBQUFBQUFBRUFBQUFBRUFBQUFBQUFBQUlBQUFBQUVBQUFBQUVBPT09RT09QUFBQUVBRUFBQUFBRUFBQUFBQUFBQUFFQUVBRUFBQUFBQUFFQUFBQUFFQUFBQUFBQUFFQUVBRUFBekKCXAAAA8nRSTlMAAQIDBAUGBwgJCgsMDQ4PEBETFBYXGBkaHB0eICEiIyQnKCsrLC0uLi8yMzQ2Nzo7Pj9AQUNER0dHSEtMTU5OTk9QVFRVWFlbXF1eYWJjZmdpamprb3BwcHFxcnN0dHh5fX19fn+AgYKGhoeHi42Oj5CUlJWWlpiZmZmcnJ2dnZ6hoqOkpqamp6qqq6+wsbKys7S3t7i7vL6/v8DBxMTExcXFyMjIycvMzMzN0NHS09PU19fX2Nvb3Nzd3t7f3+Hi4uLj5eXm5+fn6Onp6+zs7O7v7+/w8fHy8vP09PX19vb39/j4+Pn5+vv7+/v8/P39/pju4PwAAB1bSURBVBgZ7OHRkqxJ1h3G+drRA6Nu+P7PyQsJmOmIpfgys87pHvAHBRpoVgXBnf/lv0v8H9j//Oeff/7rX3+ef/3zX//6c+/+5/2vP8+f/+q//jz/n73/PPvPf53/3H/ts//sP//VP88+55/d+5w/zzl7d5/jO5tZWWtm/phZK/9pZs0f+cd/yh9r1j/yv80//ljzx1r/r/njH/nHH/PHP9b/lrX++Mc//tM/5o9//OOPP/7Tf1r438fbYugxjL02J9R26nQT4qoSNEGQ+vYaBEkRqq4Qdo8eW8lhr20YpwzL2/jlSGY81saURcQE9VtdUdL4MdJQcdVvRUaERQd7ecwkjl/Gx1T0HBbbirflZcVLsYir9SO1rrBQL1lelrcsm8U5FR0f4+NEvWzXrutsOsWuj8ZHEhX1Q1RUEh+pj250yj6ubtf2Ujk+xi+TGn8zy8shxku6qVKPivoBKupRquzGywjHyxp/M5rxy/jSU47fDoedEywOFR9xVRoSP0BCGnXFR5TDQk42h+O3Q099GV8i8VtMzPaxa7k6HvHR1Et9a/XS1Ec8pq6l28ceGfFbIr6Mj+m0Buuw1GkOOh6xT3DEVcdbKOJbC0q8HXXFQc4WjylOetTiLIx2Oj7Gx8nBwR72UilWylAZiWulYgRB/RBFECOa5UpMlKFZaNTazMbByfExfom/2DI1bPVWbUN341FXNX6IVF31SHdJW/VWm9GJ7S/il/G2px3hWMcVB8uqOla8dMTVeov4MSLeWldMvWQ5qsvCEddZDjHtbG/jbZ2olz3egopgE1eOlyD1aONHSOvRIF5OXGEjooi32V4qZ3kbXzrUtVyLkbOzqauI34KgktYP0CaKIH4L6io7+8SwXMtVpr6MxzA545e165pleYsSf1UhrsS3l7hC1F+Firdljat7+WVOhvEYL3VqE4PYHrVt4m/qUZS2rvr26mpLUY/6m7Bt9diCEbYe9TIeJySog3qpg6qp69QjqIhHvNW3Vm/xiCji0ePqqOKol+IoEnI8xsdogrG9nbAs4sQ1wSiCSqm3+NbirTSKoAYZV46wLHK8bYOkxse4Fvugob5MzfYyRU7FER8pSYr49oImofERR/QEHS97dHwpKc5muca1Y42hxDpYSLCjjquoRzymCZpS315piqTjEY+irqOykWDhLKGMWbJd4xHqVJQ9lo3WYxBk1EsVh9I0fog0pRxUvdQEwXi02JbZVPQo8RiPYwchx/J2OOiJVDl+iStCmqofoJqGiCt+OVQjpzgcb8sJQbbjMd7WcdW12a4RTFQiKlEsb1VXI/HtJVJX1dtCJSoSlUGMa7NddZ3lbfyWeixfOksqjiuU0e1liCvV+vZajSuMl11DieuIxpr6sjwav42PMWX8RRx2lKLTxGGFcoLWFT9AXC1yKFkcSacolc0RfzF0jI/xto8jYezD8jLohKgcrWsjHg1p/BBpSD2C7WqdqJApxsvibEPiONvb+JiKHodhu8q2HMZjEFfVoypSP0Qjqh5VVzAew7Fs6toMx6no+BhvSxT1slxx7eAQPV6CcDSERv0AlRJShyBeToWDbFdcy0tRsbyN3yIy49quequrjEdROiK0qfgBommJmFLUY6ir3urarpmI+G18HKq+LL+FiitMuoS4qokQ316IpOoKsZohrijx2/KlyvExfksNVlk7xFlUicbLYatriKirvr26KsK4anO8pEKVdYTsRRdG47fxMTSOc4StDrO7giEldYW4jqsN6gco0rqOK8TV0DDI6h6O2sQ5jpTxMd4240u85ax4HC8N461eoip+gKiKl3obUi/HI+vEW3wZtrfxto6jGTNOkY7adoehiJfliquaSPwIiaTqimt5Ccow3baaBj1mTOo4y9v4LXqcY7AaZZETh6D0sL1MRVrqRyhtRMfL5pQiHDlhUenCOMep+G18jCGD49qI2VbV+Ajq7VASV3x7cSWU462Ij1Fd9gi262DCGB/jt+pBsbwcRBzq0fhlgrZofXst2iLjl9SjHBEcLwvFqfpt/HIIY2G7apbtSzzGX4QEob61EiTEX4xHfNnWqGtjGcLxy/g4JsrheItrdWoqiL86VWldEd9axNVG9firIDo6Xa54Oxwq4/gYH0NdY4/lY9s5iKrSw6JegrTqB6g2iJeyOKWqgpNt+1hmG1cZH+NtHycxjmtbnDos4hAvIUgZjzSob69I4zE0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");'+
        '  background-repeat: no-repeat;'+
        '	display: block;'+
        '}'+
        '.left {width: 150px; height: 150px; background-position: -1px -1px;}'+
        '.right {width: 150px; height: 150px; background-position: -153px -1px;}'+
        '.top {width: 150px; height: 150px; background-position: -1px -153px;}'+
        '#reorder_ultimate .reverse {margin-left:20px; cursor:pointer;}'+
        '#quick-next {cursor: pointer; display: inline-block; color: gray; font-size: 20px;}'+
        '#quick-next.active {color: green;}'+
        '#version {float: right;}'+
        '#reorder_ultimate {margin-bottom:75px;}';

    var ui_html =
        '<div class="ui-small hidden pure-g-r">'+
        '  <button class="icon-plus"></button>'+
        '</div>'+
        '<div id="reorder_ultimate" class="ui pure-g-r">'+
        '  <div class="pure-u-1-4" id="left">'+
        '    <div id="r-only">'+
        '      <div style="padding: 10px;"><input type="checkbox" id="mode">1x1 Mode</div>'+
        '      <div class="balance2" id="priority2">'+
        '        <div id="overlay" class=""></div>'+
        '      </div>'+
        '    </div>'+
        '  </div>'+
        '  <div class="pure-u-1-2" id="mid">'+
        '    <div class="sort_group">'+
        '      <div>'+
        '        <input type="checkbox" class="sort-types" value="checked" checked=""> Sort Types'+
        '        <span class="reverse icon-refresh"> Reverse</span>'+
        '      </div>'+
        '      <ul class="types sortable">'+
        '        <item class="radical" style="background-color:#0af;" draggable="true">部首</item>'+
        '        <item class="kanji" style="background-color:#f0a;" draggable="true">漢字</item>'+
        '        <item class="vocabulary" style="background-color:#a0f;" draggable="true">単語</item>'+
        '      </ul>'+
        '    </div>'+
        '    <div class="sort_group">'+
        '      <div>'+
        '        <input type="checkbox" class="sort-levels" checked=""> Sort Levels'+
        '        <span class="reverse icon-refresh"> Reverse</span>'+
        '      </div>'+
        '      <ul class="levels sortable">'+
        '      </ul>'+
        '    </div>'+
        '    <div>'+
        '      <button class="reorder" onclick="this.blur();" tabindex="-1" style="border-radius: 6px; padding: 5px; color: black;">Force Reorder</button>'+
        '    </div>'+
        '  </div>'+
        '  <div class="pure-u-1-4" id="right">'+
        '    <div><button class="icon-minus" style="color:black; margin-bottom: 17px;"></button></div>'+
        '    <div class="balance" id="priority">'+
        '      <div id="overlay" class=""></div>'+
        '    </div>'+
        '  </div>'+
        '  <div class="pure-u-1">'+
        '    <div id="quick-next" class="icon-fast-forward"></div>'+
        '    <div id="version">v2.0.X</div>'+
        '  </div>'+
        '</div>';

    var activeLevels = [];
    var dataset = {};
    var lastUpdate = new Date().getTime();
    var lessonset = {
        quick: 'l',
        queue: 'l/lessonQueue',
        active: 'l/activeQueue',
        updateVisual: function() {
            $('li[data-index="0"]').click();
            var items = $.jStorage.get(dataset.queue).concat($.jStorage.get(dataset.active));
            $.jStorage.set('l/count/rad', sorter.filterType("rad", items).length);
            $.jStorage.set('l/count/kan', sorter.filterType("kan", items).length);
            $.jStorage.set('l/count/voc', sorter.filterType("voc", items).length);
        }
    };

    var showerr = function(err) {
        $('#supplement-info, #information').first().after('<div id="error" style="text-align:center;">An error has occurred within WaniKani Reorder Ultimate.  Please post the error below on the forum thread.<br><a href="https://community.wanikani.com/t/userscript-reorder-ultimate-2-newest/35152" target="_blank">https://community.wanikani.com/t/userscript-reorder-ultimate-2-newest/35152</a><br><br>' + err.stack.replace(/\n/g,'<br>') + '<br><br>Logs:<br>' + console.dlog.join('<br>') + '</div>');
    };

    var reviewset = {
        quick: 'r',
        queue: 'reviewQueue',
        active: 'activeQueue',
        updateVisual: function() {
            var item = $.jStorage.get(dataset.active)[Math.floor(window.Math.random(true))];
            if (item.rad !== undefined) {
                $.jStorage.set('questionType', 'meaning');
            }
            if (item) {
                $.jStorage.set('currentItem', item);
            }
            var count = $.jStorage.get(dataset.queue).length + $.jStorage.get(dataset.active).length;
            $("#available-count").html(count); // to stop the double-up bug.
        }
    };
    var ordered = false;
    var settings = {
        data: {
            sorttypes: !0,
            sortlevels: !0,
            onebyone: !1,
            quickNext: !1,
            priority: {
                'rad': 1,
                'kan': 2,
                'voc': 3,
            },
            questionTypeMode: "0",
            typePriorityMode: "0"
        },
        load: function() {
            var a = storage_get('WKU/' + dataset.quick + '/settings');
            if (a === null) {
                settings.save();
                return settings.load();
            }
            utilities.log("Loading settings...");
            for (var s in settings.data) {
                if (a[s] !== null) settings.data[s] = a[s];
            }
            $('#reorder_ultimate .types item').sort(function(a, b) {
                return sorter.getHTMLElementPriority(a) - sorter.getHTMLElementPriority(b);
            }).appendTo('#reorder_ultimate .types');
            $('#reorder_ultimate .sort-types').prop('checked', settings.data.sorttypes).change();
            $('#reorder_ultimate .sort-levels').prop('checked', settings.data.sortlevels).change();
            $('#priority').removeClass().addClass(utilities.settingsValueToClass('priority', settings.data.typePriorityMode));
            $('#quick-next').toggleClass('active', settings.data.quickNext);
            if (dataset.quick === 'r') {
                $('#mode').prop('checked', settings.data.onebyone).change();
                $('#priority2').removeClass().addClass(utilities.settingsValueToClass('priority2', settings.data.questionTypeMode));
            }
            utilities.log(settings.data);
        },
        save: function() {
            storage_set('WKU/' + dataset.quick + '/settings', settings.data);
        }
    };
    var setup = {
        init: function() {
//            try {
                $('div[id*="loading"]').off('hide');
                console.dlog = [];
                utilities.log("WKU Init()");
                setup.ui.create();
//            } catch (err) {
//                showerr(err);
//            }
        },
        update: {
            apply: function() {
                try {
                    var queue = $.jStorage.get(dataset.active).concat($.jStorage.get(dataset.queue));
                    var current = $.jStorage.get('currentItem');
                    $.each(queue, function() {
                        if (this.voc !== undefined) {
                            this.level = voc_levels[this.voc];
                        } else if (this.kan !== undefined) {
                            this.level = kan_levels[this.kan];
                        } else if (this.rad !== undefined) {
                            this.level = rad_levels[this.en[0].toLowerCase().replace(' ','-')];
                        }
                        if (current && utilities.toUID(this) === utilities.toUID(current)) {
                            $.jStorage.set('currentItem', this);
                        }
                        if (activeLevels.indexOf(this.level) == -1) {
                            activeLevels.push(this.level);
                        }
                    });
                    activeLevels.sort(function(a, b) {
                        return a - b;
                    });
                    var review = queue.splice((dataset.quick === 'r' ? 10 : $.jStorage.get('l/batchSize')));
                    $.jStorage.set(dataset.active, queue);
                    $.jStorage.set(dataset.queue, review);
                    dataset.updateVisual();
                } catch (err) {
                    showerr(err);
                }
            }
        },
        ui: {
            create: function() {
                setup.update.apply();
                $('head').append('<style>'+ui_css+'</style>');
                utilities.log("Creating UI...");
                var info = $('#supplement-info, #information').first();
                info.after(ui_html);
                $('#version').text("v" + GM_info.script.version);
                if (dataset.quick === 'l') {
                    $('.ui').find('#r-only').remove();
                }
                $('fieldset').on('addClass', function(evt) {
                    if (settings.data.quickNext) {
                        setTimeout(function() {
                            if ($('fieldset').hasClass('correct')) {
                                $('fieldset button').click();
                            }
                        }, 25);
                    }
                });
                $('#quick-next').click(function() {
                    $(this).toggleClass('active');
                    settings.data.quickNext = $(this).hasClass('active');
                    settings.save();
                });
                $('#priority, #priority2').click(function(e) {
                    var offset = $(this).offset();
                    var x = (e.pageX - offset.left);
                    var y = (e.pageY - offset.top);
                    var id = $(this).attr('id');
                    if (y > 50) {
                        if (x < 75) {
                            if (id === "priority") {
                                $(this).removeClass().addClass("level-heavy");
                                settings.data.typePriorityMode = "1";
                                sorter.reorder();
                            } else {
                                $(this).removeClass().addClass("reading-heavy");
                                settings.data.questionTypeMode = "1";
                                utilities.forceQuestionTypeUpdate();
                            }
                        } else {
                            if (id === "priority") {
                                $(this).removeClass().addClass("type-heavy");
                                settings.data.typePriorityMode = "2";
                                sorter.reorder();
                            } else {
                                $(this).removeClass().addClass("meaning-heavy");
                                settings.data.questionTypeMode = "2";
                                utilities.forceQuestionTypeUpdate();
                            }
                        }
                    } else {
                        if (id === "priority") {
                            $(this).removeClass().addClass("balance");
                            settings.data.typePriorityMode = "0";
                            sorter.reorder();
                        } else {
                            $(this).removeClass().addClass("balance2");
                            settings.data.questionTypeMode = "0";
                            utilities.forceQuestionTypeUpdate();
                        }
                    }
                    settings.save();
                }).mousemove(function(e) {
                    var offset = $(this).offset();
                    var x = (e.pageX - offset.left);
                    var y = (e.pageY - offset.top);
                    var ele = $(this).find('#overlay');
                    if (y > 50) {
                        if (x < 75) {
                            ele.removeClass().addClass('left');
                        } else {
                            ele.removeClass().addClass('right');
                        }
                    } else {
                        ele.removeClass().addClass('top');
                    }
                }).mouseleave(function(e) {
                    $(this).find('#overlay').removeClass();
                });
                activeLevels.forEach(function(ele) {
                    $('#reorder_ultimate .levels').append('<item id="level-' + ele + '">' + ele + '</item>');
                });
                $('#reorder_ultimate .reverse').click(function() {
                    var parent = $(this).closest('.sort_group').find('.sortable');
                    var items = parent.children('item');
                    parent.append(items.get().reverse());
                    sorter.reorder();
                    settings.save();
                });
                $('.icon-minus, .icon-plus').click(function() {
                    $('.ui, .ui-small').toggleClass('hidden');
                });
                $('#reorder_ultimate .sort-types, #reorder_ultimate .sort-levels').change(function() {
                    $(this).closest('sort_group').find('.sortable item').toggleClass('unsorted', !this.checked);
                    settings.data[$(this).attr('class').replace("-", "")] = this.checked;
                    settings.save();
                });
                if (dataset.quick === 'r') {
                    $('#mode').on('change', function() {
                        settings.data.onebyone = this.checked;
                        if (settings.data.questionTypeMode > 0) {
                            utilities.forceQuestionTypeUpdate();
                        }
                        settings.save();
                    });
                    $('#option-wrap-up').click(function() {
                        if ($(this).attr('class') === 'wrap-up-selected') {
                            var fullQueue = $.jStorage.get(dataset.active).concat($.jStorage.get(dataset.queue));
                            $.jStorage.set(dataset.active, fullQueue.splice(0, 10));
                            $.jStorage.set(dataset.queue, fullQueue);
                            setup.ui.toggler();
                        } else {
                            if (ordered) {
                                sorter.reorder();
                            }
                        }
                    });
                }
                settings.load();
                setup.ui.toggler();
                $('#reorder_ultimate .reorder').click(function() {
                    sorter.reorder();
                });
                $('body').on('contextmenu', '.ui', function(e) {
                    e.preventDefault();
                });
                $('item').mousedown(function(event) {
                    if (event.which === 3) {
                        var ele = $(this).addClass('hidden');
                        if (ele.attr('id')) {
                            sorter.removeLevel(parseInt(ele.text()));
                        } else {
                            sorter.removeType(ele.attr('class'));
                        }
                    }
                });
                $('.sortable').sortable({
                    items: ':not(div, button)'
                }).bind('sortupdate', function() {
                    sorter.reorder();
                    settings.save();
                });
            },
            toggler: function() {
                if ($('.sortable').length) {
                    var fq = $.jStorage.get(dataset.queue).concat($.jStorage.get(dataset.active));
                    if (!fq.length) {
                        utilities.log("There are no options available... Removing UI.");
                        $('.ui').remove();
                    } else {
                        $('#reorder_ultimate .types .radical').toggleClass('hidden', !sorter.filterType("rad", fq).length).prop('title', function() {
                            var filtered = sorter.filterType("rad", fq);
                            var text = "Total: " + filtered.length;
                            $.each(activeLevels, function() {
                                var amount = sorter.filterLevel(this, filtered).length;
                                if (amount) {
                                    text += "\nLevel " + this + ": " + amount + "";
                                }
                            });
                            return text;
                        });
                        $('#reorder_ultimate .types .kanji').toggleClass('hidden', !sorter.filterType("kan", fq).length).prop('title', function() {
                            var filtered = sorter.filterType("kan", fq);
                            var text = "Total: " + filtered.length;
                            $.each(activeLevels, function() {
                                var amount = sorter.filterLevel(this, filtered).length;
                                if (amount) {
                                    text += "\nLevel " + this + ": " + amount + "";
                                }
                            });
                            return text;
                        });
                        $('#reorder_ultimate .types .vocabulary').toggleClass('hidden', !sorter.filterType("voc", fq).length).prop('title', function() {
                            var filtered = sorter.filterType("voc", fq);
                            var text = "Total: " + filtered.length;
                            $.each(activeLevels, function() {
                                var amount = sorter.filterLevel(this, filtered).length;
                                if (amount) {
                                    text += "\nLevel " + this + ": " + amount + "";
                                }
                            });
                            return text;
                        });
                        activeLevels.forEach(function(level) {
                            $('#level-' + level).toggleClass('hidden', !sorter.filterLevel(level, fq).length).prop('title', function() {
                                var filtered = sorter.filterLevel(level, fq);
                                var rad = sorter.filterType("rad", filtered).length;
                                var kan = sorter.filterType("kan", filtered).length;
                                var voc = sorter.filterType("voc", filtered).length;
                                var text = "Total: " + filtered.length;
                                if (rad) {
                                    text += "\nRadicals: " + rad;
                                }
                                if (kan) {
                                    text += "\nKanji: " + kan;
                                }
                                if (voc) {
                                    text += "\nVocabulary: " + voc;
                                }
                                return text;
                            });
                        });
                        $('input[type="checkbox"]:disabled').removeAttr('disabled');
                    }
                }
            }
        },
        listeners: function() {
            var lastCount = $.jStorage.get(dataset.active).length + $.jStorage.get(dataset.queue).length;
            $.jStorage.listenKeyChange('currentItem', function() {
                if (lastCount < ($.jStorage.get(dataset.active).length + $.jStorage.get(dataset.queue).length)) {
                    lastCount = $.jStorage.get(dataset.active).length + $.jStorage.get(dataset.queue).length; // will infinitely trigger if not here.
                    setup.init();
                }
                lastCount = $.jStorage.get(dataset.active).length + $.jStorage.get(dataset.queue).length;
            });
            $.jStorage.listenKeyChange('currentItem', utilities.forceQuestionTypeUpdate);
            $.jStorage.listenKeyChange(dataset.active, setup.ui.toggler);
        }
    };
    var sorter = {
        filterLevel: function(level, list) {
            if (!list) {
                return [];
            }
            return list.filter(function(ele, ind) {
                return ele.level == level;
            });
        },
        filterType: function(type, list) {
            if (!list) {
                return [];
            }
            return list.filter(function(ele, ind) {
                return ele[type.substr(0, 3)];
            });
        },
        getHTMLElementPriority: function(a) {
            return a.className === 'radical' ? settings.data.priority.rad : a.className === 'kanji' ? settings.data.priority.kan : settings.data.priority.voc;
        },
        getPriority: function(a) {
            return (a.rad !== undefined) ? settings.data.priority.rad : (a.kan !== undefined) ? settings.data.priority.kan : settings.data.priority.voc;
        },
        randomize: function(list) {
            // Old randomizer used sort() with comparison function {return 0.5 - random();}.
            // Due to internals of sort algorithm, the resulting list doesn't randomize very well (values are unevenly favored).
            // Method below attaches a random number to each list item, sorts by the random numbers, then removes the random numbers.
            return list.map(function(v){return [window.Math.randomB(),v];}).sort(function(a,b){return a[0]-b[0];}).map(function(v){return v[1];});
        },
        reorder: function() {
            ordered = true;
            sorter.setPriorities();
            var queue = $.jStorage.get(dataset.queue);
            fetch(`/review/items?ids=${queue.join(',')}`)
            .then((response) => response.json())
            .then((data) => {
                var activeQueue = $.jStorage.get(dataset.active);
                var fullQueue = data.concat(activeQueue);
                fullQueue = sorter.randomize(fullQueue);
                if (parseInt(settings.data.typePriorityMode) == 1) {
                    if (settings.data.sortlevels) {
                        $('#reorder_ultimate .levels > item').each(function() {
                            var level = parseInt(this.innerHTML);
                            var sorted = sorter.filterLevel(level, fullQueue);
                            if (settings.data.sorttypes) {
                                sorted = sorter.sortByType(sorted);
                            } else {
                                sorted = sorter.randomize(sorted);
                            }
                            fullQueue = sorter.removeLevel(level, fullQueue);
                            fullQueue = fullQueue.concat(sorted);
                        });
                    }
                }
                if (parseInt(settings.data.typePriorityMode) == 2) {
                    if (settings.data.sorttypes) {
                        $('#reorder_ultimate .types > item').each(function() {
                            var typeFilter = sorter.filterType(this.className, fullQueue);
                            if (settings.data.sortlevels) {
                                $('#reorder_ultimate .levels > item').each(function() {
                                    var level = parseInt(this.innerHTML);
                                    var sorted = sorter.filterLevel(level, typeFilter);
                                    typeFilter = sorter.removeLevel(level, typeFilter);
                                    typeFilter = typeFilter.concat(sorted);
                                });
                            } else {
                                typeFilter = sorter.randomize(typeFilter);
                            }
                            fullQueue = sorter.removeType(this.className, fullQueue);
                            fullQueue = fullQueue.concat(typeFilter);
                        });
                    }
                }
                $.jStorage.set(dataset.active, (dataset.quick === 'r' ? fullQueue : fullQueue.splice(0, $.jStorage.get('l/batchSize'))));
                $.jStorage.set(dataset.queue, (dataset.quick === 'r' ? [] : fullQueue));
                setup.ui.toggler();
                dataset.updateVisual();
            });
        },
        removeLevel: function(level, list) {
            if (!list) {
                var fullQueue = sorter.removeLevel(level, $.jStorage.get(dataset.queue));
                var activeQueue = sorter.removeLevel(level, $.jStorage.get(dataset.active));
                $.jStorage.set(dataset.queue, fullQueue);
                $.jStorage.set(dataset.active, activeQueue);
                sorter.reorder();
                return;
            }
            return list.filter(function(ele, ind) {
                return ele.level != level;
            });
        },
        removeType: function(type, list) {
            if (!list) {
                var fullQueue = sorter.removeType(type, $.jStorage.get(dataset.queue));
                var activeQueue = sorter.removeType(type, $.jStorage.get(dataset.active));
                $.jStorage.set(dataset.queue, fullQueue);
                $.jStorage.set(dataset.active, activeQueue);
                sorter.reorder();
                return;
            }
            return list.filter(function(ele, ind) {
                return !ele[type.substr(0, 3)];
            });
        },
        sortByType: function(list) {
            return list.sort(function(a, b) {
                return (sorter.getPriority(a) - sorter.getPriority(b));
            });
        },
        setPriorities: function() {
            settings.data.priority.rad = $('#reorder_ultimate .types .radical').index();
            settings.data.priority.kan = $('#reorder_ultimate .types .kanji').index();
            settings.data.priority.voc = $('#reorder_ultimate .types .vocabulary').index();
        }
    };
    var utilities = {
        forceQuestionTypeUpdate: function() {
            var current = $.jStorage.get("currentItem");
            if (!current) {
                return;
            }
            var type = $.jStorage.get("questionType");
            if (current.rad !== undefined) {
                if (type !== "meaning") {
                    $.jStorage.set("questionType", "meaning");
                    $.jStorage.set("currentItem", current);
                }
                return;
            }
            var typeMethod = parseInt(settings.data.questionTypeMode);
            var data = $.jStorage.get(utilities.toUID(current));
            if (!typeMethod && (!data || (!data.mc && !data.rc))) {
                if ((new Date().getTime() - lastUpdate) > 500) {
                    lastUpdate = new Date().getTime();
                    var nextRandType = ["reading", "meaning"][Math.round(window.Math.randomB())];
                    if (type != nextRandType) {
                        $.jStorage.set('questionType', nextRandType);
                        $.jStorage.set("currentItem", current);
                    }
                }
            }
            if (typeMethod === 1) {
                if (!data || !data.rc) {
                    if (type !== "reading") {
                        $.jStorage.set("questionType", "reading");
                        $.jStorage.set("currentItem", current);
                    }
                } else {
                    if (type !== "meaning") {
                        $.jStorage.set("questionType", "meaning");
                        $.jStorage.set("currentItem", current);
                    }
                }
            }
            if (typeMethod === 2) {
                if (!data || !data.mc) {
                    if (type !== "meaning") {
                        $.jStorage.set("questionType", "meaning");
                        $.jStorage.set("currentItem", current);
                    }
                } else {
                    if (type !== "reading") {
                        $.jStorage.set("questionType", "reading");
                        $.jStorage.set("currentItem", current);
                    }
                }
            }
        },
        highestPriorityType: function() {
            return $('#reorder_ultimate .types item:not(.hidden)').first().attr('class');
        },
        highestPriorityLevel: function() {
            return parseInt($('#reorder_ultimate .levels item:not(.hidden)').first().text());
        },
        log: function(msg) {
            console.dlog.push(msg);
            console.debug(msg);
        },
        newRandom: function(fullVal) {
            if (!settings.data.onebyone && ordered) {
                var fullQueue = $.jStorage.get(dataset.active).concat($.jStorage.get(dataset.queue));
                var fullLength = fullQueue.length;
                if (settings.data.sortlevels && parseInt(settings.data.typePriorityMode) == 1) {
                    fullQueue = sorter.filterLevel(utilities.highestPriorityLevel(), fullQueue);
                    if (settings.data.sorttypes) {
                        fullQueue = sorter.filterType(utilities.toType(fullQueue[0]), fullQueue);
                    }
                }
                if (settings.data.sorttypes && parseInt(settings.data.typePriorityMode) == 2) {
                    fullQueue = sorter.filterType(utilities.highestPriorityType(), fullQueue);
                    if (settings.data.sortlevels) {
                        fullQueue = sorter.filterLevel(fullQueue[0].level, fullQueue);
                    }
                }
                return Math.floor(window.Math.randomB() * Math.min(10, fullQueue.length)) / (fullVal ? 1 : Math.max(fullLength, 1));
            }
            return settings.data.onebyone ? 0 : window.Math.randomB();
        },
        toType: function(item) {
            return (item && (item.rad !== undefined)) ? 'rad' : (item.kan !== undefined) ? 'kan' : 'voc' || "-1";
        },
        toUID: function(item) {
            return ((item && (item.rad !== undefined)) ? 'r' : (item.kan !== undefined) ? 'k' : 'v') + item.id || "-1";
        },
        settingsValueToClass: function(id, val) {
            val = parseInt(val);
            if (id === "priority") {
                switch (val) {
                    case 0:
                        return "balance";
                    case 1:
                        return "level-heavy";
                    case 2:
                        return "type-heavy";
                }
            } else {
                switch (val) {
                    case 0:
                        return "balance2";
                    case 1:
                        return "reading-heavy";
                    case 2:
                        return "meaning-heavy";
                }
            }
        }
    };
    wkof.include('ItemData');
    var items_ready = wkof.ready('ItemData').then(function() {
        return wkof.ItemData.get_items().then(items => {
            var by_type = wkof.ItemData.get_index(items, 'item_type');
            rad_levels = {};
            kan_levels = {};
            voc_levels = {};
            by_type.radical.forEach(item => (rad_levels[item.data.slug] = item.data.level));
            by_type.kanji.forEach(item => (kan_levels[item.data.slug] = item.data.level));
            by_type.vocabulary.forEach(item => (voc_levels[item.data.slug] = item.data.level));
        });
    });

    $('div[id*="loading"]:visible').on('hide', items_ready.then(function() {
        (function ($) {$.each(['hide', 'addClass'], function (i, ev) { var el = $.fn[ev]; $.fn[ev] = function () { this.trigger(ev); return el.apply(this, arguments); }; }); })(jQuery);
        dataset = (location.pathname.match('review') ? reviewset : lessonset);
        window.Math.randomB = window.Math.random;
        if (dataset.quick === 'r') {
            window.Math.random = utilities.newRandom;
        }
        setup.listeners();
        setup.init();
        sorter.reorder();
    }));

})(window.reorder);

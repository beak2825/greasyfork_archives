// ==UserScript==
// @name         秀米layout
// @namespace    for秀米
// @version      1.0
// @description  xiumi layout
// @author       fatcat
// @match        *xiumi.us/studio/v5*
// @icon         data:image/x-icon;base64,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
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/446169/%E7%A7%80%E7%B1%B3layout.user.js
// @updateURL https://update.greasyfork.org/scripts/446169/%E7%A7%80%E7%B1%B3layout.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    await waitForDom('.tn-editing-desk');
    $('.x5-right-toolbar').children().last().remove();
    $('.tn-editing-desk').eq(0).css('padding-left', '51%');

    var insertBox = $(
        '<div style="width: 200px;position: absolute;left: 470px;top: 37%;z-index:999999;"><div id="panelData" style="color: #99aabb;font-size: 35px;font-family: Futura;text-align: center;line-height: 1;height: 50px;pointer-events: none;"></div><svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"viewBox="0 0 276.595 300"style="enable-background:new 0 0 276.595 254.696;"xml:space="preserve"><style>:root{--FC1:#667788;--FC2:#556677;--FC3:#667788;--FC4:#778899;--FC5:#99aabb;--FC6:#99aabb;--FC7:#abb7c4;--FC8:#abb7c4;--FC9:#99aabb;--FC10:#99aabb;--FC-white-light:#edeceb}#Margin&gt;*:nth-child(odd){fill:var(--FC1)}#Margin&gt;*:nth-child(even){fill:var(--FC2)}#padding&gt;*:nth-child(odd){fill:var(--FC3)}#padding&gt;*:nth-child(even){fill:var(--FC4)}#border&gt;*:nth-child(odd){fill:var(--FC5)}#border&gt;*:nth-child(even){fill:var(--FC6)}#angle&gt;*:nth-child(odd){fill:var(--FC7)}#angle&gt;*:nth-child(even){fill:var(--FC8)}#translateX&gt;*,#fixedSize&gt;*,#rotate&gt;*{fill:var(--FC9)}#marginBlock&gt;*{fill:var(--FC10)}#size&gt;*{fill:var(--FC-white-light)}</style><g id="Margin"><polygon points="138.297,127.348 38.297,227.348 38.297,27.348 "></polygon><polygon points="238.297,227.348 38.297,227.348 138.297,127.348 "></polygon><polygon points="238.297,27.348 238.297,227.348 138.297,127.348 "></polygon><polygon points="238.297,27.348 138.297,127.348 38.297,27.348 "></polygon></g><g id="size"><rect x="106.437"y="95.488"width="63.72"height="63.72"></rect></g><g id="padding"><path d="M106.437,95.488v63.72l-23.14,23.14c-2.77-2.76-4.48-6.58-4.48-10.79v-88.42c0-0.17,0-0.34,0.01-0.51c0.13-4.01,1.81-7.63,4.47-10.28l10.28,10.28L106.437,95.488z"></path><path d="M193.297,182.348c-2.76,2.76-6.58,4.47-10.79,4.47h-88.42c-4.21,0-8.03-1.71-10.79-4.47l23.14-23.14h63.72L193.297,182.348z"></path><path d="M197.767,83.138v88.42c0,0.37-0.01,0.73-0.04,1.09c-0.27,3.78-1.91,7.18-4.43,9.7l-23.14-23.14v-63.72l23.14-23.14C196.057,75.108,197.767,78.928,197.767,83.138z"></path><path d="M193.297,72.348l-23.14,23.14h-63.72l-12.86-12.86l-10.28-10.28c2.76-2.77,6.58-4.48,10.79-4.48h88.42C186.717,67.868,190.537,69.578,193.297,72.348z"></path></g><g><g id="border"><path d="M94.087,186.818v16.33c-8.71,0-16.61-3.54-22.33-9.26c-5.72-5.72-9.26-13.62-9.26-22.33v-88.42c0-0.17,0-0.34,0.01-0.51h16.32c-0.01,0.17-0.01,0.34-0.01,0.51v88.42c0,4.21,1.71,8.03,4.48,10.79C86.057,185.108,89.877,186.818,94.087,186.818z"></path><path d="M214.077,172.648c-0.28,8.28-3.76,15.76-9.24,21.24c-5.72,5.72-13.62,9.26-22.33,9.26h-88.42v-16.33h88.42c4.21,0,8.03-1.71,10.79-4.47c2.52-2.52,4.16-5.92,4.43-9.7H214.077z"></path><path d="M214.097,83.138v88.42c0,0.37-0.01,0.73-0.02,1.09h-16.35c0.03-0.36,0.04-0.72,0.04-1.09v-88.42c0-4.21-1.71-8.03-4.47-10.79c-2.76-2.77-6.58-4.48-10.79-4.48h-2.01v-16.32h2.01c8.71,0,16.61,3.54,22.33,9.26C210.557,66.528,214.097,74.428,214.097,83.138z"></path><path d="M180.497,51.548v16.32h-86.41c-4.21,0-8.03,1.71-10.79,4.48c-2.66,2.65-4.34,6.27-4.47,10.28h-16.32c0.13-8.51,3.64-16.21,9.25-21.82c5.72-5.72,13.62-9.26,22.33-9.26H180.497z"></path></g><g id="angle"><path d="M71.757,60.808c-5.61,5.61-9.12,13.31-9.25,21.82h16.32c0.13-4.01,1.81-7.63,4.47-10.28c2.76-2.77,6.58-4.48,10.79-4.48v-16.32C85.377,51.548,77.477,55.088,71.757,60.808z"></path><path d="M71.757,193.888c5.72,5.72,13.62,9.26,22.33,9.26v-16.33c-4.21,0-8.03-1.71-10.79-4.47c-2.528-2.519-4.157-5.925-4.425-9.7H62.525C62.807,180.925,66.277,188.408,71.757,193.888z"></path><path d="M193.297,182.348c-2.76,2.76-6.58,4.47-10.79,4.47h-2.01v16.33h2.01c8.71,0,16.61-3.54,22.33-9.26c5.48-5.48,8.96-12.96,9.24-21.24h-16.35C197.457,176.428,195.817,179.828,193.297,182.348z"></path><path d="M204.837,60.808c-5.72-5.72-13.62-9.26-22.33-9.26h-2.01v16.32h2.01c4.21,0,8.03,1.71,10.79,4.48c2.647,2.647,4.311,6.274,4.444,10.28h16.343C213.949,74.121,210.445,66.416,204.837,60.808z"></path></g></g><g id="translateX"><circle cx="138.297"cy="127.348"r="9.788"></circle><circle cx="11.219"cy="127.348"r="9.788"></circle><circle cx="265.375"cy="127.348"r="9.788"></circle></g><g id="marginBlock"><path d="M227.886,20.823H48.709c-5.75,0-10.412-4.661-10.412-10.412v0C38.297,4.661,42.959,0,48.709,0h179.177c5.75,0,10.412,4.661,10.412,10.412v0C238.297,16.162,233.636,20.823,227.886,20.823z"></path><path d="M227.886,254.696H48.709c-5.75,0-10.412-4.661-10.412-10.412v0c0-5.75,4.661-10.412,10.412-10.412h179.177c5.75,0,10.412,4.661,10.412,10.412v0C238.297,250.035,233.636,254.696,227.886,254.696z"></path></g><g id="fixedSize"><circle r="10"cx="230"cy="220"></circle></g><g id="rotate"><circle r="10"cx="138.3"cy="280"></circle></g></svg></div>'
    );
    let isOpen = true;
    var switchBox = $('<button class="btn btn-glass btn-sm" style="position: fixed;left: 20px;bottom: 40px;z-index:999999;">开关</button>');
    switchBox.click(function(){
        if(isOpen){
            insertBox.hide();
            $('.tn-page-vessel').off('contextmenu',layoutOpen);
            $('.tn-editing-desk').eq(0).css('padding-left', '');
            isOpen=false;
        }else{
            insertBox.show();
            $('.tn-page-vessel').on('contextmenu',layoutOpen);
            $('.tn-editing-desk').eq(0).css('padding-left', '51%');
            isOpen=true;
        }
    });
    $('body').append(insertBox);
    $('body').append(switchBox);
    var onAdjust = 'none',
        initialPosition = [0, 0],
        deltaPosition = [0, 0],
        initialVal = 0,
        val = 0,
        deltaVal = 0,
        isAll = false,
        isLock = false,
        leftOrBottom = 'none';

    //准备工作
    var borderHashVal = [];
    $('[ng-model="borderSideSelect.selected"]').children().each(function() {
        borderHashVal.push($(this).attr('value'));
    });
    var borderStyleHashVal = [];
    $('[ng-model="borderStyleSelect.selected"]').children().each(function() {
        borderStyleHashVal.push($(this).attr('value'));
    });


    //mousedown->layout close

    insertBox.mousedown(e => {
        if ($(".tn-page-container").hasClass("tn-editing-mode-layout")) {
            var positionDiv = $(
                '<div id="layoutPos" style="display:block;position:relative;width:0px;height:0px;"></div>'
            );
            var target = $('.tn-on-editing').eq(0);
            var pos = 50 - $(target).offset().top;
            positionDiv.css('top', pos);
            if (target.nodeName == "image") {
                $(target).parentsUntil('div').last().before(positionDiv);
            } else {
                $(target).before(positionDiv);
            };
            $(".tn-page-container").css('transition', 'none').css('max-width', 'none');
            $(".tn-page-container").addClass("tn-editing-mode-preview").removeClass(
                "tn-editing-mode-layout");

            $('#layoutPos')[0].scrollIntoView();
            $('#layoutPos').remove();
        }
    });

    //弧度
    function radiusAdjust(whichAngle, e) {
        onAdjust = whichAngle;
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        initialVal = $(whichAngle).val() * 1;
        //console.log(onAdjust);
        //console.log(initialVal);
        if (e.altKey) {
            $('[ng-model="borderRadiusSlider.value"]').val(0).change().blur();
            initialVal = 0;
        };
        if (e.metaKey) {
            isAll = true;
        }
    };



    //列定位
    function MarginAdjust(whichMargin, e) {
        onAdjust = whichMargin;
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        var selectIndex = (whichMargin == 'input[ng-model="inner.marginLeft.value"]' || whichMargin ==
                           'input[ng-model="inner.marginRight.value"]') ? 0 : 1;
        initialVal = $(whichMargin).eq(selectIndex).val() * 1;

        if (e.altKey) {
            $(whichMargin).eq(selectIndex).val(0).change().blur();
            initialVal = 0;
        };
        if (e.metaKey) {
            isAll = true;
        }
    };


    //边
    function borderAdjust(whichBorder, e) {
        onAdjust = whichBorder;
        $('.tab-content [title="实线"]').click();
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        initialVal = $('[ng-model="inner.borderActive.width.value"]').val() * 1;
        //console.log(initialVal);
        if (e.altKey) {
            $(whichBorder).click();
            $('[ng-model="inner.borderActive.width.value"]').val(0).change().blur();
            initialVal = 0;
        };
        if (e.metaKey) {
            isAll = true;
        }
    };

    //平移
    function translateAdjust(direction, e) {
        onAdjust = direction;
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        $(direction).click();
        initialVal = $('[ng-model="inner.offsetX"]').val() * 1;
        if (e.altKey) {
            $('[ng-model="inner.offsetX"]').val(0).change().blur();
            initialVal = 0;
        };
        if (e.metaKey) {
            onAdjust = "translateAll";
            $('[ng-model="inner.offsetX"]').val(0).change().blur();
            $('[ng-model="inner.marginTop.value"]').val(0).change().blur();
            $('[ng-model="inner.marginBottom.value"]').val(0).change().blur();
        };
    };

    //组前后距
    function marginBlockAdjust(TopOrBottom, e) {
        onAdjust = TopOrBottom;
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        initialVal = $(TopOrBottom).eq(0).val() * 1;
        if (e.altKey) {
            $(TopOrBottom).eq(0).val(0).change().blur();
            initialVal = 0;
        };
    };

    //宽度
    function sizeAdjust(width, e) {
        onAdjust = width;
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        if ($('.tn-comp-slot .tn-cell-inst.tn-on-editing').attr('tn-cell-type') == "text") {
            initialVal = $('[ng-model="inner.fontSize"]').val() * 1;
            isText = true;
        } else {
            initialVal = $(width).val() * 1;
            isText = false;
        };
        if (e.altKey) {
            if (isText) {
                $('[ng-model="inner.fontSize"]').val(15).change().blur();
                $('[title="默认字体"]').filter(function() {
                    return $(this).parent().attr('role') == 'menu';
                }).children().click();
                initialVal = 15;
            } else {
                $(width).val(100).change().blur();
                initialVal = 100;
            };
        };
    };

    //内边距
    function paddingAdjust(whichPadding, e) {
        onAdjust = whichPadding;
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        initialVal = $(whichPadding).val() * 1;
        if (e.altKey) {
            $(whichPadding).val(0).change().blur();
            initialVal = 0;
        };
        if (e.metaKey) {
            isAll = true;
        }
    };

    //固定布局宽高
    var initialValWidth = 0;
    var initialValHeight = 0;
    var ratio = 1;
    var isText = false;
    var isFixed = false;

    function fixedSizeAdjust(fixedBoxWidth, fixedBoxHeight, e) {
        onAdjust = fixedBoxHeight;
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        initialValWidth = $(fixedBoxWidth).val() * 1;
        if ($('.tn-comp-slot .tn-cell-inst.tn-on-editing')[0].style.width.match(/px/g) == "px") {
            initialValWidth = $('.tn-comp-slot .tn-cell-inst.tn-on-editing').outerWidth();
            $(fixedBoxWidth).val(initialValWidth).change().blur();
        };
        if ($('.tn-comp-slot .tn-cell-inst.tn-on-editing')[0].style.height.match(/px/g) == "px") {
            initialValHeight = $('.tn-comp-slot .tn-cell-inst.tn-on-editing').outerHeight();
            $(fixedBoxHeight).val(initialValHeight).change().blur();
        };
        if ($('.tn-comp-slot .tn-cell-inst.tn-on-editing').attr('tn-child-orientation') == "fixed") {
            initialVal = initialValHeight;
            isText = false;
            isFixed = true;
        } else if ($('.tn-comp-slot .tn-cell-inst.tn-on-editing').attr('tn-cell-type') == "text") {
            // initialVal = $('[ng-model="inner.fontSize"]').val() * 1;
            isText = true;
            isFixed = false;
        } else {
            initialVal = initialValWidth;
            isText = false;
            isFixed = false;
        };

        if (initialValWidth > 0 && initialValHeight > 0) {
            ratio = initialValHeight / initialValWidth;
        } else {
            ratio = 1;
        };
        if (e.altKey) {
            if (isText) {
                $('[ng-model="inner.letterSpacing"]').val(1).change().blur();
                $('[ng-model="inner.lineSpacing"]').val(1.8).change().blur();
                initialVal = 1.8;
            } else {
                $(fixedBoxWidth).val(100).change().blur();
                $(fixedBoxHeight).val(100).change().blur();
                initialVal = 100;
            };
        };
    };

    //旋转
    var origin;

    function rotateAdjust(rotate, e) {
        origin = [$('#translateX').children().eq(0).offset().left + 7.1, $('#translateX').children().eq(0)
                  .offset().top + 7.1
                 ];
        onAdjust = rotate;
        initialPosition[0] = e.clientX;
        initialPosition[1] = e.clientY;
        initialVal = $(rotate).val() * 1;
        if (e.altKey) {
            $(rotate).val(0).change().blur();
            initialVal = 0;
        };
    };

    //弧度
    insertBox.find('#angle').children().eq(0).mousedown(function(e) {
        radiusAdjust(`.tab-content input[title="左上"]`, e);
    });
    insertBox.find('#angle').children().eq(2).mousedown(function(e) {
        radiusAdjust(`.tab-content input[title="右下"]`, e);
    });
    insertBox.find('#angle').children().eq(1).mousedown(function(e) {
        radiusAdjust(`.tab-content input[title="左下"]`, e);
    });
    insertBox.find('#angle').children().eq(3).mousedown(function(e) {
        radiusAdjust(`.tab-content input[title="右上"]`, e);
    });



    //列定位
    insertBox.find('#Margin').children().eq(0).mousedown(function(e) {
        MarginAdjust('input[ng-model="inner.marginLeft.value"]', e);
    });
    insertBox.find('#Margin').children().eq(1).mousedown(function(e) {
        MarginAdjust('input[ng-model="inner.marginBottom.value"]', e);
    });
    insertBox.find('#Margin').children().eq(3).mousedown(function(e) {
        MarginAdjust('input[ng-model="inner.marginTop.value"]', e);
    });
    insertBox.find('#Margin').children().eq(2).mousedown(function(e) {
        MarginAdjust('input[ng-model="inner.marginRight.value"]', e);
    });



    //边
    insertBox.find('#border').children().eq(3).mousedown(function(e) {
        borderAdjust(`.tab-content [title="上"]`, e);
    });
    insertBox.find('#border').children().eq(1).mousedown(function(e) {
        borderAdjust(`.tab-content [title="下"]`, e);
    });
    insertBox.find('#border').children().eq(0).mousedown(function(e) {
        borderAdjust(`.tab-content [title="左"]`, e);
    });
    insertBox.find('#border').children().eq(2).mousedown(function(e) {
        borderAdjust(`.tab-content [title="右"]`, e);
    });

    //平移
    insertBox.find('#translateX').children().eq(1).mousedown(function(e) {
        translateAdjust('button[title="左对齐"]', e);
        if ($('.tn-comp-slot .tn-cell-inst.tn-on-editing').attr('tn-cell-type') == "text") {
            $('[ng-click="onTextAlignSelected(\'left\')"]').click();
        };
    });
    insertBox.find('#translateX').children().eq(0).mousedown(function(e) {
        translateAdjust('button[title="居中对齐"]', e);
        if ($('.tn-comp-slot .tn-cell-inst.tn-on-editing').attr('tn-cell-type') == "text") {
            $('[ng-click="onTextAlignSelected(\'center\')"]').click();
        };
    });
    insertBox.find('#translateX').children().eq(2).mousedown(function(e) {
        translateAdjust('button[title="右对齐"]', e);
        if ($('.tn-comp-slot .tn-cell-inst.tn-on-editing').attr('tn-cell-type') == "text") {
            $('[ng-click="onTextAlignSelected(\'right\')"]').click();
        };
    });


    //段前后距离
    insertBox.find('#marginBlock').children().eq(0).mousedown(function(e) {
        marginBlockAdjust('[ng-model="inner.marginTop.value"]', e);
    });
    insertBox.find('#marginBlock').children().eq(1).mousedown(function(e) {
        marginBlockAdjust('[ng-model="inner.marginBottom.value"]', e);
    });


    //宽度
    insertBox.find('#size').children().eq(0).mousedown(function(e) {
        sizeAdjust('[ng-model="inner.widthValue"]', e);
    });

    //内边距
    insertBox.find('#padding').children().eq(1).mousedown(function(e) {
        paddingAdjust('[ng-model="inner.paddingBottom.value"]', e);
    });
    insertBox.find('#padding').children().eq(2).mousedown(function(e) {
        paddingAdjust('[ng-model="inner.paddingRight.value"]', e);
    });
    insertBox.find('#padding').children().eq(3).mousedown(function(e) {
        paddingAdjust('[ng-model="inner.paddingTop.value"]', e);
    });
    insertBox.find('#padding').children().eq(0).mousedown(function(e) {
        paddingAdjust('[ng-model="inner.paddingLeft.value"]', e);
    });

    //固定布局宽高
    insertBox.find('#fixedSize').children().eq(0).mousedown(function(e) {
        fixedSizeAdjust('[ng-model="inner.widthValue"]', '[ng-model="inner.heightValue"]', e);
    });

    //旋转
    insertBox.find('#rotate').children().eq(0).mousedown(function(e) {
        rotateAdjust('[ng-model="slider.rotateInputAngles"]', e);
    });

    $('body').mouseup(function(e) {
        onAdjust = 'none';
        isAll = false;
        isLock = false;
        $('[ng-model="inner.borderRadiusUnified"]')[0].checked? $('[ng-model="inner.borderRadiusUnified"]').click():null;
        //console.log(onAdjust);
    });
    $('body').mousemove(function(e) {
        if (onAdjust != "none") {
            //console.log(onAdjust);
            deltaPosition[0] = e.clientX - initialPosition[0];
            deltaPosition[1] = e.clientY - initialPosition[1];
            deltaVal = deltaPosition[0];
            if (e.shiftKey) {
                deltaPosition[0] = deltaPosition[0] * 10;
                deltaPosition[1] = deltaPosition[1] * 10;
                deltaVal = deltaVal * 10;
            };
            switch (onAdjust) {
                    //弧度 包含all
                case `.tab-content input[title="左上"]`:
                    deltaVal = Math.abs(deltaPosition[0]) >= Math.abs(deltaPosition[1]) ? Math.abs(
                        deltaPosition[0]) : Math.abs(
                        deltaPosition[1]);
                    if (deltaPosition[0] > 0) {
                        val = initialVal + deltaVal / 4;
                    } else {
                        val = initialVal - deltaVal / 4;
                    }

                    val = val >= 0 ? parseInt(val) : 0;


                    if (isAll) {
                        $('[ng-model="inner.borderRadiusUnified"]')[0].checked? null : $('[ng-model="inner.borderRadiusUnified"]').click();
                    };
                    $('.tab-content input[title="左上"]').val(val).change().blur();
                    break;
                case `.tab-content input[title="左下"]`:
                    deltaVal = Math.abs(deltaPosition[0]) >= Math.abs(deltaPosition[1]) ? Math.abs(
                        deltaPosition[0]) : Math.abs(
                        deltaPosition[1]);
                    if (deltaPosition[0] > 0) {
                        val = initialVal + deltaVal / 4;
                    } else {
                        val = initialVal - deltaVal / 4;
                    }

                    val = val >= 0 ? parseInt(val) : 0;


                    if (isAll) {
                        $('[ng-model="inner.borderRadiusUnified"]')[0].checked? null : $('[ng-model="inner.borderRadiusUnified"]').click();
                    };
                    $('.tab-content input[title="左下"]').val(val).change().blur();
                    break;
                case `.tab-content input[title="右下"]`:
                    deltaVal = Math.abs(deltaPosition[0]) >= Math.abs(deltaPosition[1]) ? Math.abs(
                        deltaPosition[0]) : Math.abs(deltaPosition[1]);
                    if (deltaPosition[0] < 0) {
                        val = initialVal + deltaVal / 4;
                    } else {
                        val = initialVal - deltaVal / 4;
                    }

                    val = val >= 0 ? parseInt(val) : 0;


                    if (isAll) {
                        $('[ng-model="inner.borderRadiusUnified"]')[0].checked? null : $('[ng-model="inner.borderRadiusUnified"]').click();
                    };
                    $('.tab-content input[title="右下"]').val(val).change().blur();
                    break;
                case `.tab-content input[title="右上"]`:
                    deltaVal = Math.abs(deltaPosition[0]) >= Math.abs(deltaPosition[1]) ? Math.abs(
                        deltaPosition[0]) : Math.abs(deltaPosition[1]);
                    if (deltaPosition[0] < 0) {
                        val = initialVal + deltaVal / 4;
                    } else {
                        val = initialVal - deltaVal / 4;
                    }

                    val = val >= 0 ? parseInt(val) : 0;


                    if (isAll) {
                        $('[ng-model="inner.borderRadiusUnified"]')[0].checked? null : $('[ng-model="inner.borderRadiusUnified"]').click();
                    };
                    $('.tab-content input[title="右上"]').val(val).change().blur();
                    break;

                    //列定位 包含all
                case 'input[ng-model="inner.marginLeft.value"]':
                    deltaVal = deltaPosition[0];
                    val = parseInt(initialVal + deltaVal / 3);


                    $('input[ng-model="inner.marginLeft.value"]').val(val).change().blur();
                    if (isAll) {
                        //$('input[ng-model="inner.marginLeft.value"]').val(val).change().blur();
                        $('input[ng-model="inner.marginRight.value"]').val(val).change().blur();
                        $('input[ng-model="inner.marginBottom.value"]').eq(1).val(val).change().blur();
                        $('input[ng-model="inner.marginTop.value"]').eq(1).val(val).change().blur();
                    };
                    nowMarginDom = $('[ng-model="inner.marginLeft.value"]').eq(0);
                    alertDom.trigger('show');
                    break;
                case 'input[ng-model="inner.marginBottom.value"]':
                    deltaVal = deltaPosition[1];
                    val = parseInt(initialVal + deltaVal / 3);

                    $('input[ng-model="inner.marginBottom.value"]').eq(1).val(val).change().blur();
                    if (isAll) {
                        $('input[ng-model="inner.marginLeft.value"]').val(val).change().blur();
                        $('input[ng-model="inner.marginRight.value"]').val(val).change().blur();
                        //$('input[ng-model="inner.marginBottom.value"]').eq(1).val(val).change().blur();
                        $('input[ng-model="inner.marginTop.value"]').eq(1).val(val).change().blur();
                    };
                    break;
                case 'input[ng-model="inner.marginTop.value"]':
                    deltaVal = deltaPosition[1];
                    val = parseInt(initialVal - deltaVal / 3);

                    $('input[ng-model="inner.marginTop.value"]').eq(1).val(val).change().blur();
                    if (isAll) {
                        $('input[ng-model="inner.marginLeft.value"]').val(val).change().blur();
                        $('input[ng-model="inner.marginRight.value"]').val(val).change().blur();
                        $('input[ng-model="inner.marginBottom.value"]').eq(1).val(val).change().blur();
                        //$('input[ng-model="inner.marginTop.value"]').eq(1).val(val).change().blur();
                    };
                    break;
                case 'input[ng-model="inner.marginRight.value"]':
                    deltaVal = deltaPosition[0];
                    val = parseInt(initialVal - deltaVal / 3);

                    $('input[ng-model="inner.marginRight.value"]').val(val).change().blur();
                    if (isAll) {
                        $('input[ng-model="inner.marginLeft.value"]').val(val).change().blur();
                        //$('input[ng-model="inner.marginRight.value"]').val(val).change().blur();
                        $('input[ng-model="inner.marginBottom.value"]').eq(1).val(val).change().blur();
                        $('input[ng-model="inner.marginTop.value"]').eq(1).val(val).change().blur();
                    };
                    nowMarginDom = $('[ng-model="inner.marginRight.value"]').eq(0);
                    alertDom.trigger('show');
                    break;

                    //边 包含all
                case `.tab-content [title="上"]`:
                    $(`.tab-content [title="上"]`).click();
                    deltaVal = deltaPosition[1];
                    val = parseInt(initialVal + deltaVal / 10);
                    if (val < 0) {
                        val = 0;
                    };

                    if (isAll) {
                        $(`.tab-content [title="全部"]`).click();
                    };
                    $('[ng-model="inner.borderActive.width.value"]').val(val).change().blur();
                    break;
                case `.tab-content [title="下"]`:
                    $(`.tab-content [title="下"]`).click();
                    deltaVal = deltaPosition[1];
                    val = parseInt(initialVal - deltaVal / 10);
                    if (val < 0) {
                        val = 0;
                    };

                    if (isAll) {
                        $(`.tab-content [title="全部"]`).click();
                    };
                    $('[ng-model="inner.borderActive.width.value"]').val(val).change().blur();
                    break;
                case `.tab-content [title="左"]`:
                    $(`.tab-content [title="左"]`).click();
                    deltaVal = deltaPosition[0];
                    val = parseInt(initialVal + deltaVal / 10);
                    if (val < 0) {
                        val = 0;
                    };

                    if (isAll) {
                        $(`.tab-content [title="全部"]`).click();
                    };
                    $('[ng-model="inner.borderActive.width.value"]').val(val).change().blur();
                    break;
                case `.tab-content [title="右"]`:
                    $(`.tab-content [title="右"]`).click();
                    deltaVal = deltaPosition[0];
                    val = parseInt(initialVal - deltaVal / 10);
                    if (val < 0) {
                        val = 0;
                    };

                    if (isAll) {
                        $(`.tab-content [title="全部"]`).click();
                    };
                    $('[ng-model="inner.borderActive.width.value"]').val(val).change().blur();
                    break;
                    //平移
                case 'button[title="左对齐"]':
                case 'button[title="居中对齐"]':
                case 'button[title="右对齐"]':
                    deltaVal = deltaPosition[0];
                    val = parseInt(initialVal + deltaVal / 5);

                    $('[ng-model="inner.offsetX"]').val(val).change().blur();
                    break;
                    //段前后距
                case '[ng-model="inner.marginTop.value"]':
                    deltaVal = deltaPosition[1];
                    val = parseInt(initialVal + deltaVal / 5);

                    $('[ng-model="inner.marginTop.value"]').eq(0).val(val).change().blur();

                    nowMarginDom = $('[ng-model="inner.marginTop.value"]').eq(0);
                    alertDom.trigger('show');
                    break;
                case '[ng-model="inner.marginBottom.value"]':
                    deltaVal = deltaPosition[1];
                    val = parseInt(initialVal + deltaVal / 5);

                    $('[ng-model="inner.marginBottom.value"]').eq(0).val(val).change().blur();
                    nowMarginDom = $('[ng-model="inner.marginBottom.value"]').eq(0);
                    alertDom.trigger('show');
                    break;
                    //平移 - 统一移动
                case "translateAll":
                    deltaVal = deltaPosition[0];
                    val = parseInt(deltaVal / 3);

                    $('[ng-model="inner.offsetX"]').val(val).change().blur();
                    deltaVal = deltaPosition[1];
                    val = parseInt(deltaVal / 3);

                    $('[ng-model="inner.marginTop.value"]').eq(0).val(val).change().blur();
                    $('[ng-model="inner.marginBottom.value"]').eq(0).val(0 - val).change().blur();
                    break;
                    //宽度
                case '[ng-model="inner.widthValue"]':
                    deltaVal = deltaPosition[0];
                    if (isText) {
                        val = parseInt(initialVal + deltaVal / 10);
                        if (val < 7) {
                            val = 7;
                        };
                        $('[ng-model="inner.fontSize"]').val(val).change().blur();
                    } else {
                        val = parseInt(initialVal + deltaVal / 5);
                        if (val < 0) {
                            val = 0;
                        };

                        $('[ng-model="inner.widthValue"]').val(val).change().blur();
                    };

                    break;
                    //内边距 包含all
                case '[ng-model="inner.paddingTop.value"]':
                    deltaVal = deltaPosition[1];
                    val = parseInt(initialVal + deltaVal / 10);
                    if (val < 0) {
                        val = 0;
                    };

                    $('[ng-model="inner.paddingTop.value"]').val(val).change().blur();
                    if (isAll) {
                        //$('[ng-model="inner.paddingTop.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingBottom.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingLeft.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingRight.value"]').val(val).change().blur();
                    };
                    break;
                case '[ng-model="inner.paddingBottom.value"]':
                    deltaVal = deltaPosition[1];
                    val = parseInt(initialVal - deltaVal / 10);
                    if (val < 0) {
                        val = 0;
                    };

                    $('[ng-model="inner.paddingBottom.value"]').val(val).change().blur();
                    if (isAll) {
                        $('[ng-model="inner.paddingTop.value"]').val(val).change().blur();
                        //$('[ng-model="inner.paddingBottom.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingLeft.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingRight.value"]').val(val).change().blur();
                    };
                    break;
                case '[ng-model="inner.paddingLeft.value"]':
                    deltaVal = deltaPosition[0];
                    val = parseInt(initialVal + deltaVal / 10);
                    if (val < 0) {
                        val = 0;
                    };

                    $('[ng-model="inner.paddingLeft.value"]').val(val).change().blur();
                    if (isAll) {
                        $('[ng-model="inner.paddingTop.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingBottom.value"]').val(val).change().blur();
                        //$('[ng-model="inner.paddingLeft.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingRight.value"]').val(val).change().blur();
                    };
                    break;
                case '[ng-model="inner.paddingRight.value"]':
                    deltaVal = deltaPosition[0];
                    val = parseInt(initialVal - deltaVal / 10);
                    if (val < 0) {
                        val = 0;
                    };
                    //开始点击执行
                    $('[ng-model="inner.paddingRight.value"]').val(val).change().blur();
                    if (isAll) {
                        $('[ng-model="inner.paddingTop.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingBottom.value"]').val(val).change().blur();
                        $('[ng-model="inner.paddingLeft.value"]').val(val).change().blur();
                        //$('[ng-model="inner.paddingRight.value"]').val(val).change().blur();
                    };
                    break;
                case '[ng-model="inner.heightValue"]':
                    //text吗
                    if (isText) {
                        if (isLock == false) {
                            if (Math.abs(deltaPosition[0]) > 10 || Math.abs(deltaPosition[1]) >
                                10) {
                                if (Math.abs(deltaPosition[0]) > Math.abs(deltaPosition[1])) {
                                    leftOrBottom = 'right';
                                    initialVal = $('[ng-model="inner.letterSpacing"]').val() * 1;
                                } else {
                                    leftOrBottom = 'bottom';
                                    initialVal = $('[ng-model="inner.lineSpacing"]').val() * 1;
                                };
                                isLock = true;
                            };
                        } else {
                            if (leftOrBottom == "right") {
                                deltaVal = deltaPosition[0];
                                val = parseInt(initialVal + deltaVal / 25);
                                $('[ng-model="inner.letterSpacing"]').val(val).change().blur();

                            } else if (leftOrBottom == "bottom") {
                                deltaVal = deltaPosition[1];
                                val = parseInt(initialVal * 10 + deltaVal / 25) / 10;
                                if (val < 0) {
                                    val = 0;
                                };
                                $('[ng-model="inner.lineSpacing"]').val(val).change().blur();
                            };
                        };

                    } else {
                        //固定的宽度
                        deltaVal = deltaPosition[0];
                        val = parseInt(initialValWidth + deltaVal / 10);
                        if (val < 0) {
                            val = 0;
                        };
                        $('[ng-model="inner.widthValue"]').val(val).change().blur();



                        //ratio是否开启

                        if (e.metaKey) {
                            val = parseInt(ratio * val);
                            //console.log(val);
                            $('[ng-model="inner.heightValue"]').val(val).change().blur();
                        } else {
                            //固定的高度
                            deltaVal = deltaPosition[1];
                            val = parseInt(initialValHeight + deltaVal / 10);
                            if (val < 0) {
                                val = 0;
                            };
                            $('[ng-model="inner.heightValue"]').val(val).change().blur();
                        };

                        //val
                        if (isFixed == false) {
                            val = $('.tn-comp-slot .tn-cell-inst.tn-on-editing')[0].style.width;
                        };

                    };

                    break;
                case '[ng-model="slider.rotateInputAngles"]':
                    val = parseInt(Math.atan((e.clientY - origin[1]) / (e.clientX - origin[0])) /
                                   Math.PI * 180);
                    if ((e.clientX - origin[0]) >= 0) {
                        val = val - 90;
                    } else {
                        val = val + 90;
                    };
                    if (val < 0) {
                        val = 360 + val;
                    };
                    if (e.shiftKey || e.metaKey) {
                        val = val + 7;
                        val = parseInt(val / 15) * 15;
                        if (val >= 360) {
                            val = val - 360;
                        };
                    };
                    // console.log(val);
                    $('[ng-model="slider.rotateInputAngles"]').val(val).change().blur();
                    break;

            };
            insertBox.find('#panelData').text(initialVal + " ➔ " + val);
        }
    });
    insertBox.find("svg").mousedown(function() {
        insertBox.find('#panelData').text(initialVal);
    });


    //contextMenu layout

    function waitForDom(dom) {
        return new Promise((resolve, reject) => {
            var times = 0;
            var finding = setInterval(() => {
                times++;
                if ($(dom).length) {
                    clearInterval(finding);
                    resolve();
                };
                if (times > 100) {
                    reject()
                };
            }, 300);
        })
    }

    await waitForDom('.tn-page-vessel');

    var positionDiv = $(
        '<div id="layoutPos" style="display:block;position:relative;width:0px;height:0px;"></div>'
    );
    var preOpenTime=0;
    function layoutOpen(e) {
        e.preventDefault();
        let curTime = new Date().getTime();
        if(curTime-preOpenTime<200){
            preOpenTime = curTime;
            return;}
        preOpenTime = curTime;
        var pos = 50 - $(e.target).offset().top,
            oldH = $(e.target).height();
        positionDiv.css('top', pos).attr('relativeHeight', pos / $(e.target).height());

        if (e.target.nodeName == "image") {
            $(e.target).parentsUntil('div').last().before(positionDiv);
        } else {
            $(e.target).before(positionDiv);
        }

        $(".tn-page-container").css('transition', 'none').css('max-width', 'none');
        $(".tn-page-container").toggleClass("tn-editing-mode-preview").toggleClass(
            "tn-editing-mode-layout");

        //var delH=$('#layoutPos').attr('relativeHeight')*($('#layoutPos').parent().height()-oldH);
        //$('#layoutPos').css('top',pos-delH);

        $('#layoutPos')[0].scrollIntoView();
        $('#layoutPos').remove();

        $(e.target).click();
        e.preventDefault();
    }
    $('.tn-page-vessel').on('contextmenu',layoutOpen);



    //最前最后
    var arrow = $(
        '<li> <a href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-up"></span></a> </li><li> <a href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-down"></span></a> </li>'
    );
    arrow.find('.glyphicon-chevron-up').click(function() {
        $(".tn-page-piece")[0].scrollIntoView()
    });
    arrow.find('.glyphicon-chevron-down').click(function() {
        $(".tn-page-piece")[0].scrollIntoView(false)
    });
    $('ul.tn-page-toolbar').append(arrow);




    function searchNextComp(node) {
        if (node.attr('tn-cell')) {
            return node.find('[tn-comp]').eq(0)
        };
        if (node.next().filter('[tn-comp]').length) {
            return node.next();
        } else {
            var prenode = node.parentsUntil('[tn-comp]').last().parent();
            if (prenode.length && prenode.attr('tn-comp-role') != "layer") {
                return searchNextComp(prenode);
            } else {
                return node;
            }
        }
    };

    function searchPrevComp(node) {
        if (node.attr('tn-cell')) {
            return node.parentsUntil('[tn-comp]').last().parent();
        };
        if (node.prev().filter('[tn-comp]').length) {
            return node.prev();
        } else {
            var prenode = node.parentsUntil('[tn-comp]').last().parent();
            if (prenode.length && prenode.attr('tn-comp-role') != "layer") {
                return searchPrevComp(prenode);
            } else {
                return node;
            }
        }
    }



    function searchNextCell(node) {

        if (node.attr('tn-comp')) {
            return node.find('[tn-cell]').eq(0);
        } else {
            if (node.next().length) {
                return node.next()
            } else {
                var nextnode = node.parentsUntil("[tn-cell]").last().parent().next();
                if (nextnode.length && nextnode.attr('tn-cell') != 'comps' && !nextnode.filter(
                    '.tn-page-container-bottom-block').length) {
                    return nextnode;
                } else {
                    return node
                }

            }
        };

    };

    function searchPrevCell(node) {

        if (node.attr('tn-comp')) {
            return node.parentsUntil("[tn-cell]").last().parent().attr('tn-cell') != 'comps' ? node
                .parentsUntil("[tn-cell]").last().parent() : node;
        } else {
            if (node.prev().length) {
                return node.prev()
            } else {
                if (node.index() == 0) {
                    return node;
                };
                var prenode = node.parentsUntil("[tn-cell]").last().parent();
                if (prenode.length && prenode.attr('tn-cell') != 'comps' && !prenode.filter(
                    '.tn-page-container-bottom-block').length) {
                    return prenode;
                } else {
                    return node
                }
            }
        };

    };

    function waitForNode(node) {
        return new Promise((resolve, reject) => {
            let times = 0;
            let w = setInterval(function() {
                if ($(node).length || times > 20) {
                    resolve($(node));
                    clearInterval(w);
                };
                times++;
            }, 300);
        })
    };

    var trace = [];
    $(document).keydown(async function(e) {
        var node = $('.tn-on-editing').last(),
            dom, alignHbutons = [$('[ng-click="onApplyAlignH(\'left\')"]').eq(0), $(
                '[ng-click="onApplyAlignH(\'center\')"]').eq(0), $(
                '[ng-click="onApplyAlignH(\'right\')"]').eq(0), ];
        var selfAlignVBottonsSet = $('[ng-click="onApplyAlign2SingleGroup(inner.tnAlign)"] label');
        var allAlignVBottonsSet = $('[ng-click^="onApplyAlign2AllGroups"]');



        switch ([e.shiftKey ? "shift" : "", e.ctrlKey ? "ctrl" : "", e.altKey ? "alt" : "", e
                 .metaKey ? "cmd" : "", e.key
                ].join("-")) {
            case "shift----ArrowRight":
                $('[ng-model="inner.insertColumnRight.ColumnNumbers"]').val(1).change();
                if ($('[ng-model="inner.insertColumnRight.includeContent"]').prop('checked')) {
                    $('[ng-model="inner.insertColumnRight.includeContent"]').click();
                };
                $('[ng-click="onApplyInsertColumnsToRight()"]').click();
                e.preventDefault();
                break;
            case "shift----ArrowLeft":
                $('[ng-model="inner.insertColumnLeft.ColumnNumbers"]').val(1).change();
                if ($('[ng-model="inner.insertColumnLeft.includeContent"]').prop('checked')) {
                    $('[ng-model="inner.insertColumnLeft.includeContent"]').click();
                };
                $('[ng-click="onApplyInsertColumnsToLeft()"]').click();
                e.preventDefault();
                break;
            case "shift----ArrowUp":
                $('[ng-click="onDeleteCurrentCol()"]').click();
                e.preventDefault();
                break;
            case "shift----ArrowDown":
                dom = $(':contains("[592] paper-cp:layout/row1-r1c1")').last().parent();
                if (dom.length == 0) {
                    $('[ng-click="tplLib.onSelectTag(tagLv0)"]').filter(':contains("基础布局")')
                        .click();
                    dom = await waitForNode(':contains("[592] paper-cp:layout/row1-r1c1")');
                    dom = dom.last().parent();
                    dom.click();
                } else {
                    dom.click();
                };
                break;
            case "shift----Backspace":
                $('[ng-click="onClickDelete()"]').click();
                e.preventDefault();
                break;
            case "----ArrowUp":
                UpDowmLeftRight();
                break;
            case "----ArrowDown":
                UpDowmLeftRight();
                break;
            case "----ArrowLeft":
                UpDowmLeftRight();
                break;
            case "----ArrowRight":
                UpDowmLeftRight();
                break;
            case "----v":
                selectInOut();
                e.preventDefault();
                break;
            case "shift----V":
                selectInOut();
                e.preventDefault();
                break;
            case "shift--alt--ArrowDown":
                dom = $(':contains("[3336] paper-cp:layout/fixed")').last().parent();
                if (dom.length == 0) {
                    $('[ng-click="tplLib.onSelectTag(tagLv0)"]').filter(':contains("基础布局")')
                        .click();
                    dom = await waitForNode(':contains("[592] paper-cp:layout/row1-r1c1")');
                    dom = dom.last().parent();
                    dom.click();
                } else {
                    dom.click();
                };
                e.preventDefault();
                break;
            case "shift---- ":
                $('[role="menuitem"] label:contains("宽度自伸缩")').click();
                e.preventDefault();
                break;
            case "shift----Z":
                $('[role="menuitem"] label:contains("宽度自适应")').click();
                e.preventDefault();
                break;
            case "shift----G":
                $('[role="menuitem"] label:contains("宽度固定像素")').click();
                e.preventDefault();
                break;
            case "shift----B":
                $('[role="menuitem"] label:contains("宽度百分比")').click();
                e.preventDefault();
                break;
            case "--alt--ArrowLeft":
                alignH('prev');
                e.preventDefault();
                break;
            case "--alt--ArrowRight":
                alignH('next');
                e.preventDefault();
                break;
            case "---cmd-ArrowLeft":
                alignH('prev');
                e.preventDefault();
                break;
            case "---cmd-ArrowRight":
                alignH('next');
                e.preventDefault();
                break;
            case "--alt--ArrowUp":
                alignV('prev');
                e.preventDefault();
                break;
            case "--alt--ArrowDown":
                alignV('next');
                e.preventDefault();
                break;
            case "---cmd-ArrowUp":
                alignVAll('prev');
                e.preventDefault();
                break;
            case "---cmd-ArrowDown":
                alignVAll('next');
                e.preventDefault();
                break;
        };

        function alignH(direction) {
            var nowIndex;
            for (let i in alignHbutons) {
                if (alignHbutons[i].hasClass('active')) {
                    nowIndex = i;
                    break;
                };
            };
            direction == "next" ? ++nowIndex : --nowIndex;
            nowIndex > 2 && (nowIndex = 2);
            nowIndex < 0 && (nowIndex = 0);
            alignHbutons[nowIndex % 3].click();
        };

        function alignV(direction) {
            var nowIndex = selfAlignVBottonsSet.filter('.active').index();
            direction == "next" ? ++nowIndex : --nowIndex;
            selfAlignVBottonsSet.eq(nowIndex % selfAlignVBottonsSet.length).click();
        };


        function alignVAll(direction) {
            var nowIndex = selfAlignVBottonsSet.filter('.active').index();
            direction == "next" ? ++nowIndex : --nowIndex;
            allAlignVBottonsSet.eq(nowIndex % allAlignVBottonsSet.length).click();
        };

        function selectInOut() {

            var redBox = $('.tn-comp-slot .tn-cell-inst.tn-on-editing');
            var lineBlock = $('.op-cp-pose.ng-scope');
            if (lineBlock.length) {
                if (e.shiftKey) {
                    if ($('.tn-on-text-inputting').length) {
                        $(document).trigger({
                            type: "keydown",
                            which: 27
                        });
                    };
                    lineBlock.parent().parent().click().click();
                } else {
                    if (redBox.length) {
                        redBox.find('section').eq(0).children().eq(0).mousedown().click();
                    } else if ($('.tn-on-multi-select').length == 0) {
                        lineBlock.parent().children().eq(0).children().eq(0).mousedown().click();
                    } else {
                        $('.tn-on-multi-select').children().eq(0).children().eq(0).mousedown()
                            .click();
                    }
                }
            };
            e.preventDefault();
        };

        function UpDowmLeftRight() {
            if (!node.length) {
                var tempTrace = trace;
                tempTrace = tempTrace.join(".");
                node = $("[opera-tn-ra-comp=\"" + tempTrace + "\"]");
            };
            if (!$(".tn-on-text-inputting").length && !e.shiftKey) {
                if (e.key == "ArrowDown") {
                    searchNextComp(node).mousedown().click();
                } else if (e.key == "ArrowRight") {
                    searchNextCell(node).mousedown().click();
                } else if (e.key == "ArrowUp") {
                    searchPrevComp(node).mousedown().click();
                } else if (e.key == "ArrowLeft") {
                    searchPrevCell(node).mousedown().click();
                }
            };
            if ($('.tn-on-editing').length) {
                trace = $('.tn-on-editing').eq(0).attr("opera-tn-ra-comp").split(".");
                $('.tn-on-editing').eq(0)[0].scrollIntoView({
                    block: "center",
                    behavior: 'smooth'
                });
            };
            if (!$('.tn-on-text-inputting').length) {
                e.preventDefault();
            };
        };

    });

    $(document).click(e => {
        $('[title="拖拽旋转 双击重置"]').removeClass('ng-hide').css('z-index', 999999).show();
        if (e.altKey && $(e.target).filter('input[step],[type="number"]').length) {
            $(e.target).val(0).change().blur();
        };
        if ($('.tn-on-editing').length) {
            trace = $('.tn-on-editing').eq(0).attr("opera-tn-ra-comp").split(".");
        };
    });
    //wheel
    var nowMarginDom;
    function wheelfunc(e) {
        if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {
            e.preventDefault();
            var upOrDown = e.wheelDelta > 0 ? "up" : "down";

            let oldVal, newVal, changeVal, nowDom;
            let marginTopDom = $('input[ng-model="inner.marginTop.value"]').eq(0);
            let marginBottomDom = $('input[ng-model="inner.marginBottom.value"]').eq(0);
            let cellMarginTopDom = $('input[ng-model="inner.marginTop.value"]').eq(1);
            let cellMarginBottomDom = $('input[ng-model="inner.marginBottom.value"]').eq(1);
            let cellMarginLeftDom = $('input[ng-model="inner.marginLeft.value"]').eq(0);
            let cellMarginRightDom = $('input[ng-model="inner.marginRight.value"]').eq(0);

            let funcsofHotKey = {
                "ctrl--": marginTopDom,
                "ctrl--cmd": cellMarginLeftDom,
                "-alt-": marginBottomDom,
                "-alt-cmd": cellMarginRightDom,
            };
            let keys = [e.ctrlKey ? 'ctrl' : '', e.altKey ? 'alt' : '', e.metaKey ? 'cmd' : ''].join(
                "-");
            nowDom = funcsofHotKey[keys];
            if (nowDom) {
                nowMarginDom = nowDom;
                oldVal = nowDom.val() * 1;
                changeVal = e.shiftKey ? 10 : 1;
                newVal = e.wheelDelta > 0 ? oldVal + changeVal : oldVal - changeVal;
                newVal = parseInt(newVal);
                nowDom.val(newVal).change().blur();
                alertDom.trigger('show');
            };

        }
    }
    document.addEventListener('wheel', wheelfunc, {
        passive: false
    })


    //注入dom
    var alertDom = $(
        '<div style="position:fixed;z-index:99999999;pointer-events:none;width:100px;display: grid;grid:\'line line\'\'. .\'\'line2 line2\';grid-gap: 10px;background-color: rgba(0,0,0,0.3);color:white;padding: 10px;place-items: center;"><div style="grid-area: line;">1</div><div>2</div><div>3</div>  <div style="grid-area: line2;">4</div></div>'
    );
    $('body').append(alertDom);
    alertDom.hide();
    alertDom.bind('show', e => {
        alertDom.css('left', $('.tn-on-editing').offset().left - 100).css('top', $('.tn-on-editing')
                                                                          .offset().top);
        alertDom.stop(true, true).show().fadeIn(1).delay(2000).fadeOut();
        alertDom.children().eq(0).text($('input[ng-model="inner.marginTop.value"]').eq(0).val());
        alertDom.children().eq(3).text($('input[ng-model="inner.marginBottom.value"]').eq(0).val());
        alertDom.children().eq(1).text($('input[ng-model="inner.marginLeft.value"]').eq(0).val());
        alertDom.children().eq(2).text($('input[ng-model="inner.marginRight.value"]').eq(0).val());
        unitPx.text(nowMarginDom.next().val()).stop(true, true).show().fadeIn(1).delay(7000).fadeOut(
            3000);;
    });

    var unitPx = $(
        '<span style="display:none;padding:12px;cursor:pointer;top:0;left: -50px;" class="op-dock-bar"></span>'
    );
    $('[tn-op-dc-item="dc-cp-menu-pin"]').after(unitPx);
    unitPx.click(e => {
        let val = nowMarginDom.next().val();
        let newVal = val == 'px' ? '%' : 'px';
        nowMarginDom.next().val(newVal).change();
        alertDom.trigger('show');
    });

    //即刻上传剪贴板图片
    document.addEventListener('paste', uploadFiles, false)
    //files是一个方法，里面的参数为event
    function uploadFiles(event) {
        //谷歌浏览器的的粘贴文件在这个对象下面
        if (event.clipboardData || event.originalEvent) {
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            var len = clipboardData.items.length;
            var items = clipboardData.items;
            //获取文件的属性就在这里获取，打印该对象可以看到相关属性，结果的操作就在items里面，所以需要循环items
            var fileObj = null;
            for (var i = 0; i < len; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    //getAsFile() 此方法只是该浏览器下才会有的方法
                    fileObj = items[i].getAsFile();
                }
            }
            if (fileObj !== null) {
                function upload() {
                    var formData = new FormData() //创建一个forData
                    formData.append('image_file', fileObj);
                    formData.append('updateTsIfExisted', true);
                    $.ajax({
                        url: "/api/assets/image/file",
                        data: formData,
                        type: "POST",
                        async: false,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(data) {
                            console.log(data);
                            $('[ng-repeat="tabItem in sidebarTabs"]').eq(3).children().eq(0)
                                .mousedown().click();
                            $('[select="onImageDetailSelected(untagDetail)"]').eq(0)
                                .children().eq(0).mousedown().click();
                            if ($('[tn-attach-to="ceDSlotTextAll"]').parentsUntil('menu')
                                .last().parent()[0].tagName == "MENU") {};
                            $('[ng-click="onRefreshDataClick($event)"]').eq(1).mousedown().click();


                        },
                        error: function() {}
                    })
                }
                upload();
            }
        }
    }

    //打印剪贴板数据，types可能有多个，可以for  打印出来的东西好好看看[[Prototype]]
    function pastePrint(e) {
        const clipdata = e.clipboardData || window.clipboardData;
        //直接访问剪贴板的types
        console.log(clipdata,clipdata.types, clipdata.getData(clipdata.types[0]));
        //访问剪贴板内的items的types
        let items = clipdata.items;
        clipdata.types.map((type)=>{
            console.log(type,clipdata.getData(type))
            if(type=='Files'){
                console.log(URL.createObjectURL(clipdata.files[0]))
            }
        })
    }
    document.addEventListener("paste", pastePrint);


})();

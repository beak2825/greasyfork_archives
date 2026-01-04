// ==UserScript==
// @name         tanks.gg小工具
// @namespace    Eruru
// @version      1.2.3
// @description  改进tanks.gg页面，实现显示瞄准、曲线等信息，并易于使用。加QQ交流群:628613664 了解或获取更多工具
// @author       Eruru
// @match        https://tanks.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        unsafeWindow
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.0.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450400/tanksgg%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/450400/tanksgg%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    window.curveFrameCount = 30;
    window.curveCanvasHeight = "450vh";
    window.decimalPlaces = 4;
    window.checkInterval = 1000;
    window.color = {
        lightGreen: "rgb(144, 238, 144)",
        lightCoral: "rgb(240, 128, 128)"
    };
    window.language = {
        aimInformation: "瞄准信息",
        terrain: "地形",
        terrainHard: "硬地",
        terrainMedium: "中地",
        terrainSoft: "软地",
        isMoving: "移动",
        isTankTraversing: "旋转车体",
        isTurretTraversing: "旋转炮塔",
        isFiring: "开火",
        isGunDamaged: "炮受损",
        aimTime: "瞄准时间",
        dispersion: "精度",
        moveSpeed: "移动速度",
        tankTraverseSpeed: "车体旋转速度",
        turretTraverseSpeed: "炮塔旋转速度",
        curveType: "类型",
        speedAndDispersion: "速度/精度",
        traverseAndDispersion: "转速/精度",
        aimTimeAndDispersion: "缩圈时间/精度",
        speedAndAimTime: "速度/瞄准时间",
        traverseAndAimTime: "转速/瞄准时间",
        second: "秒",
        curve: "曲线",
        animation: "动画",
        play: "播放",
        selectAll: "全选",
        deselectAll: "全部取消选择",
        oneKeySelectAllUnselectedSkill: "一键选择所有未被选中的技能",
        oneKeyDeselectAllselectedSkill: "一键取消选择所有已选中的技能"
    };
    window.tankPanel = null;
    window.aimInformationPanel = new AimInformationPanel (window.language.aimInformation, onValueChanged);
    window.aimInformationCurvePanel = new AimInformationCurvePanel ();
    //window.animationPanel = new AnimationPanel (window.language.animation);
    setInterval (checkPage, window.checkInterval);

    function checkPage () {
        //checkSkill ();
        checkCopy ();
        checkPanel ();
    }

    function checkSkill () {
        var moduleListElements = $ (".module.skill .dropdown-menu");
        if (moduleListElements.length > 0) {
            for (var i = 0; i < moduleListElements.length; i++) {
                var moduleListElement = moduleListElements.eq (i);
                var dividerElement = moduleListElement.find (".divider");
                if (dividerElement.length > 0 && moduleListElement.find (".EruruSkillPanel").length == 0) {
                    var selectAllElement = $ ("<a class='EruruSkillPanel dropdown-item'><b>" + window.language.selectAll + "</b><div><span>" + window.language.oneKeySelectAllUnselectedSkill + "</span></div></a>");
                    var deselectAllElement = $ ("<a class='EruruSkillPanel dropdown-item'><b>" + window.language.deselectAll + "</b><div><span>" + window.language.oneKeyDeselectAllselectedSkill + "</span></div></a>");
                    dividerElement.before (selectAllElement);
                    dividerElement.before (deselectAllElement);
                    selectAllElement.bind ("click", function () {
                        var skillElements = $ (this).parent ().find ("a:not(.EruruSkillPanel)");
                        for (var i = 0; i < skillElements.length; i++) {
                            var skillElement = skillElements.eq (i);
                            if (skillElement.hasClass ("active")) {
                                continue;
                            }
                            skillElement.get (0).click ();
                        }
                    });
                    deselectAllElement.bind ("click", function () {
                        var skillElements = $ (this).parent ().find ("a:not(.EruruSkillPanel)");
                        for (var i = 0; i < skillElements.length; i++) {
                            var skillElement = skillElements.eq (i);
                            if (!skillElement.hasClass ("active")) {
                                continue;
                            }
                            skillElement.get (0).click ();
                        }
                    });
                }
            }
        }
    }

    function checkPanel () {
        var everythingElseElement = $ (".card-header:contains('Everything Else')").parent ();
        if (everythingElseElement.length > 0) {
            if ($ (".EruruAimInformationPanel").length > 0) {
                window.aimInformationPanel.panel.element.css ("width", everythingElseElement.width ());
                window.aimInformationCurvePanel.getPanel ().element.css ("width", everythingElseElement.width ());
                onValueChanged ();
                return;
            }
            everythingElseElement.addClass ("EruruAimInformationPanel");
            everythingElseElement.addClass ("mb-3");
            window.tankPanel = new TankPanel (onValueChanged);
            var adsElement = $ (".wrecker:first");
            var gunConstraintsElement = $ (".card-header:contains('Gun constraints')").parent ();
            window.aimInformationPanel.panel.element.insertBefore (everythingElseElement);
            window.aimInformationPanel.panel.element.css ("width", everythingElseElement.width ());
            window.aimInformationCurvePanel.getPanel ().element.insertBefore (adsElement);
            window.aimInformationCurvePanel.getPanel ().element.css ("width", adsElement.width ());
            onValueChanged ();
            /*
			adsElement.before (window.animationPanel.panel.element);
			window.animationPanel.setSize (gunConstraintsElement.width (), gunConstraintsElement.width ());
			window.animationPanel.play ();
			*/
            return;
        }
        window.tankPanel = null;
    }

    function checkCopy () {
        var actionsElement = $ (".justify-content-end");
        if (actionsElement.length > 0) {
            if (actionsElement.find (".EruruComparePanelAction").length > 0) {
                return;
            }
            var copyElement = $ ("<button class='EruruComparePanelAction btn btn-lg btn-primary me-3'>复制配装</button>");
            var swapElement = $ ("<button class='EruruComparePanelAction btn btn-lg btn-primary me-3'>交换配装</button>");
            var clearElement = $ ("<button class='EruruComparePanelAction btn btn-lg btn-dark me-3'>清空配装</button>");
            actionsElement.append (copyElement);
            actionsElement.append (swapElement);
            actionsElement.append (clearElement);
            copyElement.prev ().addClass ("me-3");
            copyElement.bind ("click", function () {
                clickSaveButton ();
                var url = window.location.href;
                var f = getUrlParameterValue (url, "f");
                var e = getUrlParameterValue (url, "e");
                var l = getUrlParameterValue (url, "l");
                var c = getUrlParameterValue (url, "c");
                var k = getUrlParameterValue (url, "k");
                var d = getUrlParameterValue (url, "d");
                var m = getUrlParameterValue (url, "m");
                window.location.href = setTankParameters (url, f, e, l, c, k, d, m, true);
            });
            swapElement.bind ("click", function () {
                clickSaveButton ();
                var url = window.location.href;
                var f = getUrlParameterValue (url, "f");
                var e = getUrlParameterValue (url, "e");
                var l = getUrlParameterValue (url, "l");
                var c = getUrlParameterValue (url, "c");
                var k = getUrlParameterValue (url, "k");
                var d = getUrlParameterValue (url, "d");
                var m = getUrlParameterValue (url, "m");
                var cf = getUrlParameterValue (url, "cf");
                var ce = getUrlParameterValue (url, "ce");
                var cl = getUrlParameterValue (url, "cl");
                var cc = getUrlParameterValue (url, "cc");
                var ck = getUrlParameterValue (url, "ck");
                var cd = getUrlParameterValue (url, "cd");
                var cm = getUrlParameterValue (url, "cm");
                url = setTankParameters (url, cf, ce, cl, cc, ck, cd, cm, false);
                url = setTankParameters (url, f, e, l, c, k, d, m, true);
                window.location.href = url;
            });
            clearElement.bind ("click", function () {
                clickSaveButton ();
                window.location.href = setTankParameters (window.location.href, "", "", "", "", "", "", "", true);
            });
        }
    }

    function clickSaveButton () {
        $(".btn.btn-lg.btn-primary:not(.EruruComparePanelAction)").trigger ("click");
    }

    function setTankParameters (url, f, e, l, c, k, d, m, isCompareTank) {
        var header = isCompareTank ? "c" : "";
        url = setUrlParameterValue (url, header + "f", f);
        url = setUrlParameterValue (url, header + "e", e);
        url = setUrlParameterValue (url, header + "l", l);
        url = setUrlParameterValue (url, header + "c", c);
        url = setUrlParameterValue (url, header + "k", k);
        url = setUrlParameterValue (url, header + "d", d);
        url = setUrlParameterValue (url, header + "m", m);
        return url;
    }

    function formatDifference (label, value, baseValue, direction) {
        var difference = (value - baseValue) * direction;
        if(difference == 0) {
            return label;
        }
        var text = label + " (";
        if (difference >= 0) {
            text += "+";
        }
        text += difference.toFixed (window.decimalPlaces) + ")";
        return text;
    }

    function onValueChanged () {
        var tank = window.tankPanel.toTank ();
        var tankState = tank.calculateState (window.aimInformationPanel);
        var tankResult = tank.calculateAimTime (tankState.moveSpeed, tankState.tankTraverseSpeed, tankState.turretTraverseSpeed, tankState.isFiring, tankState.isGunDamaged);
        var baseTank = window.tankPanel.toBaseTank ();
        var baseTankState = baseTank.calculateState (window.aimInformationPanel);
        var baseTankResult = baseTank.calculateAimTime (baseTankState.moveSpeed, baseTankState.tankTraverseSpeed, baseTankState.turretTraverseSpeed, baseTankState.isFiring, baseTankState.isGunDamaged);
        window.aimInformationPanel.aimTimeItem.setValue (tankResult.aimTime.toFixed (window.decimalPlaces));
        window.aimInformationPanel.aimTimeItem.setBaseValue (baseTankResult.aimTime.toFixed (window.decimalPlaces));
        window.aimInformationPanel.aimTimeItem.setCompareColor (compare (tankResult.aimTime, baseTankResult.aimTime) * -1);
        window.aimInformationPanel.aimTimeItem.setLabel (formatDifference (window.language.aimTime, tankResult.aimTime, baseTankResult.aimTime, 1));
        window.aimInformationPanel.dispersionItem.setValue (tankResult.dispersion.toFixed (window.decimalPlaces));
        window.aimInformationPanel.dispersionItem.setBaseValue (baseTankResult.dispersion.toFixed (window.decimalPlaces));
        window.aimInformationPanel.dispersionItem.setCompareColor (compare (tankResult.dispersion, baseTankResult.dispersion) * -1);
        window.aimInformationPanel.dispersionItem.setLabel (formatDifference (window.language.dispersion, tankResult.dispersion, baseTankResult.dispersion, 1));
        window.aimInformationPanel.moveSpeedItem.setValue (tankState.moveSpeed);
        window.aimInformationPanel.moveSpeedItem.setBaseValue (baseTankState.moveSpeed);
        window.aimInformationPanel.moveSpeedItem.setCompareColor (compare (tankState.moveSpeed, baseTankState.moveSpeed));
        window.aimInformationPanel.moveSpeedItem.setVisible (tankState.isMoving);
        window.aimInformationPanel.moveSpeedItem.setLabel (formatDifference (window.language.moveSpeed, tankState.moveSpeed, baseTankState.moveSpeed, 1));
        window.aimInformationPanel.tankTraverseSpeedItem.setValue (tankState.tankTraverseSpeed);
        window.aimInformationPanel.tankTraverseSpeedItem.setBaseValue (baseTankState.tankTraverseSpeed);
        window.aimInformationPanel.tankTraverseSpeedItem.setCompareColor (compare (tankState.tankTraverseSpeed, baseTankState.tankTraverseSpeed));
        window.aimInformationPanel.tankTraverseSpeedItem.setVisible (tankState.isTankTraverse);
        window.aimInformationPanel.tankTraverseSpeedItem.setLabel (formatDifference (window.language.tankTraverseSpeed, tankState.tankTraverseSpeed, baseTankState.tankTraverseSpeed, 1));
        window.aimInformationPanel.turretTraverseSpeedItem.setValue (tankState.turretTraverseSpeed);
        window.aimInformationPanel.turretTraverseSpeedItem.setBaseValue (baseTankState.turretTraverseSpeed);
        window.aimInformationPanel.turretTraverseSpeedItem.setCompareColor (compare (tankState.turretTraverseSpeed, baseTankState.turretTraverseSpeed));
        window.aimInformationPanel.turretTraverseSpeedItem.setVisible (tankState.isTurretTraverse);
        window.aimInformationPanel.turretTraverseSpeedItem.setLabel (formatDifference (window.language.turretTraverseSpeed, tankState.turretTraverseSpeed, baseTankState.turretTraverseSpeed, 1));
        window.aimInformationCurvePanel.tank = tank;
        window.aimInformationCurvePanel.tankResult = tankResult;
        window.aimInformationCurvePanel.baseTank = baseTank;
        window.aimInformationCurvePanel.baseTankResult = baseTankResult;
        window.aimInformationCurvePanel.refresh ();
        /*
		window.animationPanel.tank = tank;
		window.animationPanel.baseTank = baseTank;
		*/
    }

    function compare (a, b) {
        if (a == b) {
            return -0;
        }
        if (a > b) {
            return 1;
        }
        return -1;
    }

    function clamp (value, max, min) {
        if (value > max) {
            return max;
        }
        if (value < min) {
            return min;
        }
        return value;
    }

    function Deg2Rad (degree) {
        return degree / 180 * Math.PI;
    }

    function Rad2Deg (radian) {
        return radian * 180 / Math.PI;
    }

    function getUrlParameterValue (url, parameter) {
        var str = url.substr(url.indexOf('?') + 1);
        var arr = str.split('&');
        for (var i in arr) {
            var paired = arr[i].split('=');
            if (paired[0] == parameter) {
                return paired[1];
            }
        }
        return "";
    }

    function setUrlParameterValue (url, parameter, value) {
        if (value == null || value == "") {
            return removeUrlParameter (url, parameter);
        }
        if (url.indexOf('?') == -1){
            return url + "?" + parameter + "=" + value;
        }
        if (!new RegExp ("[/?&]" + parameter + "=").test (url)){
            return url + "&" + parameter + "=" + value;
        }
        var arr_url = url.split('?');
        var base = arr_url[0];
        var arr_param = arr_url[1].split('&');
        for (var i = 0; i < arr_param.length; i++) {
            var paired = arr_param[i].split('=');
            if (paired[0] == parameter) {
                paired[1] = value;
                arr_param[i] = paired.join('=');
                break;
            }
        }
        return base + "?" + arr_param.join('&');
    }

    function removeUrlParameter (url, parameter) {
        var arr_url = url.split('?');
        var base = arr_url[0];
        var arr_param = arr_url[1].split('&');
        var index = -1;
        for (var i = 0; i < arr_param.length; i++) {
            var paired = arr_param[i].split('=');
            if (paired[0] == parameter) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return url;
        } else {
            arr_param.splice(index, 1);
            return base + "?" + arr_param.join('&');
        }
    }

    function TankPanel (onValueChanged) {
        this.nameElement = $ (".tank h1").get (0).firstChild;
        this.compareElement = $ (".nav.nav-tabs .nav-item").eq (2).find ("a");
        this.aimTimeElement = $ ("label:contains('Aim time (sec)'):first+");
        this.dispersionElement = $ ("label:contains('Dispersion'):first+");
        this.dispersionFactorMovingElement = $ ("label:contains('… moving (+)'):first+");
        this.dispersionFactorTankTraverseElement = $ ("label:contains('… tank traverse (+)'):first+");
        this.dispersionFactorTurretTraverseElement = $ ("label:contains('… turret traverse (+)'):first+");
        this.dispersionFactorAfterFiringElement = $ ("label:contains('… after firing (+)'):first+");
        this.dispersionFactorDamagedElement = $ ("label:contains('… damaged (×)'):first+");
        this.topSpeedElement = $ ("label:contains('Top speed (km/h)'):first+");
        this.effectiveTopSpeedHardElement = $ ("label:contains('… hard (km/h)'):first+");
        this.effectiveTopSpeedMediumElement = $ ("label:contains('… medium (km/h)'):first+");
        this.effectiveTopSpeedSoftElement = $ ("label:contains('… soft (km/h)'):first+");
        this.effectiveTraverseHardElement = $ ("label:contains('… hard (°/sec)'):first+");
        this.effectiveTraverseMediumElement = $ ("label:contains('… medium (°/sec)'):first+");
        this.effectiveTraverseSoftElement = $ ("label:contains('… soft (°/sec)'):first+");
        this.turretTraverseElement = $ ("label:contains('Turret traverse (°/sec)'):first+");
        this.getName = function () {
            return this.nameElement.nodeValue;
        };
        this.getAimTime = function () {
            return parseFloat (this.aimTimeElement.text ());
        };
        this.getDispersion = function () {
            return parseFloat (this.dispersionElement.text ());
        };
        this.getDispersionFactorMoving = function () {
            return parseFloat (this.dispersionFactorMovingElement.text ());
        };
        this.getDispersionFactorTankTraverse = function () {
            return parseFloat (this.dispersionFactorTankTraverseElement.text ());
        };
        this.getDispersionFactorTurretTraverse = function () {
            return parseFloat (this.dispersionFactorTurretTraverseElement.text ());
        };
        this.getDispersionFactorAfterFiring = function () {
            return parseFloat (this.dispersionFactorAfterFiringElement.text ());
        };
        this.getDispersionFactorDamaged = function () {
            return parseFloat (this.dispersionFactorDamagedElement.text ());
        };
        this.getTopSpeed = function () {
            return parseFloat (this.topSpeedElement.text ());
        };
        this.getEffectiveTopSpeedHard = function () {
            return parseFloat (this.effectiveTopSpeedHardElement.text ());
        };
        this.getEffectiveTopSpeedMedium = function () {
            return parseFloat (this.effectiveTopSpeedMediumElement.text ());
        };
        this.getEffectiveTopSpeedSoft = function () {
            return parseFloat (this.effectiveTopSpeedSoftElement.text ());
        };
        this.getEffectiveTraverseHard = function () {
            return parseFloat (this.effectiveTraverseHardElement.text ());
        };
        this.getEffectiveTraverseMedium = function () {
            return parseFloat (this.effectiveTraverseMediumElement.text ());
        };
        this.getEffectiveTraverseSoft = function () {
            return parseFloat (this.effectiveTraverseSoftElement.text ());
        };
        this.getTurretTraverse = function () {
            return parseFloat (this.turretTraverseElement.text ());
        };
        this.getBaseName = function () {
            return this.compareElement.text ();
        };
        this.getBaseAimTime = function () {
            return getBaseValue.call (this, this.aimTimeElement, this.getAimTime);
        };
        this.getBaseDispersion = function () {
            return getBaseValue.call (this, this.dispersionElement, this.getDispersion);
        };
        this.getBaseDispersionFactorMoving = function () {
            return getBaseValue.call (this, this.dispersionFactorMovingElement, this.getDispersionFactorMoving);
        };
        this.getBaseDispersionFactorTankTraverse = function () {
            return getBaseValue.call (this, this.dispersionFactorTankTraverseElement, this.getDispersionFactorTankTraverse);
        };
        this.getBaseDispersionFactorTurretTraverse = function () {
            return getBaseValue.call (this, this.dispersionFactorTurretTraverseElement, this.getDispersionFactorTurretTraverse);
        };
        this.getBaseDispersionFactorAfterFiring = function () {
            return getBaseValue.call (this, this.dispersionFactorAfterFiringElement, this.getDispersionFactorAfterFiring);
        };
        this.getBaseDispersionFactorDamaged = function () {
            return getBaseValue.call (this, this.dispersionFactorDamagedElement, this.getDispersionFactorDamaged);
        };
        this.getBaseTopSpeed = function () {
            return getBaseValue.call (this, this.topSpeedElement, this.getTopSpeed);
        };
        this.getBaseEffectiveTopSpeedHard = function () {
            return getBaseValue.call (this, this.effectiveTopSpeedHardElement, this.getEffectiveTopSpeedHard);
        };
        this.getBaseEffectiveTopSpeedMedium = function () {
            return getBaseValue.call (this, this.effectiveTopSpeedMediumElement, this.getEffectiveTopSpeedMedium);
        };
        this.getBaseEffectiveTopSpeedSoft = function () {
            return getBaseValue.call (this, this.effectiveTopSpeedSoftElement, this.getEffectiveTopSpeedSoft);
        };
        this.getBaseEffectiveTraverseHard = function () {
            return getBaseValue.call (this, this.effectiveTraverseHardElement, this.getEffectiveTraverseHard);
        };
        this.getBaseEffectiveTraverseMedium = function () {
            return getBaseValue.call (this, this.effectiveTraverseMediumElement, this.getEffectiveTraverseMedium);
        };
        this.getBaseEffectiveTraverseSoft = function () {
            return getBaseValue.call (this, this.effectiveTraverseSoftElement, this.getEffectiveTraverseSoft);
        };
        this.getBaseTurretTraverse = function () {
            return getBaseValue.call (this, this.turretTraverseElement, this.getTurretTraverse);
        };
        this.toTank = function () {
            return toTank (this, false);
        };
        this.toBaseTank = function () {
            return toTank (this, true);
        };

        function getBaseValue (element, onGetValue) {
            var baseElement = element.next ();
            return baseElement.length > 0 ? parseFloat (baseElement.text ()) : onGetValue.call (this);
        }

        function toTank (tankPanel, isBase) {
            var header = isBase ? "getBase" : "get";
            var tank = new Tank ();
            tank.name = tankPanel[header + "Name"] ();
            tank.aimTime = tankPanel[header + "AimTime"] ();
            tank.dispersion = tankPanel[header + "Dispersion"] ();
            tank.dispersionFactorMoving = tankPanel[header + "DispersionFactorMoving"] ();
            tank.dispersionFactorTankTraverse = tankPanel[header + "DispersionFactorTankTraverse"] ();
            tank.dispersionFactorTurretTraverse = tankPanel[header + "DispersionFactorTurretTraverse"] ();
            tank.dispersionFactorAfterFiring = tankPanel[header + "DispersionFactorAfterFiring"] ();
            tank.dispersionFactorDamaged = tankPanel[header + "DispersionFactorDamaged"] ();
            tank.topSpeed = tankPanel[header + "TopSpeed"] ();
            tank.effectiveTopSpeedHard = tankPanel[header + "EffectiveTopSpeedHard"] ();
            tank.effectiveTopSpeedMedium = tankPanel[header + "EffectiveTopSpeedMedium"] ();
            tank.effectiveTopSpeedSoft = tankPanel[header + "EffectiveTopSpeedSoft"] ();
            tank.effectiveTraverseHard = tankPanel[header + "EffectiveTraverseHard"] ();
            tank.effectiveTraverseMedium = tankPanel[header + "EffectiveTraverseMedium"] ();
            tank.effectiveTraverseSoft = tankPanel[header + "EffectiveTraverseSoft"] ();
            tank.turretTraverse = tankPanel[header + "TurretTraverse"] ();
            return tank;
        }

    }

    function Panel (header) {
        this.element = $ ("<div class='card mb-3'>");
        this.headerElement = $ ("<div class='bg-primary fs-5 card-header'>");
        this.bodyElement = $ ("<div class='card-body'>");
        this.element.append (this.headerElement);
        this.element.append (this.bodyElement);
        this.items = [];

        this.setHeader = function (header) {
            this.headerElement.html (header);
        };

        this.addItem = function (label, value) {
            var item = new PanelItem (label, value);
            this.items.push (item);
            this.bodyElement.append (item.element);
            return item;
        };

        this.setHeader (header);
    }

    function PanelItem (label, value) {
        this.element = $ ("<div class='stat-line'>");
        this.labelElement = $ ("<label>");
        this.valueElement = $ ("<span>");
        this.baseValueElement = null;
        this.element.append (this.labelElement);
        this.element.append (this.valueElement);

        this.setLabel = function (label) {
            this.labelElement.html (label);
        };

        this.setValue = function (value) {
            this.valueElement.html (value);
        };

        this.getValue = function () {
            return this.valueElement.text ();
        };

        this.setBaseValue = function (value) {
            if (value == this.getValue ()) {
                if (this.baseValueElement != null) {
                    this.baseValueElement.remove ();
                    this.baseValueElement = null;
                }
                return;
            }
            if (this.baseValueElement == null) {
                this.baseValueElement = $ ("<div>");
                this.element.append (this.baseValueElement);
            }
            this.baseValueElement.html (value);
        };

        this.getBaseValue = function () {
            return this.baseValueElement == null ? this.getValue () : this.baseValueElement.text ();
        };

        this.getValueElement = function () {
            return this.valueElement.children (":first");
        };

        this.getValueElementValue = function () {
            return this.getValueElement ().val ();
        };

        this.getValueElementChecked = function () {
            return this.getValueElement ().prop ("checked");
        };

        this.getValueElementOptionText = function () {
            return this.getValueElement ().find ("option:selected").text ();
        };

        this.setVisible = function (visible) {
            if (visible) {
                this.element.show ();
                return;
            }
            this.element.hide ();
        };

        this.setHighlight = function (highlight) {
            if (highlight) {
                this.element.addClass ("highlight");
                return;
            }
            this.element.removeClass ("highlight");
        };

        this.setCompareColor = function (compare) {
            if (compare == 0) {
                this.valueElement.parent ().removeAttr ("style");
                return;
            }
            if (compare > 0) {
                this.valueElement.parent ().attr ("style", "background-color: " + window.color.lightGreen);
                return;
            }
            this.valueElement.parent ().attr ("style", "background-color: " + window.color.lightCoral);
        };

        this.setLabel (label);
        this.setValue (value);
    }

    function AimInformationPanel (header, onValueChanged) {
        this.panel = new Panel (header);
        this.terrainItem = this.panel.addItem (window.language.terrain, "<select>" +
                                               "<option value='Hard'>" + window.language.terrainHard + "</option>" +
                                               "<option value='Medium' selected>" + window.language.terrainMedium + "</option>" +
                                               "<option value='Soft'>" + window.language.terrainSoft + "</option>" +
                                               "</select>");
        this.isMovingItem = this.panel.addItem (window.language.isMoving, "<input type='checkbox' />");
        //this.moveSpeedSliderItem = this.panel.addItem (window.language.moveSpeed, "<input type='range' />");
        this.isTankTraversingItem = this.panel.addItem (window.language.isTankTraversing, "<input type='checkbox' checked />");
        this.isTurretTraversingItem = this.panel.addItem (window.language.isTurretTraversing, "<input type='checkbox' checked />");
        this.isFiringItem = this.panel.addItem (window.language.isFiring, "<input type='checkbox' />");
        this.isGunDamagedItem = this.panel.addItem (window.language.isGunDamaged, "<input type='checkbox' />");
        this.aimTimeItem = this.panel.addItem (window.language.aimTime, 0);
        this.dispersionItem = this.panel.addItem (window.language.dispersion, 0);
        this.moveSpeedItem = this.panel.addItem (window.language.moveSpeed, 0);
        this.tankTraverseSpeedItem = this.panel.addItem (window.language.tankTraverseSpeed, 0);
        this.turretTraverseSpeedItem = this.panel.addItem (window.language.turretTraverseSpeed, 0);

        this.getTerrain = function () {
            return this.terrainItem.getValueElementValue ();
        };

        this.getIsMoving = function () {
            return this.isMovingItem.getValueElementChecked ();
        };

        this.getMoveSpeed = function () {
            return this.moveSpeedSliderItem.getValueElementValue ();
        };

        this.getIsTankTraversing = function () {
            return this.isTankTraversingItem.getValueElementChecked ();
        };

        this.getIsTurretTraversing = function () {
            return this.isTurretTraversingItem.getValueElementChecked ();
        };

        this.getIsFiring = function () {
            return this.isFiringItem.getValueElementChecked ();
        };

        this.getIsGunDamaged = function () {
            return this.isGunDamagedItem.getValueElementChecked ();
        };

        this.toString = function () {
            return "Terrain: " + this.getTerrain () +
                "\nIsMoving: " + this.getIsMoving () +
                "\nIsTankTraverse: " + this.getIsTankTraversing () +
                "\nTraversingTurret: " + this.getIsTurretTraversing () +
                "\nFiring: " + this.getIsFiring () +
                "\nGunDamaged: " + this.getIsGunDamaged ();
        };

        this.aimTimeItem.setHighlight (true);
        this.dispersionItem.setHighlight (true);
        this.terrainItem.getValueElement ().bind ("input propertychange", onValueChanged);
        this.isMovingItem.getValueElement ().bind ("input propertychange", onValueChanged);
        //this.moveSpeedSliderItem.getValueElement ().bind ("input propertychange", onValueChanged);
        this.isTankTraversingItem.getValueElement ().bind ("input propertychange", onValueChanged);
        this.isTurretTraversingItem.getValueElement ().bind ("input propertychange", onValueChanged);
        this.isFiringItem.getValueElement ().bind ("input propertychange", onValueChanged);
        this.isGunDamagedItem.getValueElement ().bind ("input propertychange", onValueChanged);
    }

    function CurvePanel (header) {
        this.panel = new Panel (header);
        this.canvasElement = $ ("<canvas>");
        this.panel.element.append (this.canvasElement);
        this.canvasElement.attr ("height", window.curveCanvasHeight);
        this.chart = new Chart (this.canvasElement.get (0).getContext ("2d"), {
            type: "line",
            data: null,
            options: {
                animation: false
            }
        });

        this.setData = function (data) {
            this.chart.data = data;
            this.chart.update (0);
        };

    }

    function AimInformationCurvePanel () {

        this.getPanel = function () {
            return this.canvasPanel.panel;
        };

        this.canvasPanel = new CurvePanel ();
        this.tank = null;
        this.baseTank = null;
        this.tankResult = null;
        this.baseTankResult = null;
        this.typeItem = this.getPanel ().addItem (window.language.curveType, $ ("<select>" +
                                                                                "<option value='Speed/Dispersion' selected>" + window.language.speedAndDispersion + "</option>" +
                                                                                "<option value='Traverse/Dispersion'>" + window.language.traverseAndDispersion + "</option>" +
                                                                                "<option value='Time/Dispersion' selected>" + window.language.aimTimeAndDispersion + "</option>" +
                                                                                "<option value='Speed/Time'>" + window.language.speedAndAimTime + "</option>" +
                                                                                "<option value='Traverse/Time'>" + window.language.traverseAndAimTime + "</option>" +
                                                                                "</select>"));
        this.typeItem.element.after (this.canvasPanel.canvasElement);
        this.typeItem.element.bind ("change", function () {
            var type = this.typeItem.getValueElementValue ();
            var data = {
                labels: [],
                datasets: [
                    {
                        label: this.tank.name,
                        borderColor: window.color.lightGreen,
                        data: []
                    },
                    {
                        label: this.baseTank.name,
                        borderColor: window.color.lightCoral,
                        data: []
                    }
                ]
            };
            var frameCount = window.curveFrameCount;
            var current = 0;
            var result = null;
            var baseResult = null;
            for (var i = 0; i <= frameCount; i++) {
                current = i / frameCount;
                var x = 0;
                var y = 0;
                var baseY = 0;
                switch (type) {
                    case "Time/Dispersion":
                        var time = Math.max (this.tankResult.aimTime, this.baseTankResult.aimTime) * current;
                        result = this.tank.calculateAimTimeByTime (this.tankResult.aimTime, this.tankResult.dispersion, time);
                        baseResult = this.baseTank.calculateAimTimeByTime (this.baseTankResult.aimTime, this.baseTankResult.dispersion, time);
                        x = time.toFixed (window.decimalPlaces) + " " + window.language.second;
                        y = result.dispersion;
                        baseY = baseResult.dispersion;
                        break;
                    case "Speed/Time":
                    case "Speed/Dispersion":
                        var speed = Math.max (this.tank.topSpeed, this.baseTank.topSpeed) * current;
                        result = this.tank.calculateAimTime (speed, 0, 0, false, false);
                        baseResult = this.baseTank.calculateAimTime (speed, 0, 0, false, false);
                        x = speed.toFixed (window.decimalPlaces) + " KM/H";
                        if (type == "Speed/Time") {
                            y = result.aimTime;
                            baseY = baseResult.aimTime;
                        } else {
                            y = result.dispersion;
                            baseY = baseResult.dispersion;
                        }
                        break;
                    case "Traverse/Time":
                    case "Traverse/Dispersion":
                        var tankTraverse = Math.max (this.tank.effectiveTraverseHard, this.baseTank.effectiveTraverseHard) * current;
                        var turretTraverse = Math.max (this.tank.turretTraverse, this.baseTank.turretTraverse) * current;
                        result = this.tank.calculateAimTime (0, tankTraverse, turretTraverse, false, false);
                        baseResult = this.baseTank.calculateAimTime (0, tankTraverse, turretTraverse, false, false);
                        x = tankTraverse.toFixed (window.decimalPlaces) + " + " + turretTraverse.toFixed (window.decimalPlaces);
                        if (type == "Traverse/Time") {
                            y = result.aimTime;
                            baseY = baseResult.aimTime;
                        } else {
                            y = result.dispersion;
                            baseY = baseResult.dispersion;
                        }
                        break;
                }
                data.labels.push (x);
                data.datasets[0].data.push (y.toFixed (window.decimalPlaces));
                data.datasets[1].data.push (baseY.toFixed (window.decimalPlaces));
            }
            this.getPanel ().setHeader (this.typeItem.getValueElementOptionText () + " " + window.language.curve);
            this.canvasPanel.setData (data);
        }.bind (this));

        this.refresh = function () {
            this.typeItem.element.trigger ("change");
        };

    }

    function AnimationPanel (header) {
        this.panel = new Panel (header);
        this.tank = null;
        this.tankBase = null;
        this.currentTurretAngle = 0;
        this.currentBaseTurretAngle = 0;
        this.drawId = null;
        this.canvasElement = $ ("<canvas>");
        this.panel.element.append (this.canvasElement);
        this.canvasContext = this.canvasElement.get (0).getContext ("2d");
        this.playButton = $ ("<button>" + window.language.play + "</button>");
        this.panel.element.append (this.playButton);

        this.setSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.halfWidth = this.width / 2.0;
            this.halfHeight = this.height / 2.0;
            this.turretRadius = this.height * 0.1;
            this.baseTurretRadius = this.turretRadius + 5;
            this.gunLength = this.height;
            this.canvasElement.attr ("width", width);
            this.canvasElement.attr ("height", height);
        };

        this.playButton.bind ("click", function () {
            this.play ();
        }.bind (this));

        this.play = function () {
            this.currentTurretAngle = 0;
            this.currentBaseTurretAngle = 0;
            clearInterval (this.drawId);
            this.drawId = setInterval (drawFrame, 16, this, 0.016);
        };

        function drawFrame (animationPanel, deltaTime) {
            if (animationPanel.tank == null) {
                return;
            }
            animationPanel.canvasContext.clearRect (0, 0, animationPanel.width, animationPanel.height);
            animationPanel.canvasContext.beginPath ();
            animationPanel.canvasContext.strokeStyle = "#000000";
            animationPanel.canvasContext.moveTo (animationPanel.halfWidth, animationPanel.halfHeight);
            animationPanel.canvasContext.lineTo (animationPanel.halfWidth, animationPanel.halfHeight - animationPanel.gunLength);
            animationPanel.canvasContext.stroke ();
            draw (animationPanel.canvasContext, animationPanel.halfWidth, animationPanel.halfHeight, animationPanel.turretRadius, animationPanel.currentTurretAngle, animationPanel.gunLength, window.color.lightGreen);
            draw (animationPanel.canvasContext, animationPanel.halfWidth, animationPanel.halfHeight, animationPanel.baseTurretRadius, animationPanel.currentBaseTurretAngle, animationPanel.gunLength, window.color.lightCoral);
            animationPanel.currentTurretAngle += animationPanel.tank.turretTraverse * deltaTime;
            animationPanel.currentBaseTurretAngle += animationPanel.baseTank.turretTraverse * deltaTime;
        }

        function draw (canvasContext, turretX, turretY, turretRadius, turretAngle, gunLength, color) {
            canvasContext.beginPath ();
            canvasContext.strokeStyle = color;
            canvasContext.arc (turretX, turretY, turretRadius, 0, 2 * Math.PI);
            canvasContext.moveTo (turretX, turretY);
            var turretRadian = Deg2Rad (turretAngle - 90);
            var x = turretX + gunLength * Math.cos (turretRadian);
            var y = turretY + gunLength * Math.sin (turretRadian);
            canvasContext.lineTo (x, y);
            canvasContext.stroke ();
        }

        this.play ();

    }

    function Tank () {
        this.name = null;
        this.aimTime = 0;
        this.dispersion = 0;
        this.dispersionFactorMoving = 0;
        this.dispersionFactorTankTraverse = 0;
        this.dispersionFactorTurretTraverse = 0;
        this.dispersionFactorAfterFiring = 0;
        this.dispersionFactorDamaged = 0;
        this.effectiveTopSpeedHard = 0;
        this.effectiveTopSpeedMedium = 0;
        this.effectiveTopSpeedSoft = 0;
        this.effectiveTraverseHard = 0;
        this.effectiveTraverseMedium = 0;
        this.effectiveTraverseSoft = 0;
        this.TurretTraverse = 0;

        this.toString = function () {
            return "Name: " + this.name +
                "\nAimTime: " + this.aimTime +
                "\nDispersion: " + this.dispersion +
                "\nDispersionFactorMoving: " + this.dispersionFactorMoving +
                "\nDispersionFactorTankTraverse: " + this.dispersionFactorTankTraverse +
                "\nDispersionFactorTurretTraverse: " + this.dispersionFactorTurretTraverse +
                "\nDispersionFactorAfterFiring: " + this.dispersionFactorAfterFiring +
                "\nDispersionFactorDamaged: " + this.dispersionFactorDamaged +
                "\nEffectiveTopSpeedHard: " + this.effectiveTopSpeedHard +
                "\nEffectiveTopSpeedMedium: " + this.effectiveTopSpeedMedium +
                "\nEffectiveTopSpeedSoft: " + this.effectiveTopSpeedSoft +
                "\nEffectiveTraverseHard: " + this.effectiveTraverseHard +
                "\nEffectiveTraverseMedium: " + this.effectiveTraverseMedium +
                "\nEffectiveTraverseSoft: " + this.effectiveTraverseSoft +
                "\nTurretTraverse: " + this.TurretTraverse;
        };

        this.calculateState = function (aimInformationPanel) {
            var terrain = aimInformationPanel.getTerrain ();
            var isMoving = aimInformationPanel.getIsMoving ();
            var isTankTraverse = aimInformationPanel.getIsTankTraversing ();
            var isTurretTraverse = aimInformationPanel.getIsTurretTraversing ();
            var isFiring = aimInformationPanel.getIsFiring ();
            var isGunDamaged = aimInformationPanel.getIsGunDamaged ();
            var moveSpeed = 0;
            var tankTraverseSpeed = 0;
            var turretTraverseSpeed = this.turretTraverse;
            switch (terrain) {
                case "Hard":
                    moveSpeed = this.effectiveTopSpeedHard;
                    tankTraverseSpeed = this.effectiveTraverseHard;
                    break;
                case "Medium":
                    moveSpeed = this.effectiveTopSpeedMedium;
                    tankTraverseSpeed = this.effectiveTraverseMedium;
                    break;
                case "Soft":
                    moveSpeed = this.effectiveTopSpeedSoft;
                    tankTraverseSpeed = this.effectiveTraverseSoft;
                    break;
            }
            if (!isMoving) {
                moveSpeed = 0;
            }
            if (!isTankTraverse) {
                tankTraverseSpeed = 0;
            }
            if (!isTurretTraverse) {
                turretTraverseSpeed = 0;
            }
            return {
                terrain: terrain,
                isMoving: isMoving,
                isTankTraverse: isTankTraverse,
                isTurretTraverse: isTurretTraverse,
                isFiring: isFiring,
                isGunDamaged: isGunDamaged,
                moveSpeed: moveSpeed,
                tankTraverseSpeed: tankTraverseSpeed,
                turretTraverseSpeed: turretTraverseSpeed
            };
        };

        this.calculateAimTime = function (moveSpeed, tankTraverseSpeed, turretTraverseSpeed, isFiring, isGunDamaged) {
            var movePenalty = Math.pow (moveSpeed * this.dispersionFactorMoving, 2);
            var tankTraversePenalty = Math.pow (tankTraverseSpeed * this.dispersionFactorTankTraverse, 2);
            var turretTraversePenalty = Math.pow (turretTraverseSpeed * this.dispersionFactorTurretTraverse, 2);
            var firePenalty = isFiring ? Math.pow (this.dispersionFactorAfterFiring, 2) : 0;
            var dispersionFactor = Math.sqrt (1 + movePenalty + tankTraversePenalty + turretTraversePenalty + firePenalty);
            var aimTime = Math.log (dispersionFactor) * this.aimTime;
            var dispersion = (isGunDamaged ? (this.dispersion * this.dispersionFactorDamaged) : this.dispersion) * dispersionFactor;
            return {
                aimTime: aimTime,
                dispersion: dispersion
            };
        };

        this.calculateAimTimeByTime = function (actualAimTime, actualDispersion, time) {
            var current = clamp (time / actualAimTime, 1, 0);
            var aimTime = time;
            var dispersion = actualDispersion / (Math.pow (Math.E, current * (actualAimTime / this.aimTime)));
            return {
                aimTime: aimTime,
                dispersion: dispersion
            };
        };

    }

}) ();
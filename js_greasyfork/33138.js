// ==UserScript==
// @name            FarmBase X10
// @version         20.12.17
// @description     Automate Farmin on PTE
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author          Tisi
// @downloadURL https://update.greasyfork.org/scripts/33138/FarmBase%20X10.user.js
// @updateURL https://update.greasyfork.org/scripts/33138/FarmBase%20X10.meta.js
// ==/UserScript==
(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/FarmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                break;
            }
        }
        function g() {
            qx.Class.define('FarmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('Farm')).set({
                                toolTipText: 'Start Farming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('FarmBase');
                                    farmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    farmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(farmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start Farming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start Farming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop Farming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('Farm'),
                                b.setToolTipText('Start Farming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            });
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), FarmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();


(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F1rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F1rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F1rm')).set({
                                toolTipText: 'Start F1rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F1rmBase');
                                    F1rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F1rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F1rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F1rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F1rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F1rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F1rm'),
                                b.setToolTipText('Start F1rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            });
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F1rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F2rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
             }
        }
        function g() {
            qx.Class.define('F2rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F2rm')).set({
                                toolTipText: 'Start F2rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F2rmBase');
                                    F2rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F2rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F2rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F2rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F2rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F2rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F2rm'),
                                b.setToolTipText('Start F2rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            });
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F2rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F3rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F3rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F3rm')).set({
                                toolTipText: 'Start F3rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F3rmBase');
                                    F3rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F3rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F3rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F3rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F3rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F3rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F3rm'),
                                b.setToolTipText('Start F3rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            });
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F3rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F4rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F4rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F4rm')).set({
                                toolTipText: 'Start F4rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F4rmBase');
                                    F4rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F4rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F4rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F4rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F4rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F4rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F4rm'),
                                b.setToolTipText('Start F4rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            });
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F4rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F5rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F5rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F5rm')).set({
                                toolTipText: 'Start F5rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F5rmBase');
                                    F5rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F5rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F5rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F5rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F5rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F5rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F5rm'),
                                b.setToolTipText('Start F5rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            })
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F5rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c)
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F6rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F6rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F6rm')).set({
                                toolTipText: 'Start F6rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F6rmBase');
                                    F6rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F6rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F6rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F6rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F6rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F6rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F6rm'),
                                b.setToolTipText('Start F6rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            });
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F6rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F7rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F7rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F7rm')).set({
                                toolTipText: 'Start F7rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F7rmBase');
                                    F7rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F7rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F7rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F7rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F7rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F7rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F7rm'),
                                b.setToolTipText('Start F7rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            })
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F7rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F8rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F8rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F8rm')).set({
                                toolTipText: 'Start F8rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F8rmBase');
                                    F8rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F8rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F8rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F8rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F8rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F8rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F8rm'),
                                b.setToolTipText('Start F8rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            });
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F8rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F9rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F9rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F9rm')).set({
                                toolTipText: 'Start F9rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F9rmBase');
                                    F9rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F9rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F9rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F9rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F9rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F9rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F9rm'),
                                b.setToolTipText('Start F9rming')
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            });
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F9rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

(function () {
    var c = document.createElement('script');
    c.innerHTML = '(' + function () {
        function c() {
            for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/F0rmBase/g)) {
                document.getElementsByTagName('head') [0].removeChild(a[b]);
                {break;}
            }
        }
        function g() {
            qx.Class.define('F0rmBase', {
                type: 'singleton',
                extend: qx.core.Object,
                members: {
                    g: null,
                    k: function () {
                        var a = qx.core.Init.getApplication().getPlayArea().getHUD().getUIItem(ClientLib.Data.Missions.PATH.WDG_COMBATSWAPVIEW),
                            b = (new webfrontend.ui.SoundButton('F0rm')).set({
                                toolTipText: 'Start F0rming',
                                width: 44,
                                height: 22,
                                allowGrowX: !1,
                                allowGrowY: !1,
                                appearance: 'button-baseviews',
                                marginRight: 6
                            });
                        b.addListener('click', function () {
                            if (null === this.g) {
                                var a = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity(),
                                    c = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (null !== a && null !== c) {
                                    var d = new webfrontend.gui.OverlayWidget;
                                    d.setMaxWidth(200);
                                    d.setMaxHeight(150);
                                    d.clientArea.setLayout(new qx.ui.layout.VBox(5));
                                    d.setTitle('F0rmBase');
                                    F0rmBaseLabel = (new qx.ui.basic.Label('Interval(in seconds):')).set({
                                        textColor: 'text-label',
                                        marginTop: 10,
                                        marginLeft: 20
                                    });
                                    F0rmBaseLabel.setThemedFont('bold');
                                    d.clientArea.add(F0rmBaseLabel);
                                    var e = (new qx.ui.form.TextField('53')).set({
                                        marginRight: 10,
                                        marginLeft: 20
                                    });
                                    d.clientArea.add(e);
                                    var f = (new qx.ui.form.Button('Start F0rming')).set({
                                        marginRight: 10,
                                        marginLeft: 20,
                                        width: 80,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Start F0rming'
                                    });
                                    d.clientArea.add(f);
                                    f.addListener('execute', function () {
                                        a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                            console.log(b);
                                        }), a.get_Id());
                                        this.g = setInterval(function () {
                                            a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                                                console.log(b);
                                            }), a.get_Id());
                                        }, 1000 * parseInt(e.getValue(), 10) + 7500);
                                        b.setLabel('Stop');
                                        b.setToolTipText('Stop F0rming');
                                        d.close();
                                    }, this);
                                    d.show();
                                }
                            } else clearInterval(this.g),
                                this.g = null,
                                b.setLabel('F0rm'),
                                b.setToolTipText('Start F0rming');
                        }, this);
                        a.getLayoutParent().addAfter(b, a);
                        c();
                    }
                }
            })
        }
        function e() {
            try {
                'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), F0rmBase.getInstance().k())  : setTimeout(e, 1000);
            } catch (a) {
                'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a);
            }
        }
        setTimeout(e, 1000);
    }.toString() + ')();';
    c.type = 'text/javascript';
    document.getElementsByTagName('head') [0].appendChild(c);
}) ();

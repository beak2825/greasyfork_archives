// ==UserScript==
// @name            FarmBase PTE
// @version         12.07.2017
// @description     Automate farming.
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author          Nogrod; mod by TC
// @downloadURL https://update.greasyfork.org/scripts/31383/FarmBase%20PTE.user.js
// @updateURL https://update.greasyfork.org/scripts/31383/FarmBase%20PTE.meta.js
// ==/UserScript==
(function () {
  var c = document.createElement('script');
  c.innerHTML = '(' + function () {
    function c() {
      for (var a = document.getElementsByTagName('script'), b = 0; b < a.length; b++) if ( - 1 != a[b].innerHTML.search(/FarmBase/g)) {
        document.getElementsByTagName('head') [0].removeChild(a[b]);
        break
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
                  var e = (new qx.ui.form.TextField('8')).set({
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
                      console.log(b)
                    }), a.get_Id());
                    this.g = setInterval(function () {
                      a.InvokeBattle(c, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, null, function (a, b) {
                        console.log(b)
                      }), a.get_Id())
                    }, 1000 * parseInt(e.getValue(), 10) + 7500);
                    b.setLabel('Stop');
                    b.setToolTipText('Stop Farming');
                    d.close()
                  }, this);
                  d.show()
                }
              } else clearInterval(this.g),
              this.g = null,
              b.setLabel('Farm'),
              b.setToolTipText('Start Farming')
            }, this);
            a.getLayoutParent().addAfter(b, a);
            c()
          }
        }
      })
    }
    function e() {
      try {
        'undefined' !== typeof qx && '' !== ClientLib.Data.MainData.GetInstance().get_Player().get_Name() ? (g(), FarmBase.getInstance().k())  : setTimeout(e, 1000)
      } catch (a) {
        'undefined' !== typeof console ? console.log(a + ': ' + a.stack)  : window.opera ? opera.postError(a)  : GM_log(a)
      }
    }
    setTimeout(e, 1000)
  }.toString() + ')();';
  c.type = 'text/javascript';
  document.getElementsByTagName('head') [0].appendChild(c)
}) ();

// ==UserScript==
// @name            EnemyInfo
// @version         17.6.1.1
// @description     Show Offense and Defense Level of Enemies.
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author          Nogrod,fuchsma
// @downloadURL https://update.greasyfork.org/scripts/30206/EnemyInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/30206/EnemyInfo.meta.js
// ==/UserScript==
(function ()
{
  var EnemyInfo_mainFunction = function ()
  {
    function createTweak()
    {
      webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange_EnemyInfo = webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange;
      webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange = function ()
      {
        var widget = webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance();
        var city = null;
        var selectedObject = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
        var objectType = selectedObject.get_VisObjectType();

        switch (objectType)
        {
          case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
          case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
            city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(selectedObject.get_Id());
            break;
          case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
            city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(selectedObject.get_Id());
            break;
          default:
            city = null;
        }

        if (!widget.hasOwnProperty("offLevel"))
        {
          var offWidget = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 0));
          offWidget.setTextColor("white");
          offWidget.setThemedFont("bold");
          offWidget.add(new qx.ui.basic.Label("Off Lvl:"), {
            row: 0,
            column: 0
          });
          widget.offLevel = new qx.ui.basic.Label("");
          offWidget.add(widget.offLevel, {
            row: 0,
            column: 1
          });
          offWidget.add(new qx.ui.basic.Label("Def Lvl:"), {
            row: 0,
            column: 2
          });
          widget.defLevel = new qx.ui.basic.Label("");
          offWidget.add(widget.defLevel, {
            row: 0,
            column: 3
          });
          widget.add(offWidget);
        }
        if (city !== null)
        {
          widget.offLevel.setValue(city.get_LvlOffense().toFixed(2));
          widget.defLevel.setValue(city.get_LvlDefense().toFixed(2));
        }
        return this.onCitiesChange_EnemyInfo();
      }
    }

    function EnemyInfo_checkIfLoaded()
    {
      try
      {
        if (typeof qx !== "undefined" && qx.core.Init.getApplication() !== null &&
          qx.core.Init.getApplication().getMenuBar() !== null)
        {
          createTweak();
        }
        else
        {
          setTimeout(EnemyInfo_checkIfLoaded, 1000);
        }
      }
      catch (e)
      {
        if (typeof console !== "undefined")
        {
          console.log(e + ": " + e.stack);
        }
        else if (window.opera)
        {
          opera.postError(e);
        }
        else
        {
          GM_log(e);
        }
      }
    }

    setTimeout(EnemyInfo_checkIfLoaded, 1000);
  };
  var EnemyInfoScript = document.createElement("script");
  var txt = EnemyInfo_mainFunction.toString();
  EnemyInfoScript.innerHTML = "(" + txt + ")();";
  EnemyInfoScript.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(EnemyInfoScript);
})();

// ==UserScript==
// @name            AllianceOffInfo
// @version         17.2.3.1
// @description     Show Offense and Defense Level of Enemies.
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author          Nogrod, fuchsma
// @downloadURL https://update.greasyfork.org/scripts/30205/AllianceOffInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/30205/AllianceOffInfo.meta.js
// ==/UserScript==
(function ()
{
  var AllianceInfo_mainFunction = function ()
  {
    function createTweak()
    {
      webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange_AllianceInfo = webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange;
      webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange = function ()
      {
        var widget = null;
        try
        {
          widget = webfrontend.gui.region.RegionCityStatusInfoAlliance.getInstance();
          var city = null;
          var selectedObject = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
          var objectType = selectedObject.get_VisObjectType();
          switch (objectType)
          {
            case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
              city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(selectedObject.get_Id());
              break;
            case ClientLib.Vis.VisObject.EObjectType.RegionAllianceMarker:
              city = null;
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
        }
        catch (e)
        {
          console.log(e + ": " + e.stack);
        }
        try
        {
          widget.offLevel.setValue(city.get_LvlOffense().toFixed(2));
          widget.defLevel.setValue(city.get_LvlDefense().toFixed(2));
        }
        catch (e)
        {
          console.log(e + ":" + e.stack);
          console.log("City: ", city);
        }
        return this.onCitiesChange_AllianceInfo();
      }
    }

    function AllianceInfo_checkIfLoaded()
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
          setTimeout(AllianceInfo_checkIfLoaded, 1000);
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

    setTimeout(AllianceInfo_checkIfLoaded, 1000);
  };
  var AllianceInfoScript = document.createElement("script");
  var txt = AllianceInfo_mainFunction.toString();
  AllianceInfoScript.innerHTML = "(" + txt + ")();";
  AllianceInfoScript.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(AllianceInfoScript);
})();

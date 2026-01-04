// ==UserScript==
// @name           Estiah - AllInOne
// @namespace      http://wl.attrib.org/estiah/allinone/
// @description    Makes playing Estiah even better!
// @author         WL
// @requiree        http://wl.attrib.org/estiah/json.js
// @icon           http://wl.attrib.org/estiah/estiah.png
// @resource       BlueGem http://wl.attrib.org/estiah/allinone/blue.png
// @resource       BrownGem http://wl.attrib.org/estiah/allinone/brown.png
// @resource       GreenGem http://wl.attrib.org/estiah/allinone/green.png
// @resource       RedGem http://wl.attrib.org/estiah/allinone/red.png
// @resource       WhiteGem http://wl.attrib.org/estiah/allinone/white.png
// @include        https://www.estiah.com/*
// @exclude        https://www.estiah.com/
// @exclude        https://www.estiah.com/user/auth*
// @version        0.5.6
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceURL
// @grant          GM_addStyle
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/440395/Estiah%20-%20AllInOne.user.js
// @updateURL https://update.greasyfork.org/scripts/440395/Estiah%20-%20AllInOne.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////
//functions
////////////////////////////////////////////////////////////////

var temp;

WL = {};
WL.Globals = {};
WL.Globals.Options = {};
WL.Globals.Options.Password = {};
WL.Globals.Options.Password.Text =
  "You can save your online ex-/import password here.";
WL.Globals.Options.Password.Default = "";
WL.Globals.Options.Delay = {};
WL.Globals.Options.Delay.Text =
  "Delay in ms for automated actions, if you experience problems on slower PCs, set it higher.";
WL.Globals.Options.Delay.Default = 500;
WL.Globals.Options.Domain = {};
WL.Globals.Options.Domain.Text = "Domain where the script is being run.";
WL.Globals.Options.Domain.Default = "https://www.estiah.com";
WL.Globals.Options.Loading = {};
WL.Globals.Options.Loading.Text = "What is shown while loading.";
WL.Globals.Options.Loading.Default =
  '<img style="vertical-align: top;" src="/image/template/phoenix/loading.gif">';
WL.Globals.Options.Loading.ReadOnly = true;
WL.Globals.Options.Split = {};
WL.Globals.Options.Split.Text =
  "Split used for lists, ... This character can't be used for gear names and some other saved data.";
WL.Globals.Options.Split.Default = "#";
WL.Globals.Options.Split.ReadOnly = true;
WL.Globals.Options.Wiki = {};
WL.Globals.Options.Wiki.Text = "Link to the wiki.";
WL.Globals.Options.Wiki.Default =
  "http://progenitor-softworks.com/ew/index.php?title=";
WL.String = {};
WL.String.Replace = function (String, Pattern, Replace) {
  return String.replace(Pattern, Replace);
};
WL.String.Cut = function (String, Pattern, Replace) {
  if (Replace === undefined) Replace = "";
  return String.replace(new RegExp(Pattern, "g"), Replace);
};
WL.Data = {};
WL.Data.Save = function (Name, Value) {
  GM_setValue(Name, Value);
};
WL.Data.Load = function (Name, Value) {
  var data = GM_getValue(Name);
  return data !== undefined ? data : Value !== undefined ? Value : false;
};
WL.Data.Delete = function (Name) {
  GM_deleteValue(Name);
};
WL.Data.Get = function (URL, onLoad) {
  GM_xmlhttpRequest({
    method: "GET",
    url: URL,
    onload: onLoad,
  });
};
WL.Data.Post = function (URL, Data, onLoad) {
  GM_xmlhttpRequest({
    method: "POST",
    url: URL,
    data: Data,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    onload: onLoad,
  });
};
WL.Data.IFrame = function (URL, onLoad) {
  iframe = WL.Node.Hide(WL.Node.Create("iframe", [["src", URL]]));
  iframe.addEventListener("load", onLoad, false);
  WL.Node.Select("//body").appendChild(iframe);
};
WL.List = {};
WL.List.Insert = function (Name, Value, Split) {
  if (Split === undefined) Split = WL.Globals.Options.Split.Value;
  Value = WL.String.Cut(Value, Split);
  WL.Data.Save(Name, WL.Data.Load(Name, Split) + Value + Split);
};
WL.List.InsertFirst = function (Name, Value, Split) {
  if (Split === undefined) Split = WL.Globals.Options.Split.Value;
  Value = WL.String.Cut(Value, Split);
  WL.Data.Save(Name, Split + Value + WL.Data.Load(Name, Split));
};
WL.List.Delete = function (Name, Value) {
  var list, split;
  list = WL.Data.Load(Name);
  if (list === false) return false;
  split = list.substring(0, 1);
  WL.Data.Save(Name, WL.String.Replace(list, split + Value + split, split));
};
WL.List.Replace = function (Name, Value, Replace) {
  var list, split;
  list = WL.Data.Load(Name);
  if (list === false) return false;
  split = list.substring(0, 1);
  Replace = WL.String.Cut(Replace, split);
  WL.Data.Save(
    Name,
    WL.String.Replace(list, split + Value + split, split + Replace + split)
  );
};
WL.List.Exists = function (Name, Value) {
  var list, split;
  list = WL.Data.Load(Name);
  if (list === false) return false;
  split = list.substring(0, 1);
  return list.indexOf(split + Value + split) > -1 ? true : false;
};
WL.List.ForEach = function (Name, onEach) {
  var list, item;
  list = WL.Data.Load(Name);
  if (list === false) return false;
  list = list.substring(1).split(list.substring(0, 1));
  //!easy sorting would be possible here, but only if sorted after whole id (seldom the case)
  while ((item = list.shift())) onEach(item);
  //!maybe return count later
  return true;
};
WL.Node = {};
WL.Node.Select = function (XPath, Context) {
  return top.document.evaluate(
    XPath,
    Context !== undefined ? Context : top.document,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
};
WL.Node.Count = function (XPath, Context) {
  return top.document.evaluate(
    "count(" + XPath + ")",
    Context !== undefined ? Context : top.document,
    null,
    XPathResult.NUMBER_TYPE,
    null
  ).numberValue;
};
WL.Node.Stringify = function (XPath, Context) {
  return top.document.evaluate(
    XPath,
    Context !== undefined ? Context : top.document,
    null,
    XPathResult.STRING_TYPE,
    null
  ).stringValue;
};
WL.Node.Create = function (Tag, Attributes, innerHTML, onClick) {
  var pair, value;
  var node = top.document.createElement(Tag);
  if (Attributes !== undefined)
    while ((pair = Attributes.pop())) node.setAttribute(pair[0], pair[1]);
  if (innerHTML !== undefined) node.innerHTML = innerHTML;
  if (onClick !== undefined) node.addEventListener("click", onClick, false);
  return node;
};
WL.Node.Remove = function (Node) {
  if (Node !== null) Node.parentNode.removeChild(Node);
};
WL.Node.Replace = function (Node1, Node2) {
  if (Node1 !== null && Node2 !== null)
    Node1.parentNode.replaceChild(Node2, Node1);
};
WL.Node.ForEach = function (XPath, onEach, Context, out) {
  var doc, nodes, i;
  if (out) doc = Context;
  else doc = top.document;
  nodes = doc.evaluate(
    XPath,
    Context !== undefined ? Context : top.document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  for (i = 0; i < nodes.snapshotLength; i++)
    if (onEach(nodes.snapshotItem(i), i) === false) return false;
};
WL.Node.ForEachNew = function (Node, onInsert, Init) {
  if (Init === true) if (onInsert() === false) return;
  Node.addEventListener(
    "DOMNodeInserted",
    function () {
      if (
        this.innerHTML.substring(0, WL.Globals.Options.Loading.Value.length) ==
        WL.Globals.Options.Loading.Value
      )
        return;
      this.removeEventListener("DOMNodeInserted", arguments.callee, false);
      window.setTimeout(function () {
        WL.Node.ForEachNew(Node, onInsert, true);
      }, WL.Globals.Options.Delay.Value);
    },
    false
  );
};
WL.Node.Show = function (Node) {
  if (Node !== null) Node.style.display = "";
  return Node;
};
WL.Node.Hide = function (Node) {
  if (Node !== null) Node.style.display = "none";
  return Node;
};
WL.Node.Visibility = function (Node, Visible) {
  if (Visible === undefined) if (Node.style.display == "none") Visible = true;
  if (Visible) return WL.Node.Show(Node);
  else return WL.Node.Hide(Node);
};
WL.Node.Click = function (Node) {
  var event = top.document.createEvent("MouseEvents");
  event.initEvent("click", true, true);
  Node.dispatchEvent(event);
};
WL.Button = {};
WL.Button.Create = function (innerHTML, Color, onClick, id) {
  var attributes = [["class", "button_inner button_ic" + Color]];
  if (id !== undefined) attributes.unshift(["id", id]);
  return WL.Node.Create("div", [
    ["class", "button button_ic" + Color],
  ]).appendChild(WL.Node.Create("a", attributes, innerHTML, onClick))
    .parentNode;
};
WL.CSS = {};
WL.CSS.Add = function (CSS) {
  GM_addStyle(CSS);
};
WL.Script = {};
WL.Script.Run = function (code) {
  window.location.href = "javascript:void(" + code + ");";
};
WL.Script.New = function (name, func) {
  WL.Script.Run(name + " = " + func);
};
WL.Script.Replace = function (oldname, newname, func) {
  WL.Script.New(newname, oldname);
  WL.Script.New(oldname, func);
};
WL.Options = {};
WL.Options.Save = function () {
  for (option in WL.Globals.Options)
    WL.Data.Save("Options_" + option, WL.Globals.Options[option]["Value"]);
};
WL.Options.Load = function () {
  for (option in WL.Globals.Options)
    WL.Globals.Options[option]["Value"] = WL.Data.Load(
      "Options_" + option,
      WL.Globals.Options[option]["Default"]
    );
};
WL.Options.Load();
WL.Addon = {};
WL.Globals.Addons = [];
WL.Addon.Register = function (Name, Version, Description, Author) {
  WL.Globals.Addons.push([Name, Version, Description, Author]);
};
WL.Addon.MenuEntry = function (Name, onClick) {
  WL.Globals.Menu.parentNode.insertBefore(
    WL.Node.Create("div", [["class", "row"]])
      .appendChild(
        WL.Node.Create(
          "div",
          [["class", "left"]],
          '<div class="misc_star star_gold"></div>&nbsp;'
        )
      )
      .appendChild(WL.Node.Create("a", [], Name, onClick)).parentNode
      .parentNode,
    WL.Globals.Menu
  );
};
WL.Sheira = {};
WL.Sheira.Class = "Failarch";
WL.Estiah = {};
WL.Estiah.GetPlayerID = function () {
  var player = WL.Node.Select(
    '//div[@class="wireframe_menu format"]/div/div/div/div/a[contains(@href, "/character/achievement/index/id/")]'
  );
  return player !== null ? player.getAttribute("href").substring(32) : 0;
};
WL.Globals.PlayerID = WL.Estiah.GetPlayerID();
WL.Estiah.GetCityID = function (Viewed) {
  return Viewed !== true
    ? WL.Node.Select('//a[contains(@href, "/arena/")]')
        .getAttribute("href")
        .substring(7)
    : WL.Node.Select('//div[@class="minimap"]/a')
        .getAttribute("href")
        .substring(6);
};
WL.Estiah.Cities = [
  "Every City",
  "Aleas",
  "Draka",
  "Eclis",
  "Eversweep",
  "Gaea's Dawn",
  "Inachis",
  "Lumina",
  "Night Tear",
  "Skyrift",
  "Triland",
  "Wildhowl",
  "Windscar",
  "Zeal",
];
WL.Estiah.GetLevel = function () {
  return WL.Node.Select('//strong[@class = "PT_update_level"]').innerHTML;
};
WL.Estiah.GetName = function () {
  var name = WL.Node.Select(
    '//strong[@class = "PT_update_level"]/..'
  ).innerHTML;
  return name.substring(0, name.indexOf(" "));
};
WL.Estiah.Classes = {};
WL.Estiah.Classes.Tier0 = ["Adventurer"];
WL.Estiah.Classes.Tier1 = ["Fighter", "Scout", "Novice", "Recruit"];
WL.Estiah.Classes.Tier2 = [
  "Mercenary",
  "Wizard",
  "Rogue",
  "Shaman",
  "Monk",
  "Sage",
  "Guard",
  "Cleric",
];
WL.Estiah.Classes.Tier3 = [
  "Deathknight",
  "Inquisitor",
  "Champion",
  "Pyromaniac",
  "Berserker",
  "Summoner",
  "Assassin",
  "Slayer",
  "Warlord",
  "Warden",
  "Paladin",
  "Hierarch",
  WL.Sheira.Class,
];
WL.Estiah.GetTier = function (Class) {
  if (WL.Estiah.Classes.Tier0.indexOf(Class) > -1) return 0;
  if (WL.Estiah.Classes.Tier1.indexOf(Class) > -1) return 1;
  if (WL.Estiah.Classes.Tier2.indexOf(Class) > -1) return 2;
  if (WL.Estiah.Classes.Tier3.indexOf(Class) > -1) return 3;
};
WL.Estiah.LoadClass = function () {
  var tier;
  WL.Globals.Class = [];
  for (tier = 1; tier < 4; tier++) {
    WL.Globals.Class["T" + tier] = WL.Data.Load(
      "AllInOne_T" + tier + "Class_" + WL.Globals.PlayerID
    );
    if (
      !WL.Globals.Class["T" + tier] &&
      WL.Estiah.GetLevel() >= tier * 10 + 10
    ) {
      WL.Estiah.GetClasses();
      return;
    }
  }
};
WL.Estiah.GetClasses = function () {
  //check json first?
  WL.Data.Get(
    WL.Globals.Options.Domain.Value + "/character/skill/index/filter/all",
    function (responseDetails) {
      temp = WL.Node.Select("//body").appendChild(
        WL.Node.Hide(WL.Node.Create("div"))
      );
      temp.innerHTML = responseDetails.responseText;
      WL.Node.ForEach(
        '//div[@id="TabContentSkill4"]/div[contains(@id, "Skill")]',
        function (node) {
          var clas, tier;
          clas = WL.Node.Select(
            'div[@class="name"]/a/strong',
            node
          ).innerHTML.toLowerCase();
          tier = parseInt(
            WL.Node.Select('div[@class="rank c2"]', node).innerHTML
          );
          WL.Data.Save(
            "AllInOne_T" + tier + "Class_" + WL.Globals.PlayerID,
            clas
          );
          WL.Globals.Class["T" + tier] = clas;
        },
        temp
      );
      WL.Node.Remove(temp);
    }
  );
};
WL.Estiah.Hide = function () {
  var page = WL.Node.Select('//div[@class="wl_page"]');
  if (page != null) {
    WL.Node.Remove(page);
    WL.Node.Show(WL.Node.Select('//div[@class="wireframe_300"]'));
  }
};
WL.Estiah.Show = function (Page, Title) {
  WL.Estiah.Hide();
  var oldframe, newframe;
  oldframe = WL.Node.Select('//div[@class="wireframe_300"]');
  newframe = oldframe.cloneNode(false);
  newframe.setAttribute("class", "wl_page");
  WL.Node.Hide(oldframe);
  oldframe.parentNode.appendChild(newframe);
  if (Page !== undefined) newframe.appendChild(Page);
  if (Title !== undefined) {
    if (WL.Globals.Title === undefined) WL.Globals.Title = top.document.title;
    top.document.title = Title;
  }
};
WL.Estiah.Page = {};
WL.Estiah.Page.New = function (Name, Description) {
  var page = WL.Node.Create("div", [
    ["class", "wireframe_2"],
    ["style", "width: 880px;"],
  ]).appendChild(
    WL.Node.Create("div", [
      ["class", "wireframe_allinone common_content"],
      ["style", "margin: 0px 55px 0px 55px;"],
    ])
  );
  page.appendChild(
    WL.Node.Create("div", [["class", "section_title c2"]], Name)
  );
  page.appendChild(
    WL.Node.Create(
      "a",
      [
        ["class", "nolink"],
        ["style", "float: right;"],
      ],
      "[X]",
      function () {
        WL.Estiah.Hide();
        top.document.title = WL.Globals.Title;
        delete WL.Globals.Title;
      }
    )
  );
  page.appendChild(
    WL.Node.Create("div", [["class", "section_text"]], Description)
  );
  return page.parentNode;
};
WL.Estiah.Time = function (DateTime) {
  if (DateTime === undefined) DateTime = new Date();
  return (
    DateTime.getUTCFullYear() +
    "-" +
    (DateTime.getUTCMonth() < 9 ? "0" : "") +
    (DateTime.getUTCMonth() + 1) +
    "-" +
    (DateTime.getUTCDate() < 10 ? "0" : "") +
    DateTime.getUTCDate() +
    " " +
    (DateTime.getUTCHours() < 10 ? "0" : "") +
    DateTime.getUTCHours() +
    ":" +
    (DateTime.getUTCMinutes() < 10 ? "0" : "") +
    DateTime.getUTCMinutes() +
    ":" +
    (DateTime.getUTCSeconds() < 10 ? "0" : "") +
    DateTime.getUTCSeconds()
  );
};

////////////////////////////////////////////////////////////////
//allinone
////////////////////////////////////////////////////////////////

/*//stop if player is not logged in
if (WL.Globals.PlayerID == 0)
	return false;*/

//stop if loaded in frame
if (top.frames.length > 0) return false;

//browsertest
WL.Data.Save("CompatibleBrowser", true);
if (!WL.Data.Load("CompatibleBrowser")) {
  alert("Your browser is not compatible with this script.");
  return false;
}

if (WL.Globals.PlayerID != 0) {
  //info
  var allinone_name = "AllInOne";
  var allinone_version = "0.5.6";
  var allinone_server = "http://wl.attrib.org/estiah/allinone/";

  ////////////////////////////////////////////////////////////////
  //small customizations
  ////////////////////////////////////////////////////////////////

  //+remove reclaimall in menu
  WL.Node.Remove(
    WL.Node.Select('//a[@href="/json/character/inventory/reclaimall"]/../..')
  );

  //+remove reclaimall also on inventory page
  //WL.Node.Remove(WL.Node.Select('//a[@href="/json/character/inventory/reclaimall"]'));

  //+remove tutorial
  WL.Node.Remove(
    WL.Node.Select('//div[@class="tutorial_link PT_tutorial_intro_0"]')
  );

  //+scrolling notepad
  //WL.CSS.Add(".miniicon_book { position: fixed; }");
  //WL.CSS.Add(".notepad { position: fixed; }");

  //+hide charms on gearpage
  //WL.Node.Click(WL.Node.Select('//a[contains(@class, "BV_picker_none")]'));

  //+open achievements
  WL.Node.ForEach('//a[@class="inv nolink BV_toggle_show"]', function (node) {
    WL.Node.Click(node);
  });

  //overlay
  temp = WL.Node.Select("//body");
  temp.appendChild(
    WL.Node.Hide(
      WL.Node.Create(
        "div",
        [
          ["id", "wl_overlay"],
          ["class", "overlay"],
        ],
        "",
        function () {
          WL.Node.Hide(WL.Node.Select('//div[@id="wl_overlayerror"]'));
          WL.Node.Hide(WL.Node.Select('//div[@id="wl_overlay"]'));
        }
      )
    )
  );
  temp.appendChild(
    WL.Node.Hide(
      WL.Node.Create("div", [
        ["id", "wl_overlayerror"],
        ["class", "floating alert_title"],
      ])
    )
  );
  WL.Estiah.Overlay = function (message) {
    WL.Node.Select('//div[@id="wl_overlayerror"]').setAttribute(
      "style",
      "left: 0px"
    );
    WL.Node.Select('//div[@id="wl_overlayerror"]').appendChild(message);
    WL.Node.Select('//div[@id="wl_overlayerror"]').appendChild(
      top.document.createElement("br")
    );
    var vx = window.pageXOffset;
    var vy = window.pageYOffset;
    var dw = window.innerWidth;
    var dh = window.innerHeight;
    var w = WL.Node.Select('//div[@id="wl_overlayerror"]').offsetWidth;
    var h = WL.Node.Select('//div[@id="wl_overlayerror"]').offsetHeight;
    var h2 = WL.Node.Select('//div[@class="wireframe_100"]').offsetHeight;
    WL.Node.Select('//div[@id="wl_overlayerror"]').setAttribute(
      "style",
      "left: " +
        Math.floor(dw / 2 - w / 2 + vx) +
        "px; top: " +
        Math.floor(dh / 2 - h / 2 + vy) +
        "px;"
    );
    WL.Node.Select('//div[@id="wl_overlay"]').setAttribute(
      "style",
      "top: 0px; left: 0px; width: " +
        (dw - 20) +
        "px; height: " +
        h2 +
        "px; opacity: 0.8;"
    );
  };

  //functions
  WL.Estiah.Page.Options = function () {
    var page, option, optiondiv;
    page = WL.Estiah.Page.New(
      "Options",
      "General options for AllInOne. Only change this if you are sure what you are doing. Unexpected behaviour expected!"
    );
    WL.Estiah.Show(page, allinone_name + " - Options - Estiah");
    for (option in WL.Globals.Options) {
      with (page.appendChild(
        WL.Node.Create("div", [
          ["class", "wireframe_addon_options common_content common_wm"],
          ["style", "width: 770px;"],
        ])
      )) {
        appendChild(
          WL.Node.Create("div", [["class", "paragraph_title c2"]], option)
        );
        appendChild(
          WL.Node.Create(
            "div",
            [["class", "paragraph_text"]],
            WL.Globals.Options[option]["Text"] +
              " (Default: " +
              WL.Globals.Options[option]["Default"] +
              (WL.Globals.Options[option]["ReadOnly"] === true
                ? " (ReadOnly)"
                : "") +
              ")"
          )
        );
        with (appendChild(
          WL.Node.Create("input", [
            ["class", "wl_options input bd1 c2"],
            ["style", "width: 100%;"],
            ["name", option],
            ["value", WL.Globals.Options[option]["Value"]],
          ])
        ))
          if (WL.Globals.Options[option]["ReadOnly"] === true)
            setAttribute("readonly", "readonly");
      }
    }
    page.firstChild.appendChild(
      WL.Button.Create("Reset", 1, function () {
        WL.Node.ForEach(
          '//input[@class="wl_options input bd1 c2"]',
          function (node) {
            WL.Globals.Options[node.name]["Value"] =
              WL.Globals.Options[node.name]["Default"];
            node.value = WL.Globals.Options[node.name]["Value"];
          }
        );
        WL.Options.Save();
        alert("Options reset!");
      })
    );
    page.firstChild.appendChild(
      WL.Button.Create("Save", 1, function () {
        WL.Node.ForEach(
          '//input[@class="wl_options input bd1 c2"]',
          function (node) {
            WL.Globals.Options[node.name]["Value"] = node.value;
          }
        );
        WL.Options.Save();
        alert("Options saved!");
      })
    );
  };
  WL.Estiah.Page.Addons = function () {
    //show addons
    var page, i, data, addon;
    page = WL.Estiah.Page.New(
      "Addons",
      "Below you can see all found addons with their options and dis- and enable them."
    );
    WL.Estiah.Show(page, allinone_name + " - Addons - Estiah");
    page.firstChild.appendChild(
      WL.Button.Create("Enable all", 3, function () {
        for (i = 0; i < WL.Globals.Addons.length; i++)
          WL.Data.Save(WL.Globals.Addons[i][0] + "_enabled", true);
        WL.Node.ForEach('//div[@class="button button_ic2"]', function (node) {
          WL.Node.Hide(node);
        });
        WL.Node.Show(this.parentNode.nextSibling);
        WL.Node.ForEach('//div[@class="button button_ic3"]', function (node) {
          WL.Node.Show(node);
        });
      })
    );
    page.firstChild.appendChild(
      WL.Button.Create("Disable all", 2, function () {
        for (i = 0; i < WL.Globals.Addons.length; i++)
          WL.Data.Save(WL.Globals.Addons[i][0] + "_enabled", false);
        WL.Node.ForEach('//div[@class="button button_ic3"]', function (node) {
          WL.Node.Hide(node);
        });
        WL.Node.Show(this.parentNode.previousSibling);
        WL.Node.ForEach('//div[@class="button button_ic2"]', function (node) {
          WL.Node.Show(node);
        });
      })
    );
    for (i = 0; i < WL.Globals.Addons.length; i++) {
      data = WL.Globals.Addons[i];
      with (page) {
        with (appendChild(
          WL.Node.Create("div", [
            ["class", "wireframe_addon_options common_content common_wm"],
            ["name", data[0]],
            ["style", "width: 770px;"],
          ])
        )) {
          appendChild(
            WL.Node.Create(
              "div",
              [["class", "paragraph_title c2"]],
              data[0] + " (v" + data[2] + ")&nbsp;"
            )
          );
          appendChild(
            WL.Node.Visibility(
              WL.Button.Create("Enable", 2, function () {
                WL.Data.Save(
                  this.parentNode.parentNode.getAttribute("name") + "_enabled",
                  true
                );
                WL.Node.Hide(this.parentNode);
                WL.Node.Show(this.parentNode.nextSibling);
              }),
              WL.Data.Load(data[0] + "_enabled") == false
            )
          );
          appendChild(
            WL.Node.Visibility(
              WL.Button.Create("Disable", 3, function () {
                WL.Data.Save(
                  this.parentNode.parentNode.getAttribute("name") + "_enabled",
                  false
                );
                WL.Node.Hide(this.parentNode);
                WL.Node.Show(this.parentNode.previousSibling);
              }),
              WL.Data.Load(data[0] + "_enabled") == true
            )
          );
          appendChild(
            WL.Node.Create("div", [["class", "paragraph_text"]], data[1])
          );
        }
      }
    }
  };
  WL.Estiah.Page.Changelog = function () {
    var changelog, page, version, change;
    changelog = JSON.parse(
      '{\
		"0.5.6": ["<strong>AllInOne:</strong> Added Firefox 17 compatibility"], \
		"0.5.5": ["<strong>DungeonLoot:</strong> There is never enough loot"], \
		"0.5.4": ["<strong>ExtraGears:</strong> Extragears page will look nice no matter where it was loaded from", "<strong>DungeonLoot:</strong> Even more big phat loot"], \
		"0.5.3": ["<strong>MessageBox:</strong> Displaying of avatars should now work in all Firefox versions", "<strong>SoulColor:</strong> Removed underscore that was displayed in very new firefox versions", "<strong>Reminder:</strong> Fixed bug with question marks in messages", "<strong>MultiGatherer:</strong> Increased default delay value to 500ms from now on. If you are having problems with MultiGatherer, set it to 500ms in the options.", "<strong>DungeonLoot:</strong> Added counter and highlight for missing charms", "<strong>ExtraGears:</strong> Added page for fast loading of ExtraGears"], \
		"0.5.2": ["<strong>AltsList:</strong> New addon", "<strong>ExtraGears:</strong> Importing of gears by charm names added", "<strong>DungeonLoot:</strong> Added link to show overall progress", "<strong>ExtraGears:</strong> Swapping to ExtraGears of alts added (needs AltsList)"], \
		"0.5.1": ["<strong>AdvancedReplay:</strong> Fixed Haunted Fang", "<strong>MultiGatherer:</strong> Recoded to hopefully eliminate rare bug", "<strong>AdvancedReplay:</strong> Shows the new statistics for mobs, too", "<strong>GuildHelper:</strong> Show character information for guild members", "<strong>DungeonLoot:</strong> Added Unbound", "<strong>AllInOne:</strong> Some other small improvements"], \
		"0.5.0": ["<strong>ExtraGears:</strong> Importing of gear strings now also works if the name and number of charms are omitted", "<strong>AdvancedReplay:</strong> Extended mod stealing to include all direct steals", "<strong>AdvancedReplay:</strong> More information on overtime effects", "<strong>AdvancedReplay:</strong> Stats on charm usage", "<strong>AttackAnyone:</strong> Compatible with Firefox 5", "<strong>AdvancedReplay:</strong> Also works if you are not logged in", "<strong>ExternalReplay:</strong> Also works if you are not logged in", "<strong>AdvancedReplay:</strong> I can see colors!"], \
		"0.4.10": ["<strong>AdvancedReplay:</strong> Bugfixes"], \
		"0.4.9": ["<strong>DungeonLoot:</strong> Added drops from the new dungeons", "<strong>ExternalReplay:</strong> Shows size before uploading"], \
		"0.4.8": ["<strong>MessageBox:</strong> Multisend will no longer refuse to send messages to certain characters", "<strong>ExtraGears:</strong> Added button to refresh mouseovers"], \
		"0.4.7": ["<strong>PaginationFix:</strong> New addon"], \
		"0.4.6": ["<strong>AdvancedReplay:</strong> Bugfix"], \
		"0.4.5": ["<strong>AdvancedReplay:</strong> Shows damage modifiers in mouseovers", "<strong>ExtraGears:</strong> Confirmation required when overwriting gears with a different name", "<strong>AllInOne:</strong> Added online ex-/import"], \
		"0.4.4": ["<strong>ExtraGears:</strong> Several small bugfixes", "<strong>ExternalReplay:</strong> Added uploading indicator"], \
		"0.4.3": ["<strong>DungeonLoot:</strong> Finally all dungeons included", "<strong>AdvancedReplay:</strong> Charm mouseover also works while the replay is running", "<strong>AllInOne:</strong> Ex-/Import page gives comfirmation alerts now"], \
		"0.4.2": ["<strong>ExtraGears:</strong> More bugfixes"], \
		"0.4.1": ["<strong>ExtraGears:</strong> Bugfixes"], \
		"0.4.0": ["<strong>SoulColor:</strong> Several small adjustments", "<strong>Reminder:</strong> Fixed a visibility bug", "<strong>MessageBox:</strong> Send button disappears for a short time after sending", "<strong>DungeonLoot:</strong> Shows the ID of [Unknown Charm]", "<strong>ColiResults:</strong> Now also works with pet fights", "<strong>ExtraGears:</strong> Complete overhaul", "<strong>MessageBox:</strong> Added possibility to send messages to new contacts and several contacts at once", "<strong>ExternalReplay: </strong> New addon: Allows you to share skirmishes/guild fights with others", "<strong>AttackAnyone:</strong> Compatibility fix for ExternalReplay", "<strong>DungeonLoot:</strong> Now with even more loot (This special offer might only be available for a short time!)"], \
		"0.3.11": ["<strong>FriendsList:</strong> No longer deletes all your friends just because you cast away one of them", "<strong>MultiGatherer:</strong> Changed to work with new Estiah patch", "<strong>AllInOne:</strong> BountyCheck moved to AllInOne menu", "<strong>DungeonLoot:</strong> Added The Darkened Streets, Cornered and Wall of Flames", "<strong>ColiResults:</strong> New addon: Hides coliseum results similar to guild fights (There is a slight delay so it works best if opened in a new tab)", "<strong>AllInOne:</strong> Put all options in a menu entry", "<strong>SoulColor:</strong> Fast jump to first and last page on PvP pagination"], \
		"0.3.10": ["<strong>AllInOne:</strong> Update screen", "<strong>DungeonLoot:</strong> Lots of new loot and charm information", "<strong>ExtraGears:</strong> Active gear stays selected when saving an ExtraGear", "<strong>AllInOne:</strong> BountyCheck on Character page"], \
		"0.3.9": ["<strong>DungeonLoot:</strong> Wikified the charms", "<strong>MessageBox:</strong> Fixed small bug when replying", "<strong>GuildHelper:</strong> New addon: Some help for managing guilds"], \
		"0.3.8": ["<strong>DungeonLoot:</strong> Loot table fixes and added the new dungeons", "<strong>ExtraGears:</strong> New button to instantly save an ExtraGear into active gear slot", "<strong>SoulColor:</strong> Now shows the gems after the rating so long names do not hide them", "<strong>MessageBox:</strong> New addon: More comfortable messaging"], \
		"0.3.7": ["<strong>DungeonLoot:</strong> Loot table fixed", "<strong>AutoUpdate:</strong> New addon: AutoUpdate..."], \
		"0.3.6": ["<strong>DungeonLoot:</strong> Several bugfixes"], \
		"0.3.5": ["<strong>ExtraGears:</strong> Bugfix when renaming ExtraGears again", "<strong>DungeonLoot:</strong> New addon: Shows dungeon loots in the dungeon and diary"], \
		"0.3.4": ["<strong>AdvancedReplay:</strong> Bugfix for armor/ward values exceeding maxhp"], \
		"0.3.3": ["<strong>AllInOne:</strong> Added ability to delete saved data", "<strong>AdvancedReplay:</strong> New addon: Shows armor/ward/willpower as numbers in every replay and allows you to jump to a certain turn", "<strong>ExtraGears:</strong> Shows the ExtraGears after the gear box", "<strong>ExtraGears:</strong> Loading of archived charms is now possible", "<strong>SoulColor:</strong> Gems are now removed when clicking [Fight]", "<strong>AttackAnyone:</strong> Compatibility fix for Advanced Replay"], \
		"0.3.2": ["<strong>AllInOne:</strong> Made it compatible with Firefox 3.0 again", "<strong>ExtraGears:</strong> Fixed small bug that happened when deleting extra gears"], \
		"0.3.1": ["<strong>CityView:</strong> Saved data from previous versions should work now", "<strong>AllInOne:</strong> Fixed small bug with the updatecheck"], \
		"0.3.0": ["Completely new version"]\
	}'
    );
    page = WL.Estiah.Page.New(
      "Update",
      "You successfully updated to version " + allinone_version + ". Changelog:"
    );
    WL.Estiah.Show(page, allinone_name + " - Update - Estiah");
    with (page.firstChild.appendChild(WL.Node.Create("div"))) {
      for (version in changelog) {
        with (appendChild(
          WL.Node.Create("div", [
            ["style", "width: 700px; margin-bottom: 10px;"],
          ])
        )) {
          appendChild(
            WL.Node.Create(
              "a",
              [],
              "<strong>" + version + ":</strong>",
              function () {
                WL.Node.Visibility(this.nextSibling);
              }
            )
          );
          with (appendChild(WL.Node.Hide(WL.Node.Create("ul")))) {
            for (change in changelog[version])
              appendChild(WL.Node.Create("li", [], changelog[version][change]));
          }
        }
      }
      appendChild(
        WL.Node.Create(
          "div",
          [],
          'For more information or to leave your feedback, visit the <a href="http://forum.estiah.com/index.php?topic=3554.0">AllInOne-Forum-Thread</a>'
        )
      );
    }
    //click newest
    WL.Node.Click(page.firstChild.lastChild.firstChild.firstChild);
  };
  WL.Estiah.Page.Export = function () {
    var page,
      format,
      tab,
      exporttab,
      exportlist,
      entry,
      input,
      importtab,
      select;
    WL.CSS.Add(
      ".exporttab { margin-left: 8px; } .exportlist .export .box { width: 20px; } .exportlist .export .name { width: 200px; }"
    );
    page = WL.Estiah.Page.New("Data Ex-/Import", "Ex- and import your data.");
    WL.Estiah.Show(page, allinone_name + " - Ex-/Import - Estiah");
    with (page.firstChild) {
      with (appendChild(WL.Node.Create("div"))) {
        appendChild(WL.Node.Create("div")).appendChild(
          WL.Node.Create("textarea", [
            ["id", "wl_import"],
            ["class", "c2 bd1 textarea"],
            ["cols", "90"],
            ["rows", "10"],
          ])
        );
        appendChild(
          WL.Button.Create("Export", 1, function () {
            //export
            var vars, data, name;
            vars = GM_listValues();
            data = [];
            while ((name = vars.shift()))
              data.push(new Array(name, WL.Data.Load(name)));
            WL.Node.Select('//textarea[@id="wl_import"]').value =
              JSON.stringify(data);
            alert("Data exported");
          })
        );
        appendChild(
          WL.Button.Create("Import", 1, function () {
            //import
            var data, pair;
            data = JSON.parse(
              WL.Node.Select('//textarea[@id="wl_import"]').value
            );
            while ((pair = data.shift())) WL.Data.Save(pair[0], pair[1]);
            alert("Data imported");
          })
        );
        appendChild(
          WL.Button.Create("Delete", 1, function () {
            //delete
            var vars, data, name;
            vars = GM_listValues();
            if (
              confirm(
                "This will delete all saved data from AllInOne and can't be undone. Are you sure?"
              ) === true
            )
              while ((name = vars.shift())) WL.Data.Delete(name);
            alert("Data deleted");
          })
        );
      }
      with (appendChild(WL.Node.Create("div"))) {
        with (appendChild(WL.Node.Create("div"))) {
          innerHTML = "Online storage password: ";
          appendChild(
            WL.Node.Create("input", [
              ["id", "wl_password"],
              ["class", "input bd1 c2"],
              ["type", "text"],
              ["value", WL.Globals.Options.Password.Value],
            ])
          );
        }
        appendChild(WL.Node.Create("br"));
        appendChild(
          WL.Button.Create("Create online storage", 1, function () {
            //online create
            var vars, data, name;
            WL.Data.Get(
              allinone_server + "/create",
              function (responseDetails) {
                var pw = responseDetails.responseText;
                WL.Node.Select('//input[@id="wl_password"]').value = pw;
                if (confirm("Password created, store it in options?")) {
                  WL.Globals.Options["Password"]["Value"] = pw;
                  WL.Options.Save();
                }
              }
            );
          })
        );
        appendChild(
          WL.Button.Create("Export to storage", 1, function () {
            //online export
            var vars, data, name;
            vars = GM_listValues();
            data = [];
            while ((name = vars.shift())) {
              //do not export messagebox
              if (name.indexOf("MessageBox") == 0) continue;
              //do not export password
              if (name.indexOf("Options_Password") == 0) continue;
              data.push(new Array(name, WL.Data.Load(name)));
            }
            WL.Data.Post(
              allinone_server +
                "export/" +
                WL.Node.Select('//input[@id="wl_password"]').value,
              "json=" + encodeURIComponent(JSON.stringify(data)),
              function (responseDetails) {
                alert(responseDetails.responseText);
              }
            );
          })
        );
        appendChild(
          WL.Button.Create("Import from storage", 1, function () {
            //online import
            WL.Data.Get(
              allinone_server +
                "import/" +
                WL.Node.Select('//input[@id="wl_password"]').value,
              function (responseDetails) {
                var data, pair;
                data = JSON.parse(responseDetails.responseText);
                while ((pair = data.shift())) WL.Data.Save(pair[0], pair[1]);
                alert("Data imported");
              }
            );
          })
        );
      }
    }
  };

  //menu
  WL.CSS.Add(".gm_menu_entry:hover div { display:block !important; }");
  temp = WL.Node.Select('//div[@class="wireframe_menu format"]');
  temp.appendChild(WL.Node.Create("div", [["class", "separatorh bd1"]]));
  temp = temp.appendChild(
    WL.Node.Create("div", [["class", "entry gm_menu_entry"]])
  );
  temp.appendChild(
    WL.Node.Create(
      "a",
      [
        ["id", "wl_menu"],
        ["class", "nolink"],
      ],
      allinone_name,
      WL.Estiah.Page.Addon
    )
  );
  temp = temp.appendChild(
    WL.Node.Hide(
      WL.Node.Create("div", [
        ["class", "bd1 bg1 dropdown floating"],
        ["style", "width: 150px;"],
      ])
    )
  );
  WL.Globals.Menu = temp.appendChild(
    WL.Node.Create("div", [
      ["id", "wl_dropdown"],
      ["class", "row separator bd1"],
    ])
  );

  //bounty
  temp = temp.appendChild(WL.Node.Create("div", [["class", "row"]]));
  temp.appendChild(WL.Node.Create("div", [["class", "left"]])).appendChild(
    WL.Node.Create("a", [["class", "nolink"]], "Bounty", function () {
      WL.Data.Post(
        allinone_server + "bounty.php",
        "id=" + WL.Globals.PlayerID,
        function (responseDetails) {
          WL.Node.Select('//div[@id="wl_bounty"]').innerHTML =
            responseDetails.responseText + "g";
        }
      );
    })
  );
  temp.appendChild(
    WL.Node.Create("div", [
      ["id", "wl_bounty"],
      ["class", "right"],
    ])
  );

  //updatecheck
  temp = temp.appendChild(WL.Node.Create("div", [["class", "row"]]));
  temp.appendChild(WL.Node.Create("div", [["class", "left"]])).appendChild(
    WL.Node.Create(
      "a",
      [
        ["id", "wl_version"],
        ["class", "nolink"],
      ],
      "Version",
      function () {
        var menu = WL.Node.Select('//a[@id="wl_menu"]');
        switch (menu.getAttribute("class")) {
          //not checked
          case "nolink":
            WL.Data.Get(
              allinone_server + "version.txt?r=" + Math.random(),
              function (responseDetails) {
                if (responseDetails.responseText != allinone_version) {
                  WL.Node.Select('//a[@id="wl_version"]').innerHTML =
                    "Download " + responseDetails.responseText;
                  menu.setAttribute("class", "nolink disabled");
                } else menu.setAttribute("class", "nolink enabled");
              }
            );
            break;
          //update
          case "nolink disabled":
            menu.setAttribute("class", "nolink");
            window.location.href =
              allinone_server +
              "estiah_-_allinone." +
              this.innerHTML.substring(9) +
              ".user.js";
            break;
          //no update
          default:
            break;
        }
      }
    )
  );
  temp.appendChild(
    WL.Node.Create("div", [["class", "right"]], allinone_version)
  );

  //menuentries
  WL.Addon.MenuEntry("Options", WL.Estiah.Page.Options);
  WL.Addon.MenuEntry("Addons", WL.Estiah.Page.Addons);
  WL.Addon.MenuEntry("Changelog", WL.Estiah.Page.Changelog);
  WL.Addon.MenuEntry("Ex-/Import", WL.Estiah.Page.Export);

  if (WL.Data.Load(allinone_name + "_version") != allinone_version) {
    WL.Data.Save(allinone_name + "_version", allinone_version);
    WL.Estiah.Page.Changelog();
  }

  ////////////////////////////////////////////////////////////////
  //autoupdate
  ////////////////////////////////////////////////////////////////

  //info
  var autoupdate_name = "AutoUpdate";
  var autoupdate_version = "0.4.0";
  WL.Addon.Register(
    autoupdate_name,
    "This addon allows you to always have the newest AllInOne version.",
    autoupdate_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(autoupdate_name + "_enabled")) {
    temp = new Date().getDate();
    if (WL.Data.Load(autoupdate_name + "_lastcheck") != temp) {
      WL.Data.Get(
        allinone_server + "version.txt?r=" + temp,
        function (responseDetails) {
          if (responseDetails.responseText != allinone_version)
            if (
              confirm(
                "New AllInOne version (" +
                  responseDetails.responseText +
                  ") available. Download?"
              ) === true
            )
              window.location.href =
                allinone_server +
                "estiah_-_allinone." +
                responseDetails.responseText +
                ".user.js";
        }
      );
      WL.Data.Save(autoupdate_name + "_lastcheck", temp);
    }
  }

  ////////////////////////////////////////////////////////////////
  //paginationfix
  ////////////////////////////////////////////////////////////////

  //info
  var paginationfix_name = "PaginationFix";
  var paginationfix_version = "0.4.7";
  WL.Addon.Register(
    paginationfix_name,
    "This addon allows you to use pagination.",
    paginationfix_version,
    "WL"
  );

  //functions
  WL.Pagination = {};
  WL.Pagination.GetType = function () {
    var l = 21;
    if (window.location.href.substring(l, l + 4) == "/pvp") return "pvp";
    if (window.location.href.substring(l, l + 10) == "/user/list")
      return "players";
    if (window.location.href.substring(l, l + 11) == "/guild/list")
      return "guilds";
  };
  WL.Pagination.GetPage = function () {
    if ((a = window.location.href.indexOf("/page/")) > -1)
      if ((b = window.location.href.indexOf("/", a + 6)) > -1)
        return parseInt(window.location.href.substring(a + 6, b));
      else return parseInt(window.location.href.substring(a + 6));
    else return 1;
  };
  WL.Pagination.GetLink = function (type) {
    switch (type) {
      case "pvp":
        return "";
      case "guilds":
        return "/guild/list/index/page/";
      case "players":
        return "/user/list/index/page/";
    }
  };
  WL.Pagination.GetSort = function () {
    if ((a = window.location.href.indexOf("/sort")) > -1)
      return window.location.href.substring(a);
    else return "";
  };
  WL.Pagination.CreateLink = function (link, page, sort) {
    if (link == "")
      return WL.Node.Create("a", [["class", "index"]], page, function () {
        WL.Node.Select('//input[@id="VsFormIndex"]').value = page;
        WL.Script.Run("VsList.change()");
      });
    else
      return WL.Node.Create(
        "a",
        [
          ["href", link + page + sort],
          ["class", "index"],
        ],
        page
      );
  };
  WL.Pagination.Create = function (type, pagecur, pagemax) {
    var pagemax2, pagination, link, sort;
    if (pagemax === undefined) {
      pagemax = "?";
      pagemax2 = pagecur + 3;
    } else pagemax2 = pagemax;
    pagination = WL.Node.Create("div", [["class", "pagination"]]);
    link = WL.Pagination.GetLink(type);
    sort = WL.Pagination.GetSort();
    with (pagination) {
      if (pagecur != 1) appendChild(WL.Pagination.CreateLink(link, 1, sort));
      if (pagecur > 3)
        appendChild(WL.Pagination.CreateLink(link, pagecur - 2, sort));
      if (pagecur > 2)
        appendChild(WL.Pagination.CreateLink(link, pagecur - 1, sort));
      appendChild(
        WL.Node.Create("span", [["class", "c2 index"]], "[" + pagecur + "]")
      );
      if (pagecur < pagemax2 - 1)
        appendChild(WL.Pagination.CreateLink(link, pagecur + 1, sort));
      if (pagecur < pagemax2 - 2)
        appendChild(WL.Pagination.CreateLink(link, pagecur + 2, sort));
      if (pagemax != "?" && pagecur < pagemax2)
        appendChild(WL.Pagination.CreateLink(link, pagemax, sort));
      appendChild(document.createTextNode("(" + pagemax + " pages)"));
    }
    return pagination;
  };

  //addon
  if (WL.Data.Load(paginationfix_name + "_enabled")) {
    if ((pagination = WL.Node.Select('//div[@class="pagination"]'))) {
      //getpagecount
      var text, pages;
      text = pagination.lastChild.data;
      pages = text.substring(text.indexOf("(") + 1, text.indexOf(" pages"));
      WL.Data.Save(paginationfix_name + "_pages", pages);
    } else {
      var type, pagecur, pagination, node;
      type = WL.Pagination.GetType();
      pagecur = WL.Pagination.GetPage();
      pagemax = WL.Data.Load(paginationfix_name + "_pages", undefined);
      pagination = WL.Pagination.Create(type, pagecur, pagemax);
      switch (type) {
        case "guilds":
          node = WL.Node.Select(
            '//div[@class="guildlist section_list format"]/div[@class="guild header_label"]'
          );
          node.parentNode.insertBefore(pagination, node);
          break;
        case "players":
          node = WL.Node.Select(
            '//div[@class="playerlist section_list format"]/div[@class="player header_label"]'
          );
          node.parentNode.insertBefore(pagination, node);
          break;
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  //cityview
  ////////////////////////////////////////////////////////////////

  //info
  var cityview_name = "CityView";
  var cityview_version = "0.4.0";
  WL.Addon.Register(
    cityview_name,
    "This addon allows you to see your discovered sites in the city view.",
    cityview_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(cityview_name + "_enabled")) {
    if (top.document.title == "City - Estiah") {
      if (WL.Estiah.GetCityID(true) == WL.Estiah.GetCityID()) {
        //save discovered sites
        var events = "";
        WL.Node.ForEach('//div[@class="site"]', function (node) {
          events +=
            WL.Globals.Options.Split.Value +
            WL.Node.Stringify(
              'div[@class="name highlight BV_system_highlight"]',
              node
            ).replace(/[ \n]{2,}/g, ";") +
            WL.Node.Count('div/div[@class="misc_star star_gold"]', node);
          //temp = WL.Node.Select('div/div[@class="functions"]/*', node);
          //GM_log((temp !== null ? temp.innerHTML : ""));
        });
        WL.Data.Save(
          cityview_name +
            "_city_" +
            WL.Estiah.GetCityID() +
            "_" +
            WL.Globals.PlayerID,
          events + WL.Globals.Options.Split.Value
        );
      } else {
        //load discovered sites
        temp = WL.Node.Create("div", [
          ["class", "sitelist section_text format"],
        ]);
        if (
          !WL.List.ForEach(
            cityview_name +
              "_city_" +
              WL.Estiah.GetCityID(true) +
              "_" +
              WL.Globals.PlayerID,
            function (item) {
              event = item.split(";").reverse();
              var stars = "";
              for (j = 0; j < event[0]; j++)
                stars += '<div class="misc_star star_gold"></div>';
              temp.innerHTML +=
                '<div class="site"><div class="score">' +
                stars +
                '</div><div class="name highlight BV_system_highlight"><div class="functions"><span class="lhp">' +
                event[2] +
                "</span></div>" +
                event[1] +
                "</div></div>";
            }
          )
        )
          temp.innerHTML += "Events not saved yet!";
        WL.Node.Select(
          '//div[@class="wireframe_city common_content common_wl"]'
        )
          .appendChild(
            WL.Node.Create(
              "div",
              [["class", "wireframe_city_site common_content"]],
              '<div class="paragraph_title c2">Discovered Sites</div>'
            )
          )
          .appendChild(temp);
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  //attackanyone
  ////////////////////////////////////////////////////////////////

  //info
  var attackanyone_name = "AttackAnyone";
  var attackanyone_version = "0.5.0";
  WL.Addon.Register(
    attackanyone_name,
    "This addon allows you to attack players from the inspect page.",
    attackanyone_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(attackanyone_name + "_enabled")) {
    if (
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 11
      ) ==
        WL.Globals.Options.Domain.Value + "/character/" &&
      !isNaN(
        parseInt(
          window.location.href.substring(
            WL.Globals.Options.Domain.Value.length + 11
          )
        )
      )
    ) {
      //add attack tab
      var temp = WL.Node.Hide(
        WL.Node.Create("div", [
          ["id", "TabContentInspectAttack"],
          ["class", "comm BV_tab_content"],
        ])
      );
      WL.Node.Select('//div[@class="common_tabcontent bd1 bg1"]').appendChild(
        temp
      );
      WL.Node.Select('//div[@class="common_tab"]').appendChild(
        WL.Node.Create(
          "a",
          [["class", "tab bd1 BV_tab_index"]],
          "Attack",
          function () {
            //show attack tab
            var attacktab = WL.Node.Select(
              '//div[@id="TabContentInspectAttack"]'
            );
            WL.Node.Select(
              '//div[@class="common_tab"]/a[contains(@class, "current")]'
            ).setAttribute("class", "tab bd1 BV_tab_index");
            this.setAttribute("class", "tab bd1 BV_tab_index current bg1");
            WL.Node.Hide(
              WL.Node.Select(
                '//div[@class="comm BV_tab_content" and (@style="" or not(@style))]'
              )
            );
            WL.Node.Show(attacktab);
            if (attacktab.innerHTML != "") return;
            //!
            WL.Data.Get(
              WL.Globals.Options.Domain.Value + "/pvp",
              function (responseDetails) {
                //insert content into attack tab
                var mobid, pvppage;
                mobid = parseInt(
                  window.location.href.substring(
                    WL.Globals.Options.Domain.Value.length + 11
                  )
                );
                pvppage = WL.Node.Create(
                  "div",
                  [],
                  responseDetails.responseText
                );
                var vers = WL.Node.Select("//head")
                  .appendChild(
                    WL.Node.Select(
                      '//link[contains(@href, "city.css")]',
                      pvppage
                    )
                  )
                  .getAttribute("href")
                  .substring(13);
                WL.Node.Select("//body")
                  .appendChild(
                    WL.Node.Create("script", [
                      ["src", "/js/battle.js" + vers],
                      ["type", "text/javascript"],
                      ["charset", "utf-8"],
                    ])
                  )
                  .addEventListener(
                    "load",
                    function () {
                      //load advanced replay
                      WL.Estiah.Battle.Init();
                    },
                    false
                  );
                attacktab.innerHTML = "";
                attacktab.appendChild(
                  WL.Node.Select('//div[@id = "VsConfig"]/..', pvppage)
                );
                attacktab.appendChild(
                  WL.Node.Create(
                    "a",
                    [
                      ["href", "/json/pvp/match/index/mob/" + mobid],
                      ["onclick", "return false;"],
                      ["id", "MobFight" + mobid],
                      ["class", "c2 nolink func BV_vslist_fight"],
                    ],
                    "[Fight]"
                  )
                );
                WL.Node.Select(
                  '//div[contains(@class, "wireframe_player_inspect common_content common_wl")]'
                ).setAttribute("style", "width: 803px;");
                WL.Node.ForEach(
                  '//div[@class = "wireframe_pvp common_content common_wl"]/*[(@class != "heading_text" and @class != "z3 format" and @class != "moblist format") or not(@class)]',
                  function (node) {
                    attacktab.appendChild(node);
                  },
                  pvppage
                );
                WL.Estiah.ExternalReplay(attacktab);
              }
            );
            attacktab.innerHTML =
              WL.Globals.Options.Loading.Value + " loading PvP interface...";
          }
        )
      );
    }
  }

  ////////////////////////////////////////////////////////////////
  //multigatherer
  ////////////////////////////////////////////////////////////////

  //info
  var multigatherer_name = "MultiGatherer";
  var multigatherer_version = "0.5.1";
  WL.Addon.Register(
    multigatherer_name,
    "This addon allows you to gather multiple times with one click.",
    multigatherer_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(multigatherer_name + "_enabled")) {
    if (top.document.title == "Gathering - Estiah") {
      //create input/output
      temp = WL.Node.Select(
        '//div[@class="wireframe_gathering common_content common_wl"]/div[@class="heading_text"]'
      );
      temp.innerHTML += " Gathering attempts: ";
      temp.appendChild(
        WL.Node.Create("input", [
          ["id", "wl_multigatherer_input"],
          ["class", "input bd1 c2"],
          ["size", "1"],
          ["maxlength", "3"],
          ["value", "1"],
        ])
      );
      temp = WL.Node.Select('//div[@id="GatheringMsg"]');
      temp.parentNode.appendChild(
        WL.Node.Hide(
          WL.Node.Create("div", [
            ["id", "wl_multigatherer_output"],
            ["class", "outline"],
          ])
        )
      );
      //new gathering message/gather again
      WL.Node.ForEachNew(temp, function () {
        var msg, input;
        msg = WL.Node.Select('//div[@id="GatheringMsg"]').cloneNode(true);
        msg.removeAttribute("id");
        WL.Node.Show(
          WL.Node.Select('//div[@id="wl_multigatherer_output"]')
        ).insertBefore(
          msg,
          WL.Node.Select('//div[@id="wl_multigatherer_output"]').firstChild
        );
        input = WL.Node.Select('//input[@id="wl_multigatherer_input"]');
        if (input.value > 1) {
          input.value--;
          WL.Node.Click(
            WL.Node.Select(
              '//div[not(@id) and @class="gatherlist section_text format"]/div/div/a'
            )
          );
        }
      });
    }
  }

  ////////////////////////////////////////////////////////////////
  //reminder
  ////////////////////////////////////////////////////////////////

  //info
  var reminder_name = "Reminder";
  var reminder_version = "0.4.0";
  WL.Addon.Register(
    reminder_name,
    "This addon allows you to trigger alerts when certain conditions are met.",
    reminder_version,
    "WL"
  );

  //functions
  WL.Estiah.Page.Reminder = function () {
    //reminder page
    var page, addtrigger, select, i;
    WL.CSS.Add(
      ".triggerlist .trigger .delete { width: 20px; } .triggerlist .trigger .city { width: 100px; margin: 0 0 0 0; } .triggerlist .trigger .page { width: 100px; } .triggerlist .trigger .message { width: 530px; } .triggerlist .header_label { margin: 16px 0 0 0; height: 14px; overflow: hidden; width: 100%; } .triggerlist .trigger .header { margin-top: 0; font-size: 10px; font-weight: bold; }"
    );
    WL.Estiah.Pages = [
      "Every Page",
      "Character",
      "City",
      "Guild",
      "Inventory",
      "Job",
      "Player Versus Player",
    ];
    page = WL.Estiah.Page.New("Reminder", "Create triggers");
    WL.Estiah.Show(page, allinone_name + " - Reminder - Estiah");
    //form to add triggers
    addtrigger = page.firstChild.appendChild(WL.Node.Create("div"));
    select = addtrigger
      .appendChild(WL.Node.Create("div", [["class", "value"]]))
      .appendChild(WL.Node.Create("select", [["id", "wl_reminder_city"]]));
    for (i = 0; i < WL.Estiah.Cities.length; i++)
      select.appendChild(
        WL.Node.Create("option", [["value", "" + i]], WL.Estiah.Cities[i])
      );
    addtrigger.appendChild(
      WL.Node.Hide(
        WL.Node.Create("input", [
          ["id", "wl_reminder_other"],
          ["class", "input bd1 c2"],
        ])
      )
    );
    select = addtrigger
      .appendChild(WL.Node.Create("div", [["class", "value"]]))
      .appendChild(WL.Node.Create("select", [["id", "wl_reminder_page"]]));
    for (i = 0; i < WL.Estiah.Pages.length; i++)
      select.appendChild(WL.Node.Create("option", [], WL.Estiah.Pages[i]));
    select.appendChild(
      WL.Node.Create("option", [], "other...", function () {
        if (this.value == "other...") {
          WL.Node.Hide(this);
          var input = WL.Node.Select('//input[@id="wl_reminder_other"]');
          WL.Node.Show(input);
          input.focus();
        }
      })
    );
    select.addEventListener(
      "change",
      function () {
        if (this.value == "other...") {
          WL.Node.Hide(this);
          var input = WL.Node.Select('//input[@id="wl_reminder_other"]');
          WL.Node.Show(input);
          input.focus();
        }
      },
      false
    );
    addtrigger
      .appendChild(
        WL.Node.Create("input", [
          ["id", "wl_reminder_msg"],
          ["class", "input bd1 c2"],
        ])
      )
      .addEventListener(
        "focus",
        function () {
          WL.Node.Select('//a[@id="wl_reminder_add"]').innerHTML =
            "Add trigger";
        },
        false
      );
    addtrigger.parentNode.appendChild(
      WL.Button.Create(
        "Add trigger",
        1,
        function () {
          //add trigger
          var name, id;
          name =
            WL.Node.Select('//select[@id="wl_reminder_city"]').value +
            "_" +
            (WL.Node.Select('//select[@id="wl_reminder_page"]').value ==
            "other..."
              ? WL.Node.Select('//input[@id="wl_reminder_other"]').value
              : WL.Node.Select('//select[@id="wl_reminder_page"]').value);
          id =
            name + "_" + WL.Node.Select('//input[@id="wl_reminder_msg"]').value;
          WL.List.Insert(reminder_name + "_trigger_" + WL.Globals.PlayerID, id);
          WL.Estiah.Trigger(id);
          WL.Node.Hide(WL.Node.Select('//input[@id="wl_reminder_other"]'));
          WL.Node.Show(WL.Node.Select('//select[@id="wl_reminder_page"]'));
          this.innerHTML = "Trigger added";
        },
        "wl_reminder_add"
      )
    );
    //show triggers
    page.firstChild.appendChild(
      WL.Node.Create(
        "div",
        [
          ["id", "wl_reminder_trigger"],
          ["class", "triggerlist section_list format"],
        ],
        '<div class="trigger header_label"><div class="delete header">Del</div><div class="city header">City</div><div class="page header">Page</div><div class="message header">Message</div></div>'
      )
    );
    WL.List.ForEach(
      reminder_name + "_trigger_" + WL.Globals.PlayerID,
      function (item) {
        WL.Estiah.Trigger(item);
      }
    );
  };
  WL.Estiah.Trigger = function (id) {
    //show trigger
    var conditions, trigger;
    conditions = id.split("_", 3);
    trigger = WL.Node.Create("div", [["class", "trigger entry"]]);
    trigger
      .appendChild(WL.Node.Create("div", [["class", "delete"]]))
      .appendChild(
        WL.Node.Create("a", [["class", "c2 nolink"]], "[X]", function () {
          WL.List.Delete(reminder_name + "_trigger_" + WL.Globals.PlayerID, id);
          WL.Node.Remove(this.parentNode.parentNode);
        })
      );
    trigger.appendChild(
      WL.Node.Create(
        "div",
        [["class", "city"]],
        WL.Estiah.Cities[conditions[0]]
      )
    );
    trigger.appendChild(
      WL.Node.Create("div", [["class", "page"]], conditions[1])
    );
    trigger.appendChild(
      WL.Node.Create("div", [["class", "message"]], conditions[2])
    );
    WL.Node.Select('//div[@id="wl_reminder_trigger"]').appendChild(trigger);
  };

  //addon
  if (WL.Data.Load(reminder_name + "_enabled")) {
    WL.Addon.MenuEntry("Reminder", WL.Estiah.Page.Reminder);
    WL.List.ForEach(
      reminder_name + "_trigger_" + WL.Globals.PlayerID,
      function (item) {
        //test if trigger matches
        var cond = item.split("_", 3);
        if (
          (cond[0] == 0 || cond[0] == WL.Estiah.GetCityID()) &&
          (cond[1] == "Every Page" ||
            (cond[1] + " - Estiah").toLowerCase() ==
              top.document.title.toLowerCase())
        )
          if (cond.length > 2) {
            var reminder = WL.Node.Create("div");
            reminder.appendChild(
              WL.Node.Create(
                "a",
                [["class", "c2 nolink"]],
                "[X] " + cond[2],
                function () {
                  WL.List.Delete(
                    reminder_name + "_trigger_" + WL.Globals.PlayerID,
                    item
                  );
                  WL.Node.Remove(this.parentNode);
                }
              )
            );
            WL.Estiah.Overlay(reminder);
          }
      }
    );
  }

  ////////////////////////////////////////////////////////////////
  //coliseumgears
  ////////////////////////////////////////////////////////////////

  //info
  var coliseumgears_name = "ColiseumGears";
  var coliseumgears_version = "0.4.0";
  WL.Addon.Register(
    coliseumgears_name,
    "This addon allows you to select gears as standard coliseum gears.",
    coliseumgears_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(coliseumgears_name + "_enabled")) {
    if (top.document.title == "Gear - Estiah") {
      WL.CSS.Add(".decklist .deck .name { width:57% !important; }");
      //add buttons
      WL.Node.ForEach('//div[@class="deck highlight"]', function (node, deck) {
        for (var number = 1; number < 4; number++)
          node.appendChild(
            WL.Node.Create(
              "a",
              [
                ["id", "wl_coliseumgears_" + number + deck],
                [
                  "class",
                  "func_sec " +
                    (WL.Data.Load(
                      coliseumgears_name +
                        "_coli_" +
                        number +
                        "_" +
                        WL.Globals.PlayerID,
                      -1
                    ) == deck
                      ? "c2"
                      : "lhp"),
                ],
              ],
              number,
              function () {
                WL.Node.Select(
                  '//a[@id="wl_coliseumgears_' +
                    this.innerHTML +
                    WL.Data.Load(
                      coliseumgears_name +
                        "_coli_" +
                        this.innerHTML +
                        "_" +
                        WL.Globals.PlayerID,
                      deck
                    ) +
                    '"]'
                ).setAttribute("class", "func_sec lhp");
                WL.Data.Save(
                  coliseumgears_name +
                    "_coli_" +
                    this.innerHTML +
                    "_" +
                    WL.Globals.PlayerID,
                  deck
                );
                this.setAttribute("class", "func_sec c2");
              }
            )
          );
      });
    }
    if (
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 22
      ) ==
      WL.Globals.Options.Domain.Value + "/pvp/coliseum/room/id/"
    ) {
      //select coliseumgear
      var coligear = WL.Data.Load(
        coliseumgears_name +
          "_coli_" +
          window.location.href.substring(
            WL.Globals.Options.Domain.Value.length + 22
          ) +
          "_" +
          WL.Globals.PlayerID,
        -1
      );
      if (coligear != -1)
        top.document.forms[0].elements[0].selectedIndex = coligear;
    }
  }

  ////////////////////////////////////////////////////////////////
  //exchangerates
  ////////////////////////////////////////////////////////////////

  //info
  var exchangerates_name = "ExchangeRates";
  var exchangerates_version = "0.4.0";
  WL.Addon.Register(
    exchangerates_name,
    "This addon allows you to see the exchange rates in you inventory next to every item.",
    exchangerates_version,
    "WL"
  );

  //functions
  WL.Estiah.GetColor = function (rate) {
    var red, green, blue;
    if (rate <= 90) red = 0;
    else {
      if (rate >= 110) red = 255;
      else red = Math.floor(((rate - 90) * 255) / 20);
    }
    if (rate <= 50 || rate >= 130) green = 0;
    else {
      if (rate >= 70 && rate <= 110) green = 255;
      else green = Math.floor(((40 - Math.abs(90 - rate)) * 255) / 20);
    }
    if (rate <= 70) blue = 255;
    else {
      if (rate >= 90) blue = 0;
      else blue = Math.floor(((90 - rate) * 255) / 20);
    }
    return "rgb(" + red + ", " + green + ", " + blue + ")";
  };

  //addon
  if (WL.Data.Load(exchangerates_name + "_enabled")) {
    if (top.document.title == "Inventory - Estiah") {
      //get exchange rates
      var erates = ["0"];
      WL.Node.ForEach(
        '//a[@href="/market"]/../../../div/div/span/../../div[contains(@class, "right")]',
        function (node) {
          erates.push(node.innerHTML.substring(0, node.innerHTML.indexOf("%")));
        }
      );
      //show exchange rates
      WL.Node.ForEach(
        '//div[@class="inventory format"]/div/div[@class="functions"]',
        function (node) {
          var rate =
            erates[
              node.parentNode
                .getAttribute("class")
                .substring(
                  23,
                  node.parentNode
                    .getAttribute("class")
                    .indexOf(" PT_picker_all")
                )
            ];
          node.insertBefore(
            WL.Node.Create(
              "div",
              [["style", "color: " + WL.Estiah.GetColor(rate)]],
              "(" + rate + "%)"
            ),
            node.firstChild
          );
        }
      );
    }
  }

  ////////////////////////////////////////////////////////////////
  //friendslist
  ////////////////////////////////////////////////////////////////

  //info
  var friendslist_name = "FriendsList";
  var friendslist_version = "0.4.0";
  WL.Addon.Register(
    friendslist_name,
    "This addon allows you to view your friends on a new page.",
    friendslist_version,
    "WL"
  );

  //functions
  WL.Estiah.Page.Friends = function () {
    //show friends page
    var page, friendslist;
    WL.CSS.Add(
      ".friendlist .friend .delete { width: 20px; margin: 12px 12px 0 0; } .friendlist .friend .avatar, .friendlist .friend .avatar img { width: 35px; height: 35px; } .friendlist .friend .name { width: 140px; font-size: 12px; margin: 2px 10px 0 8px; } .friendlist .friend .level { width: 30px; font-size: 18px; font-weight: bold; text-align:center; margin: 8px 8px 0 0; } .friendlist .friend .class { width: 90px; margin: 8px 0 0 0; } .friendlist .friend .city { width: 100px; margin: 8px 0 0 0; } .friendlist .friend .hp { width: 70px; margin: 8px 0 0 0; } .friendlist .friend .rating { width: 50px; margin: 8px 0 0 0; } .friendlist .friend .match { width: 100px; margin: 2px 0 0 0; font-size:11px; } .friendlist .header_label { margin: 16px 0 0 0; height: 14px; overflow: hidden; width: 100%; } .friendlist .friend .header { margin-top: 0; font-size: 10px; font-weight: bold; } .friendlist .tier0 { color: #CCCCCC; } .friendlist .tier1 { color: #CC9933; } .friendlist .tier2 { color: #EE6622; } .friendlist .tier3 { color: #FF4105; }"
    );
    page = WL.Estiah.Page.New(
      "Friends",
      "Look up your friends, and see who's the best in the world of Estiah. This page only shows your friends."
    );
    WL.Estiah.Show(page, allinone_name + " - Friends - Estiah");
    friendslist = page.firstChild.appendChild(
      WL.Node.Create(
        "div",
        [["class", "friendlist section_list format"]],
        '<div class="friend header_label"><div class="delete header">Del</div><div class="level header">Lv</div><div class="avatar"></div><div class="name header">Name</div><div class="class header">Class</div><div class="hp header">HP</div><div class="match header">Weekly PvP</div><div class="rating header">Rating</div><div class="class header">Guild</div><div class="city header">Location</div>'
      )
    );
    WL.List.ForEach(friendslist_name + "_friends", function (id) {
      //get friends info
      WL.Data.Get(
        WL.Globals.Options.Domain.Value + "/json/character/" + id,
        function (responseDetails) {
          var data, entry;
          data = JSON.parse(responseDetails.responseText);
          data["class"] =
            data["class"].substring(0, 1).toUpperCase() +
            data["class"].substring(1);
          if (id == 32917) data["class"] = WL.Sheira.Class;
          //create entry
          entry = WL.Node.Create("div", [["class", "friend entry"]]);
          entry.appendChild(
            WL.Node.Create("div", [["class", "delete"]]).appendChild(
              WL.Node.Create("a", [["class", "c2 nolink"]], "[X]", function () {
                WL.List.Delete(friendslist_name + "_friends", id);
                WL.Node.Remove(this.parentNode.parentNode);
              })
            ).parentNode
          );
          entry.appendChild(
            WL.Node.Create("div", [["class", "level c2"]], data["level"])
          );
          entry.appendChild(
            WL.Node.Create(
              "div",
              [["class", "avatar"]],
              '<img src="' + data["avatar"] + '">'
            )
          );
          entry.appendChild(
            WL.Node.Create(
              "div",
              [["class", "name dyn"]],
              '<a class="' +
                data["rank"] +
                '" href="/character/' +
                data["id"] +
                '"><strong>' +
                data["fullname"] +
                "</strong></a>"
            )
          );
          entry.appendChild(
            WL.Node.Create(
              "div",
              [["class", "class"]],
              '<span class="tier' +
                WL.Estiah.GetTier(data["class"]) +
                '">' +
                data["class"] +
                "</span>"
            )
          );
          entry.appendChild(
            WL.Node.Create("div", [["class", "hp " + data["rank"]]], data["hp"])
          );
          entry.appendChild(
            WL.Node.Create(
              "div",
              [["class", "match " + data["rank"]]],
              data["weekly"]["win"] * 1 +
                data["weekly"]["loss"] * 1 +
                " matches<br>" +
                data["weekly"]["percent"].toFixed(1) +
                "% win"
            )
          );
          entry.appendChild(
            WL.Node.Create(
              "div",
              [["class", "rating " + data["rank"]]],
              data["rating"]
            )
          );
          entry.appendChild(
            WL.Node.Create(
              "div",
              [["class", "class " + data["rank"]]],
              data["guild"]
                ? '<a href="/guild/' +
                    data["guild"]["id"] +
                    '" class="nolink ' +
                    data["rank"] +
                    '">' +
                    data["guild"]["initial"] +
                    "</a>"
                : "-"
            )
          );
          entry.appendChild(
            WL.Node.Create(
              "div",
              [["class", "city " + data["rank"]]],
              data["city"]
            )
          );
          friendslist.appendChild(entry);
        }
      );
    });
  };

  //addon
  if (WL.Data.Load(friendslist_name + "_enabled")) {
    WL.Addon.MenuEntry("Friends", WL.Estiah.Page.Friends);
    if (
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 11
      ) ==
        WL.Globals.Options.Domain.Value + "/character/" &&
      !isNaN(
        parseInt(
          window.location.href.substring(
            WL.Globals.Options.Domain.Value.length + 11
          )
        )
      )
    ) {
      //add text/buttons to more-tab
      var friend = WL.List.Exists(
        friendslist_name + "_friends",
        window.location.href.substring(
          WL.Globals.Options.Domain.Value.length + 11
        )
      );
      with (WL.Node.Select('//div[@id="TabContentInspectMisc"]')) {
        appendChild(
          WL.Node.Create(
            "div",
            [["class", "paragraph_text"]],
            "If this player sends you kind messages, you can simply [add] him to your friends.<br><br>"
          )
        );
        appendChild(
          WL.Node.Visibility(
            WL.Button.Create(
              "Add to friends",
              3,
              function () {
                WL.Node.Hide(this.parentNode);
                WL.List.Insert(
                  friendslist_name + "_friends",
                  window.location.href.substring(
                    WL.Globals.Options.Domain.Value.length + 11
                  )
                );
                WL.Node.Show(this.parentNode.nextSibling);
              },
              "wl_friend_add"
            ),
            !friend
          )
        );
        appendChild(
          WL.Node.Visibility(
            WL.Button.Create(
              "Delete from friends",
              2,
              function () {
                WL.Node.Hide(this.parentNode);
                WL.List.Delete(
                  friendslist_name + "_friends",
                  window.location.href.substring(
                    WL.Globals.Options.Domain.Value.length + 11
                  )
                );
                WL.Node.Show(this.parentNode.previousSibling);
              },
              "wl_friend_delete"
            ),
            friend
          )
        );
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  //altslist
  ////////////////////////////////////////////////////////////////

  //info
  var altslist_name = "AltsList";
  var altslist_version = "0.5.2";
  WL.Addon.Register(
    altslist_name,
    "This addon allows you to view your alts on a new page.",
    altslist_version,
    "WL"
  );

  //functions
  WL.Estiah.Page.Alts = function () {
    //show friends page
    var page, friendslist, alt, i;
    WL.CSS.Add(
      ".friendlist .friend .delete { width: 20px; margin: 12px 12px 0 0; } .friendlist .friend .avatar, .friendlist .friend .avatar img { width: 35px; height: 35px; } .friendlist .friend .name { width: 140px; font-size: 12px; margin: 2px 10px 0 8px; } .friendlist .friend .level { width: 30px; font-size: 18px; font-weight: bold; text-align:center; margin: 8px 8px 0 0; } .friendlist .friend .class { width: 90px; margin: 8px 0 0 0; } .friendlist .friend .city { width: 100px; margin: 8px 0 0 0; } .friendlist .friend .hp { width: 70px; margin: 8px 0 0 0; } .friendlist .friend .rating { width: 50px; margin: 8px 0 0 0; } .friendlist .friend .match { width: 100px; margin: 2px 0 0 0; font-size:11px; } .friendlist .header_label { margin: 16px 0 0 0; height: 14px; overflow: hidden; width: 100%; } .friendlist .friend .header { margin-top: 0; font-size: 10px; font-weight: bold; } .friendlist .tier0 { color: #CCCCCC; } .friendlist .tier1 { color: #CC9933; } .friendlist .tier2 { color: #EE6622; } .friendlist .tier3 { color: #FF4105; }"
    );
    page = WL.Estiah.Page.New(
      "Alts",
      "Look up your alts, and see who's the best in the world of Estiah. This page only shows your alts."
    );
    WL.Estiah.Show(page, allinone_name + " - Alts - Estiah");
    friendslist = page.firstChild.appendChild(
      WL.Node.Create(
        "div",
        [["class", "friendlist section_list format"]],
        '<div class="friend header_label"><div class="delete header">Del</div><div class="level header">Lv</div><div class="avatar"></div><div class="name header">Name</div><div class="class header">Class</div><div class="hp header">HP</div><div class="rating header">Rating</div><div class="class header">Guild</div><div class="city header">Location</div><div class="match header">Last used</div>'
      )
    );
    var list = [];
    for (alt in WL.Estiah.Alts) {
      list.push({ id: alt, login: WL.Estiah.Alts[alt]["login"] });
    }
    list.sort(function (a, b) {
      return a.login < b.login;
    });
    for (i = 0; i < list.length; i++) {
      var id = list[i]["id"];
      //get friends info
      //create entry
      entry = WL.Node.Create("div", [
        ["class", "friend entry"],
        ["id", "Alt" + id],
      ]);
      entry.appendChild(
        WL.Node.Create("div", [["class", "delete"]]).appendChild(
          WL.Node.Create("a", [["class", "c2 nolink"]], "[X]", function () {
            var id = this.parentNode.parentNode.getAttribute("id").substring(3);
            delete WL.Estiah.Alts[id];
            WL.Estiah.AltsList.Save();
            WL.Node.Remove(this.parentNode.parentNode);
          })
        ).parentNode
      );
      entry.appendChild(
        WL.Node.Create(
          "div",
          [["class", "level c2"]],
          WL.Estiah.Alts[id]["level"]
        )
      );
      entry.appendChild(WL.Node.Create("div", [["class", "avatar"]]));
      entry.appendChild(
        WL.Node.Create(
          "div",
          [["class", "name dyn"]],
          '<a href="/character/' +
            id +
            '"><strong>' +
            WL.Estiah.Alts[id]["name"] +
            "</strong></a>"
        )
      );
      entry.appendChild(WL.Node.Create("div", [["class", "class"]]));
      entry.appendChild(WL.Node.Create("div", [["class", "hp"]]));
      entry.appendChild(WL.Node.Create("div", [["class", "rating"]]));
      entry.appendChild(WL.Node.Create("div", [["class", "class"]]));
      entry.appendChild(
        WL.Node.Create(
          "div",
          [["class", "city"]],
          WL.Estiah.Cities[WL.Estiah.Alts[id]["city"]]
        )
      );
      entry.appendChild(
        WL.Node.Create("div", [["class", "match"]], WL.Estiah.Alts[id]["login"])
      );
      friendslist.appendChild(entry);
    }
    with (friendslist.parentNode)
      appendChild(
        WL.Button.Create("Show character stats", 1, function () {
          WL.Node.Hide(this);
          WL.Node.ForEach('//div[@class="friend entry"]', function (node) {
            var cid = node.getAttribute("id").substring(3);
            //get friends info
            WL.Data.Get(
              WL.Globals.Options.Domain.Value + "/json/character/" + cid,
              function (responseDetails) {
                var data, n1;
                data = JSON.parse(responseDetails.responseText);
                node = WL.Node.Select(
                  '//div[@id="Alt' + data["id"] + '"]/div[@class="level c2"]'
                );
                while ((n1 = node.nextSibling)) {
                  WL.Node.Remove(n1);
                }
                data["class"] =
                  data["class"].substring(0, 1).toUpperCase() +
                  data["class"].substring(1);
                with (node.parentNode) {
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "avatar"]],
                      '<img src="' + data["avatar"] + '">'
                    )
                  );
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "name dyn"]],
                      '<a class="' +
                        data["rank"] +
                        '" href="/character/' +
                        data["id"] +
                        '"><strong>' +
                        data["fullname"] +
                        "</strong></a>"
                    )
                  );
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "class"]],
                      '<span class="tier' +
                        WL.Estiah.GetTier(data["class"]) +
                        '">' +
                        data["class"] +
                        "</span>"
                    )
                  );
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "hp " + data["rank"]]],
                      data["hp"]
                    )
                  );
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "rating " + data["rank"]]],
                      data["rating"]
                    )
                  );
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "class " + data["rank"]]],
                      data["guild"]
                        ? '<a href="/guild/' +
                            data["guild"]["id"] +
                            '" class="nolink ' +
                            data["rank"] +
                            '">' +
                            data["guild"]["initial"] +
                            "</a>"
                        : "-"
                    )
                  );
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "city " + data["rank"]]],
                      data["city"]
                    )
                  );
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "match " + data["rank"]]],
                      WL.Estiah.Alts[cid]["login"]
                    )
                  );
                }
              }
            );
          });
        })
      );
  };
  WL.Estiah.AltsList = {};
  WL.Estiah.AltsList.Save = function () {
    WL.Data.Save(altslist_name + "_alts", JSON.stringify(WL.Estiah.Alts));
  };

  //addon
  if (WL.Data.Load(altslist_name + "_enabled")) {
    WL.Addon.MenuEntry("Alts", WL.Estiah.Page.Alts);
    WL.Estiah.Alts = JSON.parse(WL.Data.Load(altslist_name + "_alts", "{}"));
    WL.Estiah.Alts[WL.Globals.PlayerID] = {
      level: WL.Estiah.GetLevel(),
      name: WL.Estiah.GetName(),
      city: WL.Estiah.GetCityID(),
      login: WL.Estiah.Time(),
    };
    WL.Estiah.AltsList.Save();
  }

  ////////////////////////////////////////////////////////////////
  //soulcolor
  ////////////////////////////////////////////////////////////////

  //info
  var soulcolor_name = "SoulColor";
  var soulcolor_version = "0.4.0";
  WL.Addon.Register(
    soulcolor_name,
    "This addon allows you to see the color of your opponents' soul.",
    soulcolor_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(soulcolor_name + "_enabled")) {
    if (top.document.title == "Player Versus Player - Estiah") {
      var blue, brown, green, red, white, pagination, text, pages;
      blue = GM_getResourceURL("BlueGem");
      brown = GM_getResourceURL("BrownGem");
      green = GM_getResourceURL("GreenGem");
      red = GM_getResourceURL("RedGem");
      white = GM_getResourceURL("WhiteGem");
      WL.CSS.Add(
        '.wl_adventurer:after { content:" "url(' +
          white +
          ') } .wl_fighter:after { content:" "url(' +
          red +
          ') } .wl_scout:after { content:" "url(' +
          green +
          ') } .wl_novice:after { content:" "url(' +
          blue +
          ') } .wl_recruit:after { content:" "url(' +
          brown +
          ') } .wl_mercenary:after { content:" "url(' +
          red +
          ') } .wl_wizard:after { content:" "url(' +
          red +
          ') } .wl_rogue:after { content:" "url(' +
          green +
          ') } .wl_shaman:after { content:" "url(' +
          green +
          ') } .wl_monk:after { content:" "url(' +
          blue +
          ') } .wl_sage:after { content:" "url(' +
          blue +
          ') } .wl_guard:after { content:" "url(' +
          brown +
          ') } .wl_cleric:after { content:" "url(' +
          brown +
          ') } .wl_deathknight:after { content:" "url(' +
          red +
          ') " "url(' +
          green +
          ') } .wl_inquisitor:after { content:" "url(' +
          red +
          ') " "url(' +
          green +
          ') } .wl_champion:after { content:" "url(' +
          red +
          ') " "url(' +
          blue +
          ') } .wl_pyromaniac:after { content:" "url(' +
          red +
          ') " "url(' +
          blue +
          ') } .wl_berserker:after { content:" "url(' +
          red +
          ') " "url(' +
          brown +
          ') } .wl_summoner:after { content:" "url(' +
          red +
          ') " "url(' +
          brown +
          ') } .wl_assassin:after { content:" "url(' +
          green +
          ') " "url(' +
          blue +
          ') } .wl_slayer:after { content:" "url(' +
          green +
          ') " "url(' +
          blue +
          ') } .wl_warlord:after { content:" "url(' +
          green +
          ') " "url(' +
          brown +
          ') } .wl_warden:after { content:" "url(' +
          green +
          ') " "url(' +
          brown +
          ') } .wl_paladin:after { content:" "url(' +
          blue +
          ') " "url(' +
          brown +
          ') } .wl_hierarch:after { content:" "url(' +
          blue +
          ') " "url(' +
          brown +
          ") }"
      );
      //!!WL.CSS.Add('.wl_white:after { content:" "url(' + white + ') } .wl_red:after { content:" "url(' + red + ') } .wl_green:after { content:" "url(' + green + ') } .wl_blue:after { content:" "url(' + blue + ') } .wl_brown:after { content:" "url(' + brown + ') }');
      //add gems and pagination
      WL.Node.ForEachNew(
        WL.Node.Select('//div[@id="VsMobList"]'),
        function () {
          if (
            WL.Node.Select(
              '//div[@id="VsMobList"]/div/div/a[contains(@class, "wl_")]'
            ) !== null
          )
            return true;
          pagination = WL.Node.Select('//div[@id="VsFormPagination"]/div'); ///a[@class="jump index"]');
          if (pagination) {
            text = pagination.lastChild.data;
            pages = text.substring(
              text.indexOf("(") + 1,
              text.indexOf(" pages")
            );
            if (WL.Data.Load(paginationfix_name + "_enabled"))
              WL.Data.Save(paginationfix_name + "_pages", pages);
            if (
              WL.Node.Select("span", pagination).innerHTML != "[1]" &&
              WL.Node.Select(
                'a[@href="/json/pvp/index/load/page/1"]',
                pagination
              ) === null
            )
              pagination.insertBefore(
                WL.Node.Create("a", [["class", "index"]], "1", function () {
                  WL.Node.Select('//input[@id="VsFormIndex"]').value = 1;
                  WL.Script.Run("VsList.change()");
                }),
                pagination.firstChild.nextSibling.nextSibling
              );
            if (
              WL.Node.Select("span", pagination).innerHTML !=
                "[" + pages + "]" &&
              WL.Node.Select(
                'a[@href="/json/pvp/index/load/page/' + pages + '"]',
                pagination
              ) === null
            )
              pagination.insertBefore(
                WL.Node.Create("a", [["class", "index"]], pages, function () {
                  WL.Node.Select('//input[@id="VsFormIndex"]').value = pages;
                  WL.Script.Run("VsList.change()");
                }),
                pagination.lastChild.previousSibling
              );
          } else if (WL.Data.Load(paginationfix_name + "_enabled"))
            WL.Node.Select('//div[@id="VsFormPagination"]').appendChild(
              WL.Pagination.Create(
                "pvp",
                parseInt(WL.Node.Select('//input[@id="VsFormIndex"]').value),
                WL.Data.Load(paginationfix_name + "_pages", undefined)
              )
            );
          WL.Node.ForEach(
            '//div[@id="VsMobList"]/div/div/a[@class="c2 nolink func BV_vslist_fight"]/../../div[@class="classname lhp"]/strong',
            function (node) {
              node.parentNode.nextSibling.nextSibling.appendChild(
                WL.Node.Create("a", [
                  ["class", "wl_" + node.innerHTML.toLowerCase()],
                  ["style", "text-decoration: none;"],
                ])
              );
              if (
                node.parentNode.previousSibling.previousSibling.firstChild.nextSibling
                  .getAttribute("href")
                  .substring(11) == "32917"
              ) {
                node.innerHTML = WL.Sheira.Class;
                with (WL.Node.Select(
                  '//div[@id="SystemInfoCharacter32917"]/div[@class="description"]'
                ))
                  innerHTML = innerHTML.replace("Hierarch", WL.Sheira.Class);
              }
            }
          );
        },
        true
      );
      //remove gems
      WL.Node.Select('//div[@id="VsMobList"]').addEventListener(
        "click",
        function (event) {
          if (
            event.target.innerHTML == "[Fight]" &&
            event.target.getAttribute("class").substring(0, 2) == "c2"
          )
            WL.Node.ForEach(
              '../a[contains(@class, "wl_")]',
              function (node) {
                WL.Node.Remove(node);
              },
              event.target
            );
        },
        false
      );
    }
  }

  ////////////////////////////////////////////////////////////////
  //gearbuilder
  ////////////////////////////////////////////////////////////////

  //info
  var gearbuilder_name = "GearBuilder";
  var gearbuilder_version = "0.4.0";
  WL.Addon.Register(
    gearbuilder_name,
    "This addon allows you to add the maximum of one charm to your deck with one click.",
    gearbuilder_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(gearbuilder_name + "_enabled")) {
    if (top.document.title == "Gear - Estiah") {
      WL.CSS.Add(".cardlist .card .name { width: 232px !important; }");
      //add buttons
      WL.Node.ForEach('//div[@class="cardlist"]/div', function (node) {
        node.insertBefore(
          WL.Node.Create("a", [["class", "func_tier"]], "[#]", function () {
            for (var i = 0; i < 5; i++)
              WL.Node.Click(this.nextSibling.nextSibling);
          }),
          node.firstChild
        );
      });
    }
  }

  ////////////////////////////////////////////////////////////////
  //extragears
  ////////////////////////////////////////////////////////////////

  //info
  var extragears_name = "ExtraGears";
  var extragears_version = "0.5.4";
  WL.Addon.Register(
    extragears_name,
    "This addon allows you to use indefinite extra gears.",
    extragears_version,
    "WL"
  );

  //functions
  WL.Estiah.Deck = {};
  WL.Estiah.Deck.EGID = WL.Globals.PlayerID;
  WL.Estiah.Deck.SaveGearbox = function () {
    WL.Data.Save(
      extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
      JSON.stringify(WL.Estiah.Gearbox)
    );
  };
  WL.Estiah.Deck.EmptyGroup = function (pos) {
    var temp = WL.Node.Hide(
      WL.Node.Create("div", [
        ["style", "width: 100%;"],
        ["pos", pos],
      ])
    );
    with (temp)
      with (appendChild(WL.Node.Create("div", [["class", "deck highlight"]])))
        with (appendChild(WL.Node.Create("div", [["class", "name"]])))
          appendChild(
            WL.Node.Create("a", [["class", "nolink"]], "<i>moved</i>")
          );
    return temp;
  };
  WL.Estiah.Deck.GroupSelect = WL.Node.Create("select", [
    ["id", "wl_extragears_groupselect"],
    ["style", "width: 44%;"],
  ]);
  with (WL.Estiah.Deck.GroupSelect) {
    addEventListener(
      "change",
      function (event) {
        //WL.Node.Click(WL.Node.Select('//option[@value="' + this.value + '"]', WL.Estiah.Deck.GroupSelect));
        //current deck = this.parentNode.parentNode
        //current group = this.parentNode.parentNode.parentNode.parentNode
        var temp, gears, pos;
        gears =
          WL.Estiah.Gearbox[
            WL.Estiah.Deck.GroupSelect.parentNode.parentNode.parentNode.getAttribute(
              "type"
            )
          ][
            WL.Estiah.Deck.GroupSelect.parentNode.parentNode.parentNode.getAttribute(
              "pos"
            )
          ]["gears"];
        pos = gears.indexOf(
          WL.Estiah.Deck.GroupSelect.parentNode.firstChild.firstChild
            .getAttribute("id")
            .substring(14)
        );

        //debug start
        // if (gears == null || gears[pos] == null || temp == null) {
        //   GM_log(
        //     "Debug: move gear, gears: " +
        //       gears +
        //       ", pos: " +
        //       pos +
        //       ", to: " +
        //       event.target.value
        //   );
        //   GM_log(
        //     WL.Data.Load(extragears_name + "_gears_" + WL.Estiah.Deck.EGID, "")
        //   );
        //   alert(
        //     "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
        //   );
        //   return;
        // }
        //debug end

        // console.log(temp.parentNode.getAttribute("type"));
        // console.log(temp.parentNode.getAttribute("pos"));
        // console.log(WL.Estiah.Gearbox);
        // console.log(gears, pos);
        if (event.target.value === "Trash bin") {
          WL.Estiah.Deck.GroupSelect.parentNode.remove();
        } else {
          temp = WL.Node.Select(
            '//div[@id="wl_extragroups_' + event.target.value + '"]'
          );
          temp.appendChild(WL.Estiah.Deck.GroupSelect.parentNode);
          WL.Estiah.Gearbox[temp.parentNode.getAttribute("type")][
            temp.parentNode.getAttribute("pos")
          ]["gears"].push(gears[pos]);
        }
        gears.splice(pos, 1);
        WL.Estiah.Deck.SaveGearbox();
        WL.Node.Remove(WL.Estiah.Deck.GroupSelect);
        // WL.Estiah.Deck.GroupSelect.selectedIndex =
        //   WL.Estiah.Deck.GroupSelect.length - 1;
      },
      false
    );
    appendChild(WL.Node.Create("optgroup", [["label", "active"]]));
    appendChild(WL.Node.Create("optgroup", [["label", "archived"]]));
    with (appendChild(WL.Node.Create("optgroup", [["label", "other"]]))) {
      appendChild(
        WL.Node.Create(
          "option",
          [["value", "Trash bin"]],
          "Trash bin",
          function () {
            //delete
            var gears, gear;
            gear = WL.Estiah.Deck.GroupSelect.previousSibling.firstChild
              .getAttribute("id")
              .substring(14);
            if (
              !confirm(
                "Really delete ExtraGear '" +
                  gear.substring(gear.indexOf("_") + 1) +
                  "'?"
              )
            )
              return;
            gears =
              WL.Estiah.Gearbox[
                WL.Estiah.Deck.GroupSelect.parentNode.parentNode.parentNode.getAttribute(
                  "type"
                )
              ][
                WL.Estiah.Deck.GroupSelect.parentNode.parentNode.parentNode.getAttribute(
                  "pos"
                )
              ]["gears"];
            //debug start
            if (gears == null || gear == null) {
              GM_log("Debug: delete gear, gear: " + gear + ", gears: " + gears);
              GM_log(
                WL.Data.Load(
                  extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
                  ""
                )
              );
              alert(
                "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
              );
              return;
            }
            //debug end
            gears.splice(gears.indexOf(gear), 1);
            WL.Estiah.Deck.SaveGearbox();
            WL.Data.Delete(extragears_name + "_gear_" + gear);
            WL.Node.Remove(WL.Estiah.Deck.GroupSelect.parentNode);
          }
        )
      );
      //appendChild(WL.Node.Create("option", [["value", "Cancel"], ["selected", "selected"]], "Cancel"));
    }
  }
  WL.Estiah.Deck.AddGroup = function (pos, groupid, type) {
    if (!groupid) return;
    //add group
    var temp, name, deck, buttons;
    name = groupid.substring(groupid.indexOf("_") + 1);
    temp = WL.Node.Select(
      '//optgroup[@label="' + type + '"]',
      WL.Estiah.Deck.GroupSelect
    );
    temp.insertBefore(
      WL.Node.Create(
        "option",
        [["value", groupid]],
        name /*, function()
	{
		//current deck = this.parentNode.parentNode
		//current group = this.parentNode.parentNode.parentNode.parentNode
		var temp, gears, pos;
		gears = WL.Estiah.Gearbox[WL.Estiah.Deck.GroupSelect.parentNode.parentNode.parentNode.getAttribute("type")][WL.Estiah.Deck.GroupSelect.parentNode.parentNode.parentNode.getAttribute("pos")]["gears"];
		pos = gears.indexOf(WL.Estiah.Deck.GroupSelect.previousSibling.firstChild.getAttribute("id").substring(14));
		temp = WL.Node.Select('//div[@id="wl_extragroups_' + this.value + '"]');
		temp.appendChild(WL.Estiah.Deck.GroupSelect.parentNode);
		WL.Estiah.Gearbox[temp.parentNode.getAttribute("type")][temp.parentNode.getAttribute("pos")]["gears"].push(gears[pos]);
		gears.splice(pos, 1);
		WL.Estiah.Deck.SaveGearbox();
		WL.Estiah.Deck.GroupSelect.parentNode.removeChild(WL.Estiah.Deck.GroupSelect);
		WL.Estiah.Deck.GroupSelect.selectedIndex = WL.Estiah.Deck.GroupSelect.length - 1;
	}*/
      ),
      temp.firstChild
    );
    temp = WL.Node.Select('//div[@id="wl_extragears_' + type + '"]');
    with (temp)
      with (insertBefore(
        WL.Node.Create("div", [
          ["style", "width: 100%;"],
          ["pos", pos],
          ["type", type],
        ]),
        temp.firstChild.nextSibling.nextSibling
      )) {
        with (appendChild(
          WL.Node.Create("div", [["class", "deck highlight"]])
        )) {
          with (appendChild(WL.Node.Create("div", [["class", "name"]])))
            appendChild(
              WL.Node.Create("a", [["class", "nolink"]], name, function () {
                //show/hide gears
                WL.Node.Visibility(this.parentNode.parentNode.nextSibling);
              })
            );
          if (groupid.substring(0, 1) != 0) {
            appendChild(
              WL.Node.Create(
                "a",
                [["class", "func_sec lhp"]],
                "[Up]",
                function () {
                  //move up
                  var temp, move, pos, type;
                  pos = parseInt(
                    this.parentNode.parentNode.getAttribute("pos")
                  );
                  type = this.parentNode.parentNode.parentNode
                    .getAttribute("id")
                    .substring(14);
                  temp = this.parentNode.parentNode;
                  move = 0;
                  do {
                    move++;
                    temp = temp.previousSibling;
                  } while (temp.style.display == "none");
                  if (pos + move >= WL.Estiah.Gearbox[type].length) return;
                  //debug start
                  if (
                    WL.Estiah.Gearbox[type][pos + move] == null ||
                    WL.Estiah.Gearbox[type][pos] == null ||
                    temp == null
                  ) {
                    GM_log(
                      "Debug: move group up, type: " +
                        type +
                        ", pos: " +
                        pos +
                        ", move: " +
                        move
                    );
                    GM_log(
                      WL.Data.Load(
                        extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
                        ""
                      )
                    );
                    alert(
                      "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
                    );
                    return;
                  }
                  //debug end
                  this.parentNode.parentNode.setAttribute("pos", pos + move);
                  temp.setAttribute("pos", pos);
                  temp.parentNode.insertBefore(
                    this.parentNode.parentNode,
                    temp
                  );
                  temp = WL.Estiah.Gearbox[type][pos];
                  WL.Estiah.Gearbox[type][pos] =
                    WL.Estiah.Gearbox[type][pos + move];
                  WL.Estiah.Gearbox[type][pos + move] = temp;
                  WL.Estiah.Deck.SaveGearbox();
                  temp = WL.Node.Select(
                    '//option[@value="' + groupid + '"]',
                    WL.Estiah.Deck.GroupSelect
                  );
                  temp.parentNode.insertBefore(temp, temp.previousSibling);
                }
              )
            );
            appendChild(
              WL.Node.Create(
                "a",
                [["class", "func_sec lhp"]],
                "[Down]",
                function () {
                  //move down
                  var temp, temp2, move, pos, type;
                  pos = parseInt(
                    this.parentNode.parentNode.getAttribute("pos")
                  );
                  type = this.parentNode.parentNode.parentNode
                    .getAttribute("id")
                    .substring(14);
                  temp = this.parentNode.parentNode;
                  move = 0;
                  do {
                    move++;
                    temp = temp.nextSibling;
                  } while (temp.style.display == "none");
                  if (pos <= move) return;
                  //debug start
                  if (
                    WL.Estiah.Gearbox[type][pos - move] == null ||
                    WL.Estiah.Gearbox[type][pos] == null ||
                    temp == null
                  ) {
                    GM_log(
                      "Debug: move group down, type: " +
                        type +
                        ", pos: " +
                        pos +
                        ", move: " +
                        move
                    );
                    GM_log(
                      WL.Data.Load(
                        extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
                        ""
                      )
                    );
                    alert(
                      "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
                    );
                    return;
                  }
                  //debug end
                  this.parentNode.parentNode.setAttribute("pos", pos - move);
                  temp.setAttribute("pos", pos);
                  temp.parentNode.insertBefore(
                    this.parentNode.parentNode,
                    temp.nextSibling
                  );
                  temp = WL.Estiah.Gearbox[type][pos];
                  WL.Estiah.Gearbox[type][pos] =
                    WL.Estiah.Gearbox[type][pos - move];
                  WL.Estiah.Gearbox[type][pos - move] = temp;
                  WL.Estiah.Deck.SaveGearbox();
                  temp = WL.Node.Select(
                    '//option[@value="' + groupid + '"]',
                    WL.Estiah.Deck.GroupSelect
                  );
                  temp.parentNode.insertBefore(
                    temp,
                    temp.nextSibling.nextSibling
                  );
                }
              )
            );
            appendChild(
              WL.Node.Visibility(
                WL.Node.Create(
                  "a",
                  [["class", "func_sec lhp"]],
                  "[Arch.]",
                  function () {
                    //move to archive
                    var temp, pos, type;
                    pos = parseInt(
                      this.parentNode.parentNode.getAttribute("pos")
                    );
                    //debug start
                    if (
                      pos == null ||
                      WL.Estiah.Gearbox["active"][pos] == null
                    ) {
                      GM_log(
                        "Debug: archive group, type: " + type + ", pos: " + pos
                      );
                      GM_log(
                        WL.Data.Load(
                          extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
                          ""
                        )
                      );
                      alert(
                        "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
                      );
                      return;
                    }
                    //debug end
                    this.parentNode.parentNode.setAttribute(
                      "pos",
                      WL.Estiah.Gearbox["archived"].length
                    );
                    this.parentNode.parentNode.setAttribute("type", "archived");
                    this.parentNode.parentNode.parentNode.insertBefore(
                      WL.Estiah.Deck.EmptyGroup(pos),
                      this.parentNode.parentNode
                    );
                    temp = WL.Node.Select(
                      '//div[@id="wl_extragears_archived"]'
                    );
                    temp.insertBefore(
                      this.parentNode.parentNode,
                      temp.firstChild.nextSibling.nextSibling
                    );
                    WL.Node.Hide(this);
                    WL.Node.Show(this.nextSibling);
                    WL.Estiah.Gearbox["archived"].push(
                      WL.Estiah.Gearbox["active"][pos]
                    );
                    WL.Estiah.Gearbox["active"][pos] = "moved";
                    WL.Estiah.Deck.SaveGearbox();
                    temp = WL.Node.Select(
                      '//option[@value="' + groupid + '"]',
                      WL.Estiah.Deck.GroupSelect
                    );
                    temp.parentNode.nextSibling.insertBefore(
                      temp,
                      temp.parentNode.nextSibling.firstChild
                    );
                  }
                ),
                type == "active"
              )
            );
            appendChild(
              WL.Node.Visibility(
                WL.Node.Create(
                  "a",
                  [["class", "func_sec lhp"]],
                  "[Retr.]",
                  function () {
                    //move to active
                    var temp, pos, type;
                    pos = parseInt(
                      this.parentNode.parentNode.getAttribute("pos")
                    );
                    //debug start
                    if (
                      pos == null ||
                      WL.Estiah.Gearbox["archived"][pos] == null
                    ) {
                      GM_log(
                        "Debug: retrieve group, type: " + type + ", pos: " + pos
                      );
                      GM_log(
                        WL.Data.Load(
                          extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
                          ""
                        )
                      );
                      alert(
                        "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
                      );
                      return;
                    }
                    //debug end
                    this.parentNode.parentNode.setAttribute(
                      "pos",
                      WL.Estiah.Gearbox["active"].length
                    );
                    this.parentNode.parentNode.setAttribute("type", "active");
                    this.parentNode.parentNode.parentNode.insertBefore(
                      WL.Estiah.Deck.EmptyGroup(pos),
                      this.parentNode.parentNode
                    );
                    temp = WL.Node.Select('//div[@id="wl_extragears_active"]');
                    temp.insertBefore(
                      this.parentNode.parentNode,
                      temp.firstChild.nextSibling.nextSibling
                    );
                    WL.Node.Hide(this);
                    WL.Node.Show(this.previousSibling);
                    WL.Estiah.Gearbox["active"].push(
                      WL.Estiah.Gearbox["archived"][pos]
                    );
                    WL.Estiah.Gearbox["archived"][pos] = "moved";
                    WL.Estiah.Deck.SaveGearbox();
                    temp = WL.Node.Select(
                      '//option[@value="' + groupid + '"]',
                      WL.Estiah.Deck.GroupSelect
                    );
                    temp.parentNode.previousSibling.insertBefore(
                      temp,
                      temp.parentNode.previousSibling.firstChild
                    );
                  }
                ),
                type == "archived"
              )
            );
            appendChild(
              WL.Node.Create(
                "a",
                [["class", "func_sec lhp"]],
                "[Del.]",
                function () {
                  //delete
                  var temp, pos, type;
                  pos = parseInt(
                    this.parentNode.parentNode.getAttribute("pos")
                  );
                  type = this.parentNode.parentNode.parentNode
                    .getAttribute("id")
                    .substring(14);
                  WL.Node.Replace(
                    this.parentNode.parentNode,
                    WL.Estiah.Deck.EmptyGroup(pos)
                  );
                  for (gear in WL.Estiah.Gearbox[type][pos]["gears"]) {
                    if (!isNaN(gear)) {
                      WL.Estiah.Deck.AddGear(
                        WL.Estiah.Gearbox[type][pos]["gears"][gear],
                        WL.Estiah.Gearbox[type][0]["id"]
                      );
                      WL.Estiah.Gearbox[type][0]["gears"].push(
                        WL.Estiah.Gearbox[type][pos]["gears"][gear]
                      );
                    }
                  }
                  WL.Estiah.Gearbox[type][pos] = "delete";
                  WL.Estiah.Deck.SaveGearbox();
                  temp = WL.Node.Select(
                    '//option[@value="' + groupid + '"]',
                    WL.Estiah.Deck.GroupSelect
                  );
                  WL.Node.Remove(temp);
                }
              )
            );
          }
        }
        appendChild(
          WL.Node.Visibility(
            WL.Node.Create("div", [
              ["id", "wl_extragroups_" + groupid],
              ["style", "margin-left: 5%; width: 95%;"],
            ]),
            groupid.substring(0, 1) == 0
          )
        );
      }
  };
  WL.Estiah.Deck.AddGear = function (gearid, type) {
    // console.log(gearid, type);
    //add gear
    var name, deck, buttons;
    name = gearid.substring(gearid.indexOf("_") + 1);
    with (WL.Node.Select('//div[@id="wl_extragroups_' + type + '"]'))
      with (appendChild(
        WL.Node.Create("div", [
          ["class", "deck highlight"],
          // ["style", "overflow: hidden; height: 18px;"],
        ])
      )) {
        with (appendChild(
          WL.Node.Create("div", [
            ["class", "name"],
            ["style", "width: 100% !important"],
          ])
        ))
          appendChild(
            WL.Node.Create(
              "a",
              [
                ["id", "wl_extragears_" + gearid],
                ["class", "nolink"],
              ],
              name,
              function () {
                //show gear
                gearid = this.getAttribute("id").substring(14);
                WL.Estiah.Deck.Extra.setAttribute(
                  "wl_extragears_extra",
                  gearid
                );
                var old = WL.Node.Select(
                  '//div[@class="deck highlight"]/div/a[contains(@class, "c2")]'
                );
                if (old != null)
                  old.setAttribute(
                    "class",
                    WL.String.Replace(old.getAttribute("class"), " c2", "")
                  );
                this.setAttribute("class", "nolink c2");
                WL.Estiah.Deck.SetName(name);
                WL.Estiah.Deck.Load(
                  WL.Data.Load(extragears_name + "_gear_" + gearid)
                );
                //show extra buttons
                if (
                  WL.Estiah.Deck.Extra.getAttribute("wl_extragears_buttons") !=
                  "extra"
                ) {
                  WL.Node.Select('//div[@id="DeckStatus"]').insertBefore(
                    WL.Node.Select('//a[@id="wl_extragears_extra2extra"]/..'),
                    WL.Node.Select('//a[@id="wl_extragears_normal2normal"]/..')
                  );
                  WL.Estiah.Deck.Extra.appendChild(
                    WL.Node.Select('//a[@id="wl_extragears_normal2normal"]/..')
                  );
                  WL.Node.Select('//div[@id="DeckStatus"]').insertBefore(
                    WL.Node.Select('//a[@id="wl_extragears_extra2normal"]/..'),
                    WL.Node.Select('//a[@id="wl_extragears_normal2extra"]/..')
                  );
                  WL.Estiah.Deck.Extra.appendChild(
                    WL.Node.Select('//a[@id="wl_extragears_normal2extra"]/..')
                  );
                  WL.Estiah.Deck.Extra.setAttribute(
                    "wl_extragears_buttons",
                    "extra"
                  );
                }
                if (WL.Estiah.Missing == 0) WL.Estiah.Deck.RemoveAlert();
              }
            )
          );
        with (appendChild(WL.Node.Create("div"))) {
          appendChild(
            WL.Node.Create(
              "a",
              [["class", "func_sec lhp"]],
              "[Load]",
              function () {
                //load gear
                var gearid, name;
                gearid = this.parentNode.previousSibling.firstChild
                  .getAttribute("id")
                  .substring(14);
                name = gearid.substring(gearid.indexOf("_") + 1);
                WL.Estiah.Deck.Save = true;
                WL.Estiah.Deck.SetName(name);
                WL.Estiah.Deck.Load(
                  WL.Data.Load(extragears_name + "_gear_" + gearid)
                );
              }
            )
          );
          appendChild(
            WL.Node.Create(
              "a",
              [["class", "func_sec lhp"]],
              "[Save]",
              function () {
                //save gear
                WL.Estiah.Deck.Extra.setAttribute(
                  "wl_extragears_extra",
                  this.parentNode.previousSibling.firstChild
                    .getAttribute("id")
                    .substring(14)
                );
                WL.Node.Click(
                  WL.Node.Select('//a[@id="wl_extragears_extra2extra"]')
                );
              }
            )
          );
          // appendChild(
          //   WL.Node.Create(
          //     "a",
          //     [["class", "func_sec lhp"]],
          //     "[Up]",
          //     function () {
          //       const id =
          //         this.parentNode.parentNode.parentNode.getAttribute("id");
          //       const type = id.includes("Active") ? "active" : "archived";
          //       WL.Estiah.Deck.SaveGearbox();
          //     }
          //   )
          // );
          // appendChild(
          //   WL.Node.Create(
          //     "a",
          //     [["class", "func_sec lhp"]],
          //     "[Down]",
          //     function () {}
          //   )
          // );
          // appendChild(
          //   WL.Node.Create(
          //     "a",
          //     [["class", "func_sec lhp"]],
          //     "[Del]",
          //     function () {}
          //   )
          // );

          appendChild(
            WL.Node.Create(
              "a",
              [["class", "func_sec lhp"]],
              "[TOP]",
              function () {
                gears =
                  WL.Estiah.Gearbox[
                    this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                      "type"
                    )
                  ][
                    this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                      "pos"
                    )
                  ]["gears"];
                pos = gears.indexOf(
                  this.parentNode.parentNode.firstChild.firstChild
                    .getAttribute("id")
                    .substring(14)
                );
                if (pos > 0) {
                  let item = gears.splice(pos, 1);
                  gears.splice(0, 0, ...item);
                  let elem = this.parentNode.parentNode;
                  elem.parentNode.prepend(elem);
                }
                WL.Estiah.Deck.SaveGearbox();
              }
            )
          );
          appendChild(
            WL.Node.Create(
              "a",
              [["class", "func_sec lhp"]],
              "[BOT]",
              function () {
                gears =
                  WL.Estiah.Gearbox[
                    this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                      "type"
                    )
                  ][
                    this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                      "pos"
                    )
                  ]["gears"];
                pos = gears.indexOf(
                  this.parentNode.parentNode.firstChild.firstChild
                    .getAttribute("id")
                    .substring(14)
                );
                if (pos > 0) {
                  let item = gears.splice(pos, 1);
                  gears.splice(gears.length, 0, ...item);
                  let elem = this.parentNode.parentNode;
                  elem.parentNode.append(elem);
                }
                WL.Estiah.Deck.SaveGearbox();
              }
            )
          );

          appendChild(
            WL.Node.Create(
              "a",
              [["class", "func_sec lhp"]],
              "[Up]",
              function () {
                gears =
                  WL.Estiah.Gearbox[
                    this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                      "type"
                    )
                  ][
                    this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                      "pos"
                    )
                  ]["gears"];
                pos = gears.indexOf(
                  this.parentNode.parentNode.firstChild.firstChild
                    .getAttribute("id")
                    .substring(14)
                );
                if (pos > 0) {
                  let item = gears.splice(pos, 1);
                  gears.splice(pos - 1, 0, ...item);
                  let elem = this.parentNode.parentNode;
                  elem.previousSibling.before(elem);
                }
                WL.Estiah.Deck.SaveGearbox();
              }
            )
          );
          appendChild(
            WL.Node.Create(
              "a",
              [["class", "func_sec lhp"]],
              "[Down]",
              function () {
                gears =
                  WL.Estiah.Gearbox[
                    this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                      "type"
                    )
                  ][
                    this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                      "pos"
                    )
                  ]["gears"];
                pos = gears.indexOf(
                  this.parentNode.parentNode.firstChild.firstChild
                    .getAttribute("id")
                    .substring(14)
                );
                if (pos < gears.length - 1) {
                  let item = gears.splice(pos, 1);
                  gears.splice(pos + 1, 0, ...item);
                  let elem = this.parentNode.parentNode;
                  elem.nextSibling.after(elem);
                }
                WL.Estiah.Deck.SaveGearbox();
              }
            )
          );
          appendChild(
            WL.Node.Create(
              "a",
              [["class", "func_sec lhp"]],
              "[Move To]",
              function () {
                // const pos =
                //   this.parentNode.parentNode.parentNode.parentNode.getAttribute(
                //     "pos"
                //   );
                // WL.Estiah.Deck.GroupSelect.selectedIndex = pos;
                const id =
                  this.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute(
                    "id"
                  );
                WL.Estiah.Deck.GroupSelect.selectedIndex = id.includes("active")
                  ? 0
                  : 1;
                //move gear
                this.parentNode.parentNode.appendChild(
                  WL.Estiah.Deck.GroupSelect,
                  this.parentNode
                );
              }
            )
          );
        }
      }
  };
  WL.Estiah.Deck.GetName = function () {
    return WL.Node.Select('//input[@id="DeckNameInput"]').value;
  };
  WL.Estiah.Deck.SetName = function (Name) {
    WL.Node.Select('//input[@id="DeckNameInput"]').value = Name;
  };
  WL.Estiah.Deck.Msg = function (Message, Append) {
    if (Message === undefined) {
      return WL.Node.Select('//div[@id="DeckMsg"]').innerHTML;
    } else {
      if (Append === true)
        WL.Node.Select('//div[@id="DeckMsg"]').innerHTML += Message;
      else WL.Node.Select('//div[@id="DeckMsg"]').innerHTML = Message;
    }
  };
  WL.Estiah.Deck.Export = function () {
    var deck = "";
    WL.Node.ForEach(
      '//div[@id="DeckCurrent"]/div[@class="card"]/div[@class="name" and span>0]/span',
      function (node) {
        deck +=
          " " + node.innerHTML + "x" + node.getAttribute("id").substring(13);
      }
    );
    return deck.substring(1);
  };
  WL.Estiah.Deck.Load = function (Deck) {
    //load gear
    var charms, charm, count, id, link, i, archive;
    WL.Node.Click(WL.Node.Select('//a[@class="BV_deck_remove_all"]'));
    WL.Estiah.Deck.Msg("");
    //check for "List" syntax
    if (!parseInt(Deck.substring(0, 1))) {
      charms = Deck.split("\n");
      if (Deck.substring(0, 4) == "Gear") {
        WL.Estiah.Deck.SetName(Deck.substring(6, Deck.indexOf("' By ")));
        charms.shift();
      }
      if (charms[0] == "") charms.shift();
    } else charms = Deck.split(" ");
    WL.Estiah.Spirit = 0;
    WL.Estiah.Missing = 0;
    var charmnames = [];
    while ((charm = charms.shift())) {
      //add charm
      if (parseInt(charm.substring(0, 1))) {
        //per id
        if (charm.substring(1, 2) == "x") {
          count = charm.substring(0, 1);
          charm = charm.substring(2);
        } else count = 5;
        link = WL.Node.Select(
          '//div[@id="CollectionCard' +
            charm +
            '"]/a[@href="/card/' +
            charm +
            '"]'
        );
        if (link == null)
          WL.Estiah.Deck.Extra.appendChild(
            WL.Node.Create("div", [
              ["class", "wl_extragears_missing"],
              ["count", count],
              ["charm", charm],
              ["type", "id"],
            ])
          );
        else WL.Estiah.Deck.AddActive(link, count);
      } else {
        //per name
        count = charm.substring(charm.length - 1);
        charm = charm.substring(0, charm.length - 3).replace(/ /g, "&nbsp;");
        //charm = WL.String.Replace(charm.substring(0, charm.length - 3), " ", "&nbsp;");
        //charm = charm.substring(0, charm.length - 3);
        charmnames.push({ name: charm, count: count });
      }
      WL.Estiah.Spirit += parseInt(count);
    }
    //add by name
    if (charmnames.length > 0) {
      WL.Node.ForEach(
        '//div[contains(@class, "card")]/div[@class="name"]/a',
        function (node) {
          for (var i = 0; i < charmnames.length; i++) {
            if (
              node.innerHTML.substring(0, charmnames[i]["name"].length) ==
              charmnames[i]["name"]
            ) {
              WL.Estiah.Deck.AddActive(
                node.parentNode.previousSibling.previousSibling,
                charmnames[i]["count"]
              );
              charmnames.splice(i, 1);
              if (charmnames.length == 0) return false;
              return;
            }
          }
        }
      );
      if (charmnames.length > 0) {
        //still missing ones
        for (i = 0; i < charmnames.length; i++) {
          WL.Estiah.Deck.Extra.appendChild(
            WL.Node.Create("div", [
              ["class", "wl_extragears_missing"],
              ["count", charmnames[i]["count"]],
              ["charm", charmnames[i]["name"]],
              ["type", "name"],
            ])
          );
        }
      }
    }
    //missing?
    if (
      WL.Node.Count(
        '//div[@id="wl_extragears"]/div[@class="wl_extragears_missing"]'
      ) == 0
    ) {
      if (WL.Estiah.Deck.Save === true) {
        WL.Node.Click(WL.Node.Select('//a[@id="wl_extragears_extra2normal"]'));
      }
    } else {
      WL.Estiah.Msg = WL.Estiah.Deck.Msg();
      WL.Estiah.Deck.Msg(
        WL.Globals.Options.Loading.Value + " loading charms...",
        true
      );
      if (top.frames.length == 0) {
        //load archive
        WL.Estiah.Runes = [
          "Unknown",
          "Axe",
          "Sword",
          "Mace",
          "Twinblades",
          "Spear",
          "Fist",
          "Earth",
          "Shadow",
          "Holy",
          "Lightning",
          "Frost",
          "Fire",
          "Spirit",
          "Armor",
          "Ward",
          "Willpower",
          "Summon",
          "Buff",
          "Debuff",
          "Tech",
        ];
        WL.Data.IFrame(
          WL.Globals.Options.Domain.Value +
            "/character/card/index/collection/archive",
          WL.Estiah.Deck.Errors
        );
      } else WL.Estiah.Deck.Errors();
    }
  };
  WL.Estiah.Deck.AddActive = function (link, count) {
    for (var i = 0; i < count; i++) {
      if (link.parentNode.style.opacity == 0.3) {
        WL.Estiah.Deck.Msg(
          count -
            i +
            "x" +
            link.nextSibling.nextSibling.firstChild.nextSibling.innerHTML +
            " was not found!<br>",
          true
        );
        WL.Estiah.Missing += parseInt(count - i);
        break;
      }
      WL.Node.Click(link);
    }
  };
  WL.Estiah.Deck.AddCharm = function (Data) {
    var runes =
      Data.rune.substring(0, 1).toUpperCase() +
      Data.rune.substring(1) +
      (Data.rune2 != "null"
        ? " / " +
          Data.rune2.substring(0, 1).toUpperCase() +
          Data.rune2.substring(1)
        : "");
    with (WL.Node.Select('//div[@id="DeckCurrent"]')) {
      with (appendChild(
        WL.Node.Create("div", [
          ["class", "card"],
          ["id", "DeckCard" + Data.id],
        ])
      )) {
        appendChild(WL.Node.Create("a", [["class", "func"]], "[=]"));
        appendChild(
          WL.Node.Create(
            "a",
            [
              ["href", "/card/" + Data.id],
              ["class", "func BV_deck_remove"],
              ["onlick", "return false;"],
            ],
            "[-]"
          )
        );
        with (appendChild(WL.Node.Create("div", [["class", "name"]]))) {
          with (appendChild(
            WL.Node.Create(
              "a",
              [["class", "gm_popup c" + Data.rarity]],
              Data.name + " "
            )
          )) {
            with (appendChild(
              WL.Node.Hide(
                WL.Node.Create("div", [
                  ["class", "common_file floating opacity bd1"],
                  ["style", "font-weight: normal;"],
                ])
              )
            )) {
              appendChild(
                WL.Node.Create(
                  "div",
                  [["class", "title2 c" + Data.rarity]],
                  "Charm: " +
                    Data.name +
                    " (" +
                    Data.rarity.substring(0, 1).toUpperCase() +
                    Data.rarity.substring(1) +
                    ")"
                )
              );
              appendChild(
                WL.Node.Create(
                  "div",
                  [["class", "description2"]],
                  Data.description +
                    '<br><br><span class="c2">Runes: ' +
                    runes +
                    "</span>"
                )
              );
            }
          }
          innerHTML += "x";
          appendChild(
            WL.Node.Create(
              "span",
              [["id", "DeckCardCount" + Data.id]],
              Data.count
            )
          );
        }
        with (appendChild(WL.Node.Create("div", [["class", "runes"]]))) {
          appendChild(
            WL.Node.Create("div", [
              [
                "class",
                "minirune minirune_" +
                  Data.rune +
                  " " +
                  (Data.rune2 == "null" ? "single" : ""),
              ],
            ])
          );
          appendChild(
            WL.Node.Create("div", [
              ["class", "minirune minirune_" + Data.rune2],
            ])
          );
        }
      }
    }
    for (var i = 0; i < Data.count; i++)
      WL.Node.Select('//strong[@id="DeckTotal"]').innerHTML++;
    WL.Script.Run(
      'System.selectiveRegister(Deck.rules, "#DeckCard' +
        Data.id +
        '", [ ".BV_deck_remove" ])'
    );
  };
  WL.Estiah.Deck.AddArchived = function (charm, count) {
    var id, rune1, rune2;
    id = charm.parentNode.parentNode.getAttribute("id").substring(4);
    rune1 = top.frames[0].document.evaluate(
      'div[contains(@class, "minirune_l")]',
      charm.parentNode,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    rune1 = rune1.getAttribute("class").substring(29);
    rune1 = rune1.substring(0, rune1.indexOf(" "));
    rune2 = top.frames[0].document.evaluate(
      'div[contains(@class, "minirune_r")]',
      charm.parentNode,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (rune2 != null) {
      rune2 = rune2.getAttribute("class").substring(29);
      rune2 = rune2.substring(0, rune2.indexOf(" "));
    } else rune2 = "null";
    count2 = top.frames[0].document.evaluate(
      'div[contains(@class, "count")]',
      charm.parentNode,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue.innerHTML;
    var data = {};
    data.id = id;
    data.rune = rune1;
    data.rune2 = rune2;
    data.name = charm.innerHTML;
    data.rarity = charm.getAttribute("class").substring(6);
    if (count2 < count) {
      WL.Estiah.Deck.Msg(
        count - count2 + "x" + data.name + " was not found!<br>",
        true
      );
      WL.Estiah.Missing += parseInt(count - count2);
    }
    data.count = Math.min(count, count2);
    data.description = top.frames[0].document.evaluate(
      'div[contains(@class, "description")]',
      charm.parentNode,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
      null
    ).singleNodeValue.innerHTML;
    WL.Estiah.Deck.AddCharm(data);
  };
  WL.Estiah.Deck.Errors = function () {
    var i;
    WL.Estiah.Deck.Msg(WL.Estiah.Msg);
    var charmnames = [];
    WL.Node.ForEach(
      '//div[@id="wl_extragears"]/div[@class="wl_extragears_missing"]',
      function (node) {
        var count, charm, id, type;
        count = node.getAttribute("count");
        id = node.getAttribute("charm");
        type = node.getAttribute("type");
        WL.Node.Remove(node);
        if (type == "id") {
          charm = top.frames[0].document.evaluate(
            '//div[@id="Card' +
              id +
              '"]/div/div[substring-before(@class, " ")="name"]',
            top.frames[0].document,
            null,
            XPathResult.ANY_UNORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          if (charm == null) {
            WL.Estiah.Deck.Msg(count + "x" + id + " was not found!<br>", true);
            WL.Estiah.Missing += parseInt(count);
            return;
          }
          WL.Estiah.Deck.AddArchived(charm, count);
        } else charmnames.push({ name: id, count: count });
      }
    );
    //add by name
    if (charmnames.length > 0) {
      //alert('//div[contains(@class, "cardframe")]/div/div[substring-before(@class, " ")="name" and . = "' + WL.String.Replace(id, " ", "&nbsp;") + '"]');
      //charm = top.frames[0].document.evaluate('//div[contains(@class, "cardframe")]/div/div[substring-before(@class, " ")="name" and . = "' + WL.String.Replace(id, " ", "&nbsp;") + '"]', top.frames[0].document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      WL.Node.ForEach(
        '//div[contains(@class, "cardframe")]/div/div[substring-before(@class, " ")="name"]',
        function (node) {
          for (var i = 0; i < charmnames.length; i++) {
            //if (node.innerHTML.substring(0, charmnames[i]["name"].length) == charmnames[i]["name"])
            if (node.innerHTML == charmnames[i]["name"]) {
              WL.Estiah.Deck.AddArchived(node, charmnames[i]["count"]);
              charmnames.splice(i, 1);
              if (charmnames.length == 0) return false;
              return;
            }
          }
        },
        top.frames[0].document,
        true
      );
      if (charmnames.length > 0) {
        //still missing ones
        for (i = 0; i < charmnames.length; i++) {
          WL.Estiah.Deck.Msg(
            charmnames[i]["count"] +
              "x" +
              charmnames[i]["name"] +
              " was not found!<br>",
            true
          );
          WL.Estiah.Missing += parseInt(charmnames[i]["count"]);
        }
      }
    }
    if (WL.Estiah.Deck.Save === true) {
      WL.Node.Select('//strong[@id="DeckTotal"]').addEventListener(
        "DOMSubtreeModified",
        function () {
          if (this.innerHTML == WL.Estiah.Spirit - WL.Estiah.Missing) {
            this.removeEventListener(
              "DOMSubtreeModified",
              arguments.callee,
              false
            );
            if (WL.Estiah.Missing > 0)
              if (
                !confirm(
                  "Could not load " +
                    WL.Estiah.Missing +
                    " charm(s). Save anyway?"
                )
              )
                return;
            WL.Node.Click(
              WL.Node.Select('//a[@id="wl_extragears_extra2normal"]')
            );
          }
        },
        false
      );
      //already done?
      if (
        WL.Node.Select('//strong[@id="DeckTotal"]').innerHTML ==
        WL.Estiah.Spirit - WL.Estiah.Missing
      )
        WL.Node.Select('//strong[@id="DeckTotal"]').innerHTML =
          WL.Estiah.Spirit - WL.Estiah.Missing;
    }
  };
  WL.Estiah.Deck.RemoveAlert = function () {
    var node;
    if (
      (node = WL.Node.Select('//div[contains(@class, "cardlist active")]')) !==
      null
    )
      node.setAttribute("class", "cardlist active bg1 outline bd1");
    if (
      (node = WL.Node.Select('//div[contains(@class, "panel outline")]')) !==
      null
    ) {
      node.setAttribute("class", "panel outline");
      WL.Node.Hide(WL.Node.Select('//div[@id="DeckSaveAlert"]'));
    }
  };
  WL.Estiah.Deck.LoadExtraGears = function (minimal) {
    //create gear containers
    with (WL.Node.Select('//div[@id="wl_extragears_container"]')) {
      innerHTML = "";
      with (appendChild(
        WL.Node.Create("div", [
          ["id", "wl_extragears_active"],
          ["class", "decklist format"],
        ])
      )) {
        appendChild(
          WL.Button.Create("View archived gears", 3, function () {
            //show archive
            WL.Node.Hide(WL.Node.Select('//div[@id="wl_extragears_active"]'));
            WL.Node.Show(WL.Node.Select('//div[@id="wl_extragears_archived"]'));
          })
        );
        // appendChild(
        //   WL.Button.Create("View archived gears", 3, function () {
        //     //show archive
        //     WL.Node.Hide(WL.Node.Select('//div[@id="wl_extragears_active"]'));
        //     WL.Node.Show(WL.Node.Select('//div[@id="wl_extragears_archived"]'));
        //   })
        // );
      }
      with (appendChild(
        WL.Node.Hide(
          WL.Node.Create("div", [
            ["id", "wl_extragears_archived"],
            ["class", "decklist format"],
          ])
        )
      )) {
        appendChild(
          WL.Button.Create("View active gears", 3, function () {
            //show active
            WL.Node.Hide(WL.Node.Select('//div[@id="wl_extragears_archived"]'));
            WL.Node.Show(WL.Node.Select('//div[@id="wl_extragears_active"]'));
          })
        );
        // appendChild(
        //   WL.Button.Create("View active gears", 3, function () {
        //     //show active
        //     WL.Node.Hide(WL.Node.Select('//div[@id="wl_extragears_archived"]'));
        //     WL.Node.Show(WL.Node.Select('//div[@id="wl_extragears_active"]'));
        //   })
        // );
      }
    }
    //load all groups/gears
    // WL.Estiah.Gearbox = JSON.parse(
    //   WL.Data.Load(extragears_name + "_gears_" + WL.Estiah.Deck.EGID, "")
    // );
    var temp1 = WL.Data.Load(
      extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
      ""
    );
    var temp2 = temp1.replace(/"\[/g, "[");
    var temp3 = temp2.replace(/]"/g, "]");
    var temp4 = temp3.replace(/\\"/g, '"');
    var temp5 = temp4.replace(/"\//g, '"');
    WL.Estiah.Gearbox = JSON.parse(temp5);
    for (type in WL.Estiah.Gearbox) {
      //add ability to create new group
      var temp = WL.Node.Select('//div[@id="wl_extragears_' + type + '"]');
      with (temp.insertBefore(
        WL.Node.Create("div", [
          ["class", "deck highlight"],
          ["style", "display: none"],
        ]),
        temp.firstChild.nextSibling
      )) {
        with (appendChild(WL.Node.Create("div", [["class", "name"]])))
          with (appendChild(WL.Node.Create("a", [["class", "nolink"]])))
            appendChild(
              WL.Node.Create("input", [
                ["class", "input bd1 c2"],
                ["size", "20"],
              ])
            );
        appendChild(
          WL.Node.Create(
            "a",
            [["class", "func_sec lhp"]],
            "[Create New Group]",
            function () {
              //create group
              var type, gid, temp, group;
              type = this.parentNode.parentNode
                .getAttribute("id")
                .substring(14);
              gid = WL.Data.Load(extragears_name + "_gid", 1);
              temp = this.previousSibling.firstChild.firstChild;
              WL.Estiah.Deck.AddGroup(
                WL.Estiah.Gearbox[type].length,
                gid + "_" + temp.value,
                type
              );
              group = {};
              group.id = gid + "_" + temp.value;
              group.gears = [];
              //debug start
              if (
                group == null ||
                group.id == null ||
                type == null ||
                temp == null ||
                temp.value == null
              ) {
                GM_log(
                  "Debug: new group, id: " +
                    group.id +
                    ", name: " +
                    temp.value +
                    ", type: " +
                    type
                );
                GM_log(
                  WL.Data.Load(
                    extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
                    ""
                  )
                );
                alert(
                  "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
                );
                return;
              }
              //debug end
              WL.Estiah.Gearbox[type].push(group);
              temp.value = "";
              WL.Estiah.Deck.SaveGearbox();
              WL.Data.Save(extragears_name + "_gid", gid + 1);
            }
          )
        );
      }
      for (group in WL.Estiah.Gearbox[type]) {
        //debug start
        if (WL.Estiah.Gearbox[type][group] == null) {
          GM_log("Debug: dead group, group: " + group);
          GM_log(
            WL.Data.Load(extragears_name + "_gears_" + WL.Estiah.Deck.EGID, "")
          );
          alert(
            "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
          );
          return;
        }
        //debug end
        while (typeof WL.Estiah.Gearbox[type][group] == "string") {
          WL.Estiah.Gearbox[type].splice(group, 1);
        }
        if (group >= WL.Estiah.Gearbox[type].length) break;
        WL.Estiah.Deck.AddGroup(
          group,
          WL.Estiah.Gearbox[type][group]["id"],
          type
        );
        //debug start
        for (gears in WL.Estiah.Gearbox[type][group]["gears"]) {
          if (!isNaN(gears)) {
            while (
              gears < WL.Estiah.Gearbox[type][group]["gears"].length &&
              WL.Estiah.Gearbox[type][group]["gears"][gears] == null
            ) {
              WL.Estiah.Gearbox[type][group]["gears"].splice(gears, 1);
              alert("invalid (null) gear detected and deleted");
            }
            if (gears >= WL.Estiah.Gearbox[type][group]["gears"].length) break;
            if (minimal)
              WL.Estiah.Deck.AddGear2(
                WL.Estiah.Gearbox[type][group]["gears"][gears],
                WL.Estiah.Gearbox[type][group]["id"]
              );
            else
              WL.Estiah.Deck.AddGear(
                WL.Estiah.Gearbox[type][group]["gears"][gears],
                WL.Estiah.Gearbox[type][group]["id"]
              );
          }
        }
        //debug end
        /*
			for (gears in WL.Estiah.Gearbox[type][group]["gears"])
				WL.Estiah.Deck.AddGear(WL.Estiah.Gearbox[type][group]["gears"][gears], WL.Estiah.Gearbox[type][group]["id"]);
			*/
      }
    }
    WL.Estiah.Deck.SaveGearbox();
  };
  WL.Estiah.Deck.DI = 0;
  WL.Estiah.Deck.AddGear2 = function (gearid, type) {
    //add gear
    var name, deck, buttons;
    name = gearid.substring(gearid.indexOf("_") + 1);
    with (WL.Node.Select('//div[@id="wl_extragroups_' + type + '"]'))
      with (appendChild(
        WL.Node.Create("div", [
          ["class", "deck highlight"],
          ["style", "overflow: hidden; height: 18px;"],
        ])
      ))
        with (appendChild(WL.Node.Create("div", [["class", "name"]])))
          appendChild(
            WL.Node.Create(
              "a",
              [
                ["id", "wl_extragears_" + gearid],
                ["class", "nolink"],
              ],
              name,
              function () {
                var gearid = this.getAttribute("id").substring(14);
                var gear = WL.Data.Load(extragears_name + "_gear_" + gearid);
                WL.Script.Run(
                  "wl_saveextragear(" +
                    WL.Estiah.Deck.DI +
                    ', "' +
                    name +
                    '","' +
                    gear +
                    '")'
                );
              }
            )
          );
  };
  WL.Estiah.Page.ExtraGears = function () {
    WL.CSS.Add(
      ".decklist .deck { width: 100%; margin:8px 0 0 0; } .decklist .deck .name { width:56% !important; height:18px; margin:0 0 0 0; overflow:hidden; font-size:14px; font-weight:bold; } .wireframe_deck .func_sec { display:inline; float:left; text-decoration:none; margin:4px 0 0 4px; font-size:10px; } .wireframe_deck .entry { width:97%; margin:4px 0 0 6px; } .wl_deckinfo:hover #DeckList { display: inline !important; }"
    );
    WL.Script.New("wl_saveextragearresponse", function (r) {
      var response = r.responseText.evalJSON(true);
      System.clear($("DeckSummary"));
      if (response.success) System.status($("DeckSummary"), 3);
      else {
        System.status($("DeckSummary"), 2);
      }
      if (System.isset(response.updates)) {
        for (var name in response.updates) {
        }
        $("wl_deck" + name.substring(9)).update(response.updates[name]);
      }
      $("DeckSummary").insert(response.msg);
    });
    WL.Script.New("wl_listextragearresponse", function (r) {
      var response = r.responseText.evalJSON(true);
      System.clear($("DeckList"));
      if (response.success) System.status($("DeckList"), 3);
      else {
        System.status($("DeckList"), 2);
      }
      if (System.isset(response.updates)) {
        for (var name in response.updates) {
        }
        $("wl_deck" + name.substring(9)).update(response.updates[name]);
      }
      $("DeckList").insert(response.msg);
    });
    WL.Script.New("wl_saveextragear", function (deckid, name, gear) {
      /*build data*/
      var param = {
        DeckId: deckid,
        DeckName: name,
        DeckCardlist: new Array(),
      };

      var cards = gear.split(" ");
      for (var i = 0; i < cards.length; i++) {
        param.DeckCardlist.push({
          id: cards[i].substring(2),
          count: cards[i].substring(0, 1),
        });
      }

      System.ajax("http://www.estiah.com/json/character/deck/save", {
        method: "post",
        parameters: { json: Object.toJSON(param) },
        onSuccess: wl_saveextragearresponse,
      });

      System.ajax(
        "http://www.estiah.com/json/character/deck/save/mode/export",
        {
          method: "post",
          parameters: { json: Object.toJSON(param) },
          onSuccess: wl_listextragearresponse,
        }
      );

      return false;
    });
    //extragears page
    page = WL.Estiah.Page.New("ExtraGears", "Quick loading of ExtraGears.");
    WL.Estiah.Show(page, allinone_name + " - ExtraGears - Estiah");
    with (page.firstChild) {
      with (appendChild(
        WL.Node.Create("div", [
          ["class", "wireframe_deck"],
          ["style", "width: 350px;"],
        ])
      )) {
        with (appendChild(
          WL.Node.Create("div", [["class", "decklist format"]])
        )) {
          WL.Node.ForEach(
            '//div[@class="left"]/a[contains(@href, "/character/deck/index/id")]',
            function (node, i) {
              var deckid = node.getAttribute("href").substring(25);
              if (i == 0) WL.Estiah.Deck.DI = deckid;
              with (appendChild(
                WL.Node.Create("div", [["class", "deck highlight"]])
              ))
                with (appendChild(WL.Node.Create("div", [["class", "name"]])))
                  appendChild(
                    WL.Node.Create(
                      "a",
                      [
                        ["id", "wl_deck" + deckid],
                        ["class", "nolink" + (i == 0 ? " c2" : "")],
                      ],
                      node.innerHTML,
                      function () {
                        WL.Estiah.Deck.DI =
                          this.getAttribute("id").substring(7);
                        var old = WL.Node.Select(
                          '//div[@class="deck highlight"]/div/a[contains(@class, "c2")]'
                        );
                        if (old != null)
                          old.setAttribute(
                            "class",
                            WL.String.Replace(
                              old.getAttribute("class"),
                              " c2",
                              ""
                            )
                          );
                        this.setAttribute("class", "nolink c2");
                      }
                    )
                  );
            }
          );
        }
        if (WL.Data.Load(altslist_name + "_enabled")) {
          with (appendChild(
            WL.Node.Create("select", [["id", "wl_extragears_egid"]])
          )) {
            var alts = JSON.parse(WL.Data.Load(altslist_name + "_alts", "{}"));
            for (var alt in alts) {
              appendChild(
                WL.Node.Create("option", [["value", alt]], alts[alt]["name"])
              );
            }
          }
          appendChild(
            WL.Button.Create("Load ExtraGears", 1, function () {
              WL.Estiah.Deck.EGID = WL.Node.Select(
                '//select[@id="wl_extragears_egid"]'
              ).value;
              WL.Estiah.Deck.LoadExtraGears();
            })
          );
        }
        appendChild(
          WL.Node.Create("div", [
            ["id", "wl_extragears_container"],
            ["style", "margin-top: 10px"],
          ])
        );
      }
      with (appendChild(
        WL.Node.Create("div", [
          ["class", "wireframe_deck wl_deckinfo"],
          ["style", "width: 400px;"],
        ])
      )) {
        appendChild(
          WL.Node.Create("div", [
            ["id", "DeckSummary"],
            ["class", "entry log bg1"],
            ["style", "position: fixed; width: 400px;"],
          ])
        );
        appendChild(
          WL.Node.Hide(
            WL.Node.Create("div", [
              ["id", "DeckList"],
              ["class", "entry log bg1"],
              ["style", "position: fixed; width: 400px;"],
            ])
          )
        );
      }
    }
    WL.Estiah.Deck.LoadExtraGears(true);
  };

  //addon
  if (WL.Data.Load(extragears_name + "_enabled")) {
    WL.Addon.MenuEntry("ExtraGears", WL.Estiah.Page.ExtraGears);
    if (top.document.title == "Gear - Estiah") {
      var gearid, clearbutton;
      WL.CSS.Add(
        ".decklist .deck .name { width:56% !important; } .gm_popup:hover div { display:inline !important; } .title2 { width: 200px; margin: 0 0 0 8px; font-weight: bold; font-size: 12px; } .description2 { overflow-x: auto; overflow-y: auto; margin: 10px 0 0 8px; width: 200px; font-size: 11px; }"
      );
      gearid =
        window.location.href.length >
        WL.Globals.Options.Domain.Value.length + 25
          ? window.location.href.substring(
              WL.Globals.Options.Domain.Value.length + 25
            )
          : WL.Node.Select(
              '//a[contains(@href, "/json/character/deck/load/id/")]'
            )
              .getAttribute("href")
              .substring(29);
      WL.Node.Select('//a[@href="/json/character/deck/save"]').setAttribute(
        "id",
        "wl_extragears_normal2normal"
      );
      WL.Estiah.Deck.Extra = WL.Node.Hide(
        WL.Node.Create("div", [
          ["id", "wl_extragears"],
          ["wl_extragears_buttons", "normal"],
          ["wl_extragears_extra", ""],
          ["wl_extragears_normal", gearid],
        ])
      );
      clearbutton = WL.Node.Select('//a[@class="BV_deck_remove_all"]');
      clearbutton.parentNode.insertBefore(
        WL.Node.Create("a", [], "[Refresh]", function () {
          WL.Estiah.Deck.Load(WL.Estiah.Deck.Export());
          WL.Estiah.Deck.RemoveAlert();
        }),
        clearbutton
      );
      with (WL.Node.Select('//div[@class="z2 format log"]')) {
        with (appendChild(WL.Estiah.Deck.Extra)) {
          appendChild(
            WL.Button.Create(
              "Save",
              1,
              function () {
                //save gear from extra to extra
                var oldid, id, name, deck, gears, pos;
                oldid = WL.Estiah.Deck.Extra.getAttribute(
                  "wl_extragears_extra"
                );
                name = WL.Estiah.Deck.GetName();
                if (name != oldid.substring(oldid.indexOf("_") + 1)) {
                  if (
                    !confirm(
                      "Overwrite gear '" +
                        oldid.substring(oldid.indexOf("_") + 1) +
                        "' with gear '" +
                        name +
                        "'?"
                    )
                  )
                    return;
                  id = oldid.substring(0, oldid.indexOf("_")) + "_" + name;
                  WL.Data.Delete(extragears_name + "_gear_" + oldid);
                  deck = WL.Node.Select(
                    '//a[@id="wl_extragears_' + oldid + '"]'
                  );
                  gears =
                    WL.Estiah.Gearbox[
                      deck.parentNode.parentNode.parentNode.parentNode.getAttribute(
                        "type"
                      )
                    ][
                      deck.parentNode.parentNode.parentNode.parentNode.getAttribute(
                        "pos"
                      )
                    ]["gears"];
                  pos = gears.indexOf(oldid);
                  //debug start
                  if (
                    pos == null ||
                    id == null ||
                    deck == null ||
                    gears == null
                  ) {
                    GM_log(
                      "Debug: rename gear, oldid: " +
                        oldid +
                        ", id: " +
                        id +
                        ", gears: " +
                        gears +
                        ", pos: " +
                        pos
                    );
                    GM_log(
                      WL.Data.Load(
                        extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
                        ""
                      )
                    );
                    alert(
                      "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
                    );
                    return;
                  }
                  //debug end
                  gears.splice(pos, 1, id);
                  WL.Estiah.Deck.SaveGearbox();
                  deck.setAttribute("id", "wl_extragears_" + id);
                  deck.innerHTML = name;
                } else id = oldid;
                WL.Data.Save(
                  extragears_name + "_gear_" + id,
                  WL.Estiah.Deck.Export()
                );
                WL.Estiah.Deck.RemoveAlert();
                WL.Estiah.Deck.Msg(
                  '<div class="orb orb_c3"></div>\'' +
                    name +
                    "' has been successfully saved."
                );
              },
              "wl_extragears_extra2extra"
            )
          );
          appendChild(
            WL.Button.Create(
              "Save in gear slot",
              1,
              function () {
                //save gear from extra to normal
                WL.Estiah.Deck.Save = false;
                //show normal buttons
                if (
                  WL.Estiah.Deck.Extra.getAttribute("wl_extragears_buttons") !=
                  "normal"
                ) {
                  WL.Node.Select('//div[@id="DeckStatus"]').insertBefore(
                    WL.Node.Select('//a[@id="wl_extragears_normal2normal"]/..'),
                    WL.Node.Select('//a[@id="wl_extragears_extra2extra"]/..')
                  );
                  WL.Estiah.Deck.Extra.appendChild(
                    WL.Node.Select('//a[@id="wl_extragears_extra2extra"]/..')
                  );
                  WL.Node.Select('//div[@id="DeckStatus"]').insertBefore(
                    WL.Node.Select('//a[@id="wl_extragears_normal2extra"]/..'),
                    WL.Node.Select('//a[@id="wl_extragears_extra2normal"]/..')
                  );
                  WL.Estiah.Deck.Extra.appendChild(
                    WL.Node.Select('//a[@id="wl_extragears_extra2normal"]/..')
                  );
                  WL.Estiah.Deck.Extra.setAttribute(
                    "wl_extragears_buttons",
                    "normal"
                  );
                }
                WL.Node.Click(
                  WL.Node.Select('//a[@id="wl_extragears_normal2normal"]')
                );
                WL.Node.Select(
                  '//a[@id="wl_extragears_' +
                    WL.Estiah.Deck.Extra.getAttribute("wl_extragears_extra") +
                    '"]'
                ).setAttribute("class", "nolink BV_deck_change");
                var click = WL.Node.Select(
                  '//a[contains(@class, "PT_update_deck_name' +
                    WL.Estiah.Deck.Extra.getAttribute("wl_extragears_normal") +
                    '")]'
                );
                click.setAttribute(
                  "class",
                  WL.String.Replace(
                    click.getAttribute("class"),
                    "BV_deck_change",
                    "BV_deck_change c2"
                  )
                );
              },
              "wl_extragears_extra2normal"
            )
          );
          with (appendChild(
            WL.Node.Create("div", [["id", "wl_extragears_import"]])
          )) {
            appendChild(
              WL.Node.Create("textarea", [
                ["class", "c2 bd1 textarea"],
                ["style", "margin-left: 40px"],
              ])
            );
            with (appendChild(WL.Node.Create("div"))) {
              appendChild(
                WL.Button.Create("Show", 1, function () {
                  //import
                  var gear =
                    this.parentNode.parentNode.parentNode.firstChild.value.split(
                      WL.Globals.Options.Split.Value
                    );
                  if (gear.length > 1) WL.Estiah.Deck.SetName(gear.shift());
                  WL.Estiah.Deck.Load(gear.shift());
                  this.parentNode.parentNode.parentNode.firstChild.value = "";
                })
              );
              appendChild(
                WL.Button.Create("Load", 1, function () {
                  //import+save
                  var gear =
                    this.parentNode.parentNode.parentNode.firstChild.value.split(
                      WL.Globals.Options.Split.Value
                    );
                  if (gear.length > 1) WL.Estiah.Deck.SetName(gear.shift());
                  WL.Estiah.Deck.Save = true;
                  WL.Estiah.Deck.Load(gear.shift());
                  this.parentNode.parentNode.parentNode.firstChild.value = "";
                })
              );
              appendChild(
                WL.Button.Create("Close", 1, function () {
                  //close
                  WL.Estiah.Deck.Extra.appendChild(
                    this.parentNode.parentNode.parentNode
                  );
                })
              );
            }
          }
        }
      }
      with (WL.Node.Select('//div[@id="DeckStatus"]')) {
        appendChild(
          WL.Button.Create(
            "Save as ExtraGear",
            1,
            function () {
              //save gear from normal to extra
              var name, id;
              name = WL.Estiah.Deck.GetName();
              id = WL.Data.Load(extragears_name + "_id", 1);
              WL.Data.Save(extragears_name + "_id", id + 1);
              id = id + "_" + name;
              //debug start
              if (id == null || name == null) {
                GM_log("Debug: new gear, id: " + id + ", name: " + name);
                GM_log(
                  WL.Data.Load(
                    extragears_name + "_gears_" + WL.Estiah.Deck.EGID,
                    ""
                  )
                );
                alert(
                  "Bug detected, please send Error Console (Ctrl+Shift+J) content to Sheira"
                );
                return;
              }
              //debug end
              WL.Data.Save(
                extragears_name + "_gear_" + id,
                WL.Estiah.Deck.Export()
              );
              WL.Estiah.Gearbox["active"][0]["gears"].push(id);
              WL.Estiah.Deck.SaveGearbox();
              WL.Estiah.Deck.AddGear(id, WL.Estiah.Gearbox["active"][0]["id"]);
              //WL.Node.Click(WL.Node.Select('//a[@id="wl_extragears_' + id + '"]'));
              WL.Estiah.Deck.Msg(
                '<div class="orb orb_c3"></div>\'' +
                  name +
                  "' has been successfully saved as extra gear."
              );
            },
            "wl_extragears_normal2extra"
          )
        );
        appendChild(
          WL.Button.Create("Export", 6, function () {
            //export
            var name = WL.Estiah.Deck.GetName();
            WL.Estiah.Deck.Msg(
              '<div class="orb orb_c3"></div>Gear \'' +
                name +
                "':<br><br>" +
                name +
                WL.Globals.Options.Split.Value +
                WL.Estiah.Deck.Export()
            );
          })
        );
        appendChild(
          WL.Button.Create("Import", 6, function () {
            //show import
            WL.Estiah.Deck.Msg("");
            WL.Node.Select('//div[@id="DeckStatus"]').appendChild(
              WL.Node.Select('//div[@id="wl_extragears_import"]')
            );
          })
        );
      }
      //register click on normal gears
      WL.Node.Select('//div[@class="decklist format"]').addEventListener(
        "click",
        function (event) {
          if (
            event.target.getAttribute("href") == null ||
            event.target.getAttribute("href").substring(0, 26) !=
              "/json/character/deck/load/"
          )
            return;
          WL.Estiah.Deck.Extra.setAttribute(
            "wl_extragears_normal",
            event.target.getAttribute("href").substring(29)
          );
          //show normal buttons
          if (
            WL.Estiah.Deck.Extra.getAttribute("wl_extragears_buttons") !=
            "normal"
          ) {
            WL.Node.Select('//div[@id="DeckStatus"]').insertBefore(
              WL.Node.Select('//a[@id="wl_extragears_normal2normal"]/..'),
              WL.Node.Select('//a[@id="wl_extragears_extra2extra"]/..')
            );
            WL.Estiah.Deck.Extra.appendChild(
              WL.Node.Select('//a[@id="wl_extragears_extra2extra"]/..')
            );
            WL.Node.Select('//div[@id="DeckStatus"]').insertBefore(
              WL.Node.Select('//a[@id="wl_extragears_normal2extra"]/..'),
              WL.Node.Select('//a[@id="wl_extragears_extra2normal"]/..')
            );
            WL.Estiah.Deck.Extra.appendChild(
              WL.Node.Select('//a[@id="wl_extragears_extra2normal"]/..')
            );
            WL.Estiah.Deck.Extra.setAttribute(
              "wl_extragears_buttons",
              "normal"
            );
            //deselect extragear
            var old, gearid;
            gearid =
              "wl_extragears_" +
              WL.Estiah.Deck.Extra.getAttribute("wl_extragears_extra");
            old = WL.Node.Select('//a[@id="' + gearid + '"]');
            old.setAttribute(
              "class",
              WL.String.Replace(old.getAttribute("class"), " c2", "")
            );
          }
        },
        false
      );
      //extragears 0.3 to 0.4 conversion
      if (
        WL.Data.Load(
          extragears_name + "_gears_" + WL.Globals.PlayerID,
          ""
        ).substring(0, 1) != "{"
      ) {
        WL.Estiah.Gearbox = JSON.parse(
          '{"active":[{"id":"0_Active Gears", "gears":[]}], "archived":[{"id":"0_Archived Gears", "gears":[]}]}'
        );
        WL.List.ForEach(
          extragears_name + "_gears_" + WL.Globals.PlayerID,
          function (item) {
            WL.Estiah.Gearbox["active"][0]["gears"].push(item);
          }
        );
        WL.List.ForEach(
          extragears_name + "_agears_" + WL.Globals.PlayerID,
          function (item) {
            WL.Estiah.Gearbox["archived"][0]["gears"].push(item);
          }
        );
        WL.Estiah.Deck.SaveGearbox();
        WL.Data.Delete(extragears_name + "_agears_" + WL.Globals.PlayerID);
      }
      with (WL.Node.Select('//div[@id="Deck"]').parentNode) {
        with (appendChild(WL.Node.Create("div"))) {
          if (WL.Data.Load(altslist_name + "_enabled")) {
            with (appendChild(
              WL.Node.Create("select", [["id", "wl_extragears_egid"]])
            )) {
              var alts = JSON.parse(
                WL.Data.Load(altslist_name + "_alts", "{}")
              );
              for (var alt in alts) {
                appendChild(
                  WL.Node.Create("option", [["value", alt]], alts[alt]["name"])
                );
              }
            }
            appendChild(
              WL.Button.Create("Load ExtraGears", 1, function () {
                WL.Estiah.Deck.EGID = WL.Node.Select(
                  '//select[@id="wl_extragears_egid"]'
                ).value;
                WL.Estiah.Deck.LoadExtraGears();
              })
            );
          }
          appendChild(
            WL.Node.Create("div", [
              ["id", "wl_extragears_container"],
              ["style", "margin-top: 10px"],
            ])
          );
        }
      }
      WL.Estiah.Deck.LoadExtraGears();
    }
    if (
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 25
      ) ==
      WL.Globals.Options.Domain.Value + "/character/combat/replay/"
    ) {
      temp = WL.Node.Select('//div[@class="section_text format"]');
      if (temp != null) {
        temp.appendChild(WL.Node.Create("br"));
        temp.appendChild(
          WL.Node.Create("a", [], "Export to ExtraGears", function () {
            var gear, list;
            gear = "Replay#";
            WL.Node.ForEach(
              '//div[@class="section_text format"]/a[@class!="nolink"]',
              function (node) {
                gear +=
                  node.nextSibling.nodeValue.substring(2, 3) +
                  "x" +
                  node.getAttribute("href").substring(6) +
                  " ";
              }
            );
            //WL.Node.Select('//div[@class="section_text format"]').innerHTML = temp;
            list = this.parentNode;
            list.removeChild(this);
            list.innerHTML += gear;
          })
        );
        temp.appendChild(WL.Node.Create("br"));
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  //multiarena
  ////////////////////////////////////////////////////////////////

  //info
  var multiarena_name = "MultiArena";
  var multiarena_version = "0.4.0";
  WL.Addon.Register(
    multiarena_name,
    "This addon allows you to fight multiple times in the arena with one click.",
    multiarena_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(multiarena_name + "_enabled")) {
    if (top.document.title == "Arena - Estiah") {
      var clicked;
      //create input
      temp = WL.Node.Select(
        '//div[@class="wireframe_arena common_content common_wl format"]/div[@class="heading_text"]'
      );
      temp.innerHTML += " Match attempts: ";
      temp.appendChild(
        WL.Node.Create("input", [
          ["id", "wl_multiarena_input"],
          ["class", "input bd1 c2"],
          ["size", "1"],
          ["maxlength", "3"],
          ["value", "1"],
        ])
      );
      //save which mob was fought
      WL.Node.Select('//div[@id="VsMobList"]').addEventListener(
        "click",
        function (event) {
          clicked = event.target;
        },
        false
      );
      //fight again
      WL.Node.ForEachNew(WL.Node.Select('//div[@id="VsMsg"]'), function () {
        var input = WL.Node.Select('//input[@id="wl_multiarena_input"]');
        if (input.value > 1) {
          input.value--;
          WL.Node.Click(clicked);
        }
      });
    }
  }

  ////////////////////////////////////////////////////////////////
  //advancedreplay
  ////////////////////////////////////////////////////////////////
}
//info
var advancedreplay_name = "AdvancedReplay";
var advancedreplay_version = "0.5.1";
WL.Addon.Register(
  advancedreplay_name,
  "This addon allows you to watch replays in a whole new way.",
  advancedreplay_version,
  "WL"
);

//functions
WL.Estiah.Battle = {};
WL.Estiah.Battle.Init = function () {
  //stop if addon is disabled
  if (!WL.Data.Load(advancedreplay_name + "_enabled")) return;
  //stop if estiah battle engine is not loaded
  if (!WL.Node.Select('//script[contains(@src, "/js/battle.js")]')) return;
  WL.Script.Replace("Vs.init", "Vs.init2", function () {
    Vs.analyzed = false;
    Vs.init2();
    $("wl_battle_started").setAttribute("status", "yes");
  });
};
WL.Estiah.Battle.Popup = function (node, i) {
  with (node) {
    setAttribute("class", getAttribute("class") + " wl_popup");
    with (appendChild(
      WL.Node.Hide(
        WL.Node.Create("div", [
          ["class", "wl_replaypopup bd1 opacity floating"],
        ])
      )
    )) {
      appendChild(
        WL.Node.Create("strong", [["class", "melee"]], "Melee CPB: ")
      );
      appendChild(
        WL.Node.Create(
          "strong",
          [
            ["id", "Player" + i + "CPBMelee"],
            ["class", "melee"],
          ],
          "- (-)"
        )
      );
      appendChild(WL.Node.Create("br"));
      appendChild(
        WL.Node.Create("strong", [["class", "melee"]], "Melee Next: ")
      );
      appendChild(
        WL.Node.Create(
          "strong",
          [
            ["id", "Player" + i + "NextMelee"],
            ["class", "melee"],
          ],
          "- (-)"
        )
      );
      appendChild(WL.Node.Create("br"));
      appendChild(
        WL.Node.Create("strong", [["class", "magic"]], "Magic CPB: ")
      );
      appendChild(
        WL.Node.Create(
          "strong",
          [
            ["id", "Player" + i + "CPBMagic"],
            ["class", "magic"],
          ],
          "- (-)"
        )
      );
      appendChild(WL.Node.Create("br"));
      appendChild(
        WL.Node.Create("strong", [["class", "magic"]], "Magic Next: ")
      );
      appendChild(
        WL.Node.Create(
          "strong",
          [
            ["id", "Player" + i + "NextMagic"],
            ["class", "magic"],
          ],
          "- (-)"
        )
      );
      appendChild(WL.Node.Create("br"));
      appendChild(
        WL.Node.Create("strong", [["class", "spirit"]], "Spirit CPB: ")
      );
      appendChild(
        WL.Node.Create(
          "strong",
          [
            ["id", "Player" + i + "CPBSpirit"],
            ["class", "spirit"],
          ],
          "- (-)"
        )
      );
      appendChild(WL.Node.Create("br"));
      appendChild(
        WL.Node.Create("strong", [["class", "spirit"]], "Spirit Next: ")
      );
      appendChild(
        WL.Node.Create(
          "strong",
          [
            ["id", "Player" + i + "NextSpirit"],
            ["class", "spirit"],
          ],
          "- (-)"
        )
      );
    }
  }
};

//addon
if (WL.Data.Load(advancedreplay_name + "_enabled")) {
  temp = WL.Node.Select("//body").appendChild(
    WL.Node.Hide(
      WL.Node.Create("div", [
        ["id", "wl_battle_started"],
        ["status", "no"],
        ["loaded", "no"],
      ])
    )
  );
  temp.addEventListener(
    "DOMAttrModified",
    function () {
      //stop if status equals no
      if (this.getAttribute("status") == "no") return;
      this.setAttribute("status", "no");
      //stop if estiah battle engine is not loaded
      if (!WL.Node.Select('//script[contains(@src, "/js/battle.js")]')) return;
      //are functions loaded?
      if (this.getAttribute("loaded") == "no") {
        this.setAttribute("loaded", "yes");
        WL.Script.Run("Vs.replay = Object.toJSON(Vs.data)");
        WL.Script.New("Vs.popups", function () {
          if (System.isset(Vs.data.info)) {
            Vs.data.info.each(function (element) {
              $("VsGain").insert(element);
            });
          }
        });
        WL.Script.Run("Vs.popups()");
        WL.Script.Replace("Vs.update", "Vs.update2", function () {
          /*remove old mouseovers*/
          if (Vs.oldturn && Vs.data.turns[Vs.oldturn]) {
            var info = $("SystemInfoCard" + Vs.data.turns[Vs.oldturn].card.id);
            if (info) info.hide();
          }
          Vs.update2();
          Vs.oldturn = Vs.turn;
          $A(Vs.data.turns[Vs.turn].focus).each(function (e, i) {
            Vs.updatepopup(Vs.data.turns[Vs.turn].players[e], "f" + i);
          });
          System.selectiveRegister(System.rules, "#VsMsg", [".BV_system_file"]);
        });
        WL.Script.New("Vs.show", function (turn) {
          if (turn < 0) turn = 0;
          else if (turn >= Vs.maxturn) turn = Vs.maxturn - 1;
          Vs.turn = turn - 1;
          Vs.next();
        });
        WL.Script.New("Vs.updatepopup", function (data, i) {
          if (Vs.analyzed) {
            $("Player" + i + "CPBMelee").update(
              data.cpbmelee[0] + " (" + data.cpbmelee[1] + ")"
            );
            $("Player" + i + "NextMelee").update(
              data.nextmelee[0] + " (" + data.nextmelee[1] + ")"
            );
            $("Player" + i + "CPBMagic").update(
              data.cpbmagic[0] + " (" + data.cpbmagic[1] + ")"
            );
            $("Player" + i + "NextMagic").update(
              data.nextmagic[0] + " (" + data.nextmagic[1] + ")"
            );
            $("Player" + i + "CPBSpirit").update(
              data.cpbspirit[0] + " (" + data.cpbspirit[1] + ")"
            );
            $("Player" + i + "NextSpirit").update(
              data.nextspirit[0] + " (" + data.nextspirit[1] + ")"
            );
          }
        });
        WL.Script.Replace(
          "Vs.status",
          "Vs.status2",
          function (data, i, active) {
            /*save values*/
            var ac = data.ac;
            var wd = data.wd;
            Vs.status2(data, i, active);
            /*rewrite real values*/
            data.ac = ac;
            data.wd = wd;
            $("Player" + i + "Armor").update(ac);
            $("Player" + i + "Ward").update(wd);
            $("Player" + i + "Willpower").update(data.wp);
            Vs.updatepopup(data, i);
          }
        );
        ////////////////////////////////
        //replay analyzing            //
        ////////////////////////////////
        WL.Script.New("Vs.searchcard", function (id) {
          for (var j = 0; j < Vs.data["info"].length; j++) {
            if (Vs.data["info"][j].indexOf("SystemInfoCard" + id) > -1) {
              return Vs.data["info"][j];
            }
          }
        });
        WL.Script.New(
          "Vs.overtime",
          function (player, active, name, effect, amount, amount2) {
            name = name.substring(0, 1).toUpperCase() + name.substring(1);
            if (active != player) {
              Vs.overtime2(
                "from",
                active,
                name,
                effect + " *",
                amount,
                amount2
              );
              Vs.overtime2("to", player, name, effect, amount, amount2);
              if (
                Vs.aio.data["overtime"][active]["from"][name]["type"] ===
                undefined
              )
                Vs.aio.data["overtime"][active]["from"][name]["type"] =
                  Vs.aio.data["overtime"][player]["from"][name]["type"];
              if (
                Vs.aio.data["overtime"][player]["to"][name]["type"] ===
                undefined
              )
                Vs.aio.data["overtime"][player]["to"][name]["type"] =
                  Vs.aio.data["overtime"][active]["from"][name]["type"];
            } else {
              Vs.overtime2("from", active, name, effect, amount, amount2);
            }
          }
        );
        WL.Script.New(
          "Vs.overtime2",
          function (type, active, name, effect, amount, amount2) {
            /*name = name.substring(0, 1).toUpperCase() + name.substring(1);*/
            if (Vs.aio.data["overtime"][active][type][name] === undefined)
              Vs.aio.data["overtime"][active][type][name] = {};
            if (
              Vs.aio.data["overtime"][active][type][name][effect] === undefined
            )
              Vs.aio.data["overtime"][active][type][name][effect] = {
                tick: 0,
                amount: 0,
                amount2: 0,
              };
            Vs.aio.data["overtime"][active][type][name][effect]["tick"]++;
            Vs.aio.data["overtime"][active][type][name][effect]["amount"] +=
              amount;
            if (amount2 !== undefined)
              Vs.aio.data["overtime"][active][type][name][effect]["amount2"] +=
                amount2;
          }
        );
        WL.Script.New("Vs.modsteal", function (turn, player, type, number) {
          var stolen = -1;
          /*focuscheck*/
          for (var p = 0; p < Vs.data["turns"][turn]["focus"].length; p++) {
            if (
              Vs.data["teams"][Vs.data["turns"][turn]["focus"][p]]["side"] !=
              Vs.data["teams"][player]["side"]
            ) {
              stolen = Vs.data["turns"][turn]["focus"][p];
              break;
            }
          }
          if (stolen < 0) {
            for (var p = 0; p < Vs.data["turns"][turn]["players"].length; p++) {
              if (
                Vs.data["teams"][p]["side"] == Vs.data["teams"][player]["side"]
              )
                continue;
              if (Vs.data["turns"][turn]["players"][p][type][0] == number) {
                if (Vs.data["turns"][turn]["players"][p]["hp"] <= 0) continue;
                stolen = p;
                break;
              }
            }
          }
          if (stolen >= 0) {
            Vs.data["turns"][turn]["players"][stolen][type][1] =
              -Vs.data["turns"][turn]["players"][stolen][type][0];
            Vs.data["turns"][turn]["players"][stolen][type][0] = 0;
          }
        });
        WL.Script.New("Vs.analyze", function () {
          var i,
            j,
            data,
            player,
            players,
            boosts,
            directsteals,
            combo,
            steal,
            direct,
            active,
            effect,
            effects,
            turn,
            a,
            name,
            number,
            info;
          /*need player2id map*/
          players = {};
          Vs.aio = {};
          Vs.aio.data = {};
          Vs.aio.data["overtime"] = [];
          Vs.aio.data["defense"] = [];
          Vs.aio.data["charms"] = [];
          for (player = 0; player < Vs.data["teams"].length; player++) {
            players[Vs.data["teams"][player]["name"]] = {
              nr: player,
              level: Vs.data["teams"][player]["level"],
              mob:
                Vs.data["teams"][player]["avatar"].substring(0, 11) ==
                "/image/mob/",
            };
            Vs.aio.data["overtime"][player] = { from: {}, to: {} };
            Vs.aio.data["defense"][player] = {
              armor: 0,
              ward: 0,
              willpower: 0,
            };
            Vs.aio.data["charms"][player] = {
              count: 0,
              charms: {},
              combos: {},
              rarity: {},
              level: { maxlevel: 0, maxcount: 0 },
              stats: { Pow: 0, Int: 0, Dex: 0, Con: 0 },
              runes: {},
            };
          }
          boosts = [
            "cpbmelee",
            "nextmelee",
            "cpbmagic",
            "nextmagic",
            "cpbspirit",
            "nextspirit",
          ];
          directsteals = ["1805", "1815", "1830", "2847"];
          var typedef = { melee: "armor", magic: "ward", spirit: "willpower" };
          for (turn = 0; turn < Vs.data["turns"].length; turn++) {
            for (
              player = 0;
              player < Vs.data["turns"][turn]["players"].length;
              player++
            ) {
              for (j = 0; j < boosts.length; j++) {
                var type = boosts[j];
                Vs.data["turns"][turn]["players"][player][type] = [
                  turn == 0
                    ? 0
                    : Vs.data["turns"][turn - 1]["players"][player][type][0],
                  0,
                ];
              }
            }
            active = Vs.data["turns"][turn]["active"];
            direct = true;
            combo = false;
            effects = Vs.data["turns"][turn]["log"].split("<br />");
            name = "";
            steal = -1;
            for (i = 0; i < effects.length; i++) {
              prefix = false;
              effect = effects[i];
              /*charm*/
              if (effect.indexOf(" uses ") > -1) {
                if (
                  (a = directsteals.indexOf(
                    Vs.data["turns"][turn]["card"]["id"]
                  )) > -1
                )
                  steal = a;
                /*charm stats*/
                info = Vs.searchcard(Vs.data["turns"][turn]["card"]["id"]);
                var rarity = info.match(/title c([a-z]*)/)[1];
                var charm = info.match(/Charm: ([^ ]*)/)[1];
                if (combo) {
                  if (
                    Vs.aio.data["charms"][active]["combos"][
                      Vs.data["turns"][turn]["card"]["id"]
                    ] === undefined
                  )
                    Vs.aio.data["charms"][active]["combos"][
                      Vs.data["turns"][turn]["card"]["id"]
                    ] = { count: 0, rarity: rarity, name: charm };
                  Vs.aio.data["charms"][active]["combos"][
                    Vs.data["turns"][turn]["card"]["id"]
                  ]["count"]++;
                  continue;
                }
                if (
                  Vs.aio.data["charms"][active]["charms"][
                    Vs.data["turns"][turn]["card"]["id"]
                  ] === undefined
                )
                  Vs.aio.data["charms"][active]["charms"][
                    Vs.data["turns"][turn]["card"]["id"]
                  ] = { count: 0, rarity: rarity, name: charm };
                Vs.aio.data["charms"][active]["charms"][
                  Vs.data["turns"][turn]["card"]["id"]
                ]["count"]++;
                Vs.aio.data["charms"][active]["count"]++;
                if (
                  Vs.aio.data["charms"][active]["rarity"][rarity] === undefined
                )
                  Vs.aio.data["charms"][active]["rarity"][rarity] = 0;
                Vs.aio.data["charms"][active]["rarity"][rarity]++;
                if ((a = info.match(/Requires Level ([0-9]*)/)) !== null) {
                  var level = parseInt(a[1]);
                  if (
                    Vs.aio.data["charms"][active]["level"][level] === undefined
                  )
                    Vs.aio.data["charms"][active]["level"][level] = 0;
                  var value = ++Vs.aio.data["charms"][active]["level"][level];
                  Vs.aio.data["charms"][active]["level"]["maxlevel"] = Math.max(
                    level,
                    Vs.aio.data["charms"][active]["level"]["maxlevel"]
                  );
                  Vs.aio.data["charms"][active]["level"]["maxcount"] = Math.max(
                    value,
                    Vs.aio.data["charms"][active]["level"]["maxcount"]
                  );
                }
                var stats = info.match(
                  /<strong>[0-9]*<\/strong> [A-Za-z]{3}[^A-Za-z]/g
                );
                if (stats !== null) {
                  for (a = 0; a < stats.length; a++) {
                    var match = stats[a].match(
                      /<strong>([0-9]*)<\/strong> ([A-Za-z]{3})/
                    );
                    var stat = match[2];
                    var value = parseInt(match[1]);
                    Vs.aio.data["charms"][active]["stats"][stat] = Math.max(
                      value,
                      Vs.aio.data["charms"][active]["stats"][stat]
                    );
                  }
                }
                var runes = info.match(/Runes: ([^<]*)</)[1].split(" / ");
                for (a = 0; a < runes.length; a++) {
                  var rune = runes[a].toLowerCase();
                  if (
                    Vs.aio.data["charms"][active]["runes"][rune] === undefined
                  )
                    Vs.aio.data["charms"][active]["runes"][rune] = 0;
                  Vs.aio.data["charms"][active]["runes"][rune]++;
                }
                continue;
              }
              /*disappear*/
              if (effect.indexOf("disappear") > -1) continue;
              /*seal fail*/
              if (effect.indexOf("fails to be affected") > -1) continue;
              /*combo*/
              if (effect.indexOf("fusing together") > -1) {
                combo = true;
                continue;
              }
              /*bane tick*/
              if (effect.indexOf("Because of ") == 0) {
                effect = effect.substring(11);
                name = "";
              }
              /*check if overtime and stuff*/
              if ((a = effect.indexOf('<span class="special">')) == 0) {
                name = effect.substring(a + 22, effect.indexOf("</span>", a));
                /*extract effect*/
                if ((a = effect.indexOf('<span class="player">')) > -1) {
                  prefix = true;
                  direct = false;
                  effect = effect.substring(a);
                } else {
                  continue;
                }
              }
              /*check player stuff*/
              if (effect.indexOf('<span class="player">') == 0) {
                a = effect.indexOf("</span>");
                /*getplayername*/
                player = players[effect.substring(21, a)]["nr"];
                effect = effect.substring(a + 7);
                /*lookup effect*/
                /*direct effect*/
                if (direct) {
                  /*immune*/
                  if (effect.indexOf(">immune<") > -1) {
                    if (info.indexOf("</strong> Melee") > -1) {
                      Vs.data["turns"][turn]["players"][
                        Vs.data["turns"][turn]["active"]
                      ]["nextmelee"][1] = 0;
                      Vs.data["turns"][turn]["players"][
                        Vs.data["turns"][turn]["active"]
                      ]["nextmelee"][0] = 0;
                    }
                    if (info.indexOf("</strong> Magic") > -1) {
                      Vs.data["turns"][turn]["players"][
                        Vs.data["turns"][turn]["active"]
                      ]["nextmagic"][1] = 0;
                      Vs.data["turns"][turn]["players"][
                        Vs.data["turns"][turn]["active"]
                      ]["nextmagic"][0] = 0;
                    }
                    continue;
                  }
                }
                /*deal damage*/
                if (effect.indexOf(" takes ") > -1) {
                  a = effect.indexOf('">');
                  var type = effect.substring(20, a);
                  if (direct) {
                    /*takes mod?*/
                    if (
                      info.indexOf(
                        "</strong> " +
                          type.substring(0, 1).toUpperCase() +
                          type.substring(1)
                      ) > -1 ||
                      info.indexOf("</strong> Shifting") > -1
                    ) {
                      Vs.data["turns"][turn]["players"][
                        Vs.data["turns"][turn]["active"]
                      ][
                        "next" + type
                      ][1] = 0; /*-Vs.data["turns"][turn]["players"][Vs.data["turns"][turn]["active"]]["next" + type][0];*/
                      Vs.data["turns"][turn]["players"][
                        Vs.data["turns"][turn]["active"]
                      ]["next" + type][0] = 0;
                    }
                  }
                  var absorb = 0;
                  var pierce = 0;
                  var search = '">';
                  var b;
                  if (
                    (b = Math.max(
                      effect.indexOf(" absorbed"),
                      effect.indexOf(" warded"),
                      effect.indexOf(" resisted")
                    )) > -1
                  ) {
                    absorb = parseInt(
                      effect.substring(effect.lastIndexOf(search, b) + 2, b)
                    );
                    search = ", ";
                  }
                  if ((b = effect.indexOf(" pierced")) > -1) {
                    pierce = parseInt(
                      effect.substring(effect.lastIndexOf(search, b) + 2, b)
                    );
                  }
                  Vs.aio.data["defense"][player][typedef[type]] -=
                    absorb + pierce;
                  if (name != "") {
                    var number = parseInt(
                      effect.substring(a + 2, effect.indexOf(type, a) - 1)
                    );
                    Vs.overtime(player, active, name, type, number, absorb);
                  }
                  continue;
                }
                /*cpb*/
                if ((a = effect.indexOf(" attacks ")) > -1) {
                  var type = effect.substring(3, a);
                  var sign = effect.indexOf("increased") > -1;
                  var number = parseInt(
                    effect.substring(effect.lastIndexOf(" "), effect.length - 7)
                  );
                  number = Math.abs(number);
                  number = sign ? number : -number;
                  /*directsteal*/
                  if (direct && steal > -1) {
                    Vs.modsteal(turn, player, "cpb" + type, number);
                  }
                  /*modcrystal*/
                  if (!prefix && !direct && name == "Modulation Crystal") {
                    Vs.modsteal(turn, player, "cpb" + type, number);
                  }
                  Vs.data["turns"][turn]["players"][player]["cpb" + type][1] +=
                    number;
                  Vs.data["turns"][turn]["players"][player]["cpb" + type][0] +=
                    number;
                  if (name != "") {
                    Vs.overtime(player, active, name, "cpb" + type, number);
                  }
                  continue;
                }
                /*next*/
                if ((a = effect.indexOf(" attack ")) > -1) {
                  var type = effect.substring(8, a);
                  var sign = effect.indexOf("increased") > -1;
                  var number = parseInt(
                    effect.substring(effect.lastIndexOf(" "), effect.length - 7)
                  );
                  number = sign ? number : -number;
                  /*directsteal*/
                  if (direct && steal > -1) {
                    Vs.modsteal(turn, player, "next" + type, number);
                  }
                  Vs.data["turns"][turn]["players"][player]["next" + type][1] +=
                    number;
                  Vs.data["turns"][turn]["players"][player]["next" + type][0] +=
                    number;
                  if (name != "") {
                    Vs.overtime(player, active, name, "next" + type, number);
                  }
                  continue;
                }
                /*cleanse*/
                if (effect.indexOf("cleansed") > -1) {
                  for (j = 0; j < boosts.length; j++) {
                    var type = boosts[j];
                    if (
                      Vs.data["turns"][turn]["players"][player][type][0] < 0
                    ) {
                      Vs.data["turns"][turn]["players"][player][type][1] =
                        -Vs.data["turns"][turn]["players"][player][type][0];
                      Vs.data["turns"][turn]["players"][player][type][0] = 0;
                    }
                  }
                  if (name != "") {
                    Vs.overtime(player, active, name, "cleanse", 1);
                  }
                  continue;
                }
                /*purge*/
                if (effect.indexOf("purged") > -1) {
                  for (j = 0; j < boosts.length; j++) {
                    var type = boosts[j];
                    if (
                      Vs.data["turns"][turn]["players"][player][type][0] > 0
                    ) {
                      Vs.data["turns"][turn]["players"][player][type][1] =
                        -Vs.data["turns"][turn]["players"][player][type][0];
                      Vs.data["turns"][turn]["players"][player][type][0] = 0;
                    }
                  }
                  continue;
                }
                /*normalize*/
                if (effect.indexOf("normalized") > -1) {
                  for (j = 0; j < boosts.length; j++) {
                    var type = boosts[j];
                    Vs.data["turns"][turn]["players"][player][type][1] =
                      -Vs.data["turns"][turn]["players"][player][type][0];
                    Vs.data["turns"][turn]["players"][player][type][0] = 0;
                  }
                  continue;
                }
                /*restore*/
                if (effect.indexOf("restored") > -1) {
                  for (j = 0; j < boosts.length; j++) {
                    var type = boosts[j];
                    Vs.data["turns"][turn]["players"][player][type][1] = 0;
                    Vs.data["turns"][turn]["players"][player][type][0] = 0;
                  }
                  continue;
                }
                /*heal*/
                if (effect.indexOf("heals") > -1) {
                  if (name != "") {
                    var number = parseInt(
                      effect.substring(29, effect.indexOf("damage") - 1)
                    );
                    Vs.overtime(player, active, name, "hp", number);
                  }
                  continue;
                }
                /*lose*/
                if (effect.indexOf("loses") > -1) {
                  if (name != "") {
                    var number = parseInt(
                      effect.substring(29, effect.indexOf("life") - 1)
                    );
                    Vs.overtime(player, active, name, "hp", -1 * number);
                  }
                  continue;
                }
                /*gain*/
                if ((a = effect.indexOf(" HP")) > -1) {
                  if (name != "") {
                    var number = parseInt(effect.substring(29, a));
                    Vs.overtime(player, active, name, "maxhp", number);
                  }
                  continue;
                }
                /*defense*/
                if ((a = effect.indexOf("remains")) > -1) {
                  if (name != "") {
                    var type = effect.substring(
                      a + 24,
                      effect.indexOf('">', a)
                    );
                    Vs.overtime(player, active, name, type, 0);
                  }
                }
                if ((a = effect.indexOf("raises")) > -1) {
                  var b = effect.indexOf('">', a);
                  var type = effect.substring(a + 23, effect.indexOf('">', a));
                  var number = parseInt(
                    effect.substring(b + 2, effect.indexOf("</span>", b))
                  );
                  if (name != "") {
                    Vs.overtime(
                      player,
                      active,
                      name,
                      type,
                      number - Vs.aio.data["defense"][player][type]
                    );
                  }
                  Vs.aio.data["defense"][player][type] = number;
                  continue;
                }
                if ((a = effect.indexOf("drops")) > -1) {
                  var type = effect.substring(25, a - 1);
                  var number = parseInt(
                    effect.substring(a + 9, effect.indexOf("</span>"))
                  );
                  if (name != "") {
                    Vs.overtime(
                      player,
                      active,
                      name,
                      type,
                      number - Vs.aio.data["defense"][player][type]
                    );
                  }
                  Vs.aio.data["defense"][player][type] = number;
                  continue;
                }
                if ((a = effect.indexOf("consumes")) > -1) {
                  a = effect.indexOf(" ", a + 9);
                  var number = parseInt(effect.substring(31, a));
                  var type = effect.substring(a + 1, effect.indexOf("</span>"));
                  if (type == "life") type = "hp";
                  if (name != "") {
                    Vs.overtime(player, active, name, type, -number);
                  }
                  Vs.aio.data["defense"][player][type] -= number;
                  continue;
                }
                /*ea*/
                if (effect.indexOf("extra") > -1) {
                  if (name != "") {
                    Vs.overtime(player, active, name, "ea", 1);
                  }
                  continue;
                }
                /*duration*/
                if ((a = effect.indexOf("duration")) > -1) {
                  if (name != "") {
                    var type = effect.substring(25, a - 8);
                    var sign = effect.indexOf("increased") > -1;
                    var number = parseInt(
                      effect.substring(a + 47, effect.indexOf("turn(s)") - 1)
                    );
                    number = sign ? number : -number;
                    Vs.overtime(player, active, name, type, number);
                  }
                  continue;
                }
                /*gain*/
                var type = "";
                if (effect.indexOf(" gains ") > -1) type = "auras";
                if (effect.indexOf(" afflicted ") > -1) type = "banes";
                if (effect.indexOf(" summons ") > -1) type = "summons";
                if (effect.indexOf(" affected ") > -1) type = "curses";
                if (type != "") {
                  var name2 = effect.substring(
                    effect.lastIndexOf('">') + 2,
                    effect.lastIndexOf("</span>")
                  );
                  name2 =
                    name2.substring(0, 1).toUpperCase() + name2.substring(1);
                  Vs.overtime2("from", player, name2, "played", 1);
                  Vs.aio.data["overtime"][player]["from"][name2]["type"] = type;
                  continue;
                }
              }
            }
          }
          Vs.analyzed = true;
          $("wl_replaystats").update(
            Object.toJSON([
              players,
              Vs.aio.data["overtime"],
              Vs.aio.data["charms"],
            ])
          );
          /*WL.Script.Run('$("wl_replay_data").update(encodeURIComponent(Object.toJSON(Vs.data)))');*/
        });
      }
      WL.Script.Run("Vs.analyze()");
      WL.Node.Select("//body").appendChild(
        WL.Node.Hide(WL.Node.Create("div", [["id", "wl_replaystats"]]))
      );
      WL.Node.Select('//div[@id="VsMsg"]').addEventListener(
        "DOMAttrModified",
        function (event) {
          if (event.newValue != "height: auto;") return;
          this.removeEventListener("DOMAttrModified", arguments.callee, false);
          WL.CSS.Add(
            ".log .auras { color: #3333cc !important; } .log .banes { color: #33cc33 !important; } .log .summons { color: #cccc33 !important; } .log .curses { color: #cc3333 !important; }"
          );
          WL.CSS.Add(
            ".log .nextmagic { color: #8888ff !important; } .log .cpbmagic { color: #7777ff !important; } .log .nextmelee { color: #ff5555 !important; } .log .cpbmelee { color: #ff4444 !important; } .log .nextspirit { color: #cc8855 !important; } .log .cpbspirit { color: #cc7744 !important; }"
          );
          WL.CSS.Add(
            ".log .hp { color: #22aa22 !important; } .log .maxhp { color: #11aa11 !important; }"
          );
          WL.CSS.Add(".log .triggered { font-style: italic; }");
          var json = JSON.parse(
            WL.Node.Select('//div[@id="wl_replaystats"]').innerHTML
          );
          var players = json[0];
          var overtime = json[1];
          var charms = json[2];
          var rarities = [
            "vendor",
            "treasure",
            "rare",
            "craft",
            "class",
            "epic",
          ];
          WL.Globals.DMPlayers = [];
          WL.Node.ForEach(
            '//div[@class="damagemeter format highlight"]/div/div[@class="name"]/a',
            function (node, i) {
              WL.Globals.DMPlayers[i] = node.innerHTML;
            }
          );
          if (WL.Globals.DMPlayers.length == 0) return;
          for (var mname in players) {
            if (players[mname]["mob"]) {
              WL.Globals.DMPlayers.push(mname);
              with (WL.Node.Select(
                '//div[@class="damagemeter format highlight"]/..'
              ))
                with (appendChild(
                  WL.Node.Create("div", [
                    ["class", "damagemeter format highlight"],
                  ])
                ))
                  with (appendChild(
                    WL.Node.Create("div", [["class", "dm_line"]])
                  ))
                    with (appendChild(
                      WL.Node.Create("div", [["class", "dm_name"]])
                    ))
                      with (appendChild(
                        WL.Node.Create("a", [["class", "nolink"]])
                      ))
                        appendChild(WL.Node.Create("strong", [], mname));
            }
          }
          //
          WL.Node.ForEach(
            '//div[@class="damagemeter format highlight"]',
            function (node, i) {
              if (i == 0) return;
              var player = players[WL.Globals.DMPlayers[i - 1]]["nr"];
              var maxlevel = players[WL.Globals.DMPlayers[i - 1]]["level"];
              //overtime effects
              var noeffects = true;
              with (node) {
                with (appendChild(WL.Node.Create("div"))) {
                  appendChild(
                    WL.Node.Create(
                      "a",
                      [["class", "nolink"]],
                      "[Show overtime effects]",
                      function () {
                        WL.Node.Hide(this);
                        WL.Node.Show(this.nextSibling);
                      }
                    )
                  );
                  with (appendChild(
                    WL.Node.Hide(WL.Node.Create("div", [["class", "dm_line"]]))
                  )) {
                    with (appendChild(
                      WL.Node.Create("div", [
                        ["class", "dm_header"],
                        ["style", "width: 100%;"],
                      ])
                    )) {
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "lhp dm_stat"],
                            ["style", "width: 100%;"],
                          ],
                          "Overtime effects"
                        )
                      );
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "lhp dm_stat"],
                            ["style", "width: 5%;"],
                          ],
                          "#"
                        )
                      );
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "lhp dm_stat"],
                            ["style", "width: 25%;"],
                          ],
                          "Name"
                        )
                      );
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "lhp dm_stat"],
                            ["style", "width: 20%;"],
                          ],
                          "Effect"
                        )
                      );
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "lhp dm_stat"],
                            ["style", "width: 20%;"],
                          ],
                          "Amount"
                        )
                      );
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "lhp dm_stat"],
                            ["style", "width: 10%;"],
                          ],
                          "Ticks"
                        )
                      );
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "lhp dm_stat"],
                            ["style", "width: 20%;"],
                          ],
                          "a/t"
                        )
                      );
                    }
                    for (var type in overtime[player]) {
                      for (var name in overtime[player][type]) {
                        for (var effect in overtime[player][type][name]) {
                          //alert(name + "/" + effect);
                          if (effect == "played" || effect == "type") continue;
                          noeffects = false;
                          with (appendChild(
                            WL.Node.Create("div", [["style", "width: 100%;"]])
                          )) {
                            appendChild(
                              WL.Node.Create(
                                "div",
                                [
                                  ["class", "dm_stat"],
                                  ["style", "width: 5%;"],
                                ],
                                type == "from"
                                  ? overtime[player][type][name]["played"] ===
                                    undefined
                                    ? 0
                                    : overtime[player][type][name]["played"][
                                        "tick"
                                      ]
                                  : "-"
                              )
                            );
                            appendChild(
                              WL.Node.Create(
                                "div",
                                [
                                  [
                                    "class",
                                    "dm_stat " +
                                      overtime[player][type][name]["type"],
                                  ],
                                  ["style", "width: 25%;"],
                                ],
                                name
                              )
                            );
                            appendChild(
                              WL.Node.Create(
                                "div",
                                [
                                  ["class", "dm_stat " + effect],
                                  ["style", "width: 20%;"],
                                ],
                                effect
                              )
                            );
                            appendChild(
                              WL.Node.Create(
                                "div",
                                [
                                  ["class", "dm_stat"],
                                  ["style", "width: 20%;"],
                                ],
                                overtime[player][type][name][effect]["amount"] +
                                  (overtime[player][type][name][effect][
                                    "amount2"
                                  ] > 0
                                    ? " (" +
                                      (overtime[player][type][name][effect][
                                        "amount"
                                      ] +
                                        overtime[player][type][name][effect][
                                          "amount2"
                                        ]) +
                                      ")"
                                    : "")
                              )
                            );
                            appendChild(
                              WL.Node.Create(
                                "div",
                                [
                                  ["class", "dm_stat"],
                                  ["style", "width: 10%;"],
                                ],
                                overtime[player][type][name][effect]["tick"]
                              )
                            );
                            appendChild(
                              WL.Node.Create(
                                "div",
                                [
                                  ["class", "dm_stat"],
                                  ["style", "width: 20%;"],
                                ],
                                Math.round(
                                  (100 *
                                    overtime[player][type][name][effect][
                                      "amount"
                                    ]) /
                                    overtime[player][type][name][effect]["tick"]
                                ) / 100
                              )
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (noeffects) WL.Node.Hide(node.lastChild);
              //charmstats
              WL.CSS.Add(
                ".wl_bar { border-bottom: 1px solid #f6ba68; height: 110px; position: relative; margin-bottom: 5px !important; }"
              );
              WL.CSS.Add(
                ".wl_bar div { position: absolute; text-align: center; width: 10px; font-size: 7px; }"
              );
              WL.CSS.Add(
                ".wl_rarity .vendor { background-color: #CBE19C; } .wl_rarity .treasure { background-color: #00AA08; } .wl_rarity .rare { background-color: #3F68FF; } .wl_rarity .craft { background-color: #DE9D1F; } .wl_rarity .class { background-color: #FF4105; } .wl_rarity .epic { background-color: #892EDD; }"
              );
              with (node) {
                with (appendChild(WL.Node.Create("div"))) {
                  appendChild(
                    WL.Node.Create(
                      "a",
                      [["class", "nolink"]],
                      "[Show charms]",
                      function () {
                        WL.Node.Hide(this);
                        WL.Node.Show(this.nextSibling);
                      }
                    )
                  );
                  with (appendChild(
                    WL.Node.Hide(WL.Node.Create("div", [["class", "dm_line"]]))
                  )) {
                    with (appendChild(
                      WL.Node.Create("div", [
                        ["class", "dm_header"],
                        ["style", "width: 100%;"],
                      ])
                    )) {
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "lhp dm_stat"],
                            ["style", "width: 100%;"],
                          ],
                          "Gear statistics"
                        )
                      );
                    }
                    //level graph
                    with (appendChild(
                      WL.Node.Create("div", [["style", "width: 100%;"]])
                    )) {
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "dm_stat"],
                            ["style", "width: 20%;"],
                          ],
                          "Levels"
                        )
                      );
                      with (appendChild(
                        WL.Node.Create("div", [
                          ["class", "dm_stat"],
                          ["style", "width: 80%;"],
                        ])
                      )) {
                        with (appendChild(
                          WL.Node.Create("div", [
                            ["class", "wl_bar"],
                            ["style", "width: " + 10 * maxlevel + "px;"],
                          ])
                        )) {
                          for (var level = 1; level <= maxlevel; level++) {
                            var value = Math.ceil(
                              (100 *
                                (charms[player]["level"][level] === undefined
                                  ? 0
                                  : charms[player]["level"][level])) /
                                (charms[player]["level"]["maxcount"] + 1)
                            );
                            appendChild(
                              WL.Node.Create(
                                "div",
                                [
                                  [
                                    "style",
                                    "background-color: #f6ba68; color: #000; bottom: 0; height: " +
                                      value +
                                      "px; left: " +
                                      10 * (level - 1) +
                                      "px;",
                                  ],
                                ],
                                charms[player]["level"][level]
                              )
                            );
                            if (value > 0)
                              appendChild(
                                WL.Node.Create(
                                  "div",
                                  [
                                    [
                                      "style",
                                      "color: #FFF; bottom: " +
                                        value +
                                        "px; height: 15px; left: " +
                                        10 * (level - 1) +
                                        "px;",
                                    ],
                                  ],
                                  level
                                )
                              );
                          }
                        }
                      }
                    }
                    //rarity graph
                    with (appendChild(
                      WL.Node.Create("div", [["style", "width: 100%;"]])
                    )) {
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "dm_stat"],
                            ["style", "width: 20%;"],
                          ],
                          "Rarities"
                        )
                      );
                      with (appendChild(
                        WL.Node.Create("div", [
                          ["class", "dm_stat"],
                          ["style", "width: 80%;"],
                        ])
                      )) {
                        with (appendChild(
                          WL.Node.Create("div", [
                            ["class", "wl_rarity"],
                            ["style", "width: 100%;"],
                          ])
                        )) {
                          for (var i in rarities) {
                            var value = Math.floor(
                              (100 * charms[player]["rarity"][rarities[i]]) /
                                charms[player]["count"]
                            );
                            if (value > 0)
                              appendChild(
                                WL.Node.Create(
                                  "div",
                                  [
                                    ["class", rarities[i]],
                                    ["style", "width: " + value + "%;"],
                                  ],
                                  charms[player]["rarity"][rarities[i]]
                                )
                              );
                          }
                        }
                      }
                    }
                    //stats
                    with (appendChild(
                      WL.Node.Create("div", [["style", "width: 100%;"]])
                    )) {
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "dm_stat"],
                            ["style", "width: 20%;"],
                          ],
                          "Stats"
                        )
                      );
                      with (appendChild(
                        WL.Node.Create("div", [
                          ["class", "dm_stat"],
                          ["style", "width: 80%;"],
                        ])
                      )) {
                        appendChild(
                          WL.Node.Create(
                            "div",
                            [
                              ["class", "dm_stat c2"],
                              ["style", "width: 20%;"],
                            ],
                            "Level: " + charms[player]["level"]["maxlevel"]
                          )
                        );
                        appendChild(
                          WL.Node.Create(
                            "div",
                            [
                              ["class", "dm_stat pow"],
                              ["style", "width: 20%;"],
                            ],
                            "Power: " + charms[player]["stats"]["Pow"]
                          )
                        );
                        appendChild(
                          WL.Node.Create(
                            "div",
                            [
                              ["class", "dm_stat int"],
                              ["style", "width: 20%;"],
                            ],
                            "Intellect: " + charms[player]["stats"]["Int"]
                          )
                        );
                        appendChild(
                          WL.Node.Create(
                            "div",
                            [
                              ["class", "dm_stat dex"],
                              ["style", "width: 20%;"],
                            ],
                            "Dexterity: " + charms[player]["stats"]["Dex"]
                          )
                        );
                        appendChild(
                          WL.Node.Create(
                            "div",
                            [
                              ["class", "dm_stat con"],
                              ["style", "width: 20%;"],
                            ],
                            "Constitution: " + charms[player]["stats"]["Con"]
                          )
                        );
                      }
                    }
                    //runes
                    with (appendChild(
                      WL.Node.Create("div", [["style", "width: 100%;"]])
                    )) {
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "dm_stat"],
                            ["style", "width: 20%;"],
                          ],
                          "Runes"
                        )
                      );
                      with (appendChild(
                        WL.Node.Create("div", [
                          ["class", "dm_stat"],
                          ["style", "width: 80%;"],
                        ])
                      )) {
                        with (appendChild(WL.Node.Create("div"))) {
                          for (var rune in charms[player]["runes"]) {
                            with (appendChild(
                              WL.Node.Create("div", [
                                ["style", "padding-left: 5px;"],
                              ])
                            )) {
                              appendChild(
                                document.createTextNode(
                                  charms[player]["runes"][rune] + "x"
                                )
                              );
                              appendChild(
                                WL.Node.Create("div", [
                                  [
                                    "class",
                                    "minirune minirune_" +
                                      rune +
                                      " tooltip_" +
                                      rune +
                                      " BV_tooltip_text",
                                  ],
                                  ["style", "float: right;"],
                                ])
                              );
                            }
                          }
                        }
                      }
                    }
                    //charms
                    with (appendChild(
                      WL.Node.Create("div", [["style", "width: 100%;"]])
                    )) {
                      appendChild(
                        WL.Node.Create(
                          "div",
                          [
                            ["class", "dm_stat"],
                            ["style", "width: 20%;"],
                          ],
                          "Charms"
                        )
                      );
                      with (appendChild(
                        WL.Node.Create("div", [
                          ["style", "width: 80%; font-weight: bold;"],
                        ])
                      )) {
                        with (appendChild(
                          WL.Node.Create("div", [["class", "wl_charmlist"]])
                        )) {
                          for (var charm in charms[player]["charms"]) {
                            appendChild(
                              WL.Node.Create(
                                "a",
                                [
                                  [
                                    "class",
                                    "BV_system_file card c" +
                                      charms[player]["charms"][charm]["rarity"],
                                  ],
                                  ["href", "/card/" + charm],
                                ],
                                charms[player]["charms"][charm]["name"]
                              )
                            );
                            appendChild(
                              document.createTextNode(
                                " (" +
                                  charms[player]["charms"][charm]["count"] +
                                  ")"
                              )
                            );
                            appendChild(WL.Node.Create("br"));
                          }
                          for (var charm in charms[player]["combos"]) {
                            appendChild(
                              WL.Node.Create(
                                "div",
                                [
                                  ["class", "dm_stat lhp"],
                                  ["style", "width: 100%;"],
                                ],
                                "Combos"
                              )
                            );
                            appendChild(WL.Node.Create("br"));
                            for (var charm in charms[player]["combos"]) {
                              appendChild(
                                WL.Node.Create(
                                  "a",
                                  [
                                    [
                                      "class",
                                      "BV_system_file card c" +
                                        charms[player]["combos"][charm][
                                          "rarity"
                                        ],
                                    ],
                                    ["href", "/card/" + charm],
                                  ],
                                  charms[player]["combos"][charm]["name"]
                                )
                              );
                              appendChild(
                                document.createTextNode(
                                  " (" +
                                    charms[player]["combos"][charm]["count"] +
                                    ")"
                                )
                              );
                              appendChild(WL.Node.Create("br"));
                            }
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
              WL.Script.Run(
                'System.selectiveRegister(System.rules, ".damagemeter", [".BV_system_file", ".BV_tooltip_text"])'
              );
            }
          );
        },
        false
      );
      //add ability to jump to turn
      WL.Node.Select('//div[@id="VsSpeedCounter"]').addEventListener(
        "click",
        function () {
          if (this.innerHTML.length > 3) return;
          WL.Script.Run("Vs.pause()");
          var turn, input;
          turn = this.innerHTML;
          WL.Node.Remove(this.firstChild);
          input = this.appendChild(
            WL.Node.Create("input", [
              ["maxlength", "3"],
              ["class", "input counter"],
              [
                "style",
                "color: #dddddd; width: 23px; margin: 0 0 0 0; border-width: 0;",
              ],
              ["value", turn],
            ])
          );
          input.focus();
          input.select();
          input.addEventListener(
            "change",
            function () {
              WL.Script.Run("Vs.show(" + (this.value - 1) + ")");
            },
            false
          );
        },
        false
      );
      //add new info
      WL.CSS.Add(
        ".cvendor { color: #CBE19C !important; } .crare { color: #3F68FF !important; } .ccraft { color: #DE9D1F !important; } .cclass { color: #FF4105 !important; } .cepic { color: #892EDD !important; } .cseal { color: #96CBEC !important; }"
      );
      WL.CSS.Add(
        ".msg .ctreasure { color: #99FF99 !important; } .msg .cmob { color: #AAAAAA !important; }"
      );
      WL.CSS.Add(
        ".section_text .ctreasure { color: #00AA08 !important; } .section_text .cmob { color: #FFFFFF !important; }"
      );
      WL.CSS.Add(
        ".title .ctreasure { color: #00AA08 !important; } .title .cmob { color: #FFFFFF !important; }"
      );
      WL.CSS.Add(
        ".wl_charmlist .ctreasure { color: #00AA08 !important; } .wl_charmlist .cmob { color: #FFFFFF !important; }"
      );
      WL.CSS.Add(
        ".wl_replay div { width: 40%; } .wl_replay .willpower { width: 20% !important; }"
      );
      WL.Node.ForEach('//div[contains(@id, "Card")]', function (node, i) {
        var info = WL.Node.Create("div", [["class", "info wl_replay"]]);
        info.appendChild(
          WL.Node.Create(
            "div",
            [["class", "armor"]],
            '<strong id="Player' + i + 'Armor">-</strong>'
          )
        );
        info.appendChild(
          WL.Node.Create(
            "div",
            [["class", "ward"]],
            '<strong id="Player' + i + 'Ward">-</strong>'
          )
        );
        info.appendChild(
          WL.Node.Create(
            "div",
            [["class", "willpower"]],
            '<strong id="Player' + i + 'Willpower">-</strong>'
          )
        );
        node.parentNode.insertBefore(info, node);
      });
      WL.CSS.Add(
        ".wl_popup:hover > div { display: block !important; } .wl_overtime { width: 170px; } .wl_replaypopup { width: 170px; }"
      );
      WL.Node.ForEach(
        '//div[@id="VsAnimation"]//div[contains(@class, "frame")]/div[@class="avatar"]',
        function (node, i) {
          WL.Estiah.Battle.Popup(node, i);
        }
      );
      WL.Node.ForEach('//img[starts-with(@id, "VsFocus")]', function (node, i) {
        node.removeAttribute("id");
        var div = WL.Node.Create("div", [
          ["id", "VsFocus" + i],
          ["class", node.getAttribute("class")],
          ["style", node.getAttribute("style")],
        ]);
        WL.Node.Select('//div[@id="VsAnimation"]').appendChild(div);
        node.removeAttribute("style");
        node.removeAttribute("class");
        div.appendChild(node);
        WL.Estiah.Battle.Popup(div, "f" + i);
      });
    },
    false
  );
  if (
    window.location.href.substring(
      0,
      WL.Globals.Options.Domain.Value.length + 25
    ) ==
    WL.Globals.Options.Domain.Value + "/character/combat/replay/"
  )
    temp.setAttribute("status", "yes");
  else WL.Estiah.Battle.Init();
}

////////////////////////////////////////////////////////////////
//important
////////////////////////////////////////////////////////////////

if (top.document.title == "Map - Estiah") {
  WL.CSS.Add(
    ".wl_hidden { visibility: hidden; } div:hover > .wl_hidden { visibility: visible !important; } .wl_hidden:hover span { display: inline !important; }"
  );
  with (WL.Node.Select('//div[@class="map format"]')) {
    with (insertBefore(
      WL.Node.Create("div", [
        ["class", "floating"],
        ["id", "wl_meropis"],
      ]),
      firstChild
    ))
      with (appendChild(
        WL.Node.Create("div", [
          ["style", "position: relative; top: 500px; left: 10px;"],
        ])
      )) {
        appendChild(WL.Node.Create("div", [["class", "orb orb_c2 wl_hidden"]]));
        with (appendChild(
          WL.Node.Create("div", [["class", "label opacity bd1 wl_hidden"]])
        )) {
          with (appendChild(
            WL.Node.Create("a", [
              ["href", "/city/0"],
              ["class", "name c2 nolink BV_map_detail"],
            ])
          ))
            appendChild(WL.Node.Create("strong", [], "Meropis"));
          appendChild(WL.Node.Create("br"));
          appendChild(
            WL.Node.Create("span", [["class", "level c2"]], "Require L.60")
          );
          appendChild(WL.Node.Create("br"));
          appendChild(
            WL.Node.Hide(
              WL.Node.Create(
                "span",
                [["class", "level"]],
                '<strong class="c2">[Events]</strong><br>Hall of the Tempest <em class="lhp">L.60</em><br>Rebound <em class="lhp">L.61</em><br><strong class="c2">[Guild Halls]</strong><br>Ring of Blood <em class="lhp">berserker</em><br>Cave of Unquenchable Mana <em class="lhp">destroyer</em><br>Lair of Tranquility <em class="lhp">nightslayer</em><br>Crystal Prison <em class="lhp">runewarden</em><br>Forbidden Altar <em class="lhp">soulreaper</em><br>Abbey of Truthseekers <em class="lhp">vindicator</em><br>'
              )
            )
          );
        }
      }
  }
}

if (top.document.title == "Sheira - Estiah") {
  with (WL.Node.Select('//div[@class="credits"]'))
    innerHTML = innerHTML.replace("Hierarch", WL.Sheira.Class);
}

if (
  top.document.title == "Lezard - Estiah" ||
  top.document.title == "Nipal - Estiah"
) {
  with (WL.Node.Select('//div[@class="credits"]'))
    innerHTML = innerHTML
      .replace("Summoner", "Soulreaper")
      .replace(
        /Last Seen : <strong>[a-zA-Z]+<\/strong>/,
        "Last Seen : <strong>Meropis</strong>"
      );
}

if (top.document.title == "Job - Estiah" && WL.Estiah.GetCityID() == 9) {
  with (WL.Node.Select('//div[@class="joblist format"]'))
    with (appendChild(
      WL.Node.Create("div", [
        ["id", "JobMeropis"],
        ["class", "job unlocked bd1"],
      ])
    )) {
      with (appendChild(WL.Node.Create("div", [["class", "name"]])))
        appendChild(
          WL.Node.Create(
            "a",
            [
              ["id", "JobNameMeropis"],
              ["class", "title c2"],
            ],
            "Contraband (Meropis)",
            function () {
              WL.Script.New("Job.meropis", function () {
                $("JobMsg").update($("JobDetailMeropis").innerHTML);

                var offsety = 0 - Math.floor($("JobMsg").getHeight() / 2);

                System.showAt($("JobMsg"), $("JobNameMeropis"), {
                  x: 545,
                  y: offsety,
                });

                $A($$(".job")).each(function (element) {
                  element.removeClassName("highlight");
                });
                $("JobMeropis").addClassName("highlight");
              });
              WL.Script.Run("Job.meropis()");
            }
          )
        );
      appendChild(WL.Node.Create("div", [["class", "reward"]], "-1"));
      appendChild(WL.Node.Create("div", [["class", "reward"]], "-1"));
      appendChild(WL.Node.Create("div", [["class", "reward"]], "-1"));
      appendChild(WL.Node.Create("div", [["class", "reward"]], "-1"));
      appendChild(WL.Node.Create("div", [["class", "reward gold"]], "-1000K"));
      appendChild(WL.Node.Create("div", [["class", "reward skill"]], ""));
      appendChild(WL.Node.Create("div", [["class", "reward move"]], "move"));
      appendChild(WL.Node.Create("div", [["class", "reward item"]], ""));
      appendChild(
        WL.Node.Hide(
          WL.Node.Create(
            "div",
            [
              ["id", "JobDetailMeropis"],
              ["class", "detail"],
            ],
            '<div class="common_file opacity bd1"><div class="title c2">Contraband (Meropis)</div><div class="description">Requirements :<br><span class="data lvl">Level <strong>60</strong></span><br><span class="data">[Artificier\'s Strongbox]x<strong>1</strong></span><br><span class="data gold">Gold <strong>1000000</strong></span><br><br>Rewards :<br><span class="data dex">Dexterity -<strong>1</strong></span><br><span class="data pow">Power -<strong>1</strong></span><br><span class="data int">Intellect -<strong>1</strong></span><br><span class="data con">Constitution -<strong>1</strong></span><br><span class="data"><strong>Travel</strong></span><br><br><em></em></div></div></div>'
          )
        )
      );
    }
}

if (
  window.location.href.substring(
    WL.Globals.Options.Domain.Value.length,
    WL.Globals.Options.Domain.Value.length + 7
  ) == "/city/0"
) {
  var city = WL.Node.Create("div", [["class", "city"]]);
  with (city) {
    with (appendChild(
      WL.Node.Create("div", [
        ["class", "minimap"],
        [
          "style",
          "background: url('http://beta.estiah2.com/image/city/200x150/8.jpg') no-repeat scroll 0% 0% transparent;",
        ],
      ])
    ))
      appendChild(
        WL.Node.Create(
          "a",
          [["class", "lhp opacity nolink function"]],
          "Zoom",
          function () {
            WL.Script.Run('System.showOverlay($("CityZoom0"), City.endZoom)');
          }
        )
      );
    appendChild(
      WL.Node.Create(
        "div",
        [["class", "z1 c2"]],
        '<div class="name c2">Meropis <span class="level lhp">LEVEL 60+</span></div>'
      )
    );
    appendChild(
      WL.Node.Create(
        "div",
        [["class", "z2"]],
        '<div class="label lhp">Coordinates</div><div class="value">10,500</div><div class="label lhp">Player versus Player</div><div class="value"><span title="You may be attacked by other players" class="up">Enabled</span></div><div class="label lhp">Players</div><div class="value">2</div><div class="label lhp">Events</div><div class="value">2</div><div class="label lhp">Shops</div><div class="value">16</div><div class="label lhp">Discovery</div><div class="value">0.0%</div><div class="description lhp">Lost in the depths for centuries, the mysterious ruins of Meropis surged from the abysses after intrepid adventurers explored the secrets of the Kysins. Little did they know such secrets were nothing in comparison to the enigma of Meropis...</div>'
      )
    );
    with (appendChild(
      WL.Node.Create("div", [
        ["class", "minimap zoom floating"],
        ["id", "CityZoom0"],
        [
          "style",
          "display: none; background: url('http://beta.estiah2.com/image/city/800x600/8.jpg') repeat scroll 0% 0% transparent;",
        ],
      ])
    )) {
      appendChild(
        WL.Node.Create(
          "a",
          [["class", "lhp opacity nolink function"]],
          "Close",
          function () {
            WL.Script.Run("City.unzoom()");
          }
        )
      );
      appendChild(
        WL.Node.Create(
          "a",
          [
            ["href", "http://beta.estiah2.com/image/city/800x600/8.jpg"],
            ["class", "lhp opacity nolink function"],
            ["target", "_blank"],
          ],
          "800x600"
        )
      );
      appendChild(
        WL.Node.Create(
          "a",
          [
            ["href", "http://beta.estiah2.com/image/city/1024x768/8.jpg"],
            ["class", "lhp opacity nolink function"],
            ["target", "_blank"],
          ],
          "1024x768"
        )
      );
    }
  }
  WL.Node.Replace(WL.Node.Select('//div[@class="city"]'), city);
  WL.Node.Replace(
    WL.Node.Select('//div[@class="section_text format"]'),
    WL.Node.Create(
      "div",
      [["class", "section_text format"]],
      '<div class="stand_type lhp">Dungeons and Events</div><div class="standlist"><div class="stand"><div class="name lhp"><span>Hall of the Tempest</span></div><div class="description">[Level 60] Do you dare to set foot in the Hall of the Tempest herself?</div></div><div class="stand"><div class="name lhp"><span>Rebound</span></div><div class="description">[Level 61] A mad soulreaper sits in captivity instead of searching for ancient powers.</div></div></div><div class="stand_type lhp">Guild Halls</div><div class="standlist"><div class="stand"><div class="name lhp"><span>Ring of Blood</span></div><div class="description">Choose your class in city\'s guild halls.</div></div><div class="stand"><div class="name lhp"><span>Cave of Unquenchable Mana</span></div><div class="description">Choose your class in city\'s guild halls.</div></div><div class="stand"><div class="name lhp"><span>Lair of Tranquility</span></div><div class="description">Choose your class in city\'s guild halls.</div></div><div class="stand"><div class="name lhp"><span>Crystal Prison</span></div><div class="description">Choose your class in city\'s guild halls.</div></div><div class="stand"><div class="name lhp"><span>Forbidden Altar</span></div><div class="description">Choose your class in city\'s guild halls.</div></div><div class="stand"><div class="name lhp"><span>Abbey of Truthseekers</span></div><div class="description">Choose your class in city\'s guild halls.</div></div></div>'
    )
  );
  WL.Node.Remove(
    WL.Node.Select('//div[@class="wireframe_city_site common_content"]')
  );
  WL.Node.ForEach('//div[contains(@id, "ResetSchedule")]', function (node) {
    WL.Node.Remove(node);
  });
  var time = 1333238400000 - new Date().getTime();
  var days = parseInt(time / 86400000);
  var hours = parseInt((time - days * 86400000) / 3600000);
  WL.Node.Select('//strong[@id="ResetTimer0"]/..').innerHTML =
    'Gates open<br>in <strong id="ResetTimer0">' +
    days +
    "d" +
    hours +
    "h</strong>";
}

if (WL.Globals.PlayerID != 0) {
  ////////////////////////////////////////////////////////////////
  //dungeonloot
  ////////////////////////////////////////////////////////////////

  //info
  var dungeonloot_name = "DungeonLoot";
  var dungeonloot_version = "0.5.4";
  WL.Addon.Register(
    dungeonloot_name,
    "This addon allows you to view the loot of dungeons and how far you are along in collecting.",
    dungeonloot_version,
    "WL"
  );

  //functions
  WL.Estiah.Page.Charms = function () {
    var page, charms;
    page = WL.Estiah.Page.New(
      "Charms",
      "View your progress towards charm collection."
    );
    WL.Estiah.Show(page, allinone_name + " - Charms - Estiah");
    charms = page.firstChild.appendChild(
      WL.Node.Create("div", [["class", "section_text format log"]])
    );
    WL.Estiah.Drops.Show(charms, "all");
  };
  WL.Estiah.Drops = {};
  WL.Estiah.Drops.All = false;
  WL.Estiah.Drops.Load = function () {
    if (top.frames.length > 0) return;
    WL.CSS.Add(
      ".gm_popup:hover div { display:inline !important; } .section_text { padding-bottom: 120px !important; }"
    );
    //load charms
    WL.Data.IFrame(
      WL.Globals.Options.Domain.Value + "/character/card",
      function () {
        WL.Node.Select('//div[@id="wl_charms_loaded"]').setAttribute(
          "active",
          "yes"
        );
      }
    );
    //load archive
    WL.Data.IFrame(
      WL.Globals.Options.Domain.Value +
        "/character/card/index/collection/archive",
      function () {
        WL.Node.Select('//div[@id="wl_charms_loaded"]').setAttribute(
          "archive",
          "yes"
        );
      }
    );
  };
  WL.Estiah.Drops.Get = function (Name) {
    if (WL.Estiah.Drops.Table === undefined)
      WL.Estiah.Drops.Table = JSON.parse(
        '{\
			"Golem Party": {"treasure": [1718, 1719, 1720, 2576, 2577, 3164]}, \
			"Inachis Sewers": {"treasure": [115, 116, 117, 118, 428, 429]}, \
			"High Summoner\'s Study": {"rare": [314]}, \
			"HolyGrace Square": {"rare": [307]}, \
			"River\'s Edge": {"treasure": [1953], "rare": [1954]}, \
			"Bunny Nesting Grounds": {"rare": [498, 499]}, \
			"Goblin Tower": {"treasure": [132, 133, 134, 135, 136, 430, 431, 540], "rare": [137, 138]}, \
			"Cursed Forest": {"treasure": [432, 433, 434, 435, 436, 437, 438, 439], "rare": [440, 441]}, \
			"Inachis Battle Tournament": {"treasure": [342, 343], "rare": [344, 345]}, \
			"Thunderock Canyon": {"treasure": [152, 153, 154, 155, 156, 157, 158, 442, 541], "rare": [159, 160]}, \
			"Rooftop Rush": {"treasure": [2045, 2087, 2088, 2089], "rare": [2090, 2091]}, \
			"The Rogue Colossus": {"rare": [895, 896, 897]}, \
			"Abandoned Manor": {"treasure": [161, 162, 163, 164, 165, 356, 443, 444, 445], "rare": [168, 169]}, \
			"Ghost Mine": {"treasure": [166, 167, 446, 447, 448, 449, 450, 451, 542], "rare": [452, 453]}, \
			"Crystal Valley": {"treasure": [454, 455, 456, 457, 458, 459, 460], "rare": [462, 463]}, \
			"The Game": {"treasure": [461, 645], "rare": [464, 465, 523, 524]}, \
			"Icecloud Ruins": {"treasure": [659, 660, 661, 662, 663, 664, 665, 666], "rare": [667, 668]}, \
			"Fireflies Swamp": {"treasure": [687, 698, 699, 700, 701, 702, 703, 704], "rare": [705, 706]}, \
			"Tomb of Sheypar": {"treasure": [816, 817, 818, 819, 820, 821, 822, 831], "rare": [823, 833]}, \
			"Escorting Chopley": {"treasure": [859, 860, 861, 862, 863], "rare": [864, 865], "craft": [875, 876, 877, 878, 879, 880]}, \
			"Fear of the Dark": {"treasure": [3075, 3076, 3077, 3078, 3079, 3094, 3095], "rare": [3080, 3081], "craft": [3083, 3084, 3085, 3086, 3087, 3088, 3089, 3090, 3091, 3092, 3161], "class T1": {"fighter": [3104], "scout": [3110], "novice": [3106], "recruit": [3108]}, "class T2": {"mercenary": [3112], "wizard": [3114], "rogue": [3124], "shaman": [3126], "monk": [3116], "sage": [3118], "guard": [3120], "cleric": [3122]}, "class T3": {"deathknight": [3128], "inquisitor": [3128], "champion": [3130], "pyromaniac": [3132], "berserker": [3132], "summoner": [3137], "assassin": [3130], "slayer": [3139], "warlord": [3137], "warden": [3139], "paladin": [3136], "hierarch": [3136]}}, \
			"That Bitter Nourishment": {"treasure": [3096, 3097, 3098, 3099, 3100, 3101], "rare": [3102, 3103], "craft": [3154, 3155, 3156, 3157, 3158, 3159], "class T1": {"fighter": [3105], "scout": [3111], "novice": [3107], "recruit": [3109]}}, \
			"The Summoning Altar": {"rare": [882, 883, 884], "craft": [885, 886, 887, 888, 889, 890]}, \
			"Frost Fortress ": {"treasure": [2634, 2636, 2637, 2638, 2639, 2640], "rare": [2646, 2647], "craft": [2641, 2642, 2643, 2644, 2645]}, \
			"The Old Sylan Map": {"treasure": [1052, 1053, 1054, 1055, 1056, 1057, 1058], "rare": [1059, 1060], "craft": [1061, 1062, 1063, 1064, 1065, 1066]}, \
			"The Village of Cyneth ": {"treasure": [1086, 1096, 1097, 1098, 1099, 1100], "rare": [1101, 1102], "craft": [1104, 1105, 1106, 1107, 1108, 1109]}, \
			"Narkel\'s Private Collection": {"treasure": [1241, 1242, 1243, 1244, 1245, 1540, 1541], "rare": [1246, 1247], "craft": [1248, 1249, 1250, 1251, 1252]}, \
			"The Darkened Streets": {"treasure": [2902, 2903, 2904, 2905, 2906, 2907], "rare": [2898, 2899, 2900], "craft": [2901, 2908, 2909, 2910, 2911, 2912, 2913]}, \
			"Cornered": {"rare": [2914, 2915, 2916], "craft": [2908, 2909, 2910, 2911, 2912, 2913]}, \
			"The Underground Academy": {"treasure": [1271, 1272, 1276, 1277, 1278, 1279, 1545, 1546], "rare": [1280, 1281], "craft": [1282, 1283, 1284, 1285, 1286, 1287]}, \
			"Trial of Domination": {"class T3": {"deathknight": [1326], "inquisitor": [1333], "summoner": [1320], "hierarch": [1363]}}, \
			"Trial of Faith": {"class T3": {"deathknight": [1328], "inquisitor": [1335], "champion": [1377], "pyromaniac": [1384], "berserker": [1314], "summoner": [1321], "assassin": [1370], "slayer": [1342], "warlord": [1346], "warden": [1354], "paladin": [1389]}}, \
			"Trial of Insight": {"class T3": {"deathknight": [1327], "champion": [1376], "assassin": [1367], "warden": [1353], "hierarch": [1360]}}, \
			"Trial of Intensity": {"class T3": {"pyromaniac": [1381], "berserker": [1312], "slayer": [1339]}}, \
			"Trial of Leadership": {"class T3": {"champion": [1374], "pyromaniac": [1383], "berserker": [1313], "assassin": [1369], "slayer": [1341], "warlord": [1347], "paladin": [1391]}}, \
			"Trial of Perseverance": {"class T3": {"inquisitor": [1334], "champion": [1375], "pyromaniac": [1382], "berserker": [1311], "summoner": [1319], "warlord": [1348], "warden": [1355], "paladin": [1388], "hierarch": [1362]}}, \
			"Trial of Ruse": {"class T3": {"inquisitor": [1332], "summoner": [1318], "assassin": [1368]}}, \
			"Trial of Salvation": {"class T3": {"deathknight": [1325], "slayer": [1340], "warlord": [1349], "warden": [1356], "paladin": [1390], "hierarch": [1361]}}, \
			"Trial of Unity": {"class T3": {"deathknight": [1329], "inquisitor": [1336], "champion": [1378], "pyromaniac": [1385], "berserker": [1315], "summoner": [1322], "assassin": [1371], "slayer": [1343], "warlord": [1350], "warden": [1357], "paladin": [1392], "hierarch": [1364]}}, \
			"Temple of Tides": {"treasure": [2578, 2579, 2580, 2581, 2582, 2583, 2584, 2585], "rare": [2592, 2593], "craft": [2586, 2587, 2588, 2589, 2590, 2591]}, \
			"Bile, Bone and Blood": {"treasure": [2648, 2649, 2650, 2651, 2652, 2653], "rare": [2660, 2661], "craft": [2654, 2655, 2656, 2657, 2658, 2659]}, \
			"Soul Harvester\'s Lab": {"treasure": [1450, 1451, 1452, 1453, 1454, 1455, 1456, 1457, 1458], "rare":[1459, 1460], "craft": [1461, 1462, 1463, 1464, 1465, 1466], "class T3": {"deathknight": [1330], "inquisitor": [1337], "champion": [1379], "pyromaniac": [1386], "berserker": [1316], "summoner": [1323], "assassin": [1372], "slayer": [1344], "warlord": [1351], "warden": [1358], "paladin": [1393], "hierarch": [1365]}}, \
			"The Will of the Living": {"rare": [2691, 2692, 2693], "craft": [2686, 2687, 2688, 2689, 2690]}, \
			"A Cry of the Earth": {"rare": [1571, 1572, 1573], "craft": [1575, 1576, 1577, 1578, 1579, 1580, 2070], "epic": [1574]}, \
			"A Cure": {"treasure": [1596, 1597, 1598, 1599, 1600, 1601, 1602, 1603], "rare":[1608, 1609], "craft": [1604, 1605, 1606, 1607, 1630], "class T3": {"deathknight": [1331], "inquisitor": [1338], "champion": [1380], "pyromaniac": [1387], "berserker": [1317], "summoner": [1324], "assassin": [1373], "slayer": [1345], "warlord": [1352], "warden": [1359], "paladin": [1394], "hierarch": [1366]}}, \
			"Last Echo of the Thunder": {"rare": [1704, 1705, 1706], "craft": [1707, 1708, 1709, 1710, 1711], "epic": [1712]}, \
			"King of No Man": {"treasure": [1655, 1658, 1659, 1660, 1661, 1662, 1663, 1664, 1665, 1667], "rare":[1674, 1675, 1676], "craft": [1668, 1669, 1670, 1671, 1672, 1673], "class T3": {"deathknight": [1688], "inquisitor": [1687], "champion": [1686], "pyromaniac": [1685], "berserker": [1677], "summoner": [1678], "assassin": [1679], "slayer": [1680], "warlord": [1681], "warden": [1682], "paladin": [1683], "hierarch": [1684]}}, \
			"Scorching Sands": {"treasure": [3269, 3270, 3271, 3272, 3273], "rare": [3274, 3275], "craft": [3276, 3277, 3278, 3279, 3280, 3281]}, \
			"Unearthed Horrors": {"rare": [2700, 2701, 2702], "craft": [2694, 2695, 2696, 2697, 2698]}, \
			"A Shudder from the Depths": {"rare": [1737, 1738, 1739], "craft": [1740, 1741, 1742, 1743, 1744], "epic": [1745]}, \
			"Revival of the Fury": {"rare": [1746, 1747, 1748], "craft": [1749, 1750, 1751, 1752, 1753, 1778], "epic": [1754]}, \
			"Water of Life": {"treasure": [1814, 1815, 1816, 1817, 1818, 1819, 1820, 1821, 1822, 1823], "rare": [1830, 1831], "craft": [1824, 1825, 1826, 1827, 1828, 1829], "class T3": {"deathknight": [1813], "inquisitor": [1812], "champion": [1811], "pyromaniac": [1810], "berserker": [1802], "summoner": [1803], "assassin": [1804], "slayer": [1805], "warlord": [1806], "warden": [1807], "paladin": [1808], "hierarch": [1809]}}, \
			"Burdens of Faith": {"treasure": [2324, 2325, 2327, 2328, 2329, 2330, 2331, 2332, 2333], "rare": [2340, 2341], "craft": [2334, 2335, 2336, 2337, 2338, 2339]}, \
			"Statue of Illusions": {"rare": [2228, 2233], "craft": [2220, 2221, 2223, 2224, 2227], "epic": [2232]}, \
			"Call of Conscience": {"treasure": [2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100], "rare": [2107, 2108], "craft": [2101, 2102, 2103, 2104, 2105, 2106]}, \
			"Statue of Discord": {"rare": [2229, 2234], "craft": [2220, 2222, 2223, 2225, 2226], "epic": [2232]}, \
			"Hatred": {"treasure": [2186, 2187, 2188, 2189, 2190, 2191, 2192, 2193, 2194], "rare": [2201, 2202], "craft": [2195, 2196, 2197, 2198, 2199, 2200]}, \
			"The Murder of Prelex": {"treasure": [2342, 2343, 2344, 2345, 2346, 2347, 2348, 2349], "rare": [2360, 2361], "craft": [2350, 2352, 2354, 2356, 2358]}, \
			"Dark Tide": {"treasure": [2449, 2450, 2451, 2452, 2453, 2454, 2455], "rare": [2462, 2463], "craft": [2456, 2457, 2458, 2459, 2460, 2461]}, \
			"Statue of Lies": {"rare": [2230, 2231], "craft": [2221, 2222, 2224, 2225, 2226, 2227], "epic": [2232]}, \
			"Lair of the Artificer": {"treasure": [2203, 2204, 2205, 2206, 2207, 2208, 2209, 2210, 2211], "rare": [2218, 2219], "craft": [2212, 2213, 2214, 2215, 2216, 2217]}, \
			"Solace in Solitude": {"treasure": [3282, 3283, 3284, 3285, 3286, 3287, 3288, 3289], "rare": [3290, 3291], "craft": [3292, 3293, 3294, 3295, 3296, 3297]}, \
			"Crimson Kata Mines": {"treasure": [2464, 2465, 2466, 2467, 2468, 2469, 2470, 2471], "rare": [2478, 2479], "craft": [2472, 2473, 2474, 2475, 2476, 2477]}, \
			"Bloody Deliverance": {"treasure": [3417, 3418, 3419, 3420, 3421, 3422], "rare": [3423, 3424], "craft": [3425, 3426, 3427, 3428, 3429, 3430]}, \
			"Kysin Keep": {"rare": [2704, 2848, 2853, 2854, 2857], "craft": [2840, 2841, 2842, 2843, 2844, 2845, 2849, 2851]}, \
			"Where We All Must Sup": {"treasure": [3146, 3147, 3148, 3149, 3150, 3151], "rare": [3152, 3153], "craft": [3140, 3141, 3142, 3143, 3144, 3145], "class T2": {"mercenary": [3113], "wizard": [3115], "rogue": [3125], "shaman": [3127], "monk": [3117], "sage": [3119], "guard": [3121], "cleric": [3123]}, "class T3": {"deathknight": [3129], "inquisitor": [3134], "champion": [3131], "pyromaniac": [3138], "berserker": [3133], "summoner": [3138], "assassin": [3124], "slayer": [3135], "warlord": [3131], "warden": [3129], "paladin": [3135], "hierarch": [3133]}}, \
			"Unbound": {"treasure": [3380, 3381, 3382, 3383, 3384, 3385], "rare": [3386, 3387], "craft": [3388, 3389, 3378, 3379, 3376, 3377, 3374, 3375, 3372, 3373]}, \
			"all": {"vendor": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 497, 526, 527, 528, 529, 530, 531, 532, 533, 1722, 1723, 1724, 1725], "treasure": [115, 116, 117, 118, 132, 133, 134, 135, 136, 152, 153, 154, 155, 156, 157, 158, 161, 162, 163, 164, 165, 166, 167, 342, 343, 356, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 454, 455, 456, 457, 458, 459, 460, 461, 540, 541, 542, 645, 659, 660, 661, 662, 663, 664, 665, 666, 687, 698, 699, 700, 701, 702, 703, 704, 816, 817, 818, 819, 820, 821, 822, 831, 859, 860, 861, 862, 863, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1086, 1096, 1097, 1098, 1099, 1100, 1241, 1242, 1243, 1244, 1245, 1271, 1272, 1276, 1277, 1278, 1279, 1450, 1451, 1452, 1453, 1454, 1455, 1456, 1457, 1458, 1540, 1541, 1545, 1546, 1596, 1597, 1598, 1599, 1600, 1601, 1602, 1603, 1618, 1619, 1620, 1621, 1622, 1623, 1655, 1658, 1659, 1660, 1661, 1662, 1663, 1664, 1665, 1667, 1718, 1719, 1720, 1814, 1815, 1816, 1817, 1818, 1819, 1820, 1821, 1822, 1823, 1953, 2045, 2087, 2088, 2089, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100, 2186, 2187, 2188, 2189, 2190, 2191, 2192, 2193, 2194, 2203, 2204, 2205, 2206, 2207, 2208, 2209, 2210, 2211, 2324, 2325, 2327, 2328, 2329, 2330, 2331, 2332, 2333, 2342, 2343, 2344, 2345, 2346, 2347, 2348, 2349, 2449, 2450, 2451, 2452, 2453, 2454, 2455, 2464, 2465, 2466, 2467, 2468, 2469, 2470, 2471, 2483, 2484, 2485, 2486, 2576, 2577, 2578, 2579, 2580, 2581, 2582, 2583, 2584, 2585, 2634, 2636, 2637, 2638, 2639, 2640, 2648, 2649, 2650, 2651, 2652, 2653, 2902, 2903, 2904, 2905, 2906, 2907, 3075, 3076, 3077, 3078, 3079, 3094, 3095, 3096, 3097, 3098, 3099, 3100, 3101, 3146, 3147, 3148, 3149, 3150, 3151, 3164, 3269, 3270, 3271, 3272, 3273, 3282, 3283, 3284, 3285, 3286, 3287, 3288, 3289, 3380, 3381, 3382, 3383, 3384, 3385], "rare": [137, 138, 159, 160, 168, 169, 307, 314, 344, 345, 440, 441, 452, 453, 462, 463, 464, 465, 498, 499, 523, 524, 667, 668, 705, 706, 823, 833, 864, 865, 882, 883, 884, 895, 896, 897, 1059, 1060, 1101, 1102, 1246, 1247, 1280, 1281, 1459, 1460, 1571, 1572, 1573, 1608, 1609, 1674, 1675, 1676, 1704, 1705, 1706, 1737, 1738, 1739, 1746, 1747, 1748, 1830, 1831, 1855, 1954, 2090, 2091, 2107, 2108, 2201, 2202, 2218, 2219, 2228, 2229, 2230, 2231, 2233, 2234, 2340, 2341, 2360, 2361, 2462, 2463, 2478, 2479, 2592, 2593, 2646, 2647, 2660, 2661, 2691, 2692, 2693, 2700, 2701, 2702, 2703, 2704, 2848, 2853, 2854, 2857, 2898, 2899, 2900, 2914, 2915, 2916, 3080, 3081, 3102, 3103, 3152, 3153, 3274, 3275, 3290, 3291, 3362, 3386, 3387], "craft": [355, 357, 358, 359, 360, 361, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 404, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 537, 538, 539, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 707, 708, 709, 710, 715, 716, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 824, 825, 826, 827, 828, 829, 830, 832, 834, 835, 836, 837, 875, 876, 877, 878, 879, 880, 885, 886, 887, 888, 889, 890, 898, 899, 900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1104, 1105, 1106, 1107, 1108, 1109, 1211, 1212, 1213, 1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1230, 1231, 1232, 1248, 1249, 1250, 1251, 1252, 1282, 1283, 1284, 1285, 1286, 1287, 1410, 1411, 1412, 1413, 1414, 1415, 1416, 1417, 1418, 1419, 1420, 1421, 1422, 1423, 1424, 1425, 1426, 1427, 1428, 1429, 1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469, 1470, 1471, 1472, 1473, 1474, 1475, 1476, 1477, 1478, 1479, 1480, 1481, 1482, 1483, 1484, 1485, 1486, 1487, 1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1515, 1516, 1517, 1518, 1525, 1526, 1527, 1528, 1529, 1531, 1532, 1533, 1534, 1535, 1537, 1538, 1539, 1549, 1550, 1551, 1552, 1553, 1554, 1555, 1556, 1575, 1576, 1577, 1578, 1579, 1580, 1604, 1605, 1606, 1607, 1610, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1625, 1626, 1627, 1628, 1629, 1630, 1632, 1633, 1634, 1635, 1636, 1637, 1638, 1639, 1640, 1641, 1668, 1669, 1670, 1671, 1672, 1673, 1690, 1691, 1692, 1693, 1694, 1695, 1696, 1697, 1698, 1699, 1707, 1708, 1709, 1710, 1711, 1740, 1741, 1742, 1743, 1744, 1749, 1750, 1751, 1752, 1753, 1757, 1758, 1759, 1760, 1761, 1762, 1763, 1764, 1765, 1766, 1767, 1768, 1770, 1771, 1778, 1779, 1780, 1781, 1782, 1824, 1825, 1826, 1827, 1828, 1829, 1867, 1868, 1869, 1870, 1871, 1872, 1873, 1874, 1875, 1876, 1877, 1878, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1963, 1964, 1965, 1966, 1967, 1968, 2070, 2101, 2102, 2103, 2104, 2105, 2106, 2195, 2196, 2197, 2198, 2199, 2200, 2212, 2213, 2214, 2215, 2216, 2217, 2220, 2221, 2222, 2223, 2224, 2225, 2226, 2227, 2235, 2236, 2237, 2238, 2239, 2240, 2241, 2242, 2243, 2244, 2245, 2246, 2298, 2334, 2335, 2336, 2337, 2338, 2339, 2350, 2352, 2354, 2356, 2358, 2456, 2457, 2458, 2459, 2460, 2461, 2472, 2473, 2474, 2475, 2476, 2477, 2574, 2586, 2587, 2588, 2589, 2590, 2591, 2641, 2642, 2643, 2644, 2645, 2654, 2655, 2656, 2657, 2658, 2659, 2662, 2663, 2664, 2665, 2666, 2686, 2687, 2688, 2689, 2690, 2694, 2695, 2696, 2697, 2698, 2716, 2834, 2836, 2838, 2839, 2840, 2841, 2842, 2843, 2844, 2845, 2846, 2847, 2849, 2850, 2851, 2852, 2855, 2856, 2859, 2901, 2908, 2909, 2910, 2911, 2912, 2913, 2917, 3082, 3083, 3084, 3085, 3086, 3087, 3088, 3089, 3090, 3091, 3092, 3093, 3140, 3141, 3142, 3143, 3144, 3145, 3154, 3155, 3156, 3157, 3158, 3159, 3161, 3276, 3277, 3278, 3279, 3280, 3281, 3292, 3293, 3294, 3295, 3296, 3297, 3298, 3299, 3300, 3301, 3302, 3303, 3372, 3373, 3374, 3375, 3376, 3377, 3378, 3379, 3388, 3389], "class T1": {"fighter": [558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 3104, 3105], "scout": [603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 3110, 3111], "novice": [624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 3106, 3107], "recruit": [579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 3108, 3109]}, "class T2": {"mercenary": [923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 3112, 3113], "wizard": [938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 3114, 3115], "rogue": [953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 3124, 3125], "shaman": [968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 3126, 3127], "monk": [1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 3116, 3117], "sage": [1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 3118, 3119], "guard": [983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 3120, 3121], "cleric": [998, 999, 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 3122, 3123]}, "class T3": {"deathknight": [1325, 1326, 1327, 1328, 1329, 1330, 1331, 1688, 1813, 1971, 3128, 3129], "inquisitor": [1332, 1333, 1334, 1335, 1336, 1337, 1338, 1687, 1812, 1972, 3128, 3134], "champion": [1374, 1375, 1376, 1377, 1378, 1379, 1380, 1686, 1811, 1978, 3130, 3131], "pyromaniac": [1381, 1382, 1383, 1384, 1385, 1386, 1387, 1685, 1810, 1979, 3132, 3138], "berserker": [1311, 1312, 1313, 1314, 1315, 1316, 1317, 1677, 1802, 1969, 3132, 3133], "summoner": [1318, 1319, 1320, 1321, 1322, 1323, 1324, 1678, 1803, 1970, 3137, 3138], "assassin": [1367, 1368, 1369, 1370, 1371, 1372, 1373, 1679, 1804, 1977, 3124, 3130], "slayer": [1339, 1340, 1341, 1342, 1343, 1344, 1345, 1680, 1805, 1973, 3135, 3139], "warlord": [1346, 1347, 1348, 1349, 1350, 1351, 1352, 1681, 1806, 1974, 3131, 3137], "warden": [1353, 1354, 1355, 1356, 1357, 1358, 1359, 1682, 1807, 1975, 3129, 3139], "paladin": [1388, 1389, 1390, 1391, 1392, 1393, 1394, 1683, 1808, 1980, 3135, 3136], "hierarch": [1360, 1361, 1362, 1363, 1364, 1365, 1366, 1684, 1809, 1976, 3133, 3136]}, "epic": [1574, 1712, 1745, 1754, 1755, 1945, 2232, 2481, 2527, 2528, 2529, 2530, 2531, 2532, 2533, 2534, 2535, 2536, 2537, 2538, 2539, 2540, 2541, 2542, 3368, 3369, 3370, 3371]} \
		}'
      );
    if (Name == 'The "Game"') Name = "The Game";
    return WL.Estiah.Drops.Table[Name];
  };
  WL.Estiah.Drops.Show = function (Div, Name) {
    var loot, id, count, charm, frame, name, rarity, description, rune1, rune2;
    loot = WL.Estiah.Drops.Get(Name);
    if (loot === undefined) {
      Div.innerHTML = "Dungeon not implemented yet";
      return;
    }
    var p = [0, 0, 0, 0];
    var uniques = [2481, 3368, 3369, 3370, 3371];
    for (rarity in loot) {
      if (rarity == "class T1")
        loot[rarity] = loot[rarity][WL.Globals.Class["T1"]];
      if (rarity == "class T2")
        loot[rarity] = loot[rarity][WL.Globals.Class["T2"]];
      if (rarity == "class T3")
        loot[rarity] = loot[rarity][WL.Globals.Class["T3"]];
      for (id in loot[rarity]) {
        if (!isNaN(id)) {
          var maxcount = 5;
          if (uniques.indexOf(loot[rarity][id]) > -1) maxcount = 1;
          p[1]++;
          p[3] += maxcount;
          frame = -1;
          charm = top.frames[0].document.evaluate(
            '//div[@id="Card' +
              loot[rarity][id] +
              '"]/div/div[substring-before(@class, " ")="name"]',
            top.frames[0].document,
            null,
            XPathResult.ANY_UNORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          if (charm != null) frame = 0;
          else {
            charm = top.frames[1].document.evaluate(
              '//div[@id="Card' +
                loot[rarity][id] +
                '"]/div/div[substring-before(@class, " ")="name"]',
              top.frames[1].document,
              null,
              XPathResult.ANY_UNORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            if (charm != null) frame = 1;
          }
          if (frame > -1) {
            p[0]++;
            top.frames[frame].document.evaluate(
              'div[contains(@class, "count")]',
              charm.parentNode,
              null,
              XPathResult.ANY_UNORDERED_NODE_TYPE,
              null
            ).singleNodeValue.innerHTML;
            name = charm.innerHTML;
            description = top.frames[frame].document.evaluate(
              'div[@class="description"]',
              charm.parentNode,
              null,
              XPathResult.ANY_UNORDERED_NODE_TYPE,
              null
            ).singleNodeValue.innerHTML;
            rune1 = top.frames[frame].document.evaluate(
              'div[contains(@class, "minirune_l")]',
              charm.parentNode,
              null,
              XPathResult.ANY_UNORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            rune1 = rune1.getAttribute("class").substring(29);
            rune1 = rune1.substring(0, rune1.indexOf(" "));
            rune2 = top.frames[frame].document.evaluate(
              'div[contains(@class, "minirune_r")]',
              charm.parentNode,
              null,
              XPathResult.ANY_UNORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            if (rune2 != null) {
              rune2 = rune2.getAttribute("class").substring(29);
              rune2 = rune2.substring(0, rune2.indexOf(" "));
            } else rune2 = "null";
            count = parseInt(
              top.frames[frame].document.evaluate(
                'div[contains(@class, "count")]',
                charm.parentNode,
                null,
                XPathResult.ANY_UNORDERED_NODE_TYPE,
                null
              ).singleNodeValue.innerHTML
            );
            runes =
              rune1.substring(0, 1).toUpperCase() +
              rune1.substring(1) +
              (rune2 != "null"
                ? " / " +
                  rune2.substring(0, 1).toUpperCase() +
                  rune2.substring(1)
                : "");
          } else {
            name = "Charm " + loot[rarity][id];
            count = 0;
          }
          p[2] += count;
          with (Div) {
            with (appendChild(WL.Node.Create("div", [["class", "gm_popup"]]))) {
              appendChild(
                WL.Node.Create(
                  "a",
                  [
                    [
                      "href",
                      WL.Globals.Options.Wiki.Value +
                        WL.String.Cut(name, "&nbsp;", "_"),
                    ],
                    ["class", "c" + rarity],
                    ["style", "text-decoration: none;"],
                  ],
                  "[" + name + "]"
                )
              );
              innerHTML += " ";
              appendChild(
                WL.Node.Create(
                  "span",
                  [
                    [
                      "class",
                      count < maxcount ? (count == 0 ? "pow" : "spi") : "lhp",
                    ],
                  ],
                  "(" + count + "/" + maxcount + ")"
                )
              );
              if (frame > -1) {
                with (appendChild(
                  WL.Node.Hide(
                    WL.Node.Create("div", [
                      ["class", "common_file floating opacity bd1"],
                    ])
                  )
                )) {
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "title c" + rarity]],
                      "Charm: " +
                        name +
                        " (" +
                        rarity.substring(0, 1).toUpperCase() +
                        rarity.substring(1) +
                        ")"
                    )
                  );
                  appendChild(
                    WL.Node.Create(
                      "div",
                      [["class", "description"]],
                      description +
                        '<br><br><span class="c2">Runes: ' +
                        runes +
                        "</span>"
                    )
                  );
                }
              }
            }
            appendChild(WL.Node.Create("br"));
          }
        }
      }
    }
    Div.insertBefore(
      WL.Node.Create(
        "span",
        [],
        "unique: " +
          p[0] +
          "/" +
          p[1] +
          " charms<br>overall: " +
          p[2] +
          "/" +
          p[3] +
          " charms<br>"
      ),
      Div.firstChild
    );
  };

  //addon
  if (WL.Data.Load(dungeonloot_name + "_enabled")) {
    if (
      top.document.title == "Dungeon - Estiah" ||
      top.document.title == "Dungeon Diary - Estiah"
    ) {
      //wait
      temp = WL.Node.Select("//body").appendChild(
        WL.Node.Hide(
          WL.Node.Create("div", [
            ["id", "wl_charms_loaded"],
            ["active", "no"],
            ["archive", "no"],
          ])
        )
      );

      // temp.addEventListener(
      //   "DOMAttrModified",
      //   function () {
      //     //stop if one of them isn't loaded
      //     if (
      //       this.getAttribute("active") == "no" ||
      //       this.getAttribute("archive") == "no"
      //     )
      //       return;
      //     //start
      //     if (WL.Estiah.Drops.All) {
      //       WL.Estiah.Page.Charms();
      //       return;
      //     }
      //     var drops, name;
      //     drops = WL.Node.Select('//div[@id="wl_dungeondrops"]');
      //     drops.innerHTML = "";
      //     name = WL.Node.Select('//div[@class="section_title c2"]').innerHTML;
      //     //diary
      //     if (name.indexOf("(") != -1)
      //       name = name.substring(0, name.indexOf("(") - 1);
      //     //wikilinks
      //     if (name.indexOf("<") != -1)
      //       name = name.substring(0, name.indexOf("<"));
      //     if (top.document.title == "Dungeon - Estiah")
      //       WL.Estiah.Drops.Show(drops, name);
      //     else {
      //       if (name == "Adventurer's Diary")
      //         WL.Node.ForEach(
      //           '//div[@class="section_text format"]/div/a/strong',
      //           function (node) {
      //             drops = node.parentNode.parentNode.appendChild(
      //               WL.Node.Create("div", [["class", "format log"]])
      //             );
      //             WL.Estiah.Drops.Show(drops, node.innerHTML);
      //           }
      //         );
      //       else WL.Estiah.Drops.Show(drops, name);
      //     }
      //   },
      //   false
      // );
      // edit by qianyuan
      var mutationObserver = new MutationObserver(function () {
        //stop if one of them isn't loaded
        if (
          temp.getAttribute("active") == "no" ||
          temp.getAttribute("archive") == "no"
        )
          return;
        //start
        if (WL.Estiah.Drops.All) {
          WL.Estiah.Page.Charms();
          return;
        }
        var drops, name;
        drops = WL.Node.Select('//div[@id="wl_dungeondrops"]');
        drops.innerHTML = "";
        name = WL.Node.Select('//div[@class="section_title c2"]').innerHTML;
        //diary
        if (name.indexOf("(") != -1)
          name = name.substring(0, name.indexOf("(") - 1);
        //wikilinks
        if (name.indexOf("<") != -1)
          name = name.substring(0, name.indexOf("<"));
        if (top.document.title == "Dungeon - Estiah")
          WL.Estiah.Drops.Show(drops, name);
        else {
          if (name == "Adventurer's Diary")
            WL.Node.ForEach(
              '//div[@class="section_text format"]/div/a/strong',
              function (node) {
                drops = node.parentNode.parentNode.appendChild(
                  WL.Node.Create("div", [["class", "format log"]])
                );
                WL.Estiah.Drops.Show(drops, node.innerHTML);
              }
            );
          else WL.Estiah.Drops.Show(drops, name);
        }
      });
      mutationObserver.observe(temp, { attributes: true });

      //add load button
      temp = WL.Node.Select('//div[@class="section_text"]');
      with (temp) {
        with (appendChild(
          WL.Node.Create("div", [
            ["id", "wl_dungeondrops"],
            ["style", "float: none;"],
          ])
        )) {
          appendChild(WL.Node.Create("br"));
          appendChild(WL.Node.Create("br"));
          appendChild(
            WL.Node.Create("a", [], "Show dungeon loot", function () {
              //load charms
              var drops = WL.Node.Create(
                "div",
                [
                  ["id", "wl_dungeondrops"],
                  ["class", "format log"],
                ],
                WL.Globals.Options.Loading.Value + " loading dungeon loot..."
              );
              WL.Node.Replace(this.parentNode, drops);
              WL.Estiah.LoadClass();
              WL.Estiah.Drops.Load();
            })
          );
          if (top.document.title == "Dungeon Diary - Estiah") {
            appendChild(WL.Node.Create("br"));
            appendChild(WL.Node.Create("br"));
            appendChild(
              WL.Node.Create(
                "a",
                [],
                "Show all charms (long load)",
                function () {
                  WL.Estiah.Drops.All = true;
                  var drops = WL.Node.Create(
                    "div",
                    [
                      ["id", "wl_dungeondrops"],
                      ["class", "format log"],
                    ],
                    WL.Globals.Options.Loading.Value + " loading charms..."
                  );
                  WL.Node.Replace(this.parentNode, drops);
                  WL.Estiah.LoadClass();
                  WL.Estiah.Drops.Load();
                }
              )
            );
          }
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////
  //messagebox
  ////////////////////////////////////////////////////////////////

  //info
  var messagebox_name = "MessageBox";
  var messagebox_version = "0.5.3";
  WL.Addon.Register(
    messagebox_name,
    "This addon allows you to keep track of your messages.",
    messagebox_version,
    "WL"
  );

  //functions
  WL.Estiah.Page.Messages = function () {
    var page;
    page = WL.Estiah.Page.New(
      "Messages",
      "Players may send you quick messages in your message box. If you don't wish to receive messages from a specific player, you can [Ignore] him/her while inspecting. Messages will only be kept until you delete them."
    );
    WL.Estiah.Show(page, allinone_name + " - Message - Estiah");
    page.firstChild.appendChild(
      WL.Node.Create("div", [["class", "section_text format wl_messagebox"]])
    );
  };
  WL.Estiah.Message = {};
  WL.Estiah.Message.New = [];
  WL.Estiah.Message.Page = 1;
  WL.Estiah.Message.SaveMessagebox = function () {
    WL.Data.Save(
      messagebox_name + "_messages_" + WL.Globals.PlayerID,
      JSON.stringify(WL.Estiah.Messagebox)
    );
  };
  WL.Estiah.Message.Send = function (UserID, Message, Top) {
    var sendtext = encodeURIComponent(Message);
    WL.Data.Post(
      WL.Globals.Options.Domain.Value + "/json/user/message/send/id/" + UserID,
      "message=" + sendtext,
      function (responseDetails) {
        var response, orb, time, showresponse;
        response = JSON.parse(responseDetails.responseText);
        if (response.success) {
          orb = 3;
          time = WL.Estiah.Time();
          //save it
          //WL.Estiah.Message.Save(userid, "", "", "out", time, sendtext)
          //show it
          if (!Top)
            WL.Estiah.Message.Show(
              UserID,
              "out",
              time,
              WL.String.Cut(decodeURIComponent(sendtext), "\n", "<br>"),
              true
            );
          //save data
          //WL.Estiah.Message.SaveMessagebox();
        } else orb = 2;
        if (Top) UserID = 0;
        with (WL.Node.Select('//div[@id="wl_response_' + UserID + '"]'))
          with (appendChild(WL.Node.Create("div"))) {
            appendChild(WL.Node.Create("div", [["class", "orb orb_c" + orb]]));
            appendChild(WL.Node.Create("div", [], response.msg));
          }
        WL.Node.Show(WL.Node.Select('//a[@id="wl_reply_' + UserID + '"]'));
      }
    );
  };
  WL.Estiah.Message.Save = function (UserID, Name, Avatar, State, Time, Text) {
    var msg = {};
    if (WL.Estiah.Messagebox[UserID] === undefined) {
      WL.Estiah.Messagebox[UserID] = {};
      WL.Estiah.Messagebox[UserID]["messages"] = [];
    }
    if (Name != "") WL.Estiah.Messagebox[UserID]["name"] = Name;
    if (Avatar != "") WL.Estiah.Messagebox[UserID]["avatar"] = Avatar;
    msg["state"] = State;
    msg["time"] = Time;
    msg["text"] = Text;
    WL.Estiah.Messagebox[UserID]["messages"].push(msg);
    WL.List.Delete(messagebox_name + "_order_" + WL.Globals.PlayerID, UserID);
    WL.List.InsertFirst(
      messagebox_name + "_order_" + WL.Globals.PlayerID,
      UserID
    );
  };
  WL.Estiah.Message.Load = function (responseDetails) {
    var messages;
    if (responseDetails !== undefined)
      messages = WL.Node.Create("div", [], responseDetails.responseText);
    lasttime = WL.Data.Load(messagebox_name + "_newest_" + WL.Globals.PlayerID);
    if (
      WL.Node.ForEach(
        '//div[@class="message"]',
        function (node) {
          var msg, start;
          msg = {};
          user = WL.Node.Select('div[@class="title lhp"]/a', node);
          msg.userid = user.getAttribute("href").substring(11);
          msg.name = user.innerHTML;
          msg.title = WL.Node.Stringify('div[@class="title lhp"]', node);
          temp = msg.title.indexOf(" at ");
          msg.time = msg.title.substring(temp + 4, temp + 23);
          if (msg.time == lasttime) return false;
          if (msg.title.indexOf("From ") != -1) {
            msg.avatar = WL.Node.Select(
              'div[@class="avatar"]',
              node
            ).getAttribute("style");
            msg.avatar = msg.avatar.substring(
              msg.avatar.indexOf("url(") + 4,
              msg.avatar.indexOf(")")
            );
            if (msg.avatar.substring(0, 1) == '"')
              msg.avatar = msg.avatar.substring(1, msg.avatar.length - 1);
            msg.state = "new";
          } else {
            msg.avatar = "";
            msg.state = "out";
          }
          msg.text = WL.Node.Select('div[@class="text"]', node).innerHTML;
          WL.Estiah.Message.New.push(msg);
        },
        messages
      ) !== false
    ) {
      //if not yet return false! load pagination stuff
      WL.Estiah.Message.Page++;
      //get next page
      if (
        WL.Node.Select(
          '//div[@class="pagination"]/a[@href="/user/message/index/page/' +
            WL.Estiah.Message.Page +
            '"]'
        ) != null
      )
        WL.Data.Get(
          WL.Globals.Options.Domain.Value +
            "/user/message/index/page/" +
            WL.Estiah.Message.Page,
          WL.Estiah.Message.Load
        );
      else WL.Estiah.Message.Box();
    } else WL.Estiah.Message.Box();
  };
  WL.Estiah.Message.Show = function (
    UserID,
    State,
    Time,
    Text,
    Visibility,
    MsgID
  ) {
    var node, reply;
    node = WL.Node.Select('//div[@id="message' + UserID + '"]');
    reply = WL.Node.Select('div[contains(@class, "wl_reply")]', node);
    if (reply == null) reply = WL.Node.Select('div[@class="avatar"]', node);
    with (node) {
      insertBefore(
        WL.Node.Visibility(
          WL.Node.Create("div", [["class", "text content wl_" + State]], Text),
          Visibility
        ),
        reply.nextSibling
      );
      with (insertBefore(
        WL.Node.Visibility(
          WL.Node.Create("div", [["class", "title lhp content wl_" + State]]),
          Visibility
        ),
        reply.nextSibling
      )) {
        innerHTML += Time;
        with (appendChild(WL.Node.Create("div", [["class", "functions"]]))) {
          appendChild(
            WL.Node.Create("a", [["class", "lhp"]], "[Delete]", function () {
              //hide it
              WL.Node.Remove(this.parentNode.parentNode.nextSibling);
              WL.Node.Remove(this.parentNode.parentNode);
              //delete
              if (MsgID !== undefined) {
                WL.Estiah.Messagebox[UserID]["messages"][MsgID] = "";
                WL.Estiah.Message.SaveMessagebox();
              }
            })
          );
        }
      }
    }
  };
  WL.Estiah.Message.Box = function () {
    var node, newmessages, userid, msgid, user, info, reply, time, visible;
    while ((msg = WL.Estiah.Message.New.pop())) {
      WL.Estiah.Message.Save(
        msg.userid,
        msg.name,
        msg.avatar,
        msg.state,
        msg.time,
        msg.text
      );
      lasttime = msg.time;
    }
    WL.CSS.Add(
      ".message .summary { margin: 0 0 0 0; padding: 6px 6px 6px 6px; } .message .content { margin: 0 0 0 78px; padding: 6px 6px 6px 6px; } .message .wl_in { background-color: #320; } .message .wl_out { background-color: #210; } .wl_reply { position: relative; } .wl_reply .textarea { font-size: 12px; width: 80%; height: 70px; float: left; } .wl_reply .wl_button { position: absolute; bottom: 6px; right: 6px; }"
    );
    page = WL.Node.Select('//div[@class="section_text format wl_messagebox"]');
    page.innerHTML = "";
    reply = WL.Node.Create("div", [["class", "avatar"]]);
    with (page) {
      with (appendChild(
        WL.Node.Create("div", [
          ["id", "message" + userid],
          ["class", "message"],
        ])
      )) {
        appendChild(reply);
        with (insertBefore(
          WL.Node.Create("div", [["class", "text wl_reply summary wl_out"]]),
          reply.nextSibling
        )) {
          appendChild(
            WL.Node.Create("textarea", [
              ["id", "wl_sendtext_0"],
              ["class", "c2 bd1 textarea"],
            ])
          );
          appendChild(
            WL.Button.Create(
              "Send",
              1,
              function () {
                var i, sendtext, recipient, recipients;
                WL.Node.Hide(this);
                WL.Node.Select('//div[@id="wl_response_0"]').innerHTML = "";
                sendtext = WL.Node.Select(
                  '//textarea[@id="wl_sendtext_0"]'
                ).value;
                recipients = WL.String.Cut(
                  WL.Node.Select('//input[@id="wl_sendto"]').value,
                  " "
                ).split(",");
                WL.Globals.Recipients = {};
                for (i in recipients) {
                  recipient = recipients[i];
                  if (parseInt(recipient))
                    WL.Estiah.Message.Send(recipient, sendtext, true);
                  else
                    WL.Globals.Recipients[
                      recipient.substring(0, 1).toUpperCase() +
                        recipient.substring(1).toLowerCase()
                    ] = false;
                }
                for (recipient in WL.Globals.Recipients) {
                  //get id from name
                  WL.Data.Post(
                    WL.Globals.Options.Domain.Value + "/json/user/search",
                    "input=" + recipient,
                    function (responseDetails) {
                      response = JSON.parse(responseDetails.responseText);
                      if (response.success) {
                        var i, a, b, c;
                        for (var i in WL.Globals.Recipients) {
                          if (!WL.Globals.Recipients[i]) {
                            if (
                              (a = response.msg.indexOf(">" + i + "<")) > -1
                            ) {
                              WL.Globals.Recipients[i] = true;
                              b = response.msg.indexOf(
                                '" class="nolink">',
                                a - 100
                              );
                              c = response.msg.indexOf(
                                '<a href="/character/',
                                a - 100
                              );
                              WL.Estiah.Message.Send(
                                response.msg.substring(c + 20, b),
                                sendtext,
                                true
                              );
                            }
                          }
                        }
                      }
                    }
                  );
                }
              },
              "wl_reply_0"
            )
          );
          appendChild(WL.Node.Create("div", [["id", "wl_response_0"]]));
        }
        with (insertBefore(
          WL.Node.Create("div", [["class", "title lhp summary wl_out"]]),
          reply.nextSibling
        )) {
          innerHTML += "To: ";
          appendChild(
            WL.Node.Create("input", [
              ["class", "input bd1 c2"],
              ["id", "wl_sendto"],
            ])
          );
          /*
				innerHTML += "With ";
				appendChild(WL.Node.Create("a", [["class", "c2"], ["href", "/character/" + userid]], WL.Estiah.Messagebox[userid]["name"]));
				if (WL.Estiah.Messagebox[userid]["messages"].length != 0)
					innerHTML += " (" + WL.Estiah.Messagebox[userid]["messages"].length + " message" + (WL.Estiah.Messagebox[userid]["messages"].length == 1 ? "" : "s") + ", last at " + WL.Estiah.Messagebox[userid]["messages"][WL.Estiah.Messagebox[userid]["messages"].length - 1]["time"] + ")";
				*/
        }
      }
    }
    //add all contacts
    WL.List.ForEach(
      messagebox_name + "_order_" + WL.Globals.PlayerID,
      function (userid) {
        //image fix
        if (WL.Estiah.Messagebox[userid]["avatar"]) {
          if (WL.Estiah.Messagebox[userid]["avatar"].substring(0, 1) != "/")
            WL.Estiah.Messagebox[userid]["avatar"] =
              "/" + WL.Estiah.Messagebox[userid]["avatar"];
          if (
            WL.Estiah.Messagebox[userid]["avatar"].substring(
              WL.Estiah.Messagebox[userid]["avatar"].length - 3
            ) == ".pn"
          )
            WL.Estiah.Messagebox[userid]["avatar"] =
              WL.Estiah.Messagebox[userid]["avatar"] + "g";
        }
        //
        reply = WL.Node.Create("div", [
          ["class", "avatar"],
          [
            "style",
            "background:url('" +
              WL.Estiah.Messagebox[userid]["avatar"] +
              "') repeat scroll 0% 0% transparent;",
          ],
        ]);
        with (page) {
          with (appendChild(
            WL.Node.Create("div", [
              ["id", "message" + userid],
              ["class", "message"],
            ])
          )) {
            appendChild(reply);
            var dmsg = [];
            for (msgid in WL.Estiah.Messagebox[userid]["messages"]) {
              //delete if marked so. does this break the msgid? YES IT DOES!
              if (WL.Estiah.Messagebox[userid]["messages"][msgid] == "") {
                dmsg.push(msgid);
                continue;
              }
              time = WL.Estiah.Messagebox[userid]["messages"][msgid]["time"];
              if (
                WL.Estiah.Messagebox[userid]["messages"][msgid]["state"] ==
                "new"
              ) {
                time = "<div style='color: #f70;'>*NEW*&nbsp;</div>" + time;
                visible = true;
                WL.Estiah.Messagebox[userid]["messages"][msgid]["state"] = "in";
              } else visible = false;
              WL.Estiah.Message.Show(
                userid,
                WL.Estiah.Messagebox[userid]["messages"][msgid]["state"],
                time,
                WL.Estiah.Messagebox[userid]["messages"][msgid]["text"],
                visible,
                msgid
              );
            }
            while ((msgid = dmsg.pop()))
              WL.Estiah.Messagebox[userid]["messages"].splice(msgid, 1);
            with (insertBefore(
              WL.Node.Create("div", [
                ["class", "text wl_reply summary wl_out"],
              ]),
              reply.nextSibling
            )) {
              appendChild(
                WL.Node.Create("textarea", [
                  ["id", "wl_sendtext_" + userid],
                  ["class", "c2 bd1 textarea"],
                ])
              );
              appendChild(
                WL.Button.Create(
                  "Send",
                  1,
                  function () {
                    WL.Node.Hide(this);
                    WL.Node.Select(
                      '//div[@id="wl_response_' + userid + '"]'
                    ).innerHTML = "";
                    WL.Estiah.Message.Send(
                      userid,
                      WL.Node.Select(
                        '//textarea[@id="wl_sendtext_' + userid + '"]'
                      ).value
                    );
                  },
                  "wl_reply_" + userid
                )
              );
              appendChild(
                WL.Node.Create("div", [["id", "wl_response_" + userid]])
              );
              appendChild(
                WL.Node.Create(
                  "a",
                  [["class", "nolink wl_button"]],
                  "[Show messages]",
                  function () {
                    WL.Node.ForEach(
                      'div[contains(@class, "content wl_in") or contains(@class, "content wl_out")]',
                      function (node) {
                        WL.Node.Show(node);
                      },
                      this.parentNode.parentNode
                    );
                    WL.Node.Hide(this);
                    WL.Node.Show(this.nextSibling);
                  }
                )
              );
              appendChild(
                WL.Node.Hide(
                  WL.Node.Create(
                    "a",
                    [["class", "nolink wl_button"]],
                    "[Hide messages]",
                    function () {
                      WL.Node.ForEach(
                        'div[contains(@class, "content wl_in") or contains(@class, "content wl_out")]',
                        function (node) {
                          WL.Node.Hide(node);
                        },
                        this.parentNode.parentNode
                      );
                      WL.Node.Hide(this);
                      WL.Node.Show(this.previousSibling);
                    }
                  )
                )
              );
            }
            with (insertBefore(
              WL.Node.Create("div", [["class", "title lhp summary wl_out"]]),
              reply.nextSibling
            )) {
              innerHTML += "With ";
              appendChild(
                WL.Node.Create(
                  "a",
                  [
                    ["class", "c2"],
                    ["href", "/character/" + userid],
                  ],
                  WL.Estiah.Messagebox[userid]["name"]
                )
              );
              if (WL.Estiah.Messagebox[userid]["messages"].length != 0)
                innerHTML +=
                  " (" +
                  WL.Estiah.Messagebox[userid]["messages"].length +
                  " message" +
                  (WL.Estiah.Messagebox[userid]["messages"].length == 1
                    ? ""
                    : "s") +
                  ", last at " +
                  WL.Estiah.Messagebox[userid]["messages"][
                    WL.Estiah.Messagebox[userid]["messages"].length - 1
                  ]["time"] +
                  ")";
              appendChild(
                WL.Node.Create("div", [["class", "functions"]])
              ).appendChild(
                WL.Node.Create(
                  "a",
                  [["class", "lhp"]],
                  "[Delete all]",
                  function () {
                    WL.Node.Remove(this.parentNode.parentNode.parentNode);
                    delete WL.Estiah.Messagebox[userid];
                    WL.List.Delete(
                      messagebox_name + "_order_" + WL.Globals.PlayerID,
                      userid
                    );
                    WL.Estiah.Message.SaveMessagebox();
                  }
                )
              );
              appendChild(
                WL.Node.Create("div", [["class", "functions"]])
              ).appendChild(
                WL.Node.Create("a", [["class", "lhp"]], "[Prune]", function () {
                  var lastmessage, prunedate;
                  prunedate = new Date().getTime() - 10 * 24 * 60 * 60 * 1000;
                  while (
                    (message = WL.Estiah.Messagebox[userid]["messages"].shift())
                  ) {
                    lastmessage = message;
                    var date = WL.String.Cut(
                      message["time"],
                      "[ :]",
                      "-"
                    ).split("-");
                    if (
                      Date.UTC(
                        date[0],
                        date[1] - 1,
                        date[2],
                        date[3],
                        date[4],
                        date[5]
                      ) > prunedate
                    )
                      break;
                  }
                  WL.Estiah.Messagebox[userid]["messages"].unshift(lastmessage);
                  //save data
                  WL.Estiah.Message.SaveMessagebox();
                })
              );
            }
          }
        }
      }
    );
    WL.Data.Save(messagebox_name + "_newest_" + WL.Globals.PlayerID, lasttime);
    WL.Estiah.Message.SaveMessagebox();
  };

  //addon
  if (WL.Data.Load(messagebox_name + "_enabled")) {
    /*
	if (window.location.href.substring(0, WL.Globals.Options.Domain.Value.length + 11) == WL.Globals.Options.Domain.Value + "/character/" && !isNaN(parseInt(window.location.href.substring(WL.Globals.Options.Domain.Value.length + 11))))
	{
		//save message to outbox
		WL.Node.Select('//div[@id="MessageSubmit"]/a').addEventListener("click", function()
		{
			GM_log(this.getAttribute("href").substring(27));//id
			GM_log(WL.Node.Select('//textarea[@id="MessageText"]').innerHTML);//text?
			style = WL.Node.Select('//div[@class="avatar"]').getAttribute("style");
			avatar = style.substring(style.indexOf("(") + 1, style.indexOf(")"));
			name = document.title.substring(0, document.title.length - 9);
		}, false);
	}
	*/
    if (
      top.document.title == "Message - Estiah" &&
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 25
      ) !=
        WL.Globals.Options.Domain.Value + "/user/message/index/page/"
    ) {
      var lasttime;
      //load messagebox
      WL.Estiah.Messagebox = JSON.parse(
        WL.Data.Load(messagebox_name + "_messages_" + WL.Globals.PlayerID, "{}")
      );
      //show new interface
      WL.Estiah.Page.Messages();
      WL.Node.Select(
        '//div[@class="section_text format wl_messagebox"]'
      ).innerHTML = WL.Globals.Options.Loading.Value + " Fetching messages...";
      //save new messages
      WL.Estiah.Message.Load();
    }
  }

  ////////////////////////////////////////////////////////////////
  //guildhelper
  ////////////////////////////////////////////////////////////////

  //info
  var guildhelper_name = "GuildHelper";
  var guildhelper_version = "0.5.1";
  WL.Addon.Register(
    guildhelper_name,
    "This addon allows you to see detailed battle reports and lay siege to hidden guilds.",
    guildhelper_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(guildhelper_name + "_enabled")) {
    if (
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 18
      ) ==
      WL.Globals.Options.Domain.Value + "/guild/war/report/"
    ) {
      WL.CSS.Add(".bastion_show + .button { margin-left: 295px; }");
      var showresults = WL.Node.Select('//div[@id="ReportShow"]/a');
      showresults.parentNode.parentNode.insertBefore(
        WL.Button.Create("Show Detailed Result", 1, function () {
          WL.CSS.Add(".gmember .gavatar .gname { margin-top: 0; }");
          WL.Node.Hide(this.parentNode);
          WL.Node.Click(showresults);
          WL.Node.ForEach(
            '//div[@class="paragraph_text format log"]/div[@class="section_text"]//a[contains(@href, "/character/combat/replay/")]',
            function (node) {
              WL.Data.Get(
                WL.Globals.Options.Domain.Value + node.getAttribute("href"),
                function (responseDetails) {
                  var battle, player, players, levels, teams, stats;
                  start =
                    responseDetails.responseText.indexOf("Vs.start({ data : ") +
                    18;
                  end = responseDetails.responseText.indexOf(" });", start);
                  data = JSON.parse(
                    responseDetails.responseText.substring(start, end)
                  );
                  players = [];
                  levels = [0, 0];
                  teams = data.teams;
                  for (player in teams) {
                    levels[teams[player].side] =
                      levels[teams[player].side] + teams[player].level * 1;
                    players[player] = {};
                    players[player].level = teams[player].level;
                  }
                  stats = data.turns.pop().players;
                  for (player in stats) {
                    players[player].hp = stats[player].hp;
                    players[player].maxhp = stats[player].maxhp;
                    players[player].spirit = stats[player].card;
                  }
                  WL.Node.ForEach(
                    './/div[@class="gavatar"]',
                    function (player, i) {
                      if (players[i].hp == 0)
                        player.parentNode.setAttribute(
                          "style",
                          "opacity: 0.5;"
                        );
                      player.appendChild(
                        WL.Node.Create(
                          "div",
                          [["class", "gname"]],
                          "Level: " + players[i].level
                        )
                      );
                      player.appendChild(
                        WL.Node.Create(
                          "div",
                          [["class", "gname"]],
                          "" + players[i].hp + "/" + players[i].maxhp
                        )
                      );
                      player.appendChild(
                        WL.Node.Create(
                          "div",
                          [["class", "gname"]],
                          "Spirit: " + players[i].spirit
                        )
                      );
                    },
                    node.parentNode.parentNode
                  );
                  WL.Node.ForEach(
                    './/div[contains(@class, "result")]',
                    function (result, i) {
                      result.insertBefore(
                        WL.Node.Create("br"),
                        result.firstChild
                      );
                      result.insertBefore(
                        WL.Node.Create("span", [], levels[i]),
                        result.firstChild
                      );
                      result.insertBefore(
                        WL.Node.Create("br"),
                        result.firstChild
                      );
                      result.insertBefore(
                        WL.Node.Create("span", [["class", "lhp"]], "level"),
                        result.firstChild
                      );
                    },
                    node.parentNode.parentNode
                  );
                }
              );
            }
          );
        }),
        showresults.parentNode.nextSibling
      );
    }
    if (
      window.location.href ==
      WL.Globals.Options.Domain.Value + "/guild/squad/manage"
    ) {
      WL.CSS.Add(
        ".section_text > .button { margin-right: 145px; float: right; } "
      );
      with (WL.Node.Select('//div[@class="section_text"]')) {
        innerHTML += " Guild to siege (id): ";
        appendChild(
          WL.Node.Create("input", [
            ["id", "wl_guildid"],
            ["class", "input bd1 c2"],
            ["size", "2"],
          ])
        );
        appendChild(
          WL.Button.Create("Select", 1, function () {
            WL.Script.Run(
              "SquadWar.selected = " +
                WL.Node.Select('//input[@id="wl_guildid"]').value
            );
          })
        );
      }
    }
    if (
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 16
      ) ==
      WL.Globals.Options.Domain.Value + "/guild/user/list"
    ) {
      with (WL.Node.Select('//div[@class="playerlist section_list format"]'))
        appendChild(
          WL.Button.Create("Show character stats", 1, function () {
            WL.Node.Hide(this);
            var label = WL.Node.Create("div", [
              ["class", "player header_label"],
            ]);
            with (label) {
              appendChild(
                WL.Node.Create("div", [["class", "level header"]], "Lv")
              );
              appendChild(WL.Node.Create("div", [["class", "avatar"]]));
              appendChild(
                WL.Node.Create("div", [["class", "name header"]], "Name")
              );
              appendChild(
                WL.Node.Create("div", [["class", "hp header"]], "HP")
              );
              appendChild(
                WL.Node.Create("div", [["class", "hp header"]], "Spirit")
              );
              appendChild(
                WL.Node.Create("div", [["class", "hp header"]], "Charms")
              );
              appendChild(
                WL.Node.Create("div", [["class", "hp header"]], "Rating")
              );
              appendChild(
                WL.Node.Create("div", [["class", "match header"]], "Weekly PvP")
              );
              appendChild(
                WL.Node.Create(
                  "div",
                  [["class", "match header"]],
                  "Lifetime PvP"
                )
              );
            }
            WL.Node.Replace(
              WL.Node.Select('//div[@class="player header_label"]'),
              label
            );
            WL.Node.ForEach('//div[@class="player entry"]', function (node) {
              var cid = node.getAttribute("id").substring(6);
              //get friends info
              WL.Data.Get(
                WL.Globals.Options.Domain.Value + "/json/character/" + cid,
                function (responseDetails) {
                  var data;
                  data = JSON.parse(responseDetails.responseText);
                  node = WL.Node.Select(
                    '//div[@id="Member' +
                      data["id"] +
                      '"]/div[@class="name dyn"]'
                  );
                  while ((n1 = node.nextSibling.nextSibling)) {
                    WL.Node.Remove(n1);
                  }
                  with (node.parentNode) {
                    appendChild(
                      WL.Node.Create(
                        "div",
                        [
                          [
                            "class",
                            "hp " + WL.String.Cut(data["guild"]["rank"], " "),
                          ],
                        ],
                        data["hp"]
                      )
                    );
                    appendChild(
                      WL.Node.Create(
                        "div",
                        [
                          [
                            "class",
                            "hp " + WL.String.Cut(data["guild"]["rank"], " "),
                          ],
                        ],
                        data["spi"]
                      )
                    );
                    appendChild(
                      WL.Node.Create(
                        "div",
                        [
                          [
                            "class",
                            "hp " + WL.String.Cut(data["guild"]["rank"], " "),
                          ],
                        ],
                        data["card"]
                      )
                    );
                    appendChild(
                      WL.Node.Create(
                        "div",
                        [
                          [
                            "class",
                            "hp " + WL.String.Cut(data["guild"]["rank"], " "),
                          ],
                        ],
                        data["rating"]
                      )
                    );
                    appendChild(
                      WL.Node.Create(
                        "div",
                        [
                          [
                            "class",
                            "match " +
                              WL.String.Cut(data["guild"]["rank"], " "),
                          ],
                        ],
                        data["weekly"]["win"] * 1 +
                          data["weekly"]["loss"] * 1 +
                          " matches<br>" +
                          data["weekly"]["percent"].toFixed(1) +
                          "% win"
                      )
                    );
                    appendChild(
                      WL.Node.Create(
                        "div",
                        [
                          [
                            "class",
                            "match " +
                              WL.String.Cut(data["guild"]["rank"], " "),
                          ],
                        ],
                        data["lifetime"]["win"] * 1 +
                          data["lifetime"]["loss"] * 1 +
                          " matches<br>" +
                          data["lifetime"]["percent"].toFixed(1) +
                          "% win"
                      )
                    );
                  }
                }
              );
            });
          })
        );
      var n = WL.Node.Select('//div[@id="Member32917"]/div/span');
      if (n) n.innerHTML = WL.Sheira.Class;
    }
    if (
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 10
      ) ==
      WL.Globals.Options.Domain.Value + "/user/list"
    ) {
      var n = WL.Node.Select('//a[@href="/character/32917"]/../../div/span');
      if (n) n.innerHTML = WL.Sheira.Class;
    }
  }

  ////////////////////////////////////////////////////////////////
  //coliresults
  ////////////////////////////////////////////////////////////////

  //info
  var coliresults_name = "ColiResults";
  var coliresults_version = "0.4.0";
  WL.Addon.Register(
    coliresults_name,
    "This addon allows you to look at coliseum battlegroups without getting the results spoiled",
    coliresults_version,
    "WL"
  );

  //addon
  if (WL.Data.Load(coliresults_name + "_enabled")) {
    if (
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 28
      ) ==
        WL.Globals.Options.Domain.Value + "/pvp/coliseum/tournament/id/" ||
      window.location.href.substring(
        0,
        WL.Globals.Options.Domain.Value.length + 20
      ) ==
        WL.Globals.Options.Domain.Value + "/city/fight/ring/id/"
    ) {
      var buttons;
      WL.CSS.Add(
        "#PetRingResult { display: none; } .tournament .bd1 { border-color: #333333 !important; } .content .c2 { color: #999999 !important; } .tournament .win { background-color: #333333 !important; } .content { visibility: hidden; } .round_2 .content { visibility: visible !important; }"
      );
      buttons = WL.Node.Select('//div[@class="section_text"]').appendChild(
        WL.Node.Create("div", [["style", "width: 100%;"]])
      );
      buttons.appendChild(
        WL.Button.Create("Show round 1 results", 1, function () {
          WL.CSS.Add(
            "#PetRingResult { display: none; } .round_1 .content { visibility: visible !important; }"
          );
          WL.Node.Hide(this);
        })
      );
      buttons.appendChild(
        WL.Button.Create("Show round 2 results", 1, function () {
          WL.CSS.Add(
            "#PetRingResult { display: none; } .round_0 .content { visibility: visible !important; }"
          );
          WL.Node.Hide(this);
        })
      );
      buttons.appendChild(
        WL.Button.Create("Show everything", 1, function () {
          WL.Node.ForEach("//style", function (node) {
            if (node.innerHTML.indexOf("#PetRingResult") == 0)
              WL.Node.Remove(node);
          });
          WL.Node.Hide(this.parentNode.parentNode);
        })
      );
    }
  }

  ////////////////////////////////////////////////////////////////
  //externalreplay
  ////////////////////////////////////////////////////////////////
}
//info
var externalreplay_name = "ExternalReplay";
var externalreplay_version = "0.4.9";
WL.Addon.Register(
  externalreplay_name,
  "This addon allows you to share skirmishes/guild fights with others (<a href='" +
    allinone_server +
    "../replay/submit" +
    "'>Manual upload link</a>)",
  externalreplay_version,
  "WL"
);

//functions
WL.Estiah.ExternalReplay = function (Node) {
  with (Node)
    with (appendChild(WL.Node.Create("div", [["id", "wl_externalreplay"]]))) {
      appendChild(
        WL.Node.Hide(WL.Node.Create("div", [["id", "wl_replay_data"]]))
      );
      appendChild(
        WL.Node.Create("a", [], "Prepare Replay for Export", function () {
          WL.Script.New("Vs.exportreplay", function () {
            if (Vs.replay !== undefined) var replay = Vs.replay;
            else {
              var replay = Object.toJSON(Vs.data);
            }
            $("wl_replay_data").update(encodeURIComponent(replay));
            $("wl_replay_export").update(
              "Export Replay (" +
                Math.ceil($("wl_replay_data").innerHTML.length / 1024) +
                " KiB)"
            );
          });
          WL.Script.Run("Vs.exportreplay()");
          WL.Node.Show(this.nextSibling.nextSibling);
        })
      );
      appendChild(WL.Node.Create("br"));
      appendChild(
        WL.Node.Hide(
          WL.Node.Create(
            "a",
            [["id", "wl_replay_export"]],
            "Export Replay",
            function () {
              WL.Node.Hide(this);
              WL.Node.Show(this.nextSibling);
              WL.Data.Post(
                "http://wl.attrib.org/estiah/replay/aiosubmit",
                "json=" +
                  WL.Node.Select('//div[@id="wl_replay_data"]').innerHTML,
                function (responseDetails) {
                  with (WL.Node.Select('//div[@id="wl_externalreplay"]')) {
                    WL.Node.Hide(
                      firstChild.nextSibling.nextSibling.nextSibling.nextSibling
                    );
                    appendChild(WL.Node.Create("br"));
                    appendChild(
                      WL.Node.Create(
                        "a",
                        [["href", responseDetails.responseText]],
                        responseDetails.responseText
                      )
                    );
                  }
                }
              );
            }
          )
        )
      );
      appendChild(
        WL.Node.Hide(
          WL.Node.Create(
            "div",
            [],
            WL.Globals.Options.Loading.Value + " exporting replay..."
          )
        )
      );
    }
};

//addon
if (WL.Data.Load(externalreplay_name + "_enabled")) {
  //replay
  if (
    window.location.href.substring(
      0,
      WL.Globals.Options.Domain.Value.length + 25
    ) ==
    WL.Globals.Options.Domain.Value + "/character/combat/replay/"
  )
    WL.Estiah.ExternalReplay(
      WL.Node.Select('//div[contains(@class, "wireframe_character")]')
    );
  //pvp
  if (window.location.href == WL.Globals.Options.Domain.Value + "/pvp")
    WL.Estiah.ExternalReplay(
      WL.Node.Select('//div[contains(@class, "wireframe_pvp")]')
    );
  //arena
  if (
    window.location.href.substring(
      0,
      WL.Globals.Options.Domain.Value.length + 7
    ) ==
    WL.Globals.Options.Domain.Value + "/arena/"
  )
    WL.Estiah.ExternalReplay(
      WL.Node.Select('//div[contains(@class, "wireframe_arena")]')
    );
  //dungeon/site?
}

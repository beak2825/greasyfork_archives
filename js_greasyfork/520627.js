//-----------------------------------------------------------------------------
// [WoD] Extra Statistics
// Copyright (c) Fenghou, Tomy, DotIN13, ShakeSS
// This script can generate additional statistical data in the dungeon and duel report pages.
// When you entered the details or statistics page of reports, a new button will appear beside
//   the details button. At the details page, the new button is "Extra Stat", which will show
//   the statistics of the current level when you click it. At the statistics page, the new
//   button is "Entire Extra Stat", which will show the statistics of entire dungeon.
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// If you want to add a new Stat table, you should create a new sub class of CInfoList,
//   and use CStat::RegInfoList() to register your new info list.
// A detailed example is CILItemDamage.
//-----------------------------------------------------------------------------
// 此版本的依赖项替换为gitee以保证国内访问
// ==UserScript==
// @name         WoD 战报额外统计信息与导出
// @namespace    fenghou
// @description  Generate additional statistical data in the dungeon and duel report pages
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @include      http*://*.world-of-dungeons.*/wod/spiel/*dungeon/report.php*
// @include      http*://*.world-of-dungeons.*/wod/spiel/tournament/*duell.php*
// @include      http*://*.wannaexpresso.*/wod/spiel/*dungeon/report.php*
// @include      http*://*.wannaexpresso.*/wod/spiel/tournament/*duell.php*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/blob.js@1.0.1/Blob.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip-sync@3.2.1-sync/dist/jszip.js
// @require      https://cdn.jsdelivr.net/npm/jquery-form@4.3.0/dist/jquery.form.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.5/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/customParseFormat.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @modifier     Christophero
// @version      2023.03.14.1

// @downloadURL https://update.greasyfork.org/scripts/520627/WoD%20%E6%88%98%E6%8A%A5%E9%A2%9D%E5%A4%96%E7%BB%9F%E8%AE%A1%E4%BF%A1%E6%81%AF%E4%B8%8E%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520627/WoD%20%E6%88%98%E6%8A%A5%E9%A2%9D%E5%A4%96%E7%BB%9F%E8%AE%A1%E4%BF%A1%E6%81%AF%E4%B8%8E%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==
(function () {
    // COMMON FUNCTIONS ///////////////////////////////////////////////////////////
    // Choose contents of the corresponding language
    // Contents: {Name1 : [lang1, lang2, ...], Name2 : [lang1, lang2, ...], ...}
    // return: Local contents, or null
    // It will edit the input contents directly, so the returned object is not necessary
    function GetLocalContents(Contents) {
        function GetLanguageId() {
            var langText = null;
            var allMetas = document.getElementsByTagName("meta");
            for (var i = 0; i < allMetas.length; ++i) {
                if (allMetas[i].httpEquiv == "Content-Language") {
                    langText = allMetas[i].content;
                    break;
                }
            }
            if (langText === null)
                return false;

            switch (langText) {
                case "en":
                    return 0;
                case "cn":
                    return 1;
                default:
                    return null;
            }
        }

        var nLangId = GetLanguageId();
        if (nLangId === null)
            return null;

        if (Contents instanceof Object) {
            for (var name in Contents)
                Contents[name] = Contents[name][nLangId];
            return Contents;
        } else
            return null;
    }


    function CompareString(a, b) {
        a = a || "";
        b = b || "";
        return a.toLowerCase().localeCompare(b.toLowerCase(), "zh-CN-u-co-pinyin");
    }


    function CreateElementHTML(Name, Content /* , [AttrName1, AttrValue1], [AttrName2, AttrValue2], ... */) {
        var HTML = '<' + Name;

        for (var i = 2; i < arguments.length; ++i)
            HTML += ' ' + arguments[i][0] + '="' + arguments[i][1] + '"';

        HTML += (Content != null && Content !== "") ? ('>' + Content + '</' + Name + '>') : (' />');

        return HTML;
    }


    function DbgMsg(Text) {
        if (DEBUG) alert(Text);
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (needle) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === needle) {
                    return i;
                }
            }
            return -1;
        };
    }

    initJQUIStyle();

    /**
     * 初始化JqueryUI的样式表
     */
    function initJQUIStyle() {
      let $toolbarCss = $("<link>");
      $("head").prepend($toolbarCss);
      $toolbarCss.attr({
        rel: "stylesheet",
        type: "text/css",
        href: "https://code.jquery.com/ui/1.13.2/themes/humanity/jquery-ui.css",
      });
        document.querySelector("style").textContent +=
          ".ui-progressbar .ui-progressbar-value {transition: width 0.7s ease 0s;} " +
          "#progressbar .progress-label {position: absolute; left: 48%; font-weight: bold; text-shadow: 1px 1px 0 #fff; height: 31px; display: flex; justify-content: enter; align-items: center;}" +
          "@media (min-width:1px) { .ui-dialog { width: 95% !important; } } " +
          "@media (min-width: 768px) { .ui-dialog { max-width:900px !important; width:95% !important; } }";
    }

    // COMMON STAT FUNCTIONS ///////////////////////////////////////////////////////////

    function getSum(numArr) {
      var nTotal = 0;
      for (var i = 0; i < numArr.length; i++) {
        nTotal = nTotal + Number(numArr[i]);
      }
      return nTotal;
    }

    function getAverage(numArr) {
      return getSum(numArr) / numArr.length;
    }
    // see http://www.johndcook.com/blog/2008/09/26/comparing-three-methods-of-computing-standard-deviation/
    // for discussion on choice of algorithm

    function getVariance(numArr) {
      if (numArr.length <= 1) {
        return 0;
      }
      var nAvg = getAverage(numArr);
      var nTempSum = 0;
      for (var i = 0; i < numArr.length; i++) {
        nTempSum = nTempSum + Math.pow(Number(numArr[i]) - nAvg, 2);
      }
      return nTempSum / (numArr.length - 1);
    }

    // sample standard deviation
    function getSTD(numArr) {
      return Number(Math.sqrt(getVariance(numArr)).toFixed(2));
    }

    function getMax(numArr) {
      return Math.max.apply(null, numArr);
    }

    function getMin(numArr) {
      return Math.min.apply(null, numArr);
    }

    // EXTERN FUNCTIONS ///////////////////////////////////////////////////////////

    /**
     * A utility function for defining JavaScript classes.
     *
     * This function expects a single object as its only argument.  It defines
     * a new JavaScript class based on the data in that object and returns the
     * constructor function of the new class.  This function handles the repetitive
     * tasks of defining classes: setting up the prototype object for correct
     * inheritance, copying methods from other types, and so on.
     *
     * The object passed as an argument should have some or all of the
     * following properties:
     *
     *      name: The name of the class being defined.
     *            If specified, this value will be stored in the classname
     *            property of the prototype object.
     *
     *    extend: The constructor of the class to be extended. If omitted,
     *            the Object( ) constructor will be used. This value will
     *            be stored in the superclass property of the prototype object.
     *
     * construct: The constructor function for the class. If omitted, a new
     *            empty function will be used. This value becomes the return
     *            value of the function, and is also stored in the constructor
     *            property of the prototype object.
     *
     *   methods: An object that specifies the instance methods (and other shared
     *            properties) for the class. The properties of this object are
     *            copied into the prototype object of the class. If omitted,
     *            an empty object is used instead. Properties named
     *            "classname", "superclass", and "constructor" are reserved
     *            and should not be used in this object.
     *
     *   statics: An object that specifies the static methods (and other static
     *            properties) for the class. The properties of this object become
     *            properties of the constructor function. If omitted, an empty
     *            object is used instead.
     *
     *   borrows: A constructor function or array of constructor functions.
     *            The instance methods of each of the specified classes are copied
     *            into the prototype object of this new class so that the
     *            new class borrows the methods of each specified class.
     *            Constructors are processed in the order they are specified,
     *            so the methods of a class listed at the end of the array may
     *            overwrite the methods of those specified earlier. Note that
     *            borrowed methods are stored in the prototype object before
     *            the properties of the methods object above. Therefore,
     *            methods specified in the methods object can overwrite borrowed
     *            methods. If this property is not specified, no methods are
     *            borrowed.
     *
     *  provides: A constructor function or array of constructor functions.
     *            After the prototype object is fully initialized, this function
     *            verifies that the prototype includes methods whose names and
     *            number of arguments match the instance methods defined by each
     *            of these classes. No methods are copied; this is simply an
     *            assertion that this class "provides" the functionality of the
     *            specified classes. If the assertion fails, this method will
     *            throw an exception. If no exception is thrown, any
     *            instance of the new class can also be considered (using "duck
     *            typing") to be an instance of these other types.  If this
     *            property is not specified, no such verification is performed.
     **/
    function DefineClass(data) {
      // Extract the fields we'll use from the argument object.
      // Set up default values.
      var classname = data.name;
      var superclass = data.extend || Object;
      var constructor = data.construct || function () {};
      var methods = data.methods || {};
      var statics = data.statics || {};
      var borrows;
      var provides;

      // Borrows may be a single constructor or an array of them.
      if (!data.borrows) borrows = [];
      else if (data.borrows instanceof Array) borrows = data.borrows;
      else borrows = [data.borrows];

      // Ditto for the provides property.
      if (!data.provides) provides = [];
      else if (data.provides instanceof Array) provides = data.provides;
      else provides = [data.provides];

      // Create the object that will become the prototype for our class.
      var proto = new superclass();

      // Delete any noninherited properties of this new prototype object.
      for (var p in proto) if (proto.hasOwnProperty(p)) delete proto[p];

      // Borrow methods from "mixin" classes by copying to our prototype.
      for (var i = 0; i < borrows.length; i++) {
        var c = data.borrows[i];
        borrows[i] = c;
        // Copy method properties from prototype of c to our prototype
        for (var p in c.prototype) {
          if (typeof c.prototype[p] != "function") continue;
          proto[p] = c.prototype[p];
        }
      }
      // Copy instance methods to the prototype object
      // This may overwrite methods of the mixin classes
      for (var p in methods) proto[p] = methods[p];

      // Set up the reserved "constructor", "superclass", and "classname"
      // properties of the prototype.
      proto.constructor = constructor;
      proto.superclass = superclass;
      // classname is set only if a name was actually specified.
      if (classname) proto.classname = classname;

      // Verify that our prototype provides all of the methods it is supposed to.
      for (var i = 0; i < provides.length; i++) {
        // for each class
        var c = provides[i];
        for (var p in c.prototype) {
          // for each property
          if (typeof c.prototype[p] != "function") continue; // methods only
          if (p == "constructor" || p == "superclass") continue;
          // Check that we have a method with the same name and that
          // it has the same number of declared arguments.  If so, move on
          if (
            p in proto &&
            typeof proto[p] == "function" &&
            proto[p].length == c.prototype[p].length
          )
            continue;
          // Otherwise, throw an exception
          throw new Error(
            "Class " +
              classname +
              " does not provide method " +
              c.classname +
              "." +
              p
          );
        }
      }

      // Associate the prototype object with the constructor function
      constructor.prototype = proto;

      // Copy static properties to the constructor
      for (var p in statics) constructor[p] = statics[p];

      // Finally, return the constructor function
      return constructor;
    }

    /**
     * Throughout, whitespace is defined as one of the characters
     *  "\t" TAB \u0009
     *  "\n" LF  \u000A
     *  "\r" CR  \u000D
     *  " "  SPC \u0020
     *
     * This does not use Javascript's "\s" because that includes non-breaking
     * spaces (and also some other characters).
     */

    /**
     * Determine whether a node's text content is entirely whitespace.
     *
     * @param nod  A node implementing the |CharacterData| interface (i.e.,
     *             a |Text|, |Comment|, or |CDATASection| node
     * @return     True if all of the text content of |nod| is whitespace,
     *             otherwise false.
     */
    function is_all_ws(nod) {
      // Use ECMA-262 Edition 3 String and RegExp features
      return !/[^\t\n\r ]/.test(nod.data);
    }

    /**
     * Determine if a node should be ignored by the iterator functions.
     *
     * @param nod  An object implementing the DOM1 |Node| interface.
     * @return     true if the node is:
     *                1) A |Text| node that is all whitespace
     *                2) A |Comment| node
     *             and otherwise false.
     */

    function is_ignorable(nod) {
      return (
        nod.nodeType == Node.COMMENT_NODE || // A comment node
        (nod.nodeType == Node.TEXT_NODE && is_all_ws(nod))
      ); // a text node, all ws
    }

    /**
     * Version of |previousSibling| that skips nodes that are entirely
     * whitespace or comments.  (Normally |previousSibling| is a property
     * of all DOM nodes that gives the sibling node, the node that is
     * a child of the same parent, that occurs immediately before the
     * reference node.)
     *
     * @param sib  The reference node.
     * @return     Either:
     *               1) The closest previous sibling to |sib| that is not
     *                  ignorable according to |is_ignorable|, or
     *               2) null if no such node exists.
     */
    function node_before(sib) {
      while ((sib = sib.previousSibling)) {
        if (!is_ignorable(sib)) return sib;
      }
      return null;
    }

    /**
     * Version of |nextSibling| that skips nodes that are entirely
     * whitespace or comments.
     *
     * @param sib  The reference node.
     * @return     Either:
     *               1) The closest next sibling to |sib| that is not
     *                  ignorable according to |is_ignorable|, or
     *               2) null if no such node exists.
     */
    function node_after(sib) {
      while ((sib = sib.nextSibling)) {
        if (!is_ignorable(sib)) return sib;
      }
      return null;
    }

    /**
     * Version of |lastChild| that skips nodes that are entirely
     * whitespace or comments.  (Normally |lastChild| is a property
     * of all DOM nodes that gives the last of the nodes contained
     * directly in the reference node.)
     *
     * @param par  The reference node.
     * @return     Either:
     *               1) The last child of |sib| that is not
     *                  ignorable according to |is_ignorable|, or
     *               2) null if no such node exists.
     */
    function last_child(par) {
      var res = par.lastChild;
      while (res) {
        if (!is_ignorable(res)) return res;
        res = res.previousSibling;
      }
      return null;
    }

    /**
     * Version of |firstChild| that skips nodes that are entirely
     * whitespace and comments.
     *
     * @param par  The reference node.
     * @return     Either:
     *               1) The first child of |sib| that is not
     *                  ignorable according to |is_ignorable|, or
     *               2) null if no such node exists.
     */
    function first_child(par) {
      var res = par.firstChild;
      while (res) {
        if (!is_ignorable(res)) return res;
        res = res.nextSibling;
      }
      return null;
    }

    /**
     * Version of |data| that doesn't include whitespace at the beginning
     * and end and normalizes all whitespace to a single space.  (Normally
     * |data| is a property of text nodes that gives the text of the node.)
     *
     * @param txt  The text node whose data should be returned
     * @return     A string giving the contents of the text node with
     *             whitespace collapsed.
     */
    function data_of(txt) {
      var data = txt.data;
      // Use ECMA-262 Edition 3 String and RegExp features
      data = data.replace(/[\t\n\r ]+/g, " ");
      if (data.charAt(0) == " ") data = data.substring(1, data.length);
      if (data.charAt(data.length - 1) == " ")
        data = data.substring(0, data.length - 1);
      return data;
    }

    function split_id(id) {
      const segs = id.split("_");
      let obj = { a: 0, b: 0, c: 0, d: 0 };
      if (segs[1]) obj.a = parseInt(segs[1]);
      if (segs[2]) obj.a = parseInt(segs[1]);
      if (segs[3]) obj.a = parseInt(segs[1]);
      if (segs[4]) obj.a = parseInt(segs[1]);
      return obj;
    }

    function compare_id(id1, id2) {
      let obj1 = split_id(id1);
      let obj2 = split_id(id2);
      return obj1.a - obj2.a
        ? obj1.a - obj2.a
        : obj1.b - obj2.b
        ? obj1.b - obj2.b
        : obj1.c - obj2.c
        ? obj1.c - obj2.c
        : obj1.d - obj2.d;
    }


    // CLASSES ////////////////////////////////////////////////////////////////////

    // NextNode: the node next to the statistics node when it is created
    function CStat(NextNode, InfoDiv) {
        this._HTML = '';
        this._reportInfoDiv = InfoDiv;
        this._gInfoList = [];
        this.iscurrentPage = true;

        this.nTotalPages = 0;
        this.nReadPages = 0;
        this.nReadRows = 0;
        this.nTotalRows = 0;
        this.setNode = function (newNode) {
            if (newNode.id == "stat_all") {
                this._Node = newNode;
                this._Node.innerHTML = '';
            }
            else {
                if (this._Node) {
                    var divs = newNode.parentNode.getElementsByTagName('div');
                    for (var i = 0; i < divs.length; i++) {
                        if (divs[i].id == "stat_all") {
                            newNode.parentNode.removeChild(divs[i]);
                            break;
                        }
                    }
                }

                var NewSection = document.createElement("div");
                NewSection.id = "stat_all";
                NewSection.className = "stat_all tab";
                if (newNode.parentNode)
                    this._Node = newNode.parentNode.insertBefore(NewSection, newNode);
                else {
                    this._Node = NewSection;
                    newNode.appendChild(NewSection);
                }
            }
            this._HTML = '';
        };
        this.setNode(NextNode);
        this._reportInfoDiv.appendChild(document.createElement('table'));
    }

    CStat.prototype._Write = function (Text) {
        this._HTML += Text;
    };

    CStat.prototype._Flush = function () {
        this._Node.innerHTML = this._HTML;
    };

    CStat.prototype.RegInfoList = function (InfoList) {
        if (InfoList instanceof CInfoList) {
            this._gInfoList.push(InfoList);
            return true;
        }
        return false;
    };

    CStat.prototype.SaveInfo = function (Info) {
        for (var i = 0; i < this._gInfoList.length; ++i)
            this._gInfoList[i].SaveInfo(Info);
    };

    CStat.prototype.getTab = function (isExport, showhide) {
        function FactoryTabClick(Id) {
            return function () {
                CStat.OnTabClick(Id);
            };
        }
        var tab = document.createElement('li');
        tab.className = 'not_selected';
        var title = Local.Text_Button_ShowAll;
        var id = 'showall';
        if (showhide === true) {
            title = Local.Text_Button_ShowAll;
            id = 'showall';
        }
        else {
            tab.id = 'tab_hideall';
            title = Local.Text_Button_HideAll;
            id = 'hideall';
        }
        tab.id = 'tab_' + id;
        var a = document.createElement('A');
        a.id = 'show_all_a';
        var name = document.createTextNode(title);
        a.appendChild(name);
        a.href = '#';
        if (isExport)
            a.setAttribute("onclick", "st('" + id + "');");
        else
            a.addEventListener("click", FactoryTabClick(id), false);
        tab.appendChild(a);
        return tab;
    };

    CStat.prototype.Show = function (isExport) {
        this._Node.innerHTML = '';
        var tabs = document.createElement("ul");
        this._Node.appendChild(tabs);
        var bar = document.createElement('div');
        bar.id = 'stat_bar';
        bar.className = 'bar';
        this._Node.appendChild(bar);
        var tabDivs = [];
        var isFirst = true;
        for (var i = 0; i < this._gInfoList.length; ++i) {
            var infoNode = this._gInfoList[i].Show(isExport);
            var tab = this._gInfoList[i].getTab(isExport);
            if (tab && infoNode) {
                tabs.appendChild(tab);
                this._Node.appendChild(infoNode);
                tabDivs.push(infoNode.id);
                if (isFirst) {
                    tab.className = 'selected';
                    infoNode.style.display = '';
                    isFirst = false;
                }
                else {
                    tab.className = 'not_selected';
                    infoNode.style.display = 'none';
                }
            }
        }
        tabs.appendChild(this.getTab(isExport, true));
        tabs.appendChild(this.getTab(isExport, false));
        this._Node.setAttribute('tabs', tabDivs.join(','));
        if (!isExport) {
            this._Node.appendChild(document.createElement('hr'));
            //this._Node.appendChild(this._reportInfoDiv);
            this.ShowProgress();
        }
        if (!this.iscurrentPage) {
            this._reportInfoDiv.style.display = 'none';
            this._Node.appendChild(this._reportInfoDiv);
        }
        //this._reportInfoDiv.parentNode.removeChild(this._reportInfoDiv);
    };

    CStat.prototype.ShowProgress = function () {
        var widthP = 1;
        var currentP = 1;
        if (reportInfoDiv) {
            if (this.nReadPages < 1)
                currentP = 1;
            else
                currentP = this.nReadPages
            if (this.nTotalPages === 0 || this.nTotalRows === 0)
                widthP = 1;
            else
                widthP = parseInt(((currentP - 1) / this.nTotalPages + this.nReadRows / (this.nTotalRows * this.nTotalPages)) * 100);
            reportInfoDiv.style.width = widthP + '%';
        }
    };

    CStat.prototype._AddEvents = function () {
        function OnDelGMValues() {
            try {
                var ValueList = GM_listValues();
                for (var name in ValueList) {
                    GM_deleteValue(ValueList[name]);
                }
                alert(Local.Text_DefaultMsg);
            } catch (e) {
                alert("OnDelGMValues(): " + e);
            }
        }
        document.getElementById("stat_options_default").addEventListener("click", OnDelGMValues, false);
    };
    CStat.OnTabClick = function (id) {
        var statdiv = document.getElementById('stat_all');
        var tabs = statdiv.getAttribute('tabs').split(',');
        var showall = false;
        var lishowall = document.getElementById('tab_showall');
        var lihideall = document.getElementById('tab_hideall');
        lishowall.className = 'not_selected';
        lihideall.className = 'not_selected';
        for (var i = 0; i < tabs.length; i++) {
            var tabid = tabs[i];
            var tab = document.getElementById(tabid);
            var li = document.getElementById('tab_' + tabid);
            li.className = 'not_selected';
            if (id == 'showall') {
                lishowall.className = 'selected';
                tab.style.display = '';
            }
            else if (id == 'hideall') {
                lihideall.className = 'selected';
                tab.style.display = 'none';
            }
            else {
                if (tabid == id) {
                    tab.style.display = '';
                    li.className = 'selected';
                }
                else {
                    tab.style.display = 'none';
                    li.className = 'not_selected';
                }
            }

        }
    };

    ///////////////////////////////////////////////////////////////////////////////
    function CTable(Title, Id, nColumns, isExport) {
        this._Title = Title;
        this._Id = Id;
        this._filterId = "filter_" + Id;
        this._nColumns = nColumns;
        this._HeadCellContents = new Array(nColumns);
        this._HeadCellLegends = new Array(nColumns);
        this._BodyCellContentTypes = new Array(nColumns);
        this._HeadCellContentFilters = [];
        this._BodyCellContents = [];
        this._HTML = '';
        this._isExport = isExport;
        this._bShow = true;
    }

    CTable._ContentAttrs = {
        string: 'left',
        number: 'right',
        button: 'center'
    };

    CTable.prototype.SetHeadCellContentFilters = function ( /* Content1, Content2, ... */) {
        for (var i = 0; i < arguments.length; ++i)
            if (arguments[i] != null)
                this._HeadCellContentFilters.push(arguments[i]);
    };

    CTable.prototype.SetHeadCellContents = function ( /* Content1, Content2, ... */) {
        for (var i = 0; i < this._nColumns; ++i)
            this._HeadCellContents[i] = arguments[i] != null ? arguments[i] : "";
    };

    CTable.prototype.SetHeadCellLegends = function ( /* Content1, Content2, ... */) {
        for (var i = 0; i < this._nColumns; ++i)
            this._HeadCellLegends[i] = arguments[i] != null ? arguments[i] : "";
    };

    // Type: a string that is the property name of CTable::ContentAttrs
    CTable.prototype.SetBodyCellContentTypes = function ( /* Type1, Type2, ... */) {
        for (var i = 0; i < this._nColumns; ++i)
            this._BodyCellContentTypes[i] =
                arguments[i] != null ? CTable._ContentAttrs[arguments[i]] : "";
    };

    CTable.prototype.SetBodyCellContents = function ( /* Content1, Content2, ... */) {
        var Contents = new Array(this._nColumns);
        for (var i = 0; i < this._nColumns; ++i)
            Contents[i] = arguments[i] != null ? arguments[i] : "";
        this._BodyCellContents.push(Contents);
    };

    CTable.prototype.CreateHTML = function () {
        function Factory(Id) {
            return function () {
                CTable.OnClickTitle(Id);
            };
        }
        function FactoryFilter(tableid, rowId) {
            return function () {
                CTable.OnChangeFilter(tableid, rowId);
            };
        }
        function FactorySort(tableid, colId, numberId) {
            return function () {
                CTable.OnChangeOrder(tableid, colId, numberId);
            };
        }
        function FactoryShowDetail(rowId, activeRows) {
            return function () {
                activeRows = activeRows.sort(compare_id)
                CTable.OnShowDetail(rowId, activeRows);
            };
        }
        var tableid = "table_" + this._Id;
        var outputDiv = document.createElement('div');
        outputDiv.id = this._Id;
        outputDiv.className = 'content';
        var headerDiv = document.createElement('div');
        outputDiv.appendChild(headerDiv);
        headerDiv.className = 'stat_header';
        headerDiv.style.textAlign = 'center';
        var spanTitle = document.createElement('span');
        spanTitle.className = "stat_title clickable";
        headerDiv.appendChild(spanTitle);
        spanTitle.innerHTML = this._Title;
        if (this._isExport)
            spanTitle.setAttribute('onclick', "ct('" + tableid + "');");
        else
            spanTitle.addEventListener("click", Factory(tableid), false);
        var table = document.createElement("table");
        table.className = "content_table";
        table.style.margin = '0px auto';
        table.id = tableid;
        if (!this._bShow)
            table.setAttribute('hide', 'hide');
        outputDiv.appendChild(table);

        var trHeader = table.insertRow(0);
        trHeader.className = "content_table_header";
        for (var i = 0; i < this._nColumns; ++i) {
            var th = document.createElement("th");
            th.className = "content_table stat_order";
            th.id = 'th_' + this._Id + i;
            th.setAttribute('order', '-1');
            var thSpan = document.createElement("span");
            thSpan.id = this._Id + "_col" + i;
            thSpan.innerHTML = this._HeadCellContents[i];
            th.appendChild(thSpan);
            var legend = this._HeadCellLegends[i];
            var infospan = document.createElement("span");
            infospan.id = tableid + '_orderInfo_' + i;
            infospan.innerHTML = '<span></span><span></span>';
            thSpan.appendChild(infospan);
            if (legend) {
                infospan.className = legend.className;
                if (i > 0) {
                    thSpan.innerHTML = thSpan.innerHTML + '<br />';
                    thSpan.appendChild(legend);
                    var legends = legend.getElementsByTagName('span');
                    for (var li = 0; li < legends.length; li++) {
                        var l = legends[li];
                        l.className = "clickable";
                        if (this._isExport)
                            l.setAttribute('onclick', "co('" + tableid + "'," + i + "," + li + ");");
                        else
                            l.addEventListener("click", FactorySort(tableid, i, li), false);
                    }
                }
                else {
                    th.appendChild(legend);
                    var checkboxs = legend.getElementsByTagName('input');
                    for (var ti = 0; ti < checkboxs.length; ti++) {
                        var c = checkboxs[ti];
                        c.id = tableid + '_checkbox_' + i + '_' + ti;
                        if (this._isExport) {
                            c.setAttribute('onclick', "cf('" + tableid + "','" + this._filterId + "');");
                            c.setAttribute('checked', '');
                        }
                        else
                            c.addEventListener("click", FactoryFilter(tableid, this._filterId), false);
                    }
                }
            }
            else {
                thSpan.className = "clickable";
                if (this._isExport)
                    thSpan.setAttribute('onclick', "co('" + tableid + "'," + i + ",0);");
                else
                    thSpan.addEventListener("click", FactorySort(tableid, i, 0), false);
            }
            trHeader.appendChild(th);
        }

        if (useFilter) {
            var trfilter = table.insertRow(-1);
            trfilter.id = this._filterId;
            trfilter.className = "content_table_filter_row";
            for (var i = 0; i < this._nColumns - 1; ++i) {
                var cell = trfilter.insertCell(-1);
                if (this._HeadCellContentFilters != null) {
                    if (this._HeadCellContentFilters[i] != null) {
                        var filter = this._HeadCellContentFilters[i];
                        var comboboxid = this._filterId + "_combobox_" + i;
                        var combobox = document.createElement("select");
                        cell.appendChild(combobox);
                        combobox.id = comboboxid;
                        if (this._isExport)
                            combobox.setAttribute('onchange', "cf('" + tableid + "','" + this._filterId + "');");
                        else
                            combobox.addEventListener("change", FactoryFilter(tableid, this._filterId), false);
                        combobox.options.add(new Option(Local.Text_Table_AllData, i + '_' + 'all'));
                        for (var j = 0; j < filter.length; j++)
                            combobox.options.add(new Option(filter[j], i + '_' + j));
                        var comboboxOrg = combobox.cloneNode(true);
                        comboboxOrg.id = 'org_' + comboboxid;
                        comboboxOrg.style.display = 'none';
                        cell.appendChild(comboboxOrg);
                    }
                    else {
                        var input = document.createElement("input");
                        var textid = this._filterId + "_textbox_" + i;
                        input.type = "text";
                        input.size = 6;
                        input.id = textid;
                        cell.appendChild(input);
                    }
                }
            }
            var searchButton = document.createElement("input");
            searchButton.type = 'button';
            searchButton.id = this._filterId + "_button";
            searchButton.value = "查询";
            searchButton.className = "button";
            if (this._isExport)
                searchButton.setAttribute('onclick', "cf('" + tableid + "','" + this._filterId + "');");
            else
                searchButton.addEventListener("click", FactoryFilter(tableid, this._filterId), false);
            var buttonCell = trfilter.insertCell(-1);
            buttonCell.appendChild(searchButton);
            buttonCell.style.textAlign = 'center';
        }
        for (var i = 0; i < this._BodyCellContents.length; ++i) {
            var row = table.insertRow(-1);
            row.className = "row" + i % 2;
            row.setAttribute('oriorder', i);
            var rowId = [];
            var infoRowid = tableid + '_' + i;
            var infoNode;
            for (var j = 0; j < this._nColumns; ++j) {
                var rowspan = "";
                var content = this._BodyCellContents[i][j];
                if (content.show) {
                    var cell = row.insertCell(-1);
                    cell.className = "content_table";
                    cell.style.textAlign = this._BodyCellContentTypes[j];
                    if (content.rowspan > 1) {
                        cell.rowSpan = content.rowspan;
                        cell.style.verticalAlign = 'middle';
                    }
                    var valueNode = content.value;
                    cell.appendChild(valueNode);
                    if (j == this._nColumns - 1) {
                        if (this._isExport)
                            valueNode.setAttribute("onclick", "sd('" + infoRowid + "',['" + content.activeRows.join("','") + "']);");
                        else
                            valueNode.addEventListener("click", FactoryShowDetail(infoRowid, this._BodyCellContents[i][0].activeRows), false);
                        infoNode = valueNode.getAttribute('data');
                        valueNode.removeAttribute('data');
                    }
                }
                rowId.push(j + "_" + this._BodyCellContents[i][j].filterId);
            }
            row.id = rowId.join(",");
            var infoRow = table.insertRow(-1);
            infoRow.className = row.className;
            infoRow.id = infoRowid;
            infoRow.style.display = 'none';
            var infoCell = infoRow.insertCell(-1);
            infoCell.colSpan = this._nColumns;
            if (infoNode) {
                infoCell.innerHTML = infoNode;
            }
        }
        return outputDiv;
        //this._HTML = outputDiv.outerHTML;
        //return     this._HTML;
    };

    CTable.prototype.GetHTML = function () {
        return this._HTML;
    };


    CTable.OnClickTitle = function (Id) {
        try {
            var Table = document.getElementById(Id);
            if (Table.hasAttribute("hide")) {
                Table.removeAttribute("hide");
            } else {
                Table.setAttribute("hide", "hide");
            }
        } catch (e) {
            alert("CTable.OnClickTitle(): " + e);
        }
    };

    CTable.GetNumber = function (cell) {
        var numberPatten = /^\s?([\d]+\.?[\d]*)\s?_?\s?([\d]*\.?[\d]*)\s?$/;
        var pairTable = cell.firstChild;
        var numberString = cell.textContent;
        var numbers;
        if (pairTable && pairTable.nodeName == "TABLE") {
            numberString = pairTable.id;
        }
        if (numberPatten.test(numberString)) {
            numbers = [];
            var numberres = numberPatten.exec(numberString);
            if (numberres[1])
                numbers.push(numberres[1]);
            if (numberres[2])
                numbers.push(numberres[2]);
        }
        return numbers;
    };
    CTable.OnChangeFilter = function (tableId, filterRowId) {
        try {
            var Table = document.getElementById(tableId);
            var filterRow = document.getElementById(filterRowId);
            var stringfilters = [];
            var orgstringfilters = [];
            var numberfilters = [];
            var filterString = "";
            var showIds = [];
            var refilter = 0;

            var showHero_0 = document.getElementById(tableId + "_checkbox_0_0");
            var showHero_1 = document.getElementById(tableId + "_checkbox_0_1");
            var showHero = [showHero_0.checked, showHero_1.checked];

            for (var i = 0; i < filterRow.cells.length; i++) {
                var cell = filterRow.cells[i];
                var stringfilter = document.getElementById(filterRow.id + "_combobox_" + i);
                var orgstringfilter = document.getElementById('org_' + filterRow.id + "_combobox_" + i);
                var numberfilter = document.getElementById(filterRow.id + "_textbox_" + i);
                if (stringfilter) {
                    stringfilters.push(stringfilter.value);
                    refilter += stringfilter.selectedIndex > 0 ? 1 : 0;
                }
                else
                    stringfilters.push(null);
                if (orgstringfilter) {
                    for (var ii = 0, ij = orgstringfilter.options.length; ii < ij; ++ii) {
                        if (orgstringfilter.options[ii].value === stringfilter.value) {
                            orgstringfilter.selectedIndex = ii;
                            break;
                        }
                    }
                    orgstringfilters.push([stringfilter, orgstringfilter]);
                    showIds.push([]);
                }
                if (numberfilter)
                    numberfilters.push(numberfilter.value);
                else
                    numberfilters.push(null);
            }
            var index = 0;
            var patten = /([\(|\[|>|<|=|]*)\s*([\d]*\.?[\d]*)\s*-?\s*([\d]*\.?[\d]*)\s*([\)|\]|\s]?)/;
            for (var i = 2; i < Table.rows.length; i = i + 2) {
                var row = Table.rows[i];
                var rowInfo = Table.rows[i + 1];
                var rowIds = row.id.split(",");
                var show = true;

                var hero = row.cells[0].getElementsByTagName('a')[0];
                var heroKind = hero.getAttribute("kind");
                show = showHero[heroKind];
                if (show) {
                    for (var fi = 0; fi < stringfilters.length; fi++) {
                        var sfilter = stringfilters[fi];
                        if (!sfilter)
                            continue;
                        if (sfilter != fi + "_all" && sfilter != rowIds[fi]) {
                            show = false;
                            break;
                        }
                    }
                }
                if (show) {
                    for (var fi = 0; fi < numberfilters.length; fi++) {
                        var nfilter = numberfilters[fi];

                        if (!nfilter)
                            continue;
                        else {
                            var numbers = CTable.GetNumber(row.cells[fi]);
                            var nfilters = nfilter.split(/\s*[,|，]\s*/);
                            for (ni = 0; ni < numbers.length; ni++) {
                                var theFilter = nfilters[ni];
                                var testString = "";
                                if (theFilter && patten.test(theFilter)) {
                                    var op = "==";
                                    var res = patten.exec(theFilter);
                                    if (res[1]) {
                                        op = res[1];
                                        if (res[3]) {
                                            if (op == "[") op = ">=";
                                            if (op == "(") op = ">";
                                            if (op == "=") op = "==";
                                        }
                                    }
                                    else {
                                        if (res[3])
                                            op = ">=";
                                    }
                                    testString = numbers[ni] + op + res[2];
                                    if (res[3]) {
                                        op = "<=";
                                        if (res[4]) {
                                            op = res[4];
                                            if (op == "]") op = "<=";
                                            if (op == ")") op = "<";
                                        }
                                        testString += " && " + numbers[ni] + op + res[3];
                                    }
                                    show = eval(testString);
                                    if (!show)
                                        break;
                                }
                            }
                        }
                        if (!show)
                            break;
                    }
                }
                row.style.display = show ? '' : 'none';
                rowInfo.style.display = show ? rowInfo.style.display : 'none';
                if (show) {
                    row.className = "row" + index % 2;
                    rowInfo.className = row.className;
                    index++;
                    for (var fi = 0; fi < orgstringfilters.length; fi++) {
                        var id = rowIds[fi];
                        if (showIds[fi].indexOf(id) <= -1)
                            showIds[fi].push(id);
                    }
                }
            }

            if (orgstringfilters.length - refilter > 1) {
                for (var fi = 0; fi < orgstringfilters.length; fi++) {
                    var sfilter = orgstringfilters[fi][0];
                    var sfilterorg = orgstringfilters[fi][1];
                    if (!sfilter)
                        continue;
                    if (refilter == 1 && sfilter.selectedIndex > 0)
                        continue;
                    for (var i = sfilter.options.length - 1; i > 0; i--)
                        sfilter.remove(i);
                    for (var i = 0; i < sfilterorg.options.length; i++) {
                        var opt = sfilterorg.options[i];
                        if (showIds[fi].indexOf(opt.value) > -1) {
                            var newopt = new Option(opt.text, opt.value);
                            newopt.selected = opt.selected;
                            sfilter.add(newopt);
                        }
                    }
                }
            }
        } catch (e) {
            alert("CTable.OnChangeFilter(): " + e);
        }
    };

    CTable.OnChangeOrder = function (tableId, columnIndex, numberIndex) {
        var Table = document.getElementById(tableId);
        var index = numberIndex;
        var ths = Table.getElementsByTagName("th");
        if (index === null)
            index = 0;
        var th = ths[columnIndex];
        var order = th.getAttribute("order");
        for (var i = 0; i < ths.length - 1; i++) {

            var span = document.getElementById(tableId + '_orderInfo_' + i);
            var spans = span.getElementsByTagName('span');
            if (spans && spans.length == 2) {
                spans[0].innerHTML = '';
                spans[1].innerHTML = '';
                if (i == columnIndex)
                    spans[numberIndex].innerHTML = order > 0 ? '&#9650;' : '&#9660;';
            }
        }
        for (var i = 2; i < Table.rows.length - 2; i = i + 2) {
            for (var j = i + 2; j < Table.rows.length; j = j + 2) {
                var row_1 = Table.rows[i];
                var row_1_info = Table.rows[i + 1];
                var row_2 = Table.rows[j];
                var row_2_info = Table.rows[j + 1];
                var cell_1 = row_1.cells[columnIndex];
                var cell_2 = row_2.cells[columnIndex];

                n1 = CTable.GetNumber(cell_1);
                n2 = CTable.GetNumber(cell_2);
                var change = false;

                if (columnIndex == ths.length - 1) {
                    var n11 = Number(row_1.getAttribute("oriorder"));
                    var n12 = Number(row_2.getAttribute("oriorder"));
                    change = n11 > n12;
                }
                else {
                    var c1 = row_1.cells[0].firstChild.className.replace("my", "");
                    var c2 = row_2.cells[0].firstChild.className.replace("my", "");
                    var s1 = cell_1.textContent;
                    var s2 = cell_2.textContent;
                    var cc = CompareString(c1, c2);
                    if (cc < 0)
                        change = false;
                    else if (cc > 0)
                        change = true;
                    else {
                        if (n1 && n2 && n1.length > 0 && n2.length > 0) {
                            var number_1 = n1[index] * order;
                            var number_2 = n2[index] * order;
                            change = number_1 > number_2;
                        }
                        else
                            change = (CompareString(s1, s2) == order);
                    }
                }

                if (change) {
                    row_2.parentNode.insertBefore(row_2, row_1);
                    row_2_info.parentNode.insertBefore(row_2_info, row_1);
                }
            }
            Table.rows[i].className = "row" + (i / 2) % 2;
            Table.rows[i + 1].className = Table.rows[i].className;
        }
        th.setAttribute("order", -1 * order);
    };

    CTable.OnShowDetail = function (rowid, activeRows) {
        var row = document.getElementById(rowid);
        var cell = row.cells[0];
        var button = row.previousSibling.getElementsByTagName('input')[0];
        activeRows = activeRows || [];
        if (cell) {
            if (row.style.display == '') {
                button.value = '显示';
                row.style.display = 'none';
            }
            else {
                button.value = '隐藏';
                row.style.display = '';
            }
            var table = cell.getElementsByTagName('table')[0];
            if (table.rows.length <= 1) {
                if (activeRows.length > 0) {
                    var ids = activeRows[0].split('_');
                    var level = Number(ids[1]);
                    var ac = table.insertRow(-1).insertCell(-1);
                    ac.colSpan = '3';
                    ac.innerHTML = '<hr/><br />层 ' + level + '<br /><hr/>';
                    for (var i = 0; i < activeRows.length; i++) {
                        ids = activeRows[i].split('_');
                        var newlevel = Number(ids[1]);
                        if (newlevel != level) {
                            ac = table.insertRow(-1).insertCell(-1);
                            ac.colSpan = '3';
                            ac.innerHTML = '<hr/><br />层 ' + newlevel + '<br /><hr/>';
                            level = newlevel;
                        }
                        var theRow = document.getElementById(activeRows[i]).cloneNode(true);
                        if (theRow) {
                            table.appendChild(theRow);
                            var c = table.insertRow(-1).insertCell(-1);
                            c.colSpan = '3';
                            c.innerHTML = '<hr/>';
                        }
                    }
                }
            }

        }

    };
    ///////////////////////////////////////////////////////////////////////////////
    function CActiveInfo() {
        this.nIniRoll;
        this.nCurrAction;
        this.nTotalActions;
        this.Char = new CChar();
        this.nCharId;
        this.ActionType = new CActionType();
        this.Skill = new CSkill();
        this.gAttackRoll;
        this.gPosition = new CKeyList();
        this.nSkillMP;
        this.nSkillHP;
        this.gItem = new CKeyList();
    }


    function CPassiveInfo() {
        this.Char = new CChar();
        this.nCharId;
        this.Skill = new CSkill();
        this.nDefenceRoll;
        this.nSkillMP;
        this.gItem = new CKeyList();
        this.HitType = new CHitType();
        this.bStruckDown;
        this.gDamage = [];
        this.DamagedItem = new CItem();
        this.nItemDamage;
        this.nHealedHP;
        this.nHealedMP;
    }


    function CNavi(nLevel, nRoom, nRound, nRow) {
        this.nLevel = nLevel;
        this.nRoom = nRoom;
        this.nRound = nRound;
        this.nRow = nRow;
        this.toString = function () {
            return this.nLevel + '_' + this.nRoom + '_' + this.nRound + '_' + this.nRow;
        };
    }


    function CActionInfo(Navi) {
        this.Navi = Navi;
        this.Active = new CActiveInfo();
        this.gPassive = [];
        this.ActiveRow = 'activeRow_' + this.Navi.toString();
    }

    function CActiveValue(ActiveRow, Value) {
        this.Value = Value;
        this.ActiveRow = ActiveRow;
    }
    ///////////////////////////////////////////////////////////////////////////////
    // Class: Key
    // Every key should have two function properties: compareTo() and toString(),
    //   and can work without initialization parameters

    var CKey = DefineClass({
        methods: {
            compareTo: function (that) {
                return this - that;
            },
            toString: function () {
                var theNode = this.toHTMLNode();
                return (theNode.nodeType == Node.COMMENT_NODE || theNode.nodeType == Node.TEXT_NODE) ? theNode.data : theNode.outerHTML;
            },
            toText: function () {
                return this.toHTMLNode().textContent;
            },
            toHTMLNode: function () {
                return document.createTextNode("");
            }
        }
    });
    CKey.UNKNOWN = -1;

    var CKeyList = DefineClass({
        extend: CKey,
        construct: function () {
            this._gKey = [];
        },
        methods: {
            push: function (Key) {
                return this._gKey.push(Key);
            },
            compareTo: function (that) {
                var result = this._gKey.length - that._gKey.length;
                if (result != 0)
                    return result;

                var i = 0;
                while (i < this._gKey.length && this._gKey[i].compareTo(that._gKey[i]) === 0)
                    ++i;
                if (i === this._gKey.length)
                    return 0;
                else
                    return this._gKey[i].compareTo(that._gKey[i]);
            },
            toHTMLNode: function () {
                var ret = document.createElement('span');
                ret.innerHTML = this._gKey.join(", ");
                return ret;
            }
        }
    });

    var CTypeKey = DefineClass({
        extend: CKey,
        construct: function (TypeText) {
            this._sType;
            this._nKind = CKey.UNKNOWN;
            this._text;
            if (TypeText != null) {
                this._sType = TypeText;
                this._text = TypeText;
                this.Init();
            }
        },
        methods: {
            Init: function () { },
            GetType: function () {
                return this._sType;
            },
            GetKind: function () {
                return this._nKind;
            },
            compareTo: function (that) {
                return CompareString(this._sType, that._sType);
            },
            toText: function () {
                return this._text;
            },
            setText: function (text) {
                this._text = text;
            },
            setKind: function (kind) {
                this._nKind = kind;
            },
            toHTMLNode: function () {
                return document.createTextNode(this._text);
            }
        }
    });

    // Attack position
    var CPositionType = DefineClass({
        extend: CTypeKey,
        construct: function (PositionText) {
            CTypeKey.call(this, PositionText);
        }
    });

    // Action type
    var CActionType = DefineClass({
        extend: CTypeKey,
        construct: function (ActionText) {
            CTypeKey.call(this, ActionText);
        },
        methods: {
            Init: function () {
                this._text = 'unknown';
                if (Local.OrigTextList_AttackActionType.indexOf(this._sType) > -1) {
                    this._nKind = CActionType.ATTACK;
                    this.setText(Local.TextList_AttackType[Local.OrigTextList_AttackActionType.indexOf(this._sType)]);
                }
                else if (Local.OrigTextList_HealActionType.indexOf(this._sType) > -1) {
                    this._nKind = CActionType.HEAL;
                    this.setText(Local.TextList_HealType);
                }
                else if (Local.OrigTextList_BuffActionType.indexOf(this._sType) > -1) {
                    this._nKind = CActionType.BUFF;
                    this.setText(Local.TextList_BuffType);
                }
                else if (Local.OrigTextList_WaitActionType.indexOf(this._sType) > -1) {
                    this._nKind = CActionType.WAIT;
                    this.setText(Local.TextList_WaitType);
                }
                else if (this._sType.indexOf("(") > -1) {
                    this._nKind = CActionType.ATTACK2;
                    this.setText("其他");
                }
            }
        }
    });
    CActionType.ATTACK = 0;
    CActionType.HEAL = 1;
    CActionType.BUFF = 2;
    CActionType.WAIT = 3;
    CActionType.ATTACK2 = 4;
    // hit type
    var CHitType = DefineClass({
        extend: CTypeKey,
        construct: function (HitClassText) {
            CTypeKey.call(this, HitClassText);
        },
        methods: {
            Init: function () {
                switch (this._sType) {
                    case "rep_miss":
                        this._nKind = CHitType.MISS;
                        break;
                    case "rep_hit":
                        this._nKind = CHitType.HIT;
                        break;
                    case "rep_hit_good":
                        this._nKind = CHitType.GOOD;
                        break;
                    case "rep_hit_crit":
                        this._nKind = CHitType.CRIT;
                        break;
                    default:
                        this._nKind = CKey.UNKNOWN;
                }
                if (this._nKind != CKey.UNKNOWN)
                    this.setText(Local.TextList_HitType[this._nKind]);
                else
                    this.setText('');

            },
            compareTo: function (that) {
                return this._nKind - that._nKind;
            }
        }
    });
    CHitType.MISS = 0;
    CHitType.HIT = 1;
    CHitType.GOOD = 2;
    CHitType.CRIT = 3;

    // heal type
    var CHealType = DefineClass({
        extend: CTypeKey,
        construct: function (HealText) {
            CTypeKey.call(this, HealText);
        },
        methods: {
            Init: function () {
                switch (this._sType) {
                    case "HP":
                        this._nKind = CHealType.HP;
                        break;
                    case "MP":
                        this._nKind = CHealType.MP;
                        break;
                    default:
                        this._nKind = CKey.UNKNOWN;
                }
            }
        }
    });
    CHealType.HP = 0;
    CHealType.MP = 1;

    // buff type
    var CBuffType = DefineClass({
        extend: CTypeKey,
        construct: function (BuffText) {
            CTypeKey.call(this, BuffText);
        }
    });

    // Damage Type
    var CDamageType = DefineClass({
        extend: CTypeKey,
        construct: function (DamageTypeText) {
            CTypeKey.call(this, DamageTypeText);
        },
        methods: {
            Init: function () {
                this.setText(this._sType.replace('伤害', ''));
            }
        }
    });

    var CElementKey = DefineClass({
        extend: CKey,
        construct: function (HTMLElement) {
            this._Name = '';
            this._Href;
            this._OnClick;
            this._Class;
            this._nKind = CKey.UNKNOWN;

            if (HTMLElement != null) {
                this._Name = HTMLElement.firstChild.data;
                this._Href = HTMLElement.href;
                this._OnClick = HTMLElement.getAttribute("onclick");
                this._Class = HTMLElement.className;
                this.Init();
            }
        },
        methods: {
            Init: function () { },
            GetKind: function () {
                return this._nKind;
            },
            compareTo: function (that) {
                var result = this._nKind - that._nKind;
                if (result !== 0)
                    return result;
                return CompareString(this._Name, that._Name);
            },
            toHTMLNode: function () {
                if (this._Name != null) {
                    var ret = document.createElement('A');
                    var name = document.createTextNode(this._Name);
                    ret.appendChild(name);
                    ret.href = this._Href;
                    ret.setAttribute("onclick", this._OnClick);
                    ret.setAttribute('kind', this._nKind);
                    if (this._Class)
                        ret.className = this._Class;
                    return ret;
                }
                else
                    return document.createTextNode('');
            },
            toText: function () {
                return this._Name;
            },
            setText: function (name) {
                this._Name = name;
            }
        }
    });

    var CChar = DefineClass({
        extend: CElementKey,
        construct: function (HTMLElement) {
            CElementKey.call(this, HTMLElement);
        },
        methods: {
            Init: function () {
                switch (this._Class) {
                    case "rep_hero":
                    case "rep_myhero":
                        this._nKind = CChar.HERO;
                        break;
                    case "rep_monster":
                    case "rep_myhero_defender":
                        this._nKind = CChar.MONSTER;
                        break;
                    default:
                        this._nKind = CKey.UNKNOWN;
                }
            }
        }
    });
    CChar.HERO = 0;
    CChar.MONSTER = 1;


    var CSkill = DefineClass({
        extend: CElementKey,
        construct: function (HTMLElement) {
            CElementKey.call(this, HTMLElement);
        }
    });


    var CItem = DefineClass({
        extend: CElementKey,
        construct: function (HTMLElement) {
            CElementKey.call(this, HTMLElement);
        }
    });

    var CDamage = DefineClass({
        extend: CKey,
        construct: function (HTMLElement) {
            this._nBasicDmg;
            this._nActualDmg;
            this._nArmor;
            this._sType;
            this._cType;

            if (HTMLElement != null) {
                var Str;
                if (HTMLElement.nodeType != Node.TEXT_NODE) {
                    Str = HTMLElement.getAttribute("onmouseover");
                    // \1    basic damage
                    var Patt_BasicDamage = Local.Pattern_BasicDamage;
                    var result = Patt_BasicDamage.exec(Str);
                    if (result == null)
                        throw "CDamage() :" + Str;
                    this._nBasicDmg = Number(result[1]);
                    Str = HTMLElement.firstChild.data;
                } else
                    Str = HTMLElement.data;

                // \1    actual damage
                // \2    armor
                // \3    damage type
                var Patt_Damage = Local.Pattern_Damage;
                var result = Patt_Damage.exec(Str);
                if (result == null)
                    throw "CDamage() :" + Str;
                this._nActualDmg = Number(result[1]);
                this._nArmor = result[2] != null ? Number(result[2]) : 0;
                this._sType = result[3] || "";
                this._cType = new CDamageType(this._sType);

                if (this._nBasicDmg == null)
                    this._nBasicDmg = this._nActualDmg + this._nArmor;
            }
        },
        methods: {
            GetType: function () {
                return this._sType;
            },
            GetDamageType: function () {
                return this._cType;
            },
            GetBasicDmg: function () {
                return this._nBasicDmg;
            },
            GetArmor: function () {
                return this._nArmor;
            },
            GetActualDmg: function () {
                return this._nActualDmg;
            },
            IsHPDamage: function () {
                return Local.OrigTextList_NoneHPDamageType.indexOf(this._sType) <= -1;
            },
            compareTo: function (that) {
                return this._nBasicDmg - that._nBasicDmg;
            },
            toHTMLNode: function () {
                var Str = '';
                if (this._sType != null) {
                    Str = String(this._nBasicDmg);
                    if (this._nArmor > 0)
                        Str += " - " + this._nArmor + " -> " + this._nActualDmg;
                    else if (this._nBasicDmg !== this._nActualDmg)
                        Str += " -> " + this._nActualDmg;
                    Str += " " + this._sType;
                }
                document.createTextNode(Str);
            }
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    // Class: Value list
    // Value list is a special key, it can contains any type of values, including keys

    var CValueList = DefineClass({
        extend: CKey,
        construct: function () {
            this._gValue = [];
            this._nValue = [];
            this._ActiveValue = [];
            this._nAvgValue; // unsure type
            this._nMaxValue; // unsure type
            this._nMinValue; // unsure type
            this._nSTDValue; // unsure type
            this._nTotalValue; // unsure type
        },
        methods: {
            GetLength: function () {
                return document.createTextNode(this._gValue.length);
            },
            Calculate: function () { },
            push: function (ActiveRow, Value) {
                this._nValue.push(Value);
                if (this._ActiveValue.indexOf(ActiveRow) <= -1)
                    this._ActiveValue.push(ActiveRow);
                var activeValue = new CActiveValue(ActiveRow, Value);
                return this._gValue.push(activeValue);
            },
            compareTo: function (that) {
                return this._nAvgValue - that._nAvgValue;
            },
            AvgValue: function () {
                return this.getNode(this._nAvgValue);
            },
            MaxValue: function () {
                return this.getNode(this._nMaxValue);
            },
            MinValue: function () {
                return this.getNode(this._nMinValue);
            },
            STDValue: function () {
                return this.getNode(this._nSTDValue);
            },
            TotalValue: function () {
                return this.getNode(this._nTotalValue);
            },
            ActiveValue: function () {
                return this._ActiveValue;
            },
            toHTMLNode: function () {
                var table = document.createElement('table');
                table.style.width = '100%';
                var cell = table.insertRow(-1).insertCell(-1);
                cell.colSpan = "3";
                cell.style.textAlign = 'center';
                var ret = document.createElement("span");
                var value = this.sortValue(this._nValue);
                ret.innerHTML = value.join(", ");
                cell.appendChild(ret);
                return table;
            },
            sortValue: function (value) {
                return value.sort();
            },
            getNode: function (data) {
                return document.createTextNode(String(data));
            },
            Legend: function () {
                return null;
            }
        }
    });

    var CVLString = DefineClass({
        extend: CValueList,
        construct: function () {
            CValueList.call(this);
        },
        methods: {
            Calculate: function () {
                this._nAvgValue = "";
                this._nMaxValue = "";
                this._nMinValue = "";
                this._nSTDValue = "";
                this._nTotalValue = "";
            },
            compareTo: function (that) {
                return 0;
            },
            toHTMLNode: function () {
                var table = document.createElement('table');
                table.style.width = '100%';
                var cell = table.insertRow(-1).insertCell(-1);
                cell.colSpan = "3";
                cell.style.textAlign = 'center';
                return table;
            }
        }
    });

    var CVLNumber = DefineClass({
        extend: CValueList,
        construct: function () {
            CValueList.call(this);
        },
        methods: {
            Calculate: function () {
                this._nTotalValue = 0;
                for (var i = 0; i < this._nValue.length; ++i)
                    this._nTotalValue += Number(this._nValue[i]);

                this._nAvgValue = Number((this._nTotalValue / this._gValue.length)).toFixed(2);
                this._nMaxValue = getMax(this._nValue);
                this._nMinValue = getMin(this._nValue);
                this._nSTDValue = getSTD(this._nValue);
            },
            sortValue: function (value) {
                return value.sort(function (a, b) { return b - a; });
            }
        }
    });


    // value: [Number1, Number2]
    var CVLPairNumber = DefineClass({
        extend: CValueList,
        construct: function () {
            CValueList.call(this);
            this._nTotalValue = [0, 0];
            this.gValueZero = [];
            this.gValueFirst = [];
            this.nSorting = [];
        },
        methods: {
            Calculate: function () {
                this.setPair();
                this.doCalculate();
            },
            setPair: function () {
                for (var i = 0; i < this._nValue.length; ++i) {
                    var theValue = this._nValue[i];
                    this.gValueZero.push(theValue[0]);
                    this.gValueFirst.push(theValue[1]);
                    this._nTotalValue[0] += theValue[0];
                    this._nTotalValue[1] += theValue[1];
                    this.nSorting.push(theValue[0], theValue[1]);
                };
            },
            doCalculate: function () {
                this._nAvgValue = new Array(2);
                this._nAvgValue[0] = Number((this._nTotalValue[0] / this._gValue.length).toFixed(2));
                this._nAvgValue[1] = Number((this._nTotalValue[1] / this._gValue.length).toFixed(2));
                this._nMaxValue = new Array(2);
                this._nMaxValue[0] = getMax(this.gValueZero);
                this._nMaxValue[1] = getMax(this.gValueFirst);
                this._nMinValue = new Array(2);
                this._nMinValue[0] = getMin(this.gValueZero);
                this._nMinValue[1] = getMin(this.gValueFirst);
                this._nSTDValue = new Array(2);
                this._nSTDValue[0] = getSTD(this.gValueZero);
                this._nSTDValue[1] = getSTD(this.gValueFirst);
            },
            compareTo: function (that) {
                if (this._nAvgValue[0] !== 0 || that._nAvgValue[0] !== 0)
                    return this._nAvgValue[0] - that._nAvgValue[0];
                else
                    return this._nAvgValue[1] - that._nAvgValue[1];
            },
            toHTMLNode: function () {
                var table = document.createElement('table');
                table.style.width = '100%';
                var cell = table.insertRow(-1).insertCell(-1);
                cell.style.textAlign = 'center';
                cell.colSpan = "3";
                this.nSorting.sort(function (a, b) { return b[0] - a[0]; });
                for (var i = 0; i < this.nSorting.length; ++i) {
                    var ret = document.createElement("span");
                    ret.className = "pair_value";
                    var theValue = this.nSorting[i];
                    var s = document.createElement('span');
                    s.innerHTML = (theValue[0] != null) ? theValue[0] : 0;
                    ret.appendChild(s);
                    s = document.createElement('span');
                    s.innerHTML = ' [ ' + ((theValue[1] != null) ? theValue[1] : 0) + ' ]';
                    ret.appendChild(s);
                    if (i < this.nSorting.length - 1)
                        ret.appendChild(document.createTextNode(', '));
                    cell.appendChild(ret);
                }
                return table;
            },
            getNode: function (data) {
                var table = document.createElement('table');
                table.className = "pair_value";
                table.id = data[0] + "_" + data[1];
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = String(data[0]);
                cell2.innerHTML = String(data[1]);
                return table;
            },
            Legend: function () {
                var infospan = document.createElement("span");
                infospan.className = "pair_value";
                infospan.innerHTML = '<span>ROLL点</span><span>&bnsp;&bnsp;实际值</span>: ';
                return infospan;
            }
        }
    });


    // value: An Array of CDamage
    var CVLDamage = DefineClass({
        extend: CVLPairNumber,
        construct: function () {
            CVLPairNumber.call(this);
        },
        methods: {
            setPair: function () {
                for (var i = 0; i < this._nValue.length; ++i) {
                    var nSumOneAtkValue = [0, 0];
                    var theActiveValue = this._nValue[i];
                    for (var j = 0; j < theActiveValue.length; ++j) {
                        var theValue = theActiveValue[j];
                        this._nTotalValue[0] += theValue.GetBasicDmg();
                        this._nTotalValue[1] += theValue.GetActualDmg();
                        nSumOneAtkValue[0] = nSumOneAtkValue[0] + theValue.GetBasicDmg();
                        nSumOneAtkValue[1] = nSumOneAtkValue[1] + theValue.GetActualDmg();
                    }
                    this.gValueZero.push(nSumOneAtkValue[0]);
                    this.gValueFirst.push(nSumOneAtkValue[1]);
                    this.nSorting.push(nSumOneAtkValue);
                }
            }
        }
    });
    ///////////////////////////////////////////////////////////////////////////////
    // Class: Info list
    function CCellContent(value, rowspan, show, filterId, activeRows) {
        this.value = value;
        this.rowspan = rowspan;
        this.show = show;
        this.filterId = filterId;
        this.activeRows = activeRows || [];
    }

    function CKeyType(name, type, legend) {
        this.Name = name;
        this.Type = type;
        this.legend = legend ? legend.cloneNode(true) : null;
        this.getValue = function (info) {
            var value = info.ValueList;
            switch (this.Name) {
                case Local.Text_Table_AvgRoll:
                case Local.Text_Table_ItemDamagePoints:
                    return value.AvgValue();
                case Local.Text_Table_Times:
                    return value.GetLength();
                case Local.Text_Table_MaxRoll:
                    return value.MaxValue();
                case Local.Text_Table_MinRoll:
                    return value.MinValue();
                case Local.Text_Table_STDRoll:
                    return value.STDValue();
                case Local.Text_Table_Total:
                    return value.TotalValue();
                case Local.Text_Table_RollList:
                case Local.Text_Table_DetailList:
                    var ret = document.createElement("input");
                    ret.type = "button";
                    ret.className = "button";
                    ret.value = Local.Text_Button_Show;
                    ret.setAttribute("data", value.toString());
                    return ret;
                default:
                    return document.createTextNode(this.Name);
            }
        };
    }

    CKeyType.AvgRoll = function (legend) {
        return new CKeyType(Local.Text_Table_AvgRoll, "number", legend);
    };

    CKeyType.Times = function (legend) {
        return new CKeyType(Local.Text_Table_Times, "number", legend);
    };

    CKeyType.MaxRoll = function (legend) {
        return new CKeyType(Local.Text_Table_MaxRoll, "number", legend);
    };

    CKeyType.MinRoll = function (legend) {
        return new CKeyType(Local.Text_Table_MinRoll, "number", legend);
    };

    CKeyType.STDRoll = function (legend) {
        return new CKeyType(Local.Text_Table_STDRoll, "number", legend);
    };

    CKeyType.TotalRoll = function (legend) {
        return new CKeyType(Local.Text_Table_Total, "number", legend);
    };

    CKeyType.RollList = function (legend) {
        return new CKeyType(Local.Text_Table_RollList, "button", legend);
    };

    CKeyType.DetailList = function (legend) {
        return new CKeyType(Local.Text_Table_DetailList, "button", legend);
    };

    CKeyType.Char = function (legend) {
        var _legend = legend;
        if (!legend) {
            var info = document.createElement("table");
            info.className = 'pair_hero';
            var hero = info.insertRow(-1).insertCell(-1);
            var check = document.createElement("INPUT");
            check.type = 'checkbox';
            check.value = CChar.HERO;
            check.checked = true;
            hero.appendChild(check);
            hero.appendChild(document.createTextNode('英雄'));
            var npc = info.rows[0].insertCell(-1);
            check = document.createElement("INPUT");
            check.type = 'checkbox';
            check.value = CChar.MONSTER;
            check.checked = true;
            npc.appendChild(check);
            npc.appendChild(document.createTextNode('对手'));
            _legend = info;
        }

        return new CKeyType(Local.Text_Table_Char, "string", _legend);
    };

    CKeyType.ProviderChar = function (legend) {
        return new CKeyType(Local.Text_Table_Buffer, "string", legend);
    };

    CKeyType.ReceiverChar = function (legend) {
        return new CKeyType(Local.Text_Table_BuffeReceiver, "string", legend);
    };

    CKeyType.AttackType = function (legend) {
        return new CKeyType(Local.Text_Table_AttackType, "string", legend);
    };

    CKeyType.Skill = function (legend) {
        return new CKeyType(Local.Text_Table_Skill, "string", legend);
    };

    CKeyType.Item = function (legend) {
        return new CKeyType(Local.Text_Table_Item, "string", legend);
    };

    CKeyType.Position = function (legend) {
        return new CKeyType(Local.Text_Table_Position, "string", legend);
    };

    CKeyType.HealType = function (legend) {
        return new CKeyType(Local.Text_Table_HealType, "string", legend);
    };

    CKeyType.BuffType = function (legend) {
        return new CKeyType(Local.Text_Table_BuffType, "string", legend);
    };

    CKeyType.DamageType = function (legend) {
        return new CKeyType(Local.Text_Table_DamageType, "string", legend);
    };

    CKeyType.DefenceType = function (legend) {
        return new CKeyType(Local.Text_Table_DefenceType, "string", legend);
    };

    CKeyType.ItemDamagePoints = function (legend) {
        return new CKeyType(Local.Text_Table_ItemDamagePoints, "string", legend);
    };

    CKeyType.ValueName = function (legend) {
        return [CKeyType.AvgRoll(legend), CKeyType.Times(), CKeyType.MaxRoll(legend), CKeyType.MinRoll(legend), CKeyType.STDRoll(legend), CKeyType.RollList()];
    };

    CKeyType.TotalValueName = function (legend) {
        return [CKeyType.TotalRoll(legend), CKeyType.AvgRoll(legend), CKeyType.Times(), CKeyType.MaxRoll(legend), CKeyType.MinRoll(legend), CKeyType.STDRoll(legend), CKeyType.RollList()];
    };

    var CInfoList = DefineClass({
        construct: function (CValueList, Title, Id, gKeyName, gValueName) {
            this._gInfo = [];
            this._gKeyName = gKeyName || [];
            this._nKeys = this._gKeyName.length;
            this._CValueList = CValueList || [];
            this._Table = null;
            this._Title = Title || "";
            this._Id = Id || "";
            this._gValueName = gValueName || [];
            this._Allkey = this._gKeyName.concat(this._gValueName);
        },
        methods: {
            _CompareKeys: function (gKeyA, gKeyB) {
                for (var i = 0; i < this._nKeys; ++i) {
                    var result = gKeyA[i].compareTo(gKeyB[i]);
                    if (result !== 0)
                        return result;
                }
                return 0;
            },
            _SetTableBodyCellContents: function () {
                if (this._gInfo.length <= 0)
                    return;
                var tablecontent = [];
                var keys = this._gInfo[0].gKey.length;
                var filters = new Array(keys);
                for (var i = 0; i < keys; i++) {
                    var filter = [];
                    filters[i] = filter;
                }
                for (var i = 0; i < this._gInfo.length; ++i) {
                    for (var j = 0; j < this._gInfo[i].gKey.length; ++j) {
                        var value = this._gInfo[i].gKey[j];
                        var filter = value.toText();
                        if (filters[j].indexOf(filter) <= -1)
                            filters[j].push(filter);
                    }
                }
                for (var i = 0; i < this._gInfo.length; ++i) {
                    var gBodyCellContent = [];
                    for (var j = 0; j < this._gInfo[i].gKey.length; ++j) {
                        if (j > 0)
                            filters[j].sort(CompareString);
                        var value = this._gInfo[i].gKey[j];
                        var filter = value.toText();
                        gBodyCellContent.push(new CCellContent(value.toHTMLNode(), 1, true, filters[j].indexOf(filter), this._gInfo[i].ValueList.ActiveValue()));
                    }
                    for (var j = 0; j < this._gValueName.length; ++j)
                        gBodyCellContent.push(new CCellContent(this._gValueName[j].getValue(this._gInfo[i]), 1, true, -1, this._gInfo[i].ValueList.ActiveValue()));

                    tablecontent.push(gBodyCellContent);
                }

                this._Table.SetHeadCellContentFilters.apply(this._Table, filters);

                if (groupData) {
                    for (var i = tablecontent.length - 1; i > 0; i--) {
                        for (var j = 0; j < keys; j++) {
                            if (tablecontent[i][j].value.compareTo(tablecontent[i - 1][j].value) === 0) {
                                tablecontent[i][j].show = false;
                                tablecontent[i - 1][j].rowspan = tablecontent[i][j].rowspan + 1;
                            }
                            else
                                break;
                        }
                    }
                }
                for (var i = 0; i < tablecontent.length; i++)
                    this._Table.SetBodyCellContents.apply(this._Table, tablecontent[i]);
            },
            SaveInfo: function (Info) { },
            Show: function (isExport) {
                if (this._gInfo.length > 0) {
                    this.CalculateValue();
                    this.sort();
                    return this.CreateTable(isExport);
                }
                return "";
            },
            getTab: function (isExport) {
                function FactoryTabClick(Id) {
                    return function () {
                        CStat.OnTabClick(Id);
                    };
                }
                var tab = document.createElement('li');
                tab.id = 'tab_' + this._Id;
                tab.className = 'not_selected';
                var a = document.createElement('A');
                var name = document.createTextNode(this._Title);
                a.appendChild(name);
                a.href = '#';
                if (isExport)
                    a.setAttribute("onclick", "st('" + this._Id + "');");
                else
                    a.addEventListener("click", FactoryTabClick(this._Id), false);
                tab.appendChild(a);
                return tab;
            },
            // Call this function when read all data, and before sort and export data
            CalculateValue: function () {
                for (var i = 0; i < this._gInfo.length; ++i)
                    this._gInfo[i].ValueList.Calculate();
            },
            CreateTable: function (isExport) {
                // Key1, Key2, ..., AverageValue, Times, MaxValue, MinValue, STDValue, ValueList
                this._Table = new CTable(this._Title, this._Id, this._Allkey.length, isExport);

                var gHeadCellContent = new Array(this._Allkey.length);
                var gHeadCellLegend = new Array(this._Allkey.length);
                var gBodyCellContentType = new Array(this._Allkey.length);
                for (var i = 0; i < this._Allkey.length; ++i) {
                    gHeadCellContent[i] = this._Allkey[i].Name;
                    gBodyCellContentType[i] = this._Allkey[i].Type;
                    gHeadCellLegend[i] = this._Allkey[i].legend;
                }

                this._Table.SetHeadCellContents.apply(this._Table, gHeadCellContent);
                this._Table.SetHeadCellLegends.apply(this._Table, gHeadCellLegend);
                this._Table.SetBodyCellContentTypes.apply(this._Table, gBodyCellContentType);

                this._SetTableBodyCellContents();

                return this._Table.CreateHTML();
            },
            // Call this function when edited the info list (for example, re-sorted it)
            ReCreateTableHTML: function () {
                this._SetTableBodyCellContents();
                return this._Table.CreateHTML();
            },
            push: function (ActiveRow, gKey, Value) {
                for (var i = 0; i < this._gInfo.length; ++i) {
                    if (this._CompareKeys(this._gInfo[i].gKey, gKey) === 0) {
                        this._gInfo[i].ValueList.push(ActiveRow, Value);
                        return this._gInfo.length;
                    }
                }

                var ValueList = new this._CValueList();
                ValueList.push(ActiveRow, Value);
                return this._gInfo.push(new CInfoList._CInfo(gKey, ValueList));
            },
            sort: function (gSortKeyId) {
                function Factory(gId) {
                    return function (A, B) {
                        return CInfoList._CompareInfo(A, B, gId);
                    };
                }
                return this._gInfo.sort(Factory(gSortKeyId));
            }
        },
        statics: {
            _CInfo: function (gKey, ValueList) {
                this.gKey = gKey;
                this.ValueList = ValueList;
            },
            // SortKeyId: Id of keys, or null
            // The list will be sorted in this way: sort them by the first key, if there are
            //   elements are still equal, then sort them by the second key, and so on.
            // If SortKeyId is null, then sort the list by value
            // If gSortKeyId is null, then sort the list by default order of keys
            _CompareInfo: function (InfoA, InfoB, gSortKeyId) {
                if (gSortKeyId == null) {
                    for (var i = 0; i < InfoA.gKey.length; ++i) {
                        var result = InfoA.gKey[i].compareTo(InfoB.gKey[i]);
                        if (result !== 0) return result;
                    }
                    return 0;
                } else {
                    for (var i = 0; i < gSortKeyId.length; ++i) {
                        var KeyId = gSortKeyId[i];
                        var result = (KeyId != null) ?
                            InfoA.gKey[KeyId].compareTo(InfoB.gKey[KeyId]) :
                            InfoA.ValueList.compareTo(InfoB.ValueList);
                        if (result !== 0) return result;
                    }
                    return 0;
                }
            }
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    // Sub classes of CInfoList
    //
    // var CIL_ = DefineClass({
    //    extend: CInfoList,
    //    construct: function(_nKeys, CValueList) {this.superclass(_nKeys, CValueList);},
    //    methods:
    //        {
    //        _SetTableBodyCellContents: function() {},
    //        SaveInfo: function(Info) {},
    //        Show: function() {},
    //        CreateTable: function(Title, Id, gKeyName) {}
    //        }
    //    });

    var CILIni = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            this.superclass(CValueList, Local.Text_Table_Ini, "stat_ini", [CKeyType.Char()],
                CKeyType.ValueName());
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.nCurrAction === 1)
                    this.push(Info.ActiveRow, [Info.Active.Char], Info.Active.nIniRoll);
            }
        }
    });


    var CILAttackRoll = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            this.superclass(CValueList, Local.Text_Table_Attack, "stat_attack", [CKeyType.Char(), CKeyType.AttackType(), CKeyType.Skill(), CKeyType.Item(), CKeyType.Position()],
                CKeyType.ValueName());
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.ATTACK && Info.Active.gAttackRoll.length != 0) {
                    for (var i = 0; i < Info.Active.gAttackRoll.length; ++i) {
                        this.push(Info.ActiveRow, [Info.Active.Char, Info.Active.ActionType, Info.Active.Skill, Info.Active.gItem, Info.Active.gPosition._gKey[i]],
                            Info.Active.gAttackRoll[i]);
                    }
                }
            }
        }
    });


    var CILDefenceRoll = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            this.superclass(CValueList, Local.Text_Table_Defence, "stat_defence", [CKeyType.Char(), CKeyType.DefenceType(), CKeyType.Skill(), CKeyType.Item()],
                CKeyType.ValueName());
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.ATTACK) {
                    for (var i = 0; i < Info.gPassive.length; ++i) {
                        if (Info.gPassive[i].nDefenceRoll != null)
                            this.push(Info.ActiveRow, [Info.gPassive[i].Char, Info.Active.ActionType,
                            Info.gPassive[i].Skill, Info.gPassive[i].gItem], Info.gPassive[i].nDefenceRoll);
                    }
                }
            }
        }
    });


    var CILDamage = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            var infospan = document.createElement("span");
            infospan.className = "pair_value";
            infospan.innerHTML = '<span>ROLL点</span>&nbsp;&nbsp;<span>实际值</span>';

            this.superclass(CValueList, Local.Text_Table_Damage, "stat_damage", [CKeyType.Char(), CKeyType.AttackType(), CKeyType.Skill(), CKeyType.Item(), CKeyType.DamageType()],
                CKeyType.TotalValueName(infospan));
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.ATTACK) {
                    for (var i = 0; i < Info.gPassive.length; ++i) {
                        if (Info.gPassive[i].gDamage.length > 0) {
                            //var damage = [];
                            //damage.push(Info.gPassive[i].gDamage);
                            for (var index = 0; index < Info.gPassive[i].gDamage.length; index++) {
                                this.push(Info.ActiveRow, [Info.Active.Char, Info.Active.ActionType, Info.Active.Skill, Info.Active.gItem, Info.gPassive[i].gDamage[index].GetDamageType()], [Info.gPassive[i].gDamage[index]]);
                            }
                        }

                    }
                }
            }
        }
    });

    var CILDamaged = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            var infospan = document.createElement("span");
            infospan.className = "pair_value";
            infospan.innerHTML = '<span>ROLL点</span>&nbsp;&nbsp;<span>实际值</span>';

            this.superclass(CValueList, Local.Text_Table_Damaged, "stat_damaged", [CKeyType.Char(), CKeyType.AttackType(), CKeyType.Skill(), CKeyType.Item(), CKeyType.DamageType()],
                CKeyType.TotalValueName(infospan));
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.ATTACK) {
                    for (var i = 0; i < Info.gPassive.length; ++i) {
                        if (Info.gPassive[i].gDamage.length > 0) {
                            //var damage = [];
                            //damage.push(Info.gPassive[i].gDamage);
                            for (var index = 0; index < Info.gPassive[i].gDamage.length; index++) {
                                this.push(Info.ActiveRow, [Info.gPassive[i].Char, Info.Active.ActionType, Info.Active.Skill, Info.Active.gItem, Info.gPassive[i].gDamage[index].GetDamageType()], [Info.gPassive[i].gDamage[index]]);
                            }
                        }

                    }
                }
            }
        }
    });

    var CILHeal = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            this.superclass(CValueList, Local.Text_Table_Heal, "stat_heal", [CKeyType.Char(), CKeyType.Skill(), CKeyType.Item(), CKeyType.HealType()],
                CKeyType.TotalValueName());
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.HEAL) {
                    for (var i = 0; i < Info.gPassive.length; ++i) {
                        if (Info.gPassive[i].nHealedHP != null)
                            this.push(Info.ActiveRow, [Info.Active.Char, Info.Active.Skill, Info.Active.gItem, new CHealType('HP')], [Number(Info.gPassive[i].nHealedHP)]);

                        if (Info.gPassive[i].nHealedMP != null)
                            this.push(Info.ActiveRow, [Info.Active.Char, Info.Active.Skill, Info.Active.gItem, new CHealType('MP')], [Number(Info.gPassive[i].nHealedMP)]);
                    }
                }
            }
        }
    });

    var CILHealed = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            this.superclass(CValueList, Local.Text_Table_Healed, "stat_healed", [CKeyType.Char(), CKeyType.HealType()],
                CKeyType.TotalValueName());
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.HEAL) {
                    for (var i = 0; i < Info.gPassive.length; ++i) {
                        if (Info.gPassive[i].nHealedHP != null)
                            this.push(Info.ActiveRow, [Info.gPassive[i].Char, new CHealType('HP')], [Number(Info.gPassive[i].nHealedHP)]);

                        if (Info.gPassive[i].nHealedMP != null)
                            this.push(Info.ActiveRow, [Info.gPassive[i].Char, new CHealType('MP')], [Number(Info.gPassive[i].nHealedMP)]);
                    }
                }
            }
        }
    });

    var CILBuff = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            this.superclass(CValueList, Local.Text_Table_Buff, "stat_buff", [CKeyType.Char(), CKeyType.Skill(), CKeyType.Item(), CKeyType.BuffType()],
                [CKeyType.Times(), CKeyType.DetailList()]);
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.BUFF) {
                    this.push(Info.ActiveRow, [Info.Active.Char, Info.Active.Skill, Info.Active.gItem, new CBuffType(Info.Active.nIniRoll == null ? '回合前' : '回合中')], [0]);
                }
            }
        }
    });
    var CILBuffed = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            this.superclass(CValueList, Local.Text_Table_Buffed, "stat_buffed", [CKeyType.Char(), CKeyType.Skill(), CKeyType.Item(), CKeyType.BuffType()],
                [CKeyType.Times(), CKeyType.DetailList()]);
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.BUFF) {
                    for (var i = 0; i < Info.gPassive.length; ++i)
                        this.push(Info.ActiveRow, [Info.gPassive[i].Char, Info.Active.Skill, Info.Active.gItem, new CBuffType(Info.Active.nIniRoll == null ? '回合前' : '回合中')], [0]);
                }
            }
        }
    });


    var CILItemDamage = DefineClass({
        extend: CInfoList,
        construct: function (CValueList) {
            this.superclass(CValueList, Local.Text_Table_DamagedItems, "stat_item_damage", [CKeyType.Char(), CKeyType.Item()], [CKeyType.TotalRoll(), CKeyType.Times(), CKeyType.ItemDamagePoints(), CKeyType.RollList()]);
        },
        methods: {
            SaveInfo: function (Info) {
                if (Info.Active.ActionType.GetKind() === CActionType.ATTACK) {
                    for (var i = 0; i < Info.gPassive.length; ++i) {
                        if (Info.gPassive[i].nItemDamage != null)
                            this.push(Info.ActiveRow, [Info.gPassive[i].Char, Info.gPassive[i].DamagedItem],
                                Info.gPassive[i].nItemDamage);
                    }
                }
            }
        }
    });


    // FUNCTIONS //////////////////////////////////////////////////////////////////
    function CountStat(page, bLastSubPage, alsoSaveEntire) {
        // Read the last round only when reading the last sub page
        if (!bLastSubPage) RemoveLastRound(page);
        var nLevel = GetHiddenInfo(page, "current_level", 1);
        var ret = GetRepPageInfo(page, [1, 1]);
        var nCurrRepPage = ret[0];

        var Navi = new CNavi(nLevel, nCurrRepPage, 0, 0);
        var allRows = page.getElementsByTagName("tr");
        Stat.nTotalRows = allRows.length;
        for (var i = 0; i < allRows.length; ++i) {
            Stat.nReadRows = i + 1;
            var Info = new CActionInfo(Navi);
            var IniColumn = first_child(allRows[i]);
            if (!GetIniInfo(IniColumn, Info))
                continue;
            Navi.nRow++;
            allRows[i].setAttribute('id', Info.ActiveRow);
            if (Stat.iscurrentPage == false) {
                Stat._reportInfoDiv.firstChild.appendChild(allRows[i].cloneNode(true));
            }
            if (alsoSaveEntire && StatEntire.iscurrentPage == false) {
                StatEntire._reportInfoDiv.firstChild.appendChild(allRows[i].cloneNode(true));
            }

            var ActiveColumn = node_after(IniColumn);
            GetActiveInfo(ActiveColumn, Info);

            switch (Info.Active.ActionType.GetKind()) {
                case CActionType.ATTACK: // Attack
                    {
                        var PassiveColumn = node_after(ActiveColumn);
                        if (PassiveColumn)
                            GetAttackedInfo(PassiveColumn, Info);
                        break;
                    }
                case CActionType.HEAL: // Heal
                    {
                        if (includeFilter.Healed) {
                            var PassiveColumn = node_after(ActiveColumn);
                            GetHealedBuffedInfo(PassiveColumn, Info);
                            break;
                        }
                    }
                case CActionType.BUFF: // Buff
                    {
                        if (includeFilter.Buffed) {
                            var PassiveColumn = node_after(ActiveColumn);
                            GetHealedBuffedInfo(PassiveColumn, Info);
                            break;
                        }
                    }
                case CActionType.WAIT: // Wait
                default: // Unknown
                    ;
            }
            Stat.SaveInfo(Info);
            if (alsoSaveEntire)
                StatEntire.SaveInfo(Info);
        };
    }


    function RemoveLastRound(page) {
        var allRows = page.getElementsByTagName("tr");
        for (var i = 0; i < allRows.length; ++i) {
            if (allRows[i].className != null &&
                rValue.Pattern_logRow.test(allRows[i].className)) {
                var allH1 = allRows[i].getElementsByTagName("h1");
                if (allH1[0] != null &&
                    allH1[0].firstChild != null &&
                    allH1[0].firstChild.nodeType == Node.TEXT_NODE &&
                    allH1[0].firstChild.data == Local.OrigText_LastRound) {
                    allRows[i].parentNode.removeChild(allRows[i]);
                    break;
                }
            }
        };
    }


    function GetIniInfo(Node, Info) {
        if (Node == null || Node.className != "rep_initiative")
            return false;

        if (Node.innerHTML == "&nbsp;")
            return true;

        if (includeFilter.Init) {
            // \1    ini
            // \2    current action
            // \3    total actions
            var Patt_Ini = Local.Pattern_Ini;
            var result = Patt_Ini.exec(Node.innerHTML);
            if (result == null) {
                DbgMsgAction(Info, "IniInfo: " + Node.innerHTML);
                return false;
            }

            var active = Info.Active;
            active.nIniRoll = Number(result[1]);
            active.nCurrAction = Number(result[2]);
            active.nTotalActions = Number(result[3]);
            return active.nIniRoll != null;
        }
        return false;
    }


    // return: whether the format is right
    function GetActiveInfo(Node, Info) {
        if (Node === null) {
            DbgMsgAction(Info, "ActiveInfo: null");
            return false;
        }
        var nStartNode = 0;
        var Str = Node.innerHTML;
        var active = Info.Active;

        // \1    span node
        // \2    npc Id
        var Patt_Char = Local.Pattern_Active_Char;
        var result = Patt_Char.exec(Str);
        if (result === null) {
            DbgMsgAction(Info, "ActiveInfo (Char): " + Node.innerHTML);
            return true;
        }
        var CharNode = result[1] != null ? Node.childNodes[nStartNode].childNodes[0] :
            Node.childNodes[nStartNode];
        active.Char = new CChar(CharNode);
        active.nCharId = result[2] != null ? Number(result[2]) : null;
        nStartNode += result[1] != null ? 1 : (result[2] != null ? 2 : 1);
        Str = Str.substring(result[0].length);

        // \1    attack
        // \2    heal or buff
        // \3    left parenthesis
        var Patt_Action1 = Local.Pattern_Active_Action1;
        result = Patt_Action1.exec(Str);
        if (result === null) {
            // \1    other action
            var Patt_Action2 = Local.Pattern_Active_Action2;
            result = Patt_Action2.exec(Str);
            if (result === null) {
                DbgMsgAction(Info, "ActiveInfo (Action2): " + Node.innerHTML);
                return false;
            }
            if (result[3] != null) {
                active.ActionType.setKind(CActionType.ATTACK);
                active.ActionType.setText("");
                active.gAttackRoll = [];
                active.gAttackRoll.push(Number(result[3]));
                active.gPosition.push(new CPositionType(""));
                active.Skill = new CSkill(null);
            }
            else
                active.ActionType = new CActionType(result[1]);
            return true;
        }
        if (result[1] != null) {
            active.ActionType = new CActionType(result[1]);
            if (active.ActionType.GetKind() !== CActionType.ATTACK) {
                DbgMsgAction(Info, "ActiveInfo (Attack Type): " + result[1]);
                return false;
            }
            nStartNode += 1;

            Str = Str.substring(result[0].length);

        } else {
            active.ActionType = new CActionType(result[2]);
            if (active.ActionType.GetKind() !== CActionType.HEAL && active.ActionType.GetKind() !== CActionType.BUFF) {
                DbgMsgAction(Info, "ActiveInfo (Heal/Buff Type): " + result[2]);
                return false;
            }
            active.Skill = new CSkill(Node.childNodes[nStartNode + 1]);
            if (result[3] === null)
                return true;
            nStartNode += 3;
            Str = Str.substring(result[0].length);
        }

        switch (active.ActionType.GetKind()) {
            case CActionType.ATTACK: // attack
                {
                    // \1    single roll
                    // \2   multiple positions and rolls
                    // \3    position n (only the last one)
                    // \4    multiple roll n (only the last one)
                    // \5    MP
                    // \6    item list
                    // \7   HP
                    if (includeFilter.Attack) {
                        var Patt_ActtackDetails = Local.Pattern_Active_AttackDetails;
                        result = Patt_ActtackDetails.exec(Str);
                        if (result === null) {
                            DbgMsgAction(Info, "ActiveInfo (ActtackDetails): " + Node.innerHTML);
                            return false;
                        }
                        active.Skill = new CSkill(Node.childNodes[nStartNode]);
                        active.gAttackRoll = [];
                        active.gPosition = new CKeyList();
                        if (result[1] != null) {
                            active.gAttackRoll.push(Number(result[1]));
                            active.gPosition.push(new CPositionType(''));
                        }
                        if (result[2] != null) {
                            var pattern_pos_atk = /^([^\u0000-\u007F]+): ([\d]+)$/;
                            var gPos_Atk = result[2].split('/');
                            for (var i = 1; i < gPos_Atk.length; ++i) {
                                var inner_result = pattern_pos_atk.exec(gPos_Atk[i]);
                                active.gAttackRoll.push(Number(inner_result[2]));
                                active.gPosition.push(new CPositionType(inner_result[1]));
                            }
                        }
                        active.nSkillMP = result[5] != null ? Number(result[5]) : null;
                        active.nSkillHP = result[7] != null ? Number(result[7]) : null;
                        if (result[6] != null) {
                            active.gItem = new CKeyList();
                            nStartNode += result[5] != null ? 4 : 2;
                            var ItemNode;
                            while ((ItemNode = Node.childNodes[nStartNode]) != null) {
                                if (ItemNode.tagName == 'A') {
                                    active.gItem.push(new CItem(ItemNode));
                                    nStartNode += 2;
                                }
                                else {
                                    nStartNode++;
                                }
                            }
                        }
                    }
                    return true;
                }
            case CActionType.HEAL: // heal
            case CActionType.BUFF: // buff
                {
                    // \1    MP
                    // \2    normal item list
                    // \3    magical potion
                    if ((includeFilter.Heal && active.ActionType.GetKind() === CActionType.HEAL) || (includeFilter.Buff && active.ActionType.GetKind() === CActionType.BUFF)) {
                        var Patt_HealBuffDetails = Local.Pattern_Active_HealBuffDetails;
                        result = Patt_HealBuffDetails.exec(Str);
                        if (result === null) {
                            DbgMsgAction(Info, "ActiveInfo (HealBuffDetails): " + Node.innerHTML);
                            return false;
                        }
                        active.nSkillMP = result[1] != null ? Number(result[1]) : null;
                        if (result[2] != null) {
                            active.gItem = new CKeyList();
                            nStartNode += result[1] != null ? 2 : 0;
                            var ItemNode;
                            while ((ItemNode = Node.childNodes[nStartNode]) != null) {
                                if (ItemNode.tagName == 'A') {
                                    active.gItem.push(new CItem(ItemNode));
                                    nStartNode += 2;
                                }
                                else {
                                    nStartNode++;
                                }
                            }
                        } else if (result[3] != null) {
                            active.gItem = new CKeyList();
                            nStartNode += result[1] != null ? 2 : 0;
                            active.gItem.push(new CItem(Node.childNodes[nStartNode]));
                            // nStartNode: determine by the number of reagents
                        }
                    }
                    return true;
                }
            default: // impossible, the value can only be 0, 1, or 2
                return false;
        }
    }


    // return: whether the format is right
    function GetAttackedInfo(Node, Info) {
        if (Node === null) {
            DbgMsgAction(Info, "AttackedInfo: null");
            return false;
        }
        var nStartNode = 0;
        var Str = Node.innerHTML;

        // \1    char span node
        // \2    char Id
        // \3    skill
        // \4    defence roll
        // \5    MP
        // \6    item list
        // \7    hit type
        // \8    struck down
        // \9    damage list
        // \10    item damage
        // \11    next flag
        var Patt_Attacked = Local.Pattern_Passive_Attacked;
        var bEnd = false;
        while (!bEnd) {
            var PassiveInfo = new CPassiveInfo();
            var result = Patt_Attacked.exec(Str);
            if (result === null) {
                DbgMsgAction(Info, "AttackedInfo: " + Node.innerHTML);
                return true;
            }
            var CharNode = result[1] != null ? Node.childNodes[nStartNode].childNodes[0] :
                Node.childNodes[nStartNode];
            PassiveInfo.Char = new CChar(CharNode);
            PassiveInfo.nCharId = result[2] != null ? Number(result[2]) : null;
            nStartNode += result[1] != null ? 1 : (result[2] != null ? 2 : 1);
            if (result[3] != null) {
                PassiveInfo.Skill = new CSkill(Node.childNodes[nStartNode + 1]);
                nStartNode += 2;
            }
            PassiveInfo.nDefenceRoll = Number(result[4]);
            if (result[5] != null) {
                PassiveInfo.nSkillMP = Number(result[5]);
                nStartNode += 2;
            }
            if (result[6] != null) {
                PassiveInfo.gItem = new CKeyList();
                nStartNode += 1;
                var ItemNode = Node.childNodes[nStartNode];
                while (ItemNode != null && ItemNode.nodeName == "A") {
                    PassiveInfo.gItem.push(new CItem(ItemNode));
                    nStartNode += 2;
                    ItemNode = Node.childNodes[nStartNode];
                }
            } else
                nStartNode += 1;
            PassiveInfo.HitType = new CHitType(result[7]);
            PassiveInfo.bStruckDown = (result[8] != null);
            nStartNode += result[8] != null ? 2 : 1;
            if (result[9] != null) {
                PassiveInfo.gDamage = [];
                nStartNode += 1;
                var DamageNode = Node.childNodes[nStartNode];
                while (DamageNode != null && (DamageNode.nodeType == Node.TEXT_NODE ||
                    (DamageNode.nodeName == "SPAN" &&
                        DamageNode.firstChild != null && DamageNode.firstChild.nodeType == Node.TEXT_NODE))) {
                    PassiveInfo.gDamage.push(new CDamage(DamageNode));
                    nStartNode += 2;
                    DamageNode = Node.childNodes[nStartNode];
                }
                nStartNode -= 1;
            }
            if (result[10] != null) {
                PassiveInfo.DamagedItem = new CItem(Node.childNodes[nStartNode + 1]);
                PassiveInfo.nItemDamage = Number(result[10]);
                nStartNode += 3;
            }
            if (result[11] != null)
                nStartNode += 1;
            else
                bEnd = true;

            Info.gPassive.push(PassiveInfo);
            Str = Str.substring(result[0].length);
        }
        return true;
    }


    // return: whether the format is right
    function GetHealedBuffedInfo(Node, Info) {
        if (Node === null) {
            DbgMsgAction(Info, "HealedBuffedInfo: null");
            return false;
        }
        var nStartNode = 0;
        var Str = Node.innerHTML;

        // \1    span node
        // \2    char Id
        // \3    self
        // \4    HP
        // \5    MP
        // \6    next flag
        var Patt_HealedBuffed = Local.Pattern_Passive_Healed_Buffed;
        var bEnd = false;
        while (!bEnd) {
            var PassiveInfo = new CPassiveInfo();
            var result = Patt_HealedBuffed.exec(Str);
            if (result === null) {
                DbgMsgAction(Info, "HealedBuffedInfo: " + Node.innerHTML);
                return true;
            }
            if (result[3] != null) {
                PassiveInfo.Char = Info.Active.Char;
                PassiveInfo.nCharId = Info.Active.nCharId;
            } else {
                var CharNode = result[1] != null ? Node.childNodes[nStartNode].childNodes[0] :
                    Node.childNodes[nStartNode];
                PassiveInfo.Char = new CChar(CharNode);
                PassiveInfo.nCharId = result[2] != null ? Number(result[2]) : null;
                nStartNode += result[1] != null ? 1 : (result[2] != null ? 2 : 1);
            }
            PassiveInfo.nHealedHP = result[4] != null ? Number(result[4]) : null;
            PassiveInfo.nHealedMP = result[5] != null ? Number(result[5]) : null;
            nStartNode += 1;
            if (result[6] != null)
                nStartNode += 1;
            else
                bEnd = true;

            Info.gPassive.push(PassiveInfo);
            Str = Str.substring(result[0].length);
        }
        return true;
    }


    function DbgMsgAction(Info, Text) {
        if (DEBUG)
            alert("[" + Info.Navi.nLevel + "." + Info.Navi.nRoom + "." +
                Info.Navi.nRound + "." + Info.Navi.nRow + "] " + Text);
    }


    // GLOBAL VARIABLES ///////////////////////////////////////////////////////////

    var DEBUG = false;

    var groupData = false;

    var useFilter = true;

    var Contents = {
      OrigText_Button_DungeonDetails: ["details", "详细资料"],
      OrigText_Button_DuelDetails: ["Details", "详细"],
      OrigText_Button_DungeonStat: ["statistics", "统计表"],
      OrigText_Level: ["Level", "层数"],
      OrigText_LastRound: ["Last round:", "最后回合:"],
      OrigTextList_AttackActionType: [
        [
          "attacks",
          "ranged attacks",
          "attacks with magic",
          "socially attacks",
          "cunningly attacks",
          "activates on",
          "works as a force of nature upon",
          "infected",
          "casts an explosion at",
          "deactivated",
          "magic projectile",
          "curse",
          "scare",
          "other",
        ],
        [
          "近战攻击",
          "远程攻击",
          "魔法攻击",
          "心理攻击",
          "偷袭",
          "触发",
          "作为自然灾害",
          "散布",
          "制造爆炸",
          "解除",
          "魔法投射",
          "诅咒",
          "恐吓",
          "冲击",
          "魔法弹",
        ],
      ],
      OrigTextList_HealActionType: [["heals with"], ["治疗"]],
      OrigTextList_BuffActionType: [
        ["uses", "summons with"],
        ["使用", "召唤"],
      ],
      OrigTextList_WaitActionType: [
        ["is unable to do anything.", "looks around in boredom and waits."],
        ["不能执行任何动作.", "无聊的打量四周，等待着."],
      ],
      OrigTextList_NoneHPDamageType: [
        ["mana damage", "mana"],
        ["法力伤害", "法力"],
      ],
      Pattern_Ini: [
        /^Initiative ([\d]+)<br><span .*?>Action ([\d]+) of ([\d]+)<\/span>$/,
        /^先攻([\d]+)<br><span .*?>第([\d]+)步行动 \/ 共([\d]+)步<\/span>$/,
      ],
      Pattern_Active_Char: [
        /^(<span .*?>)?<a .*?>.*?<\/a>(?:<span .*?>([\d]+)<\/span>)?(?:<img .*?><\/span>)?/,
        /^(<span .*?>)?<a .*?>.*?<\/a>(?:<span .*?>([\d]+)<\/span>)?(?:<img .*?><\/span>)?/,
      ],
      Pattern_Active_Action1: [
        /^\s*(?:([A-Za-z][A-Za-z ]+[A-Za-z]) +\(|([A-Za-z][A-Za-z ]+[A-Za-z]) +<a .*?>.*?<\/a>(?:( \()|$| on $))/,
        /^\s*(?:([^\u0000-\u007F]+) +\(|([^\u0000-\u007F]+)<a .*?>.*?<\/a>(?:( \()|$|给$))/,
      ],
      Pattern_Active_Action2: [
        /^\s*([\S][^/(^/)]*[\S])([/(]([\d]+)[/)])?\s*$/,
        /^\s*([\S][^/(^/)]*[\S])([/(]([\d]+)[/)])?\s*$/,
      ],
      Pattern_Active_AttackDetails: [
        /^<a .*?>.*?<\/a>(?:\/([\d]+)|(?:\/([A-Za-z ]+): ([\d]+))+)(?:\/<span .*?>([\d]+) MP<\/span>)?(\/(?:<a .*?>.*?<\/a>,)*<a .*?>.*?<\/a>)?\)$/,
        /^<a .*?>.*?<\/a>(?:\/([\d]+)|((?:\/([^\u0000-\u007F]+): ([\d]+))+))(?:\/<span .*?>([\d]+) (?:法力|神力|怒气|灵能|动力|魂能|动能|动能)<\/span>)?(\/(?:<a .*?>.*?<\/a>\s*(?:<img .*?>)*,)*<a .*?>.*?<\/a>\s*(?:<img .*?>)*)?(?:\/<span .*?>(?:<b>)?(?:-|\+)([\d]+) HP(?:<\/b>)?<\/span>)?(?:\/<span .*?>(?:<b>)?(?:-|\+)([\d]+) (?:法力|神力|怒气|灵能|动力|魂能|动能)(?:<\/b>)?<\/span>)?\)$/,
      ],
      Pattern_Active_HealBuffDetails: [
        /^(?:<span .*?>([\d]+) MP<\/span>)?(?:\/)?(?:((<a .*?>.*?<\/a>,)*<a .*?>.*?<\/a>)|(<a .*?>.*?<\/a>\s+(?:<img .*?>)+))?\)(?: on )?$/,
        /^(?:<span .*?>(?:-|\+)?([\d]+) (?:法力|神力|怒气|灵能|动力|魂能|动能)<\/span>)?(?:\/)?(?:((<a .*?>.*?<\/a>\s*(?:<img .*?>)*,)*<a .*?>.*?<\/a>\s*(?:<img .*?>)*))?\)(?:给)?$/,
      ],
      Pattern_Passive_Attacked: [
        /^(<span .*?>)?<a .*?>.*?<\/a>(?:<span .*?>([\d]+)<\/span>)?(?:<img .*?><\/span>)?\s*\((<a .*?>.*?<\/a>\/)?([\d]+)(?:\/<span .*?>([\d]+) MP<\/span>)?(\/(?:<a .*?>.*?<\/a>,)*<a .*?>.*?<\/a>)?\): <span class="([A-Za-z_]+)">[A-Za-z ]+<\/span>( - [A-Za-z ]+)?(<br>(?:<span .*?>)?(?:-)?[\d]+ (?:\[(?:\+|-)[\d]+\] )?[A-Za-z ]+(?:<img .*?><\/span>)?)*(?:<br><a .*?>.*?<\/a> -([\d]+) HP)?(?:(<br>)|$)/,
        /^(<span .*?>)?<a .*?>.*?<\/a>(?:<span .*?>([\d]+)<\/span>)?(?:<img .*?><\/span>)?\s*\((<a .*?>.*?<\/a>\/)?([\d]+)(?:\/<span .*?>([\d]+) (?:法力|神力|怒气|灵能|动力|魂能|动能)<\/span>)?(\/(?:<a .*?>.*?<\/a>\s*(?:<img .*?>)*,)*<a .*?>.*?<\/a>\s*(?:<img .*?>)*)?\): <span class="([A-Za-z_]+)">[^\u0000-\u007F]+<\/span>( - [^\u0000-\u007F]+ *)?(<br>(?:<span .*?>)?(?:-)?[\d]+ (?:\[(?:\+|-)[\d]+\] )?[^\u0000-\u007F]+(?:<img .*?><\/span>)?)*(?:<br><a .*?>.*?<\/a> (?:-|\+)([\d]+) HP)?(?:(<br>)|$)/,
      ],
      Pattern_BasicDamage: [/causes: <b>([\d]+)<\/b>/, /造成: <b>([\d]+)<\/b>/],
      Pattern_Damage: [
        /^((?:-)?[\d]+) (?:\[((?:\+|-)[\d]+)\] )?([A-Za-z][A-Za-z ]+[A-Za-z])$/,
        /^((?:-)?[\d]+) (?:\[((?:\+|-)[\d]+)\] )?([^\u0000-\u007F]+)$/,
      ],
      Pattern_Passive_Healed_Buffed: [
        /^(?:(<span .*?>)?<a .*?>.*?<\/a>(?:<span .*?>([\d]+)<\/span>)?(?:<img .*?><\/span>)?\s+|(themselves))(?: \+([\d]+) HP)?(?: \+([\d]+) MP)?(?:(<br>)|$)/,
        /^(?:(<span .*?>)?<a .*?>.*?<\/a>(?:<span .*?>([\d]+)<\/span>)?(?:<img .*?><\/span>)?\s+|(自己|自身))(?: \+([\d]+) HP)?(?: \+([\d]+) (?:法力|神力|怒气|灵能|动力|魂能|动能))?(?:(<br>)|$)/,
      ],
      Text_Button_ExtraStat: ["Extra Stat", "额外统计"],
      Text_Button_EntireStat: ["Entire Extra Stat", "全城额外统计"],
      Text_Button_Show: ["Show", "显示"],
      Text_Button_Hide: ["Hide", "隐藏"],
      Text_Button_ShowAll: ["Show All", "全部显示"],
      Text_Button_HideAll: ["Hide All", "全部隐藏"],
      Text_Button_Default: ["Default", "默认"],
      TextList_AttackType: [
        [
          "melee",
          "ranged",
          "spell",
          "social",
          "ambush",
          "trap",
          "nature",
          "disease",
          "detonate",
          "disarm trap",
          "magic projectile",
          "curse",
          "scare",
          "other",
        ],
        [
          "近战",
          "远程",
          "魔法",
          "心理",
          "偷袭",
          "陷阱",
          "自然",
          "疾病",
          "爆破",
          "解除陷阱",
          "魔法投射",
          "诅咒",
          "恐吓",
          "冲击",
          "魔法弹",
        ],
      ],
      TextList_HealType: [["heal"], ["治疗"]],
      TextList_BuffType: [["buff"], ["使用"]],
      TextList_WaitType: [["wait"], ["等待"]],
      TextList_HitType: [
        ["failed", "success", "good success", "critical success"],
        ["闪避", "普通", "重击", "致命一击"],
      ],
      Text_Loading: ["Loading", "载入中"],
      Text_Options: ["Options:", "选项:"],
      Text_DefaultMsg: [
        "All the data this script stored in your machine has been cleared.",
        "此脚本储存在你的机器上的所有数据已被清除。",
      ],
      Text_Table_Ini: ["Initiative", "先攻权"],
      Text_Table_Attack: ["Attack", "攻击骰"],
      Text_Table_Defence: ["Defence", "防御骰"],
      Text_Table_Damage: ["Damage", "造成伤害"],
      Text_Table_Damaged: ["Damage", "受到伤害"],
      Text_Table_DamageType: ["Damage Type", "伤害类型"],
      Text_Table_HealType: ["Heal Type", "治疗类型"],
      Text_Table_BuffType: ["Buff Type", "增益类型"],
      Text_Table_Heal: ["Healing By The Hero", "给予治疗"],
      Text_Table_Healed: ["Healing On The Hero", "接受治疗"],
      Text_Table_Buff: ["Buffing By The Hero", "给予增益"],
      Text_Table_Buffed: ["Buffing On The Hero", "接受增益"],
      Text_Table_Buffer: ["Buffing Provider", "提供者"],
      Text_Table_BuffeReceiver: ["Buffing Receiver", "提供给"],
      Text_Table_DamagedItems: ["Damaged Items", "物品损坏"],
      Text_Table_Char: ["Character", "人物"],
      Text_Table_AttackType: ["Attack type", "攻击类型"],
      Text_Table_DefenceType: ["Defence type", "防御类型"],
      Text_Table_Skill: ["Skill", "技能"],
      Text_Table_Item: ["Item", "物品"],
      Text_Table_Position: ["Pos", "位置"],
      Text_Table_AvgRoll: ["Average roll", "平均值"],
      Text_Table_MaxRoll: ["Max roll", "Max值"],
      Text_Table_MinRoll: ["Min roll", "Min值"],
      Text_Table_STDRoll: ["STD roll", "STD值"],
      Text_Table_Total: ["Total", "总数"],
      Text_Table_Times: ["Times", "次数"],
      Text_Table_RollList: ["Roll list", "数值列表"],
      Text_Table_DetailList: ["Detail list", "详细列表"],
      Text_Table_ItemDamagePoints: ["Damage Points", "损坏点数"],
      Text_Table_AllData: ["All", "全部"],
    };

    var Style = "div.stat_all {font-size:14px;} " +
        "div.stat_header {margin:1em auto 0.5em auto;} " +
        "span.stat_title {margin: auto 1em auto 0em; font-size:20px; font-weight:bold; color:#FFF;} span.clickable {cursor:pointer;} " +
        "span.pair_value {width:100%; font-size:12px;} span.pair_value span {width:50%; min-width:3em; text-align:right; color:#F8A400;} span.pair_value span + span {color:#00CC00;} " +
        "table.pair_hero {width:100%; font-size:12px;} table.pair_hero td {width:50%; min-width:3em; text-align:right; color:#00CC00;} table.pair_hero td + td {color:#F8A400;} " +
        "table[hide] {display:none;} " +
        "table.pair_value {width:100%;} table.pair_value td {width:50%; min-width:3em; text-align:right; color:#F8A400;} table.pair_value td + td {color:#00CC00;} " +
        "#myProgress {position: relative; width: 100%;  height: 3px; background-color: #ddd;} " +
        "#myBar { position: absolute;  width: 1%;  height: 100%;  background-color: #4CAF50;}";

    var Local;
    var Stat;
    var includeFilter = {
        Init: true,
        Attack: true,
        Defence: true,
        Damage: true,
        Damaged: true,
        Heal: true,
        Healed: true,
        Buff: true,
        Buffed: true,
        DamagedItems: true
    };
    var localInfo = document;
    var reportInfoDiv;
    var progress;
    var dataPage;
    var heroes = [];
    var heroLvMap = {};

    if (typeof GM_addStyle == "undefined") {
      function GM_addStyle(styles) {
        var S = document.createElement("style");
        S.type = "text/css";
        var T = "" + styles + "";
        T = document.createTextNode(T);
        S.appendChild(T);
        document.body.appendChild(S);
        return;
      }
    }

    var clickedButton;

    // FUNCTIONS //////////////////////////////////////////////////////////////////
    function CreateStat(node, infoNode, isExport) {
      // Stat initialization
      includeFilter.Init =
        document.getElementById("chk_Text_Table_Ini").checked;
      includeFilter.Attack = document.getElementById(
        "chk_Text_Table_Attack"
      ).checked;
      includeFilter.Defence = document.getElementById(
        "chk_Text_Table_Defence"
      ).checked;
      includeFilter.Damage = document.getElementById(
        "chk_Text_Table_Damage"
      ).checked;
      includeFilter.Damaged = document.getElementById(
        "chk_Text_Table_Damaged"
      ).checked;
      includeFilter.Heal = document.getElementById(
        "chk_Text_Table_Heal"
      ).checked;
      includeFilter.Healed = document.getElementById(
        "chk_Text_Table_Healed"
      ).checked;
      includeFilter.Buff = document.getElementById(
        "chk_Text_Table_Buff"
      ).checked;
      includeFilter.Buffed = document.getElementById(
        "chk_Text_Table_Buffed"
      ).checked;
      includeFilter.DamagedItems = document.getElementById(
        "chk_Text_Table_DamagedItems"
      ).checked;

      var theStat = new CStat(node, infoNode);

      if (includeFilter.Init)
        theStat.RegInfoList(new CILIni(CVLNumber, isExport));

      if (includeFilter.Attack)
        theStat.RegInfoList(new CILAttackRoll(CVLNumber, isExport));

      if (includeFilter.Defence)
        theStat.RegInfoList(new CILDefenceRoll(CVLNumber, isExport));

      if (includeFilter.Damage)
        theStat.RegInfoList(new CILDamage(CVLDamage, isExport));

      if (includeFilter.Damaged)
        theStat.RegInfoList(new CILDamaged(CVLDamage, isExport));

      if (includeFilter.Heal)
        theStat.RegInfoList(new CILHeal(CVLNumber, isExport));

      if (includeFilter.Healed)
        theStat.RegInfoList(new CILHealed(CVLNumber, isExport));

      if (includeFilter.Buff)
        theStat.RegInfoList(new CILBuff(CVLString, isExport));

      if (includeFilter.Buffed)
        theStat.RegInfoList(new CILBuffed(CVLString, isExport));

      if (includeFilter.DamagedItems)
        theStat.RegInfoList(new CILItemDamage(CVLNumber, isExport));
      return theStat;
    }

    function Main() {
      // Language selection
      Local = GetLocalContents(Contents);
      if (Local === null) return;
      //GM_log(Local);
      // Add CSS
      GM_addStyle(Style);

      // Add buttons
      var KeyButton = AddButtonBesideDisabledButton(
        [
          Local.OrigText_Button_DungeonDetails,
          Local.Text_Button_ExtraStat,
          OnCountStat,
        ],
        [
          Local.OrigText_Button_DungeonStat,
          Local.Text_Button_EntireStat,
          OnCountEntireStat,
        ],
        [
          Local.OrigText_Button_DuelDetails,
          Local.Text_Button_ExtraStat,
          OnCountStat,
        ]
      );
      if (KeyButton === null) return;
      KeyButton = addFilter(KeyButton);
      addStatusBar(KeyButton);
      dataPage = document.createElement("div");
      dataPage.innerHTML = "";
    }

    function addStatusBar(node) {
      var progressDiv = document.createElement("div");
      progressDiv.id = "myProgress";
      reportInfoDiv = document.createElement("div");
      reportInfoDiv.id = "myBar";
      progressDiv.appendChild(reportInfoDiv);
      node.parentNode.insertBefore(progressDiv, node.nextSibling);
    }
    function hideFilter() {
      // 隐藏复选项
      var AllFilter = document.getElementsByName("ExtraFilter");
      for (var i = 0, l = AllFilter.length; i < l; i++) {
        AllFilter[i].style.display = "none";
      }
    }
    function addFilter(KeyButton) {
      if (isaddFilter) {
        //首次执行插入复选项
        var newLine = document.createElement("br");
        newLine.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newLine,
          KeyButton.nextSibling
        );
        var newSpan = document.createElement("span");
        newSpan.innerHTML = "选择要统计的项目：";
        newSpan.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //先攻
        var newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        newCheckBox.setAttribute("name", "ExtraFilter");
        if (includeFilter.Init) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Ini";
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Ini;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //攻击骰
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.Attack) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Attack";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Attack;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //防御骰
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.Defence) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Defence";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Defence;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //造成伤害
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.Damage) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Damage";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Damage;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //受到伤害
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.Damaged) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Damaged";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Damaged;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //给予治疗
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.Heal) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Heal";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Heal;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //接受治疗
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.Healed) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Healed";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Healed;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //给予增益
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.Buff) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Buff";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Buff;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //接受增益
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.Buffed) newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_Buffed";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_Buffed;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );

        //物品损坏
        newCheckBox = document.createElement("input");
        newCheckBox.setAttribute("type", "checkbox");
        newCheckBox.setAttribute("class", "checkbox");
        newCheckBox.setAttribute("value", "");
        if (includeFilter.DamagedItems)
          newCheckBox.setAttribute("checked", "true");
        newCheckBox.id = "chk_Text_Table_DamagedItems";
        newCheckBox.setAttribute("name", "ExtraFilter");
        KeyButton = KeyButton.parentNode.insertBefore(
          newCheckBox,
          KeyButton.nextSibling
        );
        newSpan = document.createElement("label");
        newSpan.innerHTML = Local.Text_Table_DamagedItems;
        newSpan.setAttribute("name", "ExtraFilter");
        newSpan.setAttribute("for", newCheckBox.id);
        KeyButton = KeyButton.parentNode.insertBefore(
          newSpan,
          KeyButton.nextSibling
        );
        isaddFilter = false;
        return KeyButton;
      } else {
        //多次执行重新显示复选项
        var AllFilter = document.getElementsByName("ExtraFilter");
        for (var i = 0, l = AllFilter.length; i < l; i++) {
          AllFilter[i].style.display = "";
        }
        return KeyButton;
      }
    }

    // It will only add the first eligible button
    // return: the node of the first eligible disabled button, or null if didn't find anyone
    function AddButtonBesideDisabledButton(/* [DisabledButtonText, ButtonText, ClickEvent], [...], ... */) {
      var allInputs = document.getElementsByTagName("input");
      for (var i = 0; i < allInputs.length; ++i) {
        if (allInputs[i].className == "button_disabled") {
          for (var j = 0; j < arguments.length; ++j) {
            if (allInputs[i].getAttribute("value") == arguments[j][0]) {
              return AddButton(allInputs[i], arguments[j][1], arguments[j][2]);
            }
          }
        }
      }
      return null;
    }

    // Add a button to the end of the given node's parent node
    function AddButton(SiblingNode, Value, OnClick) {
      var newButton = document.createElement("input");
      newButton.setAttribute("type", "button");
      newButton.setAttribute("class", "button");
      newButton.setAttribute("value", Value);
      newButton.addEventListener("click", OnClick, false);
      var newBlank = document.createTextNode("            ");
      SiblingNode.parentNode.appendChild(newBlank);
      SiblingNode.parentNode.appendChild(newButton);
      return newButton;
    }

    function OnCountStat() {
      try {
        clickedButton = this;
        if (this.className == "button_disabled") return;
        else this.className = "button_disabled";
        var InfoDiv = document.createElement("div");
        InfoDiv.id = "report_info";
        Stat = CreateStat(node_after(this.parentNode), InfoDiv, false);
        reportInfoDiv.style.width = "1%";
        Stat.nTotalPages = 1;
        //Stat.nReadPages = 1;
        Stat.iscurrentPage = true;
        Stat.ShowProgress();
        if (progress) clearInterval(progress);
        progress = setInterval(Stat.ShowProgress.bind(Stat), 1);
        ReadPage(document, true);
      } catch (e) {
        alert("OnCountStat(): " + e);
      }
    }

    function OnCountEntireStat() {
      try {
        clickedButton = this;
        if (this.className == "button_disabled") return;
        else this.className = "button_disabled";
        var InfoDiv = document.createElement("div");
        InfoDiv.id = "report_Entire_info";
        Stat = CreateStat(node_after(this.parentNode), InfoDiv, false);
        reportInfoDiv.style.width = "1%";
        CountEntireStat();
      } catch (e) {
        alert("OnCountEntireStat(): " + e);
      }
    }

    function CountEntireStat() {
      var nCurrRepId = GetHiddenInfo(document, "report_id[0]", "");
      var nMaxLevel = (Stat.nTotalPages = GetStatPageMaxLevel(document, 1));
      Stat.ShowProgress();
      if (progress) clearInterval(progress);
      progress = setInterval(Stat.ShowProgress.bind(Stat), 1);
      for (var CurrLevel = 1; CurrLevel <= nMaxLevel; ++CurrLevel)
        GetPage(nCurrRepId, CurrLevel, 1, true);

      //Stat.ShowProgress();
    }

    function GetPage(nRepId, nLevel, nRepPage, bFirstRead) {
      var XmlHttp = new XMLHttpRequest();

      XmlHttp.onreadystatechange = function () {
        try {
          if (XmlHttp.readyState == 4 && XmlHttp.status == 200) {
            dataPage.innerHTML = XmlHttp.responseText;
            //Stat.nReadPages = nRepPage;
            Stat.iscurrentPage = false;
            ReadPage(dataPage, bFirstRead);
          }
        } catch (e) {
          alert("XMLHttpRequest.onreadystatechange(): " + e);
        }
      };

      var URL =
        location.protocol +
        "//" +
        location.host +
        "/wod/spiel/dungeon/report.php" +
        "?cur_rep_id=" +
        nRepId +
        "&gruppe_id=&current_level=" +
        nLevel +
        "&REPORT_PAGE=" +
        nRepPage +
        "&IS_POPUP=1";
      Stat.ShowProgress();
      XmlHttp.open("GET", URL, true);
      XmlHttp.send(null);
    }

    function ReadPage(page, bFirstRead) {
      var ret = GetRepPageInfo(page, [1, 1]);
      var nCurrRepPage = ret[0];
      var nMaxRepPage = ret[1];
      if (bFirstRead && nMaxRepPage > 1) {
        var nRepId = GetHiddenInfo(page, "report_id[0]", "");
        var nLevel = GetHiddenInfo(page, "current_level", 1);

        Stat.nTotalPages += nMaxRepPage - 1;
        for (var i = 1; i <= nMaxRepPage; ++i) {
          Stat.ShowProgress();
          if (i !== nCurrRepPage) GetPage(nRepId, nLevel, i, false);
        }
      }
      Stat.nReadPages++;
      Stat.ShowProgress();
      CountStat(page, nCurrRepPage === nMaxRepPage);
      if (Stat.nReadPages >= Stat.nTotalPages) {
        Stat.Show(false);
        if (clickedButton) clickedButton.className = "button";
      }
    }

    function GetHiddenInfo(page, InfoName, DefaultValue) {
      var allInputs = page.getElementsByTagName("input");
      for (var i = 0; i < allInputs.length; ++i) {
        if (
          allInputs[i].getAttribute("type") == "hidden" &&
          allInputs[i].name == InfoName
        )
          return allInputs[i].value;
      }
      return DefaultValue;
    }

    function GetStatPageMaxLevel(page, DefaultValue) {
      var allTds = page.getElementsByTagName("td");
      for (var i = 0; i < allTds.length; ++i) {
        if (first_child(allTds[i].parentNode) != allTds[i]) continue;
        var LevelNode = first_child(allTds[i]);
        if (
          LevelNode != null &&
          LevelNode.nodeType == Node.TEXT_NODE &&
          LevelNode.data == Local.OrigText_Level
        ) {
          var Patt_Level = /^(?:<span .*?>)?(?:[\d]+)\/([\d]+)(?:<\/span>)?$/;
          var result = Patt_Level.exec(node_after(allTds[i]).innerHTML);
          if (result === null) return DefaultValue;
          return Number(result[1]);
        }
      }
      return DefaultValue;
    }

    // return: an array, [0]: nCurrRepPage, [1]: nMaxRepPage
    function GetRepPageInfo(page, DefaultValue) {
      var ret = [DefaultValue[0], DefaultValue[1]];
      var allInputs = page.getElementsByTagName("input");
      var IndexPatt = /\D*([\d]+)\D*/;
      var pages = [];
      for (var i = 0; i < allInputs.length; ++i) {
        var theInput = allInputs[i];
        if (theInput.className == "paginator_selected clickable") {
          var Result = IndexPatt.exec(theInput.value);
          if (Result && Result[1]) {
            pages.push(Number(Result[1]));
            ret[0] = Number(Result[1]);
          }
        }
      }
      allInputs = page.getElementsByTagName("a");
      for (var i = 0; i < allInputs.length; ++i) {
        var theInput = allInputs[i];
        if (theInput.className == "paginator") {
          var Result = IndexPatt.exec(theInput.textContent);
          if (Result && Result[1]) pages.push(Number(Result[1]));
        }
      }
      if (pages.length > 0) ret[1] = Math.max.apply(Math, pages);

      return ret;
    }

    //===============================================================================================
    // code for save report only.
    //===============================================================================================

    var StatEntire;
    var StatEntireDiv;

    function es_addStyle(page, styles) {
      var S = document.createElement("style");
      S.type = "text/css";
      var T = "" + styles + "";
      T = document.createTextNode(T);
      S.appendChild(T);
      page.appendChild(S);
      return;
    }

    function InsertButton(Node, Value, OnClick) {
      var newButton = document.createElement("input");
      newButton.setAttribute("type", "button");
      newButton.setAttribute("class", "button");
      newButton.setAttribute("value", Value);
      newButton.addEventListener("click", OnClick, false);
      Node.parentNode.insertBefore(newButton, Node.nextSibling);
    }

    function changeAllSelection(select) {
      var allCheckbox = document.getElementsByTagName("input");
      for (var i = 0; i < allCheckbox.length; ++i) {
        var theCheckbox = allCheckbox[i];
        if (
          rValue.Pattern_checkboxName.test(theCheckbox.getAttribute("name"))
        ) {
          theCheckbox.checked = select;
        }
      }
    }

    function selectAll() {
      if (!gIsWorking) changeAllSelection(true);
    }

    function cleartAll() {
      if (!gIsWorking) changeAllSelection(false);
    }

    function getTimeStrFromWodTimeStr(report) {
      if (report == null) {
        return;
      }
      let timestr = $(report.getAttribute("reporttime")).text();
      const today = dayjs();
      if (timestr.includes("昨天")) {
        timestr = timestr.replace(
          "昨天",
          today.subtract(1, "d").format("YYYY年MM月DD日")
        );
      } else if (timestr.includes("今天")) {
        timestr = timestr.replace("今天", today.format("YYYY年MM月DD日"));
      } else if (timestr.includes("明天")) {
        timestr = timestr.replace(
          "明天",
          today.add(1, "d").format("YYYY年MM月DD日")
        );
      }
      return timestr;
    }

    function parseTime(timeStr) {
      timeStr = timeStr.replace("年", "-").replace("月", "-").replace("日", "");
      return dayjs(timeStr, "YYYY-MM-DD HH:mm");
    }

    function getTimeFromWodTimeStr(report) {
      const timestr = getTimeStrFromWodTimeStr(report);
      return parseTime(timestr);
    }

    function formatTime(date, format) {
      return date.format(format);
    }

    function formatTime4report(report, format) {
      return formatTime(getTimeFromWodTimeStr(report), format);
    }

    function getOverviewDiv() {
      let $overviewDiv = $("div#overview");
      if (!$overviewDiv.length) {
        $("body:first").append(
          $(
            '<div style="visibility: hidden;"><div id="overview"><div id="progressbar"><div class="progress-label">初始化...</div></div><div id="detailMsg"></div></div></div>'
          )
        );
        $overviewDiv = $("div#overview");
      }
      return $overviewDiv;
    }

    function exportLog() {
      if (gIsWorking && !DEBUG) return;
      gIsWorking = true;
      // 获取前缀
      var prefix = document.getElementById("prefix").value;
      var timeFormatSuffix = document.getElementById("suffix").value;
      var includeCheckbox = document.getElementById(rValue.Chk_includeData);
      var singleCheckbox = document.getElementById(rValue.Chk_single);
      var withLvCheckbox = document.getElementById(rValue.Chk_withLv);
      var singleCheck = singleCheckbox.checked;
      includeData = includeCheckbox.checked;
      gWithLv = withLvCheckbox.checked;
      var allCheckbox = document.getElementsByTagName("input");

      // 单文件导出走特殊流程
      if (singleCheck) {
        gIsWorking = false;
        let $overviewDiv = getOverviewDiv();
        let $processbar = $overviewDiv.find("#progressbar");
        let $processLabel = $overviewDiv.find("#progressbar .progress-label");
        let $detailMsg = $overviewDiv.find("#detailMsg");
        $overviewDiv.dialog({
          autoOpen: true, // 是否自动弹出窗口
          modal: true, // 设置为模态对话框
          resizable: true,
          width: 540, //弹出框宽度
          height: 620, //弹出框高度
          title: "导出进度", //弹出框标题
          position: { my: "center", at: "center", of: window }, //窗口显示的位置
          buttons: {
            关闭: function () {
              $(this).dialog("close");
            },
          },
        });
        $processbar.progressbar({
          value: false,
          change: function () {
            $processLabel.text($processbar.progressbar("value") + "%");
          },
          complete: function () {
            $processLabel.text("任务已全部完成!");
          },
        });
        let total = 0;
        let remain = 0;
        // 设置定时任务，每秒检测导出进度
        var interval = setInterval(function () {
          $detailMsg.html($("#infoDiv").html());
          if (!gIsWorking) {
            allCheckbox = document.getElementsByTagName("input");
            allCheckbox = Array.prototype.slice
              .call(allCheckbox)
              .filter(
                (c) =>
                  rValue.Pattern_checkboxName.test(c.getAttribute("name")) &&
                  c.checked
              );

            if (allCheckbox.length) {
              gIsWorking = true;
              if (total < allCheckbox.length) total = allCheckbox.length;
              remain = allCheckbox.length;
              var report = allCheckbox[0];
              gSelectedReport = [report];
              heroes = [];
              heroLvMap = {};
              default_gTitle =
                prefix +
                (gWithLv ? rValue.Holder_Lv : "") +
                report
                  .getAttribute("reportname")
                  .replace(/<[^>]+>/g, "")
                  .replace(/[ ]|[\r\n\t]/g, "");
              if (timeFormatSuffix) {
                var firstTimeStr = formatTime4report(report, timeFormatSuffix);
                default_gTitle += firstTimeStr;
              }
              gTitle = default_gTitle;
              // 更新进度
              $processbar.progressbar(
                "value",
                parseFloat((((total - remain) * 100) / total).toFixed(0))
              );

              gZip = new JSZip();
              headDiv = document
                .getElementsByTagName("head")[0]
                .cloneNode(true);
              handleHead(headDiv);

              gIndexDiv = gIndexTemplateDiv.cloneNode(true);
              var table = document.createElement("div");
              gCurrentReport = gSelectedReport[0];
              if (includeData) {
                StatEntireDiv = document.createElement("div");
                var EntireInfoDiv = document.createElement("div");
                EntireInfoDiv.id = "report_entire_info";
                StatEntire = CreateStat(StatEntireDiv, EntireInfoDiv, true);
                StatEntire.iscurrentPage = false;
              }
              if (!isDuel) GetLevelPage(1, 1);
              else GetDuelPage();
            } else {
              clearInterval(interval);
              $overviewDiv.dialog("close");
            }
          }
        }, 1000);
        return;
      }

      gSelectedReport = [];
      for (var i = 0; i < allCheckbox.length; ++i) {
        var theCheckbox = allCheckbox[i];
        if (
          rValue.Pattern_checkboxName.test(theCheckbox.getAttribute("name"))
        ) {
          if (theCheckbox.checked) {
            gSelectedReport.push(theCheckbox);
            default_gTitle =
              prefix +
              (gWithLv ? rValue.Holder_Lv : "") +
              theCheckbox
                .getAttribute("reportname")
                .replace(/<[^>]+>/g, "")
                .replace(/[ ]|[\r\n\t]/g, "");
            // 获取前缀和最下面勾选的战报名字作为默认,正则去除html标签，空格，换行，制表符
          }
        }
      }

      if (gSelectedReport.length > 0) {
        heroes = [];
        heroLvMap = {};
        // 处理后缀
        if (timeFormatSuffix) {
          var firstReport = gSelectedReport[0];
          var lastReport = gSelectedReport[gSelectedReport.length - 1];
          var firstTimeStr = formatTime4report(firstReport, timeFormatSuffix);
          var lastTimeStr = formatTime4report(lastReport, timeFormatSuffix);
          default_gTitle += firstTimeStr;
          if (firstReport != lastReport && firstTimeStr != lastTimeStr) {
            default_gTitle += "-" + lastTimeStr;
          }
        }

        gTitle = window.prompt("输入战报名称", default_gTitle);
        if (gTitle != null) {
          gZip = new JSZip();
          headDiv = document.getElementsByTagName("head")[0].cloneNode(true);
          handleHead(headDiv);

          gIndexDiv = gIndexTemplateDiv.cloneNode(true);
          var table = document.createElement("div");
          gCurrentReport = gSelectedReport[0];
          if (includeData) {
            StatEntireDiv = document.createElement("div");
            var EntireInfoDiv = document.createElement("div");
            EntireInfoDiv.id = "report_entire_info";
            StatEntire = CreateStat(StatEntireDiv, EntireInfoDiv, true);
            StatEntire.iscurrentPage = false;
          }
          if (!isDuel) GetLevelPage(1, 1);
          else GetDuelPage();
        } else gIsWorking = false;
      } else {
        window.alert("没有选择任何战报");
        gIsWorking = false;
      }
    }

    function GetDuelPage() {
      var XmlHttp = new XMLHttpRequest();

      XmlHttp.onreadystatechange = function () {
        try {
          if (XmlHttp.readyState == 4 && XmlHttp.status == 200) {
            gResponseDiv.innerHTML = XmlHttp.responseText;
            ReadDuelPage();
          }
        } catch (e) {
          alert("GetLevelPage XMLHttpRequest.onreadystatechange(): " + e);
        }
      };

      XmlHttp.open(
        "GET",
        gCurrentReport.getAttribute("href") + "&IS_POPUP=1&current_view[1]",
        true
      );
      XmlHttp.send(null);
    }

    function ReadDuelPage() {
      var rows = gIndexDiv.getElementsByTagName("tr");
      var row = rows[rows.length - 1];
      row.parentNode.appendChild(row.cloneNode(true));

      row.setAttribute("class", gIndexRowclass);
      if (gIndexRowclass == "row0") gIndexRowclass = "row1";
      else gIndexRowclass = "row0";
      row.cells[0].innerHTML = replaceDate(gCurrentReport.getAttribute("c0"));
      row.cells[1].innerHTML = gCurrentReport.getAttribute("c1");
      row.cells[2].innerHTML = gCurrentReport.getAttribute("reporttime");
      var cell = row.cells[3];

      cell.innerHTML = "";
      addIndexNewButton(
        cell,
        "细节",
        "document.location.href='" + gCurrentReport.value + "/detail.html';"
      );

      if (includeData) {
        var EntireInfoDiv = document.createElement("div");
        EntireInfoDiv.id = "report_entire_info";
        Stat = CreateStat(
          node_before(gResponseDiv.getElementsByTagName("h2")[0].nextSibling),
          EntireInfoDiv,
          true
        );
        Stat.nTotalPages = 1;
        Stat.iscurrentPage = true;
      }
      multiPageDiv.push(gResponseDiv);

      infodiv.innerHTML = "保存决斗：&nbsp;" + gTitle;

      if (includeData) CountStat(gResponseDiv, true, true);

      for (var i = 0; i < multiPageDiv.length; i++) {
        var thepage = multiPageDiv[i];
        var theFileName = gCurrentReport.value + "/detail.html";
        if (i > 0) {
          theFileName = gCurrentReport.value + "/detail_" + (i + 1) + ".html";
          Stat.iscurrentPage = false;
        }
        if (includeData) {
          Stat.setNode(
            node_before(thepage.getElementsByTagName("h1")[0].nextSibling)
          );
          Stat.Show(true);
        }
        gZip.file(theFileName, handlePage(thepage, null));
      }
      multiPageDiv = [];
      gCurrentReport.checked = false;
      for (var i = 0; i < gSelectedReport.length; ++i) {
        var theCheckbox = gSelectedReport[i];
        if (theCheckbox.checked) {
          gCurrentReport = theCheckbox;
          if (includeData) {
            StatEntireDiv = document.createElement("div");
            var EntireInfoDiv = document.createElement("div");
            EntireInfoDiv.id = "report_entire_info";
            StatEntire = CreateStat(StatEntireDiv, EntireInfoDiv, true);
            StatEntire.iscurrentPage = false;
          }
          GetDuelPage();
          return;
        }
      }

      handleIndexPage();
      infodiv.innerHTML =
        "保存决斗战报：&nbsp;" +
        gTitle +
        "<br/>" +
        gCurrentReport.getAttribute("title");
      var indexStr =
        "<html>\n" +
        headDiv.outerHTML +
        "\n<body>\n<h1>" +
        gTitle +
        "</h1><br/>\n" +
        gIndexDiv.innerHTML +
        "\n</body>\n</html>";
      gZip.file("index.html", indexStr);
      gZip
        .generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 7 },
        })
        .then(function (content) {
          //saveAs(content, "wodlog" + '_' + Math.random().toString(36).substr(2, 9) + ".zip");
          saveAs(content, "wodlog" + "_" + gTitle + ".zip");
        });
      // alert("zip文件生成完毕");
      console.log("zip文件生成完毕");
      infodiv.innerHTML = "";
      gResponseDiv.innerHTML = "";
      gIsWorking = false;
    }

    function GetLevelPage(nLevel, nRepPage) {
      var XmlHttp = new XMLHttpRequest();

      XmlHttp.onreadystatechange = function () {
        try {
          if (XmlHttp.readyState == 4 && XmlHttp.status == 200) {
            gResponseDiv.innerHTML = XmlHttp.responseText;
            ReadLevelPage(nLevel, nRepPage);
          }
        } catch (e) {
          alert("GetLevelPage XMLHttpRequest.onreadystatechange(): " + e);
        }
      };

      var URL =
        location.protocol +
        "//" +
        location.host +
        "/wod/spiel/dungeon/report.php" +
        "?cur_rep_id=" +
        gCurrentReport.value +
        "&gruppe_id=&current_level=" +
        nLevel +
        "&REPORT_PAGE=" +
        nRepPage +
        "&IS_POPUP=1";

      XmlHttp.open("GET", URL, true);
      XmlHttp.send(null);
    }

    function ReadLevelPage(nLevel, nRepPage) {
      if (nLevel == 1) {
        gCurrentReport.setAttribute("maxLevel", GetMaxLevel(gResponseDiv, 1));
        var rows = gIndexDiv.getElementsByTagName("tr");
        var row = rows[rows.length - 1];
        row.parentNode.appendChild(row.cloneNode(true));

        row.setAttribute("class", gIndexRowclass);
        if (gIndexRowclass == "row0") gIndexRowclass = "row1";
        else gIndexRowclass = "row0";
        row.cells[0].innerHTML = replaceDate(
          gCurrentReport.getAttribute("reporttime")
        );
        row.cells[1].innerHTML = gCurrentReport.getAttribute("reportname");
        var cell = row.cells[2];

        cell.innerHTML = "";
        addIndexNewButton(
          cell,
          "统计表",
          "document.location.href='" +
            gCurrentReport.value +
            "/statistics.html';"
        );
        addIndexNewButton(
          cell,
          "获得物品",
          "document.location.href='" + gCurrentReport.value + "/items.html';"
        );
        for (var i = 1; i <= gCurrentReport.getAttribute("maxLevel"); i++) {
          addIndexNewButton(
            cell,
            "层 " + i,
            "document.location.href='" +
              gCurrentReport.value +
              "/level" +
              i +
              ".html';"
          );
        }
      }
      var ret = GetRepPageInfo(gResponseDiv, [1, 1]);
      var nCurrRepPage = ret[0];
      var nMaxRepPage = ret[1];

      if (includeData && nCurrRepPage == 1) {
        var EntireInfoDiv = document.createElement("div");
        EntireInfoDiv.id = "report_entire_info";
        Stat = CreateStat(
          node_before(gResponseDiv.getElementsByTagName("h2")[0].nextSibling),
          EntireInfoDiv,
          true
        );
        Stat.nTotalPages = nMaxRepPage;
        Stat.iscurrentPage = true;
      }
      if (nMaxRepPage > 1) {
        var copyDiv = document.createElement("div");
        copyDiv.innerHTML = gResponseDiv.innerHTML;
        multiPageDiv.push(copyDiv);
        if (includeData) Stat.iscurrentPage = false;
      } else multiPageDiv.push(gResponseDiv);

      var maxLevel = gCurrentReport.getAttribute("maxLevel");
      infodiv.innerHTML =
        "保存战报：&nbsp;" +
        gTitle +
        "<br/>" +
        gCurrentReport.getAttribute("title") +
        " - 第 " +
        nLevel +
        "/" +
        maxLevel +
        " 层详细资料";

      if (includeData)
        CountStat(gResponseDiv, nCurrRepPage === nMaxRepPage, true);
      if (nCurrRepPage === nMaxRepPage) {
        for (var i = 0; i < multiPageDiv.length; i++) {
          var thepage = multiPageDiv[i];
          var theFileName = gCurrentReport.value + "/level" + nLevel + ".html";
          if (i > 0) {
            theFileName =
              gCurrentReport.value +
              "/level" +
              nLevel +
              "_" +
              (i + 1) +
              ".html";
            if (includeData) Stat.iscurrentPage = false;
          }
          if (includeData) {
            Stat.setNode(
              node_before(thepage.getElementsByTagName("h2")[0].nextSibling)
            );
            Stat.Show(true);
          }
          gZip.file(theFileName, handlePage(thepage, nLevel));
        }
        multiPageDiv = [];
      }

      if (nCurrRepPage < nMaxRepPage) GetLevelPage(nLevel, nCurrRepPage + 1);
      else if (nLevel < maxLevel) GetLevelPage(nLevel + 1, 1);
      else GetStatPage();
    }

    function GetStatPage() {
      var queryString =
        $("form[name='the_form']").formSerialize() +
        "&IS_POPUP=1&" +
        gCurrentReport.getAttribute(rValue.Text_Stat) +
        "=" +
        rValue.Text_Stat;
      var XmlHttp = new XMLHttpRequest();

      XmlHttp.onreadystatechange = function () {
        try {
          if (XmlHttp.readyState == 4 && XmlHttp.status == 200) {
            gResponseDiv.innerHTML = XmlHttp.responseText;
            infodiv.innerHTML =
              "保存战报：&nbsp;" +
              gTitle +
              "<br/>" +
              gCurrentReport.getAttribute("title") +
              " - 统计表";
            if (includeData) {
              StatEntire.setNode(
                node_before(
                  gResponseDiv.getElementsByTagName("h2")[0].nextSibling
                )
              );
              StatEntire.Show(true);
            }
            gZip.file(
              gCurrentReport.value + "/statistics.html",
              handlePage(gResponseDiv)
            );
            GetItemPage();
          }
        } catch (e) {
          alert("GetItemPage XMLHttpRequest.onreadystatechange(): " + e);
        }
      };

      var URL =
        location.protocol +
        "//" +
        location.host +
        "/wod/spiel/dungeon/report.php";

      XmlHttp.open("POST", URL, true);
      XmlHttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      // XmlHttp.setRequestHeader("Content-length", queryString.length);
      // XmlHttp.setRequestHeader("Connection", "close");
      XmlHttp.send(queryString);
    }

    function getAvgLvTip() {
      if (!heroes.length) {
        return "";
      }
      let finalMap = {};
      for (let heroName of heroes) {
        heroLvMap[heroName] &&
          (finalMap[heroName] = parseInt(heroLvMap[heroName]));
      }
      let avgLv =
        Math.round(
          (100 * Object.values(finalMap).reduce((a, b) => a + b)) /
            Object.keys(finalMap).length
        ) / 100;
      return "「" + avgLv.toFixed(2) + "级」";
    }

    function GetItemPage() {
      var queryString =
        $("form[name='the_form']").formSerialize() +
        "&IS_POPUP=1&" +
        gCurrentReport.getAttribute(rValue.Text_Item) +
        "=" +
        rValue.Text_Item;
      var XmlHttp = new XMLHttpRequest();

      XmlHttp.onreadystatechange = function () {
        try {
          if (XmlHttp.readyState == 4 && XmlHttp.status == 200) {
            gResponseDiv.innerHTML = XmlHttp.responseText;
            infodiv.innerHTML =
              "保存战报：&nbsp;" +
              gTitle +
              "<br/>" +
              gCurrentReport.getAttribute("title") +
              " - 获得物品";
            gZip.file(
              gCurrentReport.value + "/items.html",
              handlePage(gResponseDiv)
            );
            gCurrentReport.checked = false;
            for (var i = 0; i < gSelectedReport.length; ++i) {
              var theCheckbox = gSelectedReport[i];
              if (theCheckbox.checked) {
                gCurrentReport = theCheckbox;
                if (includeData) {
                  StatEntireDiv = document.createElement("div");
                  var EntireInfoDiv = document.createElement("div");
                  EntireInfoDiv.id = "report_entire_info";
                  StatEntire = CreateStat(StatEntireDiv, EntireInfoDiv, true);
                  StatEntire.iscurrentPage = false;
                }
                GetLevelPage(1, 1);
                return;
              }
            }
            handleIndexPage();

            // 导出前把平均等级替换上去
            if (gWithLv) {
              gTitle = gTitle.replace(rValue.Holder_Lv, getAvgLvTip());
            }
            infodiv.innerHTML =
              "保存战报：&nbsp;" + gTitle + "<br/>" + "生成Zip文件";
            var indexStr =
              "<html>\n" +
              headDiv.outerHTML +
              "\n<body>\n<h1>" +
              gTitle +
              "</h1><br/>\n" +
              gIndexDiv.innerHTML +
              "\n</body>\n</html>";
            gZip.file("index.html", indexStr);

            gZip
              .generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 7 },
              })
              .then(function (content) {
                //saveAs(content, "wodlog" + '_' + Math.random().toString(36).substr(2, 9) + ".zip");
                saveAs(content, "wodlog" + "_" + gTitle + ".zip");
                gIsWorking = false;
              });
            // alert("zip文件生成完毕");
            console.log("zip文件生成完毕");
            infodiv.innerHTML = "";
            gResponseDiv.innerHTML = "";
          }
        } catch (e) {
          alert("GetItemPage XMLHttpRequest.onreadystatechange(): " + e);
        }
      };

      var URL =
        location.protocol +
        "//" +
        location.host +
        "/wod/spiel/dungeon/report.php";

      XmlHttp.open("POST", URL, true);
      XmlHttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      // XmlHttp.setRequestHeader("Content-length", queryString.length);
      // XmlHttp.setRequestHeader("Connection", "close");
      XmlHttp.send(queryString);
    }

    function GetMaxLevel(page, DefaultValue) {
      var ret = DefaultValue;

      var allInputs = page.getElementsByTagName("input");
      for (var i = 0; i < allInputs.length; ++i) {
        var name = allInputs[i].getAttribute("name");

        if (rValue.Pattern_level.test(name)) {
          var levelnumber = Number(rValue.Pattern_idNumber.exec(name)[1]);
          if (levelnumber > ret) ret = levelnumber;
        }
      }
      return ret;
    }

    function handlePage(page, nLevel) {
      if (gWithLv) {
        let $page = $(page);

        if ($page.find('h1:contains("战斗统计: ")').length) {
          let $heroThs = $page.find(
            "h2 ~ table.content_table table tr:first th:gt(0)"
          );
          heroes = [];
          $heroThs.each(function (i, el) {
            heroes.push($(el).text().trim());
          });
          console.log(heroes);
        }

        let $heroLvTrs = $page.find("table.rep_status_table tr:not(:first)");
        if ($heroLvTrs.length) {
          heroLvMap = {};
          $heroLvTrs.each(function (i, el) {
            let heroName = $(el).find("td:eq(1)").text().trim();
            let heroLv = parseInt($(el).find("td:eq(2)").text().trim());
            if (heroName && heroLv) {
              heroLvMap[heroName] = parseInt(heroLv);
            }
          });
          console.log(heroLvMap);
        }
      }

      var thepage = page.getElementsByTagName("form")[0];
      var h2 = thepage.getElementsByTagName("h2")[0];
      if (h2) {
        h2.innerHTML = replaceDate(h2.innerHTML);
      }

      //removePageInput(thepage);
      replaceURL(thepage, "link", "href");
      replaceURL(thepage, "script", "src");
      replaceURL(thepage, "img", "src");
      replaceURL(thepage, "a", "href", "#");
      replaceButton(thepage);
      if (nLevel) replaceLevelPage(thepage, nLevel);
      return (
        "<html>\n" +
        headDiv.outerHTML +
        "\n<body>\n" +
        replaceOther(thepage.outerHTML) +
        "\n</body>\n</html>"
      );
    }

    function handleHead(head) {
      if (gTitle == null) gTitle = default_gTitle;
      head.getElementsByTagName("title")[0].innerHTML = gTitle.replace(
        rValue.Holder_Lv,
        ""
      );

      replaceURL(head, "link", "href");

      var bodyScript = document
        .getElementsByTagName("body")[0]
        .cloneNode(true)
        .getElementsByTagName("script");
      for (var i = 0; i < bodyScript.length; i++)
        head.appendChild(bodyScript[i]);
      var scripts = head.getElementsByTagName("script");
      for (var i = scripts.length - 1; i >= 0; i--) {
        script = scripts[i];
        handleScript(script);
      }
      replaceURL(head, "script", "src");

      var metas = head.getElementsByTagName("meta");
      for (var i = metas.length - 1; i >= 0; i--) {
        var meta = metas[i];
        if (!meta.httpEquiv) meta.parentNode.removeChild(meta);
      }
      if (includeData) es_addStyle(head, Style);
      head.innerHTML = head.innerHTML + "\n";
      return head;
    }

    function handleScript(script) {
      var patten = /wod_standard.js|wodtooltip.js/;
      var scriptPatten = /(wodToolTipInit\(.*\);)\s*(wodInitialize\([^;]*\);)/;
      if (script.src) {
        if (!patten.test(script.src)) script.parentNode.removeChild(script);
      } else if (script.firstChild) {
        var scriptStr = script.firstChild.data;
        var result = scriptPatten.exec(scriptStr);
        if (result != null)
          if (result[1] && result[2])
            scriptStr =
              "window.onload = function(e){" + result[1] + result[2] + "}";

        scriptStr = scriptStr
          .replace(
            /wodInitialize\(''/g,
            "wodInitialize('" + location.host + "'"
          )
          .replace("'0'", "'1'");
        scriptStr +=
          '\nfunction o(t,n){ \n var url="' +
          location.origin +
          '/wod/spiel/";\n';
        scriptStr += 'if(t=="n"){url += "help/npc"}\n';
        scriptStr += 'if(t=="s"){url += "hero/skill"}\n';
        scriptStr += 'if(t=="i"){url += "hero/item"}\n';
        scriptStr += 'return wo(url + ".php?name=" + n + "&IS_POPUP=1");}\n';

        if (includeData) {
          scriptStr += "var CTable=function(){};\n";
          scriptStr +=
            "CTable.GetNumber = " + CTable.GetNumber.toString() + "\n";
          scriptStr += "CompareString = " + CompareString.toString() + "\n";
          scriptStr += "ct = " + CTable.OnClickTitle.toString() + "\n";
          scriptStr += "cf = " + CTable.OnChangeFilter.toString() + "\n";
          scriptStr += "co = " + CTable.OnChangeOrder.toString() + "\n";
          scriptStr += "sd = " + CTable.OnShowDetail.toString() + "\n";
          scriptStr += "st = " + CStat.OnTabClick.toString() + "\n";
        }
        script.firstChild.data = scriptStr;
      }
    }
    function removePageInput(page) {
      var inputs = page.getElementsByTagName("input");
      for (var i = inputs.length - 1; i >= 0; i--) {
        var theInput = inputs[i];
        if (theInput.type == "hidden") {
          theInput.parentNode.removeChild(theInput);
          break;
        }
      }
      return page;
    }

    function replaceURL(page, tag, attr, value) {
      var test_pattern = /^\//;
      var test1_pattern = /^#/;
      var onclick_pattern = /([^\/]*)\.php\?name=([^&]*)/;
      var allLink = page.getElementsByTagName(tag);
      var path = location.origin + location.pathname;
      var m = path.match(/(.*)[\/\\]([^\/\\]+)\.\w+$/);

      for (var i = 0; i < allLink.length; i++) {
        var link = allLink[i];
        if (link.hasAttribute(attr)) {
          var uri = link.getAttribute(attr);
          if (value) {
            if (!test1_pattern.test(uri)) link.setAttribute(attr, value);
            if (link.hasAttribute("onclick")) {
              var result = onclick_pattern.exec(link.getAttribute("onclick"));
              if (result && result[1] && result[2])
                link.setAttribute(
                  "onclick",
                  "return o('" +
                    result[1].substr(0, 1) +
                    "','" +
                    result[2] +
                    "');"
                );
            }
          } else {
            if (!rValue.pattern_http.test(uri)) {
              if (test_pattern.test(uri)) {
                link.setAttribute(attr, location.origin + uri);
              } else if (!test1_pattern.test(uri)) {
                link.setAttribute(attr, m[1] + "/" + uri);
              }
            }
          }
        }
      }
    }

    function replaceButton(page) {
      var allInputs = page.getElementsByTagName("input");
      for (var i = 0; i < allInputs.length; ++i) {
        var name = allInputs[i].getAttribute("name");

        if (rValue.Pattern_level.test(name)) {
          var levelURL =
            "document.location.href='level" +
            rValue.Pattern_idNumber.exec(name)[1] +
            ".html';";
          var button = allInputs[i];
          button.setAttribute("type", "button");
          button.setAttribute("onclick", levelURL);
        }
        if (rValue.Pattern_item.test(name)) {
          var levelURL = "document.location.href='items.html';";
          var button = allInputs[i];
          button.setAttribute("type", "button");
          button.setAttribute("onclick", levelURL);
        }
        if (rValue.Pattern_stat.test(name)) {
          var levelURL = "document.location.href='statistics.html';";
          var button = allInputs[i];
          button.setAttribute("type", "button");
          button.setAttribute("onclick", levelURL);
        }
        if (rValue.Pattern_detail.test(name)) {
          var levelURL = "document.location.href='level1.html';";
          var button = allInputs[i];
          button.setAttribute("type", "button");
          button.setAttribute("onclick", levelURL);
        }
        if (name == "overview" || name == "") {
          var levelURL = "document.location.href='../index.html';";
          var button = allInputs[i];
          button.setAttribute("type", "button");
          button.setAttribute("onclick", levelURL);
        }
      }
    }
    function replaceLevelPage(page, nLevel) {
      var IndexPatt = /\D*([\d]+)\D*/;
      allURL = page.getElementsByTagName("a");
      for (var i = 0; i < allURL.length; ++i) {
        var theURL = allURL[i];
        if (theURL.className == "paginator") {
          var Result = IndexPatt.exec(theURL.textContent);
          var pageNum = Number(Result[1]);
          theURL.href =
            "level" + nLevel + (pageNum > 1 ? "_" + pageNum : "") + ".html";
        }
      }
    }

    function replaceDate(sDate) {
      var today = new Date();
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var ret = sDate.replace(
        "今天",
        today.getFullYear() +
          "年" +
          (today.getMonth() + 1) +
          "月" +
          today.getDate() +
          "日"
      );
      ret = ret.replace(
        "昨天",
        yesterday.getFullYear() +
          "年" +
          (yesterday.getMonth() + 1) +
          "月" +
          yesterday.getDate() +
          "日"
      );
      return ret;
    }

    function replaceOther(sHTML) {
      var ret = sHTML.replace(
        /wodInitialize\(''/g,
        "wodInitialize('" + location.host + "'"
      );
      ret = ret.replace(/wo\('\/wod/g, "wo('" + location.origin + "/wod");
      return ret;
    }

    function prepareIndexPageTemplate() {
      var allRow = gIndexTemplateDiv.getElementsByTagName("tr");
      for (var j = allRow.length - 1; j > 1; --j) {
        var row = allRow[j];
        if (rValue.Pattern_logRow.test(row.getAttribute("class"))) {
          row.parentNode.removeChild(row);
        }
      }
    }

    function addIndexNewButton(cell, buttonText, url) {
      var newButton = document.createElement("input");
      newButton.setAttribute("type", "button");
      newButton.setAttribute("class", "button clickable");
      newButton.setAttribute("value", buttonText);
      newButton.setAttribute("onclick", url);
      cell.appendChild(newButton);
    }

    function handleIndexPage() {
      var allRow = gIndexDiv.getElementsByTagName("tr");
      var row = allRow[allRow.length - 1];
      row.parentNode.removeChild(row);
    }

    function insertFilter() {
      if (this.checked) addFilter(this.nextSibling);
      else hideFilter();
    }

    var gIndexRowclass = "row0";
    var gCurrentReport;
    var gZip;
    var rLocal;
    var infodiv;
    var gTitle;
    var gSelectedReport = [];
    var gIndexTemplateDiv;
    var gResponseDiv;
    var multiPageDiv = [];
    var gIndexDiv;
    var gIsWorking = false;
    var includeData = false;
    var gWithLv = false;
    var headDiv;
    var world = "";
    var default_gTitle;
    var isaddFilter = true;
    var rContents = {
      OrigText_H1_DungeonLog: ["Battle Report", "战报"],
      OrigText_H1_DuelLog: ["Battle Report", "您的决斗"],
      OrigText_Button_DungeonDetails: ["details", "详细资料"],
      Text_Button_Exportlog: ["Export Log", "导出战报"],
      Text_Button_SelectAll: ["Select All", "全选"],
      Text_Button_ClearAll: ["Clear All", "清除"],
    };

    var rValue = {
      Text_Item: "items",
      Text_Stat: "stats",
      Text_Checkbox: "chkLog",
      Chk_includeData: "export_with_data",
      Chk_single: "single_export",
      Chk_withLv: "withLv_export",
      Holder_Lv: "「等级」",
      Pattern_level: /^level\[[\d]+\]/,
      Pattern_stat: /^stats\[[\d]+\]/,
      Pattern_item: /^items\[[\d]+\]/,
      Pattern_detail: /^details\[[\d]+\]/,
      Pattern_checkboxName: /^chkLog/,
      Pattern_logRow: /^row\d/,
      Pattern_idNumber: /([\d]+)/,
      pattern_http: /^http/i,
    };

    var isDuel = false;
    //-----------------------------------------------------------------------------
    // "main"
    //-----------------------------------------------------------------------------
    function ReprotMain() {
      rLocal = GetLocalContents(rContents);
      if (rLocal === null) return;
      var allH1 = document.getElementsByTagName("h1");
      var i = 0;
      var h1;
      var shouldContinue = false;
      if (allH1 === "undefined") return;
      for (i = 0; i < allH1.length; ++i) {
        h1 = allH1[i];
        if (
          h1.innerHTML == rLocal.OrigText_H1_DungeonLog ||
          h1.innerHTML == rLocal.OrigText_H1_DuelLog
        ) {
          infodiv = document.createElement("div");
          infodiv.innerHTML = "";
          infodiv.id = "infoDiv";
          h1.parentNode.insertBefore(infodiv, h1.nextSibling);

          var newLabel = document.createElement("label");
          newLabel.innerHTML = "同时保存统计信息";
          h1.parentNode.insertBefore(newLabel, h1.nextSibling);
          var newCheckBox = document.createElement("input");
          newCheckBox.setAttribute("type", "checkbox");
          newCheckBox.setAttribute("class", "checkbox");
          newCheckBox.setAttribute("value", "同时保存统计信息");
          newCheckBox.addEventListener("change", insertFilter, false);
          newCheckBox.id = rValue.Chk_includeData;
          newLabel.setAttribute("for", newCheckBox.id);
          h1.parentNode.insertBefore(newCheckBox, h1.nextSibling);

          // 插入单文件导出复选框
          var singleCheckLabel = document.createElement("label");
          singleCheckLabel.innerHTML = "单文件导出";
          h1.parentNode.insertBefore(singleCheckLabel, h1.nextSibling);
          var singleCheckBox = document.createElement("input");
          singleCheckBox.setAttribute("type", "checkbox");
          singleCheckBox.setAttribute("class", "checkbox");
          singleCheckBox.setAttribute("value", "单文件导出");
          singleCheckBox.id = rValue.Chk_single;
          singleCheckLabel.setAttribute("for", singleCheckBox.id);
          h1.parentNode.insertBefore(singleCheckBox, h1.nextSibling);

          // 插入文件名包含平均等级复选框
          var withLvLabel = document.createElement("label");
          withLvLabel.innerHTML = "平均等级";
          h1.parentNode.insertBefore(withLvLabel, h1.nextSibling);
          var withLvCheckBox = document.createElement("input");
          withLvCheckBox.setAttribute("type", "checkbox");
          withLvCheckBox.setAttribute("class", "checkbox");
          withLvCheckBox.setAttribute("value", "平均等级");
          withLvCheckBox.setAttribute("checked", true);
          withLvCheckBox.id = rValue.Chk_withLv;
          withLvLabel.setAttribute("for", withLvCheckBox.id);
          h1.parentNode.insertBefore(withLvCheckBox, h1.nextSibling);

          // 插入日期后缀框
          var suffixBox = document.createElement("input");
          suffixBox.setAttribute("id", "suffix");
          suffixBox.setAttribute("size", "14");
          suffixBox.setAttribute("type", "text");
          suffixBox.setAttribute("placeholder", "日期后缀");
          // 默认使用年月日时分为后缀
          suffixBox.setAttribute("value", "YYYYMMDDHHmm");
          suffixBox.innerHTML = "YYYYMMDDHHmm";
          h1.parentNode.insertBefore(suffixBox, h1.nextSibling);
          var suffixSpan = document.createElement("span");
          suffixSpan.innerHTML = "日期后缀:";
          h1.parentNode.insertBefore(suffixSpan, h1.nextSibling);

          // 插入前缀框
          var prefixBox = document.createElement("input");
          prefixBox.setAttribute("id", "prefix");
          prefixBox.setAttribute("size", "14");
          prefixBox.setAttribute("type", "text");
          prefixBox.setAttribute("placeholder", "战报导出命名前缀");
          // 默认使用团队名作为前缀
          prefixBox.setAttribute(
            "value",
            "[" + document.getElementsByName("gruppe_name")[0].value + "]"
          );
          prefixBox.innerHTML =
            "[" + document.getElementsByName("gruppe_name")[0].value + "]";
          h1.parentNode.insertBefore(prefixBox, h1.nextSibling);
          var newLabel = document.createElement("span");
          newLabel.innerHTML = "战报导出命名前缀:";
          h1.parentNode.insertBefore(newLabel, h1.nextSibling);

          InsertButton(h1, rLocal.Text_Button_Exportlog, exportLog);
          InsertButton(h1, rLocal.Text_Button_ClearAll, cleartAll);
          InsertButton(h1, rLocal.Text_Button_SelectAll, selectAll);

          gResponseDiv = document.createElement("div");
          gResponseDiv.innerHTML = "";
          gIndexTemplateDiv = document.createElement("div");
          gIndexTemplateDiv.innerHTML = "";

          shouldContinue = true;
          break;
        }
      }
      if (!shouldContinue) return;
      var allTable = document.getElementsByTagName("table");
      for (i = 0; i < allTable.length; ++i) {
        var theTable = allTable[i];
        if (theTable.getAttribute("class") == "content_table") {
          gIndexTemplateDiv.innerHTML = theTable.outerHTML;
          prepareIndexPageTemplate();
          var allRow = theTable.getElementsByTagName("tr");
          for (var j = 0; j < allRow.length; ++j) {
            var row = allRow[j];
            var newCheckbox = document.createElement("input");
            newCheckbox.setAttribute("type", "checkbox");
            if (rValue.Pattern_logRow.test(row.getAttribute("class"))) {
              if (isDuel) {
                var reportName =
                  "<span>" +
                  row.cells[0].innerHTML.replace("<hr>", " <b>对战</b> ") +
                  " " +
                  row.cells[1].innerText +
                  "</span>";
                var reportTime = "<span>" + row.cells[2].innerText + "</span>";
                var title = reportName + "&nbsp;-&nbsp;" + reportTime;
                var allduel = row.cells[3].getElementsByTagName("a");
                var href = allduel[0].href;
                var onclick_pattern = /\?DuellId=([^&]*)/;
                var result = onclick_pattern.exec(href);
                newCheckbox.setAttribute(
                  "name",
                  rValue.Text_Checkbox + "[" + j + "]"
                );
                newCheckbox.setAttribute(
                  "id",
                  rValue.Text_Checkbox + "[" + j + "]"
                );
                newCheckbox.setAttribute("value", result[1]);
                newCheckbox.setAttribute("href", href);
                newCheckbox.setAttribute("title", title);
                newCheckbox.setAttribute("reportname", reportName);
                newCheckbox.setAttribute("reporttime", reportTime);
                newCheckbox.setAttribute(
                  "c0",
                  row.cells[0].innerHTML.replace("<hr>", " <b>对战</b> ")
                );
                newCheckbox.setAttribute("c1", row.cells[1].innerHTML);
                newCheckbox.setAttribute("maxLevel", 1);
                row.cells[0].insertBefore(newCheckbox, row.cells[0].firstChild);
              } else {
                var reportName =
                  "<span>" + row.cells[1].firstChild.innerHTML + "</span>";
                var reportTime =
                  "<span>" + row.cells[0].firstChild.innerHTML + "</span>";
                var title = reportName + "&nbsp;-&nbsp;" + reportTime;
                var allInput = row.cells[2].getElementsByTagName("input");
                var id = "";
                var index = "";
                for (var k = 0; k < allInput.length; ++k) {
                  var input = allInput[k];
                  var name = input.getAttribute("name");
                  var value = input.getAttribute("value");
                  if (name.indexOf("report_id") != -1) {
                    var Result = rValue.Pattern_idNumber.exec(name);
                    index = Number(Result[1]);
                    id = value;
                    break;
                  }
                }
                newCheckbox.setAttribute(
                  "name",
                  rValue.Text_Checkbox + "[" + index + "]"
                );
                newCheckbox.setAttribute(
                  "id",
                  rValue.Text_Checkbox + "[" + index + "]"
                );
                newCheckbox.setAttribute("value", id);
                newCheckbox.setAttribute("title", title);
                newCheckbox.setAttribute("reportname", reportName);
                newCheckbox.setAttribute("reporttime", reportTime);
                newCheckbox.setAttribute("maxLevel", 1);
                newCheckbox.setAttribute(
                  rValue.Text_Item,
                  rValue.Text_Item + "%5B" + index + "%5D"
                );
                newCheckbox.setAttribute(
                  rValue.Text_Stat,
                  rValue.Text_Stat + "%5B" + index + "%5D"
                );
                row.cells[0].insertBefore(newCheckbox, row.cells[0].firstChild);
              }
            }
          }
          break;
        }
      }
      var allInput = document.getElementsByTagName("input");
      for (var i = 0; i < allInput.length; i++) {
        var input = allInput[i];
        if (input.name && input.name == "wod_post_world") {
          world = input.value;
          break;
        }
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////

    function test(o) {
        alert('test');
    }
    function filterMain() {
        function Factoryfilter(o) {
            return function () {
                filterReport(o);
            };
        }

        var tables = document.getElementsByTagName("table");
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            if (table.className == "rep_status_table") {
                for (var j = 0; j < table.rows.length; j++) {
                    var row = table.rows[j];
                    for (var k = 0; k < row.cells.length; k++) {
                        var cell = row.cells[k];
                        if (cell.className == "hero") {
                            var newCheckbox = document.createElement("input");
                            newCheckbox.setAttribute("type", "checkbox");
                            newCheckbox.setAttribute("class", "filter");
                            newCheckbox.value = cell.firstChild.textContent;
                            cell.insertBefore(newCheckbox, cell.firstChild);
                            //newCheckbox.setAttribute("onclick", "test(this);");
                            newCheckbox.addEventListener("click", Factoryfilter(newCheckbox), false);
                            break;
                        }
                    }
                }
            }
        }
    }

    filterReport = function (o) {
        var checkboxlist = document.getElementsByTagName("input");
        var selectedheros = [];
        var classNamepattern = /^[rep_monster|rep_hero|rep_myhero]/;
        for (var i = 0; i < checkboxlist.length; i++) {
            var checkbox = checkboxlist[i];
            if (checkbox.getAttribute("type") == "checkbox" && checkbox.getAttribute("class") == "filter") {
                if (checkbox.value == o.value)
                    checkbox.checked = o.checked;
                if (checkbox.checked && selectedheros.indexOf(checkbox.value) <= -1)
                    selectedheros.push(checkbox.value);
            }
        }
        var tables = document.getElementsByTagName("table");
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            if (table.className != "rep_status_table") {
                var istheTable = false;
                for (var j = 0; j < table.rows.length; j++) {
                    var row = table.rows[j];
                    var show = false;
                    if (row.cells.length <= 0 || row.cells[0].colSpan > 1)
                        continue;
                    if (istheTable || row.cells[0].className == "rep_initiative") {
                        istheTable = true;
                        for (var k = 0; k < row.cells.length; k++) {
                            var cell = row.cells[k];
                            var links = cell.getElementsByTagName("a");
                            for (var index = 0; index < links.length; index++) {
                                var link = links[index];
                                if (classNamepattern.test(link.className)) {
                                    var name = link.textContent;
                                    if (selectedheros.length <= 0 || selectedheros.indexOf(name) > -1) {
                                        show = true;
                                        break;
                                    }
                                }
                            }
                            if (show)
                                break;
                        }
                        row.style.display = show ? '' : 'none';
                    }
                }
            }
        }
    };

    try {
        isDuel = (window.location.href.indexOf("duell.php") > 0);
        Main();
        ReprotMain();
        //filterMain();
    } catch (e) {
        alert("Main(): " + e);
    }
})();
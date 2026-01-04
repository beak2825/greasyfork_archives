// ==UserScript==
// @name ArtemisQuickSelector
// @namespace http://XX.net/
// @version 2.1.99
// @description quick select artemis db
// @author You
// @icon https://s3-ap-southeast-1.amazonaws.com/ojmp-data/53404e214fcb064cbd9d200b8bf318eb/titansoft.png
// @include http://dba-sb-prod.coreop.net/*
// @include http://dba-xt-prod.coreop.net/*
// @include http://dba-stg.coreop.net/*
 
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/395964/ArtemisQuickSelector.user.js
// @updateURL https://update.greasyfork.org/scripts/395964/ArtemisQuickSelector.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    var QueryDbShortCut = localStorage.getItem('QueryDbShortCut');
    var DatabaseSearchFeature = localStorage.getItem('DatabaseSearchFeature');
    var isNeedAutoComplete = localStorage.getItem('isNeedAutoComplete');
    var CountFeature = localStorage.getItem('CountFeature');
    var OrderFeature = localStorage.getItem('OrderFeature');
    var SideBarShortCut = localStorage.getItem('SideBarShortCut');
    var SimpleSettingShortCut = localStorage.getItem('SimpleSettingShortCut');
 
    function changeDB(dbName) {
        var myselect = document.getElementById("Database")
        myselect.options[0] = new Option(dbName, dbName)
        myselect.options[0].selected = true;
        $('#searchDB').val(dbName);
        $('#Database').trigger('change');
    };
 
    function changeDBAndTable(dbName, tableName) {
        var myselect = document.getElementById("Database")
        myselect.options[0] = new Option(dbName, dbName)
        myselect.options[0].selected = true;
        $('#searchDB').val(dbName);
        var tableSelect = document.getElementById("Table")
        tableSelect.options[0] = new Option(tableName, tableName)
        tableSelect.options[0].selected = true;
        $('#Table').trigger('change');
        $('#searchTable').val(tableName);
        setTimeout(function () {
            $('#insert').trigger('click');
        }, 500);
    };
 
    function getDatetimeColumn() {
        return Array.from(document.querySelector("#column").children).filter(x => x.text.includes("datetime"));
    }
 
    function setSqlHint() {
        selectArr = [];
        for (var i = 0; i < document.querySelector("#column").length; i++) {
            var column = document.querySelector("#column")[i].value.toString();
            myCar[column] = [];
            selectArr.push(myCar)
        }
            myCar['Group'] = [];
            selectArr.push(myCar)
 
        var da = JSON.stringify(selectArr).replace(/[{}]/g, '').substr(1)
        var result1 = da.substr(0, da.length - 1);
 
        setTimeout(function () {
            window.editor.setOption('hintOptions', {
                tables: JSON.parse('{' + result1 + '}')
 
            })
        }, 300);
    }
 
    function debounce(fn, wait) {
        var timeout = null;
        return function () {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(fn, wait);
        }
    }
 
    function setSbDbConfig() {
        var config = JSON.parse(localStorage.getItem('sbDbConfig'));
        console.log(config);
        var maxCount = 0;
        if (!config) {
            maxCount = 0;
            localStorage.setItem('sbDbConfig', JSON.stringify([{
                "DB": document.querySelector("#searchDB").value,
                "Table": document.querySelector("#searchTable").value,
                "Id": `Id${maxCount + 1}`
            }]));
        } else {
            maxCount = config.length;
            config.push({
                "DB": document.querySelector("#searchDB").value,
                "Table": document.querySelector("#searchTable").value,
                "Id": `Id${maxCount + 1}`
            })
            console.log(config);
            localStorage.setItem('sbDbConfig', JSON.stringify(config));
 
        }
        alert('add db config success')
 
    }
 
    function groupBy(array, f) {
        let groups = {};
        array.forEach(function (o) {
            let group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    }
 
    function css(path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    }
 
    function createSearchTableDataList() {
        var new_elem = document.getElementById('NewTable');;
        var oldParent = document.getElementById('Table');
        new_elem.textContent = '';
        var cloneOld = oldParent.cloneNode(true);
        while (cloneOld.childNodes.length > 0) {
            new_elem.appendChild(cloneOld.childNodes[0]);
        }
    }
 
    function alertt() {
        console.log('QQ');
    }
 
    function changeDBForAppSetting(dbName, project) {
        var myselect = document.getElementById("database")
        myselect.options[0] = new Option(dbName, dbName)
        myselect.options[0].selected = true;
        $('#database').trigger('change');
        document.getElementById("website").value = project
        document.getElementById("btnList").click();
    };
 
    //--------------------------Feature toggle------------------
    element = $('#btnExit')[0].parentNode
    element.setAttribute('style', 'display:flex;align-items: center')
 
    var featuretoggle = '<!-- Button trigger modal -->\
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">\
Artemis Feature Toggle\
</button>\
\
<!-- Modal -->\
<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">\
<div class="modal-dialog modal-dialog-centered" role="document">\
<div class="modal-content">\
<div class="modal-header">\
<h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>\
<button type="button" class="close" data-dismiss="modal" aria-label="Close">\
<span aria-hidden="true">&times;</span>\
</button>\
</div>\
<div class="modal-body">\
<div>Query Db short cut : <input class="form-check-input" type="checkbox" id="QueryDbShortCut"></div>\
<div>DatabaseSearchFeature : <input class="form-check-input" type="checkbox" id="DatabaseSearchFeature"></div>\
<div>AutoComplete : <input class="form-check-input" type="checkbox" id="AutoComplete"></div>\
<div>CountFeature : <input class="form-check-input" type="checkbox" id="CountFeature"></div>\
<div>OrderFeature : <input class="form-check-input" type="checkbox" id="OrderFeature"></div>\
<div>SideBarShortCut : <input class="form-check-input" type="checkbox" id="SideBarShortCut"></div>\
<div>SimpleSettingShortCut : <input class="form-check-input" type="checkbox" id="SimpleSettingShortCut"></div>\
</div>\
<div class="modal-footer">\
<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>\
<button type="button" id="saveChange" class="btn btn-primary">Save changes</button>\
</div>\
</div>\
</div>\
</div>';
    try {
        new_elem = document.createElement('div');
        new_elem.innerHTML = featuretoggle;
        element = $('#content')[0]
        element.parentNode.insertBefore(new_elem, element);
 
 
    } catch (e) {}
 
 
    if (QueryDbShortCut == null) {
        localStorage.setItem('QueryDbShortCut', 'true');
    }
    if (DatabaseSearchFeature == null) {
        localStorage.setItem('DatabaseSearchFeature', 'true');
    }
    if (isNeedAutoComplete == null) {
        localStorage.setItem('isNeedAutoComplete', 'true');
    }
    if (CountFeature == null) {
        localStorage.setItem('CountFeature', 'true');
    }
    if (OrderFeature == null) {
        localStorage.setItem('OrderFeature', 'true');
    }
    if (SideBarShortCut == null) {
        localStorage.setItem('SideBarShortCut', 'true');
    }
    if (SimpleSettingShortCut == null) {
        localStorage.setItem('SimpleSettingShortCut', 'true');
    }
 
    $('#QueryDbShortCut').prop('checked', QueryDbShortCut == 'true');
    $('#AutoComplete').prop('checked', isNeedAutoComplete == 'true');
    $('#CountFeature').prop('checked', CountFeature == 'true');
    $('#OrderFeature').prop('checked', OrderFeature == 'true');
    $('#SideBarShortCut').prop('checked', SideBarShortCut == 'true');
    $('#SimpleSettingShortCut').prop('checked', SimpleSettingShortCut == 'true');
    $('#DatabaseSearchFeature').prop('checked', DatabaseSearchFeature == 'true');
 
    var saveChange = document.querySelector("#saveChange");
    if (saveChange) {
        saveChange.addEventListener("click", function () {
            localStorage.setItem('QueryDbShortCut', $('#QueryDbShortCut:checked').val() == 'on');
            localStorage.setItem('DatabaseSearchFeature', $('#DatabaseSearchFeature:checked').val() == 'on');
 
            localStorage.setItem('isNeedAutoComplete', $('#AutoComplete:checked').val() == 'on');
 
            localStorage.setItem('CountFeature', $('#CountFeature:checked').val() == 'on');
 
            localStorage.setItem('OrderFeature', $('#OrderFeature:checked').val() == 'on');
 
            localStorage.setItem('SideBarShortCut', $('#SideBarShortCut:checked').val() == 'on');
 
            localStorage.setItem('SimpleSettingShortCut', $('#SimpleSettingShortCut:checked').val() == 'on');
            location.reload();
 
        }, false);
    }
 
    //--------------------------Feature toggle------------------
 
 
 
 
    var new_elem = document.createElement('div');
 
    if (window.location.hostname == "dba-sb-prod.coreop.net" && QueryDbShortCut == 'true') {
        //--------------------setSbDbConfig-----------------------
        try {
            document.querySelector("#btnSaveQuery").insertAdjacentHTML("afterend", "<button id='saveTable' style='margin-left:4px' class='Button Font16'>Save Table</button>")
            document.querySelector(`#saveTable`).addEventListener("click", function () {
                setSbDbConfig();
            })
        } catch (e) {}
 
        //--------------------setSbDbConfig-----------------------
 
        //-------------------------add element for db and table start----------------------------------
 
        try {
            var classArray = ["PageHeader.B", "page-header"];
            classArray.forEach(function (item, index, array) {
 
                if (document.getElementsByClassName('page-header')[0].children[0].innerText == 'Simple Settings' && item !== "PageHeader.B") {
 
                    document.querySelector(`.${item}`).insertAdjacentHTML("afterend", '<div style="margin-bottom:10px"><span class="dg btn btn-primary">DemeterGame</span> <span class="talos btn btn-primary">Talos</span> <span class="dc btn btn-primary" > DemeterCore</span > </div>');;
                    return;
                }
                new_elem.innerHTML = dbGroup;
                var dbGroup = ""
 
                var sbDbConfig = JSON.parse(localStorage.getItem('sbDbConfig'));
 
                let groupDbConfig = groupBy(sbDbConfig, function (item) {
                    return [item.DB];
                });
                try {
                    dbGroup += '<div>'
                    groupDbConfig.forEach(item => {
                        dbGroup += '<div class="btn-group" style="margin:0 10px 5px 0"> <button type="button" class="btn btn-primary ' + item[0].Id + '">' + item[0].DB + '</button>\
<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">\
<span class="caret"></span>\  <span class="sr-only">Toggle Dropdown</span>\
</button>\
<ul class="dropdown-menu" role="menu">';
                        item.forEach(child => {
                            dbGroup += '<li><a href="#" class = "' + item[0].Id + child.Table + '">' + child.Table + '</a>\
</li>'
                        });
                        dbGroup += '</ul>\
</div>'
                    })
                    dbGroup += '</div>'
                    if (document.querySelector(`.${item}`).classList.contains('Font16')) {
                        return;
                    }
                    document.querySelector(`.${item}`).insertAdjacentHTML("afterend", dbGroup);
                } catch (error) {
 
                }
 
 
 
            })
        }
        //-------------------------add element for db and table end----------------------------------
        catch (e) {
            console.log(`select db error e:${e}`)
        }
 
        try {
            var dbConfig = JSON.parse(localStorage.getItem('sbDbConfig'));
            let groupDbConfig = groupBy(dbConfig, function (item) {
                return [item.DB];
            });
            groupDbConfig.forEach(item => {
                item.forEach(child => {
                    document.querySelector(`.${item[0].Id}`).addEventListener("click", function () {
                        changeDB(`${item[0].DB}`);
                    })
                    document.querySelector(`.${item[0].Id}${child.Table}`).addEventListener("click", function () {
                        changeDBAndTable(`${item[0].DB}`, child.Table);
                    })
                });
            })
        } catch (error) {
            console.log('add event listener error')
        }
    } else if (window.location.hostname == "dba-xt-prod.coreop.net" && QueryDbShortCut == 'true') {
        var gma = '<span class="tsG btn btn-primary" >TsGameInfo</span>';
        new_elem = document.createElement('div');
        new_elem.innerHTML = gma;
 
        try {
            classArray = ["page-header", "PageHeader"];
            classArray.forEach(function (item, index, array) {
                if (document.getElementsByClassName('page-header')[0].children[0].innerText == 'Simple Settings') {
                    gma = '<span class="dg btn btn-primary">DemeterGame</span> <span class="talos btn btn-primary">Talos</span> <span class="dc btn btn-primary" > DemeterCore</span > ';
                }
                new_elem.innerHTML = gma;
                document.getElementsByClassName(item)[0].appendChild(new_elem);
            })
        } catch (e) {}
 
        var tsG = document.querySelector(".tsG");
        if (tsG) {
            tsG.addEventListener("click", function () {
                changeDB('TsGameInfo (maia-a84)');
            }, false);
        }
    }
 
    try {
        document.querySelector("#btnSubmit").value = 'Submit (F8)';
        document.addEventListener('keydown', logKey);
    } catch (e) {
        console.log('no submit button')
    }
 
    function logKey(e) {
        if (e.code == 'F8') {
            $("#btnSubmit").click();
        }
 
    }
 
    //-----------------------------------共用--------------------------------------
 
    var DG = document.querySelector(".dg");
    if (DG) {
        DG.addEventListener("click", function () {
            changeDBForAppSetting('ApplicationSetting (maia-b05)', 'DemeterGame');
        }, false);
    }
    var DC = document.querySelector(".dc");
    if (DC) {
        DC.addEventListener("click", function () {
            changeDBForAppSetting('ApplicationSetting (maia-b05)', 'DemeterCore');
        }, false);
    }
    var Talos = document.querySelector(".talos");
    if (Talos) {
        Talos.addEventListener("click", function () {
            changeDBForAppSetting('ApplicationSettingTW (maia-b05)', 'Talos');
        }, false);
    }
    //-------------------------StoreProcedure & App Setting----------------------------------
    if (SideBarShortCut == 'true') {
        try {
            var sp = '<a href="/Developer/Content?type=StoredProcedure"><i class="glyphicon glyphicon-heart"></i>Stored Procedure</a>';
            new_elem = document.createElement('li');
            new_elem.innerHTML = sp;
            var element = document.getElementsByClassName("nav-header")[0];
            element.parentNode.insertBefore(new_elem, element.nextSibling);
 
            var app = '<a href="/Developer/SimpleSetting"><i class="glyphicon glyphicon-heart"></i>Simple Setting</a>';
            new_elem = document.createElement('li');
            new_elem.innerHTML = app;
            element = document.getElementsByClassName("nav-header")[0];
            element.parentNode.insertBefore(new_elem, element.nextSibling);
 
        } catch (e) {
            console.log('SP and APP error', e)
        }
    }
 
    //-------------------------StoreProcedure & App Setting----------------------------------
 
    //-------------------------Order by-------------------------
    if (OrderFeature == 'true') {
 
        $("#insert").click(function () {
            OrderBy();
        })
 
        function OrderBy() {
            try {
                var orderbyArray = getDatetimeColumn();
                console.log(orderbyArray);
                var orderStart = '<td class="B" align="left" colspan="2">Order by : ';
                var orderCustomize = '';
                var orderEnd = ' </td>';
                orderbyArray.forEach((element) => {
                    if ($(`#column option[value=${element.value}]`).length) {
                        orderCustomize += `<span class="btn btn-primary ${element.value}" style="margin:0 0 5px 10px"> ${element.value} </span>`
                    }
                });
                if ($("#orderbyrow").length === 0) {
                    new_elem = document.createElement('tr');
                    new_elem.id = 'orderbyrow'
                } else {
                    new_elem = document.getElementById("orderbyrow");
                }
                new_elem.innerHTML = orderStart + orderCustomize + orderEnd;
                element = $('.TAL').parent('tr')[0];
                element.parentNode.insertBefore(new_elem, element.nextSibling);
                orderbyArray.forEach((element) => {
                    var order = document.querySelector(`.${element.value}`);
                    if (order) {
                        order.addEventListener("click", function () {
                            var cmd = window.editor.getValue();
                            cmd = cmd.replace(/[\r\n](^ORDER|^order)[\t\n\r\s\w\W]*/mg, '')
                            window.editor.setValue(cmd + `\r\nORDER BY ${element.value} desc`)
                        }, false);
                    }
                });
            } catch (e) {
                console.log(e)
            }
        }
 
    }
    //-------------------------Order by-------------------------
 
    //-------------------------Count(1)-------------------------
    if (CountFeature == 'true') {
        try {
            var count = '<td class="B"align="left" colspan="2">COUNT(1) : <p class="btn btn-primary count1">Count(1)</p></td>';
            new_elem = document.createElement('tr');
            new_elem.innerHTML = count;
            element = $('.DT:first tr')[4]
            element.parentNode.insertBefore(new_elem, element.nextSibling);
            var count1 = document.querySelector(".count1");
            if (count1) {
                count1.addEventListener("click", function () {
                    var cmd = window.editor.getValue();
                    cmd = cmd.replace(/(^SELECT | select | Select)[\s\w\W\S]*(from | FROM)/mig, 'SELECT COUNT(1) FROM ')
                    window.editor.setValue(cmd)
                }, false);
            }
        } catch (error) {
            console.log(error);
 
        }
 
    }
    //-------------------------Count(1)-------------------------
 
    //-------------------------Search table-------------------------
 
    if (DatabaseSearchFeature == 'true') {
 
        try {
            var newItem = '<td><strong>Tables and Views List :</strong></td><td><input class="form-control" type="text" placeholder="Search.." id="searchTable" list="NewTable" ></td>';
            new_elem = document.createElement('tr');
            new_elem.innerHTML = newItem;
 
            element = $('.DT:first tr')[0]
            element.parentNode.insertBefore(new_elem, element.nextSibling);
            var AppendTarget = document.querySelector('#searchTable');
            if (AppendTarget) {
                AppendTarget.addEventListener("keyup", function () {
                    var input, filter, ul, li, i;
                    input = document.getElementById("searchTable");
                    filter = input.value.toUpperCase();
                    var div = document.getElementById("Table");
                    var option = div.getElementsByTagName("option");
                    for (i = 0; i < option.length; i++) {
                        var txtValue = option[i].textContent || option[i].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            option[i].style.display = "";
                        } else {
                            option[i].style.display = "none";
                        }
                    }
                }, false);
                AppendTarget.addEventListener("change",
                    function (e) {
                        $('#Table').val(e.target.value)
 
                        $('#NewTable').val(e.target.value)
                        $("#NewTable").change(onDatabaseChange);
                        $('#Table').trigger('change');
                    }, false);
            }
 
            new_elem = document.createElement('datalist');
            new_elem.setAttribute('id', 'NewTable');
            element = $('.DT:first tr')[0]
            element.parentNode.insertBefore(new_elem, element.nextSibling);
 
            var selector = document.getElementById('Table');;
            if (selector) {
                selector.addEventListener("DOMSubtreeModified", debounce(createSearchTableDataList, 100))
            }
        } catch (error) {
            console.log(error);
 
        }
 
    }
    //-------------------------Search table-------------------------
    function createDatalistForSearchList(params) {
        AppendTarget = document.querySelector('#searchDB');
        if (AppendTarget) {
            AppendTarget.addEventListener("keyup", function () {
                var input, filter, ul, li, i;
                input = document.getElementById("searchDB");
                filter = input.value.toUpperCase();
                var div = document.getElementById("Database");
                var option = div.getElementsByTagName("option");
                for (i = 0; i < option.length; i++) {
                    var txtValue = option[i].textContent || option[i].innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        option[i].style.display = "";
                    } else {
                        option[i].style.display = "none";
                    }
                }
            }, false);
            AppendTarget.addEventListener("change", function (e) {
                $('#Database').val(e.target.value)
 
                $('#NewDatabase').val(e.target.value)
                $("#NewDatabase").change(onDatabaseChange);
                $('#NewDatabase').trigger('change');
 
            }, false);
        }
    }
    //-------------------------Search DB-------------------------
 
    if (DatabaseSearchFeature == 'true') {
 
        try {
            var searchDbInput = `<tr><td><strong>DataBase List :<strong></td><td><input class="form-control" type="text" placeholder="Search.." id="searchDB" list="NewDatabase" ></td><tr>`;
 
            AppendTarget = $('.DT:first tr')[0]
            AppendTarget.insertAdjacentHTML("afterend", searchDbInput);
 
            createDatalistForSearchList();
 
 
            new_elem = document.createElement('datalist');
            new_elem.setAttribute('id', 'NewDatabase');
            var oldParent = document.getElementById('Database');
 
 
            element = $('.DT:first tr')[0]
            element.parentNode.insertBefore(new_elem, element.nextSibling);
            var cloneOld = oldParent.cloneNode(true);
            while (cloneOld.childNodes.length > 0) {
                new_elem.appendChild(cloneOld.childNodes[0]);
            }
            $('.DT:first tr')[4].setAttribute('style', 'display:none');
            $('.DT:first tr')[5].setAttribute('style', 'display:none');
        } catch (error) {
            console.log(error);
 
        }
        //SP search page
 
        try {
            searchDbInput = `<div class="form-group"><strong  class="control-label col-sm-2">DataBase List :</strong></td><td class="form-control"><input class="form-control" type="text" placeholder="Search.." id="searchDB" list="NewDatabase" ><div>`;
            element = $('#updateFrom')[0]
            element.insertAdjacentHTML("afterbegin", searchDbInput);
            // element.parentNode.insertBefore(new_elem, element.nextSibling);
            AppendTarget = document.querySelector('#searchDB');
            if (AppendTarget) {
                AppendTarget.addEventListener("keyup", function () {
                    var input, filter, ul, li, i;
                    input = document.getElementById("searchDB");
                    filter = input.value.toUpperCase();
                    var div = document.getElementById("Database");
                    var option = div.getElementsByTagName("option");
                    for (i = 0; i < option.length; i++) {
                        var txtValue = option[i].textContent || option[i].innerText;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            option[i].style.display = "";
                        } else {
                            option[i].style.display = "none";
                        }
                    }
                }, false);
                AppendTarget.addEventListener("change", function (e) {
                    $('#Database').val(e.target.value)
 
                    $('#NewDatabase').val(e.target.value)
                    $("#NewDatabase").change(onDatabaseChange);
                    $('#NewDatabase').trigger('change');
 
                }, false);
            }
 
            new_elem = document.createElement('datalist');
            new_elem.setAttribute('id', 'NewDatabase');
            var oldParent = document.getElementById('Database');
 
            element.parentNode.insertBefore(new_elem, element.nextSibling);
            var cloneOld = oldParent.cloneNode(true);
            while (cloneOld.childNodes.length > 0) {
                new_elem.appendChild(cloneOld.childNodes[0]);
            }
            document.querySelector("#updateFrom > div:nth-child(3)").setAttribute('style', 'display:none');
        } catch (error) {
            console.log(error);
 
        }
 
 
 
    }
    //-------------------------Search DB-------------------------
 
 
 
    //-------------------------Auto Complete-------------------------
 
    if (isNeedAutoComplete == 'true') {
        try {
            window.editor.on("keyup", function (cm, event) {
                if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
                    (event.keyCode >= 65 && event.keyCode <= 90)) {
                    /*Enter - do not open autocomplete list just after item has been selected in it*/
                    CodeMirror.commands.autocomplete(cm, null, {
                        completeSingle: true
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
 
    }
    //-------------------------Auto Complete-------------------------
 
 
 
    //-----------------------------------共用--------------------------------------
 
 
 
    //--------------------------code mirror start -------------------------
    var selectArr = {};
    var myCar = {};
    selector = document.querySelector("#column");
    if (selector) {
        selector.addEventListener("DOMSubtreeModified", debounce(setSqlHint, 100), false);
    }
    //--------------------------code mirror end----------------------------
})();

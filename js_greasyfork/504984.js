// ==UserScript==
// @name         Milk
// @namespace    http://tampermonkey.net/
// @version      0.06
// @description  tutorial skipper
// @author       RockefelleR
// @include https://*.the-west.*/game.php*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAwnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVDbDcMwCPz3FB2Blx08jtOkUjfo+MWGRHFTJI7HoTMm7Z/3Kz26EUqSvGippYCZVKnULFFwawMRZKAXNTic++kkyFpskb3UEvNHH08BD82yfBHSZxDrTFQJff0RIg/cN+r5FkI1hJicwBBo/i0oVZfrF9YdZlP31EF0XvtWL3a9Lds7TLQzMhgyqy/A3SVxs0QNrbBB5Gx5HghjFP0g/+50WPoC80pZKkUX8MYAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlRVoc7FBEIUN1sosWcSxVLIKF0lZo1cHk0i9o0pCkuDgKrgUHPxarDi7Oujq4CoLgB4izg5Oii5T4v7TQIsaD4368u/e4ewcIrRpTzYE4oGqWkUkmxHxhVfS9wo8wgohhXGKmnsou5uA6vu7h4etdlGe5n/tzBJWiyQCPSBxnumERbxDPblo6533iEKtICvE58ZRBFyR+5Lrc4TfOZYcFnhkycpl54hCxWO5juY9ZxVCJY8QRRdUoX8h3WOG8xVmtNVj3nvyFgaK2kuU6zTEksYQU0hAho4EqarAQpVUjxUSG9hMu/lHHnyaXTK4qGDkWUIcKyfGD/8Hvbs3SzHQnKZAABl9s+2MC8O0C7aZtfx/bdvsE8D4DV1rPX28Bc5+kN3ta5AgY3gYurnuavAdc7gDhJ10yJEfy0hRKJeD9jL6pAIzcAkNrnd66+zh9AHLU1fINcHAITJYpe93l3f7+3v490+3vB/iuctxhD/ETAAAOP2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQkIzMzg5RkM5Q0YxMUUyQUIxOEVCMjdBRTIyNEQyNiIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMmQ2ZDM0MS0zYmYxLTRjYjItYTNjYy0xZTM5NDgyMmFkOGEiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RURBMDM5MTZCRkUxMUUwQUYyMjlEREI3OTE0ODQ2RSIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzI0NTA3NzA4MDgzMjQ4IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzgiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjA4OjI0VDE1OjU1OjA4KzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowODoyNFQxNTo1NTowOCswMjowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk5ZWRiNDhlLWM2ZWMtNGY2Ni1iZGI3LThmNDk2MjhiODg5ZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wOC0yNFQxNTo1NTowOCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgIDx4bXBNTTpEZXJpdmVkRnJvbQogICAgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2RURBMDM5MTZCRkUxMUUwQUYyMjlEREI3OTE0ODQ2RSIKICAgIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OThBMzhDNkRDREM5RTIxMThDNzA4MDhERDkxNTc2M0IiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PiFhakIAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfoCBgNNwgFGryrAAAEvElEQVRIx61We4hVRRz+Zs7Medz3vXvv6q677m0NyS3dNsNH9MAwDE2hJGwTWggJMpNIUFoSCkKEMCokUqEyCgmCrP7qj6CygugPISuEUBN3dR96d899nMecMzP9oaD7uKuB89cwZ77zne935vd9Q97e06+Hh0RVGcoHABAAADQADQWiQxhg0IoANAYMAik5jGt7lSbQACi5BgQAJQHCoCGdjtZchg2NVavJRL5v35HPzuI2jxf6N3SPVGonsfP5J0duBfDWgcHk0NCZXRcvnD526o9fD7oTF9//7fefdh394kjHXLidA5tHGJV6zpcPvL6ZbHl061PwwwFG5EYQgo72Tsg4Ru89fcjlWsoAXm6GpzoGo5LMSaLOcrRvLu4qdhdWBw0XSin4DReFYicmq5XTho4PzIUnWoIZc3DsProtdV9++Sst+fwyvz6JmluBVhql9jLciXFc+Pevc8OXRs7P/ZUAk5GY9dnhY/sXr+xZeXh+qf2hRs2lbmUMwg+QLc6HV3fhVkZgaLoaptEN4EwzDgMEjExTcuDjQdKVLW9cvnT5h6lUpq1WnYBbGYUIAphOEtzkcCvjcFJZJJPZnFD6JQCvNhWiJKikasri3S09GxZ3dH9uWXZbHEegBGAGRzpfQralCCeZQSqTg8lNWIkUMpn81kPH95ebkWgoUGAqSSGdO2Q5ZoqQq01GCENhXidyhRJkHEFrDdNOQCsFEXpIZfKtnZm27U3LZRigWsspi04iebo2UdHjw+dx6dw/qIwNQ8YxQAw4TgpR6INbDrQGosCHaVvI2fln3v1xsG32cinQqwZyo7x4EzOMfbXJKzL0GxBhALcyCm5aIAYHIRRaSnDLhowjxCJEMVPsXETvfGT2cgHUmCoEy1Y+1rhjydI3uZ14jwA6FgJh4KHmXgZlDIxbiEQAbtlQSiESAWzbQZGXtjx7YgWdQSI1qJ6lT7KFcjSvvX0vCP0SgA49D/XqBGIRgDIObtqIIwHGLcQihNISuWT+wSfqAwtmKtGgaOIqXYtXeYl0Zgc0/tRKQXgN1N0KpIxg2gkAADdNKKUgggCpRLpYLixcM7u16OYt37t6/Vgqn39RK1WNhEDQqMOvTUIpCctJQkPD4Bwi9KC0RGum9PRH37zDp2uhkeBzukLvqvW/JDO5QRXHUgQBPK+G0G+AcwuUUHBmQkoJEfjgzFzTM/+uBTNOl0ZwU5tv6+w6bDnOQRlHOgoC1KsVRJGAlUgDhIAZDGHgAdDJfDr73AwSA9bNScq9UTrXstdg/IRWCrEQqFcrAAgYt2BwEzKOIUIfzGAzjjL1WHRLKddz/9pa+8KuHYybo4QSyEhAhD4sOwHGGKhhQEYRbG4dn/pLNKjQ4S3HaXnJA6dyxeJr1DAibpogAAil4HYSluWAUvLd+PjIJzNILBH/r9xe1NP7aTZf+kApSKmBMAwQ+r4MPO8rbtrb7l3xeG06CTOnGeTNBiEZOXT+793VkfFvvdHL/aHXGJ2suj+3FgrfL1u1bkY4xVqBbN/wsNvKaN8bX/9w228rezat7b6ig5Okf12fzpl2VcbUj3QIaI1rxQYoBQi5fhm7MeG0BrS6PlfXTZBRBmpQUAKnLuPMf8dYHAEh/FyxAAAAAElFTkSuQmCC
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/504984/Milk.user.js
// @updateURL https://update.greasyfork.org/scripts/504984/Milk.meta.js
// ==/UserScript==



(function () {

    function JobPrototype(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.distance = 0;
    };

    JobPrototype.prototype = {
        calculateDistance: function () {
            this.distance = Map.calcWayTime({ x: this.x, y: this.y }, Character.position);
        }
    };


    Milk = {
        window: null,
        states: "stop",
        stage: null,
        runOpening: false,
        jobsLoaded: false,
        allJobs: [],
        addedJobs: [],
        jobFilter: { filterJob: "" },
        jobTablePosition: { content: "0px", scrollbar: "0px" },
        boxID: 0,
        energyID: 0,
        shopInv: [],
        ubpLetters: [],
        energyArray: [],
        healthArray: [],
        healthID: 2117000, // Deafualt duża czerwona potka
        start: false,
        multiFunction: false,
    };



    Milk.selectTab = function (key) {
        Milk.window.tabIds[key].f(Milk.window, key);
    };

    Milk.removeActiveTab = function (window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };

    Milk.addActiveTab = function (key, window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };

    Milk.removeWindowContent = function () {
        $(".Milk2window").remove();
    };

    Milk.addJobTableCss = function () {
        $(".Milk2window .jobIcon").css({ "width": "80px" });
        $(".Milk2window .jobName").css({ "width": "150px" });
        $(".Milk2window .jobXp").css({ "width": "40px" });
        $(".Milk2window .jobMoney").css({ "width": "40px" });
        $(".Milk2window .jobMotivation").css({ "width": "40px" });
        $(".Milk2window .jobDistance").css({ "width": "100px" });
        $(".Milk2window .row").css({ "height": "60px" });
        $('.Milk2window').find('.tw2gui_scrollpane').css('height', '250px');
    };

    Milk.runnableTableCss = function () {
        $(".Milk2window #runnable_overview").css({
            "text-align": "center"
        });
        $(".Milk2window #runnable_overview .tw2gui_checkbox").css({
            "font-size": "14px",
            "font-weight": "bold",
            "text-align": "center",
            "margin": "20px 20px 20px 20px"
        });
    };


    Milk.createWindow = async function () {
        var window = wman.open("Milk").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("Milk");
        var content = $('<div class=\'Milk2window\'/>');
        var tabs = {
            "runnable": "Runnable",
            "jobs": "Jobs",
            "settings": "Settings"
        };
        var tabLogic = function (win, id) {
            var content = $('<div class=\'Milk2window\'/>');
            switch (id) {
                case "runnable":
                    Milk.removeActiveTab(this);
                    Milk.removeWindowContent();
                    Milk.addActiveTab("runnable", this);
                    content.append(Milk.createRunnableGui());
                    Milk.window.appendToContentPane(content);
                    Milk.runnableTableCss();
                    break;

                case "jobs":
                    Milk.loadJobData(function () {
                        Milk.removeActiveTab(this);
                        Milk.removeWindowContent();
                        Milk.addActiveTab("jobs", this);
                        content.append(Milk.createJobsTab());
                        Milk.window.appendToContentPane(content);
                        Milk.addJobTableCss();
                        $(".Milk2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": Milk.jobTablePosition.content });
                        $(".Milk2window .tw2gui_scrollbar_pulley").css({ "top": Milk.jobTablePosition.scrollbar });
                    });
                    break;
                case "settings":
                    Milk.removeActiveTab(this);
                    Milk.removeWindowContent();
                    Milk.addActiveTab("settings", this);
                    content.append(Milk.createSettingsGui());
                    Milk.window.appendToContentPane(content);
                    break;
            }
        }
        for (var tab in tabs) {
            window.addTab(tabs[tab], tab, tabLogic);
        }
        Milk.window = window;
        Milk.selectTab("runnable");
        return new Promise(resolve => {
            resolve();
        });
    };

    Milk.isNumber = function (potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };

    Milk.createSettingsGui = function () {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");

        var htmlItemID = $("<div></div>");
        htmlItemID.append("<span> Item ID to open </span>");
        var itemIDTextfiled = new west.gui.Textfield("itemId");
        itemIDTextfiled.setValue(Milk.boxID);
        itemIDTextfiled.setWidth(100);
        htmlItemID.append(itemIDTextfiled.getMainDiv());

        var htmlEnergyID = $("<div></div>");
        htmlEnergyID.append("<span> Energy ID to buy from shop </span>");
        var energyIDTextfiled = new west.gui.Textfield("energyID");
        energyIDTextfiled.setValue(Milk.energyID);
        energyIDTextfiled.setWidth(100);
        htmlEnergyID.append(energyIDTextfiled.getMainDiv());

        var htmlConfig = $("<div></div>");
        htmlConfig.append("<span> Past config there: </span>");
        var configTextfiled = new west.gui.Textfield("Config");
        configTextfiled.setWidth(300);
        htmlConfig.append(configTextfiled.getMainDiv());



        var buttonApply = new west.gui.Button("Save", function () {

            if (Milk.isNumber(itemIDTextfiled.getValue())) {
                var itemID = parseInt(itemIDTextfiled.getValue());
                Milk.boxID = itemID;
            }
            //52136000

            if (Milk.isNumber(energyIDTextfiled.getValue())) {
                var energyID = parseInt(energyIDTextfiled.getValue());
                Milk.energyID = energyID;
            }

            Milk.setSettings();
            Milk.selectTab("settings");
        })

        var buttonApply1 = new west.gui.Button("Clear All", function () {


            Milk.energyID = 0;
            energyIDTextfiled.setValue(Milk.energyID);

            Milk.boxID = 0;
            itemIDTextfiled.setValue(Milk.boxID);

            Milk.selectTab("settings");
        })

        var buttonApply2 = new west.gui.Button("Reload Config", function () {

            localStorage.setItem('Milk',configTextfiled.getValue() );
            function delayedFunction() {
                location.reload();
  
            }
            setTimeout(delayedFunction, 2000)
        })

        var buttonApply3 = new west.gui.Button("Download Config", function () {

            if (localStorage.getItem('Milk')) {
                console.log("Skopiuj całość znajdującą się pomiędzy liniami");
                console.log("----------------------------------------------");
                console.log(localStorage.getItem('Milk'));
                console.log("----------------------------------------------");
                console.log("Skopiuj całość znajdującą się pomiędzy liniami");
            }else{
                console.log("Brak konfigu");
            }

        })


        htmlSkel.append(htmlItemID);
        htmlSkel.append("<br>");
        htmlSkel.append(htmlEnergyID);
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply1.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(htmlConfig);
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply2.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply3.getMainDiv());
        return htmlSkel;
    };

    Milk.setSettings = function () {
        var temporaryObject = {
            addedJobs: Milk.addedJobs,
            boxID: Milk.boxID,
            energyID: Milk.energyID
        };
        var jsonTemporary = JSON.stringify(temporaryObject);
        const encrypted = CryptoJS.AES.encrypt(jsonTemporary, 'Sylwia').toString();
        localStorage.setItem('Milk', encrypted);


    };

    Milk.getSettings = function () {
        var settingsG = 0;
        if (localStorage.getItem('Milk')) {
            var storageLog = localStorage.getItem('Milk')
            var decrypted = CryptoJS.AES.decrypt(storageLog, 'Sylwia').toString(CryptoJS.enc.Utf8);
            settingsG = decrypted;
            console.log(
                "Reading a config"
            )
        }
        if (settingsG != 0) {
            var tempObject = JSON.parse(settingsG);
            var tmpAddedJobs = tempObject.addedJobs;
            for (var j = 0; j < tmpAddedJobs.length; j++) {
                var jobP = new JobPrototype(tmpAddedJobs[j].x, tmpAddedJobs[j].y, tmpAddedJobs[j].id);
                jobP.distance = tmpAddedJobs[j].distance;
                Milk.addedJobs.push(jobP);
            }


            Milk.boxID = tempObject.boxID;
            Milk.energyID = tempObject.energyID;
        }
        console.log("Config loaded");
    };



    Milk.createJobsTab = function () {
        var htmlSkel = $("<div id = \'jobs_overview'\></div>");
        var html = $("<div class = \'jobs_search'\ style=\'position:relative;'\><div id=\'jobFilter'\style=\'position:absolute;top:10px;left:15px'\></div><div id=\'job_only_silver'\style=\'position:absolute;top:10px;left:200px;'\></div><div id=\'job_no_silver'\style=\'position:absolute;top:10px;left:270px;'\></div><div id=\'job_center'\style=\'position:absolute;top:10px;left:350px;'\></div><div id=\'button_filter_jobs'\style=\'position:absolute;top:5px;left:350px;'\></div><div id=\'button_clear_jobs'\style=\'position:absolute;top:5px;left:450px;'\></div></div>");
        var table = new west.gui.Table();
        var uniqueJobs = Milk.getAllUniqueJobs();
        var selectedValue = 0
        table.addColumn("jobIcon", "jobIcon").addColumn("jobName", "jobName").addColumn("jobAdd", "jobAdd");
        table.appendToCell("head", "jobIcon", "Job icon").appendToCell("head", "jobName", "Job name").appendToCell("head", "jobAdd", "");
        for (var job = 0; job < uniqueJobs.length; job++) {
            for (var i = 0; i < Milk.addedJobs.length; i++) {
                if (uniqueJobs[job].id === Milk.addedJobs[i].id) {
                    //console.log("To ta praca o id");
                    selectedValue = Milk.addedJobs[i].id
                    //console.log(Milk.addedJobs[i].id);
                }
            }
            if (selectedValue == uniqueJobs[job].id) {
                table.appendRow().appendToCell(-1, "jobIcon", Milk.getJobIcon(false, uniqueJobs[job].id, uniqueJobs[job].x, uniqueJobs[job].y)).appendToCell(-1, "jobName", Milk.getJobName(uniqueJobs[job].id));
            }
        }
        for (var job = 0; job < uniqueJobs.length; job++) {
            if (selectedValue != uniqueJobs[job].id) {
                table.appendRow().appendToCell(-1, "jobIcon", Milk.getJobIcon(false, uniqueJobs[job].id, uniqueJobs[job].x, uniqueJobs[job].y)).appendToCell(-1, "jobName", Milk.getJobName(uniqueJobs[job].id)).appendToCell(-1, "jobAdd", Milk.createAddJobButton(uniqueJobs[job].x, uniqueJobs[job].y, uniqueJobs[job].id));
            }
        }
        var textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Select job name");
        if (Milk.jobFilter.filterJob != "") {
            textfield.setValue(Milk.jobFilter.filterJob);
        }
        var buttonFilter = new west.gui.Button("Filter", function () {
            Milk.jobFilter.filterJob = textfield.getValue();
            Milk.jobTablePosition.content = "0px";
            Milk.jobTablePosition.scrollbar = "0px";
            Milk.selectTab("jobs");
        });
        var buttonClear = new west.gui.Button("unSelect", function () {
            Milk.addedJobs = []
            Milk.jobTablePosition.content = "0px";
            Milk.jobTablePosition.scrollbar = "0px";
            Milk.selectTab("jobs");
        });



        htmlSkel.append(table.getMainDiv());
        $('#jobFilter', html).append(textfield.getMainDiv());
        $("#button_filter_jobs", html).append(buttonFilter.getMainDiv());
        $("#button_clear_jobs", html).append(buttonClear.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };

    Milk.createAddJobButton = function (x, y, id) {
        var buttonAdd = new west.gui.Button("Select", function () {
            Milk.addJob(x, y, id);
            Milk.AktualnyX = x
            Milk.AktualnyY = y
            Milk.jobTablePosition.content = $(".Milk2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            Milk.jobTablePosition.scrollbar = $(".Milk2window .tw2gui_scrollbar_pulley").css("top");
            Milk.selectTab("jobs");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };

    Milk.addJob = function (x, y, id) {
        Milk.addedJobs = []
        Milk.addedJobs.push(Milk.findJob(x, y, id));
    };



    Milk.quests = async function () {
        Milk.stage = await Milk.checkStage();
        console.log(Milk.stage);

        switch (Milk.stage) {
            case "1_0":

                console.log("Wykonuje zadanie 1_0 tutorialu");
                Milk.clickBtnAcceptLinearQuest();
                console.log("Nastąpiło zakceptowanie");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakończenie zadania");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.closeWindow(".report")
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();
                break;

            case "1_1":

                console.log("Wykonuje zadanie 1_1 tutorialu");
                Milk.clickBtnAcceptLinearQuest();
                console.log("Nastąpiło zakceptowanie");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.symulateClickC(".button.duels.background");
                console.log("Nastąpiło przejscie do pojedynkow");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.symulateClickCExtendedCC(".dl_row1", ".dl_fightbutton");
                console.log("Wykonuje zadanie 1_1 tutorialu");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.closeWindow(".active_tab_id_npcduel")
                console.log("Zamkniecie okna pojedynkow");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();

                break;
            case "1_2":

                console.log("Wykonuje zadanie 1_2 tutorialu");
                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.symulateClickC(".char_links.skills");
                console.log("Wejscie do skili");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.symulateClickCExtendedIC("ske_skillbox-health", ".skillicon");
                console.log("Rozdanie punktu");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.symulateClickC(".sk_button_accept")
                console.log("Zapisanie punktów");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.closeWindow(".active_tab_id_expert");
                console.log("Zamkniecie okna");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();

                break;

            case "1_3":

                console.log("Wykonuje zadanie 1_3 tutorialu");

                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                JobWindow.startJob(128, 44419, 17873, 15);
                console.log("Zacznij pracować");
                await new Promise(r => setTimeout(r, 25000));
                console.log("Koniec pracy");
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();

                break;

            case "1_4":

                console.log("Wykonuje zadanie 1_4 tutorialu");
                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                for (var i = 0; i < 2; i++) {
                    JobWindow.startJob(130, 44169, 17887, 15);
                }
                console.log("Zacznij pracować");
                await new Promise(r => setTimeout(r, 50000));
                console.log("Koniec pracy");
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();

                break;

            case "1_5":

                console.log("Wykonuje zadanie 1_5 tutorialu");

                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.symulateClickC(".char_links.skills");
                console.log("Wejscie do skili");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.symulateClickCExtendedCC(".sk_content_row_strength", ".attricon")
                console.log("Rozdanie sily");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.symulateClickC(".sk_button_accept")
                console.log("Zapisanie punktów");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.closeWindow(".active_tab_id_expert");
                console.log("Zamkniecie okna");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();

                break;

            case "1_6":

                console.log("Wykonuje zadanie 1_6 tutorialu");

                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                console.log("Pracuj");
                while (Bag.search("Przekłuta ryba").length < 1) {
                    JobWindow.startJob(127, 43879, 17869, 15);
                    await new Promise(r => setTimeout(r, 25000));
                }
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();

                break;

            case "1_7":

                console.log("Wykonuje zadanie 1_7 tutorialu");
                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();

                break;

            case "1_8":

                console.log("Wykonuje zadanie 1_8 tutorialu");

                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Wear.carry(Bag.getItemByItemId(41031000));
                console.log("Zakładam item");
                await new Promise(r => setTimeout(r, 4 * Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();

                break;

            case "1_9":

                console.log("Wykonuje zadanie 1_9 tutorialu");

                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                console.log("Pracuj");
                while (Bag.search("Mielona kawa").length < 1) {
                    JobWindow.startJob(129, 43638, 17956, 15);
                    await new Promise(r => setTimeout(r, 25000));
                }
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));

                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.quests();


                break;

            case "1_10":

                console.log("Wykonuje zadanie 1_10 tutorialu");
                Milk.clickBtnAcceptLinearQuest();
                console.log("Zaakceptuj");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło zakonczenie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                Milk.clickBtnFinishLinearQuest();
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, 2 * Milk.cooldownChanged()));
                Milk.symulateClickCExtendedCC(".tutorial_end", ".tw2gui_button")
                console.log("Nastąpiło przejscie dalej");
                await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                wman.closeAll();
                Milk.quests();



                break;
            default:
                if(Milk.multiFunction){
                    await new Promise(r => setTimeout(r, Milk.cooldownChanged()));
                    Milk.start = true;
                    Milk.infinityWork();
                }else{
                console.log("Cos poszło nie tak");
                }
                break;
        }
    }

    Milk.cooldownChanged = function () {
        var min = 2200;
        var max = 2600;
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    Milk.symulateClickC = async function (typeOfClick) {
        var targetDiv = document.querySelector(typeOfClick); // .accept-linearquest wskazuje na element z tą klasą
        if (targetDiv) {
            var event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            });
            targetDiv.dispatchEvent(event);
            console.log("Symulowano kliknięcie na div z klasą ''.");
            console.log(typeOfClick)
        } else {
            console.log("Nie znaleziono elementu z klasą ''.");
            console.log(typeOfClick);
        }
    }

    Milk.symulateClickCExtendedCC = async function (parentDivName, typeOfClick) {
        var parentDiv = document.querySelector(parentDivName);
        if (parentDiv) {
            var targetDiv = parentDiv.querySelector(typeOfClick); // .accept-linearquest wskazuje na element z tą klasą
            if (targetDiv) {
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                targetDiv.dispatchEvent(event);
                console.log("Symulowano kliknięcie na div z klasą ''.");
                console.log(typeOfClick)
            } else {
                console.log("Nie znaleziono elementu z klasą ''.");
                console.log(typeOfClick);
            }
        }
    }

    Milk.symulateClickCExtendedIC = async function (parentDivName, typeOfClick) {
        var parentDiv = document.getElementById(parentDivName);
        if (parentDiv) {
            var targetDiv = parentDiv.querySelector(typeOfClick); // .accept-linearquest wskazuje na element z tą klasą
            if (targetDiv) {
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                targetDiv.dispatchEvent(event);
                console.log("Symulowano kliknięcie na div z klasą ''.");
                console.log(typeOfClick)
            } else {
                console.log("Nie znaleziono elementu z klasą ''.");
                console.log(typeOfClick);
            }
        }
    }

    Milk.closeWindow = async function (nameOfWindow) {
        var parentDiv = document.querySelector(nameOfWindow);
        if (parentDiv) {
            var targetDiv = parentDiv.querySelector(".tw2gui_window_buttons_close"); // .accept-linearquest wskazuje na element z tą klasą
            if (targetDiv) {
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                targetDiv.dispatchEvent(event);
                console.log("Symulowano kliknięcie na div z klasą 'tw2gui_window_buttons_close'.");
            } else {
                console.log("Nie znaleziono elementu z klasą 'tw2gui_window_buttons_close'.");
            }
        }

    }

    Milk.clickBtnAcceptLinearQuest = async function () {
        Milk.symulateClickC(".accept-linearquest");
    }

    Milk.clickBtnFinishLinearQuest = async function () {
        Milk.symulateClickC(".finish-linearquest");
    }

    Milk.checkStage = async function () {
        var idStart = 'linear_quest_';
        var divs = document.querySelectorAll('div[id^="' + idStart + '"]');

        if (divs.length > 0) {
            for (let div of divs) {  // Zamiast forEach używamy for-of
                var fullId = div.id;
                var idSuffix = fullId.substring(idStart.length);
                console.log('Znaleziono div z ID: "' + fullId + '". Reszta ID to: "' + idSuffix + '".');
                return idSuffix;  // Zwracamy idSuffix i przerywamy pętlę
            }
        } else {
            console.log('Nie znaleziono żadnego div z ID zaczynającym się od "' + idStart + '".');
        }

        return null;  // Wartość domyślna, jeśli żaden element nie zostanie znaleziony
    }


    Milk.openBoxes = async function () {
        //54038000
        var boxCount = Bag.getItemCount(Milk.boxID);
        while (Milk.runOpening && boxCount > 0) {
            boxCount = Bag.getItemCount(Milk.boxID);
            ItemUse.doIt(Milk.boxID);
            await new Promise(r => setTimeout(r, 300));
            $(".tw2gui_dialog_framefix").remove();
            await new Promise(r => setTimeout(r, 900));
        }
    }

    Milk.loadJobs = async function () {
        if (!Milk.jobsLoaded) {
            //new UserMessage("Ladowanie prac", UserMessage.TYPE_HINT).show();

            // Pobieranie danych minimapy
            const mapData = await new Promise((resolve, reject) => {
                Ajax.get('map', 'get_minimap', {}, function (r) {
                    resolve(r);
                });
            });


            var tiles = [];
            var jobs = [];
            var index = 0;
            var currentLength = 0;
            var maxLength = 299;

            for (var jobGroup in mapData.job_groups) {
                var group = mapData.job_groups[jobGroup];
                var jobsGroup = JobList.getJobsByGroupId(parseInt(jobGroup));

                for (var tilecoord = 0; tilecoord < group.length; tilecoord++) {
                    var xCoord = Math.floor(group[tilecoord][0] / Map.tileSize);
                    var yCoord = Math.floor(group[tilecoord][1] / Map.tileSize);

                    if (currentLength === 0) {
                        tiles[index] = [];
                    }
                    tiles[index].push([xCoord, yCoord]);
                    currentLength++;

                    if (currentLength === maxLength) {
                        currentLength = 0;
                        index++;
                    }

                    for (var i = 0; i < jobsGroup.length; i++) {
                        jobs.push(new JobPrototype(group[tilecoord][0], group[tilecoord][1], jobsGroup[i].id));
                    }
                }
            }

            // Ładowanie danych na mapie
            await new Promise((resolve, reject) => {
                let toLoad = tiles.length;
                let loaded = 0;

                for (let blocks = 0; blocks < tiles.length; blocks++) {
                    Map.Data.Loader.load(tiles[blocks], function () {
                        loaded++;
                        if (loaded === toLoad) {
                            Milk.jobsLoaded = true;
                            Milk.allJobs = jobs;
                            resolve();
                        }
                    });
                }
            });
        }
    };


    Milk.loadJobData = function (callback) {
        Ajax.get('work', 'index', {}, function (r) {
            if (r.error) {
                //console.log(r.error);
                return;
            }
            JobsModel.initJobs(r.jobs);
            callback();
        });
    };

    Milk.getJobName = function (id) {
        return JobList.getJobById(id).name;
    };

    Milk.getAllUniqueJobs = function () {
        var jobs = [];
        for (var i = 0; i < Milk.allJobs.length; i++) {
            var currentJob = Milk.allJobs[i];
            if (Milk.jobFilter.filterJob != "") {
                if (!Milk.getJobName(currentJob.id).toLowerCase().includes(Milk.jobFilter.filterJob)) {
                    continue;
                }
            }
            if (!JobList.getJobById(currentJob.id).canDo()) {
                continue;
            }

            currentJob.calculateDistance();

            Milk.compareUniqueJobs(currentJob, jobs);
        }
        return jobs;
    };

    Milk.getJobIcon = function (silver, id, x, y) {
        var html = '<div class="centermap" onclick="Map.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';
        var silverHtml = "";
        if (silver) {
            silverHtml = '<div class="featured silver"></div>';
        }
        return '<div class="job" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div>' + silverHtml + html + '<img src="../images/jobs/' + JobList.getJobById(id).shortname + '.png" class="job_icon"></div>';
    };




    Milk.compareUniqueJobs = function (job, jobs) {
        for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].id == job.id) {
                if (job.distance < jobs[i].distance) {
                    jobs.splice(i, 1);
                    jobs.push(job);
                }
                return;
            }
        }
        jobs.push(job);
    };


    Milk.findJob = function (x, y, id) {
        for (var i = 0; i < Milk.allJobs.length; i++) {
            if (Milk.allJobs[i].id == id && Milk.allJobs[i].x == x && Milk.allJobs[i].y == y) {
                return Milk.allJobs[i];
            }
        }
    };

    // page 1

    Milk.createRunnableGui = function () {
        var htmlSkel = $("<div id=\'runnable_overview'\ style = \'padding:10px;'\></div>");

        var buttonApply = new west.gui.Button("Skip tutorial", function () {
            console.log("button clicked");
            Milk.quests();
        })

        var buttonApply3 = new west.gui.Button("Work Work Work", function () {
            console.log("button clicked work work work");
            Milk.start = true;
            Milk.infinityWork();
        })

        var buttonApply4 = new west.gui.Button("Stop Stop Stop", function () {
            console.log("button clicked Stop Stop Stop");
            Milk.start = false;
        })

        var buttonApply5 = new west.gui.Button("Skip tutorial + Work Work Work", function () {
            console.log("button clicked Skip tutorial + Work Work Work");
            Milk.multiFunction = true;
            Milk.quests();
        })

        var buttonApply1 = new west.gui.Button("Manual Open Boxes", function () {
            console.log("button clicked open boxes");
            Milk.runOpening = true;
            Milk.openBoxes();
        })

        var buttonApply2 = new west.gui.Button("Stop Manual Open Boxes", function () {
            console.log("button clicked stop open boxes");
            Milk.runOpening = false;
        })

        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply1.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply2.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply3.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply4.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply5.getMainDiv());
        return htmlSkel;
    };
    Milk.openLetters = async function () {
        var yieldItems = Bag.getItemsByType('yield');

        // Filtruj elementy, które zawierają 'Obligacji' w 'action'
        for (var i = 0; i < yieldItems.length; i++) {
            if (yieldItems[i].obj && yieldItems[i].obj.action.includes('Obligacji')) {
                for (var z = 0; z < yieldItems[i].count; z++) {
                    Milk.ubpLetters.push(yieldItems[i].obj.item_id);
                }
            }
        }

        // Użycie przedmiotów z ubpLetters
        for (var j = Milk.ubpLetters.length - 1; j >= 0; j--) {
            ItemUse.doIt(Milk.ubpLetters[j]);
            // Usunięcie elementu po użyciu
            Milk.ubpLetters.pop();
            // Czekanie na zakończenie akcji
            await new Promise(r => setTimeout(r, 300));
            $(".tw2gui_dialog_framefix").remove();
            await new Promise(r => setTimeout(r, 900));
        }
    };

    Milk.createEnergyArray = async function () {
        if (Character.energy > 37) {
            return;
        }
        if (Milk.energyArray.length > 0 && Milk.energyArray[Milk.energyArray.length - 1].energyIncrease > 40) {
            return;
        }
        var yieldItems = Bag.getItemsByType('yield');

        // Przechowywanie przedmiotów z ich wartościami wzrostu energii
        Milk.energyArray = [];

        for (var i = 0; i < yieldItems.length; i++) {
            if (yieldItems[i].obj && yieldItems[i].obj.action.includes('Wzrost energii')) {
                // Wyrażenie regularne, aby znaleźć wartość procentową w opisie
                var match = yieldItems[i].obj.action.match(/Wzrost energii: (\d+)%/);
                if (match) {
                    var energyIncrease = parseInt(match[1]); // Konwersja na liczbę

                    // Dodajemy przedmiot wraz z wartością wzrostu energii
                    for (var z = 0; z < yieldItems[i].count; z++) {
                        Milk.energyArray.push({
                            item_id: yieldItems[i].obj.item_id,
                            energyIncrease: energyIncrease
                        });
                    }
                }
            }
        }

        Milk.energyArray.sort((a, b) => a.energyIncrease - b.energyIncrease);
        if (Milk.energyArray.length > 0 && Milk.energyArray[Milk.energyArray.length - 1].energyIncrease < 40) {
            Milk.buyEnergyFromUbp();
        }
        //console.log(Milk.energyArray);
    };


    Milk.createHealthArray = async function (healthPercent) {
        if (healthPercent > 50) {
            return;
        }
        if (Milk.healthArray.length > 0 && Milk.healthArray[Milk.healthArray.length - 1].healthIncrease > 49) {
            return
        }
        var yieldItems = Bag.getItemsByType('yield');

        // Przechowywanie przedmiotów z ich wartościami wzrostu energii
        Milk.healthArray = [];

        for (var i = 0; i < yieldItems.length; i++) {
            if (yieldItems[i].obj && yieldItems[i].obj.action.includes('Bonus Punkt\\u00f3w \\u017cycia')) {
                // Wyrażenie regularne, aby znaleźć wartość procentową w opisie
                var match = yieldItems[i].obj.action.match(/Bonus Punkt\\u00f3w \\u017cycia: (\d+)%/);
                if (match) {
                    var healthIncrease = parseInt(match[1]); // Konwersja na liczbę

                    // Dodajemy przedmiot wraz z wartością wzrostu energii
                    for (var z = 0; z < yieldItems[i].count; z++) {
                        Milk.healthArray.push({
                            item_id: yieldItems[i].obj.item_id,
                            healthIncrease: healthIncrease
                        });
                    }
                }
            }
        }

        Milk.healthArray.sort((a, b) => a.healthIncrease - b.healthIncrease);
        if (Milk.healthArray.length > 0 && Milk.healthArray[Milk.healthArray.length - 1].healthIncrease < 49) {
            Milk.buyHealthFromUbp();
        }
        console.log(Milk.healthArray);
    };

    Milk.buyHealthFromUbp = async function () {
        var foundItem = false;
        Ajax.remoteCallMode('shop_trader', 'index', {}, function (r) {
            if (r.error) {
                return;
            }
            Milk.shopInv = r.inventory;
            console.log(r.inventory);
            Milk.shopInv = [].concat(r.inventory.chests, r.inventory.equip, r.inventory.generic_sale, r.inventory.hot, r.inventory.trader, r.inventory.useables, r.inventory.veteran);
            foundItem = Milk.shopInv.find(function (item) {
                return item.item_id === Milk.healthID;
            });
            console.log(foundItem);
        });
        await new Promise(r => setTimeout(r, 300));

        if (!foundItem) {
            return;
        }

        if (foundItem.price_bonds > Character.upb) {
            return;
        }

        west.window.shop.requestBuy(1, foundItem.item_id);
        // Czekanie na zakończenie akcji
        await new Promise(r => setTimeout(r, 300));
        $(".tw2gui_dialog_framefix").remove();
        await new Promise(r => setTimeout(r, 900));
        Milk.createHealthArray(1);
    }

    Milk.buyEnergyFromUbp = async function () {
        var foundItem = false;
        Ajax.remoteCallMode('shop_trader', 'index', {}, function (r) {
            if (r.error) {
                return;
            }
            Milk.shopInv = r.inventory;
            console.log(r.inventory);
            Milk.shopInv = [].concat(r.inventory.chests, r.inventory.equip, r.inventory.generic_sale, r.inventory.hot, r.inventory.trader, r.inventory.useables, r.inventory.veteran);
            foundItem = Milk.shopInv.find(function (item) {
                return item.item_id === Milk.energyID;
            });
            console.log(foundItem);
        });
        await new Promise(r => setTimeout(r, 300));

        if (!foundItem) {
            return;
        }

        if (foundItem.price_bonds > Character.upb) {
            return;
        }

        west.window.shop.requestBuy(1, foundItem.item_id);
        // Czekanie na zakończenie akcji
        await new Promise(r => setTimeout(r, 300));
        $(".tw2gui_dialog_framefix").remove();
        await new Promise(r => setTimeout(r, 900));
        Milk.createEnergyArray();
    }


    Milk.usePremium = async function () {
        if (Bag.getItemCount(21341000) > 0) {
            //if (Premium.hasBonus('regen')) {
            if (Character.energy < 100) {
                ItemUse.doIt(21341000)
                await new Promise(r => setTimeout(r, 300));
                $(".tw2gui_dialog_framefix").remove();
                await new Promise(r => setTimeout(r, 900));
            }
        }
    }

    Milk.useEnergy = async function () {
        while (true) {
            if (Milk.canUseConsume(Milk.energyArray[Milk.energyArray.length - 1].item_id)) {
                ItemUse.doIt(Milk.energyArray[Milk.energyArray.length - 1].item_id);
                Milk.energyArray.pop();
                await new Promise(r => setTimeout(r, 300));
                $(".tw2gui_dialog_framefix").remove();
                await new Promise(r => setTimeout(r, 900));
                break;
            }
        }
    }

    Milk.canUseConsume = function (item_id) {
        if (BuffList.cooldowns[item_id] != undefined && BuffList.cooldowns[item_id].time > new ServerDate().getTime()) {
            Milk.states = "waiting for cooldown";
            return false;
        }
        Milk.states = "running";
        return true;
    };

    Milk.useHealth = async function () {
        while (true) {
            if (Milk.canUseConsume(Milk.healthArray[Milk.healthArray.length - 1].item_id)) {
                ItemUse.doIt(Milk.healthArray[Milk.healthArray.length - 1].item_id);
                Milk.healthArray.pop();
                await new Promise(r => setTimeout(r, 300));
                $(".tw2gui_dialog_framefix").remove();
                await new Promise(r => setTimeout(r, 900));
                break;
            }
        }
    }

    Milk.infinityWork = async function () {

        if (Milk.start) {
            Milk.states = "running";

            Milk.runOpening = true;
            Milk.openBoxes();

            Milk.usePremium();

            Milk.openLetters();
            //console.log(Milk.ubpLetters)
            var healthPercent = (Character.health * 100) / Character.maxHealth;
            await Milk.createHealthArray(healthPercent);
            if (healthPercent < 26) {
                await Milk.useHealth();
            }

            await Milk.createEnergyArray();
            var maxAddedJobs = 4;
            if (Character.energy == 0) {
                await Milk.useEnergy();
            }
            else if (Character.energy < 4) {
                maxAddedJobs = maxAddedJobs + (Character.energy - 4);
            }

            if (TaskQueue.queue.length < 2) {
                for (var i = 0; i < maxAddedJobs - TaskQueue.queue.length; i++) {
                    JobWindow.startJob(Milk.addedJobs[0].id, Milk.addedJobs[0].x, Milk.addedJobs[0].y, 15);
                }
            }

            await new Promise(r => setTimeout(r, 3000));
            Milk.infinityWork();
        }else{
            Milk.states = "stop";
            Milk.start = false;
        }
    }


    Milk.loadSettings = function () {
        function delay() {
            Milk.getSettings();
            Milk.loadJobs();
            Milk.shopReload();

        }
        setTimeout(delay, 2000);
    }

    Milk.shopReload = function () {
        west.window.shop.open();
        west.window.shop.close();
        Inventory.open();
        wman.closeAll();
    }

    Milk.createMenuIcon = function () {
        var menuimage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAwnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVDbDcMwCPz3FB2Blx08jtOkUjfo+MWGRHFTJI7HoTMm7Z/3Kz26EUqSvGippYCZVKnULFFwawMRZKAXNTic++kkyFpskb3UEvNHH08BD82yfBHSZxDrTFQJff0RIg/cN+r5FkI1hJicwBBo/i0oVZfrF9YdZlP31EF0XvtWL3a9Lds7TLQzMhgyqy/A3SVxs0QNrbBB5Gx5HghjFP0g/+50WPoC80pZKkUX8MYAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlRVoc7FBEIUN1sosWcSxVLIKF0lZo1cHk0i9o0pCkuDgKrgUHPxarDi7Oujq4CoLgB4izg5Oii5T4v7TQIsaD4368u/e4ewcIrRpTzYE4oGqWkUkmxHxhVfS9wo8wgohhXGKmnsou5uA6vu7h4etdlGe5n/tzBJWiyQCPSBxnumERbxDPblo6533iEKtICvE58ZRBFyR+5Lrc4TfOZYcFnhkycpl54hCxWO5juY9ZxVCJY8QRRdUoX8h3WOG8xVmtNVj3nvyFgaK2kuU6zTEksYQU0hAho4EqarAQpVUjxUSG9hMu/lHHnyaXTK4qGDkWUIcKyfGD/8Hvbs3SzHQnKZAABl9s+2MC8O0C7aZtfx/bdvsE8D4DV1rPX28Bc5+kN3ta5AgY3gYurnuavAdc7gDhJ10yJEfy0hRKJeD9jL6pAIzcAkNrnd66+zh9AHLU1fINcHAITJYpe93l3f7+3v490+3vB/iuctxhD/ETAAAOP2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQkIzMzg5RkM5Q0YxMUUyQUIxOEVCMjdBRTIyNEQyNiIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMmQ2ZDM0MS0zYmYxLTRjYjItYTNjYy0xZTM5NDgyMmFkOGEiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2RURBMDM5MTZCRkUxMUUwQUYyMjlEREI3OTE0ODQ2RSIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzI0NTA3NzA4MDgzMjQ4IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzgiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjA4OjI0VDE1OjU1OjA4KzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowODoyNFQxNTo1NTowOCswMjowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk5ZWRiNDhlLWM2ZWMtNGY2Ni1iZGI3LThmNDk2MjhiODg5ZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wOC0yNFQxNTo1NTowOCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgIDx4bXBNTTpEZXJpdmVkRnJvbQogICAgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2RURBMDM5MTZCRkUxMUUwQUYyMjlEREI3OTE0ODQ2RSIKICAgIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OThBMzhDNkRDREM5RTIxMThDNzA4MDhERDkxNTc2M0IiLz4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PiFhakIAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfoCBgNNwgFGryrAAAEvElEQVRIx61We4hVRRz+Zs7Medz3vXvv6q677m0NyS3dNsNH9MAwDE2hJGwTWggJMpNIUFoSCkKEMCokUqEyCgmCrP7qj6CygugPISuEUBN3dR96d899nMecMzP9oaD7uKuB89cwZ77zne935vd9Q97e06+Hh0RVGcoHABAAADQADQWiQxhg0IoANAYMAik5jGt7lSbQACi5BgQAJQHCoCGdjtZchg2NVavJRL5v35HPzuI2jxf6N3SPVGonsfP5J0duBfDWgcHk0NCZXRcvnD526o9fD7oTF9//7fefdh394kjHXLidA5tHGJV6zpcPvL6ZbHl061PwwwFG5EYQgo72Tsg4Ru89fcjlWsoAXm6GpzoGo5LMSaLOcrRvLu4qdhdWBw0XSin4DReFYicmq5XTho4PzIUnWoIZc3DsProtdV9++Sst+fwyvz6JmluBVhql9jLciXFc+Pevc8OXRs7P/ZUAk5GY9dnhY/sXr+xZeXh+qf2hRs2lbmUMwg+QLc6HV3fhVkZgaLoaptEN4EwzDgMEjExTcuDjQdKVLW9cvnT5h6lUpq1WnYBbGYUIAphOEtzkcCvjcFJZJJPZnFD6JQCvNhWiJKikasri3S09GxZ3dH9uWXZbHEegBGAGRzpfQralCCeZQSqTg8lNWIkUMpn81kPH95ebkWgoUGAqSSGdO2Q5ZoqQq01GCENhXidyhRJkHEFrDdNOQCsFEXpIZfKtnZm27U3LZRigWsspi04iebo2UdHjw+dx6dw/qIwNQ8YxQAw4TgpR6INbDrQGosCHaVvI2fln3v1xsG32cinQqwZyo7x4EzOMfbXJKzL0GxBhALcyCm5aIAYHIRRaSnDLhowjxCJEMVPsXETvfGT2cgHUmCoEy1Y+1rhjydI3uZ14jwA6FgJh4KHmXgZlDIxbiEQAbtlQSiESAWzbQZGXtjx7YgWdQSI1qJ6lT7KFcjSvvX0vCP0SgA49D/XqBGIRgDIObtqIIwHGLcQihNISuWT+wSfqAwtmKtGgaOIqXYtXeYl0Zgc0/tRKQXgN1N0KpIxg2gkAADdNKKUgggCpRLpYLixcM7u16OYt37t6/Vgqn39RK1WNhEDQqMOvTUIpCctJQkPD4Bwi9KC0RGum9PRH37zDp2uhkeBzukLvqvW/JDO5QRXHUgQBPK+G0G+AcwuUUHBmQkoJEfjgzFzTM/+uBTNOl0ZwU5tv6+w6bDnOQRlHOgoC1KsVRJGAlUgDhIAZDGHgAdDJfDr73AwSA9bNScq9UTrXstdg/IRWCrEQqFcrAAgYt2BwEzKOIUIfzGAzjjL1WHRLKddz/9pa+8KuHYybo4QSyEhAhD4sOwHGGKhhQEYRbG4dn/pLNKjQ4S3HaXnJA6dyxeJr1DAibpogAAil4HYSluWAUvLd+PjIJzNILBH/r9xe1NP7aTZf+kApSKmBMAwQ+r4MPO8rbtrb7l3xeG06CTOnGeTNBiEZOXT+793VkfFvvdHL/aHXGJ2suj+3FgrfL1u1bkY4xVqBbN/wsNvKaN8bX/9w228rezat7b6ig5Okf12fzpl2VcbUj3QIaI1rxQYoBQi5fhm7MeG0BrS6PlfXTZBRBmpQUAKnLuPMf8dYHAEh/FyxAAAAAElFTkSuQmCC';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=Milk.createWindow(); title="Milk" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };


    $(document).ready(function () {
        try {
            Milk.loadSettings();
            Milk.createMenuIcon();
        } catch (e) {
            console.log("exception occured");
        }
    });


})();















// ToDo
/*
+ Find a function to get the stay of tutorial
+- Create a function to check requirements
+ Create switch for each stage a do step by step

- work while have a energy 
- if no energy try buy energy
- check Ubp 
- open all boxes
- open all Ubp boxes
- if hp close to 26% try buy hp

31615 - line of tutorial code
*/
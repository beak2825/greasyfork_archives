// ==UserScript==
// @name           XioScript
// @namespace      Virtonomics
// @description    XioScript with AjaxButtons and TopManagerInfo
// @version        7.3
// @include        http://*virtonomic*.*/*/*
// @downloadURL https://update.greasyfork.org/scripts/2039/XioScript.user.js
// @updateURL https://update.greasyfork.org/scripts/2039/XioScript.meta.js
// ==/UserScript==

function XioScript(){
    
    function addJQueryUI(){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css";
        document.head.appendChild(link);

        var script = document.createElement("script");
        script.setAttribute("src", 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js');
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "(" + XioScript.toString() + ")();";
            document.head.appendChild(script);
        }, false);
        document.head.appendChild(script);
    }
    
    if(!window.jQuery.ui){
        addJQueryUI();
        return false;
    }
    
    console.log("XioScript is running!");
    
    /*
     * more suggestions to the Xio script: 

        - in warehouses:  "set selling price to prime cost"

        - stock removal assistant (for producing subdivisions) : at the production screen ofclick the red truck symbol to send products away to a warehouse. My suggestion is that when clicking this button, the script will take the stocked quantity, deduct the required quantity and set the entry box in the popup window to the remaining quantity; this would serve especially well in restaurants and medical centres!). But better to take take this to the next level directly by requesting a code added to the end of the warehouse name, for example RGW (returned goods warehouse) so all different excess goods would be sent automatically into their respective warehouses trough one simple button click. This will be a bigger timesaver than your amazing building-funcion.

        - add the required worker qualification for top-maxing onto the employee management page
        - make the list sortable by the green "percentage of city salary"
        - restaurant and hospital cleanup
    
        - filters --> https://greasyfork.org/scripts/1535-virtonomica-%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D1%8F%D0%BC%D0%B8/code
    
        - open after construction
        - send a message when a factory's supply is set but exceeds the amount available
        - alternative for multiple suppliers
        - optional qualification for main subdivision screen
                
        - Advertisement formula!
    
    */        
   
    //Usefull stuff        
    function numberfy(variable){
        return parseFloat(String(variable).replace(/[\s\$\%]/g, "")) || 0;
    }
        
    function spaces(value){
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a === null || b === null) return false;
        if (a.length !== b.length) return false;

        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }
    
    function setLog(){
        var logger = $("#consolelog")[0];
        log = function (message) {
            var bottom = logger.scrollTop + logger.offsetHeight === logger.scrollHeight;
            if (typeof message === 'object') {
                logger.innerHTML += JSON.stringify(message) + '<br />';
            } 
            else{
                logger.innerHTML += message + '<br />';
            }
            if(bottom){
                logger.scrollTop = logger.scrollHeight - logger.offsetHeight;
            }
        };
    }
    
    $.fn.ashow = function(){
        var div = this;
        var logger = $("#consolelog")[0];
        var hidden = div[0].style.display;
        var nowHeight = div.show().css("height");
        if(hidden === "none"){
            logger.scrollTop = logger.scrollHeight - logger.offsetHeight;
        }
        div.css("height", "100%");
        var realHeight = div.css("height");
        div.css("height", nowHeight);
        div.stop().animate({height:realHeight}, 500, function(){
            div.css("height", "100%");
        });
    };
    
    $.fn.ahide = function(){
        var div = this;
        div.stop().animate({height:"0px"}, 500, function(){div.hide();});
    };
    
    //Top1 and Top3      
    function subdType(){
        var link = $("#unitImage").find($("img")).attr('src');

        var n = link.indexOf('animalfarm');
        if (n > 0) return "farm";

        n = link.indexOf('orchard');
        if (n > 0) return "plantation";

        n = link.indexOf('restaurant');
        if (n > 0) return "restaurant";

        n = link.indexOf('service_light');
        if (n > 0) return "service";

        n = link.indexOf('medicine');
        if (n > 0) return "medical";

        n = link.indexOf('fishingbase');
        if (n > 0) return "fishing";

        n = link.indexOf('lab');
        if (n > 0) return "laboratory";

        n = link.indexOf('workshop');
        if (n > 0) return "factory";

        n = link.indexOf('shop');
        if (n > 0) return "shop";

        n = link.indexOf('office');
        if (n > 0) return "office";

        n = link.indexOf('mill');
        if (n > 0) return "mill";

        n = link.indexOf('mine');
        if (n > 0) return "mine";
        
        n = link.indexOf('farm');
        if (n > 0) return "agriculture";
        
        n = link.indexOf('power');
        if (n > 0) return "power";
        
        return "unknow";
    }
      
    function subdFactor(){
        var factor = 0;
        switch(subdType()){
            case "mine":
                factor = 8;
                break;
            case "power":
                factor = 6;
                break;
            case "factory":
            case "mill":
                factor = 4;
                break;
            case "agriculture":  //fall-trough
                factor = 1.6;
                break;
            case "plantation":
                factor = 1.2;
                break;
            case "medical":  //fall-trough
            case "fishing":
                factor = 1;
                break;
            case "farm":
                factor = 0.6;
                break;
            case "restaurant": //fall-trough
            case "shop":
            case "laboratory":
                factor = 0.4;
                break;
            case "service":
                factor = 0.12;
                break;
            case "office":
                factor = 0.08;
                break;            
        }   
        return factor;
    }
    
    function calcTop1(empl, qual, factor){
        return Math.pow(5, 1/2*(-1-qual)) * Math.pow(7, 1/2*(-1+qual)) * Math.sqrt(empl / factor);
    }
    
    function calcTop3(empl, factor){
        return (-15*factor+Math.sqrt(225*factor*factor + 4*factor*empl))/(10*factor);
    }
    
    function calcQualification(empl, manager, factor){
        var value = -Math.log(empl/(35*factor*manager*manager))/Math.log(7/5);
        return Math.floor(value*100)/100;
    }
    
    function calcEmployees(qual, manager, factor){
        var value = Math.pow(5,1+qual) * Math.pow(7, 1-qual) * factor * manager * manager;
        return Math.floor(value);
    }
    
    function calcMaxEmployees(manager){        
        var f = subdFactor();        
        return 25 * f * manager * (manager + 3);
    }
    
    function calcMaxTech(manager){
        return Math.floor(Math.pow(manager*156.25, 1/3));
    }
    
    function calcManagerTech(techLevel){
        return Math.pow(techLevel, 3)/156.25;
    }
    
    function calcEquipment(qualification){
        return Math.floor(Math.pow(qualification, 1.5)*100)/100;
    }
    
    function calcEfficiency(employees, allEmployees, manager, factor, qualification, techLevel){
        var effi = [];
        effi[0] = 100;
        effi[1] = manager * calcMaxEmployees(manager) / allEmployees / calcTop1(employees, qualification, factor) * 100;
        effi[2] = manager / calcTop1(employees, qualification, factor) * 6/5 * 100;
        effi[3] = calcMaxEmployees(manager) / allEmployees * 6/5 * 100;
        effi[4] = manager / calcManagerTech(techLevel) * calcMaxEmployees(manager) / allEmployees * 100;
        effi[5] = manager / calcManagerTech(techLevel) * 6/5 * 100;
        
        console.log(effi);
        return (Math.round(Math.min.apply(null, effi)*10)/10).toFixed(2) + "%";
    }
    
    function placeText($place, text, value, special){
        if(special){
            $place.html("<span style='color:blue'>"+text+"<input id=customManager value="+value+" style='width:25px'></span><br>"+$place.html());
        }
        else{
            $place.html($place.html()+"<br><span style='color:purple'><b>"+value+"</b>"+text+"</span>");
        }
        
    }
    
    function makeRed($place, value, maxValue){
        if(value > maxValue){
            $place.css("color", "red");
        }
    }
            
    function seeTops(){
              
        var $qualRow = $("tr:contains('Qualification of employees'), tr:contains('Qualification of scientists'), \n\
                          tr:contains('Workers qualification')");
        var $levelRow = $("tr:contains('Qualification of player')");
        var $empRow = $("tr:contains('Number of employees'), tr:contains('Number of scientists'),\n\
                            tr:contains('Number of workers')");
        var $totalEmpRow = $("tr:contains('profile qualification')");
        var $techRow = $("tr:contains('Technology level'), tr:contains('Current research')");
        var $equipRow = $("tr:contains('Equipment quality'), tr:contains('Computers quality'),\n\
             tr:contains('Livestock quality'), tr:contains('Quality of agricultural machines')");
        var $effiRow =  $("tr:contains('Top manager efficiency')");       
        
        var amount = numberfy($empRow.find("td:eq(1)").text());
        var qual = numberfy($qualRow.find("td:eq(1)").text());
        var level = numberfy($levelRow.find("td:eq(1)").text());
        var factor = subdFactor();
        var totalEmp = numberfy($totalEmpRow.find("td:eq(1)").text());
        var tech = numberfy($techRow.find("td:eq(1)").text());
        var eqQual = numberfy($equipRow.find("td:eq(1)").text());
        
        var topQual = calcQualification(amount, level, factor);
        var topEmp = spaces(calcEmployees(qual, level, factor));
        var maxEmp = spaces(calcMaxEmployees(level));
        var topTech = calcMaxTech(level);
        var topEqQual = calcEquipment(qual);
        var effi = calcEfficiency(amount, totalEmp, level, factor, qual, tech);
        var top1 = Math.round(calcTop1(amount, qual, factor)*10)/10;
        var top3 = Math.round(calcTop3(totalEmp, factor)*10)/10;
        
        placeText($empRow.find("td:eq(1)")," (Maximum amount of employees with this employee qualification)", topEmp);       
        placeText($qualRow.find("td:eq(1)")," (Maximum employee qualification with this amount of employees)", topQual);
        placeText($totalEmpRow.find("td:eq(1)")," (Maximum amount of employees in all subdivisions)", maxEmp);
        placeText($techRow.find("td:eq(1)")," (Maximum technology level with this top manager qualification)", topTech);
        placeText($equipRow.find("td:eq(1)")," (Maximum equipment quality with this employee qualification)", topEqQual);
        placeText($effiRow.find("td:eq(1)")," (Expected top manager efficiency with these settings)", effi);
        placeText($levelRow.find("td:eq(1)")," (Top 1)", top1);
        placeText($levelRow.find("td:eq(1)")," (Top 3)", top3);
//        placeText($levelRow.find("td:eq(1)"), "Custom Qualification: ", level, true);
        
        makeRed($empRow.find("td:eq(0)"), amount, topEmp);
        makeRed($qualRow.find("td:eq(0)"), qual, topQual);
        makeRed($totalEmpRow.find("td:eq(0)"), totalEmp, maxEmp);
        makeRed($techRow.find("td:eq(0)"), tech, topTech);
        makeRed($equipRow.find("td:eq(0)"), eqQual, topEqQual);
        
//        $("body").delegate("#customManager", "change", function(){
//           $("span[style*=purple]").each(function(){
//               this.css("color", "blue");
//           });
//        });       
    }
    
    //Small overview settings    
    function industryQuality(){
        $("a div .c_qlt:nth-of-type(5)").each(function(){
            if(numberfy($(this).text()) > numberfy($(this).next().text()))
                $(this).css("background-color", "#E1F5E2");
            else
                $(this).css("background-color", "#F5E1F4");
        });
    }    
                          
    //Ajax
    function ajaxGet(count, prior, arr, url, varNames, multiple, selectors, editor, callback, before){
        if(typeof counts[count] === "undefined")
            counts[count] = 0;            
        counts[count]++;

        ajaxList(prior, function(){            
            $.ajax({
                url: url,
                dataType: "html"
            })
            .done(function(data){
                var $data = $(data);
                ajaxList(prior);
                counts[count]--;
                log(count+" left: "+counts[count]);

                for(var i = 0; i < varNames.length; i++){
                    var temp = $data.find(selectors[i]);
                    if(multiple[i]){
                        arr[varNames[i]] = [];
                        for(var j = 0; j < $(temp).length; j++){
                            arr[varNames[i]][j] = editor[i]($(temp).eq(j));
                        }
                    }
                    else{
                        arr[varNames[i]] = editor[i](temp);                        
                    }
                }
                if(callback){
                    callback(data);
                }

                if(counts[count] === 0){
                    log("Done! ("+count+")");  
                    countList();
                }

            })
            .fail(function(){
                counts[count]--;
                ajaxGet(count, prior, arr, url, varNames, multiple, selectors, editor, callback, before);
                setTimeout(function(){ajaxList(prior);}, 10000);
            });
        }, before);        
    }  

    function ajaxPost(count, prior, url, form, condition, callback, type, before){

        function done(data, text){
            counts[count]--;
            if(text === "console.log"){
                log(count+" left: "+counts[count]);
            }

            if(callback){
                callback(data);
            }

            if(counts[count] === 0){
                log("Done! ("+count+")");
                countList();
            }
        }

        if(typeof counts[count] === "undefined")
            counts[count] = 0;            
        counts[count]++;

        if(condition)
            setTimeout(function(){done();}, 1000);
        else
            ajaxList(prior, function(){
                $.post(url, form, function(){}, type) 
                .done(function(data){  
                    ajaxList(prior);              
                    done(data, "console.log");
                })            
                .fail(function(){
                    counts[count]--;
                    ajaxPost(count, prior, url, form, condition, callback, type, before);
                    setTimeout(function(){ajaxList(prior);}, 10000);
                });
            }, before);
    }

    function ajaxList(prio, func, before){
        if(typeof func === "function" && !before){
            ajaxData[prio].push(func);
        }
        else if(typeof func === "function" && before){
            ajaxData[prio].unshift(func);
        }
        else if(prio !== "STOP"){  
            if(prio === 0){
                if(ajaxData[prio][0]){
                    ajaxData[prio].shift()();
                    return false;
                }
            }
            else{
                for(var i = 1; i < ajaxData.length; i++){
                    if(ajaxData[i][0]){
                        ajaxData[i].shift()();
                        return false;
                    }
                }
            }
            setTimeout(function(){ajaxList(prio);}, 1);
        }            
    }

    function countList(count, toCall){
        if(count){                
            countData.unshift({"counts":count, "function":toCall}); 
        }
        else{
            for(var i = 0; i < countData.length; i++){
                if(countData[i]["counts"].every(function(element){ return counts[element] === 0;})){
                    countData[i]["counts"].every(function(element){ counts[element] = false;});
                    countData[i]["function"]();
                    countData[i]["function"] = function(){return false;}; 
                }
            }
        }       
    }

    function edit(type){
            var func;
            switch(type){
                case "": 
                    func = function(obj){return obj;};
                    break;
                case "text": 
                    func = function(obj){return obj.text().trim();};
                    break;
                case "val":
                    func = function(obj){return obj.val();};
                    break;
                case "alt":
                    func = function(obj){return obj.attr("alt");};
                    break;
                case "href":
                    func = function(obj){return obj.attr("href");};
                    break;
                case "src":
                    func = function(obj){return obj.attr("src");};
                    break;
                case "num":
                    func = function(obj){return numberfy(obj);};
                    break;
                case "textnum":
                    func = function(obj){return numberfy(obj.text());};
                    break;
                case "valnum":
                    func = function(obj){return numberfy(obj.val());};
                    break;                    
                case "textdigit":
                    func = function(obj){return parseFloat(obj.text().replace(/[^\d+|\.]/g, ""));};
                    break;
            }  
            return func;
        }
        
    function addHidden(form, button){
        return form.append(form.find(button).clone().wrap("<p></p>").parent().html().replace("submit","hidden"));
    }
    
    function convertIds(type, urls){
        $("#groupBaseDiv").ahide();
        if(!running){
            running = true;
            ajaxList(0);
        }
        
        var selection = $(".ui-selected");        
        var ids = [];
        for(var i = 0; i < selection.length; i++){
            ids[i] = numberfy(selection.eq(i).find(".unit_id").text());
            building[type][ids[i]] = {};            
            setUrl(type, ids[i], urls);
        }
        return ids;
    }
    
    function setUrl(type, id, url){
        
        var realm = readCookie('last_realm');
        
        var urls = {
            urlEquipment: "/REALM/window/unit/equipment/ID",
            urlTraining: "/REALM/window/unit/employees/education/ID",
            urlEmployee: "/REALM/window/unit/employees/engage/ID",
            urlSalary: "/REALM/ajax/unit/employees/calc_new_lvl/ID",
            urlMain: "/REALM/main/unit/view/ID",
            urlSupply: "/REALM/main/unit/view/ID/supply",
            urlSale: "/REALM/main/unit/view/ID/sale",
            urlLab: "/REALM/main/unit/view/ID/investigation",
            urlConsume: "/REALM/main/unit/view/ID/consume",
            urlAds: "/REALM/main/unit/view/ID/virtasement",
            urlContact: "/REALM/ajax/unit/virtasement/ID/fame",
            urlTrade: "/REALM/main/unit/view/ID/trading_hall",
            urlQualification: "/REALM/main/user/privat/persondata/knowledge"
        };
        
        for(var j = 0; j < url.length; j++){
            building[type][id][url[j]] = urls[url[j]].replace("REALM", realm).replace("ID", id);                    
        }
                    
    }
       
    //Building   
    function newLink(type, link){
                 
        var linkData = {
            "Store" : ["/step2", "/step3" ,"/step4", "/step4-shop-district", "/step6", "/step8"],
            "Services sector" : ["/step1-type-select", "/step2", "/step3" ,"/step4", "/step4-shop-district", "/step5", "/step6", "/step8"],
            "Restaurant" : ["/step2", "/step3" ,"/step4", "/step4-shop-district", "/step5", "/step6", "/step8"],
            "Factory" : ["/step1-type-select", "/step2", "/step3" ,"/step4", "/step5", "/step6", "/step7", "/step8"],
            "Mill" : ["/step2", "/step3" ,"/step4", "/step6", "/step7", "/step8"],
            "Animal farm" : ["/step1-type-select", "/step2", "/step3", "/step4", "/step5", "/step6", "/step7", "/step8"],
            "Warehouse" : ["/step2", "/step3" ,"/step4", "/step4-warehouse", "/step6", "/step8"],
            "Laboratory" : ["/step2", "/step3" ,"/step4", "/step6", "/step8"],
            "Medical Center" : ["/step2", "/step3" ,"/step4", "/step5", "/step6", "/step8"],
            "Power Plant" : ["/step2", "/step3" ,"/step4", "/step6", "/step7", "/step8"]
        };  
        
        var linkArray = linkData[type];
        
        var nLink = "";
        for(var i = 0; i < linkArray.length; i++){
            if(link.indexOf(linkArray[i]) >= 0){
                nLink = link.replace(linkArray[i], linkArray[i+1]);
            }
        }
        if(nLink === ""){
            nLink = link + linkArray[0];
        }
        
        return nLink;
    }
    
    function getBuild(){
        ajaxGet("buildingInfo", 0, build, build["link"], ["form"], [false], ["form:has('.list')"], [edit("")], function(data){
            var $data = $(data);
            var choices = $data.find("td:has('input:radio'):not(:has(td))").length;
            var choice = "";
            build["name"] = [];
            build["link"] = build["form"].attr("action");
            var options = "";
            var $parts = $data.find("td:has('input:radio'):not(:has(td))");
            for(var i = 0; i < choices; i++){
                build["form"].find("td:has('input:radio'):not(:has(td))").eq(i).find("input:radio")[0].checked = false;
                //Safari bug here?
            }            
            for(var i = 0; i < choices; i++){               
                choice = $parts.eq(i).nextUntil("td:has('input:radio')").andSelf();
                build["name"][i] = choice.filter(function(){return $(this).text().trim() !== "";}).eq(0).text().trim();
                options += "<option>"+build["name"][i]+"</option>";
            }
            
            if(!build["type"]){
                //First page
                options = "";
                var supportedBuildings = ["Store", "Services sector", "Restaurant", "Factory", "Mill", "Animal farm", "Warehouse", "Laboratory", "Medical Center", "Power Plant"];
                for(var i = 0; i < supportedBuildings.length; i++){                
                    options += "<option>"+supportedBuildings[i]+"</option>";
                }
            }
            
            $("#buildTable").append("<tr><td><select id=buildSelect style='width:100%'>"+options+"</select></td><td><input type=submit id=buildGo class=enabled value=Go!></td></tr>")
                    .find("tr:last td").wrapInner('<div style="display: none;" />').parent().find('td > div').slideUp(1).slideDown(300, function(){
                        var $set = $(this);
                        $set.replaceWith($set.contents());
                    });
                    
                    
            var valueArray = localStorage.XioBuilding? localStorage.XioBuilding.split(";") : [];
            var optionArray = $("#buildSelect option").map(function(){
                return $(this).val();
            });
            for(var i = 0; i < valueArray.length; i++){
                for(var j = 0; j < optionArray.length; j++){
                    if(valueArray[i] === optionArray[j]){
                        $("#buildSelect").val(valueArray[i]);
                    }
                }
            }
            
            console.log(valueArray, optionArray);
                    
            if(autoBuild){
                $("#buildGo").trigger("click");
            }
        });
    }
    
    function getBuildLastPage(){
        ajaxGet("buildingInfo", 0, build, build["link"], ["form", "input"], [false, false], ["form:has('.list')", "input:text"], [edit(""), edit("val")], function(){
            $("#buildTable").append("<tr><td><input type=text id=buildSelect style='width:98%' value="+build["input"]+" ></td><td><input type=submit id=buildGo class=enabled value=Go!></td></tr>");                        
            if(autoBuild){
                $("#buildGo").trigger("click");
            }
        });
    }
    
    function postBuild(){
        var index = build["name"].indexOf(build["value"]);
        build["form"].find("td:has('input:radio'):not(:has(td))").eq(index).find("input:radio")[0].checked = true;
        build["form"] = addHidden(build["form"], "[name=next]");
        build["form"] = build["form"].serialize();
        console.log(JSON.stringify(build));
        ajaxPost("buildingInfo", 0, build["link"], build["form"], false, function(){          
            build["link"] = newLink(build["type"], build["link"]);
            if(build["link"].slice(-1) === "8"){
                getBuildLastPage();
            }
            else{
                getBuild();                
            }
        });
    }
    
    function postBuildLastPage(){
        build["form"].find("input:text").val(build["value"]);
        build["form"] = addHidden(build["form"], "[name=next]");
        build["form"] = build["form"].serialize();
        ajaxPost("buildingInfo", 0, build["link"], build["form"], false, function(){
            log("ALL DONE!!!");
            localStorage.XioBuilding = build["recipe"];
            $("#buildTable").append("<tr><td>All Built!</td><td><input type=submit id=buildCancel class=enabled value='All Done!'></td></tr>");
        });
    }
    
    function mainBuild(){           
        build["link"] = $("a:contains('New subdivision')").attr("href"); 
        
        var table = $("<table id=buildTable style='color:gold'></table>");
        $("#groupBase").after(table); 
        
        build["recipe"] = "";
        
        getBuild();  
        if(!running){
            running = true;
            ajaxList(0);
        }        
    }
    
    function buildStart(){        
        $("#buildStart, #buildRepeat").removeClass("enabled").addClass("disabled"); 
        $("#buildCancel").removeClass("disabled").addClass("enabled"); 
        mainBuild();
    }
    
    function buildGo(){        
        $("#buildGo").removeAttr("id").attr("class", "buildGoUSED").attr("disabled", true);
        build["value"] = $("#buildSelect").val();
        if(autoBuild){
            build["value"] = localStorage.XioBuilding.split(";")[$(".buildSelectUSED").length];
            $("#buildSelect").val(build["value"]);
        }

        if(!build["type"]){
            build["type"] = build["value"];
            build["recipe"] = build["value"];
        }
        else{
            build["recipe"] += ";"+build["value"];
        }

        $("#buildSelect").removeAttr("id").attr("class", "buildSelectUSED").attr("disabled", true);
        if(build["link"].slice(-1) === "8"){
            postBuildLastPage();
        }
        else{
            postBuild();
        }
    }    
    
    function buildCancel(){
        build["type"] = "";
        autoBuild = false;
        $("#buildTable").remove();
        $("#buildCancel").removeClass("enabled").addClass("disabled"); 
        $("#buildStart, #buildRepeat").removeClass("disabled").addClass("enabled"); 
    }
    
    function buildRepeat(){        
        $("#buildStart, #buildRepeat").removeClass("enabled").addClass("disabled"); 
        $("#buildCancel").removeClass("disabled").addClass("enabled");         
        if(localStorage.XioBuilding){
            autoBuild = true;
        }
        else{
            alert("Build something first!");
        }
        $("#buildTable").remove();
        mainBuild();
    }        
    
    //Price   
    function setPrice(){   
        var type = curtype;
        var ids = convertIds(type, ["urlSale"]);    
        for(var i = 0; i < ids.length; i++){
            getPrice(ids[i], type);
        }
        
        countList(["pricePost"], function(){
            console.log(JSON.stringify(building));
            $("#groupBaseDiv").ashow();    
            $("#minimize").ashow();      
        });
        
        return [type, ids];
    }
    
    function getPrice(id, type){
        ajaxGet("priceGet", 0, building[type][id], building[type][id]["urlSale"], ["formSale", "primeCost", "primeQuality", "priceCur", "output", "nameProduct", "stock"], 
            [false, true, true, true, true, true, true], ["[name=storageForm]", "td:has('table')  tr:contains('Prime cost') td:nth-child(2):odd", "td:has('table') tr:nth-child(2) td:nth-child(2):odd", 
                ".money:even", "td:has('table') tr:nth-child(1) td:nth-child(2):even", "img[src^='/img/products']", "td:has('table') tr:nth-child(1) td:nth-child(2):odd"],
            [edit(""), edit("textnum"), edit("textnum"), edit("valnum"), edit("textnum"), edit("alt"), edit("textnum")]);
    }  
    
    function getWorldData(){
        var realm = readCookie('last_realm');
        
        ajaxGet("worldGet", 0, building["World"], "/"+realm+"/main/common/main_page/game_info/world", ["tempCountry", "tempUrl"], [true, true], ["td a", "td a"], 
            [edit("text"), edit("href")], function(){
                if(!building["World"]["Goods"]["CTIE"][0]){
                    for(var i = 0; i < building["World"]["tempCountry"].length; i++){                
                        building["World"]["Geo"][i] = {};
                        building["World"]["Geo"][i]["country"] = building["World"]["tempCountry"][i];
                        building["World"]["Geo"][i]["url"] = building["World"]["tempUrl"][i];
                    }                  

                    ajaxGet("worldGet", 0, building["World"]["Geo"][0], building["World"]["Geo"][0]["url"], ["regionLink", "customLink"], [false, false], [".grid td a", ".tabsub a:eq(1)"], 
                    [function(obj){return obj.attr("href").replace("citylist","regionENVD");}, edit("href")], function(){    
                        ajaxGet("worldGet", 0, building["World"]["Goods"], building["World"]["Geo"][0]["regionLink"], ["tempProduct", "tempCTIE"], [true, true], 
                        [".list td:nth-child(3n+2)", ".list td:nth-child(3n+3)"], [edit("text"), edit("textnum")], function(){
                            delete building["World"]["Geo"][0]["regionLink"];

                            ajaxGet("worldGet", 0, building["World"]["Goods"], building["World"]["Geo"][0]["customLink"], ["tempIP"], [true], [".list td:nth-child(5n+5)"],
                            [edit("textnum")], function(){
                                delete building["World"]["Geo"][0]["customLink"];

                                ajaxGet("worldGet", 0, building["World"]["Geo"][0], "/"+realm+"/main/geo/transport/15993", [], [], [], [], function(data){
                                    var pJson = data.match(/\{(.*?)\}/g);
                                    var id = [];
                                    var good = [];
                                    var transport = [];
                                    for(var i = 0; i < pJson.length; i++){
                                        if(pJson[i].indexOf("catid") === -1){
                                            continue;
                                        }
                                        id[i] = pJson[i].match(/\'(.*?)\'/)[1];
                                        good[i] = pJson[i].match(/\"(.*?)\"/)[1];

                                    }                        
                                    for(var i = 0; i < pJson.length; i++){
                                         if(good[i]){
                                             building["World"]["Goods"]["product"][i] = good[i];
                                             building["World"]["Goods"]["CTIE"][i] = building["World"]["Goods"]["tempCTIE"][building["World"]["Goods"]["tempProduct"].indexOf(good[i])];
                                             building["World"]["Goods"]["IP"][i] = building["World"]["Goods"]["tempIP"][building["World"]["Goods"]["tempProduct"].indexOf(good[i])];
                                             building["World"]["Goods"]["id"][i] = id[i];
                                         }
                                    }
                                    
                                    delete building["World"]["Goods"]["tempCTIE"];
                                    delete building["World"]["Goods"]["tempProduct"];                                    
                                    delete building["World"]["Goods"]["tempIP"]; 
                               });
                           });
                        });
                    });
                }
                else{
                    delete building["World"]["tempCountry"];
                    delete building["World"]["tempUrl"];
                }
            });
            
        ajaxGet("worldGet", 0, building["World"]["Goods"], "/"+realm+"/main/globalreport/tm/info", ["TMName", "TMGood"], [true, true], [".grid td:nth-child(2n+2) b", 
            ".grid td:nth-child(2n+2)"], [edit("text"), function(obj){return obj.clone().children().remove().end().text().trim();}], function(){
                console.log(building);
                });
    }
    
    function postPrice(id, type){
        var form = $(building[type][id]["formSale"]);
        for(var j = 0; j < building[type][id]["priceCur"].length; j++){
            form.find(".money:even").eq(j).val(building[type][id]["priceNew"][j]);
        }            
        building[type][id]["formSale"] = form.serialize();

        ajaxPost("pricePost", 0, building[type][id]["urlSale"], building[type][id]["formSale"], 
                        arraysEqual(building[type][id]["priceCur"], building[type][id]["priceNew"]));
    }
    
    function priceZero(){
        var info = setPrice();
        var type = info[0];
        var ids = info[1];   
        
        countList(["priceGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["priceNew"] = [];
                for(var j = 0; j < building[type][ids[i]]["priceCur"].length; j++){
                    building[type][ids[i]]["priceNew"][j] = 0;
                }
                postPrice(ids[i], type);
            }  
        });         
    }
    
    function pricePrime(){
        var info = setPrice();
        var type = info[0];
        var ids = info[1];   
        
        countList(["priceGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["priceNew"] = [];
                for(var j = 0; j < building[type][ids[i]]["priceCur"].length; j++){
                    building[type][ids[i]]["priceNew"][j] = building[type][ids[i]]["primeCost"][j];
                }
                postPrice(ids[i], type);
            }  
        });        
    }
    
    function priceCTIE(){
        var info = setPrice();
        var type = info[0];
        var ids = info[1];    
        
        countList(["priceGet"], function(){            
            getWorldData();
        });
        
        countList(["worldGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["priceNew"] = [];
                for(var j = 0; j < building[type][ids[i]]["priceCur"].length; j++){
                    var index = building["World"]["Goods"]["product"].indexOf(building[type][ids[i]]["nameProduct"][j]);
                    if(index === -1){
                        index = building["World"]["Goods"]["TMName"].indexOf(building[type][ids[i]]["nameProduct"][j]);
                        var realProductName = building["World"]["Goods"]["TMGood"][index];
                        index = building["World"]["Goods"]["product"].indexOf(realProductName);
                    }
                    var priceMax = 30*building["World"]["Goods"]["IP"][index];
                    var CTIE = building["World"]["Goods"]["CTIE"][index];
                    var priceNew = Math.round(Math.min(building[type][ids[i]]["primeCost"][j]*(1+CTIE/100), priceMax)*100)/100;
                    building[type][ids[i]]["priceNew"][j] = priceNew;
                }
                postPrice(ids[i], type);
            } 
        });
    }
    
    function priceIP(){
        var info = setPrice();
        var type = info[0];
        var ids = info[1];  
        
        countList(["priceGet"], function(){            
            getWorldData();
        });
        
        countList(["worldGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["priceNew"] = [];
                for(var j = 0; j < building[type][ids[i]]["priceCur"].length; j++){
                    var index = building["World"]["Goods"]["product"].indexOf(building[type][ids[i]]["nameProduct"][j]);
                    var priceMax = 30*building["World"]["Goods"]["IP"][index];
                    var priceNew = Math.round(priceMax*100)/100;
                    building[type][ids[i]]["priceNew"][j] = priceNew;
                }
                postPrice(ids[i], type);
            } 
        });
    }
    
    function priceFormula(){
        var info = setPrice();
        var type = info[0];
        var ids = info[1];   
        
        countList(["priceGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["priceFactor"] = numberfy($("#priceInputPrime").val());
                building[type][ids[i]]["priceNew"] = [];
                for(var j = 0; j < building[type][ids[i]]["priceCur"].length; j++){
                    building[type][ids[i]]["priceNew"][j] = Math.round(building[type][ids[i]]["primeCost"][j] * building[type][ids[i]]["priceFactor"]*100)/100;
                }
                postPrice(ids[i], type);
            }  
        });
    }
    
    //Supply
    function setSupply(factorReq, factorStc){        
        var type = curtype;
        var ids = convertIds(type, ["urlSupply", "urlMain"]); 
        if(type === "info i-workshop" || type === "info i-animalfarm" || type === "info i-coal_power" || type === "info i-mill" || type === "info i-sawmill"){
            for(var i = 0; i < ids.length; i++){
                getProductionSupply(ids[i], type);
            }
            
            countList(["supplyGet"], function(){
                for(var i = 0; i < ids.length; i++){
                    building[type][ids[i]]["supplyNew"] = [];
                    for(var j = 0; j < building[type][ids[i]]["supplyReq"].length; j++){
                        building[type][ids[i]]["supplyNew"][j] = building[type][ids[i]]["supplyReq"][j]*factorReq - building[type][ids[i]]["quantity"][j]*factorStc;    
                    }
                    postProductionSupply(ids[i], type);
                }
            }); 
        }
        else if(type === "info i-medicine" || type === "info i-restaurant"){
            for(var i = 0; i < ids.length; i++){
                getProductionSupply(ids[i], type);
                getConsumeClients(ids[i], type);
            }
            
            countList(["supplyGet", "clientsGet"], function(){
                for(var i = 0; i < ids.length; i++){
                    building[type][ids[i]]["supplyNew"] = [];
                    for(var j = 0; j < building[type][ids[i]]["supplyReq"].length; j++){
                        building[type][ids[i]]["supplyNew"][j] = building[type][ids[i]]["supplyReq"][j]*factorReq*(building[type][ids[i]]["clients"] || 1)
                                                               - building[type][ids[i]]["quantity"][j]*factorStc;    
                    }
                    postProductionSupply(ids[i], type);
                }
            });             
        }
        else if(type === "info i-shop"){
            for(var i = 0; i < ids.length; i++){
                getStoreSupply(ids[i], type);
            }
            
            countList(["supplyGet"], function(){
                for(var i = 0; i < ids.length; i++){
                    building[type][ids[i]]["supplyNew"] = [];
                    for(var j = 0; j < building[type][ids[i]]["sold"].length; j++){
                        building[type][ids[i]]["supplyNew"][j] = building[type][ids[i]]["sold"][j]*factorReq - building[type][ids[i]]["stock"][j]*factorStc;    
                    }
                    postStoreSupply(ids[i], type);
                }
            });             
        }
        
            
        countList(["supplyPost"], function(){            
            console.log(JSON.stringify(building));
            $("#groupBaseDiv").ashow();    
            $("#minimize").ashow();     
        });
    }
    
    function getProductionSupply(id, type){
        ajaxGet("supplyGet", 0, building[type][id], building[type][id]["urlSupply"], ["supplyForm", "supplyReq", "quantity", "supplyCur"], 
            [false, true, true, true], ["[name=supplyContractForm]", "[id^='product_row'] td:nth-child(2) tr:nth-child(1) td:nth-child(2)", 
            "[id^='product_row'] td:nth-child(3) tr:nth-child(1) td:nth-child(2)", "input[type=type]"], 
            [edit(""), edit("textnum"), edit("textnum"), edit("valnum")]);
    }
    
    function postProductionSupply(id, type){                
        var form = $(building[type][id]["supplyForm"]);
        form = addHidden(form, "[name=applyChanges]");
        for(var j = 0; j < building[type][id]["supplyCur"].length; j++){
            form.find("input[type=type]").eq(j).val(building[type][id]["supplyNew"][j]);
        }
        building[type][id]["supplyForm"] = form.serialize();
        ajaxPost("supplyPost", 0, building[type][id]["urlSupply"], building[type][id]["supplyForm"], arraysEqual(building[type][id]["supplyCur"], building[type][id]["supplyNew"]));
    }
    
    function getStoreSupply(id, type){
        ajaxGet("supplyGet", 0, building[type][id], building[type][id]["urlSupply"], ["stock", "sold", "supplyCur"], 
        [true, true, true], ["td:nth-child(2) table:nth-child(1) tr:nth-child(1) td:nth-child(2)", "td:nth-child(2) table:nth-child(1) tr:nth-child(5) td:nth-child(2)",                 
            "input:text[name^='supplyContractData[party_quantity]']"], [edit("textnum"), edit("textnum"), edit("valnum")], function(data){
            building[type][id]["supplyForm"] = $(data.replace(/\s/g," ").match(/<form action\S* method="POST" name="supplyContractForm"(.*?)<\/form>/g))[0];
        });
    }
    
    function postStoreSupply(id, type){
        var form = $(building[type][id]["supplyForm"]);
        form = addHidden(form, "[name=applyChanges]");
        for(var j = 0; j < building[type][id]["supplyCur"].length; j++){
            form.find("input:text[name^='supplyContractData[party_quantity]']").eq(j).val(building[type][id]["supplyNew"][j]);
        }
        building[type][id]["supplyForm"] = form.serialize();
        ajaxPost("supplyPost", 0, building[type][id]["urlSupply"], building[type][id]["supplyForm"], arraysEqual(building[type][id]["supplyCur"], building[type][id]["supplyNew"]));      
    }
    
    function getConsumeClients(id, type){
        ajaxGet("clientsGet", 0, building[type][id], building[type][id]["urlMain"], ["clients"], 
            [false], ["tr:contains('Number of visitors'):eq(1) td:eq(1)"], [edit("textnum")]);
    }
    
    function supplyZero(){
        setSupply(0, 0);
    }
    
    function supplyRequired(){
        setSupply(1, 0);
    }
    
    function supplyXio(){
        setSupply(4, 1);
    }
    
    function supplyFormula(){
        var factorReq = numberfy($("#supplyInputRequired").val());
        var factorStc = numberfy($("#supplyInputStock").val());
        setSupply(factorReq, factorStc);
    }
    
    //Policy
    function setPolicy(value){
        var type = curtype;
        var ids = convertIds(type, ["urlSale"]); 
        
        for(var i = 0; i < ids.length; i++){
            getPolicy(ids[i], type);
        }
        
        countList(["warePolicyGet"], function(){
            for(var i = 0; i < ids.length; i++){
                postPolicy(ids[i], type, value);
            }
        }); 
        
        countList(["warePolicyPost"], function(){
            console.log(JSON.stringify(building));
            $("#groupBaseDiv").ashow();    
            $("#minimize").ashow();      
        });
    }
    
    function getPolicy(id, type){
        ajaxGet("warePolicyGet", 0, building[type][id], building[type][id]["urlSale"], ["policyForm", "policyCur"], [false, true],
        ["[name='storageForm']", "select[onchange]"], [edit(""), edit("valnum")]);
    } 
    
    function postPolicy(id, type, value){
        building[type][id]["policyNew"] = [];
        for (var i = 0; i < building[type][id]["policyCur"].length; i++){
            building[type][id]["policyNew"].push(value);
        }
        var form = building[type][id]["policyForm"];
        for (var i = 0; i < building[type][id]["policyNew"].length; i++){
            form.find("select[onchange]").eq(i).val(building[type][id]["policyNew"][i]);
        }
        building[type][id]["policyForm"] = form.serialize();
        ajaxPost("warePolicyPost", 0, building[type][id]["urlSale"], building[type][id]["policyForm"], arraysEqual(building[type][id]["policyCur"], building[type][id]["policyNew"]));
    }
    
    function policyNo(){
        setPolicy(0);
    }
    
    function policyAll(){
        setPolicy(1);
    }
    
    function policyCompany(){
        setPolicy(3);
    }
    
    function policyCorp(){
        setPolicy(5);
    }
    
    //Adverts
    
    //Salary     
    function setSalary(){    
        var type = curtype;
        var ids = convertIds(type, ["urlSalary", "urlEmployee", "urlQualification"]);    
        for(var i = 0; i < ids.length; i++){
            getSalary(ids[i], type);
        }
        
        countList(["salaryPost"], function(){
            console.log(JSON.stringify(building));
            $("#groupBaseDiv").ashow();    
            $("#minimize").ashow();  
        });      
        
        return [type, ids];
    }    
    
    function calcSalary(s, c, o, n, a, min, max){
        /* s = old salary
         * c = city salary
         * o = old skill
         * n = new skill
         * a = city skill
         */
        
        function underAvgSalary(s, o, n){
            return s * Math.sqrt(n / o);
        }
    
        function underAvgSkill(s, c, o){
            return o * (c / s) * (c / s);
        }

        function aboveAvgSalary(s, c, o, n, a){
            return Math.pow(2, (n - o) /a) * (c + s) - c;
        }

        function aboveAvgSkill(s, c, o, a){
            return a + o - a * Math.log((c + s) / c) / Math.log(2);
        }
        
        var newSalary = 0;
        
        if(s < c){
            if(underAvgSkill(s, c, o) < n){
                newSalary =  aboveAvgSalary(c, c, underAvgSkill(s, c, o), n, a);
            }
            else{
                newSalary =  underAvgSalary(s, o, n);
            }
        }
        else{
            if(aboveAvgSkill(s, c, o, a) < n){
                newSalary =  aboveAvgSalary(s, c, o, n, a);
            }
            else{
                newSalary =  underAvgSalary(c, aboveAvgSkill(s, c, o, a), n);
            }
        }
        
        newSalary = Math.max(newSalary, min);
        newSalary = Math.min(newSalary, max);
        console.log(s, c, o, n, a, min, max, newSalary);
        return newSalary;
    }
    
    function calcSkillTop(type, employees, bonus){
        var factor = 1;
        var qualName = "";

        switch(type){
        case "info i-mine":
            factor = 8;
            qualName = "Mining";
            break;
        case "info i-coal_power":
            factor = 6;
            qualName = "Power Plants";
            break;
        case "info i-workshop":
        case "info i-mill":
        case "info i-sawmill":
            factor = 4;
            qualName = "Production";
            break;
        case "info i-farm":
            factor = 1.6;
            qualName = "Agriculture";
            break;
        case "info i-orchard":
            factor = 1.2;
            qualName = "Agriculture";
            break;
        case "info i-medicine": 
            factor = 1;
            qualName = "Medicine";
            break;
        case "info i-fishingbase":
            factor = 1;
            qualName = "Fishing industry";
            break;
        case "info i-animalfarm":
            factor = 0.6;
            qualName = "Livestock";
            break;
        case "info i-restaurant":
            factor = 0.4;
            qualName = "Restaurant management";
            break;
        case "info i-shop":
            factor = 0.4;
            qualName = "Commerce";
            break;
        case "info i-lab":
            factor = 0.4;
            qualName = "Science research";
            break;
        case "info i-fitness":
        case "info i-hairdressing":
        case "info i-laundry":
            factor = 0.12;
            qualName = "Services sector";
            break;
        case "info i-office":
            factor = 0.08;
            qualName = "Management";
            break;       
        }

        var index = building["World"]["Qual"]["category"].indexOf(qualName);
        var manager = building["World"]["Qual"]["level"][index] + bonus*building["World"]["Qual"]["bonus"][index];
        var skillTop = -Math.log(employees/(35*factor*manager*manager))/Math.log(7/5);
        return Math.floor(skillTop*100)/100;
    }
    
    function getSalary(id, type){
        ajaxGet("salaryGet", 0, building[type][id], building[type][id]["urlEmployee"], ["salaryCity", "salaryCur", "employeesCur", "skillCur", "skillReq", "skillCity"], 
        [false, false, false, false, false, false], ["td.text_to_left:contains('Average')", "#salary", "#quantity", "#apprisedEmployeeLevel", "span[id='']", "span[id='']"], 
        [edit("textdigit"), edit("valnum"), edit("valnum"), edit("textnum"), 
        function(obj){return parseFloat(obj.text().substring(obj.text().indexOf(",") + 2).replace(" required",""));}, 
        function(obj){return parseFloat(obj.text().match(/[\d|\.]+\,/));}], function(data){
            building[type][id]["formEmployee"] = $(data.replace(/\s/g," ").match(/<form action(.*?)<\/form>/g)[0]);
        });
    }
    
    function getQualification(type, id){
        ajaxGet("qualiGet", 0, building["World"]["Qual"], building[type][id]["urlQualification"], ["category", "level", "bonus"], [true, true, true], 
            ["[id^=title]", "input[id^=knowledgearea]", ".grid tr td:nth-child(4)"], [edit("text"), edit("valnum"), edit("textdigit")]);
    }
    
    function postSalary(id, type){
            var maxBudget = 250000;
            building[type][id]["employeesNew"] = building[type][id]["employeesCur"];                
            building[type][id]["salaryMin"] = Math.ceil(building[type][id]["salaryCity"] * 1.0005 * 0.8 * 100)/100;
            building[type][id]["salaryMax"] = Math.floor(building[type][id]["salaryCity"] * maxBudget / (building[type][id]["employeesNew"] || maxBudget)*100)/100;
            building[type][id]["skillCur"] = Math.max(building[type][id]["skillCur"], 0.5);
            building[type][id]["salaryNew"] = calcSalary(building[type][id]["salaryCur"], building[type][id]["salaryCity"], building[type][id]["skillCur"], 
                                        building[type][id]["skillNew"], building[type][id]["skillCity"], building[type][id]["salaryMin"], building[type][id]["salaryMax"]); 
           
            var form = $(building[type][id]["formEmployee"]);
            form.find("#quantity").val(building[type][id]["employeesNew"]);
            form.find("#salary").val(building[type][id]["salaryNew"]);
            building[type][id]["formEmployee"] = form.serialize();
            ajaxPost("salaryPost", 0, building[type][id]["urlEmployee"], building[type][id]["formEmployee"], 
                building[type][id]["employeesCur"] === building[type][id]["employeesNew"] && building[type][id]["salaryCur"] === building[type][id]["salaryNew"]);
           
        }
    
    function salaryRequired(){ 
        var info = setSalary();
        var type = info[0];
        var ids = info[1];        
        
        countList(["salaryGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["skillNew"] = building[type][ids[i]]["skillReq"];
                postSalary(ids[i], type, "first", true);
            }
        });   
    }
    
    function salaryManager(){ 
        var info = setSalary();
        var type = info[0];
        var ids = info[1];               
        
        countList(["salaryGet"], function(){
            getQualification(type, ids[0]);
        });
        
        countList(["qualiGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["skillNew"] = calcSkillTop(type, building[type][ids[i]]["employeesCur"], false);
                postSalary(ids[i], type, "first", true);
            }
        });        
    }
    
    function salaryBonus(){ 
        var info = setSalary();
        var type = info[0];
        var ids = info[1];  
        
        countList(["salaryGet"], function(){
            getQualification(type, ids[0]);
        });
        
        countList(["qualiGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["skillNew"] = calcSkillTop(type, building[type][ids[i]]["employeesCur"], true);
                postSalary(ids[i], type, "first", true);
            }
        });
        
    }
    
    function salaryFormula(){
        var info = setSalary();
        var type = info[0];
        var ids = info[1];        
        
        countList(["salaryGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["skillNew"] = numberfy($("#salaryInputSkill").val());
                postSalary(ids[i], type, "first", true);
            }
        });
    }
    
    //Training    
    function setTraining(days, minimum){        
        var type = curtype;
        var ids = convertIds(type, ["urlTraining"]);         
        
        for(var i = 0; i < ids.length; i++){
            getTraining(ids[i], type);
        }
        
        countList(["trainingGet"], function(){
            for(var i = 0; i < ids.length; i++){
                building[type][ids[i]]["salaryMin"] = building[type][ids[i]]["salaryCity"] * minimum;
                building[type][ids[i]]["train?"] = !building[type][ids[i]]["trainingAlready"] && building[type][ids[i]]["salaryCur"] > building[type][ids[i]]["salaryMin"];
                building[type][ids[i]]["days"] = days;
                postTraining(ids[i], type);
            }
        }); 
        
        countList(["trainingPost"], function(){
            console.log(JSON.stringify(building));
            $("#groupBaseDiv").ashow();    
            $("#minimize").ashow();     
        });
        
    }
    
    function getTraining(id, type){
        ajaxGet("trainingGet", 0, building[type][id], building[type][id]["urlTraining"], ["salaryCur", "salaryCity"], [false, false], 
            [".list tr:contains('Salary') td", ".list td:contains('Average')"], [edit("textnum"), edit("textdigit")], function(data){
            building[type][id]["trainingAlready"] = data.match(/Employees have already been sent for/) !== null || data.match(/No employees at the enterprise/) !== null;                
            if(!building[type][id]["trainingAlready"])
                building[type][id]["trainingForm"] = $(data.replace(/\s/g," ").match(/<form action(.*?)<\/form>/g)[0]);
        });
    }
    
    function postTraining(id, type){
        var form = $(building[type][id]["trainingForm"]);
        form.find("#unitEmployeesData_timeCount").val(building[type][id]["days"]);
        building[type][id]["trainingForm"] = form.serialize();
        ajaxPost("trainingPost", 0, building[type][id]["urlTraining"], building[type][id]["trainingForm"], !building[type][id]["train?"]);
    }   
    
    function trainingMax(){
        setTraining(4, 0);
    }
    
    function trainingFormula(){
        var days = Math.min(numberfy($("#trainingInputDays").val()), 4);
        var minimum = numberfy($("#trainingInputPerc").val())/100;
        setTraining(days, minimum);
    }
    
    //Group Operations    
    var curtype = null;
    
    function setMainScheme(){
        
        var base =
        $("<div id=XioDiv style='position: fixed; top:60%; border-style: ridge; z-index: 100; padding: 10px; background: url(http://virtonomics.com/img/v2/common/bg.png) rgb(101, 102, 104);'>"
        +"<div id='headDiv' style='color:gold; font-size:22px; padding:4px'>"
            +"Draggable ButtonScreen"
            +"<span id='minimize' style='float:right; font-size:9px'>Minimize</span>"
            +"<span id='maximize' style='float:right; font-size:9px; display:none'>Maximize</span>"
        +"</div>"
        +"<div id=groupBaseDiv><table id=groupBase>"
            +"<tr id=buildButtons style='color:gold'>"
                +"<td title='<b>Supported buildings</b> <br>Stores<br>Fitness centers<br>Hairdressing salons<br>Laundries<br>Restaurants<br>Factories<br>Mills<br>Sawmills<br>Animal farms<br>Warehouses<br>Laboratories<br>Medical centers<br>Power plants'>Building</td>"
                +"<td><input type=submit class=enabled id=buildStart value=Start! title='Start with opening the building menu here!'></td>"
                +"<td><input type=submit class=enabled id=buildRepeat value=Repeat title='Auto-build the last built subdivision. If you don&#39t remove cookies, it will even remember the last thing you&#39ve built yesterday!'></td>"
                +"<td><input type=submit class=disabled id=buildCancel value=Cancel title='Cancels both the normal build and the auto-build function'></td>"
            +"</tr>"
            +"<tr id=priceButtons style='color:gold'>"
                +"<td title='<b>Supported buildings</b> <br>Factories<br>Animal farms<br>Mills<br>Sawmills<br>Fishing bases<br>Mines<br>Fruit plantations<br>Agricultural farms'>Pricing</td>"
                +"<td><input type=submit id=priceZero value='$0.00' title='The price will be set $0.00'></td>"
                +"<td><input type=submit id=pricePrime value='Prime Cost' title='The price will be set to match with the Prime Cost'></td>"
                +"<td><input type=submit id=priceCTIE value='CTIE Price' title='The price will be calculated with the formula Price = Prime Cost * CTIE. This value cannot exceed 30 x IP. This is generally the method where you pay the least amount of taxes.'></td>"
                +"<td><input type=submit id=priceIP value='IP Price' title='The price will be set to the maximum price that product can have if it would have a quality of 1.00: 30 times the IP value.'></td>"
                +"<td>"
                    +"Formula: Price = Prime Cost x "
                    +"<input type=text id=priceInputPrime value=1.1>"
                +"</td>"      
                +"<td><input type=submit id=priceFormula value='Use Formula' title='The price will be set to match the Prime Cost times the value in the textbox left.'></td>"                      
            +"</tr>"
            +"<tr id=supplyButtons style='color:gold'>"
                +"<td title='<b>Supported buildings</b> <br>Factories<br>Animal farms<br>Mills<br>Sawmills<br>Medical centers<br>Restaurants<br>Power plants<br>Stores'>Supply</td>"
                +"<td><input type=submit id=supplyZero value='Zero' title='The supply will be set for every item to zero. <br><br> Note: if there are multiple suppliers for one item, this function can have strange results.'></td>"
                +"<td><input type=submit id=supplyRequired value='Required' title='The supply will be set for every item to match the required amount for one update. <br><br> Note: if there are multiple suppliers for one item, this function can have strange results.'></td>"
                +"<td><input type=submit id=supplyXio value='Xio&#39s' title='The supply will be set for every item using the formula: <br>Supply = Required * 4 - Stock * 1. <br><br> Note: if there are multiple suppliers for one item, this function can have strange results.'></td>"
                +"<td></td>"
                +"<td>"
                    +"Formula: Supply = Required x "
                    +"<input type=text id=supplyInputRequired value=4>"
                    +" - Stock x "
                    +"<input type=text id=supplyInputStock value=1>"
                +"</td>"   
                +"<td><input type=submit id=supplyFormula value='Use Formula' title='The supply will be set for every item using the formula with the two textboxes on the left. <br><br> Note: if there are multiple suppliers for one item, this function can have strange results.'></td>"
            +"</tr>"
            +"<tr id=policyButtons style='color:gold'>"
                +"<td title='<b>Supported buildings</b><br>Warehouses<br>Factories<br>Animal farms<br>Mills<br>Sawmills<br>Fishing bases<br>Mines<br>Fruit plantations<br>Agricultural farms'>Policy</td>"
                +"<td><input type=submit id=policyNo value='No Sale' title='The sale policy of all items will be set to <br>&#39Not for sale&#39'></td>"
                +"<td><input type=submit id=policyAll value='All' title='The sale policy of all items will be set to <br>&#39To any costumer&#39'></td>"
                +"<td><input type=submit id=policyCompany value='Company' title='The sale policy of all items will be set to <br>&#39Only to my company&#39'></td>"
                +"<td><input type=submit id=policyCorp value='Corporation' title='The sale policy of all items will be set to <br>&#39Only to members of the corporation&#39'></td>"
            +"</tr>"
//            +"<tr id=adsButtons style='color:gold'>"
//                +"<td>Adverts</td>"
//                +"<td><input type=submit id=adsTV value=TV Minimum></td>"
//                +"<td><input type=submit id=adsManager value=Manager></td>"
//                +"<td></td>"
//                +"<td></td>"
//                +"<td>"
//                    +"Formula: Advertisement budget = "
//                    +"<input type=text id=adsInputBudget value='1 000 000' style='width: 100px'>"                   
//                +"</td>"  
//                +"<td><input type=submit id=adsFormula value='Use Formula'></td>" 
//            +"</tr>"
            +"<tr id=salaryButtons style='color:gold'>"
                +"<td title='<b>Supported buildings</b><br>Offices<br>Stores<br>Restaurants<br>Factories<br>Animal farms<br>Mills<br>Sawmills<br>Laboratories<br>Medical centers<br>Power plants<br>Mines<br>Fishing bases<br>Fruit plantations<br>Agricultural farms<br>Fitness centers<br>Hairdressing salons<br>Laundries'>Salary</td>"
                +"<td><input type=submit id=salaryRequired value='Required' title='The salary of the employees will be set in such a way, that the skill of the employees will match their required skill. <br><br>The salary cannot go lower than 80% of the city average, nor go higher than a certain maximum, for safety reason.'></td>"
                +"<td><input type=submit id=salaryManager value='Manager' title='The salary of the employees will be set in such a way, that the top1 of the building will be set on maximum regarding your current top manager without bonusses. <br><br>The salary cannot go lower than 80% of the city average, nor go higher than a certain maximum, for safety reason.'></td>"
                +"<td><input type=submit id=salaryBonus value='Bonus' title='The salary of the employees will be set in such a way, that the top1 of the building will be set on maximum regarding your current top manager with bonusses. <br><br>The salary cannot go lower than 80% of the city average, nor go higher than a certain maximum, for safety reason.'></td>"
                +"<td></td>"
                +"<td>"
                    +"Formula: Qualification of Employees = "
                    +"<input type=text id=salaryInputSkill value=10.00 style='width: 35px'>"
                +"</td>"                            
                +"<td><input type=submit id=salaryFormula value='Use Formula' title='The salary of the employees will be set in such a way, that the skill of the employees will match the skill filled in the textbox left. <br><br>The salary cannot go lower than 80% of the city average, nor go higher than a certain maximum, for safety reason.'></td>"                            
            +"</tr>"
            +"<tr id=trainingButtons style='color:gold'>"
                +"<td title='<b>Supported buildings</b><br>Offices<br>Stores<br>Restaurants<br>Factories<br>Mills<br>Sawmills<br>Animal farms<br>Laboratories<br>Medical centers<br>Power plants<br>Mines<br>Fishing bases<br>Fruit plantations<br>Agricultural farms<br>Fitness centers<br>Hairdressing salons<br>Laundries'>Training</td>"
                +"<td><input type=submit id=trainingMax value='Maximum' title='This will train all the employees in the selected subdivisions for 4 weeks.'></td>"
                +"<td></td>"
                +"<td></td>"
                +"<td></td>"
                +"<td>"
                    +"Formula: Train "
                    +"<input type=text id=trainingInputDays value=4>"
                    +" days if salary is higher than "
                    +"<input type=text id=trainingInputPerc value=125>"
                    +"% of City Average"                                
                +"</td>"  
                +"<td><input type=submit id=trainingFormula value='Use Formula' title='This will train the employees of the subdivisions that meet the condition upto a maximum of 4 weeks.'></td>"
            +"</tr>"
        +"</table></div>"
        +"<div id=progressTableDiv style='height:0px'><table id=progressTable style='color:gold'>"
            +"<tr>"
                +"<td id=progressWorking style='font-size:large'>Ajax is working for you!   "
                    +"<a href='http://postimage.org/' target='_blank'><img src='http://s3.postimg.org/j4lthu88f/ajax_loader_1.gif' border='0' alt='ajax loader' /></a>"
                +"</td>"                            
            +"</tr>"
            +"<tr>"
                +"<td>"
                    +"<div style='overflow:auto; max-height:150px;' id=consolelog></div>"
                +"</td>"
            +"</tr>"
        +"</table></div></div>").tooltip({
                        content: function() {
                            return $(this).attr('title');
                        }
                    });

        $("#topblock").append(base); 
        $("#progressTableDiv")
                .hide()
                .ajaxStart(function(){
                    $(this).ashow();
                    $("#minimize, #maximize").ahide();
                })
                .ajaxStop(function(){
                    $(this).ahide();
                });
                
        setLog();
        
        $("#XioDiv").draggable();
        $("#progressTableDiv, #headDiv").css("width", $("#groupBaseDiv").css("width"));
        
        $("body").delegate("#minimize", "click", function(){
            $(this).ahide();
            $("#groupBaseDiv").ahide();
            $("#maximize").ashow();
        });
        $("body").delegate("#maximize", "click", function(){
            $("#groupBaseDiv").ashow();
            $("#minimize").ashow();
            $(this).ahide();
        });
                
        $("body").delegate("input:submit.enabled", "click", function(){
           eval($(this).attr("id")+"()");
        });
        $("body").delegate("input:submit.disabled", "click", function(){
            return false;
        });       
        
        function disButton(img){
            
            function enable(selector){
                $(selector).find("input").removeClass("disabled").addClass("enabled");
                $("#groupBase tr").not(selector+", #buildButtons").find("input").removeClass("enabled").addClass("disabled");
            }
            
            switch(img){
                case false: enable("#selectabsolutelynothing"); break;
                case "info i-workshop": enable("#priceButtons, #supplyButtons, #policyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-animalfarm": enable("#priceButtons, #supplyButtons, #policyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-mill": enable("#priceButtons, #supplyButtons, #policyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-sawmill": enable("#priceButtons, #supplyButtons, #policyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-fishingbase": enable("#priceButtons, #policyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-lab": enable("#salaryButtons, #trainingButtons"); break;
                case "info i-medicine": enable("#supplyButtons, #adsButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-mine": enable("#priceButtons, #policyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-office": enable("#salaryButtons, #trainingButtons"); break;          
                case "info i-orchard": enable("#priceButtons, #policyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-farm": enable("#priceButtons, #policyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-coal_power": enable("#supplyButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-restaurant": enable("#supplyButtons, #adsButtons, #salaryButtons, #trainingButtons"); break;
                case "info i-shop": enable("#supplyButtons, #adsButtons, #salaryButtons, #trainingButtons"); break;        
                case "info i-warehouse": enable("#policyButtons"); break;
                case "info i-fitness": enable("#salaryButtons, #trainingButtons"); break;
                case "info i-hairdressing": enable("#salaryButtons, #trainingButtons"); break;
                case "info i-laundry": enable("#salaryButtons, #trainingButtons"); break;
            }
        }
        
        disButton(false);
        
        var first = true;
        var selector = "tbody tr:not(.unit_comment)";
        
        $('table.unit-list-2014').selectable({
            filter: selector,
            tolerance: 'touch',
            cancel: ':input,option,a',

            selecting: function(event, ui) {

            },
            
            selected: function(event, ui) {
                var img = $('td:eq(2)', ui.selected).attr('class');
                
                if (first) {
                    first = false;
                    curtype = img;
                    
                    if(!building[curtype]){
                        building[curtype] = {};
                    }

                    disButton(img);
                    return false;
                } else {
                    if (curtype !== img) {
                        $(ui.selected).removeClass('ui-selected');
                    }
                }
            },

            unselected: function(event, ui) {
                if ($('.ui-selected').length === 0){
                    first = true;
                    type = null;
                    $(this).selectable('option', 'filter', selector);

                    disButton(false);
                }
            }
        });
        
    }
    
    var countData = [];
    var counts = {};
    var ajaxData = [[]];
    var building = {"World": {
            "Geo":[{}], 
            "Goods":{"id":[], "product":[], "CTIE":[], "IP":[], "transport":[]},
            "Qual":{}            
    }};
    var build = {};
    var autoBuild = false;
    var running = false;
    
    var urlRegEx = {
        main : "virtonomic*.*\/(.*)\/main\/.*",
        unitList : "virtonomic*.*\/.*\/main\/company\/view\/.*\/unit_list$",
        companyView : "virtonomic*.*\/(.*)\/main\/company\/view\/([0-9]+/.*)",
        unitViewMain: "virtonomic*.*\/(.*)\/main\/unit\/view\/([0-9]+#?$)",
        unitViewSubPage : "virtonomic*.*\/(.*)\/main\/unit\/view\/([0-9]{1,})/(.*)",
        globalReport : "virtonomic*.*\/(.*)\/window\/globalreport\/marketing\/by_products\/([0-9]+)",
        unitSupplyCreate : "virtonomic*.*\/(.*)\/window\/unit\/supply\/create\/([0-9]+)\/step2",
        unitSupply :  "virtonomic*.*\/.*\/main\/unit\/view\/[0-9]+\/supply",
        equipment : "virtonomic*.*\/.*/window/unit/equipment/[0-9]+",
        companyEmployeeMgmnt : "virtonomic*.*\/.*\/main\/company\/view\/[0-9]+\/unit_list/employee",
        qualification : "virtonomic*.*\/.*\/main\/user\/privat\/persondata\/knowledge",
        unitMarket : "virtonomic*.*\/.*\/main\/unit_market\/list",
        MgmntEquipmentRepair : "virtonomic*.*\/.*\/window\/management_units\/equipment\/repair",
        reportsIndustry : "virtonomic*.*\/.*\/main/company\/.*/.*\/sales_report/by_produce",
        warehouseSaleScreen: "virtonomic*.*\/.*\/window\/unit\/supply\/multiple\/vendor:([0-9]+)\/product:([0-9]+)/brandname:([0-9]*)"
    };
    
    var url = location.href;

    if(new RegExp(urlRegEx["unitList"]).test(url)){
        var style = document.createElement("style");
        style.id = "customStyle";
        style.type = 'text/css';
        style.textContent = ".ui-selected td { background-color: #FEE068 !important;} \n"
                           +".ui-selecting td { background-color: #FEE88F !important;} \n"
                           +"input[type=submit] {width: 100%} \n"
                           +"input[type=text] {width: 25px} \n"
                           +".enabled {} \n"
                           +".disabled {font-style: italic; color:grey; opacity:0.4} \n";        
        document.getElementsByTagName("head")[0].appendChild(style);

//        var link = document.createElement("link");
//        link.rel = "stylesheet";
//        link.href = "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css";
//        document.getElementsByTagName("head")[0].appendChild(link);
        
//        var script = document.createElement("script");
//        script.src = 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js';
//        script.onload = setMainScheme;
//        document.getElementsByTagName("head")[0].appendChild(script);
        
        setMainScheme();

        pageShow([1000, 2000, 4000]);
    }    
    
    if(new RegExp(urlRegEx["reportsIndustry"]).test(url)){
        industryQuality();
    }
    
    if(new RegExp(urlRegEx["unitViewMain"]).test(url)){
        seeTops();
    }       
   
    //Page Subdivision
    function pageShow(array) {
        var html = "";
        for(var i = 0; i < array.length; i++){
            html += '<a href="http://virtonomics.com/mary/main/common/util/setpaging/dbunit/unitListWithProduction/'+array[i]+'">'
                   +'<span class="">'+array[i]+'</span></a>';
        }
        $(".paging a[href$=400]").after(html);
    }
    
};

var script = document.createElement("script");
script.textContent = '(' + XioScript.toString() + ')();';
document.documentElement.appendChild(script);

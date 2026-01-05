// ==UserScript==
// @name           Politics and War Helper - Test Server 
// @description    Adds useful functions to the Game Politics and War - Test Server
// @include        https://test.politicsandwar.com/*
// @version        0.6.9
// @require		   http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require        http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js
// @grant		   GM_setValue
// @grant		   GM_deleteValue
// @grant		   GM_getValue
// @grant          GM_xmlhttpRequest
// @namespace      https://greasyfork.org/en/users/17194
// @downloadURL https://update.greasyfork.org/scripts/12858/Politics%20and%20War%20Helper%20-%20Test%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/12858/Politics%20and%20War%20Helper%20-%20Test%20Server.meta.js
// ==/UserScript==

//Get script versions
var d = new Date();
var stamp = d.getTime();
var lastUpdate = GM_getValue("lastUpdate", 0);
var pwhThisVersion = GM_info.script.version;

//Checks for update once every 10 minutes
if(stamp > (lastUpdate + 600000)){
    GM_setValue("lastUpdate", stamp);
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://greasyfork.org/en/scripts/8238-politics-and-war-helper",
        headers: {
            "User-Agent": "Mozilla/5.0",
        },
        onload: function(response) {
            GM_setValue("pwhCurrentVersion", jQuery(response.responseText).find('dd[class="script-show-version"]').text());
        }
    });
}

//Save nation name to variable
if(GM_getValue("nationName", 0) == 0){
    getNationName();
}

//Logout to reset nationName
if(jQuery(document).find("li:contains('Login')").length){
    GM_deleteValue("nationName");
}

//Add settings modal
if(pwhThisVersion != GM_getValue("pwhCurrentVersion")){
    jQuery('div[id="leftcolumn"]').append('<ul><input type="submit" data-toggle="modal" data-target="#helperModal" style="background-color: #B22222" value="Update Available"></ul>');
}else{
    jQuery('div[id="leftcolumn"]').append('<ul><input type="submit" data-toggle="modal" data-target="#helperModal" value="Helper Settings"></ul>');
}
jQuery('div[id="leftcolumn"]').append('<div class="modal fade" id="helperModal" tabindex="-1" role="dialog" aria-labelledby="helperModalLabel"><div class="modal-dialog modal-sm" role="document">\
    <div class="modal-content">\
      <div class="modal-header columnheader">\
        <h4 class="modal-title" id="helperModalLabel">Politics and War Helper Settings</h4>\
        <p style="font-size: small;">Version: ' + pwhThisVersion + '</p>\
      </div>\
      <div class="modal-body">\
        <div class="checkbox">\
          <label>\
            <input type="checkbox" class="helperSettings" name="pnwCityLinks">\
              City links on the top of each page\
          </label>\
        </div>\
        <div class="checkbox">\
          <label>\
            <input type="checkbox" class="helperSettings" name="pnwAdvCityManager">\
              Advanced City Manager page\
          </label>\
        </div>\
        <div class="checkbox">\
          <label>\
            <input type="checkbox" class="helperSettings" name="pnwRevenueTables">\
              Revenue page tables\
          </label>\
        </div>\
        <div class="checkbox">\
          <label>\
            <input type="checkbox" class="helperSettings" name="pnwMilTables">\
              Military information table\
          </label>\
        </div>\
        <div class="checkbox">\
          <label>\
            <input type="checkbox" class="helperSettings" name="pnwBuySellSwitch">\
              Buy/Sell switch button\
          </label>\
        </div>\
        <div class="checkbox">\
          <label>\
            <input type="checkbox" class="helperSettings" name="pnwShowHideAd">\
              Hide Advertisements\
          </label>\
        </div>\
      </div>\
      <div class="modal-footer">\
        <input type="submit" data-dismiss="modal" value="Close">\
      </div>\
    </div>\
  </div></div>');

//Check saved setting values
if(GM_getValue('pnwCityLinks', 1) == 1){
    jQuery('input[name="pnwCityLinks"]').prop('checked', true);
}
if(GM_getValue('pnwAdvCityManager', 1) == 1){
    jQuery('input[name="pnwAdvCityManager"]').prop('checked', true);
}
if(GM_getValue('pnwRevenueTables', 1) == 1){
    jQuery('input[name="pnwRevenueTables"]').prop('checked', true);
}
if(GM_getValue('pnwMilTables', 1) == 1){
    jQuery('input[name="pnwMilTables"]').prop('checked', true);
}
if(GM_getValue('pnwBuySellSwitch', 1) == 1){
    jQuery('input[name="pnwBuySellSwitch"]').prop('checked', true);
}
if(GM_getValue('pnwShowHideAd', 0) == 1){
    jQuery('input[name="pnwShowHideAd"]').prop('checked', true);
}

//Watch for and save setting changes
jQuery(document).on("change", ".helperSettings", function(){
    var cbName = this.getAttribute("name");
    if(this.checked){
        GM_setValue(cbName, 1);
    }else{
        GM_setValue(cbName, 0);
    }
});

//Insert update button if available
if(pwhThisVersion < GM_getValue("pwhCurrentVersion")){
    jQuery('div[class="modal-footer"]').prepend('<a href="https://greasyfork.org/en/scripts/8238-politics-and-war-helper" target="_blank">Update to ' + GM_getValue("pwhCurrentVersion") + ' now!</a>');
}

var pathAll = window.location.pathname.split('/');
path = pathAll[2];
var prices = [];
var resources = ["coal","oil","bauxite","iron","lead","uranium","food","gasoline","aluminum","steel","munitions","credits"];
var resCount = 0;

//Show Hide/Show Ad link
if(GM_getValue('pnwShowHideAd', 0) == 1){
    jQuery('div[id="advertisementdiv"]').attr("style", "display:none;");
}

//Adds quick links to your cities to the top of the page
if(GM_getValue('pnwCityLinks', 1) == 1){
    getCityUrls();
}

//Buy/Sell switcher button
if(GM_getValue('pnwBuySellSwitch', 1) == 1 && typeof jQuery('select[name="resource1"]').val() != 'undefined' && jQuery('select[name="resource1"]').val().length > 0){
	var resource1 = jQuery('select[name="resource1"]').val();
    var buysell = jQuery('select[name="buysell"]').val();
    var id = jQuery('input[name="id"]').val();
    var display = jQuery('input[name="display"]').val();
    var ob = jQuery('select[name="ob"]').val();
    var maximum = jQuery('input[name="maximum"]').val();
    var minimum = jQuery('input[name="minimum"]').val();
    var od;
    
    if(buysell == "sell"){
        buysell = "buy";
        od = "DESC";
    }else{
        buysell = "sell";
        od = "ASC";
    }
    jQuery('div[id="rightcolumn"] form:eq(0)').after('<form action="/index.php" method="get"><input type="hidden" name ="id" value="'+id+'"><input type="hidden" name ="display" value="'+display+'"><input type="hidden" name ="resource1" value="'+resource1+'"><input type="hidden" name ="buysell" value="'+buysell+'"><input type="hidden" name ="ob" value="'+ob+'"><input type="hidden" name ="od" value="'+od+'"><input type="hidden" name ="maximum" value="'+maximum+'"><input type="hidden" name ="minimum" value="'+minimum+'"><p style="text-align:center;"><input type="submit" value="Switch Buy/Sell"></p></form>');
}

//advanced city manager
if(GM_getValue('pnwAdvCityManager', 1) == 1 && path == "manager" && pathAll[3] == "n="+GM_getValue("nationName")){
    var cityLink = [];
    getImpDesc(showImpDesc); //inserts improvement description tooltips
    
    jQuery("td").attr("style", "min-width:60px;width:100px;text-align:right;");
    if(GM_getValue("citmanagerError", 0) != 0){
        jQuery(document).find("div[class='columnheader']").eq(1).after(GM_getValue("citmanagerError"));
        GM_deleteValue("citmanagerError");
    }
    
    jQuery(document).find("div[id='footer']").append('<iframe id="pwhFrame" frameBorder="0" style="width:1px; height:1px;"></iframe>');
    
    jQuery(document).find("tbody:eq(0)").find("tr:eq(0)").find("th:eq(1)").nextAll().each(function(){
        var cityUrl = jQuery(this).find("a").attr('href').split("/");
        cityLink.push(cityUrl[4]);
    });
    
    //collect total infra per city
    var cityInfra = [];
    var cityInfracounter = 0;
    jQuery(document).find("tr:contains('Infrastructure')").find("td:eq(1)").nextAll().each(function(){
        cityInfra[cityInfracounter] = Number(jQuery(this).text().replace(",", ""));
        cityInfracounter++;
    });
    
    //collect improvement counts per city
    var submitIndex = 4;
    var improvements = {};
    var impIndex = 0;
    jQuery(document).find("tbody:eq(0)").find("tr:eq(9)").nextAll().each(function(){
        var cityIndex = 0;
        jQuery(this).find("td:eq(1)").nextAll().each(function(){
            if(improvements[cityIndex] == undefined){
                improvements[cityIndex] = [];
            }
            improvements[cityIndex][impIndex] = Number(jQuery(this).text());
            jQuery(this).wrapInner('<div style="padding-top:10px;float:left;width:50%;"></div>');
            jQuery(this).append('<div><button type="button" class="btn btn-default pwhImprovButton" style="padding: 2px 6px; font-size: 5px;" value="'+cityLink[cityIndex]+':'+submitIndex+':'+'buy"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button><br /><button type="button" class="btn btn-default pwhImprovButton" style="padding: 2px 6px; font-size: 5px;" value="'+cityLink[cityIndex]+':'+(submitIndex+1)+':'+'sell"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></div>');
            cityIndex++;
        });
        submitIndex = submitIndex+2;
        impIndex++;
    });
    
    //display infra slots info for each city
    for(i = 0; i < cityInfra.length; ++i){
        var spotsUsed = 0;
        infraSpots = Math.floor(cityInfra[i]/50);
        for(b = 0; b < improvements[i].length; ++b){
            spotsUsed = spotsUsed + improvements[i][b];
        }
        jQuery(document).find("th:eq(" + (i+2) + ")").append('<br /><b title="Improvement Slots">' + spotsUsed + "/" + infraSpots + '</b>');
    }
    
    jQuery(document).on("click", ".pwhImprovButton", function() {
        var improvButtHash = jQuery(this).val().split(":");
        var cityHash = improvButtHash[0];
        var submitIndex = improvButtHash[1];
        var buttAction = improvButtHash[2];
        jQuery.when(setupCityPage(cityHash)).then(function(){
            var pwhConfirm = confirm("Are you sure you want to "+buttAction+" this improvement?");
            if(pwhConfirm == true){
                jQuery("#pwhFrame").contents().find("input[type='submit']").eq(submitIndex).trigger("click");
                jQuery("#pwhFrame").load(reloadCityManager);
            }
        });
    });
}

//revenue page tables
if(GM_getValue('pnwRevenueTables', 1) == 1 && path == "revenue" && pathAll[3] != "log"){
    
    //Delete Old Values
    for(i = 0; i < resources.length; ++i){
        GM_deleteValue("sell"+resources[i]);
        GM_deleteValue("buy"+resources[i]);
    }
    
    //Calls getPrice on each resource to get top PPU
    for(i = 0; i < resources.length; ++i){
        getPrice(resources[i]);
        getPrice(resources[i], "buy");
    }
    
    checkPrices();
    
    jQuery(document).on("change", "#helperLandSelect", function() {
        var ppu = GM_getValue("sellfood");
        var helperLandSelect = jQuery(this).val();
        var profit = ppu*(helperLandSelect/25)-300;
        jQuery("#helperLandProfit").text("$"+profit);
        GM_setValue("savedLand", helperLandSelect);
    });
}

//military tables
if(GM_getValue('pnwMilTables', 1) == 1 && path == "military"){
    //Creates table of handy military unit information
    jQuery("#rightcolumn").append(
        '<table class="nationtable" style="margin: 0 auto; width: 100%;"><tbody>'+
        '<tr><th>Unit</th><th>Enlist/Manufacture Cost</th><th>Upkeep (Peace/War)</th><th>Operational Costs</th></tr>'+
        '<tr><td><a href="/nation/military/soldiers/">Soldiers</a></td><td style="text-align:right;">$2/Soldier</td><td style="text-align:right;">$1.25 <img src="/img/resources/food.png">1/750 / $1.88 <img src="/img/resources/food.png">1/500</td><td style="text-align:right;">Optional 75% Boost - 1 <img src="/img/resources/munitions.png">Munitions per 5,000 soldiers</td></tr>'+
        '<tr><td><a href="/nation/military/tanks/">Tanks</a></td><td style="text-align:right;"><img src="/img/resources/steel.png">1 $60</td><td style="text-align:right;">$50 / $75</td><td style="text-align:right;">1 <img src="/img/resources/munitions.png">Munitions and 1 <img src="/img/resources/gasoline.png">Gasoline per 100 tanks</td></tr>'+
        '<tr><td><a href="/nation/military/aircraft/">Aircraft</a></td><td style="text-align:right;"><img src="/img/resources/aluminum.png">3 $4000</td><td style="text-align:right;">$500 / $750</td><td style="text-align:right;">1 <img src="/img/resources/gasoline.png">Gasoline and 1 <img src="/img/resources/munitions.png">Munitions per 4 aircraft</td></tr>'+
        '<tr><td><a href="/nation/military/navy/">Naval Ships</a></td><td style="text-align:right;"><img src="/img/resources/steel.png">25 $50,000</td><td style="text-align:right;">$3,750 / $5,625</td><td style="text-align:right;">2 <img src="/img/resources/gasoline.png">Gasoline and 3 <img src="/img/resources/munitions.png">Munitions per ship per battle</td></tr>'+
        '<tr><td><a href="/nation/military/spies/">Spies</a></td><td style="text-align:right;">$50,000</td><td style="text-align:right;">$2,400</td><td style="text-align:right;">Pay a fee for every operation</td></tr>'+
        '<tr><td><a href="/nation/military/missiles/">Missiles</a></td><td style="text-align:right;"><img src="/img/resources/aluminum.png">100 <img src="/img/resources/gasoline.png">75 <img src="/img/resources/munitions.png">75 $150,000</td><td style="text-align:right;">$21,000 / $31,500</td><td style="text-align:right;">None</td></tr>'+
        '<tr><td><a href="/nation/military/nukes/">Nuclear Weapons</a></td><td style="text-align:right;"><img src="/img/resources/aluminum.png">750 <img src="/img/resources/gasoline.png">500 <img src="/img/resources/uranium.png">250 $1,750,000</td><td style="text-align:right;">$35,000 / $52,500</td><td style="text-align:right;">None</td></tr>'+
        '</tbody></table>'
    );

}

/*-------------------FUNCTIONS-----------------------------------------------------------*/

//Function to captitalize strings - http://stackoverflow.com/a/4878800
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//Saves nation name to a variable
function getNationName(){
    jQuery.get("https://test.politicsandwar.com/nation", function(response) {
        var data = jQuery.parseHTML(response);
        if(jQuery(response).find("li:contains('Login')").length){
            GM_deleteValue("nationName");
        }else{
            var title = jQuery(response).find("th").eq(4).find("a").attr("href").split('=');
            GM_setValue("nationName", title[1].trim().replace(/ /g, '%20'));
        }
    });
}

//Loads city page in invisible iframe to allow buying/selling improvements
function setupCityPage(cityHash){
    var deferred = jQuery.Deferred();
    jQuery(document).find("iframe[id='pwhFrame']").attr("src",'https://test.politicsandwar.com/city/'+cityHash).load(deferred.resolve);
    return deferred.promise();    
}

//reloads page or displays errors
function reloadCityManager(){
    if(jQuery("#pwhFrame").contents().find("div[class='alert alert-danger']").length){
        GM_setValue("citmanagerError", jQuery("#pwhFrame").contents().find("div[class='alert alert-danger']").wrap("<div>").parent().html());
        window.location = window.location.href;
    }else{
        window.location = window.location.href;
    }
}

//Waits until current prices are loaded then creates tables
function checkPrices(){
    if(resCount != resources.length * 2){
        setTimeout(checkPrices, 1e3);
    }else{
        createProfitsTable();
        createBuySellTable();
        var now = new Date().getTime();
        if(GM_getValue("dblastUpdate", 0) == 0 ||  Number(GM_getValue("dblastUpdate"))+3.6e+6 < now){
            GM_setValue("dblastUpdate", now);
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://www.ereptools.tk/paw/pnwhelper.php",
                data: "coal="+GM_getValue("sellcoal")+"&oil="+GM_getValue("selloil")+"&bauxite="+GM_getValue("sellbauxite")+"&iron="+GM_getValue("selliron")+"&lead="+GM_getValue("selllead")+"&uranium="+GM_getValue("selluranium")+"&food="+GM_getValue("sellfood")+"&gasoline="+GM_getValue("sellgasoline")+"&aluminum="+GM_getValue("sellaluminum")+"&steel="+GM_getValue("sellsteel")+"&munitions="+GM_getValue("sellmunitions")+"&credits="+GM_getValue("sellcredits"),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        }
    }
} 

function createBuySellTable(){
    jQuery("tbody").append('<tr><th colspan="3">Buy/Sell Comparison</th></tr>');
    jQuery("tbody").append('<tr><th>Lowest Selling Offer</th><th>Highest Buying Offer</th><th>Difference</th></tr>');
    for(i = 0; i < resources.length; ++i){
        var res = resources[i];
        var sell = GM_getValue("sell"+res);
        var buy = GM_getValue("buy"+res);
        jQuery("tbody").append('<tr><td><img src="/img/resources/'+res+'.png" style="height:16px; width:16px;"> '+toTitleCase(res)+' <p style="text-align:right; margin:0; float:right;"><a href="/index.php?id=26&display=world&resource1='+res+'&buysell=sell&ob=price&od=ASC">$'+sell+'</a></p><td style="text-align:right;"><a href="/index.php?id=26&display=world&resource1='+res+'&buysell=buy&ob=price&od=DESC">$'+buy+'</a></td><td style="text-align:right;">$'+(Number(sell)-Number(buy))+'</td></tr>');
    }
}

function createProfitsTable(){
    jQuery("tbody").append('<tr><th colspan="3">Profit Table<br /><small>*Profits on manufactured products are based on buying needed resources from the market</small></th></tr>');
    jQuery("tbody").append('<tr><th>Resource (ppu)</th><th>Profit</th><th>Start Up Cost</th></tr>');
    
    for(i = 0; i < resources.length; ++i){
        var res = resources[i];
        var ppu = GM_getValue("sell"+res);
        var profit = "";
        var startUp = "";
        
        if(res == "food"){
            var savedLand = GM_getValue("savedLand", 1000);
            profit = ppu*(savedLand/25)-300;
            startUp = "$1000";
        }
        if(res == "gasoline"){
            profit = ppu*6-4000-GM_getValue("selloil")*3;
            startUp = "$45000";
        }
        if(res == "oil"){
            profit = ppu*9-600;
            startUp = "$1500";
        }
        if(res == "coal"){
            profit = ppu*6-400;
            startUp = "$1000";
        }
        if(res == "uranium"){
            profit = ppu*3-5000;
            startUp = "$25000";
        }
        if(res == "steel"){
            profit = ppu*9-4000-3*(Number(GM_getValue("selliron")) + Number(GM_getValue("sellcoal")));
            startUp = "$45000";
        }
        if(res == "iron"){
            profit = ppu*6-1600;
            startUp = "$9500";
        }
        if(res == "munitions"){
            profit = ppu*18-3500-6*(GM_getValue("selllead"));
            startUp = "$35000";
        }
        if(res == "lead"){
            profit = ppu*9-1500;
            startUp = "$7500";
        }
        if(res == "aluminum"){
            profit = ppu*9-2500-3*GM_getValue("sellbauxite");
            startUp = "$30000";
        }
        if(res == "bauxite"){
            profit = ppu*6-1600;
            startUp = "$9500";
        }
        if(res != "credits"){
            if(res == "food"){
                jQuery("tbody").append('<tr><td><img src="/img/resources/'+res+'.png" style="height:16px; width:16px;"> <a href="/index.php?id=26&display=world&resource1='+res+'&buysell=sell&ob=price&od=ASC">'+toTitleCase(res)+'</a> ('+ppu+' ppu)  <select id="helperLandSelect" name="helperLandSelect"><option value="1000">1,000 Land</option><option value="1500">1,500 Land</option><option value="2000">2,000 Land</option><option value="2500">2,500 Land</option></select></td><td id="helperLandProfit" style="text-align:right;">$'+profit+'</td><td style="text-align:right;">'+startUp+'</td></tr>');
                jQuery("#helperLandSelect").val(savedLand);
            }else{
                jQuery("tbody").append('<tr><td><img src="/img/resources/'+res+'.png" style="height:16px; width:16px;"> <a href="/index.php?id=26&display=world&resource1='+res+'&buysell=sell&ob=price&od=ASC">'+toTitleCase(res)+'</a> ('+ppu+' ppu)</td><td style="text-align:right;">$'+profit+'</td><td style="text-align:right;">'+startUp+'</td></tr>');
            }
        }
    }
}

//Function loads Market page by resource and gets top PPU
function getPrice(resource,method) {
    var sort;
    method = typeof method !== 'undefined' ? method : "sell";
    if(method == "sell"){
        sort = "ASC";
    }else{
        sort = "DESC";
    }    
    jQuery.get("/index.php?id=90&display=world&resource1="+resource+"&buysell="+method+"&ob=price&od="+sort, function(response) {
        var data = jQuery.parseHTML(response);
        var price = jQuery(data).find("tr:eq(1)").find("td:eq(5)").text().replace(/,/g, '').split(" ");
        GM_setValue(method+resource, price[1]);
        resCount++;
    });
}

//Adds quick links to your cities to the top of the page
function getCityUrls() {
    jQuery("#rightcolumn").prepend('<div class="columnheader" style="font-size: small; line-height: inherit;"><a href="https://test.politicsandwar.com/city/manager/n='+GM_getValue("nationName")+'" style="color:#e7e7e7;">City Manager</a></div><center style="margin-bottom: 10px; font-size: small;"></center>');
    jQuery.get("/nation/", function(response) {
        var data = jQuery.parseHTML(response);
        var urls = jQuery(data).find("tbody:eq(1)").find("tr:eq(2)").nextUntil("tr:contains('Nation Activity')").each(function(){
            if(jQuery("td:eq(0)", this).text() != "Show More/Less"){
                jQuery("#rightcolumn center").eq(0).prepend(' <a href="'+jQuery("a",this).attr("href")+'#improvements">'+jQuery("td:eq(0)", this).text()+'</a> ');
                GM_setValue("cityURL", jQuery("a",this).attr("href"));
            }
        });
    });
}

//waits for getImpDesc to finish then inserts improvement descriptions
function showImpDesc(images, desc){
    var impDesc = desc;
    var impImg = images;
    var tooltipCount = 0;
    jQuery(document).find("tbody:eq(0)").find("tr:eq(9)").nextAll().each(function(){
        jQuery(this).find("td:eq(0)").find("b").attr("class", "cooltip").append('<span class="spantip">'+impImg[tooltipCount] + impDesc[tooltipCount]+'</span>');
        tooltipCount++;
    });
}

//gets Improvements descriptions from city page to use on city manager page
function getImpDesc(callback){
    var impImg = [];
    var impDesc = [];
    jQuery.get(GM_getValue("cityURL"), function(response) {
        var data = jQuery.parseHTML(response);
        jQuery(data).find("table:eq(2)").nextAll().each(function(){
            jQuery(this).find("tr").each(function(){
                jQuery(this).find("td").slice(0, 1).each(function(){
                    jQuery(this).find("img").attr("style", "float:right; padding-left:10px;").attr("class", "img-responsive");
                    impImg.push(jQuery(this).html());
                });
                jQuery(this).find("td").slice(1, 2).each(function(){
                    impDesc.push(jQuery(this).html());
                });
                
            });
        });
        callback(impImg, impDesc);
    });
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('html{height: 100%;}body {min-height: 100%;}.modal-backdrop {bottom: 0;position: fixed;}body.modal-open {overflow-y: scroll;padding-right: 0 !important;} b.cooltip{outline:none}b.cooltip strong{line-height:30px}b.cooltip:hover{text-decoration:none}b.cooltip span{z-index:10;display:none;padding:14px 20px;margin-top:-80px;margin-right:-200px;width:60vw;line-height:16px;text-align: left;}b.cooltip:hover span{display:inline;position:absolute;border:2px solid #FFF;color:#EEE;background:#333 url(cssttp/css-tooltip-gradient-bg.png) repeat-x 0 0}.callout{z-index:20;position:absolute;border:0;top:-14px;left:120px}b.cooltip span{border-radius:2px;box-shadow:0px 0px 8px 4px #666}');
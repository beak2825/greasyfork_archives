// ==UserScript==
// @name         Market requester
// @version      0.8
// @description  Market Framework
// @author       A Meaty Alt
// @match        http://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @require      https://greasyfork.org/scripts/32927-md5-hash/code/MD5%20Hash.js?version=225078
// @grant        none
// ==/UserScript==

function loadAllStats(){
    return new Promise(function(resolve){
        $.get("https://fairview.deadfrontier.com/onlinezombiemmo/dfdata/get_allstats.php?printvars=1",
              function(result){
            resolve(result);
        });
    });
}

var allStats;
loadAllStats().then((stats) => {
    allStats = stats;
});

function codeNameToPublicName(codeName){
    return new Promise((resolve) => {
        if(codeName.indexOf("ammo") > -1){
            resolve(ammoSwitch(codeName));
        }
        else if(codeName.indexOf("_cooked") > -1){
            var uncookedCodeName = codeName.replace("_cooked", "");
            codeNameToPublicName(uncookedCodeName)
            .then((uncookedName) => resolve("Cooked " + uncookedName));
        }
        else if(codeName.indexOf("_") > -1){
            codeName = codeName.substring(0, codeName.indexOf("_"));
            var patternItemNumber = new RegExp(codeName+"\&(.*?)_");
            var itemNumber = allStats.match(patternItemNumber)[1];
            var patternItem = new RegExp(itemNumber+"_name=(.*?)\&");
            resolve(allStats.match(patternItem)[1]);
        }
        else if(allStats){
            var patternItemNumber = new RegExp(codeName+"\&(.*?)_");
            var itemNumber = allStats.match(patternItemNumber)[1];
            var patternItem = new RegExp(itemNumber+"_name=(.*?)\&");
            resolve(allStats.match(patternItem)[1]);
        }
        else{
            loadAllStats()
                .then(() => {
                var patternItemNumber = new RegExp(codeName+"\&(.*?)_");
                var itemNumber = allStats.match(patternItemNumber)[1];
                var patternItem = new RegExp(itemNumber+"_name=(.*?)\&");
                resolve(allStats.match(patternItem)[1]);
            });
        }
    });

    function ammoSwitch(codeName){
        if(codeName == "32ammo")
            return ".32";
        else if(codeName == "35ammo")
            return ".35";
        else if(codeName == "35ammo")
            return ".35";
        else if(codeName == "357ammo")
            return ".357";
        else if(codeName == "38ammo")
            return ".38";
        else if(codeName == "40ammo")
            return ".40";
        else if(codeName == "45ammo")
            return ".45";
        else if(codeName == "50ammo")
            return ".50";
        else if(codeName == "55ammo")
            return ".55";
        else if(codeName == "55rifleammo")
            return "5.5";
        else if(codeName == "75rifleammo")
            return "7.5";
        else if(codeName == "9rifleammo")
            return "9mm r";
        else if(codeName == "127rifleammo")
            return "12.7";
        else if(codeName == "14rifleammo")
            return "14mm";
        else if(codeName == "20gaugeammo")
            return "20 g";
        else if(codeName == "16gaugeammo")
            return "16 g";
        else if(codeName == "12gaugeammo")
            return "12 g";
        else if(codeName == "10gaugeammo")
            return "10 g";
        else if(codeName == "grenadeammo")
            return "grenade";
        else if(codeName == "heavygrenadeammo")
            return "y grenade";
    }
}

function browseItem(params, itemName){
    return new Promise((resolve, reject) => {
        var tradezone = params.match(/tradezone=(.*?)\&/)[1];
        $.post("https://meaty.dfprofiler.com/browsemarketplace.php?function=browseMarket",
               "tradezone="+tradezone+"&search="+itemName+"&category=0",
               (response) => {
            if(response[0])
                resolve(response.slice(1, response.length));
            else
                reject(response[1]);
        });
    });
}
function getLowestPrice(params, itemName){
    return new Promise((resolve, reject) => {
        var tradezone = params.match(/tradezone=(.*?)\&/)[1];
        $.post("https://meaty.dfprofiler.com/browsemarketplace.php?function=browseForCheapest",
               "tradezone="+tradezone+"&search="+itemName+"&category=0",
               (response) => {
            resolve(response);
        });
    });
}
function sellItem(pageTime, params, itemCode, invPosition, myAmount, getPricePromise, buyerId){
    return new Promise((resolve, reject) => {
        codeNameToPublicName(itemCode)
            .then((itemName) => {
            getPricePromise(params, itemName, myAmount)
                .then((priceToSell) => {
                var buyerStr = buyerId? "memberto=" + buyerId + "&" : "";
                var sc = params.match(/sc=(.*?)\&/)[1];
                var userId = params.match(/userID=(.*?)\&/)[1];
                var hashedPassword = params.match(/password=(.*?)\&/)[1];
                var postBody = "pagetime="+pageTime+"&templateID=undefined&sc="+sc+"&creditsnum=0&"+buyerStr+"buynum=0&renameto=&expected_itemprice=-1&expected_itemtype2=&expected_itemtype="+itemCode+"&itemnum2=0&itemnum="+invPosition+"&price="+priceToSell+"&action=newsell&userID="+userId+"&password="+hashedPassword;
                $.post("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php",
                       "hash="+hash(postBody)+"&"+postBody,
                       (response) => {
                        resolve(response);
                });
            });
        });

    });
}
function browsePrivateTrades(userId){
    return new Promise((resolve) => {
        $.post("https://meaty.dfprofiler.com/stalker.php?function=browseTrades",
               {
            userId: userId,
            stalkType: "private"
        },
               (response) => {
            if(!response[0]){
                alert("You don't have any pending trades");
            }
            resolve(response);
        });
    });
}
function buyItem(tradeId, price){
    return new Promise((resolve) => {
        var postBody = {
            "pagetime": pageTime,
            "templateID": undefined,
            "sc": sc,
            "creditsnum": 0,
            "buynum": tradeId,
            "renameto": "",
            "expected_itemprice": price,
            "expected_itemtype2": "",
            "expected_itemtype": "",
            "itemnum2": 0,
            "itemnum": 0,
            "price": 0,
            "action": "newbuy",
            "userID": userId,
            "password": hashedPassword
        };
        postBody = jQuery.param(postBody);
        $.post("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php",
               "hash="+hash(postBody)+"&"+postBody,
               (response) => {
            resolve(response);
        });
    });
}
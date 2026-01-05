// ==UserScript==
// @name         WoW Remote AH Enhancement
// @version      0.5.0
// @description  WoW Remote Auction House Enhancements
// @author       Scott Mundorff
// @match        https://*.battle.net/wow/*/vault/character/auction/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/23550/WoW%20Remote%20AH%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/23550/WoW%20Remote%20AH%20Enhancement.meta.js
// ==/UserScript==
var idleTime = 0;
$(document).ready(function(){
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
    
    if(Auction.page == "browse"){
        
        if(Storage.initialized && JSON.parse){
            var storage = Storage.get("wow.auctions.inventory");
            AuctionBrowse.Inventory = JSON.parse(storage);
        }
        
        AuctionBrowse.Items = [];
        $("div.auction-house").children("div.table").find("td.item").parent().each(function(){
            var newItem = new AuctionItem(this);
            AuctionBrowse.Items.push(newItem);
        });
        
        AuctionBrowse.Filter = function(filter){
            var price = /\/(\d+)g/gi;
            
            var priceMatch = price.exec(filter);
            var minPrice = Auction.deformatMoney(priceMatch[1],0,0);
            
            priceMatch = price.exec(filter);
            var maxPrice = Auction.deformatMoney(priceMatch[1],0,0);
            
            $(AuctionBrowse.Items).each(function(){
                if(minPrice && this.buyoutppi < minPrice) this.Remove();
                if(maxPrice && this.buyoutppi > maxPrice) this.Remove();
            });
        };

        var auctioneer = Storage.get("wow.auctions.auctioneer");
        if(auctioneer){
            var auctioneerCache = JSON.parse(auctioneer);
        }else{
            var auctioneerCache = {
                items:null,
            };
        }

        Storage.set("wow.auctions.auctioneer", JSON.stringify(auctioneerCache));
        
        /*
        $("div.profile-sidebar-inner").css("height","auto");
        $("ul.profile-sidebar-menu > li").css("float","left");
        $("div.profile-sidebar-crest").css("display","none");
        $("div.profile-contents").css("width","");
        $("div.profile-contents").css("float","");
        */
        $("#header").css("padding-top","");
        $("#header .search-bar").css("position","");
    }else if(Auction.page == "create"){
        if (Storage.initialized && JSON.parse) {
            // get player inventory
            Storage.set("wow.auctions.inventory", JSON.stringify(AuctionCreate.items));
        }
        
        $('#similar-auctions').on("DOMSubtreeModified",function(){
            if($("#similar-auctions .similar-items").length){
                $("#similar-auctions .similar-items .table tr .price").click(undercut);
                $("#similar-auctions .similar-items .table tr .price").first().click();
            }
        });
    }
    // Auction.page
    Auction.toasts.AHEnhanced = "AH Enhanced Loaded";
    var message = "";
    if (!("Notification" in window)) {
        Auction.toast("AHEnhanced",5000,"This browser does not support desktop notification");
    }else{
        if(Notification.permission !== 'denied' && Notification.permission !== "granted")
        {
            Notification.requestPermission(function(){
                var n = new Notification("Desktop notifications enabled");
            });
        }
        if (Notification.permission === "granted") {
            Auction.toast("AHEnhanced",5000,"Desktop notifications enabled");
            // If it's okay, let's replace toasts with notifications
            Toast.show = function(content, options){
                var n = new Notification(content);
                setTimeout(n.close.bind(n),options.timer);
            };
        }else{
            Auction.toast("AHEnhanced",5000,"Desktop notifications disabled");
        }
    }
});

function undercut(){
    // select per item pricing
    $("#form-priceType").val("perItem");
    var money = GetPrice(this);
    if($(this).parent().children().first().text() != Auction.character.name)
        money -= 1;
    AuctionCreate.setStarting(money * 0.98);
    AuctionCreate.setBuyout(money);
}

function GetPrice(item){
    var gold = $(item).children(".icon-gold").first().text();
    var silver = $(item).children(".icon-silver").first().text();
    var copper = $(item).children(".icon-copper").first().text();
    return Auction.deformatMoney(gold, silver, copper);
}

function ParseILvl(item){
    var level = $(item).children("td.level");
    var minLvl = $(level).children("div").children("strong").first().text();
    var iLvl = $(level).children("div").children("strong").last().text();
    $(level).text(minLvl + " / i" + iLvl);
}

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 5) { // 20 minutes
        window.location.reload();
    }
}

var AuctionItem = function(item){
    this.auctionID = item.id.replace("auction-","");
    this.itemID = $(item).children("td.item").children("a.icon-frame").attr("href").replace("/wow/en/item/","");
    var level = $(item).children("td.level");
    this.html = item;
    this.minLvl = $(level).children("div").children("strong").first().text();
    this.iLvl = $(level).children("div").children("strong").last().text();
    $(level).text(this.minLvl + " / i" + this.iLvl);

    var price = $(item).children("td.price");
    this.bid = GetPrice($(price).children("div.price-bid"));
    this.buyout = GetPrice($(price).children("div.price-buyout"));
    
    this.quantity = $(item).children("td.quantity").text();
    
    this.buyoutppi = this.buyout / this.quantity;
    if(AuctionBrowse.Inventory[this.itemID])
    {
        this.inInventory = AuctionBrowse.Inventory[this.itemID].q0;
        if(this.inInventory > 0){
            $("<span>| Inv: " + this.inInventory + "</span>").insertBefore($(item).children("td.item").children().last());
        }
    }
    if(false){
        $(item).children("td.price").children("div.price-buyout").css("background-color","gainsboro");
    }
    
    this.Remove = function(){
        $(this.html).css("display","none");
    };
};


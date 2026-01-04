// ==UserScript==
// @name         WarsEnhanced+
// @namespace    WarsEnhancedPlus
// @version      1.1.4
// @description  WarsEnhanced+ adds a load of features to Hacker Wars.
// @author       MacHacker, Jasperr & Johannes
// @match        *://*.hackerwars.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393742/WarsEnhanced%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/393742/WarsEnhanced%2B.meta.js
// ==/UserScript==

if (window.location.hostname.toLowerCase().match('forum')) {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.1.1.min.js';
    script.onload = loadScript;
    document.getElementsByTagName('head')[0].appendChild(script);
} else {
    loadScript();
}

function loadScript() {
    // GLOBAL VARIABLES \\
    var currentWebsiteURL = window.location.protocol + "//" + window.location.hostname;
    var isSideBarSmall = false;
    var gritterLoaded = false;

    // PROTOTYPES \\

    String.prototype.remove = function(str) {
        var strs = str.split("&&");
        var THIS = this;
        for (var i in strs){
            THIS = THIS.replace(strs[i], "");
        }
        return THIS;
    };

    String.prototype.parseDOM = function(){
        var doc = document.createElement('HTML');
        doc.innerHTML = this;
        return doc;
    };

    // FNS \\
    $.fn.withCSS = function(property, value){
        var elems = $("");
        $(this).each(function() {
            if ($(this).css(property) == value) elems = elems.add(this);
        });
        return elems;
    };

    $.fn.textNodes = function(i){
        var nodes = [];
        this.contents().filter(function(){
            if (this.nodeType === window.Node.TEXT_NODE && $.trim(this.nodeValue) !== '') nodes.push(this.nodeValue);
        });
        if (!i) return nodes ;
        else return nodes[i];
    };

    $.fn.removeEventListeners = function(){
        this.each(function(){
            var elemClone = this.cloneNode(true);
            this.parentNode.replaceChild(elemClone, this);
        });
    };
    $.fn.forEach = function(run, pause, callback){
        var array = this;
        var i = 0;
        var refreshIntervalId = setInterval(function() {
            if (i != array.length){
                run(i, item=array[i]);
            } else {
                clearInterval(refreshIntervalId);
                callback();
                return;
            }
            i++;
        },pause);
    };

    $.fn.outerHTML = function(){
      return (!this.length) ? this : (this[0].outerHTML || (
          function(el){
            var div = document.createElement('div');
              div.appendChild(el.cloneNode(true));
              var contents = div.innerHTML;
              div = null;
              return contents;
        })(this[0]));
    };

    /// HE FIXED FUNCTIONS \\\

    function openModal(opts, show) {
            if (typeof (show) === 'undefined') {
                show = true;
            }
            var h = '<div id="gen-modal" class="modal hide" tabindex="0">\
            <div class="modal-header">\
            <button data-dismiss="modal" class="close" type="button">&times;</button>\
            <h3>' + opts.title + '</h3>\
            </div>\
            <form action="" method="POST" id="modal-form">\
            <div class="modal-body">\
            <p>\
            ' + opts.text + '\
            </p>\
            \
            </div>\
            <div class="modal-footer">\
            ' + opts.input + '\
            ' + opts.btn + '\
            \
            </div>\
            </form>\
            </div>';
            $('#modal').html(h);
            if (!show)
                return false;
            $("body").append('<div class="modal-backdrop  in"></div>');
            $('#gen-modal').show();
            $("[data-dismiss]").on().click(function(){$("#gen-modal").hide();$(".modal-backdrop" ).remove();});
        }

    function generateModalInput(opts) {
        var h = "";
        for (x = 0; x < opts.length; x++) {
            h += '<input type="hidden" name="' + opts[x][0] + '" value="' + opts[x][1] + '">';
        }
        return h;
    }

    function gritterNotify(opts) {
        if (!gritterLoaded) {
            $('<link rel="stylesheet" type="text/css" href="css/jquery.gritter.css">').appendTo("head");
            $.getScript("js/jquery.gritter.min.js", function() {
                $.gritter.add({
                    title: opts.title,
                    text: opts.text,
                    image: opts.img,
                    sticky: opts.sticky
                });
            });
            gritterLoaded = true;
            return;
        }
        $.gritter.add({
            title: opts.title,
            text: opts.text,
            image: opts.img,
            sticky: opts.sticky
        });
    }

    // SOME OTHER FUNCTIONS \\
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function isOnPage(page) {
        if (window.location.pathname + window.location.search == page) {
            return true;
        }
        return false;
    }

    function ifPageContains(text) {
        if ($('*:contains("' + text + '")').length) {
            return true;
        }
        return false;
    }

    // FUNCTIONS : START \\

    functions = {};

    // CLAN \\
    functions.clan = {};

    functions.clan.main = function(){
        $('<li class="link" id="friendly" ><a href="clan?view=friendly"><span class="icon-tab he16-agreement"></span><span class="hide-phone">Friendly IPs</span></a></li>').insertAfter($('li:contains("My clan")'));
    };

    functions.clan.friendly_ips = {};
    functions.clan.friendly_ips.add_sidebar = function(){
        $('<li><a href="clan?view=friendly"><i class="fa fa-inverse fa-sitemap"></i> <span>Friendly IPs</span></a></li>').insertAfter($('#sidebar li:contains("Clan")'));
    };

    functions.clan.friendly_ips.initiate_localhost = function(){if (localStorage.getItem("friendlies") === null) localStorage.setItem("friendlies", "[0,[]]");};

    functions.clan.friendly_ips.main = function(){
        $('.current').text("Friendly IPs").attr("href", "clan?view=friendly");
        $(document).on("click", '.save', function() {
            var friendlies = JSON.parse(localStorage.getItem("friendlies"));
            var id = this.id;
            var datapoint = {};
            datapoint.name = $('#'+id+' .name').val().remove("\n");
            datapoint.ip = $('#'+id+' .ip').val().remove("\n");
            friendlies[1][id] = datapoint;
            localStorage.setItem("friendlies", JSON.stringify(friendlies));
            gritterNotify({
                title: "Success!",
                text: 'The IP <b><a href="internet?ip='+datapoint.ip+'">['+datapoint.ip+"]</a></b>  has been linked to <b>"+datapoint.name+"</b> ",
                image: "",
                sticky: false
            });
        });
        $(document).on("click", ".delete-ip", function(){
            var friendlies = JSON.parse(localStorage.getItem("friendlies"));
            var del_id = this.id;
            $('#'+del_id).remove();
            friendlies[1][del_id] = null;
            friendlies[1] = friendlies[1].filter(function(value) { return value !== null; });
            friendlies[0] = friendlies[1].length;
            localStorage.setItem("friendlies", JSON.stringify(friendlies));
        });
        $(".active").attr("class", "link");
        $("#friendly").attr("class", "link active");
        $('.widget-content:first').html('<div class="span12"><ul class="list ip" id="list"></ul></div>');
        functions.clan.friendly_ips.load();
        $('#list').append('<li id="add" style="height: 15px;padding-left: 20px;"><a style="position: absolute;top: 50%;transform: translateY(-50%);" href="#"><h3><b>+</b></h3></a></li>');
        $('#add').on().click(function(){
            var friendlies = JSON.parse(localStorage.getItem("friendlies"));
            var id = friendlies[0];
            $('<li id="'+id+'"><div class="span4"><input class="name" type="text" placeholder="Username Here" style="margin-bottom: 0px;"></div><div class="span4"><form action="internet" method="get" class=""><input class="ip" name="ip" type="text" placeholder="IP Here" style="margin-bottom: 0px;"><input type="submit" class="btn btn-inverse" value="Connect"></form></div><div class="span3"><input id="'+id+'" class="btn btn-med btn-success save" type="button" value="Save" style="margin-bottom: 0px;"></div><div class="span1" style="text-align: right;"><div class="list-actions"><span class="tip-top delete-ip he16-delete icon-tab link" title="Remove" id="'+id+'"></span></div></div><div style="clear: both;"></div></li>').insertBefore($('#add'));
            friendlies[0] += 1;
            localStorage.setItem("friendlies", JSON.stringify(friendlies));
        });
    };

    functions.clan.friendly_ips.load = function(){
        var friendlies = JSON.parse(localStorage.getItem("friendlies"));
        for (var id in friendlies[1].reverse()){
            var entry = friendlies[1][id];
            if (entry === null) continue;
            var name = entry.name;
            var ip = entry.ip;
            $('#list').prepend('<li id="'+id+'"><div class="span4"><input class="name" type="text" value="'+name+'" style="margin-bottom: 0px;"></div><div class="span4"><form action="internet" method="get" class=""><input class="ip" name="ip" type="text" value="'+ip+'" style="margin-bottom: 0px;"><input type="submit" class="btn btn-inverse" value="Connect"></form></div><div class="span3"><input id="'+id+'" class="btn btn-med btn-success save" type="button" value="Save" style="margin-bottom: 0px;"></div><div class="span1" style="text-align: right;"><div class="list-actions"><span class="tip-top delete-ip he16-delete icon-tab link" title="Remove" id="'+id+'"></span></div></div><div style="clear: both;"></div></li>');
        }
    };
    functions.clan.friendly_ips.check = function(){
        if ($('.he16-internet_logout').length === 0){
            var connected_ip = $(".browser-bar").val();
            var friendlies = JSON.parse(localStorage.getItem("friendlies"));
            for (var id in friendlies[1]){
                var entry = friendlies[1][id];
                if (entry === null) continue;
                if (entry.ip == connected_ip){
                    $('<div class="alert alert-warning"><button class="close" data-dismiss="alert">&times;</button><strong>Warning!</strong> You have connected to <strong>'+entry.name+'\'s</strong> IP. </div>').insertAfter($(".widget-box:first"));
                }
            }
        }
    };

    // PROFILE \\
    functions.profile = {};
    functions.profile.msg = function(){
        var r = $.ajax({
            url:"/mail?action=new",
            async:false,
            type:"GET",
        });
        if (r.status == 200){
            var html = (r.responseText).parseDOM();
            $(".widget-content.padding.noborder").html($(html).find(".span9").html());
            var input = $("input[name=to]");
            input.attr("value", $(":contains('Profile of'):last").text().replace("Profile of ", ""));
            input.attr("disabled", "");
            $("form").attr("action", "/mail");
        }
    };

    // BTC \\
    functions.btc = {};
    functions.btc.helper = function(){
        $("#btc-buy").on().click(functions.btc.setupBuyBox());
        $(':contains("BTC bought for"):last').html(getCookie("btcAmount"));
    };

    functions.btc.setupBuyBox = function() {
        $( document ).ajaxComplete(function(event, xhr, settings ) {
        if ((settings.url).includes("js/select2.js")){
            if ($(".modal-header h3").text() != "Buy bitcoins"){return;}
            $("#btc-submit").removeEventListeners();
            $("#btc-submit").attr("type", "button");
            $("#btc-submit").on().click(function(){functions.btc.buy.main();});
        }
        });
    };

    functions.btc.buy = {};
    functions.btc.buy.main = function(){
        var amount = $("#btc-amount");
        if (amount.length > 0){
            amount = $(amount).val().remove(" BTC&&,");
        } else {
            return;
        }
        var btcPrice = $("#btc-buy .green").text().remove("$");
        var btcInCash = btcPrice * amount;
        document.cookie = 'btcAmount=<button class="close" data-dismiss="alert">&times;</button><strong>Success!</strong> ' + amount + ' BTC bought for $' + btcInCash + '.';
        while (true){
            if (amount < 9900){
                functions.btc.buy.post(amount, true);
                return;
            }
            amount -= 9900;
            functions.btc.buy.post(9900, false);
        }
    };

    functions.btc.buy.post = function(amount, reload){
        var acc = $(".select2-chosen").text().split(" ")[0].remove("#");
        $.ajax({
            url : "/bitcoin.php",
            type : "POST",
            data : "func=btcBuy&amount="+amount+"&acc="+acc
        }).done(function(){
            if (reload === true){
                location.href = "https://hackerwars.io/internet";
            }
        });
    };
    functions.btc.sidebar = {};
    functions.btc.sidebar.add = function(){
        $('<li id="menu-btc"><a href="internet?ip=30.211.92.127"><i class="fa fa-inverse fa-bitcoin"></i> <span>BTC Market</span></a></li>').insertAfter($("#menu-internet"));
    };

    functions.btc.sidebar.live = function() {
        $('#menu-btc > a').append('<span class="label"></span>');
        var run = function(){
            r = $.ajax({
                url:"finances",
                type:"GET",
                async:false
            });
            if (r.status == 200){
                var html = r.responseText;
                $("#menu-btc .label").text(Math.round($(html).find('.widget-content:last').textNodes(1).remove(" BTC")*10)/10);
            }
            setTimeout(run, 5000);
        };
        run();
    };

    functions.btc.general = {};
    functions.btc.general.fixBTCModal = function() {
        var price = $('span.small > span.green').first().text().replace('$', '');
        price = parseInt(price);

        $('#btc-sell').on("click", function() {
            $(document).ajaxComplete(function(event, xhr, settings) {
                if (settings.url == 'bitcoin.php') {
                    if ($('.modal-header h3:contains("Sell bitcoins")').length) {
                        $(".modal-backdrop").removeClass("modal-backdrop");
                        var toolList = $('#gen-modal div > span:contains("Rate")');

                        if (!toolList.text().match(/Max/g)) {
                            toolList.append(' | <a href="javascript:void(0)" id="fillMax">Max</a>');
                        }

                        $('#fillMax').on('click', function() {
                            var original = parseFloat(document.getElementById('btc-amount').getAttribute('value'));

                            $('#btc-amount').val(original);
                        });

                        $('#btc-amount').on('change keyup paste', function() {
                            var BTC = parseFloat($('#btc-amount').val());
                            var totalPrice = parseInt(BTC * price);
                            if (!$.isNumeric(totalPrice)) {
                                $('#btc-total').text('N/A');
                                return;
                            }
                            if (totalPrice == 0) {
                                totalPrice = 1;
                            }
                            $('#btc-total').text(numberWithCommas(totalPrice));
                        });

                        $('#btc-submit').off();

                        $('#modal-form').submit(function() {
                            var original = parseFloat(document.getElementById('btc-amount').getAttribute('value'));
                            var BTC = parseFloat($('#btc-amount').val());

                            if (!$.isNumeric(BTC)) {
                                return false;
                            }

                            if (BTC < 1) {
                                alert('Minimum amount to sell: 1 BTC');
                                return false;
                            }

                            if (BTC > original) {
                                return false;
                            }

                            $.ajax({
                                type: 'POST',
                                url: 'bitcoin.php',
                                data: {
                                    func: 'btcSell',
                                    amount: BTC,
                                    acc: $('#select-bank-acc').val()
                                },
                                success: function(data) {
                                    location.reload();
                                }
                            });

                            return false;
                        });
                    }
                }

                if (settings.url.toLowerCase().indexOf('maskmoney') >= 0) {
                    if ($('.modal-header h3:contains("Sell bitcoins")').length) {
                        $('#btc-amount').maskMoney('destroy');
                        $('#btc-amount').val('');
                        $('#btc-total').text('N/A');
                    }
                }
            });
        });

        $('#btc-buy').on("click", function() {
            $(document).ajaxComplete(function(event, xhr, settings) {
                if (settings.url == 'bitcoin.php') {
                    if ($('.modal-header h3:contains("Buy bitcoins")').length) {
                        $(".modal-backdrop").removeClass("modal-backdrop");
                        var toolList = $('#gen-modal div > span:contains("Rate")');

                        if (!toolList.text().match(/Max/g)) {
                            toolList.append(' | <a href="javascript:void(0)" id="fillMax">Max</a>');
                        }

                        $('#fillMax').on('click', function() {
                            var balance = $('span.small.nomargin.green.header-finances').text();
                            balance = balance.replace('$', '');
                            balance = balance.replace(/,/g, '');
                            balance = parseInt(balance);
                            var maxBTC = parseFloat(balance / price);
                            maxBTC = Math.floor(maxBTC * 100) / 100;

                            $('#btc-amount').val(maxBTC);
                        });

                        $('#btc-amount').on('change keyup paste', function() {
                            var BTC = parseFloat($('#btc-amount').val());
                            var totalPrice = parseInt(BTC * price);
                            if (!$.isNumeric(totalPrice)) {
                                $('#btc-total').text('N/A');
                                return;
                            }
                            if (totalPrice == 0) {
                                totalPrice = 1;
                            }
                            $('#btc-total').text(numberWithCommas(totalPrice));
                        });

                        $('#btc-submit').off();

                        $('#modal-form').submit(function() {
                            var original = parseFloat(document.getElementById('btc-amount').getAttribute('value'));
                            var BTC = parseFloat($('#btc-amount').val());

                            if (!$.isNumeric(BTC)) {
                                return false;
                            }

                            if (BTC < 1) {
                                alert('Minimum amount to buy: 1 BTC');
                                return false;
                            }

                            if (BTC > 9000) {
                                alert('Maximum amount to buy: 9,000 BTC');
                                return false;
                            }

                            $.ajax({
                                type: 'POST',
                                url: 'bitcoin.php',
                                data: {
                                    func: 'btcBuy',
                                    amount: BTC,
                                    acc: $('#select-bank-acc').val()
                                },
                                success: function(data) {
                                    location.reload();
                                }
                            });

                            return false;
                        });
                    }
                }

                if (settings.url.toLowerCase().indexOf('maskmoney') >= 0) {
                    if ($('.modal-header h3:contains("Buy bitcoins")').length) {
                        $('#btc-amount').maskMoney('destroy');
                        $('#btc-amount').val('');
                        $('#btc-total').text('N/A');
                    }
                }
            });
        });

        $('#btc-transfer').on("click", function() {
            $(document).ajaxComplete(function(event, xhr, settings) {
                if (settings.url == 'bitcoin.php') {
                    if ($('.modal-header h3:contains("Transfer bitcoins")').length) {
                        $(".modal-backdrop").removeClass("modal-backdrop");
                        $('#btc-submit').off();

                        var btcAddress = $('div.controls > span.item').parent();

                        if (!btcAddress.text().match(/Max/g)) {
                            btcAddress.append(' | <a href="javascript:void(0)" id="fillMax">Max</a>');
                        }

                        console.log(btcAddress.text());

                        $.get(currentWebsiteURL + '/finances', function(data) {
                            if (!btcAddress.text().match(/Send/g)) {
                                var myBTCAddress = $.trim($('#btc > div.widget-content', data).text().slice(15)).split('\n')[0];
                                btcAddress.append(' | <a href="javascript:void(0)" id="sendToMe">Send to my BTC Address</a>');
                                $('#sendToMe').on('click', function() {
                                    $('#btc-to').val(myBTCAddress);
                                });
                            }
                        });

                        $('#fillMax').on('click', function() {
                            var original = parseFloat(document.getElementById('btc-amount').getAttribute('value'));

                            $('#btc-amount').val(original);
                        });

                        $('#modal-form').submit(function() {
                            var original = parseFloat(document.getElementById('btc-amount').getAttribute('value'));
                            var BTC = parseFloat($('#btc-amount').val());
                            var to = $('#btc-to').val();

                            if (!$.isNumeric(BTC)) {
                                return false;
                            }

                            if (BTC > original) {
                                alert('You don\'t have that many BTC.');
                                return false;
                            }

                            if (to == '') {
                                return false;
                            }

                            $.ajax({
                                type: 'POST',
                                url: 'bitcoin.php',
                                data: {
                                    func: 'btcTransfer',
                                    amount: BTC,
                                    destination: to
                                },
                                success: function(data) {
                                    location.reload();
                                }
                            });

                            return false;
                        });
                    }
                }

                if (settings.url.toLowerCase().indexOf('maskmoney') >= 0) {
                    if ($('.modal-header h3:contains("Transfer bitcoins")').length) {
                        $(".modal-backdrop").removeClass("modal-backdrop");
                        $('#btc-amount').maskMoney('destroy');
                        $('#btc-amount').val('');
                    }
                }
            });
        });
    };

    functions.btc.general.addBTCCalculator = function() {
        $('body').append('<div class="modal fade" id="btcCalculatorModal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">BTC to USD & USD to BTC Converter</h4></div><div class="modal-body"><form id="calcForm"><div class="form-group has-success"><label for="btcToUSD" class="control-label">BTC to USD</label><input type="text" id="btcToUSD" name="btcToUSD" placeholder="Amount"> <span id="btcToUSDHelp" class="help-block">$<span id="btcToUSDOutput">N/A</span></span></div><div class="form-group has-success"><label for="usdToBTC" class="control-label">USD to BTC</label><input type="text" id="usdToBTC" name="usdToBTC" placeholder="Amount"> <span id="usdToBTCHelp" class="help-block">BTC: <span id="usdToBTCOutput">N/A</span></span></div></form></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>');

        var buttonList = $('ul.quick-actions').first();
        buttonList.append('<li id="btc-calculator" class="link"><a><i class="icon- he32-text_edit"></i>Converter<br/><span class="small">BTC &hArr; USD</span></a></li>');

        var btcPrice = $('span.small > span.green').first().text().replace('$', '');
        btcPrice = parseInt(btcPrice);

        $('#btc-calculator').on('click', function() {
            $('#btcCalculatorModal').modal('show');
            $(".modal-backdrop").removeClass("modal-backdrop");
        });

        $('#btcToUSD').on('change keyup paste', function() {
            var btc = parseFloat($('#btcToUSD').val());

            var output = btc * btcPrice;
            output = Math.floor(output);
            output = numberWithCommas(output);

            $('#btcToUSDOutput').text(output);
        });

        $('#usdToBTC').on('change keyup paste', function() {
            var usd = parseFloat($('#usdToBTC').val());

            var output = usd / btcPrice;
            output = Math.floor(output * 100) / 100;
            output = numberWithCommas(output);

            $('#usdToBTCOutput').text(output);
        });
    };

    functions.btc.general.addBTCChart = function() {
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.2/Chart.min.js', function() {
            $.get('https://api.blockchain.info/charts/market-price?cors=true&timespan=15days&format=json&lang=en', function(data) {
                var chartBox = $('div.widget-content.padding.center').first();
                chartBox.append('<canvas id="btcChart" width="1400" height="700"></canvas>');
                var ctx = $('#btcChart');

                var labels = [];
                var prices = [];

                var i = 14;
                $.each(data.values, function(j, obj) {
                    if (i == 0) {
                        return;
                    }

                    var timestamp = obj.x;
                    var price = obj.y;

                    if (i == 1) {
                        var str = '1 day ago';
                    } else {
                        var str = i + ' days ago';
                    }

                    labels.push(str);
                    prices.push(parseInt(price));

                    i--;
                });

                var data = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Price History (14 days)',
                            data: prices,
                            backgroundColor: 'rgba(46, 204, 113, 0.4)',
                            borderColor: 'rgba(46, 204, 113, 1.0)'
                        }
                    ]
                };

                var chart = new Chart(ctx, {
                    type: 'line',
                    data: data
                });
            });
        });
    };

    // MAIL \\
    functions.mail = {};
    functions.mail.modal_setup = function(){
        $(".widget-content.nopadding").append('<span id="modal"><div id="gen-modal" class="modal hide in" tabindex="0" aria-hidden="false" style="display: none;"><div class="modal-header"><h3>Deleting Messages...</h3></div><div class="modal-body"><center><b></b></center></div><div class="modal-footer"></div></div></span>');
    };

    functions.mail.delete_msg = function (id){
        $.ajax({
                async:false,
                type:"POST",
                data:{
                    act: "delete",
                    id: id
                }
            });
        };

    functions.mail.reload = function (){
        var r = $.ajax({
            async:false,
            type:"GET",
        });
        if (r.status == 200){
            var html = (r.responseText).parseDOM();
            $("tbody").html($(html).find("tbody").html());
        }
        functions.mail.mail_opt();
    };

    functions.mail.mail_opt = function (){
        if (!$(".delete_selected").length){
            $(".widget-content.padding.noborder").prepend('<span class="delete_selected btn btn-danger mission-abort">Delete Selected</span>');
        }
        if (!$("#select").length){
            $(".widget-content.padding.noborder").prepend('<select style="margin:10px;"id="select"><option value="false">None</option><option value="Unknown">Unknown</option><option value="FBI">FBI</option><option value="Safenet">Safenet</option><option value="Social Clan">Social Clan</option><option value="Badge Advisor">Badge Advisor</option><option value="Social">Social</option></select>');
        }

        $("#select").bind().change(function(){
            var from = $(this).val();
            if (from == "false"){
                $("input[type=checkbox]").prop( "checked", false );
            }

            $("td:contains('"+from+"')").each(function() {
                $(this).parent().find("input[type=checkbox]").prop( "checked", true );
            });
        });

        $(".mail-delete").removeEventListeners();
        $(".mail-delete").on().click(function(){
                functions.mail.delete_msg($(this).attr("value"));
            functions.mail.reload();
        });
        $(".mail-delete").parent().append('<input type="checkbox" name="delete">');
        $(".delete_selected").on().click(function(){
            $("#gen-modal").attr("class", "modal").css("display","block");
            $("body").append('<div class="modal-backdrop  in"></div>');
            var checked = $('input:checked');
            var checked_length = checked.length;
            var modal = $(".modal-body b");
            checked.forEach(function(i, callback){
                var id = $(item).prev().attr("value");
                functions.mail.delete_msg(id);
                modal.text((1+i)+"/"+checked_length+" <::> Messages");
                console.log((1+i)+"/"+checked_length+" <::> Messages");
            }, 0.0001, function(){
                $("#gen-modal").attr("class", "modal hide").css("display","none");
                $(".modal-backdrop" ).remove();
                functions.mail.reload();
            });
        });
    };

    functions.mail.addMassMailing = function() {
        $('input[name="to"]').attr('placeholder', $('input[name="to"]').attr('placeholder') + ' (separate with comma\'s to mass-mail)');

        var mailOptions = {
            names: [],
            subject: '',
            msg: ''
        };

        function massMail() {
            if (mailOptions.names.length == 0) {
                return;
            }

            var name = mailOptions.names.shift();
            var postData = {
                act: 'new',
                to: name,
                subject: mailOptions.subject,
                text: mailOptions.msg
            };

            $.post(currentWebsiteURL + '/mail?action=new', postData, function(data, textStatus, jqXHR) {
                if (jqXHR.status == 302 || jqXHR.status == 200) {
                    var isNameValid = true;
                    if ($('.alert:contains("is invalid")', data).length || $('.alert:contains("does not exists")', data).length) {
                        isNameValid = false;
                    }
                    var isMailToSelf = false;
                    if ($('.alert:contains("You can not send email to yourself.")', data).length) {
                        isMailToSelf = true;
                    }
                    if (isNameValid) {
                        if (!isMailToSelf) {
                            gritterNotify({
                                title: 'HexEnhanced+ Mass Mailing',
                                text: 'The email to ' + name + ' has been delivered succesfully.',
                                image: '',
                                sticky: false
                            });
                        } else {
                            gritterNotify({
                                title: 'HexEnhanced+ Mass Mailing',
                                text: 'The email to ' + name + ' failed to send because you can\'t mail yourself.',
                                image: '',
                                sticky: false
                            });
                        }
                    } else {
                        gritterNotify({
                            title: 'HexEnhanced+ Mass Mailing',
                            text: 'The email to ' + name + ' failed to send because that name is invalid.',
                            image: '',
                            sticky: false
                        });
                    }
                } else {
                    if (jqXHR.status == 403) {
                        gritterNotify({
                            title: 'HexEnhanced+ Mass Mailing',
                            text: 'The email to ' + name + ' failed to send and returned a 403 error. This is most likely triggered by CloudFlare. If this keeps happening, send this email manually.',
                            image: '',
                            sticky: false
                        });
                    } else {
                        gritterNotify({
                            title: 'HexEnhanced+ Mass Mailing',
                            text: 'The email to ' + name + ' failed to send and returned a ' + jqXHR.status + ' error. If this keeps happening, send the email manually.',
                            image: '',
                            sticky: false
                        });
                    }
                }
                massMail();
            });;
        }

        $('form:first').submit(function(event) {
            var to = $('input[name="to"]', this).val();
            if (to.indexOf(',') > -1) {
                event.preventDefault();
                var subject = $('input[name="subject"]', this).val();
                var msg = $('.sceditor-container iframe:first').contents().find('body').html() || $('textarea#wysiwyg', this).val();
                var names = to.split(',');
                $.map(names, function(name, index) {
                    names[index] = $.trim(name);
                });
                names = $.unique(names);
                if (names.length > 25) {
                    gritterNotify({
                        title: 'HexEnhanced+ Mass Mailing',
                        text: 'The mass-mailing is limited to 25 users at once. Remove some users from the "To" field please.',
                        image: '',
                        sticky: false
                    });
                    return false;
                }
                if (names.length == 0 || !subject || !msg) {
                    gritterNotify({
                        title: 'HexEnhanced+ Mass Mailing',
                        text: 'You either didn\'t fill in any names, didn\'t fill in a subject or didn\'t fill in a message.',
                        image: '',
                        sticky: false
                    });
                    return false;
                }
                mailOptions = {
                    names: names,
                    subject: subject,
                    msg: msg
                };
                massMail();
            }
        });
    };

    // UNIVERSITY \\

    functions.university = {};

    functions.university.getResearchVariables = function(){
        var r = $.ajax({
            url:"/ajax",
            async:false,
            type:"POST",
            data:{
                func: "getCommon"
            }
        });
        $(".widget-content.nopadding").append('<span id="modal"><div id="gen-modal" class="modal hide in" tabindex="0" aria-hidden="false" style="display: none;"><div class="modal-header"><button data-dismiss="modal" class="close" type="button">&times;</button><h3>Hex Enhanced Research Calculator</h3></div><div class="modal-body">This little tool estimates how much longer you will be able to research* till you are out of money.</div><div class="modal-footer" style="padding-left: 2px;"><span class="small">* Note: This calculator is not entirely accurate due the seemingly random increase in research prices.</span></div></div></span>');
        $(".close").on().click(function(){$(".modal").hide(); $(".modal-backdrop" ).remove();});
        if (r.status == 200){
            var json = JSON.parse(JSON.parse(r.responseText).msg)[0];
            money = (json.finances).match(/\d/g).join("");
        }
        cost = $(".widget-box.text-left").find(".green").text().match(/\d/g).join("");
        time = $(":contains('minutes'):last").text().match(/\d/g).join("");
    };

    functions.university.calculator = {};

    functions.university.calculator.setup = function(){
        $("#research-area .span4").prepend('<div class="widget-box" style="text-align: left;"><div class="widget-title"><span class="icon"><span class="icon-tab he16-stats"></span></span><h5>Research Calculator</h5><a href="#" id="calc_help"><span class="label label-info">Help</span></a></div><div class="widget-content nopadding"><table class="table table-cozy table-bordered table-striped"><tbody><tr><td><span class="item">Money</span></td><td><input class="calc" id="money" type="text" value="'+money+'" style="width:calc(100% - 15px);"></td></tr><tr><td><span class="item">Cost</span></td><td><input class="calc" id="cost" type="text" value="'+cost+'" style="width:calc(100% - 15px);"></td></tr><tr><td><span class="item">Time</span></td><td><input class="calc" id="time" type="text" value="'+time+'" style="width:calc(100% - 15px);"><td></tr><tr><td><span class="item">Time Left (H)</span></td><td><center><b></b></center><td></tr></tbody></table></div></div>');
        functions.university.calculate();
        $("#calc_help").on().click(function(){
            $("#gen-modal").attr("class", "modal").css("display","block");
            $("body").append('<div class="modal-backdrop  in"></div>');
        });
        $(".calc").on('input', function(){functions.university.calculate();});
    };

    functions.university.calculate = function(){
        var money = $("#money").val().match(/\d/g).join("");
        var cost = $("#cost").val().match(/\d/g).join("");
        var time = $("#time").val().match(/\d/g).join("");
        var total_time = money/cost*time;
        if (money/cost*time < time){
            total_time = "You do not have enough money...";
        }else{
            total_time = Math.round((total_time-(total_time%time))/60*100) / 100;
        }
        $("tr b").text(total_time);
    };

    // SETTINGS \\

    functions.settings = {};

    functions.settings.passwordFix = function(){
        $(".widget-box:contains('Change password'):last form").attr("action", "reset");
        $(".widget-box:contains('Change password'):last button").text("Send");
        var inputs = $(".widget-box:contains('Change password'):last .control-group");
        inputs[0].remove();
        inputs[1].remove();
        $(inputs[2]).find("input").attr("type", "email").attr("name", "email");
        $(inputs[2]).find(".control-label").text("Enter your e-mail");
    };

    // INDEX \\

    functions.index = {};

    functions.index.changePwd = function(){
        $('.change-pwd').removeEventListeners();
        $('.change-pwd').on('click', function() {
            $.ajax({
                type: "POST",
                url: "ajax.php",
                data: {
                    func: 'getPwdInfo'
                },
                success: function(data) {
                    if (data.status == 'OK') {
                        var pwdInfo = $.parseJSON(data.msg);
                        openModal({
                            title: pwdInfo[0].title,
                            text: pwdInfo[0].text,
                            btn: pwdInfo[0].btn,
                            input: generateModalInput([["act", "changepwd"]])
                        });
                        if (pwdInfo[0].select2) {
                            getBankAcc();
                        }
                    }
                }
            });
        });
    };

    // Hacked Database \\
    functions.hacked_database = {};
    functions.hacked_database.runaways = {};

    functions.hacked_database.runaways.initiate_localhost = function(){
        if (localStorage.getItem("runaways") === null){
            localStorage.setItem("runaways", "[]");
        }
    };

    functions.hacked_database.runaways.setup_nav = function(){
        $('<li class="link "><a href="?action=runaways"><span class="icon-tab he16-war_now"></span><span class="hide-phone">Lost Slaves</span></a></li>').insertAfter($( ".nav-tabs .link:last" ));
    };

    functions.hacked_database.runaways.check = function(){
        var runaways = JSON.parse(localStorage.getItem("runaways"));
        $("[color=red] strong").each(function(){
            var red_ip = $(this).text().remove("[&&]");
            if ($.inArray(red_ip, runaways) == -1){
                runaways.push(red_ip);
                console.log("[ADDED] : " + red_ip + " -> {RUNAWAYS}");
            }
        });
        localStorage.setItem("runaways", JSON.stringify(runaways));
    };

    functions.hacked_database.runaways.ips_page = function(){
        var runaways = JSON.parse(localStorage.getItem("runaways"));
        $(".alert-error").remove();
        $(".pagination.alternate").remove();
        $(".link.active").attr("class", "link");
        $('li:contains("Lost Slaves")').attr("class", "link active");
        $("#list").html("");
        for (i in runaways){
            var runaway_ip = runaways[i];
            $("#list").append(
            '<li>'+
            '<div class="span4">'+
            '<div class="list-ip">'+
            '<a href="internet?ip='+runaway_ip+'"><span class="label pull-left label-warning">?</span><span id="ip">'+runaway_ip+'</span></a>'+
            '</div>'+
            '<div class="list-user">'+
            '<span class="he16-user heicon" title="User"></span><span class="small">?</span>'+
            '<span class="he16-password heicon" title="Password"></span><span class="small">?</span>'+
            '</div>'+
            '</div>'+
            '<div class="span4">'+
            '<div class="list-virus">'+
            '<span id="vname"></span>No running virus </div>'+
            '<div class="list-time">'+
            '<span class="small" id="v-1" title=""></span>'+
            '</div>'+
            '</div>'+
            '<div class="span3">'+
            '<div class="span6">'+
            '<span class="small hide-phone"><span class="he16-net heicon icon-tab nomargin"></span>?</span><br>'+
            '<span class="small hide-phone"><span class="he16-hdd heicon icon-tab nomargin"></span>?</span>'+
            '</div>'+
            '<div class="span6">'+
            '<span class="small hide-phone"><span class="he16-cpu heicon icon-tab nomargin"></span>?</span><br>'+
            '<span class="small hide-phone"><span class="he16-ram heicon icon-tab nomargin"></span>?</span>'+
            '</div>'+
            '</div>'+
            '<div class="span1" style="text-align: right;">'+
            '<div class="list-actions">'+
            '<span id="'+runaway_ip+'" class="tip-top delete-ip he16-delete icon-tab link" title="Remove" id="2172855"></span>'+
            '</div>'+
            '</div>'+
            '<div style="clear: both;"></div>'+
            '</li>'
            );
        }
        $(".delete-ip").on().click(function(){
            var del_ip = $(this).attr("id");
            $('li:contains("'+del_ip+'")').remove();
            console.log("[DELETED] : "+del_ip);
            var runaways = JSON.parse(localStorage.getItem("runaways"));
            runaways.splice(runaways.indexOf(del_ip), 1);
            localStorage.setItem("runaways", JSON.stringify(runaways));
        });
    };

    functions.hacked_database.setup_nav = function(){
        $("#breadcrumb").append('<input id="scan" class="btn btn-med btn-success" type="button" value="Scan">');
        $("#breadcrumb").append('<span style="padding-left: 5px;" class="small">For Updated Results Scan Now</span>');
        $('#scan').click(function() {
            functions.hacked_database.scan();
        });
        var slaves = JSON.parse(localStorage.getItem("DB"));
        var statistics = {ALL:0, VPC:0, NPC:0, noviri:0, vminer:0, vspam:0, vwarez:0};
        for (var i in slaves){
            statistics.ALL++;
            statistics[(slaves[i].type.raw)] ++;
            if (slaves[i].v.type == "No running virus") {statistics.noviri ++;}
            else {statistics[slaves[i].v.type] ++;}
        }
        $(".span12:first").prepend('<div class="widget-box enhanced"><div class="widget-title"><ul class="nav nav-tabs"><li class="link active" id="search-DB"><a href="#"><span class="icon-tab he16-search"></span><span class="hide-phone">Search</span></a></li><li class="link " id="statistics"><a href="#"><span class="icon-tab he16-stats"></span><span class="hide-phone">Statistics</span></a></li><li class="link " id="advanced-search"><a href="#"><span class="icon-tab he16-6"></span><span class="hide-phone">Advanced Search</span></a></li><a href="#"><span class="label label-info">Help</span></a></ul></div><div class="widget-content padding noborder"><div class="span12 search-DB" ><div id="internetSpeed-div" class="browser-input" style="float:left">Internet Speeds : <select title="Select internet speed to sort by" class="update" id="internet" style="width: 102px;margin-right: 10px;margin-top: 10px;"><option class="form" value="false">View all</option><option class="form" value="1">1 Mbit/s</option><option class="form" value="2">2 Mbit/s</option><option class="form" value="4">4 Mbit/s</option><option class="form" value="10">10 Mbit/s</option><option class="form" value="25">25 Mbit/s</option><option class="form" value="50">50 Mbit/s</option><option class="form" value="100">100 Mbit/s</option><option class="form" value="250">250 Mbit/s</option><option class="form" value="500">500 Mbit/s</option><option class="form" value="1000">1 Gbit/s (1000 Mbit/s)</option></select></div><div id="storageSpace-div" class="browser-input" style=" float:left">Storage Space : <select title="Select storage space range to sort by" id="storage" class="update" style="width: 153px; margin-right: 10px;margin-top: 10px;"><option class="form" value="false">View all</option><option class="form" value="0.1:10">100 MB - 10 GB</option><option class="form" value="10:50">10 GB - 50 GB</option><option class="form" value="50:100">50 GB - 100GB</option><option class="form" value="100:10000000">More than 100 GB</option></select></div><div id="virusType-div" class="browser-input" style="float:left">Virus Type : <select title="Select a virus to sort by" id="virus" class="update" style="width: 80px; margin-right: 10px;margin-top: 10px;"><option class="form" value="false">All</option><option class="form" value=".vddos">vddos</option><option class="form" value=".vwarez">vwarez</option><option class="form" value=".vminer">vminer</option><option class="form" value=".vspam">vspam</option><option class="form" value="No running virus">none</option></select></div></div><div class="span12 statistics" style="display:none;"><p>You have a total of <b>'+ statistics.ALL +'</b> IP\'s of which <b><font color="red">'+statistics.noviri+'</font></b>, have no virus (<a id="exportUnusedIPsLink" href="javascript:void(0)">Export them!</a>). Between  <span class="label label-success">' +statistics.VPC +' VPC</span> and <span class="label label-info ">'+statistics.NPC+' NPC</span> you are running <font color="orange">'+ statistics.vminer +'</font> <font color="green"><b>miner(s)</b></font>, <font color="orange">'+ statistics.vspam +'</font> <font color="green"><b>spam(s)</b></font>, and <font color="orange">'+ statistics.vwarez+'</font> <font color="green"><b>warez(s)</b></font>.<br><span class="small">Refresh the page to see any scanned results.</span></p></div><div class="span12 advanced-search" style="display: none;"><div class="span12 advanced-search" style="display: none;"><div id="internetSpeed-div" class="browser-input" style="float:left">Internet Speeds : <select title="Select internet speed to sort by" class="update" id="internet" style="width: 102px;margin-right: 10px;margin-top: 10px;"><option class="form" value="false">View all</option><option class="form" value="1">1 Mbit/s</option><option class="form" value="2">2 Mbit/s</option><option class="form" value="4">4 Mbit/s</option><option class="form" value="10">10 Mbit/s</option><option class="form" value="25">25 Mbit/s</option><option class="form" value="50">50 Mbit/s</option><option class="form" value="100">100 Mbit/s</option><option class="form" value="250">250 Mbit/s</option><option class="form" value="500">500 Mbit/s</option><option class="form" value="1000">1 Gbit/s (1000 Mbit/s)</option></select></div><div id="storageSpace-div" class="browser-input" style=" float:left">Storage Space : <select title="Select storage space range to sort by" id="storage" class="update" style="width: 153px; margin-right: 10px;margin-top: 10px;"><option class="form" value="false">View all</option><option class="form" value="0.1:10">100 MB - 10 GB</option><option class="form" value="10:50">10 GB - 50 GB</option><option class="form" value="50:100">50 GB - 100GB</option><option class="form" value="100:10000000">More than 100 GB</option></select></div><div id="virusType-div" class="browser-input" style="float:left">Virus Type : <select title="Select a virus to sort by" id="virus" class="update" style="width: 80px; margin-right: 10px;margin-top: 10px;"><option class="form" value="false">All</option><option class="form" value=".vddos">vddos</option><option class="form" value=".vwarez">vwarez</option><option class="form" value=".vminer">vminer</option><option class="form" value=".vspam">vspam</option><option class="form" value="No running virus">none</option></select></div></div><div class="span12 advanced-search" style="display: none; margin: 0px;">Full text search : <input id="text-search" type="text" style="margin: 0px;margin-right: 3px;"><span style="margin-left: 5px;" class="label label-success">VPC<input type="checkbox" style="margin: 5px;margin-bottom: 6px;" checked=""></span><span style="margin-left: 5px;" class="label label-info ">NPC<input type="checkbox" style="margin: 5px;margin-bottom: 6px;" checked=""></span></div></div></div><div class="nav nav-tabs loading" style="clear: both;display: none;">&nbsp;</div><center class=""><i style="display: none;" class="fa fa-spinner fa-spin fa-3x loading"></i></center><div class="nav nav-tabs" style="clear: both;">&nbsp;</div> </div>');
        $('#exportUnusedIPsLink').on('click', function() {
            functions.hacked_database.exportUnusedIPs();
        });
        $(".enhanced .link").on().click(function(){
            $(".active").attr("class", "link");
            $(this).attr("class", "link active");
            $(".enhanced .span12").hide();
            $("."+this.id).show();
        });
        $('.update').unbind().change(function() {
            functions.hacked_database.update();
        });
    };

    functions.hacked_database.update = function(){
        if (localStorage.getItem("DB") === null){
            alert("You need to scan your Database before you can view these features.");
            return;
        }
        var slaves = JSON.parse(localStorage.getItem("DB"));
        var int = $('.enhanced .span12').withCSS("display", "block").find('#internet').val();
        var hdd = $('.enhanced .span12').withCSS("display", "block").find('#storage').val();
        var v = $('.enhanced .span12').withCSS("display", "block").find('#virus').val();

        $('#list').html("");
        for (var i in slaves) {
            var slave = slaves[i];
            if (int != "false")
                if (slave.int.mb != int)
                    continue;
            if (hdd != 'false'){
                if(slave.hdd.mb == "?")
                    continue;
                var wantedSpace = hdd.split(":");
                var smallestSize = wantedSpace[0];
                var largestSize =  wantedSpace[1];
                if ((largestSize >= slave.hdd.mb && slave.hdd.mb >= smallestSize) === false)
                    continue;
            }
            if (v != "false")
                if (!(slave.v.name).includes(v))
                    continue;
            var li = '<li id="'+slaves.id+'">'+
                    '<div class="span4">'+
                    '<div class="list-ip">'+
                    '<a href="internet?ip='+slave.ip+'">'+slave.type.html+'<span id="ip">'+slave.ip+'</span></a>'+
                    '</div>'+
                    '<div class="list-user">'+
                    '<span class="he16-user heicon" title="User"></span><span class="small">root</span>'+
                    '<span class="he16-password heicon" title="Password"></span><span class="small">'+slave.pw+'</span>'+
                    '</div>'+
                    '</div>'+
                    '<div class="span4">'+
                    '<div class="list-virus">'+
                    slave.v.html+'</div>'+
                    '<div class="list-time">'+
                    '<span class="small" id="v-1" title=""></span>'+
                    '</div>'+
                    '</div>'+
                    '<div class="span3">'+
                    '<div class="span6">'+
                    '<span class="small hide-phone"><span class="he16-net heicon icon-tab nomargin"></span>'+slave.int.raw+'</span><br>'+
                    '<span class="small hide-phone"><span class="he16-hdd heicon icon-tab nomargin"></span>'+slave.hdd.raw+'</span>'+
                    '</div>'+
                    '<div class="span6">'+
                    '<span class="small hide-phone"><span class="he16-cpu heicon icon-tab nomargin"></span>'+slave.cpu.raw+'</span><br>'+
                    '<span class="small hide-phone"><span class="he16-ram heicon icon-tab nomargin"></span>'+slave.ram.raw+'</span>'+
                    '</div>'+
                    '</div>'+
                    '<div class="span1" style="text-align: right;">'+
                    '<div class="list-actions">'+
                    '<span class="tip-top delete-ip he16-delete icon-tab link" title="Remove" id="'+slave.id+'"></span>'+
                    '</div>'+
                    '</div>'+
                    '<div style="clear: both;"></div>'+
                    '</li>';
            $('#list').append(li);
        }
        $.getScript("/js/main.js.pagespeed.jm.oC0Po-3w4s.js", function() {});
    };

    functions.hacked_database.scan = function(){
        $('.loading').show();
        setTimeout(function(){
            var totalPages = parseInt($("ul:contains('Next') li:last").prev().text()) || 1;
            var page = 1;
            var slaves = new Array();
            for (;page <= totalPages; page++){
                slaves = slaves.concat(functions.hacked_database.parse_page(page));
            }
            localStorage.setItem('DB', JSON.stringify(slaves));
            $('.loading').hide();
        }, 1000);
    };

    functions.hacked_database.parse_page = function(page){
        var response = $.ajax({
            url: 'list?page='+page,
            async: false
        });
        if (response.status == 200) {
            var html = (response.responseText).parseDOM();
            var slave_list = [];
            $(html).find("#list li").each(function(){
                var slave = {};
                slave["id"] = this.id;
                slave["type"] = {};
                slave["type"]["raw"] = $(this).find(".label").text();
                slave["type"]["html"] = $(this).find(".label").outerHTML();
                slave["ip"] = $(this).find("#ip").text();
                slave["pw"] = $(this).find(".list-user .small:last").text();
                slave["v"] = {};
                slave["v"]["type"] = $(this).find("#vname").text().split(".")[1] || "No running virus";
                slave["v"]["name"] = $(this).find("#vname").text() || "No running virus";
                slave["v"]["html"] = $(this).find("#vname").parent().outerHTML();
                slave["int"] = {};
                slave["int"]["raw"] = $(this).find(".he16-net")[0].nextSibling.nodeValue;
                slave["int"]["mb"] = "?";
                if (slave["int"]["raw"] != "?"){
                    slave["int"]["mb"] = (slave["int"]["raw"]).match(/\d+/)[0] || "?";
                    if ((slave["int"]["raw"]).includes("Gbit/s")){
                        slave["int"]["mb"] *= 1000;
                    }
                }
                slave["hdd"] = {};
                slave["hdd"]["raw"] = $(this).find(".he16-hdd")[0].nextSibling.nodeValue;
                slave["hdd"]["mb"] = "?";
                if (slave["hdd"]["raw"] != "?"){
                    slave["hdd"]["mb"] = parseInt((slave.hdd.raw).match(/\d+/)[0]);
                    if ((slave["hdd"]["raw"]).includes("MB")){
                        slave["hdd"]["mb"] = parseFloat("0." + slave["hdd"]["mb"]);
                    }
                }
                slave["cpu"] = {};
                slave["cpu"]["raw"] = $(this).find(".he16-cpu")[0].nextSibling.nodeValue;
                slave["ram"] = {};
                slave["ram"]["raw"] = $(this).find(".he16-ram")[0].nextSibling.nodeValue;
                slave_list.push(slave);
            });
        }
        return slave_list;
    };

    functions.hacked_database.exportUnusedIPs = function() {
        if (localStorage.getItem('DB') === null) {
            alert("You need to scan your Database before you can use this feature.");
            return;
        }
        var db = JSON.parse(localStorage.getItem('DB'));
        var unusedIPs = [];
        $.each(db, function(index, item) {
            if (item.v.name == 'No running virus') {
                unusedIPs.push(item.ip);
            }
        });
        if (unusedIPs.length == 0) {
            alert('Nothing to export!');
            return;
        }
        if (!$('#unusedIPsOutputModal').length) {
            var outputModal = '<div id="unusedIPsOutputModal"class="fade modal"role=dialog tabindex=-1><div class=modal-dialog role=document><div class=modal-content><div class=modal-header><button class=close type=button data-dismiss=modal aria-label=Close><span aria-hidden=true>&times;</span></button><h4 class=modal-title>IP\'s without a virus</h4></div><div class=modal-body><textarea id="unusedIPsOutputTextarea" rows="10" style="min-width:90%;"></textarea></div><div class=modal-footer><button id="copyToClipboard"data-clipboard-target="#unusedIPsOutputTextarea"data-toggle="tooltip"title="Copied!"class="btn btn-primary"type=button>Copy to Clipboard</button><button class="btn btn-default"type=button data-dismiss=modal>Close</button></div></form></div></div></div>';
            $('body').append(outputModal);
            $('#unusedIPsOutputModal #copyToClipboard').attr('disabled', true);
        }
        $('#unusedIPsOutputTextarea').val(unusedIPs.join('\n'));
        $('#unusedIPsOutputModal').modal('show');
        $(".modal-backdrop").removeClass("modal-backdrop");
        $.getScript('https://cdn.jsdelivr.net/clipboard.js/1.5.13/clipboard.min.js', function() {
            var clipboard = new Clipboard('#unusedIPsOutputModal #copyToClipboard');
            $('#unusedIPsOutputModal #copyToClipboard').tooltip({
                trigger: 'manual'
            });
            clipboard.on('success', function() {
                $('#unusedIPsOutputModal #copyToClipboard').tooltip('show');
            });
            $('#unusedIPsOutputModal #copyToClipboard').attr('disabled', false);
        });
    };

    // BUGFIXES \\
    functions.bugfixes = {};
    functions.bugfixes.fixXHDChart = function() {
        $('.easyPieChart').first().addClass('chartpie');
        $('.easyPieChart').first().empty();
        $('.easyPieChart').first().append('<div id="downmeplz"><span id="percentpie"></span></div>');
    };

    functions.bugfixes.fixTheTeamLink = function() {
        $('a[href*="mode=leaders"]').text('Loading');

        var modforce = {};
        modforce.administrators = {};
        modforce.globalModerators = {};
        modforce.communityManagers = {};
        modforce.moderators = {};

        var getTableData = function(tableElement) {
            var out = {};
            $('tbody > tr', tableElement).each(function() {
                if ($('td:nth-child(1) > a.username-coloured', this).length) {
                    var name = $('td:nth-child(1) > a.username-coloured', this).text();
                    var link = $('td:nth-child(1) > a.username-coloured', this).prop('href');
                    var color = $('td:nth-child(1) > a.username-coloured', this).css('color');
                    var posts = parseInt($('td.posts > a', this).text());
                    var postsLink = $('td.posts > a', this).prop('href');
                    var websiteText = $('td.info a:nth-child(1)', this).text() || null; 
                    var websiteUrl = $('td.info a:nth-child(1)', this).prop('href') || null;
                    var location = $('td.info > div:not(:has(a))', this).text() || null;
                    var joined = $('td:last', this).text();
                    out[name] = {};
                    out[name]['link'] = link;
                    out[name]['color'] = color;
                    out[name]['posts'] = posts;
                    out[name]['postsLink'] = postsLink;
                    out[name]['websiteText'] = websiteText;
                    out[name]['websiteUrl'] = websiteUrl;
                    out[name]['location'] = location;
                    out[name]['joined'] = joined;
                }
            });
            return out;
        };

        var printCategoryData = function(obj, title) {
            tr = '';
            $.each(obj, function(name, properties) {
                tr += '<tr class="bg1">';
                    tr += '<td><span class="rank-img">' + title + '</span><a href="' + properties['link'] + '" style="color: ' + properties['color'] + ';" class="username-coloured">' + name + '</a></td>';
                    tr += '<td class="posts"><a href="' + properties['postsLink'] + '" title="Search user’s posts">' + properties['posts'] + '</a></td>';
                    if (properties['websiteText'] != null || properties['location'] != null) {
                        if (!properties['websiteText'] != null && properties['location'] != null) {
                            tr += '<td class="info">';
                                tr += '<div>';
                                    tr += properties['location'];
                                tr += '</div>';
                            tr += '</td>';
                        } else if (properties['websiteText'] != null && !properties['location'] != null) {
                            tr += '<td class="info">';
                                tr += '<div>';
                                    tr += '<a href="' + properties['websiteUrl'] + '" title="Visit website: ' + properties['websiteUrl'] + '">' + properties['websiteText'] + '</a>';
                                tr += '</div>';
                            tr += '</td>';
                        } else {
                            tr += '<td class="info">';
                                tr += '<div>';
                                    tr += '<a href="' + properties['websiteUrl'] + '" title="Visit website: ' + properties['websiteUrl'] + '">' + properties['websiteText'] + '</a>';
                                tr += '</div>';
                                tr += '<div>';
                                    tr += properties['location'];
                                tr += '</div>';
                            tr += '</td>';
                        }
                    } else {
                        tr += '<td class="info">&nbsp;</td>';
                    }
                    tr += '<td>' + properties['joined'] + '</td>';
                tr += '</tr>';
            });
            return tr;
        };

        // Querying to get all users in the usergroup 'Community Manager & Moderators'
        $.post('https://forum.hackerwars.io/memberlist.php?mode=group', {g: 8}, function(data) {
            modforce.communityManagers = getTableData($('table:contains("Group leader")', data));
            modforce.moderators = getTableData($('table:contains("Group members")', data));
            // Querying to get all users in the usergroup 'Global Moderators'
            $.post('https://forum.hackerwars.io/memberlist.php?mode=group', {g: 4}, function(data) {
                modforce.globalModerators = getTableData($('table:contains("Group members")', data));
                // Querying to get all users in the usergroup 'Administrators'
                $.post('https://forum.hackerwars.io/memberlist.php?mode=group', {g: 5}, function(data) {
                    modforce.administrators = getTableData($('table:contains("Group leader")', data));

                    $.each(modforce.moderators, function(key, value) {
                        if (modforce.communityManagers.hasOwnProperty(key) || modforce.globalModerators.hasOwnProperty(key) || modforce.administrators.hasOwnProperty(key)) {
                            delete modforce.moderators[key];
                        }
                    });

                    $.each(modforce.communityManagers, function(key, value) {
                        if (modforce.globalModerators.hasOwnProperty(key) || modforce.administrators.hasOwnProperty(key)) {
                            delete modforce.communityManagers[key];
                        }
                    });

                    $.each(modforce.globalModerators, function(key, value) {
                        if (modforce.administrators.hasOwnProperty(key)) {
                            delete modforce.globalModerators[key];
                        }
                    });

                    var table = '<h2 class="solo">The Team</h2>';
                    table += '<div class="forumbg forumbg-table">';
                        table += '<div class="block-border block-block">';
                            table += '<div class="block-content">';
                                table += '<table class="table1" cellspacing="1" id="memberlist">';
                                    table += '<thead>';
                                        table += '<tr>';
                                            table += '<th class="name"><span class="rank-img"><a href="javascript:void(0)">Rank</a></span><a href="javascript:void(0)">Username</a></th>';
                                            table += '<th class="posts"><a href="javascript:void(0)">Posts</a></th>';
                                            table += '<th class="info"><a href="javascript:void(0)">Website</a>, <a href="javascript:void(0)">Location</a></th>';
                                            table += '<th class="joined"><a href="javascript:void(0)">Joined</a></th>';
                                        table += '</tr>';
                                    table += '</thead>';
                                    table += '<tbody>';
                                        table += printCategoryData(modforce.administrators, 'Site Admin');
                                        table += '<tr></tr>';
                                        table += printCategoryData(modforce.globalModerators, 'Global Moderator');
                                        table += '<tr></tr>';
                                        table += printCategoryData(modforce.communityManagers, 'Community Manager');
                                        table += '<tr></tr>';
                                        table += printCategoryData(modforce.moderators, 'Moderator');
                                    table += '</tbody>';
                                table += '</table>';
                                table +='<div class="block-footer"></div>';
                            table += '</div>';
                        table += '</div>';
                    table += '</div>';

                    history.pushState(null, null, window.location.href);
                    window.addEventListener('popstate', function(event) {
                        location.reload();
                    }, false);
                    document.title = 'Forum - Hacker Wars • The Team';
                    $('#page-body').html($('#page-body > #page-footer'));
                    $('#page-body').prepend(table);

                    $('a[href*="mode=leaders"]').remove();
                });
            });
        });
    };

    functions.bugfixes.fixTop7 = function() {
        $.get(currentWebsiteURL + '/ranking', function(data) {
            var top100 = [];
            
            $('table:first > tbody > tr', data).each(function(index) {
                var userID = parseInt($.trim($('td:nth-child(2) > a:first', this).attr('href')).slice(11));
                var username = $.trim($('td:nth-child(2) > a:first', this).text());
                var isOnline = false;
                if ($('td:nth-child(2) > span.r-online', this).length) {
                    isOnline = true;
                }
                var reputation = parseInt($.trim($('td:nth-child(3) > center:first', this).text()));
                var hackedServers = parseInt($.trim($('td:nth-child(4) > center:first', this).text()));
                var clanID = parseInt($.trim($('td:last > a:first', this).attr('href')).slice(8));
                var clanName = $.trim($('td:last > a:first', this).text());

                top100[index] = {};
                top100[index].userID = userID;
                top100[index].username = username;
                top100[index].isOnline = isOnline;
                top100[index].reputation = reputation;
                top100[index].hackedServers = hackedServers;
                top100[index].clanID = clanID;
                top100[index].clanName = clanName;
            });
            
            var top7 = top100.slice(0, 7);
            var tbody = $('table:first > tbody', $('h5:contains("Top 7 users")').parent().next());
            tbody.empty();
            $.each(top7, function(index, user) {
                var tr = '<tr>';
                tr += '<td>' + (index + 1) + '</td>';
                tr += '<td>';
                tr += '<a href="profile?id=' + user.userID + '">' + user.username + '</a>';
                if (user.isOnline) {
                    tr += '<span class="r-online">';
                    tr += '<span style="margin-left: 10px;" class="pull-right he16-ranking_online" title="Online now"></span>';
                    tr += '</span>';
                }
                tr += '</td>';
                tr += '<td>' + numberWithCommas(user.reputation) + '</td>';
                tr += '</tr>';
                tbody.append(tr);
            });
        });
    };

    // FORUM \\
    functions.forum = {};
    functions.forum.addInfiniteScroll = function() {
        var currentPage = parseInt($('.pagination').first().find('strong').eq(0).text());
        var totalPages = parseInt($('.pagination').first().find('strong').eq(1).text());
        if (currentPage < totalPages) {
            var requestingNewPage = false;
            $('.pagination').first().prepend('<a id="custom-infinite-scroll-toggle" href="javascript:void(0)">Infinite Scroll: <span id="custom-infinite-scroll-state">OFF</span></a> &bull; ');
            if (localStorage.getItem('custom-infinite-scroll') == 'true') {
                $('#custom-infinite-scroll-state').html('ON');
            }
            $('#custom-infinite-scroll-toggle').on('click', function() {
                if (localStorage.getItem('custom-infinite-scroll') == 'true') {
                    localStorage.setItem('custom-infinite-scroll', 'false');
                    $('#custom-infinite-scroll-state').html('OFF');
                } else {
                    localStorage.setItem('custom-infinite-scroll', 'true');
                    $('#custom-infinite-scroll-state').html('ON');
                }
            });
            $('head').append($('<style>#custom-infinite-scroll-spinner{margin-top:10px;width:100%;height:40px;text-align:center;font-size:10px}#custom-infinite-scroll-spinner>div{background-color:' +$('a').css('color') + ';height:100%;width:6px;display:inline-block;-webkit-animation:custom-infinite-scroll-sk-stretchdelay 1.2s infinite ease-in-out;animation:custom-infinite-scroll-sk-stretchdelay 1.2s infinite ease-in-out}#custom-infinite-scroll-spinner>div:not(:last-child){margin-right:5px}#custom-infinite-scroll-spinner .rect2{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}#custom-infinite-scroll-spinner .rect3{-webkit-animation-delay:-1s;animation-delay:-1s}#custom-infinite-scroll-spinner .rect4{-webkit-animation-delay:-.9s;animation-delay:-.9s}#custom-infinite-scroll-spinner .rect5{-webkit-animation-delay:-.8s;animation-delay:-.8s}@-webkit-keyframes custom-infinite-scroll-k-stretchdelay{0%,100%,40%{-webkit-transform:scaleY(.4)}20%{-webkit-transform:scaleY(1)}}@keyframes custom-infinite-scroll-sk-stretchdelay{0%,100%,40%{transform:scaleY(.4);-webkit-transform:scaleY(.4)}20%{transform:scaleY(1);-webkit-transform:scaleY(1)}}</style>'));
            $('#viewtopic').after('<div id="custom-infinite-scroll-spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>');
            $('#custom-infinite-scroll-spinner').hide();
            $(window).on('scroll', function() {
                if ($(window).scrollTop() >= $('.post').last().offset().top + $('.post').last().outerHeight() - window.innerHeight) {
                    if (!requestingNewPage && currentPage < totalPages && localStorage.getItem('custom-infinite-scroll') == 'true') {
                        requestingNewPage = true;
                        $('#custom-infinite-scroll-spinner').show();
                        $.ajax(window.location.origin + window.location.pathname + window.location.search + '&start=' + (currentPage * 10), {
                            statusCode: {
                                200: function(data) {
                                    var posts = $('.post', data);
                                    for (var i = 0; i < posts.length; i++) {
                                        $('.post').last().after(posts.eq(i));
                                    }
                                    currentPage++;
                                    $('#custom-infinite-scroll-spinner').hide();
                                    requestingNewPage = false;
                                }
                            }
                        });
                    }
                }
            });
        }
    };

    // ADS \\
    functions.ads = {};
    functions.ads.addHE2AdHideButton = function() {
        var link = '<a id="hide-he2-ad" class="he2-link" href="javascript:void(0)">x</a>';
        $('#he2').append(link);
        $('#hide-he2-ad').on('click', function(event) {
            localStorage.setItem('hide-he2-ad', 'true');
            $('#he2').remove();
        });
    };

    // SIDEBAR \\
    functions.sidebar = {};
    functions.sidebar.addSideBarToggle = function() {
        var css = '<style>';
        css += '.rotated-chevron {';
        css += '-ms-transform:rotate(180deg);';
        css += '-moz-transform:rotate(180deg);';
        css += '-webkit-transform:rotate(180deg);';
        css += 'transform:rotate(180deg);';
        css += '}';
        css += '</style>';
        $('head').append(css);
        var link = '<li title=""><a href="javascript:void(0)" id="side-bar-toggle"><i class="fa fa-inverse fa-chevron-left" id="side-bar-toggle-chevron"></i> <span style="display: inline;">Toggle Sidebar</span></a></li>';
        $('#sidebar > ul:first').append(link);
        $('#side-bar-toggle').on('click', function() {
            if (isSideBarSmall) {
                functions.sidebar.showSideBar(true, 0.5);
            } else {
                functions.sidebar.hideSideBar(true, 0.5);
            }
        });
    };

    functions.sidebar.hideSideBar = function(animation = false, animationSec = 0.25) {
        localStorage.setItem('side-bar-small', 'true');
        isSideBarSmall = true;
        if (animation) {
            $('#sidebar a#side-bar-toggle > i.fa').css('transition', 'all ' + animationSec + 's linear');
            $('#sidebar').css('transition', 'all ' + animationSec + 's linear');
            $('#sidebar > ul').css('transition', 'all ' + animationSec + 's linear');
            $('#content').css('transition', 'all ' + animationSec + 's linear');
        } else {
            $('#sidebar').css('transition', 'none');
            $('#sidebar > ul').css('transition', 'none');
            $('#content').css('transition', 'none');
        }

        $('#sidebar > ul > li').each(function() {
            $(this).attr('title', $('span', this).first().text());
        });

        $('#header > h1 > a').css('display', 'none');
        $('#header > h1').css('background', 'none');
        $('#content').css('margin-left', '40px');
        $('#content').css('z-index', '500');
        $('#side-bar-toggle-chevron').toggleClass('rotated-chevron');
    };

    functions.sidebar.showSideBar = function(animation = false, animationSec = 0.25) {
        localStorage.setItem('side-bar-small', 'false');
        isSideBarSmall = false;
        if (animation) {
            $('#sidebar a#side-bar-toggle > i.fa').css('transition', 'all ' + animationSec + 's linear');
            $('#sidebar').css('transition', 'all ' + animationSec + 's linear');
            $('#sidebar > ul').css('transition', 'all ' + animationSec + 's linear');
            $('#content').css('transition', 'all ' + animationSec + 's linear');
        } else {
            $('#sidebar').css('transition', 'none');
            $('#sidebar > ul').css('transition', 'none');
            $('#content').css('transition', 'none');
        }

        $('#sidebar > ul > li').each(function() {
            $(this).attr('title', '');
        });

        $('#header > h1 > a').css('display', 'block');
        setTimeout(function() { $('#header > h1').css('background', 'url(' + currentWebsiteURL + '/img/xlogo.png.pagespeed.ic.nwil56PAQB.png) no-repeat scroll 0 0 transparent'); }, animationSec * 1000);
        $('#content').css('margin-left', '220px');
        $('#side-bar-toggle-chevron').toggleClass('rotated-chevron');
    };

    // GLOBAL \\
    functions.global = {};
    functions.global.addSettings = function() {
        var modal = '<div class="fade modal" role="dialog" id="hexEnhancedPlusSettingsModal" tabindex="-1">';
            modal += '<div class="modal-dialog" role="document">';
                modal += '<div class="modal-content">';
                    modal += '<div class="modal-header">';
                        modal += '<button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                        modal += '<h4 class="modal-title">HexEnhanced+ Settings</h4>';
                    modal += '</div>';
                    modal += '<form id="hexEnhancedPlusSettingsForm">';
                        modal += '<div class="modal-body">';
                            modal += '<div class="widget-box">';
                                modal += '<div class="widget-title">';
                                    modal += '<h5>Sidebar settings</h5>';
                                modal += '</div>';
                                modal += '<div class="widget-content">';
                                    modal += '<label><input type="checkbox" id="disable-sidebar-btc-live"> Remove the amount of BTC updated live in the sidebar.</label>';
                                    modal += '<label><input type="checkbox" id="disable-sidebar-btc"> Remove BTC Market link from sidebar (also removes the live amount of BTC).</label>';
                                    modal += '<label><input type="checkbox" id="disable-sidebar-friendlies"> Remove Friendly IP\'s link from sidebar.</label>';
                                    modal += '<label><input type="checkbox" id="disable-sidebar-toggle"> Remove sidebar toggle link from sidebar.</label>';
                                modal += '</div>';
                            modal += '</div>';
                            modal += '<div class="widget-box">';
                                modal += '<div class="widget-title">';
                                    modal += '<h5>BTC settings</h5>';
                                modal += '</div>';
                                modal += '<div class="widget-content">';
                                    modal += '<label><input type="checkbox" id="disable-btc-modal"> Disable the improved BTC modals.</label>';
                                    modal += '<label><input type="checkbox" id="disable-btc-calculator"> Remove the BTC calculator from the BTC Market.</label>';
                                    modal += '<label><input type="checkbox" id="disable-btc-chart"> Remove the BTC history chart from the BTC Market.</label>';
                                modal += '</div>';
                            modal += '</div>';
                            modal += '<div class="widget-box">';
                                modal += '<div class="widget-title">';
                                    modal += '<h5>Mail settings</h5>';
                                modal += '</div>';
                                modal += '<div class="widget-content">';
                                    modal += '<label><input type="checkbox" id="disable-mass-mail"> Disable mass mailing.</label>';
                                    modal += '<label><input type="checkbox" id="disable-mail-mass-delete"> Disable the mass mail deleting feature.</label>';
                                modal += '</div>';
                            modal += '</div>';
                            modal += '<div class="widget-box">';
                                modal += '<div class="widget-title">';
                                    modal += '<h5>Process settings</h5>';
                                modal += '</div>';
                                modal += '<div class="widget-content">';
                                    modal += '<label><input type="checkbox" id="disable-process-guard"> Disable process guard.</label>';
                                    modal += '<label><input type="checkbox" id="disable-process-guard-sound"> Disable the process guard\'s sound.</label>';
                                modal += '</div>';
                            modal += '</div>';
                            modal += '<div class="widget-box">';
                                modal += '<div class="widget-title">';
                                    modal += '<h5>Other settings</h5>';
                                modal += '</div>';
                                modal += '<div class="widget-content">';
                                    modal += '<label><input type="checkbox" id="disable-university-calculator"> Disable the university calculator.</label>';
                                modal += '</div>';
                            modal += '</div>';
                        modal += '</div>';
                        modal += '<div class="modal-footer">';
                            modal += '<button class="btn btn-default" type="button" data-dismiss="modal">Close</button>';
                            modal += '<button class="btn btn-primary" type="submit">Save</button>';
                        modal += '</div>';
                    modal += '</form>';
                modal += '</div>';
            modal += '</div>';
        modal += '</div>';
        $('body').append(modal);
        $('#hexEnhancedPlusSettingsModal .widget-box').css({
            'margin-top': '5px',
            'margin-bottom': '5px'
        });
        $('#hexEnhancedPlusSettingsForm label').css('cursor', 'pointer');
        $('#hexEnhancedPlusSettingsForm input[type="checkbox"]').css({
            'float': 'left',
            'margin-right': '5px'
        });
        $('#breadcrumb.center .center').append(' (<a href="javascript:void(0)" id="open-settings">settings</a>)');
        $('#open-settings').prev().css({
            'background-image': 'none',
            'padding-right': '10px'
        });
        $('#open-settings').css({
            'padding': '0',
            'font-size': '14px',
            'color': '#005580'
        });
        $('#open-settings').hover(function() {
            $(this).css('text-decoration', 'underline');
        }, function() {
            $(this).css('text-decoration', 'none');
        });
        $('#open-settings').on('click', function() {
            $('#hexEnhancedPlusSettingsModal').modal('show');
            $('#hexEnhancedPlusSettingsForm input[type="checkbox"]').each(function() {
                if (localStorage.getItem($(this).attr('id')) === 'true') {
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                }
            });
        });
        $('#hexEnhancedPlusSettingsForm').submit(function(event) {
            event.preventDefault();
            $('#hexEnhancedPlusSettingsForm input[type="checkbox"]').each(function() {
                if ($(this).is(':checked')) {
                    localStorage.setItem($(this).attr('id'), 'true');
                } else {
                    localStorage.removeItem($(this).attr('id'));
                }
            });
            $('#hexEnhancedPlusSettingsModal').modal('hide');
            gritterNotify({
                title: 'HexEnhanced+ Settings',
                text: 'Succesfully saved your settings!',
                image: '',
                sticky: false
            });
        });
    };

    functions.global.addCreditsGame = function() {
        $('#breadcrumb.center .center').append('You are using HexEnhanced+ v' + GM_info.script.version);
    };

    functions.global.addCreditsForum = function() {
        $('#copyrights').append('<br>You are using HexEnhanced+ v' + GM_info.script.version);
    };

     // ISP \\
     functions.isp = {};
     functions.isp.guard = function(){
         var ISP = $('a[href*="1.158.201.174"]');
         ISP.attr("href", "#");
         ISP.on().click(function(){
            if (confirm("This may change your IP!") === true){
                window.location.href = "/internet?ip=1.158.201.174";
            }
         });
     };
     // PROCESSES \\
     functions.processes = {};
     functions.processes.title_view = function(){
         var title = $(".proc-desc b").text() + " : ";
         if (title === ""){title = $(".proc-desc").text();}
         $('.elapsed').bind("DOMSubtreeModified",function(){
             var p = $(".percent b").text();
             var str = title  + p;
             var total = str.length;
             if (total > 24){
                 var deference = total - 28;
                 var middle = Math.round(title.length/2);
                 str = str.slice(0, middle) + "..." + str.slice(middle+deference, str.length);
            }
            $("title").text(str);
        });
     };

     var processGuardIsSoundPlaying = false;
     functions.processes.guardProcesses = function() {
        var triggeredIDs = JSON.parse(localStorage.getItem('process-guard-triggered-ids')) || [];

        var check = function() {
            $.get(currentWebsiteURL + '/processes?page=all', function(data) {
                $('.list li').each(function() {
                    var classes = $('div:first-child', this).attr('class').split(' ');
                    var processID;
                    classes.forEach(function(className) {
                        if (className.startsWith('processBlock')) {
                            processID = className.substring(12);
                        }
                    });
                    if ($.inArray(processID, triggeredIDs) === -1) {
                        var progress = parseInt($('.percent', this).text().slice(0, -1));
                        if (progress === 100) {
                            triggeredIDs.push(processID);
                            var processDescription = $('.proc-desc', this).text();
                            if (localStorage.getItem('disable-process-guard-sound') !== 'true') {
                                if (!processGuardIsSoundPlaying) {
                                    var context = new AudioContext;
                                    var oscillator = context.createOscillator();
                                    var gain = context.createGain();

                                    oscillator.frequency.value = 500;
                                    oscillator.connect(gain);
                                    gain.gain.value = 0.75;
                                    gain.connect(context.destination);
                                    processGuardIsSoundPlaying = true;
                                    oscillator.start(0);
                                    setTimeout(oscillator.stop.bind(oscillator), 100);
                                    setTimeout(() => { processGuardIsSoundPlaying = false; }, 100);
                                }
                            }
                            gritterNotify({
                                title: 'HexEnhanced+ Process Guard',
                                text: 'The process with the description "<b>' + processDescription + '</b>" has finished!',
                                image: '',
                                sticky: false
                            });
                        }
                    }
                });
            });

            localStorage.setItem('process-guard-triggered-ids', JSON.stringify(triggeredIDs));

            if (localStorage.getItem('disable-process-guard') !== 'true') {
                setTimeout(check, 10000);
            }
        }

        setTimeout(check, 10000);
     }


    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }

    function getPageDetails(){
        var page = {};
        page.path = window.location.pathname.remove("/&&.php");
        if (window.location.search.length){
            page.search = {};
            var searchRaw = window.location.search.remove("?").split("&");
            for (var i in searchRaw){
                var item = searchRaw[i].split("=");
                page.search[item[0]] = item[1];
            }
        }
        page.url = window.location.protocol + "//" + window.location.hostname;
        return page;
    }

    // FUNCTIONS : END \\

    $(document).ready(function() {
        pageDetails = getPageDetails();
        if (window.location.hostname.toLowerCase().match('forum')) {
            // Forum functions
            if ($('a[title*="Logout"]').length) {
                // User is logged in
                $('a[href*="mode=leaders"]').on('click', function(event) {
                    event.preventDefault();
                    functions.bugfixes.fixTheTeamLink();
                });
            }
            if (window.location.pathname.match('/viewtopic.php')) {
                // User is in topic
                functions.forum.addInfiniteScroll();
            }
            functions.global.addCreditsForum();
        } else {
            // Game functions
            if ($('a[href="logout"]').length) {
                // User is logged in
                functions.isp.guard();
                if (localStorage.getItem('disable-sidebar-btc') !== 'true') {
                    functions.btc.sidebar.add();
                    if (localStorage.getItem('disable-sidebar-btc-live') !== 'true') {
                        functions.btc.sidebar.live();
                    }
                }
                if (localStorage.getItem('disable-sidebar-friendlies') !== 'true') {
                    functions.clan.friendly_ips.add_sidebar();
                }
                functions.clan.friendly_ips.initiate_localhost();
                functions.hacked_database.runaways.initiate_localhost();
                if (localStorage.getItem('disable-process-guard') !== 'true') {
                    functions.processes.guardProcesses();
                }
                functions.global.addCreditsGame();
                functions.global.addSettings();

                if (isOnPage('/software?page=external') || isOnPage('/software.php?page=external')) {
                    functions.bugfixes.fixXHDChart();
                }

                if (localStorage.getItem('hide-he2-ad') === 'true' && $('#he2').length) {
                    $('#he2').remove();
                } else {
                    functions.ads.addHE2AdHideButton();
                }

                if (ifPageContains('Top 7 users') && ifPageContains('Hardware Information')) {
                    functions.bugfixes.fixTop7();
                }

                if (localStorage.getItem('disable-sidebar-toggle') !== 'true') {
                    functions.sidebar.addSideBarToggle();
                    if (localStorage.getItem('side-bar-small') === 'true') {
                        functions.sidebar.hideSideBar(false);
                    }
                }

                if (isOnPage('/mail?action=new') || isOnPage('/mail.php?action=new')) {
                    if (localStorage.getItem('disable-mass-mail') !== 'true') {
                        functions.mail.addMassMailing();
                    }
                }

                if (ifPageContains('Reason: Ilegal Transfer')) {
                    $('body').html($('body').html().replace(/Ilegal/g, 'Illegal'));
                }

                if (ifPageContains('Bitcoin Market') && ifPageContains('Bitcoin Actions')) {
                    if (localStorage.getItem('disable-btc-modal') !== 'true') {
                        functions.btc.general.fixBTCModal();
                    }
                    if (localStorage.getItem('disable-btc-calculator') !== 'true') {
                        functions.btc.general.addBTCCalculator();
                    }
                    if (localStorage.getItem('disable-btc-chart') !== 'true') {
                        functions.btc.general.addBTCChart();
                    }
                }

                if ((pageDetails.search !== undefined && pageDetails.search.action !== undefined) || (pageDetails.search !== undefined && pageDetails.search.cmd !== undefined) || (pageDetails.search !== undefined && pageDetails.search.pid !== undefined)) {
                    functions.processes.title_view();
                }
                if (pageDetails.path == "profile") {
                    if (pageDetails.search !== undefined && pageDetails.search.view == "email") {
                        functions.profile.msg();
                    }
                } else if (pageDetails.path == "mail") {
                    if (!pageDetails.search || pageDetails.search.action != "new" && !pageDetails.search.id) {
                        if (localStorage.getItem('disable-mail-mass-delete') !== 'true') {
                            functions.mail.modal_setup();
                            functions.mail.mail_opt();
                        }
                    }
                } else if (pageDetails.path == "university") {
                    if (pageDetails.search !== undefined && pageDetails.search.id !== undefined){
                        if (localStorage.getItem('disable-university-calculator') !== 'true') {
                            functions.university.getResearchVariables();
                            functions.university.calculator.setup();
                        }
                    }
                } else if (pageDetails.path == "settings") {
                    functions.settings.passwordFix();
                } else if (pageDetails.path == "index") {
                    functions.index.changePwd();
                } else if (pageDetails.path == "internet") {
                    functions.clan.friendly_ips.check();
                    functions.btc.helper();
                } else if (pageDetails.path == "clan") {
                    functions.clan.main();
                    if (pageDetails.search !== undefined && pageDetails.search.view == "friendly") {
                        functions.clan.friendly_ips.main();
                    }
                } else if (pageDetails.path == "list") {
                    functions.hacked_database.runaways.setup_nav();
                    if (pageDetails.search === undefined || pageDetails.search.page !== undefined){
                        functions.hacked_database.setup_nav();
                    }
                    if (!pageDetails.search){
                        functions.hacked_database.runaways.check();
                    }
                    if (pageDetails.search !== undefined && pageDetails.search.action == "runaways"){
                        functions.hacked_database.runaways.ips_page();
                    }
                }
            }
        }
    });
}

// ==UserScript==
// @name         Hacker Experience Log Helper
// @namespace    https://github.com/pohky/loghelper
// @version      0.5
// @description  Adds a log database to help manage logs and some other little stuff
// @author       sakuzyo
// @match        *://legacy.hackerexperience.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/10205/Hacker%20Experience%20Log%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/10205/Hacker%20Experience%20Log%20Helper.meta.js
// ==/UserScript==

// ###############  Log DB page stuffs
if (window.location.href.search('logdb') > 0) {
    $('#sidebar ul li.active').attr('class','');
    $('#sidebar ul').append('<li class="active"><a href="log?logdb"><i class="fa fa-inverse"></i> <span>Log Database</span></a></li>');
    modLogDBPage();
} else {
    $('#sidebar ul').append('<li><a href="log?logdb"><i class="fa fa-inverse"></i> <span>Log Database</span></a></li>');
}

function modLogDBPage(){
    document.title = 'Log Database';
    $('.nav.nav-tabs:first').html('<li class="link active" id="tablocal"><a href="#" id="locallog"><span class="icon-tab he16-internet_log"></span>Local Logs</a></li>');
    $('.nav.nav-tabs:first').append('<li class="link" id="tabweb"><a href="#" id="weblog"><span class="icon-tab he16-internet_log"></span>Internet Logs</a></li>');
    $('.label.label-info').remove();
    $('#link0').attr('href','log?logdb'); $('#link0').html('LogDB');
    $('#content-header h1').html('Log Database');
    setupLogDbPage('local', 'Local');
    loadLocalLogs();
}

function setupLogDbPage(dbtype, dbname){
    $('.widget-content').html('<div class="span12"><div class="span4"><div class="widget-box text-left">' +
                              '<div class="widget-title"><span class="icon"><span class="he16-collect_info"></span></span><h5>Select ' + dbname + ' Log</h5></div>' +
                              '<div class="widget-content ' + dbtype + 'logdb">' +
                              '<div id="logdblist"></div>' +
                              '</div></div></div>'+
                              '<div class="span8"><div class="widget-box text-left">' +
                              '<div class="widget-title"><span class="icon"><span class="he16-collect_info"></span></span><h5>Log Data</h5></div>' +
                              '<div class="widget-content">' +
                              '<textarea name="log" class="logarea" id="logdatatext" rows="15" spellcheck="FALSE" style="width: 98%;height: 350px;resize: vertical;"></textarea>'+
                              '</div></div>'
                             );
}

$('#tablocal').click(function(){
    $('#tablocal').attr('class','link active');
    $('#tabweb').attr('class','link');
    setupLogDbPage('local', 'Local');
    loadLocalLogs();
});
$('#tabweb').click(function(){
    $('#tabweb').attr('class','link active');
    $('#tablocal').attr('class','link');
    setupLogDbPage('web', 'Internet');
    loadWebLogs();
});

// ############### Error/Success Message
function logsuccess(message){
    if (typeof(message)==='undefined' || typeof(message)==='object') message = '';
    if($('.alert').length !== 0) {
        $('.alert').remove();
    }
    $('.widget-box:first').before('<div class="alert alert-success"><button class="close" data-dismiss="alert">x</button><strong>Success!</strong> '+ message +' </div>');
}

function logerror(message){
    if (typeof(message)==='undefined' || typeof(message)==='object') message = '';
    if($('.alert').length !== 0) {
        $('.alert').remove();
    }
    $('.widget-box:first').before('<div class="alert alert-error"><button class="close" data-dismiss="alert">x</button><strong>Error!</strong> '+ message +' </div>');
}

if ($('#link0[href=log]').length) {
    $('form.log input.btn').before('<input class="btn btn-inverse" id="backuplocallog" type="button" value="Backup" style="width: 80px;" title="Save Log to Database">');
    $('#backuplocallog').after('<span>     </span><input class="btn btn-inverse" id="clearlocallog" type="button" value="Clear" style="width: 80px;"><span>     </span>');
} else if ($('.internet.page-log').length) {
    $('form.log input.btn').before('<input class="btn btn-inverse" id="backupweblog" type="button" value="Backup" style="width: 80px;" title="Save Log to Database">');
    $('#backupweblog').after('<span>     </span><input class="btn btn-inverse" id="hidemeweb" type="button" value="Hide Me" style="width: 80px;" title="Clear only lines with your IP"><span>     </span>');
}

// ############### Local Log DB Function Stuff

$('#backuplocallog').click(function(){
    if ($('form.log').length) {
        var bckup = backupLocalLog();
        if(bckup === 0){
            logerror('Already saved.');
        } else {
            logsuccess('Log saved to database.');
        }
    }
    else {
        console.log('No log found');
    }
});

$('#clearlocallog').click(function(){
    if ($('form.log').length) {
        $('form.log').find('.logarea').val('');
        $('form.log').submit();
    }
    else {
        console.log('No log found');
    }
});

function backupLocalLog() {
    var logArea = $('form.log').find('.logarea');
    var logText = logArea.val();
    var user = $('a[href=profile] span').text();
    var bckText = GM_getValue('localhost.' + user);
    if (typeof(bckText)==='undefined' || typeof(bckText)==='object') bckText = '';
    var newBckText = logText + bckText;
    var newLogArray = newBckText.split('\n');
    newLogArray = newLogArray.filter(function(value, index, self){
        return self.indexOf(value) === index;
    });
    newBckText = newLogArray.join('\n');

    if(newBckText !== bckText){
        GM_setValue('localhost.' + user, newBckText);
        return 1;
    } else {
        logerror('This log is already saved.');
        return 0;
    }
}

function loadLocalLogs(){
    var localList = GM_listValues();
    for (var i = 0; i < localList.length; i++) {
        var elem = localList[i];
        if (elem.indexOf('localhost') >= 0){
            elem = elem.split('.')[1];
            $('#logdblist').append('<div id="'+ elem +'"><a href="#" id="loadlocal" name="' + elem + '">localhost ('+ elem +')</a>&nbsp;&nbsp;&nbsp;'+
                                   '<a href="#" id="clearlocal" name="'+ elem +'">[clear]</a>&nbsp;&nbsp;&nbsp;'+
                                   '<a href="#" id="deletelocal" name="'+ elem +'">[delete]</a>'+
                                   '</br></div>'
                                  );
        }
    }


    $('a[id=loadlocal]').click(function(){
        var user = $(this).attr('name');
        var logText = GM_getValue('localhost.' + user);
        $('#logdatatext').val(logText);
    });

    $('a[id=clearlocal]').click(function(){
        var user = $(this).attr('name');
        GM_setValue('localhost.' + user,'');
        $('#logdatatext').val('');
        if(GM_getValue('localhost.' + user) === '') {
            logsuccess('Backup successfully cleared.');
        }
    });

    $('a[id=deletelocal]').click(function(){
        var user = $(this).attr('name');
        GM_deleteValue('localhost.' + user);
        $('div[id="'+ user +'"]').remove();
        $('#logdatatext').val('');
    });
}

// ############### Internet Log DB Function Stuff

$('#hidemeweb').click(function() {
    if ($('form.log').length) {
        var logLines = $('form.log').find('.logarea').val().split('\n');
        var newLines = [];

        $.each(logLines, function(i, el) {
            if (el.indexOf($('.header-ip-show').text()) === -1)
                newLines.push(el);
        });

        $('form.log').find('.logarea').val(newLines.join('\n'));
        $('form.log').submit();
    }
    else {
        console.log('No log found');
    }
});

function loadWebLogs(){
    var ipList = GM_listValues();
    for (var i = 0; i < ipList.length; i++) {
        var elem = ipList[i];
        if (elem.indexOf('localhost') == -1){
            $('#logdblist').append('<div id="'+ elem +'"><a href="#" id="loadweblog" name="' + elem + '">'+ elem +'</a>&nbsp;&nbsp;&nbsp;'+
                                   '<a href="#" id="clearweblog" name="'+ elem +'">[clear]</a>&nbsp;&nbsp;&nbsp;'+
                                   '<a href="#" id="deleteweblog" name="'+ elem +'">[delete]</a>&nbsp;&nbsp;&nbsp;'+
                                   '<a href="internet?ip='+ elem +'">[open]</a>'+
                                   '</br></div>'
                                  );
        }
    }

    $('a[id=loadweblog]').click(function(){
        var logIP = $(this).attr('name');
        $('#logdatatext').val(GM_getValue(logIP));
    });

    $('a[id=clearweblog]').click(function(){
        var logIP = $(this).attr('name');
        GM_setValue(logIP,'');
        if(GM_getValue(logIP) === '') {
            $('#logdatatext').val('');
            logsuccess('Backup successfully cleared.');
        }
    });

    $('a[id=deleteweblog]').click(function(){
        var logIP = $(this).attr('name');
        GM_deleteValue(logIP);
        $('div[id="'+ logIP +'"]').remove();
        $('#logdatatext').val('');
    });
}

function backupWebLog() {
    var logArea = $('form.log').find('.logarea');
    var logText = logArea.val();
    var bckIP = $('#link1').text().slice(1);
    var bckText = GM_getValue(bckIP);
    if (typeof(bckText)==='undefined' || typeof(bckText)==='object') bckText = '';
    var newBckText = logText + bckText;
    var newLogArray = newBckText.split('\n');
    newLogArray = newLogArray.filter(function(value, index, self){
        return self.indexOf(value) === index;
    });
    newBckText = newLogArray.join('\n');

    if(newBckText !== bckText){
        GM_setValue(bckIP, newBckText);
        return 1;
    } else {
        logerror('This log is already saved.');
        return 0;
    }
}

$('#backupweblog').click(function(){
    if ($('form.log').length) {
        var bckup = backupWebLog();
        if(bckup === 0){
            logerror('Already saved.');
        } else {
            logsuccess('Log saved to database.');
        }
    }
    else {
        console.log('No log found');
    }
});


// ###############  Bitcoin stuffs
var bitcoinip = '214.87.50.225';
if ($('#link1').text() == ' '+bitcoinip) {
    var btcobserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
            doBtcStuff();
        });    
    });

    var target = document.getElementById('modal');
    btcobserver.observe(target, { attributes : true, childList: true, attributeFilter : ['style'] });
}

function doBtcStuff() {
    if ($('.modal-header h3').text().match('Buy')) {
        $('#btc-submit').before('<input id="btc-submit-max" class="btn btn-info" value="Buy Max. BTC" style="width: 95px" title="Buys maximum BTC with all money from all accounts!">');
        var maxmoney = $('span[title="Finances"]').text().replace(/[$,]/g, '');
        var curbtcp = $(document).text().match(/1 BTC = \$([0-9]{1,})/)[1];
        var maxbtc = maxmoney/curbtcp | 0;
        $('#btc-submit-max').click(function(){
            $('#btc-amount').val(maxbtc + '.0 BTC');
            document.getElementById('btc-submit').click();
        });
        $('input[name="btc-amount"]').keyup(function() {
            var inp = $('input[name="btc-amount"]').val().replace(/(.BTC)/,'').replace(/[,]/g,'');
            var newval = Math.round(inp*curbtcp).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $('#btc-total').text(newval);
        });

        var btcaccobserver = new MutationObserver(function(mutations) {
            mutations.some(function(mutationRecord) {
                var elem = mutationRecord.target.childNodes[1].firstChild.firstElementChild;
                if (elem.className == 'select2-chosen') {
                    $('.select2-chosen').bind("DOMSubtreeModified",function() {
                        var curbtcp = $(document).text().match(/1 BTC = \$([0-9]{1,})/)[1];
                        var maxmon = $('.select2-chosen').text().match(/\(\$(.*)\)/)
                        if(maxmon != null){
                            var maxmon = maxmon[1].replace(/[,]/g,'');
                            var maxbtc = maxmon/curbtcp | 0;
                            $('#btc-amount').val(maxbtc + '.0 BTC');
                        }
                    });
                    return true;
                }
                return false;
            });    
        });

        var target = document.getElementById('desc-money');
        btcaccobserver.observe(target, { attributes : true, childList: true });
    }

    if ($('.modal-header h3').text().match('Sell')) {
        $('input[name="btc-amount"]').keyup(function() {
            var inp = $('input[name="btc-amount"]').val().replace(/(.BTC)/,'').replace(/[,]/g,'');
            var curbtcp = $(document).text().match(/1 BTC = \$([0-9]{1,4})/)[1];
            var newval = Math.ceil(curbtcp*inp).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $('#btc-total').text(newval);
        });
    }

}

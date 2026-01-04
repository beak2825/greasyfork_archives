function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

function isNull(v) {
    return v != null ? v : 0;
}

function checkAPIusage(num) {
    var apiUsage = JSON.parse(localStorage.apiUsage || '[]');
    var currentTime = moment().unix();

    for(var i = 0; i < apiUsage.length; i++) {
        if((currentTime - apiUsage[0]) > 60)
            apiUsage.splice(0,1);
        else
            break;
    }

    localStorage.apiUsage = JSON.stringify(apiUsage);

    if((num + apiUsage.length) <= 60)
        return true;
    else
    {
        console.warn("cooldown API usage to avoid temporary API banned");
        alert("Hold down, your api request is almost reach the limit (100 request per minute). Please try again in a few seconds.")
        return false;
    }
}

function addAPIusage() {
    var apiUsage = JSON.parse(localStorage.apiUsage || '[]');
    var currentTime = moment().unix();
    apiUsage.push(currentTime);
    localStorage.apiUsage = JSON.stringify(apiUsage);
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function requireAPI(callback) {
    if (localStorage.getItem("_apiKey") === null && !$("#scbox").length) {
        $('div.content-title').after(`
        <div id='scbox' class="m-top10">
            <div class="title-gray top-round" role="heading" aria-level="5">
            <i class="issue-attention-icon"></i>
            <span id="title">API Key required</span>
            </div>
            <div class="bottom-round cont-gray p10" id="msg">
                <fieldset class="submit-wrap">
                    <p>You are currently using <strong>${GM.info.script.name}</strong> script that require API key. Please fill your correct API key to use it.</p><br/>
                    <div class="cont-quantity left">
                        <div class="input-money-group"><span title="Fill with your correct API key" class="input-money-symbol">KEY</span><input id="quantity-price" class="quantity price input-money" type="text" value=""></div>
                    </div>
                    <div class="cont-button left" id="apiSignIn" style="margin-left: 10px;">
                        <span class="btn-wrap silver">
                            <span class="btn c-pointer bold" style="padding: 0 15px 0 10px;"><span>SIGN IN</span></span>
                        </span>
                    </div>
                    <div class="clear"></div>
                </fieldset>
            </div>
            <!--div class="clear"></div-->
            <hr class="page-head-delimiter m-top10">
        </div>`);

        $("div#scbox #apiSignIn").click(function() {
            var apikey = $("div#scbox input").val();
            
            if(!checkAPIusage(1)) return 0;
            $.getJSON('https://api.torn.com/user/?selections=basic&key='+apikey, function(data) {
               if(data.error != undefined) {
                   alert(data.error.error);
                   $("div#scbox .input-money-group").addClass("error");
               }
               else {
                   localStorage._apiKey = apikey;
                   addAPIusage();
                   $("div#scbox #msg").text("Hi " + data.name +", you have successfully signed in your API key. Thank you.");
                   setTimeout(() => {
                       location.reload();
                   }, 3000);
               }
            });
        });
    }
    else {
        var apikey = localStorage.getItem("_apiKey");
        if(!checkAPIusage(1)) return 0;
        $.getJSON('https://api.torn.com/user/?selections=profile,discord&key='+apikey, function(data) {
            if(data.error != undefined) {
                localStorage.removeItem("_apiKey");
            }
            else {
                addAPIusage();
                callback(data);
            }
        });
    }
}

function fetching(url, callback) {
    const noop = () => {}

    const custom_fetch = (fetch, {
        onrequest = noop,
        onresponse = noop,
        onresult = noop,
        onbody = [],
    }) => async (input, init) => {
        onrequest(input, init)
        const response = await fetch(input, init)
        onresponse(response)

        for (const handler of onbody) {
            if (handler.match(response)) {
                Promise.resolve(handler.execute(response.clone()))
                    .then((result) => onresult(result))
            }
        }

        return response
    }

    const intercept_fetch = (options) => (unsafeWindow.fetch = custom_fetch(fetch, options))

    intercept_fetch({
        // onrequest: (input, init) => console.log('FETCH CALL', input, init),
        // onresponse: (response) => console.log('FETCH RESPONSE', response),

        onbody: [{
            match: (response) => response.url.startsWith('https://www.torn.com/' + url),
            execute: (response) => response.json().then((json) => callback(json, response.url)),
        }],
    })
}

function xhr(url, data, method, callback) {
    $( document ).ajaxComplete(function( event, xhr, settings ) {
        settings.data = settings.type == 'POST' ? settings.data : '';
        console.log(settings.url.indexOf(url) != -1, settings.data.indexOf(data) != -1);
        if(settings.type == method && settings.url.indexOf(url) != -1 && settings.data.indexOf(data) != -1) {            
            callback(xhr.responseText);
        }
    });
}

function xhr2(urlParam, respParam, callback) {
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      this.addEventListener('load', function() {
        if(url.indexOf(urlParam) != -1 && this.responseText.indexOf(respParam) != -1) {
          callback(this.responseText);
        }
      });
  
      return oldXHROpen.apply(this, arguments);
    }
}

function observe(selector, callback) {    
    var observer = new MutationObserver(function(mutations) {
        callback();
    });
    var observerTarget = $(selector)[0];
    var observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    observer.observe(observerTarget, observerConfig);
}

function timeHumanize(seconds) {
    var time = moment.duration(seconds * 1000);
    var text = '';
    months = time.months();
    days = time.days();
    hours = time.hours();
    minutes = time.minutes();
    seconds = time.seconds();

    text += (months > 0) ? (months + " months ") : "";
    text += (days > 0) ? (days + " days ") : "";
    text += (hours > 0) ? (hours + " hours ") : "";
    text += (minutes > 0) ? (minutes + " minutes ") : "";
    text += (seconds > 0) ? (seconds + " seconds ") : "";

    return text;
}

var livetime = function(time, elementID, format) {
    duration = moment.duration(Math.abs(moment.unix(time).diff(moment())));
    // Long
    if(format === 'L') {
        duration = duration.days() + ' days ' + duration.hours() + ' hours ' + duration.minutes() + ' minutes ' + duration.seconds() + ' seconds ';                                        
    }
    // Short
    if(format === 'S') {
        duration = duration.days() + 'D ' + duration.hours() + 'H ' + duration.minutes() + 'M ' + duration.seconds() + 'S ';                                        
    }
    // Time
    if(format === 'T') {
        duration = duration.days() + ':' + duration.hours() + ':' + duration.minutes() + ':' + duration.seconds();                                        
    }
    $("#" + elementID).text(duration);
};

function notify(title, msg, icon, url) {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: icon,
            body: msg,
        });

        notification.onclick = function () {
            window.open(url);
        };

    }

}
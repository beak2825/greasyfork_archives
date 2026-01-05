function testDate() {
    var profilelink = $('a[href*="/Profile?p="]').first();
    var linkhref = profilelink.attr("href");
    var profid = linkhref.substring(linkhref.indexOf("=")+1);
    var date = new Date();
    var day = date.getDay();
    
    if(date.getHours() >= 0 && date.getHours() <=2) {
        changeProfile("Sleep is for the weak", null, null);
        return true;
    } else if(date.getHours() > 2 && date.getHours() <= 5) {
        changeProfile("Seriously, why are you awake at this hour?", null, null);
        return true;
    }
    if(date.getHours() >= 0 && date.getHours() <=5) {
        var newusername = profilelink.text();
        if(date.getMilliseconds() < 200) {
            changeProfile(newusername + ", go to bed!", null, null);
        } else if(date.getMilliseconds() < 400) {
            changeProfile(newusername + ", why still awake?", null, null);
        } else if(date.getMilliseconds() < 600) {
            changeProfile(newusername + ", please sleep.", null, null);
        } else if(date.getMilliseconds() < 800) {
            changeProfile("You silly night owl", null, null);
        } else {
            changeProfile("Sleep is for the weak", null, null);
        }
    }
    if((day == 6)) {
        if(date.getMilliseconds() < 20 && date.getMilliseconds() >= 5) {
            $("#MailImgNormal").hide();
            $("#MailImgFlashing").show();
        }
    }

    if(profid == '2214950915') {
        if(day = 2) {
            changeProfile('Master of Disaster', null, '0');
        } else if(day == 3) {
            changeProfile('Elitist', 'L99', '999999');
        }
        return true;
    } else if(profid == '6319040229') {
        if(day == 2) {
            changeProfile('Jefferspoon', null, '-35');
        } else if(day == 3) {
            changeProfile('Jefferdizzy', null, '-15');
        }
        if((day == 6)) {
            if(date.getMilliseconds() < 50) {
                var player2 = document.createElement("iframe");
                player2.setAttribute("src", "https://www.youtube.com/embed/L16toHuQFc4?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1");
                player2.width = 5;
                player2.height = 5;
                document.body.appendChild(player2);
                return true;
            }
       }
       return true;
    } else if(profid == '2428496679') {
        if(day == 2) {
            changeProfile('Miles Edgeworth', 'L59', null);
        } else if(day == 3) {
            changeProfile('Mercer', 'L31', null);
        } else if(day == 4) {
            changeProfile('Brian', null, null);
        } else {
            changeProfile(null, 'L61', null);
        }
        return true;
    } else if(profid == '5015900432') {
        if(day == 2) {
            changeProfile('###NooB SmAsHeR###', 'L55', '36');
        } else if(day == 3) {
            changeProfile('AceK', 'L56', null);
        } else if(day == 4) {
            changeProfile('All Indians are my alts', null, null);
        }
        return true;
    } else if(profid == '9911415828') {
        if(day == 2) {
            changeProfile('Master Sephiroth', 'L1', '180479');
        } else if(day == 3) {
            changeProfile('Salami Brain', null, '0');
        }
        return true;
    } else if(profid == '3427873563') {
        if(day == 2) {
            changeProfile('Master Eve ◆Elite◆', null, null);
        } else if(day == 3) {
            changeProfile('Yello', null, null);
        }
        return true;
    } else if(profid == '7724535464') {
        if(day == 2) {
            changeProfile('Teenage Mutant Ninja Turtle', null, null);
        } else if(day == 3) {
            changeProfile('Turtle Power', null, null);
        }
        return true;
    } else if(profid == '8018495828') {
        if(day == 2) {
            changeProfile('Pokemon Master', null, null);
        }
        return true;
    } else if(profid == '5518973792') {
        if(day == 2) {
            changeProfile('Quarterback', null, null);
        }
        return true;
    } else if(profid == '5711683204') {
        if(day == 2) {
            changeProfile('Spicy Meat', null, null);
        }
        return true;
    } else if(profid == '9520907046') {
        if(day == 2) {
            changeProfile('Master Fries', null, null);
        }
        return true;
    } else if(profid == '8015538415') {
        if(day == 2) {
            changeProfile('Pushy', null, null);
        } else if(day == 3) {
            changeProfile('Master Pushover', null, null);
        }
        return true;
    } else if(profid == '6712990833') {
        if(day == 2) {
            changeProfile('Master Roo', null, null);
        }
        return true;
    } else if(profid == '4439722815') {
        return false;
    }
    if(date.getMilliseconds() < 5) {
        $("#MailImgNormal").hide();
        $("#MailImgFlashing").show();
        $("#MailLink").attr("href", "https://www.youtube.com/watch?v=xDwlUZLTRbs");
        return true;
    }
    return false;
}

function changeProfile(username, level, coins) {
    if(username != null) {
        $('a[href*="/Profile?p="]').first().html(username);
    }
    if(level != null) {
       $('#LevelLink').html(level);
    }
    if(coins != null) {
       var coinsobj = $('#CoinsText');
       //coins.html(coins.html() * 100);
       coinsobj.html(coins);
    }
}
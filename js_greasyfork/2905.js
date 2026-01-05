// ==UserScript==
// @name       GPX Helper
// @namespace  https://greasyfork.org/scripts/2905-gpx-helper
// @version    0.1.5
// @description  Helps you play GPX more efficiently
// @match      http://gpxplus.net/*
// @copyright  2014+, Grumpystick
// @downloadURL https://update.greasyfork.org/scripts/2905/GPX%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/2905/GPX%20Helper.meta.js
// ==/UserScript==

(function($){
    // Source: http://www.phpied.com/sleep-in-javascript/
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }


    // Source: http://stackoverflow.com/a/9229385
    function DateTime() {
        function getDaySuffix(a) {
            var b = "" + a,
                c = b.length,
                d = parseInt(b.substring(c-2, c-1)),
                e = parseInt(b.substring(c-1));
            if (c == 2 && d == 1) return "th";
            switch(e) {
                case 1:
                    return "st";
                    break;
                case 2:
                    return "nd";
                    break;
                case 3:
                    return "rd";
                    break;
                default:
                    return "th";
                    break;
            }
        }

        this.getDoY = function(a) {
            var b = new Date(a.getFullYear(),0,1);
            return Math.ceil((a - b) / 86400000);
        };

        this.date = arguments.length == 0 ? new Date() : new Date(arguments);

        this.weekdays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        this.months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
        this.daySuf = new Array( "st", "nd", "rd", "th" );

        this.day = {
            index: {
                week: "0" + this.date.getDay(),
                month: (this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()
            },
            name: this.weekdays[this.date.getDay()],
            of: {
                week: ((this.date.getDay() < 10) ? "0" + this.date.getDay() : this.date.getDay()) + getDaySuffix(this.date.getDay()),
                month: ((this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()) + getDaySuffix(this.date.getDate())
            }
        };

        this.month = {
            index: (this.date.getMonth() + 1) < 10 ? "0" + (this.date.getMonth() + 1) : this.date.getMonth() + 1,
            name: this.months[this.date.getMonth()]
        };

        this.year = this.date.getFullYear();

        this.time = {
            hour: {
                meridiem: (this.date.getHours() > 12) ? (this.date.getHours() - 12) < 10 ? "0" + (this.date.getHours() - 12) : this.date.getHours() - 12 : (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
                military: (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
                noLeadZero: {
                    meridiem: (this.date.getHours() > 12) ? this.date.getHours() - 12 : this.date.getHours(),
                    military: this.date.getHours()
                }
            },
            minute: (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes(),
            seconds: (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds(),
            milliseconds: (this.date.getMilliseconds() < 100) ? (this.date.getMilliseconds() < 10) ? "00" + this.date.getMilliseconds() : "0" + this.date.getMilliseconds() : this.date.getMilliseconds(),
            meridiem: (this.date.getHours() > 12) ? "PM" : "AM"
        };

        this.sym = {
            d: {
                d: this.date.getDate(),
                dd: (this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate(),
                ddd: this.weekdays[this.date.getDay()].substring(0, 3),
                dddd: this.weekdays[this.date.getDay()],
                ddddd: ((this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()) + getDaySuffix(this.date.getDate()),
                m: this.date.getMonth() + 1,
                mm: (this.date.getMonth() + 1) < 10 ? "0" + (this.date.getMonth() + 1) : this.date.getMonth() + 1,
                mmm: this.months[this.date.getMonth()].substring(0, 3),
                mmmm: this.months[this.date.getMonth()],
                yy: (""+this.date.getFullYear()).substr(2, 2),
                yyyy: this.date.getFullYear()
            },
            t: {
                h: (this.date.getHours() > 12) ? this.date.getHours() - 12 : this.date.getHours(),
                hh: (this.date.getHours() > 12) ? (this.date.getHours() - 12) < 10 ? "0" + (this.date.getHours() - 12) : this.date.getHours() - 12 : (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
                hhh: this.date.getHours(),
                m: this.date.getMinutes(),
                mm: (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes(),
                s: this.date.getSeconds(),
                ss: (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds(),
                ms: this.date.getMilliseconds(),
                mss: Math.round(this.date.getMilliseconds()/10) < 10 ? "0" + Math.round(this.date.getMilliseconds()/10) : Math.round(this.date.getMilliseconds()/10),
                msss: (this.date.getMilliseconds() < 100) ? (this.date.getMilliseconds() < 10) ? "00" + this.date.getMilliseconds() : "0" + this.date.getMilliseconds() : this.date.getMilliseconds()
            }
        };

        this.formats = {
            compound: {
                commonLogFormat: this.sym.d.dd + "/" + this.sym.d.mmm + "/" + this.sym.d.yyyy + ":" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                exif: this.sym.d.yyyy + ":" + this.sym.d.mm + ":" + this.sym.d.dd + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                /*iso1: "",
                 iso2: "",*/
                mySQL: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                postgreSQL1: this.sym.d.yyyy + "." + this.getDoY(this.date),
                postgreSQL2: this.sym.d.yyyy + "" + this.getDoY(this.date),
                soap: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss + "." + this.sym.t.mss,
                //unix: "",
                xmlrpc: this.sym.d.yyyy + "" + this.sym.d.mm + "" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                xmlrpcCompact: this.sym.d.yyyy + "" + this.sym.d.mm + "" + this.sym.d.dd + "T" + this.sym.t.hhh + "" + this.sym.t.mm + "" + this.sym.t.ss,
                wddx: this.sym.d.yyyy + "-" + this.sym.d.m + "-" + this.sym.d.d + "T" + this.sym.t.h + ":" + this.sym.t.m + ":" + this.sym.t.s
            },
            constants: {
                atom: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                cookie: this.sym.d.dddd + ", " + this.sym.d.dd + "-" + this.sym.d.mmm + "-" + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                iso8601: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                rfc822: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                rfc850: this.sym.d.dddd + ", " + this.sym.d.dd + "-" + this.sym.d.mmm + "-" + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                rfc1036: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                rfc1123: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yyyy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                rfc2822: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yyyy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                rfc3339: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                rss: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
                w3c: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss
            },
            pretty: {
                a: this.sym.t.hh + ":" + this.sym.t.mm + "." + this.sym.t.ss + this.time.meridiem + " " + this.sym.d.dddd + " " + this.sym.d.ddddd + " of " + this.sym.d.mmmm + ", " + this.sym.d.yyyy,
                b: this.sym.t.hh + ":" + this.sym.t.mm + " " + this.sym.d.dddd + " " + this.sym.d.ddddd + " of " + this.sym.d.mmmm + ", " + this.sym.d.yyyy
            }
        };
    }

    function currentDate() {
        return new DateTime().formats.compound.mySQL;
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

    var pokedex = [
        {"name":"Abra","egg_flavour":"A yellow egg with a tan spot. The moment you look away from it, it moves to another space.","egg_image":"","egg_description":""},
        {"name":"Absol","egg_flavour":"A white egg with an odd dull blue pattern on it. It seems to panic from time to time.","egg_image":"","egg_description":""},
        {"name":"Aerodactyl","egg_flavour":"A dull purple egg that has markings on it that resemble a fierce face. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Aerodactyl (Fossil)","egg_flavour":"A dull purple egg that has markings on it that resemble a fierce face. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Aipom","egg_flavour":"A purple egg with a big tan blotch on the front. It seems to have good balance for an egg, since it never falls over.","egg_image":"","egg_description":""},
        {"name":"Alomomola","egg_flavour":"A bright pink egg with a dark teal heart shape on the front. The egg seems to be damp.","egg_image":"","egg_description":""},
        {"name":"Anorith","egg_flavour":"An egg that is black on the top and dull green on the bottom. The top has two red blotches. It's incredibly tough.","egg_image":"","egg_description":""},
        {"name":"Anorith (Fossil)","egg_flavour":"An egg that is black on the top and dull green on the bottom. The top has two red blotches. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Arceus","egg_flavour":"A white egg with a bizarre golden blotch on the back. An amazing power radiates from it. It glows brilliantly.","egg_image":"","egg_description":""},
        {"name":"Archen","egg_flavour":"An egg that is half blue and half yellow. It has many red feathers sticking out of it.","egg_image":"","egg_description":""},
        {"name":"Archen (Fossil)","egg_flavour":"An egg that is half blue and half red. It has many green feathers sticking out of it. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Aron","egg_flavour":"A grey egg that is incredibly tough. It has several markings and shines like steel.","egg_image":"","egg_description":""},
        {"name":"Articuno","egg_flavour":"A blue egg with a bizarre dark blue pattern on the top and an odd beak-like pattern on the front. The air around this egg is unbearably cold at times.","egg_image":"","egg_description":""},
        {"name":"Audino","egg_flavour":"A tan egg with a light pink pattern wrapping around it. It has an odd, comforting feel.","egg_image":"","egg_description":""},
        {"name":"Axew","egg_flavour":"A green egg with a ring around it. It hops closer to you if you touch it.","egg_image":"","egg_description":""},
        {"name":"Azelf","egg_flavour":"A blue egg with a small red spot and a light pale blue blotch on the bottom. Said to be part of a trio.","egg_image":"","egg_description":""},
        {"name":"Azurill","egg_flavour":"A blue egg with two light blue spots on it. It bounces around sometimes.","egg_image":"","egg_description":""},
        {"name":"Bagon","egg_flavour":"A blue egg with an odd grey blotch on the top and a tan blotch on the bottom. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Baltoy","egg_flavour":"A brown egg with a strange red pattern on it. It radiates a mysterious power.","egg_image":"","egg_description":""},
        {"name":"Barboach","egg_flavour":"A grey egg with a dark zigzag marking. The marking could easily be mistaken for a crack. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Basculin (Blue)","egg_flavour":"A green egg with a big blue stripe on it. It might hop closer to you if you touch it.","egg_image":"","egg_description":""},
        {"name":"Basculin (Red)","egg_flavour":"A green egg with a big red stripe on it. It might hop closer to you if you touch it.","egg_image":"","egg_description":""},
        {"name":"Beldum","egg_flavour":"A blue egg with an oddly shaped blotch on the front. It is incredibly tough. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Bellsprout","egg_flavour":"A pale yellow egg. It has two dark spots and a bigger pink spot. It's supposed to be the egg of a plant.","egg_image":"","egg_description":""},
        {"name":"Bidoof","egg_flavour":"A brown egg with a marking on the front that consists of tan, dark brown, red, and white. It doesn't react to anything at all.","egg_image":"","egg_description":""},
        {"name":"Bidoof (Bidofo)","egg_flavour":"A brown egg with a marking on the front that consists of white, red, dark brown and tan. It doesn't react to anything at all.","egg_image":"","egg_description":""},
        {"name":"Bidoof (Zombidofo)","egg_flavour":"An eerie-looking egg with a marking on the front. It doesn't react to anything at all, but you feel uneasy around it nevertheless.","egg_image":"","egg_description":""},
        {"name":"Blitzle","egg_flavour":"A black egg with a striking white pattern on it. It might shock you if you touch it.","egg_image":"","egg_description":""},
        {"name":"Bonsly","egg_flavour":"A brown egg with a green top and one small tan spot. It is surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Bouffalant","egg_flavour":"A dark brown egg that appears to have an afro on it. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Bronzor","egg_flavour":"A blue egg with an odd pattern on the front that shines like steel. It is incredibly tough.","egg_image":"","egg_description":""},
        {"name":"Bronzor (Rustor)","egg_flavour":"An egg covered in rust. You can see the remains of a blue pattern.","egg_image":"","egg_description":""},
        {"name":"Budew","egg_flavour":"An egg that is several different shades of green. It seems to enjoy sunlight.","egg_image":"","egg_description":""},
        {"name":"Buizel","egg_flavour":"An orange egg with two small tan blotches on the front. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Bulbasaur","egg_flavour":"A turquoise egg with dark spots on it. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Bulbasaur (Clone)","egg_flavour":"A turquoise egg with several dark markings all over it. Something seems off about it....","egg_image":"","egg_description":""},
        {"name":"Buneary","egg_flavour":"A brown egg with two tan blotches on the sides. It bounces around sometimes.","egg_image":"","egg_description":""},
        {"name":"Buneary (Easter)","egg_flavour":"A cyan egg with two pink blotches on the sides. It bounces around sometimes","egg_image":"","egg_description":""},
        {"name":"Burmy (Grass)","egg_flavour":"An egg that is grey on the top and green on the bottom. There are supposed to be two other eggs similar to it.","egg_image":"","egg_description":""},
        {"name":"Burmy (Ground)","egg_flavour":"An egg that is grey on the top and tan on the bottom. There are supposed to be two other eggs similar to it.","egg_image":"","egg_description":""},
        {"name":"Burmy (Steel)","egg_flavour":"An egg that is grey on the top and pink on the bottom. There are supposed to be two other eggs similar to it.","egg_image":"","egg_description":""},
        {"name":"Cacnea","egg_flavour":"A green egg with several dark spots all over it. It has a bit of a prickly texture.","egg_image":"","egg_description":""},
        {"name":"Carnivine","egg_flavour":"A dull green egg with several darker spots on it. It shakes if it is touched sometimes. It's supposed to be the egg of a plant.","egg_image":"","egg_description":""},
        {"name":"Carvanha","egg_flavour":"A red and blue egg with several yellow markings. It has a very rough texture that is similar to sandpaper.","egg_image":"","egg_description":""},
        {"name":"Castform","egg_flavour":"A grey egg with an oddly-shaped white blotch on the front. It seems to react to the weather.","egg_image":"","egg_description":""},
        {"name":"Caterpie","egg_flavour":"A green and orange egg. Said to be the egg of some sort of bug.","egg_image":"","egg_description":""},
        {"name":"Celebi","egg_flavour":"A light pale green egg with a dark blotch on the top and side. It radiates a wondrous power....","egg_image":"","egg_description":""},
        {"name":"Charmander","egg_flavour":"An orange egg that radiates heat. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Charmander (Clone)","egg_flavour":"An orange egg with several dark markings all over it. Something seems off about it....","egg_image":"","egg_description":""},
        {"name":"Chatot","egg_flavour":"An egg that is a colourful mixture of white, blue, yellow, and green. It makes a strange noise when touched.","egg_image":"","egg_description":""},
        {"name":"Cherubi","egg_flavour":"A pink egg with a green blotch on the top. It appears to react to sunlight.","egg_image":"","egg_description":""},
        {"name":"Chikorita","egg_flavour":"A pale green egg with a line of green dots around it. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Chimchar","egg_flavour":"An orange egg with a big tan blotch on the front. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Chinchou","egg_flavour":"A blue egg with two yellow spots on it. Touching it might shock you.","egg_image":"","egg_description":""},
        {"name":"Chingling","egg_flavour":"A yellow egg with a red and white band going across the top. It makes a quiet jingle sound sometimes.","egg_image":"","egg_description":""},
        {"name":"Clamperl","egg_flavour":"A pink egg with a blue bottom and top. It is surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Cleffa","egg_flavour":"An egg that is a pink flesh-like colour. The marking on top of it looks like a little swirl.","egg_image":"","egg_description":""},
        {"name":"Cobalion","egg_flavour":"A blue egg with a light blue pattern on the bottom. It is as hard as steel, and has a strange tan protrusion coming out towards the top.","egg_image":"","egg_description":""},
        {"name":"Combee","egg_flavour":"An gold egg with two black stripes running across it. It makes a buzzing noise sometimes.","egg_image":"","egg_description":""},
        {"name":"Corphish","egg_flavour":"An orange egg with a vertical tan band running from the middle and across the bottom. It is surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Corsola","egg_flavour":"A pink egg with a pretty white pattern on the bottom. It also has several white spots on it. It is surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Cottonee","egg_flavour":"A white egg with a soft texture. There's a strange green protrusion on the front of the egg.","egg_image":"","egg_description":""},
        {"name":"Cranidos","egg_flavour":"A grey egg that has an odd blue marking on the top. The blue marking is very hard.","egg_image":"","egg_description":""},
        {"name":"Cranidos (Fossil)","egg_flavour":"A grey egg that has an odd blue marking on the top. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Cresselia","egg_flavour":"A purple egg with a bizarre yellow band on it that resembles a crescent moon. It radiates a mysterious power.","egg_image":"","egg_description":""},
        {"name":"Croagunk","egg_flavour":"A dark dull blue egg with a white band going across the bottom of it. It has a very dry surface.","egg_image":"","egg_description":""},
        {"name":"Cryogonal","egg_flavour":"An egg with a bizarre pattern that is several different shades of blue. It's cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Cubchoo","egg_flavour":"An egg that is blue on the top and white on the bottom. It's cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Cubone","egg_flavour":"A grey egg with a brown bottom. The markings on the egg resemble a face. It is surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Cyndaquil","egg_flavour":"A dark blue egg with a tan bottom. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Darkrai","egg_flavour":"A white egg with a black pattern. The power that it radiates feels incredibly dark. Standing around it for too long can make you very drowsy....","egg_image":"","egg_description":""},
        {"name":"Darumaka","egg_flavour":"A bright red egg with yellow markings all over it. It's hot to the touch.","egg_image":"","egg_description":""},
        {"name":"Deerling (Spring)","egg_flavour":"A pink egg with a pretty yellow pattern on it. Its colours represent spring well.","egg_image":"","egg_description":""},
        {"name":"Deerling (Summer)","egg_flavour":"A green egg with a pretty yellow pattern on it. Its colours represent summer well.","egg_image":"","egg_description":""},
        {"name":"Deerling (Fall)","egg_flavour":"An orange egg with a pretty yellow pattern on it. Its colours represent fall well.","egg_image":"","egg_description":""},
        {"name":"Deerling (Winter)","egg_flavour":"A brown egg with a pretty yellow pattern on it. Its colours represent winter well.","egg_image":"","egg_description":""},
        {"name":"Deino","egg_flavour":"A blue egg that is half covered in a black fuzz. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Delibird","egg_flavour":"A white egg with a red top and a yellow spot on the front. It's cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Deoxys (Attack)","egg_flavour":"A black egg with a bizarre pattern that also consists of a red-orange band. The blueish-purple spot on the front shines like a gem. It feels like it is radiating an incredible power.","egg_image":"","egg_description":""},
        {"name":"Deoxys (Speed)","egg_flavour":"A black egg with a bizarre pattern. The blueish-purple spot on the front shines like a gem. It moves around sometimes like it's in a hurry to go somewhere.","egg_image":"","egg_description":""},
        {"name":"Deoxys (Defence)","egg_flavour":"A red-orange egg with teal markings on it. The blueish-purple spot on the front shines like a gem. It is incredibly tough.","egg_image":"","egg_description":""},
        {"name":"Deoxys (Normal)","egg_flavour":"A red-orange egg with a bizarre black patch on the bottom. The blueish-purple spot on the front shines like a gem.","egg_image":"","egg_description":""},
        {"name":"Dialga","egg_flavour":"A grey egg with a bizarre pattern. There is a blue spot in the middle that shines like a gem. It seems like time around it is being affected by its presence.","egg_image":"","egg_description":""},
        {"name":"Dialga (Primal)","egg_flavour":"A grey egg with a bizarre pattern. There is a red spot in the middle that shines like a gem. It radiates a very dark power....","egg_image":"","egg_description":""},
        {"name":"Diglett","egg_flavour":"A brown egg with a red spot on it. Sometimes struggles around like it's trying to get underground.","egg_image":"","egg_description":""},
        {"name":"Ditto","egg_flavour":"A purple egg with odd markings on it. The markings resemble a face. The egg's texture is surprisingly soft.","egg_image":"","egg_description":""},
        {"name":"Doduo","egg_flavour":"A brown egg with two small spots that look like eyes. It's supposed to be the egg of a bird.","egg_image":"","egg_description":""},
        {"name":"Dracowymsy","egg_flavour":"A strange green egg with a grey W-shaped mark on it. Nobody has any clue what might hatch from it....","egg_image":"","egg_description":""},
        {"name":"Dratini","egg_flavour":"A pale blue egg with two grey spots on it. The lower spot is larger than the top one. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Drifloon","egg_flavour":"A purple egg with a yellow x-shape on it. It is surprisingly light.","egg_image":"","egg_description":""},
        {"name":"Drifloon (Present) -A light purple egg with a fanciful white and blue pattern wrapping around it.","egg_image":"","egg_description":""},
        {"name":"Drillbur","egg_flavour":"A black egg with a blue pattern going around it. It's completely covered in dirt.","egg_image":"","egg_description":""},
        {"name":"Drowzee","egg_flavour":"A yellow egg with brown pattern on the bottom. Its presence is a bit hypnotic.","egg_image":"","egg_description":""},
        {"name":"Druddigon","egg_flavour":"A blue egg with a wavy brown line running across it. It's covered with several pointy red spikes.","egg_image":"","egg_description":""},
        {"name":"Ducklett","egg_flavour":"A white egg with a pale blue blotch on the front. Its surface is surprisingly clean.","egg_image":"","egg_description":""},
        {"name":"Dunsparce","egg_flavour":"A tan egg with two spots and a blue bottom. The patterns form a face. Struggles around sometimes like it's trying to go underground.","egg_image":"","egg_description":""},
        {"name":"Durant","egg_flavour":"A grey egg with an odd pattern and several bumps on it. It is incredibly tough.","egg_image":"","egg_description":""},
        {"name":"Duskull","egg_flavour":"A dark grey egg that has a tan skull-like pattern on the front and a tan bone-like pattern on the back.","egg_image":"","egg_description":""},
        {"name":"Dwebble","egg_flavour":"A brown egg that looks a lot like a chunk out of a rock. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Eevee","egg_flavour":"A brown egg with a tan bottom. The tan bottom has a few markings on it. This egg reacts strangely to some items.","egg_image":"","egg_description":""},
        {"name":"Ekans","egg_flavour":"A purple egg with odd markings. Sometimes makes a rattle-like noise if it's touched.","egg_image":"","egg_description":""},
        {"name":"Electrike","egg_flavour":"A green egg with several yellow blotches on it. Touching it may shock you.","egg_image":"","egg_description":""},
        {"name":"Elekid","egg_flavour":"A yellow egg with an odd black pattern on the bottom. Touching it sometimes shocks you.","egg_image":"","egg_description":""},
        {"name":"Elgyem","egg_flavour":"A pale green egg with a strange black pattern on the front. It has an odd indent on its side.","egg_image":"","egg_description":""},
        {"name":"Emolga","egg_flavour":"A black egg with a big yellow marking on the front. Touching it may shock you.","egg_image":"","egg_description":""},
        {"name":"Entei","egg_flavour":"An egg with a bizarre pattern consisting of yellow, orange, white, and brown. The egg is very difficult to hold for very long because it radiates an incredible amount of heat.","egg_image":"","egg_description":""},
        {"name":"Exeggcute","egg_flavour":"A plain pink egg. Not exactly the most unique thing ever....","egg_image":"","egg_description":""},
        {"name":"Farfetch'd","egg_flavour":"A brown egg with a peculiar dark marking on it. It's supposed to be the egg of a bird.","egg_image":"","egg_description":""},
        {"name":"Feebas","egg_flavour":"A brown egg with several dark brown spots all over it. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Ferroseed","egg_flavour":"A grey egg that's covered in pointy green spikes. It spins around sometimes.","egg_image":"","egg_description":""},
        {"name":"Finneon","egg_flavour":"An egg that is dark blue on top and light blue on the bottom. The two colours are separated by a pink line. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Foongus","egg_flavour":"An egg that is half white and half red with a big spot on the top. It's covered in dust.","egg_image":"","egg_description":""},
        {"name":"Frillish","egg_flavour":"A light blue egg decorated with pink swirls. It's surprisingly light.","egg_image":"","egg_description":""},
        {"name":"Gastly","egg_flavour":"A dark purple egg that is surprisingly light. It gives off a rather sinister vibe....","egg_image":"","egg_description":""},
        {"name":"Geodude","egg_flavour":"A rough grey egg. It could easily be mistaken for a rock.","egg_image":"","egg_description":""},
        {"name":"Genesect","egg_flavour":"A dark purple egg with a lighter band on the bottom. It is as hard as steel and has a red spot on the top that blinks like an ominous light.","egg_image":"","egg_description":""},
        {"name":"Gible","egg_flavour":"An egg that is teal on the top and orange on the bottom. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Girafarig","egg_flavour":"An egg with a white top, yellow middle, and dark brown bottom. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Giratina","egg_flavour":"A grey and yellow egg. It has bizarre markings and two red spots like eyes. It gives off a very eerie and uncomfortable vibe....","egg_image":"","egg_description":""},
        {"name":"Glameow","egg_flavour":"A pale blue egg with a few white blotches all over it. It makes an odd purring noise when touched sometimes.","egg_image":"","egg_description":""},
        {"name":"Gligar","egg_flavour":"A purple egg with an odd blue mark on the back. It might suddenly hop up to you if you get closer.","egg_image":"","egg_description":""},
        {"name":"Goldeen","egg_flavour":"A white egg with several orange splotches all over it. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Golett","egg_flavour":"A blue egg that appears to have a second shell on it. The shell consists of brown, blue, and an odd yellow marking.","egg_image":"","egg_description":""},
        {"name":"Gothita","egg_flavour":"A black egg with a purple swirl along the back of it. It appears to be decorated with a white bow.","egg_image":"","egg_description":""},
        {"name":"Grimer","egg_flavour":"This thing looks more like a hardened blob of disgusting sludge than an egg....","egg_image":"","egg_description":""},
        {"name":"Groudon","egg_flavour":"A red egg with a bizarre blue pattern on the front that glows. It seems like its presence causes it to become sunny.","egg_image":"","egg_description":""},
        {"name":"Groudon (Fake)","egg_flavour":"A dark red egg with an eerie glowing pattern on the front. It looks like it's melting....","egg_image":"","egg_description":""},
        {"name":"Growlithe","egg_flavour":"An egg that is coloured white, orange, and tan. It radiates heat.","egg_image":"","egg_description":""},
        {"name":"Gulpin","egg_flavour":"A pale green egg with two dark diamond-shaped spots and a yellow top. It shakes around if you bring food near it.","egg_image":"","egg_description":""},
        {"name":"Happiny","egg_flavour":"A pink egg with two dark spots on it. It also has an odd marking near the top. It is oddly cute in a way.","egg_image":"","egg_description":""},
        {"name":"Heatran","egg_flavour":"A grey egg that is shiny like steel. It has bizarre markings and two dark red spots. It's often hard to approach due to radiating an incredible amount of heat.","egg_image":"","egg_description":""},
        {"name":"Heatmor","egg_flavour":"A red egg with several yellow stripes on it. There is an odd brown protrusion towards the bottom of the egg.","egg_image":"","egg_description":""},
        {"name":"Heracross","egg_flavour":"A blue egg with odd markings on the bottom half. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Hippopotas","egg_flavour":"A tan egg with two darker spots on it. It's covered in sand.","egg_image":"","egg_description":""},
        {"name":"Ho-oh","egg_flavour":"An orange egg with two bizarre grey patches and an odd yellow beak-like pattern on the front. It sometimes seems like its presence causes a rainbow to appear in the sky.","egg_image":"","egg_description":""},
        {"name":"Hoothoot","egg_flavour":"A brown egg with an odd black marking on the front. Its presence is a bit hypnotic.","egg_image":"","egg_description":""},
        {"name":"Hoppip","egg_flavour":"A red egg with a green top, two yellow spots, and a black mark. It is surprisingly light.","egg_image":"","egg_description":""},
        {"name":"Horsea","egg_flavour":"A light blue egg with an odd tan marking on the front. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Horsea (Icy)","egg_flavour":"An ice-covered egg with a strange blue mark on the front. It is extremely cold.","egg_image":"","egg_description":""},
        {"name":"Houndour","egg_flavour":"A black egg with a brown blotch on it. It radiates heat.","egg_image":"","egg_description":""},
        {"name":"Igglybuff","egg_flavour":"A pink egg. The marking on top of it looks like a little swirl. It bounces around a bit sometimes.","egg_image":"","egg_description":""},
        {"name":"Illumise","egg_flavour":"A pale blue egg with a purple band across the back. It's supposed to be part of a pair.","egg_image":"","egg_description":""},
        {"name":"Jirachi","egg_flavour":"A white egg with a yellow top and a blue marking. It has a brilliant sheen.","egg_image":"","egg_description":""},
        {"name":"Joltik","egg_flavour":"A very tiny yellow and blue egg. It might shock you if you touch it.","egg_image":"","egg_description":""},
        {"name":"Karrablast","egg_flavour":"A bold blue egg with a pattern on it consisting of black, cyan, and yellow. It hops around if you touch it.","egg_image":"","egg_description":""},
        {"name":"Kabuto","egg_flavour":"A brown egg with two dark marks on it. It is surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Kabuto (Fossil)","egg_flavour":"A brown egg with two dark marks on it. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Kangaskhan","egg_flavour":"An egg that is a dull dark green on the top and brown on the bottom. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Kecleon","egg_flavour":"A green egg with a red zig-zag shaped band going across it. It looks like it disappears at times, if only for a second.","egg_image":"","egg_description":""},
        {"name":"Keldeo","egg_flavour":"An egg with an intricate pattern composed of off-white, red, and blue. It has a dark blue around it and looks very delicate.","egg_image":"","egg_description":""},
        {"name":"Klink","egg_flavour":"A grey egg with a dark marking on the front and two green spots. It spins around sometimes.","egg_image":"","egg_description":""},
        {"name":"Koffing","egg_flavour":"A purple egg with a tan marking near the bottom. The marking resembles a skull. The egg has a horrible stench....","egg_image":"","egg_description":""},
        {"name":"Krabby","egg_flavour":"A red-orange egg with an odd tan pattern on the bottom. It's surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Kricketot","egg_flavour":"A dull brown egg that is pale red and pale yellow on the bottom half. Said to be the egg of some sort of bug.","egg_image":"","egg_description":""},
        {"name":"Kyogre","egg_flavour":"A blue egg with a bizarre red pattern on the front that glows. It seems like its presence causes it to rain lightly.","egg_image":"","egg_description":""},
        {"name":"Kyurem","egg_flavour":"An icy blue egg of immense size. The odd pattern running along the egg makes it look like it's already cracking.","egg_image":"","egg_description":""},
        {"name":"Landorus","egg_flavour":"A bold orange egg covered in red splotches. The space around it is in pristine condition.","egg_image":"","egg_description":""},
        {"name":"Lapras","egg_flavour":"A blue egg with a tan blotch on the bottom. The blue part has a few small spots. It's a bit difficult to lift up.","egg_image":"","egg_description":""},
        {"name":"Larvitar","egg_flavour":"A pale green egg with a red blotch on the front and two small dark spots. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Larvesta","egg_flavour":"A bold orange egg with several black spots all over it. It radiates an incredible amount of heat.","egg_image":"","egg_description":""},
        {"name":"Latias","egg_flavour":"A white egg with a bizarre pink marking on it. It radiates a mysterious power. It's supposed to be part of a pair.","egg_image":"","egg_description":""},
        {"name":"Latios","egg_flavour":"A grey egg with a bizarre blue marking on it. It radiates a mysterious power. It's supposed to be part of a pair.","egg_image":"","egg_description":""},
        {"name":"Ledyba","egg_flavour":"A red-orange egg that has several black spots all over it. Said to be the egg of some sort of bug.","egg_image":"","egg_description":""},
        {"name":"Lickitung","egg_flavour":"A pink egg with a big tan band on the front. It's covered in what appears to be saliva....","egg_image":"","egg_description":""},
        {"name":"Lileep","egg_flavour":"A purple egg with two odd yellow markings on it. It looks kind of creepy....","egg_image":"","egg_description":""},
        {"name":"Lileep (Fossil)","egg_flavour":"A purple egg with two odd yellow markings on it. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Lillipup","egg_flavour":"A brown egg with a big black marking on the front. It hops around if you touch it.","egg_image":"","egg_description":""},
        {"name":"Litwick","egg_flavour":"A white egg that looks like it's melting. It's hot to the touch.","egg_image":"","egg_description":""},
        {"name":"Lotad","egg_flavour":"A blue egg with a green top and a yellow band on the front. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Lugia","egg_flavour":"A white egg with two bizarre light purple patches. It radiates a mysterious power. It sometimes seems like its presence causes the clouds in the sky to turn dark grey.","egg_image":"","egg_description":""},
        {"name":"Lugia (Shadow)","egg_flavour":"A dark purple egg with two bizarre light grey patches. It radiates a dark and mysterious power. Being around this egg makes you feel slightly uneasy.","egg_image":"","egg_description":""},
        {"name":"Lunatone","egg_flavour":"A black egg with a tan crescent moon shape on the front.","egg_image":"","egg_description":""},
        {"name":"Luvdisc- A flesh-coloured egg. It has three white spots that look similar to a little face. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Machop","egg_flavour":"A dull teal egg. It has an odd tan pattern on the top of it. It's a bit on the tough side.","egg_image":"","egg_description":""},
        {"name":"Magby","egg_flavour":"A pale red egg with a yellow spot on the front. It radiates heat.","egg_image":"","egg_description":""},
        {"name":"Magikarp","egg_flavour":"An orange egg with two white spots and a peach-coloured blotch. It resembles a face. This egg looks like it'd take no time to hatch.","egg_image":"","egg_description":""},
        {"name":"Magnemite","egg_flavour":"An egg that is shiny like steel and has two white spots. Iron is attracted to it.","egg_image":"","egg_description":""},
        {"name":"Makuhita","egg_flavour":"A yellow egg with two red circle markings on the sides. It's a bit difficult to lift up.","egg_image":"","egg_description":""},
        {"name":"Makuhita (Festive)","egg_flavour":"A green and red egg, surrounded by a leather belt. There appears to be a candy cane on its side...","egg_image":"","egg_description":""},
        {"name":"Manaphy","egg_flavour":"A transparent blue egg with many yellow spots and a red centre. It is frequently illustrated in books and said to be from the bottom of the sea.","egg_image":"","egg_description":""},
        {"name":"Mankey","egg_flavour":"An egg that almost looks white. It has a red spot and actually looks a bit angry....","egg_image":"","egg_description":""},
        {"name":"Mantyke","egg_flavour":"A blue egg with two red spots and a light line. The spots and line form a smiley face. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Maractus","egg_flavour":"A green egg with pointy yellow spikes towards the top. It's supposed to be the egg of a plant.","egg_image":"","egg_description":""},
        {"name":"Mareep","egg_flavour":"A blue egg with a yellow top and a grey spot on the back. Touching it sometimes shocks you.","egg_image":"","egg_description":""},
        {"name":"Mawile","egg_flavour":"A grey egg with a yellow spot on the front. On the bottom, there is a band that looks like teeth. It shines like steel.","egg_image":"","egg_description":""},
        {"name":"Meditite","egg_flavour":"An egg that is grey, blue, and dark grey from top to bottom. It shakes a bit if it's touched.","egg_image":"","egg_description":""},
        {"name":"Meowth","egg_flavour":"A light yellow egg. The bolder yellow spot on top of it is shiny like a coin.","egg_image":"","egg_description":""},
        {"name":"Meloetta","egg_flavour":"A light green egg with a bizarre black protrusion on the front and a single dark spot. Being around it fills your head with music.","egg_image":"","egg_description":""},
        {"name":"Mespirit","egg_flavour":"A pink egg with a small red spot and a light pale blue patch on the bottom. Said to be part of a trio.","egg_image":"","egg_description":""},
        {"name":"Mew","egg_flavour":"A plain bright pink egg. It doesn't seem like the most unique thing ever....","egg_image":"","egg_description":""},
        {"name":"Mewtwo","egg_flavour":"A grey egg with bizarre markings on the top and a purple blotch on the bottom. A mysterious power radiates from it.","egg_image":"","egg_description":""},
        {"name":"Mienfoo","egg_flavour":"A pale yellow egg with two black spots and a red band around it. It makes a weird noise when you touch it.","egg_image":"","egg_description":""},
        {"name":"Miltank","egg_flavour":"A black egg with a small pink blotch on the top and a larger one near the bottom. It's a bit difficult to lift up.","egg_image":"","egg_description":""},
        {"name":"Mime Jr.","egg_flavour":"A pink egg with a big blue blotch on the top and a small red spot on the front. It sometimes hops around, mimicking your movement.","egg_image":"","egg_description":""},
        {"name":"Minccino","egg_flavour":"A light brown egg with several white blotches on it. Its surface is completely clean.","egg_image":"","egg_description":""},
        {"name":"Minun","egg_flavour":"A pale yellow egg with two pale blue spots. It's supposed to be part of a pair.","egg_image":"","egg_description":""},
        {"name":"Misdreavus","egg_flavour":"A dark blueish-purple egg with a purple top and several purple spots. It's surprisingly light.","egg_image":"","egg_description":""},
        {"name":"Misdreavus (Past)","egg_flavour":"A bright white egg with a beautiful blue and gold pattern wrapping around it.","egg_image":"","egg_description":""},
        {"name":"Missingno.","egg_flavour":"This egg's pattern looks rather busy. It consists of black, white, purple and light orange.","egg_image":"","egg_description":""},
        {"name":"Moltres","egg_flavour":"A yellow-orange egg with a tan spot on the front and several orange flame-like markings. It's difficult to hold for extended periods of time due to being so hot.","egg_image":"","egg_description":""},
        {"name":"Mudkip","egg_flavour":"An egg that is half blue and half grey with two orange spots. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Munchlax","egg_flavour":"A dark teal egg with a single tan spot on the front. It shakes around a bit if you bring food near it.","egg_image":"","egg_description":""},
        {"name":"Munna","egg_flavour":"A pink egg with a purple floral pattern on it. Being around it makes you feel sleepy.","egg_image":"","egg_description":""},
        {"name":"Murkrow","egg_flavour":"A dark blue egg with a yellow beak-like mark on the front. It's supposed to be the egg of some sort of bird.","egg_image":"","egg_description":""},
        {"name":"Natu","egg_flavour":"A green egg with a red top, yellow spots, and black marks. It radiates a mysterious power.","egg_image":"","egg_description":""},
        {"name":"Nidoran (F)","egg_flavour":"A blueish-purple egg. It's supposed to be part of a pair.","egg_image":"","egg_description":""},
        {"name":"Nidoran (M)","egg_flavour":"A pinkish-purple egg. It's supposed to be part of a pair.","egg_image":"","egg_description":""},
        {"name":"Nincada","egg_flavour":"A plain white egg with a thin wavy line going across it. Supposed to be the egg of some sort of bug.","egg_image":"","egg_description":""},
        {"name":"Nosepass","egg_flavour":"A grey egg with two dark spots and a big red blotch. The blotch resembles a nose in shape.","egg_image":"","egg_description":""},
        {"name":"Numel","egg_flavour":"An egg with a green top, yellow middle, and tan bottom. It radiates heat.","egg_image":"","egg_description":""},
        {"name":"Oddish","egg_flavour":"An egg that's a dull dark blue colour. The two red spots on it almost look like eyes. It's supposed to be the egg of a plant.","egg_image":"","egg_description":""},
        {"name":"Omanyte","egg_flavour":"A tan egg with a stripe pattern on it. It is surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Omanyte (Fossil)","egg_flavour":"A tan egg with a stripe pattern on it. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Onix","egg_flavour":"A grey egg that could easily be mistaken for a rock. It's almost impossible to lift.","egg_image":"","egg_description":""},
        {"name":"Onix (Crystal)","egg_flavour":"A light blue egg that shines beautifully like crystal. It's almost impossible to lift.","egg_image":"","egg_description":""},
        {"name":"Oshawott","egg_flavour":"A blue egg that, oddly enough, appears to have a seashell on it.","egg_image":"","egg_description":""},
        {"name":"Pachirisu","egg_flavour":"A white egg with a blue blotch on the top and two yellow spots near the bottom. Touching it may shock you.","egg_image":"","egg_description":""},
        {"name":"Palkia","egg_flavour":"A white and purple egg with a bizarre pattern. There is a red spot in the middle that shines like a gem. It feels like the space around it is being affected by its presence.","egg_image":"","egg_description":""},
        {"name":"Panpour","egg_flavour":"A tan egg with a blue print on the front. Said to be part of a trio.","egg_image":"","egg_description":""},
        {"name":"Pansage","egg_flavour":"A tan egg with a green print on the front. Said to be part of a trio.","egg_image":"","egg_description":""},
        {"name":"Pansear","egg_flavour":"A tan egg with an orange print on the front. Said to be part of a trio.","egg_image":"","egg_description":""},
        {"name":"Paras","egg_flavour":"An orange egg. The two white spots on it almost look like eyes. Said to be the egg of a bug.","egg_image":"","egg_description":""},
        {"name":"Patrat","egg_flavour":"A brown egg with strange black tan markings. It hops around a bit if you touch it.","egg_image":"","egg_description":""},
        {"name":"Pawniard","egg_flavour":"An egg that is red on the top and dark grey on the bottom. It might hop closer to you if you touch it.","egg_image":"","egg_description":""},
        {"name":"Petilil","egg_flavour":"A white egg with a pretty light green pattern wrapping around it. It hops around sometimes.","egg_image":"","egg_description":""},
        {"name":"Phanpy","egg_flavour":"A light blue egg with odd pink blotches on it. It's surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Phione","egg_flavour":"A light blue egg with two small darker spots on it. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Pichu","egg_flavour":"A yellow and black egg with two small pink spots. Touching it sometimes shocks you.","egg_image":"","egg_description":""},
        {"name":"Pichu (Spiky-eared)","egg_flavour":"A yellow and black egg with an interesting pattern. Touching it might shock you.","egg_image":"","egg_description":""},
        {"name":"Pidgey","egg_flavour":"A brown and tan egg that has a very interesting pattern on it. Said to be the egg of a common bird.","egg_image":"","egg_description":""},
        {"name":"Pidgey (Pudgy)","egg_flavour":"A brown and tan egg that has a very interesting pattern on it. Said to be the egg of a common bird. It feels rather heavy.","egg_image":"","egg_description":""},
        {"name":"Pidove","egg_flavour":"A grey egg with a lighter blotch on the front. It hops around if you touch it.","egg_image":"","egg_description":""},
        {"name":"Pineco","egg_flavour":"A light blue egg with several small dark marks all over it. It's surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Pineco (Pokii)","egg_flavour":"A black egg covered in spiky fur. Sometimes shakes a bit if it's touched. Something about the egg seems foreign.","egg_image":"","egg_description":""},
        {"name":"Pinsir","egg_flavour":"A brown egg with an odd stripe pattern on it. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Piplup","egg_flavour":"A blue egg with white and light blue blotches on the bottom. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Plusle","egg_flavour":"A pale yellow egg with two pale red spots. It's supposed to be part of a pair.","egg_image":"","egg_description":""},
        {"name":"Poliwag","egg_flavour":"A blueish-purple egg with a big white spot. There's a spiral pattern on the spot. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Ponyta","egg_flavour":"An egg that is off-white. It has an orange blotch on the top and brown spots like eyes. It radiates heat.","egg_image":"","egg_description":""},
        {"name":"Poochyena","egg_flavour":"A grey egg with a big black blotch on the front. The blotch has a small red spot on it. Sometimes shakes a bit if it's touched.","egg_image":"","egg_description":""},
        {"name":"Porygon","egg_flavour":"A pink egg with an odd blue spot on the front and several dark lines running across it. This egg doesn't look like something natural....","egg_image":"","egg_description":""},
        {"name":"Psyduck","egg_flavour":"A yellow egg. It has an oddly-shaped tan blotch on it that resembles a duck's bill. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Purrloin","egg_flavour":"A dark purple egg covered in strange yellow spots. It keeps making weird noises.","egg_image":"","egg_description":""},
        {"name":"Qwilfish","egg_flavour":"An egg that is blue on the top and tan on the bottom. It is covered with pointy spikes.","egg_image":"","egg_description":""},
        {"name":"Raikou","egg_flavour":"An egg with a purple top, grey and white middle, and yellow bottom. Touching it is incredibly dangerous, as it may end up giving you a powerful shock.","egg_image":"","egg_description":""},
        {"name":"Ralts","egg_flavour":"An egg that is green on the top and white on the bottom. It also has an odd red blotch on the green top. It feels like it's trying to sense your emotions.","egg_image":"","egg_description":""},
        {"name":"Rattata","egg_flavour":"An egg that is coloured purple, tan, and brown. Sometimes shakes a bit if it's touched.","egg_image":"","egg_description":""},
        {"name":"Rayquaza","egg_flavour":"A green egg with a bizarre yellow pattern on the front that glows. It seems like its presence makes the weather calm.","egg_image":"","egg_description":""},
        {"name":"Regice","egg_flavour":"A light pale blue egg with a bizarre yellow dot pattern on the front. It is incredibly cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Regigigas","egg_flavour":"A yellow egg with a green spot on the side and a bizarre black dot pattern on the front. It is incredibly heavy.","egg_image":"","egg_description":""},
        {"name":"Regirock","egg_flavour":"A tan egg with a bizarre orange dot pattern on the front. It is incredibly tough and has the texture of a rock.","egg_image":"","egg_description":""},
        {"name":"Registeel","egg_flavour":"A dark grey egg with a bizarre pale red dot pattern on the front. It shines brightly like steel.","egg_image":"","egg_description":""},
        {"name":"Relicanth","egg_flavour":"An egg that is almost white. It has markings on it that resemble cracks, but it is rather tough. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Relicanth (Fossil)","egg_flavour":"An egg that is almost white. It has markings on it that resemble cracks, but it is rather tough. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Remoraid","egg_flavour":"A light blue egg that has a line marking and two dark blue stripes. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Remoraid (Remorage)","egg_flavour":"A light blue egg that looks incredibly angry somehow....","egg_image":"","egg_description":""},
        {"name":"Reshiram","egg_flavour":"An intensely white egg of immense size. It has a wispy pattern on it and a shining ring. It radiates an incredible amount of heat.","egg_image":"","egg_description":""},
        {"name":"Rhyhorn","egg_flavour":"A grey egg that is incredibly tough. It could easily be mistaken for a rock.","egg_image":"","egg_description":""},
        {"name":"Riolu","egg_flavour":"A bold blue egg with a dark grey pattern on it. A faint aura appears around it sometimes.","egg_image":"","egg_description":""},
        {"name":"Roggenrola","egg_flavour":"A dark blue egg with a yellow mark on the front. It's as hard as a rock.","egg_image":"","egg_description":""},
        {"name":"Roggenrola (Roggenmorpha)","egg_flavour":"A white egg with a red mark on the front. It's as hard as a rock.","egg_image":"","egg_description":""},
        {"name":"Rotom","egg_flavour":"A light blue egg with a big orange blotch on the front. Touching it may shock you.","egg_image":"","egg_description":""},
        {"name":"Rufflet","egg_flavour":"A red egg with a dazzling white and blue pattern running across it. It might hop closer to you if you touch it.","egg_image":"","egg_description":""},
        {"name":"Sableye","egg_flavour":"A purple egg with a light blue spot on the front of it. The spot shines like a pretty gem.","egg_image":"","egg_description":""},
        {"name":"Sandile","egg_flavour":"A brown egg with a strange black marking on the front. It's completely covered in sand.","egg_image":"","egg_description":""},
        {"name":"Sandshrew","egg_flavour":"A yellow and white egg. The yellow part has a brick-like pattern on it. It's covered in sand.","egg_image":"","egg_description":""},
        {"name":"Sawk","egg_flavour":"A blue egg with an odd black marking on the front. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Scraggy","egg_flavour":"A pale egg with a strange yellow film on top of it. It's harder than a rock.","egg_image":"","egg_description":""},
        {"name":"Scyther","egg_flavour":"A green egg with odd markings on it. The markings resemble a face. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Seedot","egg_flavour":"A light brown egg with a grey top. It has a tan blotch on the front. It's supposed to be the egg of a plant.","egg_image":"","egg_description":""},
        {"name":"Seel","egg_flavour":"A white egg with a tan blotch on it. It's cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Sentret","egg_flavour":"A tan egg with a big light circle marking on the front. Sometimes shakes a bit when it's touched.","egg_image":"","egg_description":""},
        {"name":"Seviper","egg_flavour":"A dark grey egg with a purple S-shape on it. It supposedly has a rival.","egg_image":"","egg_description":""},
        {"name":"Sewaddle","egg_flavour":"A green egg that looks more like a curled up leaf than an actual egg.","egg_image":"","egg_description":""},
        {"name":"Shaymin","egg_flavour":"A green egg with a cute little pink flower pattern on the side. Any flowers near it bloom beautifully.","egg_image":"","egg_description":""},
        {"name":"Shellder","egg_flavour":"A purple egg with a peculiar pattern. It's surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Shellder (Shellderboy)","egg_flavour":"A purple egg with a giant fist on the front. It's surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Shellos (East)","egg_flavour":"An egg with a blue top and green bottom that is divided by a yellow band. It's completely covered in slime....","egg_image":"","egg_description":""},
        {"name":"Shellos (West)","egg_flavour":"An egg with a pink top and white bottom that is divided by a yellow band. It's completely covered in slime....","egg_image":"","egg_description":""},
        {"name":"Shelmet","egg_flavour":"A pink egg with two green stripes and a black marking on the front. It hops around if you touch it.","egg_image":"","egg_description":""},
        {"name":"Shieldon","egg_flavour":"A black egg with odd silver markings on it. It is incredibly tough.","egg_image":"","egg_description":""},
        {"name":"Shieldon (Fossil)","egg_flavour":"A black egg with odd silver markings on it. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Sigilyph","egg_flavour":"A green egg with a black marking around the middle that has two blue spots. It's like it's really staring at you.","egg_image":"","egg_description":""},
        {"name":"Shinx","egg_flavour":"A dull dark blue egg with a yellow x-like shape on the front. Touching it may shock you.","egg_image":"","egg_description":""},
        {"name":"Shroomish","egg_flavour":"A brown egg with several green spots all over it. The egg is covered with dust.","egg_image":"","egg_description":""},
        {"name":"Shuckle","egg_flavour":"A red egg with several peach-coloured spots. It is unbelievably tough.","egg_image":"","egg_description":""},
        {"name":"Shuppet","egg_flavour":"A plain dull purple egg. Other than being rather light, nothing else seems very unique about it.","egg_image":"","egg_description":""},
        {"name":"Shuppet (Future)","egg_flavour":"A pitch black egg with a silly white pattern wrapping around it.","egg_image":"","egg_description":""},
        {"name":"Skarmory","egg_flavour":"A pale blue egg that is shiny like steel. It is incredibly tough.","egg_image":"","egg_description":""},
        {"name":"Skitty","egg_flavour":"A pink egg with a tan blotch on the front and bottom. It seems oddly cute in a way.","egg_image":"","egg_description":""},
        {"name":"Skorupi","egg_flavour":"A dark purple egg with two turquoise spots near the top. It might hop around a bit when touched.","egg_image":"","egg_description":""},
        {"name":"Slakoth","egg_flavour":"A brown egg with two dark spots and a small red spot. It doesn't react to anything at all.","egg_image":"","egg_description":""},
        {"name":"Slowpoke","egg_flavour":"A pink egg with a big tan spot on it. It doesn't react to anything at all.","egg_image":"","egg_description":""},
        {"name":"Slugma","egg_flavour":"A bright orange egg with two yellow spots. It's hot to the touch.","egg_image":"","egg_description":""},
        {"name":"Slugma (Slime)","egg_flavour":"A black egg with several dark green spots on it. It emits a horrible smell....","egg_image":"","egg_description":""},
        {"name":"Smeargle","egg_flavour":"A dull tan egg with an odd green blotch on the top. The green top feels a bit slimy....","egg_image":"","egg_description":""},
        {"name":"Smoochum","egg_flavour":"A pink egg with a yellow blotch on the top and a light pink spot on the front. It is cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Sneasel","egg_flavour":"A blue egg with two dark blotches and one small yellow spot. It has fierce look to it and is cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Snivy","egg_flavour":"A bold green egg that is decorated with fanciful yellow swirls.","egg_image":"","egg_description":""},
        {"name":"Snorunt","egg_flavour":"A yellow egg with a black blotch on the front that is outlined with red. It is cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Snover","egg_flavour":"An egg that is grey on the top and brown on the bottom. It is cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Snubbull","egg_flavour":"A pink egg with one light blue wavy stripe on it. It seems oddly cute in a way.","egg_image":"","egg_description":""},
        {"name":"Solosis","egg_flavour":"A translucent pale green egg. You can see what's forming inside of it.","egg_image":"","egg_description":""},
        {"name":"Solrock","egg_flavour":"A light orange egg with an orange sun shape on the front.","egg_image":"","egg_description":""},
        {"name":"Spearow","egg_flavour":"A brown egg with a peculiar pink beak-like marking on it. Said to be the egg of a common bird.","egg_image":"","egg_description":""},
        {"name":"Spheal","egg_flavour":"A blue egg with a tan blotch on the front and several white spots. It rolls around sometimes.","egg_image":"","egg_description":""},
        {"name":"Spinarak","egg_flavour":"A bright green egg with three dark markings on it. The markings resemble a face. Said to be the egg of some sort of bug.","egg_image":"","egg_description":""},
        {"name":"Spinda","egg_flavour":"A tan egg with a red bottom. It has a faint spiral pattern on the front. It falls over a lot as if it were dizzy.","egg_image":"","egg_description":""},
        {"name":"Spiritomb","egg_flavour":"A purple egg with several small green spots all over it. It glows eerily....","egg_image":"","egg_description":""},
        {"name":"Spoink","egg_flavour":"A grey egg with a pink top and two pink spots. It bounces around sometimes.","egg_image":"","egg_description":""},
        {"name":"Squirtle","egg_flavour":"A blue egg that is surprisingly tough. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Squirtle (Clone)","egg_flavour":"A light blue egg with several dark markings all over it. Something seems off about it....","egg_image":"","egg_description":""},
        {"name":"Stantler","egg_flavour":"A light brown egg with several tan blotches on it. Its presence is hypnotic.","egg_image":"","egg_description":""},
        {"name":"Starly","egg_flavour":"A dark grey egg with a huge white blotch on the front and across the bottom. It's said to be the egg of a common bird.","egg_image":"","egg_description":""},
        {"name":"Staryu","egg_flavour":"A tan and yellow egg with a red spot on it. The spot shines like a gem.","egg_image":"","egg_description":""},
        {"name":"Stunfisk","egg_flavour":"A brown egg with a yellow pattern on the front and bottom. Touching it may shock you.","egg_image":"","egg_description":""},
        {"name":"Stunky","egg_flavour":"From the foul smell that comes from this purple and tan egg, you'd think it was rotten....","egg_image":"","egg_description":""},
        {"name":"Suicune","egg_flavour":"A purple egg with a bizarrely shaped blue blotch on the front. This blue blotch shines like a beautiful crystal. The egg emits a mysterious power.","egg_image":"","egg_description":""},
        {"name":"Sunkern","egg_flavour":"A yellow egg with three vertical stripes coming from the bottom. This egg seems to be covered in what appears to be dew.","egg_image":"","egg_description":""},
        {"name":"Surskit","egg_flavour":"A blue egg that has a strange yellow blotch on the top. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Swablu","egg_flavour":"A blue egg with two white blotches on the sides. It is surprisingly light.","egg_image":"","egg_description":""},
        {"name":"Swinub","egg_flavour":"A brown egg with several dark stripes. It's cold to the touch.","egg_image":"","egg_description":""},
        {"name":"Swinub (Summer)","egg_flavour":"A gray, scaly egg. It is extremely dry-feeling.","egg_image":"","egg_description":""},
        {"name":"Taillow","egg_flavour":"A blue egg with a red blotch on it. The blotch also has a yellow spot on it. It's supposed to be the egg of a common bird.","egg_image":"","egg_description":""},
        {"name":"Tangela","egg_flavour":"A blue egg with an odd marking on the front. It feels like seaweed.","egg_image":"","egg_description":""},
        {"name":"Tauros","egg_flavour":"A brown egg with several grey spots on it. The spots form a pattern. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Teddiursa","egg_flavour":"A brown egg with a tan spot on the front. There is a band on the top that resembles a crescent.","egg_image":"","egg_description":""},
        {"name":"Tentacool","egg_flavour":"A bold blue egg with three red spots. The red spots are shiny like gems. The egg is slightly damp.","egg_image":"","egg_description":""},
        {"name":"Tentacool (Valentacool)","egg_flavour":"A hot pink egg that is covered in lots of hearts and spots.","egg_image":"","egg_description":""},
        {"name":"Tepig","egg_flavour":"A rather warm egg whose colours consist of yellow, black, and orange.","egg_image":"","egg_description":""},
        {"name":"Terrakion","egg_flavour":"A grey egg with a tan pattern on the bottom. It is really heavy, and has a strange yellow protrusion coming out towards the bottom.","egg_image":"","egg_description":""},
        {"name":"Throh","egg_flavour":"A red egg with an odd black marking on the front. It's a bit on the heavy side.","egg_image":"","egg_description":""},
        {"name":"Thundurus","egg_flavour":"A bright blue egg covered in purple splotches. Thundering sounds can be heard near it.","egg_image":"","egg_description":""},
        {"name":"Timburr","egg_flavour":"A brown egg that looks like it has a pink vein on its side. It's surprisingly tough.","egg_image":"","egg_description":""},
        {"name":"Tirtouga","egg_flavour":"A dark grey egg with a very rough surface. It's as hard as a rock.","egg_image":"","egg_description":""},
        {"name":"Tirtouga (Fossil)","egg_flavour":"A dark brown egg with a very rough surface. It's as hard as a rock. It looks extremely old.","egg_image":"","egg_description":""},
        {"name":"Togepi","egg_flavour":"A white egg with several small red and blue marks on it. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Torchic","egg_flavour":"An orange egg with a yellow top and a couple yellow spots. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Torkoal","egg_flavour":"A black egg covered in odd markings with a red top and two red spots. It radiates heat.","egg_image":"","egg_description":""},
        {"name":"Tornadus","egg_flavour":"A dark green egg covered in purple splotches. It's surrounded by a mysterious air.","egg_image":"","egg_description":""},
        {"name":"Totodile","egg_flavour":"A blue egg with a big tan mark on it and a couple dark blue spots. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Trapinch","egg_flavour":"An orange egg with a white band going across it. It's covered in sand.","egg_image":"","egg_description":""},
        {"name":"Treecko","egg_flavour":"A green egg with a red blotch near the bottom. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Tropius","egg_flavour":"An egg that is green on the top and brown on the bottom. There is a yellow blotch on the front that resembles a fruit.","egg_image":"","egg_description":""},
        {"name":"Tropius (Autumn)","egg_flavour":"An egg that is orange on the top and brown on the bottom. There are shapes on the front that resemble fruit.","egg_image":"","egg_description":""},
        {"name":"Trubbish","egg_flavour":"A dark green egg with a peculiar pattern on it. For some reason, it's sitting in a pile of trash.","egg_image":"","egg_description":""},
        {"name":"Turtwig","egg_flavour":"This egg is brown, pale green, and yellow from top to bottom. Something seems vaguely familiar about it....","egg_image":"","egg_description":""},
        {"name":"Tympole","egg_flavour":"A bold blue egg that has a line of bumps on it. It's always making weird noises.","egg_image":"","egg_description":""},
        {"name":"Tynamo","egg_flavour":"A dark teal egg with small yellow spots on it. It keeps making weird noises.","egg_image":"","egg_description":""},
        {"name":"Tyrogue","egg_flavour":"A pink egg with an odd pattern on it. This pattern resembles a face.","egg_image":"","egg_description":""},
        {"name":"Unown","egg_flavour":"A grey egg with a big white spot on the front. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Uxie","egg_flavour":"A tan egg with a small red spot and a light pale blue swirl on the bottom. Said to be part of a trio.","egg_image":"","egg_description":""},
        {"name":"Vanillite","egg_flavour":"A shiny blue egg with the strangest white pattern on the front of it. It's like it's really staring at you.","egg_image":"","egg_description":""},
        {"name":"Venipede","egg_flavour":"A red egg with a strange green pattern wrapping around it. Said to be the egg of a bug.","egg_image":"","egg_description":""},
        {"name":"Venonat","egg_flavour":"A dark purple egg. It has precisely three red spots on it. Said to be the egg of a bug.","egg_image":"","egg_description":""},
        {"name":"Victini","egg_flavour":"A tan and bold orange egg with a unique pattern on it. It radiates a ton of heat.","egg_image":"","egg_description":""},
        {"name":"Virizion","egg_flavour":"A green egg with a lighter pattern on the bottom. It has a sleek feel, and has two strange pink protrusions coming out towards the top.","egg_image":"","egg_description":""},
        {"name":"Volbeat","egg_flavour":"A A grey egg with a red band across the back. It's supposed to be part of a pair. .","egg_image":"","egg_description":""},
        {"name":"Voltorb","egg_flavour":"An egg that is half red and half white. Touching it sometimes shocks you.","egg_image":"","egg_description":""},
        {"name":"Vullaby","egg_flavour":"It's a plain tan egg. Not terribly exciting.","egg_image":"","egg_description":""},
        {"name":"Vulpix","egg_flavour":"An egg that has a dark flesh-like colour. The top of it has an odd dark orange pattern. It radiates heat.","egg_image":"","egg_description":""},
        {"name":"Vulpix (Winter)","egg_flavour":"This light blue egg has a strange swirling pattern and shines brilliantly.","egg_image":"","egg_description":""},
        {"name":"Wailmer","egg_flavour":"An egg that is blue on top and tan on the bottom. It has a strange white marking on the front. It looks like it'd take a while to hatch.","egg_image":"","egg_description":""},
        {"name":"Weedle","egg_flavour":"A tan egg with a red spot. Said to be the egg of some sort of bug.","egg_image":"","egg_description":""},
        {"name":"Whismur","egg_flavour":"A pink egg with several markings on the front and two yellow blotches on the sides. It makes a weird noise when touched sometimes.","egg_image":"","egg_description":""},
        {"name":"Wingull","egg_flavour":"A white egg with two blue stripes. There is a yellow and black spot on the front. It's supposed to be the egg of a common bird.","egg_image":"","egg_description":""},
        {"name":"Woobat","egg_flavour":"A light blue egg with a strange pink ball on the top. The ball has a heart shape on it.","egg_image":"","egg_description":""},
        {"name":"Wooper","egg_flavour":"A blue egg with a purple spot and three wavy blue lines on the front. It's covered in slime....","egg_image":"","egg_description":""},
        {"name":"Wurmple","egg_flavour":"A pale red egg with a tan blotch on the bottom and a yellow spot near the top. It's said to be the egg of some sort of bug.","egg_image":"","egg_description":""},
        {"name":"Wynaut","egg_flavour":"A blue egg with a thin dark zig-zag line on the front. It might hop up to you if you get close to it.","egg_image":"","egg_description":""},
        {"name":"Yamask","egg_flavour":"A shiny gold and blue egg with an elaborate pattern on it. It gives off an unsettling vibe....","egg_image":"","egg_description":""},
        {"name":"Yanma","egg_flavour":"A bright green egg with red on the top and bottom. It's supposed to be the egg of a bug.","egg_image":"","egg_description":""},
        {"name":"Zangoose","egg_flavour":"A white egg with a red M-shape on it. It supposedly has a rival.","egg_image":"","egg_description":""},
        {"name":"Zangoose (Zergoose)","egg_flavour":"A dark gray egg with a blue Z-shaped mark on it. Nobody has any clue what might hatch from it....","egg_image":"","egg_description":""},
        {"name":"Zangoose (Feral Zergoose)","egg_flavour":"A dark grayish-blue egg with a blue Z-shaped mark on it. The mark feels like it was carved by a sharp claw.","egg_image":"","egg_description":""},
        {"name":"Zapdos","egg_flavour":"A yellow egg with a bizarre black pattern on it. It's often dangerous to touch it, because doing so might result in a really bad shock.","egg_image":"","egg_description":""},
        {"name":"Zekrom","egg_flavour":"A grey and black egg of immense size. Many blue sparks of electricity are jumping around on its surface.","egg_image":"","egg_description":""},
        {"name":"Zigzagoon","egg_flavour":"A brown egg with a large tan zig-zag pattern on the middle. Sometimes shakes a bit if it's touched.","egg_image":"","egg_description":""},
        {"name":"Zorua","egg_flavour":"A black egg with a bizarre red marking on the front. Sometimes the marking will change its shape.","egg_image":"","egg_description":""},
        {"name":"Zorua (Flaming)","egg_flavour":"A bright orange egg with a strange dark mark in the middle. It feels rather warm.","egg_image":"","egg_description":""},
        {"name":"Zubat","egg_flavour":"A blue and purple egg. Sometimes makes a quiet screech-like noise if it's touched.","egg_image":"","egg_description":""}
    ];

    var gpxhelper = {
        running: false,
        feeding_timeout: false,
        berries: {
            'sour': 1,
            'spicy': 2,
            'dry': 3,
            'sweet': 4,
            'bitter': 5
        },
        control_box: false,
        last_url: false,

        doFeeding: function() {
            var self = this;
            if( window.location.href === this.last_url ) {
                self.feeding_timeout = window.setTimeout(function(){self.doFeeding()}, 100);
                return;
            }
            this.last_url = window.location.href;
            var timeout = Math.floor((Math.random() * 300) + 300);
            var buttons;
            self.feeding_timeout = window.setTimeout(function(){
                var timeout = Math.floor((Math.random() * 400) + 300);
                var infoInteract = $('#infoInteract');
                var infoPokemon = $('#infoPokemon');
                var pokemonName = $('figure figcaption > em', infoPokemon).text().substring(3);
                if( infoInteract.length ) {
                    var berry_type = $('em u', infoInteract);
                    if( Math.random() < 0.99 && berry_type.length ) {
                        berry_type =  berry_type.text();
                        var berry_type_len = berry_type.length;
                        berry_type = berry_type.substring(0, berry_type_len-6);
                        if( self.berries[berry_type] ) {
                            buttons = $('.buttonGroup button', infoInteract);
                            console.log('[' + currentDate() + '] Feeding '+ pokemonName +' with '+ berry_type +' berry');
                            buttons[self.berries[berry_type] -1].click();
                        }
                    } else {
                        buttons = $('.infoInteractButton', infoInteract);
                        if( buttons.length ) {
                            timeout = Math.floor((Math.random() * 350) + 450);
                            var button_to_click = Math.floor(Math.random() * buttons.length);
                            if( button_to_click > (buttons.length-1) ) {
                                button_to_click = (buttons.length-1);
                            }

                            if( button_to_click < 0 ) {
                                button_to_click = 0;
                            }
                            console.log('[' + currentDate() + '] Just feeding/warming '+ pokemonName);
                            buttons[button_to_click].click();
                        }
                    }
                }
                self.feeding_timeout = window.setTimeout(function(){self.doFeeding()}, timeout);
            }, timeout);
        },

        events: function() {
            var self = this;
            $('#start_feeding', this.control_box).on('click', function(event) {
                if( self.running !== true ) {
                    console.log('[' + currentDate() + '] Starting feeding');
                    self.running = true;
                    GM_setValue('gpx_helper_running', true);
                    self.doFeeding();
                }

                event.preventDefault();
                return false;
            });

            $('#stop_feeding', this.control_box).on('click', function(event) {
                if( self.running !== false ) {
                    console.log('[' + currentDate() + '] Stopping feeding');
                    self.running = false;
                    GM_setValue('gpx_helper_running', false);
                    clearTimeout(self.feeding_timeout);
                }

                event.preventDefault();
                return false;
            });

            $('#hatch_and_move_option', this.control_box).on('click', function(event) {
                var hatching_option = GM_getValue('hatching_option', false);
                hatching_option = !hatching_option;
                GM_setValue('hatching_option', hatching_option);

                if( hatching_option ) {
                    $(this).text('Hatch & Move to PC');
                } else {
                    $(this).text('Just Hatch');
                }

                event.preventDefault();
                return false;
            });

            $('#look_for_mystery_egg_shelter', this.control_box).on('click', function(event) {
                var look_for_mystery_egg_shelter_option = GM_getValue('look_for_mystery_egg_shelter_option', false);
                look_for_mystery_egg_shelter_option = !look_for_mystery_egg_shelter_option;
                GM_setValue('look_for_mystery_egg_shelter_option', look_for_mystery_egg_shelter_option);

                if( look_for_mystery_egg_shelter_option ) {
                    $(this).text('Search for mystery eggs');
                } else {
                    $(this).text('Do not search for mystery eggs');
                }

                event.preventDefault();
                return false;
            });
        },

        getPokedex: function() {
            var single_entry_id;
            var gpx_helper_dex = [];
            for(single_entry_id in dex.data) {
                if( dex.data[single_entry_id]['egg_flavour'] !== undefined ) {
                    gpx_helper_dex.push({
                        'egg_flavour': dex.data[single_entry_id]['egg_flavour'],
                        'name': dex.data[single_entry_id]['name']
                    });
                }
            }
            GM_setValue('gpx_helper_dex', JSON.stringify(gpx_helper_dex));
            console.log('[' + currentDate() + '] Saved Pokédex data');
        },

        identifyPartyPokemons: function() {
            var UserParty = $('#UserParty');
            var PartyPokemons = $('li.PartyPoke', UserParty);
            var single_pokemon, i, identified_name, description;
            for(i=0; i<PartyPokemons.length; i++) {
                single_pokemon = $(PartyPokemons[i]);
                if( single_pokemon.attr('data-egg-phase') > 0 ) {
                    description = $('section a', single_pokemon).attr('data-tooltip');
                    if( identified_name = this.findPokemon('egg_flavour', description) ) {
                        $('div strong em', single_pokemon).text(identified_name);
                    }
                }
            }
        },

        findPokemon: function(searchType, searchText) {
            var i;
            for(i=0; i<pokedex.length; i++) {
                if( pokedex[i][searchType] && searchText.indexOf(pokedex[i][searchType]) !== -1 ) {
                    console.log('[' + currentDate() + '] Identified '+pokedex[i]['name']);
                    return pokedex[i]['name'];
                }
            }

            var gpx_helper_dex = JSON.parse(GM_getValue('gpx_helper_dex', '{}'));
            for(i=0; i<gpx_helper_dex.length; i++) {
                if( gpx_helper_dex[i][searchType] && searchText.indexOf(gpx_helper_dex[i][searchType]) !== -1 ) {
                    console.log('[' + currentDate() + '] Identified '+gpx_helper_dex[i]['name']);
                    return gpx_helper_dex[i]['name'];
                }
            }
            return false;
        },

        hatchPartyEggs: function() {
            var UserParty = $('#UserParty');
            var PartyPokemons = $('li.PartyPoke', UserParty);
            var single_pokemon, i, identified_name, description;
            for(i=0; i<PartyPokemons.length; i++) {
                single_pokemon = $(PartyPokemons[i]);
                if( !single_pokemon.hasClass('remove') && single_pokemon.attr('data-egg-phase') == 6 && $('.expbar.bar100', single_pokemon).length > 0 ) {
                    var options = $('.button.toggleButton.pSelect.pSelectEm', single_pokemon);
                    options.click();
                    this.hatchEgg(UserParty);
                    break;
                }
            }
        },

        hatchEgg: function() {
            var options_box = $('.toggleButtonSelect.show');
            var hatching_option = GM_getValue('hatching_option', false);
            var self = this;
            var option_to_click, i;
            if( hatching_option ) {
                option_to_click = $('section > div', options_box)[0];
            } else {
                option_to_click = $('div > div', options_box);
                for(i=0; i<option_to_click.length; i++) {
                    if($(option_to_click[i]).text() == 'Hatch the egg') {
                        option_to_click = option_to_click[i];
                        break;
                    }
                }
            }

            if( option_to_click ) {
                var timeout = Math.floor((Math.random() * 1500) + 500);
                window.setTimeout(function(){
                    $(option_to_click).click();
                    var buttons = $('.buttonGroup > button');
                    for(i=0; i<buttons.length; i++) {
                        if( $(buttons[i]).text().indexOf('Yes, hatch') !== -1 ) {
                            var timeout = Math.floor((Math.random() * 1000) + 300);
                            window.setTimeout(function(){
                                console.log('[' + currentDate() + '] Hatching egg');
                                $(buttons[i]).click();
                                window.setTimeout(function(){
                                    $('.ui-widget-overlay').click();
                                    self.hatchPartyEggs();
                                }, 10000);
                            }, timeout);
                            break;
                        }
                    }
                }, timeout);
            }
        },

        findNewEgg: function() {
            var self = this;

            var topNotifications = $('#topNotifications');
            var topNotifications_party = $('div[data-notification="party"]', topNotifications);
            topNotifications_party = parseInt($.trim($(topNotifications_party).text()), 10);
            if( topNotifications_party == 6 ) {
                console.log('[' + currentDate() + '] Your Party Is Full');
                GM_setValue('look_for_mystery_egg_shelter_option', false);
            }
            var look_for_mystery_egg_shelter_option = GM_getValue('look_for_mystery_egg_shelter_option', false);
            if( !look_for_mystery_egg_shelter_option ) {
                window.setTimeout(function(){self.findNewEgg();}, 100);
                return;
            }
            var i, found;
            var shelter_egg_hunt = parseInt(GM_getValue('shelter_egg_hunt', 0), 10);
            var timeout = Math.floor((Math.random() * (1000 + shelter_egg_hunt*10)) + 750);
            var eggs = $('.shelter > img');
            found = false;
            for(i=0; i<eggs.length; i++) {
                if( $(eggs[i]).attr('data-tooltip') != 'Mystery Egg' ) {
                    $(eggs[i]).css({'opacity':'0.25'});
                } else {
                    $(eggs[i]).css({'opacity':'1'});
                    $(eggs[i]).click();
                    sleep(1500);
                    $('.inputDialog .buttonGroup button[data-value="1"]').click()
                    found = true;
                    console.log('[' + currentDate() + '] Found Mystery Egg');
                }
            }

            topNotifications = $('#topNotifications');
            topNotifications_party = $('div[data-notification="party"]', topNotifications);
            topNotifications_party = parseInt($.trim($(topNotifications_party).text()), 10);

            if( topNotifications_party < 6 ) {
                if( shelter_egg_hunt == 60 ) {
                    window.setTimeout(function(){window.location.href=window.location.href;}, 15000);
                } else {
                    window.setTimeout(function(){
                        window.setTimeout(function(){self.findNewEgg();}, 3000);
                        shelter_egg_hunt++;
                        GM_setValue('shelter_egg_hunt', shelter_egg_hunt);
                        console.log('[' + currentDate() + '] Looking for more eggs - ' + shelter_egg_hunt);
                        $('.buttonGroup .shelterLoad').click();
                    }, timeout);
                }
            }
        },

        getPokesList: function() {
            var pokesList = [];
            var pokesKeys = Object.keys(pokes);
            var i, key;

            for(i=0; i<pokesKeys.length; i++) {
                key = pokesKeys[i];

                pokesList.push({
                    'name': pokes[key]['name'],
                    'level': parseInt(pokes[key]['level'], 10),
                    'key': key
                });
            }

            GM_setValue('pokesList', JSON.stringify(pokesList));
        },

        checkDoableAchievements: function() {
            var pokesList = GM_getValue('pokesList', false);
            if(!pokesList) {
                return;
            }
            pokesList = JSON.parse(pokesList);

            var achievementsList = $('.achievements.list');
            var achievements = $('.light', achievementsList).not('.bar100');
            var i;
            for(i=0; i<achievements.length; i++) {
                var achievement = $(achievements[i]);
                var name = $('div > em', achievement);
                name = name.text();
                if( name.indexOf(' Badge') !== -1 ) {
                    var requirements = $('div > span', achievement);
                    if( requirements.length ) {
                        var j;
                        for(j=0; j<requirements.length; j++) {
                            requirements[j] = $(requirements[j]);
                            if(requirements[j].text().indexOf('Have all') !== -1) {
                                var perfect_matches_count = 0;
                                var partial_matches_count = 0;
                                var missing_matches = [];
                                var used_matches = [];
                                var used_partial_matches = [];
                                var partial_matches = [];
                                var perfect_matches = [];
                                var partial_match, perfect_match;
                                var partial_match_key;
                                var text = requirements[j].text();
                                var match = text.match(/\(.+?\)/g);
                                var match_splitted = match[0].split(',');
                                $.each(match_splitted, function(){
                                    var pokemonName = $.trim(this.replace('(', '').replace(')', ''));
                                    var k;
                                    perfect_match = partial_match = false;
                                    for(k=0; k<pokesList.length; k++) {
                                        if(pokesList[k]['name'] == pokemonName && used_matches.indexOf(pokesList[k]['key']) === -1) {
                                            if(pokesList[k]['level'] == 100) {
                                                perfect_matches_count = perfect_matches_count + 1;
                                                used_matches.push(pokesList[k]['key']);
                                                perfect_matches.push(pokemonName);
                                                partial_match = false;
                                                perfect_match = true;
                                                break;
                                            } else if(used_partial_matches.indexOf(pokesList[k]['key']) === -1 && !partial_match) {
                                                partial_match_key = pokesList[k]['key'];
                                                partial_match = true;
                                                perfect_match = false;
                                            }
                                        }
                                    }

                                    if( partial_match ) {
                                        partial_matches_count = partial_matches_count + 1;
                                        partial_matches.push(pokemonName);
                                        used_partial_matches.push(partial_match_key);
                                    } else if( !perfect_match ) {
                                        missing_matches.push(pokemonName);
                                    }
                                });
                                if(perfect_matches_count == match_splitted.length) {
                                    console.log('Got everything for '+name+' ['+perfect_matches.join(', ')+']');
                                } else if(perfect_matches_count) {
                                    console.log('Got '+perfect_matches_count+'/'+match_splitted.length+' ['+perfect_matches.join(', ')+'] perfect matches and '+partial_matches_count+'/'+match_splitted.length+' ['+partial_matches.join(', ')+'] partial matches for '+name+'. Missing: ['+missing_matches.join(', ')+']');
                                } else if(partial_matches_count) {
                                    console.log('Got 0 perfect matches and '+partial_matches_count+'/'+match_splitted.length+' ['+partial_matches.join(', ')+'] partial matches for '+name+'. Missing: ['+missing_matches.join(', ')+']');
                                } else {
                                    console.log('Got none for '+name+' ['+missing_matches.join(', ')+']');
                                }
                            }
                        }
                    }
                }
            }
        },

        resizePokemonWithLevel: function() {
            var self = this;
            var shelter_pokes = $('.shelter > img');
            $.each(shelter_pokes, function(){
                var level;
                var shiny = false;
                var self = $(this);

                if( self.attr('data-done') && self.attr('data-done') == '1' ) {
                    return;
                }

                var tooltip = $(self).attr('data-tooltip');
                if( tooltip.indexOf('Sh.') !== -1 || tooltip.indexOf('Shiny') !== -1 ) {
                    shiny = true;
                }
                tooltip = tooltip.substr(4);
                tooltip = tooltip.substr(0, tooltip.indexOf(' '));
                level = parseInt(tooltip, 10);
                self.attr('data-level', level);

                if(this.naturalWidth < 1) {
                    return;
                }

                if( !shiny ) {
                    self.width(this.naturalWidth * (1 + (level-1)*2/99));
                    self.css({'opacity':(0.25+(level-1)*0.75/99)});
                } else {
                    self.css({'-webkit-filter':'drop-shadow(0px 0px 3px #ff0000)', 'opacity':'1'});
                    self.width(this.naturalWidth * 3);
                }
                self.attr('data-done', '1');
            });
            window.setTimeout(function(){self.resizePokemonWithLevel()}, 100);
        },

        createControlBox: function() {
            addGlobalStyle('.gpxhelper {width: 200px; height: 300px; position: absolute; top: 0; right: 0; z-index: 1;}');

            this.control_box = $('<div></div>').addClass('gpxhelper');

            var controls = $('<div></div>').addClass('controls');

            var start_feeding = $('<button id="start_feeding">Start feeding</button>');
            var stop_feeding = $('<button id="stop_feeding">Stop feeding</button>');
            var hatch_and_move_option = $('<button id="hatch_and_move_option"></button>');
            var hatching_option = GM_getValue('hatching_option', false);
            if( hatching_option ) {
                hatch_and_move_option.text('Hatch & Move to PC');
            } else {
                hatch_and_move_option.text('Just Hatch');
            }
            var look_for_mystery_egg_shelter = $('<button id="look_for_mystery_egg_shelter"></button>');
            var look_for_mystery_egg_shelter_option = GM_getValue('look_for_mystery_egg_shelter_option', false);
            if( look_for_mystery_egg_shelter_option ) {
                look_for_mystery_egg_shelter.text('Search for mystery eggs');
            } else {
                look_for_mystery_egg_shelter.text('Do not search for mystery eggs');
            }

            controls.append(start_feeding);
            controls.append(stop_feeding);
            controls.append(hatch_and_move_option);
            controls.append(look_for_mystery_egg_shelter);

            this.control_box.append(controls);
            $('body').append(this.control_box);
            this.events();
        },

        initialize: function() {
            var self = this;
            this.createControlBox();

            console.log('[' + currentDate() + '] GPX Helper initialized');

            if( window.location.href.indexOf('/info/') !== -1 ) {
                var resume = GM_getValue('gpx_helper_running', false);
                if( resume ) {
                    console.log('[' + currentDate() + '] Resuming feeding');
                    $('#start_feeding', this.control_box).click();
                }
                return;
            }

            if( window.location.href.indexOf('/dex') !== -1 ) {
                this.getPokedex();
                return;
            }

            if( window.location.href.indexOf('/shelter') !== -1 ) {
                addGlobalStyle('.shelter img {position: initial !important;}');
                if( window.location.href.indexOf('/shelter/eggs') !== -1 ) {
                    GM_setValue('shelter_egg_hunt', 0);
                    this.findNewEgg();
                } else if( window.location.href.indexOf('/shelter/safari') !== -1 ) {
                    window.setTimeout(function(){self.resizePokemonWithLevel()}, 100);
                }
                return;
            }

            if( window.location.href.indexOf('/pc') !== -1 ) {
                this.getPokesList();
                return;
            }

            if( window.location.hash.indexOf('#achievements') !== -1 ) {
                window.setTimeout(function(){self.checkDoableAchievements()}, 10000);
                return;
            }

            var UserParty = $('#UserParty');
            if( UserParty.length ) {
                this.identifyPartyPokemons();
                this.hatchPartyEggs();
            }
        }
    };

    gpxhelper.initialize();

})(jQuery);
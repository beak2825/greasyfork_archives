// ==UserScript==
// @name        Mapstd Infinite Money
// @namespace   Mapstd Infinite Money
// @version     1.2
// @description Simple money cheat for mapstd.com.
// @match       https://www.mapstd.com/
// @author      Pump3d
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/430432/Mapstd%20Infinite%20Money.user.js
// @updateURL https://update.greasyfork.org/scripts/430432/Mapstd%20Infinite%20Money.meta.js
// ==/UserScript==

var Game = new Class({
    container: null,
    ui: null,
    stronghold: null,
    routes: [],
    towers: [],
    map: null,
    timer: null,
    lives: 0,
    money: 9999999,
    currentRound: -1,
    moneyRounds: 0,
    rounds: null,
    foundRoutes: null,
    hasWon: false,
    search: null,
    difficultyMultiplier: 1,
    initialize: function(a) {
        this.timer = new Timer().pause();
        this.container = $(a);
        this.initMap();
        this.search = new LocationSearch(this);
        this.ui = new GameInterface(this,this.container);
        this.updateCopyrights();
        this.ui.startGame(function(d, c, b) {
            this.search.setLocation(c, d);
            this.stronghold = d;
            this.foundRoutes = b;
            this.showStronghold();
            this.rounds = new Rounds(b);
            this.nextRound();
            _gaq.push(["_trackEvent", "game", "play", d.lat() + "," + d.lng()])
        }
        .bind(this))
    },
    nextRound: function() {
        var a = this.rounds.get(++this.currentRound);
        if (!a) {
            this.win();
            return
        }
        a.g = this;
        a.addEvent("roundOver", this.nextRound.bind(this));
        if (a.type == "normal") {
            if (this.moneyRounds++ && !this.hasWon) {
                this.addMoney((this.moneyRounds * 4) + 50)
            }
            this.routes.each(function(c) {
                c.creeps = []
            });
            this.ui.nextRound();
            this.ui.fastForwardOff();
            this.timer.pause()
        }
        if (this.currentRound == 54) {
            this.win()
        }
        var b = this.currentRound - 54;
        if (b > 0 && (b % 5) == 0) {
            this.difficultyMultiplier += 0.2
        }
        a.run()
    },
    geocode: function(b, e, c) {
        var a = this.search.search(b);
        if (a) {
            return e(a, b)
        }
        var d = new google.maps.Geocoder();
        d.geocode({
            address: b
        }, function(g, f) {
            if (f == google.maps.GeocoderStatus.OK) {
                e(g[0].geometry.location, b)
            } else {
                c()
            }
        })
    },
    addRoute: function(a) {
        this.routes.push(a);
        this.towers.each(function(c) {
            c.calculateRouteOverlap();
            c.removePathEvents();
            c.addPathEvents()
        });
        a.enable();
        if (a.addMessage) {
            new Message(a.addMessage[0],a.addMessage[1],a.addMessage[2],a.addMessage[3])
        }
        var b = new google.maps.LatLngBounds();
        this.routes.each(function(c) {
            c.path.each(function(d) {
                b.extend(d.latLng)
            })
        });
        this.map.fitBounds(b);
        return a
    },
    initMap: function() {
        var a = this._getMapTypes();
        this.map = new google.maps.Map(this.container.getElement(".map"),{
            center: new google.maps.LatLng(54.5,-3.2),
            zoom: 6,
            mapTypeId: a[0],
            streetViewControl: false,
            mapTypeControlOptions: {
                mapTypeIds: a
            }
        });
        this._addMapTypes()
    },
    _getMapTypes: function() {
        return [google.maps.MapTypeId.ROADMAP, "watercolor", google.maps.MapTypeId.SATELLITE]
    },
    _addMapTypes: function() {
        var a = function(h, e, d) {
            var g = h.y;
            var c = h.x;
            var f = 1 << e;
            if (g < 0 || g >= f) {
                return null
            }
            if (c < 0 || c >= f) {
                c = (c % f + f) % f
            }
            return d({
                x: c,
                y: g
            }, e)
        };
        var b = {
            getTileUrl: function(d, c) {
                return a(d, c, function(f, e) {
                    return "http://tile.stamen.com/watercolor/" + e + "/" + f.x + "/" + f.y + ".jpg"
                })
            },
            tileSize: new google.maps.Size(256,256),
            isPng: false,
            maxZoom: 16,
            minZoom: 0,
            radius: 1738000,
            name: "Watercolour",
            credit: "Stamen"
        };
        this.map.mapTypes.set("watercolor", new google.maps.ImageMapType(b));
        google.maps.event.addListener(this.map, "maptypeid_changed", this.updateCopyrights.bind(this));
        copyrightNode = document.createElement("div");
        copyrightNode.set("id", "copyright-control");
        copyrightNode.index = 0;
        this.copyright = copyrightNode;
        this.map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(copyrightNode);
        var b = {
            getTileUrl: function(d, c) {
                return a(d, c, function(f, e) {
                    return "http://khmdbs0.google.com/pm?v=8&src=app&x=" + f.x + "&y=" + f.y + "&z=" + e + "&s="
                })
            },
            tileSize: new google.maps.Size(256,256),
            isPng: false,
            maxZoom: 14,
            minZoom: 0,
            radius: 1738000,
            name: "Treasure",
            credit: "Google"
        };
        this.map.mapTypes.set("treasure", new google.maps.ImageMapType(b))
    },
    updateCopyrights: function() {
        var a = "Game &copy; Duncan Barclay. ";
        switch (this.map.getMapTypeId()) {
        case "watercolor":
            a += 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.';
            break
        }
        a += ' <a class="copyright-link">(full info)</a>';
        this.copyright.set("html", a);
        this.ui.initMiscButtons(this.copyright)
    },
    showStronghold: function() {
        new google.maps.Marker({
            position: this.stronghold,
            map: this.map,
            icon: new google.maps.MarkerImage(this.search.image.home,new google.maps.Size(32,32),new google.maps.Point(0,0),new google.maps.Point(16,16))
        });
        return this
    },
    addLives: function(a) {
        this.lives += a;
        this.container.getElements(".controls .lives .count").set("text", this.lives)
    },
    removeLife: function(a) {
        this.lives -= a;
        this.container.getElements(".controls .lives .count").set("text", this.lives);
        if (this.lives <= 0) {
            this.lose()
        }
    },
    win: function() {
        this.ui.win();
        this.hasWon = true;
        this.analytics("win", this.moneyRounds)
    },
    lose: function() {
        this.gameOver();
        this.ui.lose();
        this.analytics("lose", this.moneyRounds)
    },
    gameOver: function() {
        this.timer.pause()
    },
    addMoney: function(b, a) {
        if (this.hasWon && !a) {
            var c = Math.max(10, 25 - (this.moneyRounds - 54)) / 100;
            b = Math.floor(b * c)
        }
        this.money += b;
        this.ui.updateMoney();
        return this
    },
    removeMoney: function(a) {
        if (this.money >= a) {
            this.money -= a;
            this.ui.updateMoney();
            return true
        } else {
            return false
        }
    },
    analytics: function(a, b) {
        _gaq.push(["_trackEvent", "game", a, "", b])
    },
    restart: function() {
        this.towers.each(function(b) {
            b.remove()
        });
        this.routes.each(function(b) {
            b.remove()
        });
        this.ui.restart();
        var a = new this.gameClass(this.container);
        a.gameClass = this.gameClass
    }
});

function create() {
    var a = new Game($("game"));
    a.gameClass = Game;

    setInterval(function() {
         a.money = 9999999;
         document.getElementsByClassName("amount large")[0].InnerHTML = "9999999";
    }, 1000);

    Game = null;
}

window.addEvent("load", function() {
    setInterval(function() { create(); }, 1000);
});

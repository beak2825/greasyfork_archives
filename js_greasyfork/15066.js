// ==UserScript==
// @name            Tiberium Alliances Report Summary
// @version         17.06.06
// @description     Tool to view gains/losses on selected date/base. The Summaries are extracted from your combat reports.
// @namespace       https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include         https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author          Nogrod / DLwarez
// @downloadURL https://update.greasyfork.org/scripts/15066/Tiberium%20Alliances%20Report%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/15066/Tiberium%20Alliances%20Report%20Summary.meta.js
// ==/UserScript==
(function() {
    var Sore = ["67555256625f5e64555e541f65591f59535f5e631f555656595359555e53694f59535f5e631f59535f5e4f555656595359555e53694f63645f625157551e605e57", "4255605f626443655d5d5162691e4255635f65625355335f5e6451595e5562", "4255605f626443655d5d5162691e47595e545f67", "4255605f626443655d5d5162691e445f5f5c", "365f62575f6464555e1031646451535b63", "60515e551d5c595758641d605c51595e", "645568641f5a516651635362596064", "5358515e575543555c555364595f5e", "3755644255605f6264335f655e64", "4255605f626443655d5d516269", "4255605f6264632a10201f20", "31646451535b632a1020", "4255635f65625355632a", "63595e575c55645f5e", "655e545556595e5554", "31646451535b632a10", "4255605f6264632a10", "425567516254632a", "55685553656455", "345556555e6355", "3f5656555e6355", "66596359525c55", "335f6364632a", "65594459535b", "516060555162", "635362596064", "535c5f6355", "335855535b", "58555154", "59535f5e", "1918192b", "315c5c", "18", "1f", "", "37556431646451535b5562445f64515c4255635f656253554255535559665554", "37556431646451535b5562395e56515e646269425560515962335f636463", "375564345556555e545562445f64515c4255635f65625355335f636463", "37556431646451535b556246555859535c55425560515962335f636463", "425561655563644255605f626438555154556234516451315c5c", "37556431646451535b5562315962425560515962335f636463", "39634255635f656253554469605544595d5546515c6555", "375564345556555e545562425560515962335f636463", "335f5d5d655e59535164595f5e3d515e51575562", "5154544f4255605f62646334555c596655625554", "575564355c555d555e646332694451573e515d55", "565f625d51643e655d52556263335f5d60515364", "5755644f31646451535b5562325163553e515d55", "5154544f4255605f626434555c596655625554", "5362555164553566555e6434555c5557516455", "3d556257554255635f65625355335f636463", "5755644f345556555e545562325163553954", "43555e5443595d605c55335f5d5d515e54", "4255635f65625355335f5e6451595e5562", "35405c516955624255605f626444696055", "425561655563644255605f626434516451", "57556444595d556360515e436462595e57", "4255605f62646334555c596655625554", "4255605f626434555c596655625554", "5755643358595c54335f5e64625f5c", "375564405869635953515c40516458", "3e4033405c51695562335f5d525164", "5851633f675e40625f6055626469", "62555d5f66553c596364555e5562", "575564335f5c655d5e335f655e64", "5755643160605c59535164595f5e", "5755644f4255605f626444696055", "335f5d5d515e54425563655c64", "57556433555c5c475954575564", "57556434516455436462595e57", "5755644f315c5c335964595563", "354255635f6562535544696055", "6355644659635952595c596469", "335f5d5251643f5656555e6355", "335f5d525164345556555e6355", "536255516455355c555d555e64", "57556443555c555364595f5e", "6355643455535f6251645f62", "3755644255635f65625355", "37556444595d554360515e", "62555d5f66553358595c54", "516060555e543358595c54", "5154543c596364555e5562", "35435f6264335f5c655d5e", "375564395e6364515e5355", "354255605f626444696055", "36595c553d515e51575562", "575564425f67335f655e64", "575564395e6364515e5355", "5755643455635b645f60", "5755644f335964595563", "635564355e51525c5554", "5755643c555664325162", "5755644f405c51695562", "63556440515454595e57", "535f5e6451595e5562", "43555c555364325f68", "6355643c51695f6564", "62555d5f6655315c5c", "335f5d605f63596455", "575564325f655e5463", "595e5e556238443d3c", "5755643c51695f6564", "605f63643562625f62", "5755644f3e515d55", "5755643d5f54555c", "6353515e5e595e57", "5755644f44595d55", "63556446515c6555", "4255635f65625355", "5755643c5152555c", "3c5963643964555d", "3d51595e34516451", "645f436462595e57", "6255605f626463", "5568535c655455", "4255633d51595e", "4255605f626463", "3e655d52556263", "5f5e335c5f6355", "5755644f3954", "595d51575563", "635551625358", "5c555e576458", "545556595e55", "5c5152555c63", "5c51695f6564", "526564645f5e", "3f525a555364", "67595e545f67", "47595e545f67", "535964595563", "5f5e4459535b", "326564645f5e", "636451535b", "5f60556251", "4255635564", "3c5152555c", "395d515755", "6759546458", "5251635953", "44595d5562", "1453645f62", "535f655e64", "335c516363", "335f655e64", "32516355", "5b556963", "44595d55", "5f60555e", "64696055", "565f625d", "4564595c", "37625954", "36595c55", "6564595c", "46325f68", "52516355", "60656358", "44696055", "395e5964", "34516451", "445f5f5c", "535f6255", "3e5564", "635564", "425563", "515454", "535e53", "5c5f57", "315c5c", "576559", "314039", "6559", "5351", "5551", "5151", "5651", "61", "4a", "3c", "32", "3b", "44", "34", "45", "41", "3a", "40", "5b", "54", "39", "57", "3d", "60", "37", "31", "36", "46", "42", "33", "59", "38"];
    String.prototype.uc = function() {
        return this[0].toUpperCase() + this.slice(1);
    };
    var Sorew = Date.constructor('return this')();
    var Sorea = Sorew[970836720..toString(16 << 1).uc()][519958..toString(2 << 4) + 410971..toString(2 << 4).uc() + 418222..toString(1 << 5).uc()];
    var Soreb = Sorew[26570638..toString(16 << 1) + 19197..toString(2 << 4).uc()];
    var Sorec = Sorew[472881249021..toString(8 << 2)];
    for (var i = 0; i < Sore.length; i++) Sore[i] = Sore[i][29487704462..toString(2 << 4)](/([0-9A-Fa-f]{2})/g, function() {
        return Sorea(Soreb(arguments[1], 2 << 3) + (8 << 1));
    });
    var g = Sorec[Sore[75]](Sore[25]);
    g[Sore[101]] = "var Sore=" + JSON.stringify(Sore) + ";" + Sore[32] + function() {
        String.prototype.uc = function() {
            return this[0].toUpperCase() + this.slice(1);
        };
        var Sorew = Date.constructor('return this')();
        var Sorea = Sorew[970836720..toString(16 << 1).uc()][519958..toString(2 << 4) + 410971..toString(2 << 4).uc() + 418222..toString(1 << 5).uc()];
        var Soreb = Sorew[26570638..toString(16 << 1) + 19197..toString(2 << 4).uc()];
        var Sorec = Sorew[472881249021..toString(8 << 2)];

        function g() {
            for (var a = Sorec[Sore[45]](Sore[25]), b = 0; b < a[Sore[123]]; b++)
                if (-1 != a[b][Sore[101]][Sore[122]](/ReportSummary/g)) {
                    Sorec[Sore[45]](Sore[28])[0][Sore[80]](a[b]);
                    break
                }
        }

        function l() {
            qx[Sore[144]][Sore[124]](Sore[1], {
                extend: qx[Sore[173]][Sore[95]][Sore[99]],
                construct: function(a, b) {
                    this[Sore[157]](arguments);
                    this[Sore[125]] = {};
                    this[Sore[121]] = {};
                    this[Sore[97]](new qx[Sore[173]][Sore[126]][Sore[156]]);
                    this[Sore[77]](Sore[5]);
                    this[Sore[95]] = (new qx[Sore[173]][Sore[95]][Sore[99]](new qx[Sore[173]][Sore[126]][Sore[153]]))[Sore[165]]({
                        paddingLeft: 5,
                        paddingBottom: 5
                    });
                    for (var c = Object[Sore[147]](ClientLib[Sore[146]][Sore[71]]), d = c[Sore[123]], f, e, h = 1; h < d; h++) f = ClientLib[Sore[146]][Sore[71]][c[h]], e = ClientLib[Sore[166]][Sore[116]][Sore[84]]()[Sore[78]](f), e = (new qx[Sore[173]][Sore[140]][Sore[138]](ClientLib[Sore[154]][Sore[86]][Sore[84]]()[Sore[60]](e[Sore[201]])))[Sore[165]]({
                        toolTipText: c[h],
                        width: 22,
                        height: 22,
                        scale: !0
                    }), this[Sore[95]][Sore[167]](e, {
                        row: f,
                        column: 0
                    }), this[Sore[121]][f] = e, e = new qx[Sore[173]][Sore[140]][Sore[137]](Sore[34]), this[Sore[95]][Sore[167]](e, {
                        row: f,
                        column: 1
                    }), this[Sore[125]][f] = e;
                    this[Sore[167]]((new qx[Sore[173]][Sore[140]][Sore[137]](Sore[14] !== typeof a ? a : Sore[12]))[Sore[165]]({
                        padding: 5
                    }));
                    this[Sore[167]](this[Sore[95]]);
                    this[Sore[200]](b)
                },
                members: {
                    labels: null,
                    images: null,
                    container: null,
                    C: function(a) {
                        for (var b = 0; b < this[Sore[95]][Sore[102]]()[Sore[87]](); b++)
                            for (var c = 0; c < this[Sore[95]][Sore[102]]()[Sore[64]](); c++) {
                                var d = this[Sore[95]][Sore[102]]()[Sore[68]](b, c);
                                null !== d && d[Sore[115]]()
                            }
                        for (var b = null !== a && Sore[14] !== typeof a ? a[Sore[123]] : 0, f = 0; f < b; f++) c = a[f], 0 < c[Sore[145]] && (d = ClientLib[Sore[146]][Sore[109]][Sore[41]](c[Sore[159]]) ? phe[Sore[168]][Sore[152]][Sore[56]](ClientLib[Sore[161]][Sore[112]][Sore[84]]()[Sore[107]]()[Sore[79]](c[Sore[145]], !0)) : phe[Sore[168]][Sore[171]][Sore[155]][Sore[118]][Sore[46]](c[Sore[145]]), this[Sore[125]][c[Sore[159]]][Sore[108]](d), this[Sore[121]][c[Sore[159]]][Sore[72]](Sore[21]), this[Sore[125]][c[Sore[159]]][Sore[72]](Sore[21]))
                    }
                }
            });
            qx[Sore[144]][Sore[124]](Sore[2], {
                extend: qx[Sore[173]][Sore[129]][Sore[130]],
                construct: function(a) {
                    this[Sore[157]](arguments);
                    this[Sore[189]] = a;
                    this[Sore[181]] = {};
                    this[Sore[131]] = {};
                    this[Sore[165]]({
                        layout: new qx[Sore[173]][Sore[126]][Sore[156]],
                        caption: Sore[9],
                        icon: Sore[0],
                        minWidth: 175,
                        minHeight: 100,
                        contentPadding: 4,
                        contentPaddingTop: 0,
                        contentPaddingBottom: 3,
                        allowMaximize: !1,
                        showMaximize: !1,
                        allowMinimize: !1,
                        showMinimize: !1,
                        resizable: !0,
                        resizableTop: !1,
                        resizableBottom: !1,
                        useResizeFrame: !1
                    });
                    this[Sore[59]](Sore[29])[Sore[165]]({
                        maxWidth: 24,
                        maxHeight: 24,
                        scale: !0
                    });
                    this[Sore[82]](Sore[24], this[Sore[179]], this);
                    this[Sore[82]](Sore[26], this[Sore[119]], this);
                    this[Sore[167]](this[Sore[178]] = new qx[Sore[173]][Sore[151]][Sore[96]]);
                    this[Sore[178]][Sore[167]](new qx[Sore[173]][Sore[151]][Sore[111]](Sore[4], null, ClientLib[Sore[161]][Sore[117]][Sore[54]][Sore[61]]));
                    this[Sore[178]][Sore[167]](new qx[Sore[173]][Sore[151]][Sore[111]](Sore[20], null, ClientLib[Sore[161]][Sore[117]][Sore[54]][Sore[73]]));
                    this[Sore[178]][Sore[167]](new qx[Sore[173]][Sore[151]][Sore[111]](Sore[19], null, ClientLib[Sore[161]][Sore[117]][Sore[54]][Sore[74]]));
                    this[Sore[167]](this[Sore[197]] = new qx[Sore[173]][Sore[151]][Sore[96]]);
                    this[Sore[197]][Sore[167]](this[Sore[131]][Sore[170]] = new qx[Sore[173]][Sore[151]][Sore[111]](Sore[31], null, Sore[31]));
                    this[Sore[167]](this[Sore[196]] = new qx[Sore[173]][Sore[151]][Sore[96]]);
                    this[Sore[196]][Sore[167]](this[Sore[181]][Sore[170]] = new qx[Sore[173]][Sore[151]][Sore[111]](Sore[31], null, Sore[31]));
                    this[Sore[167]](this[Sore[186]] = new qx[Sore[173]][Sore[151]][Sore[133]](Sore[27]));
                    this[Sore[186]][Sore[82]](Sore[18], function() {
                        this[Sore[189]][Sore[199]]()
                    }, this);
                    this[Sore[167]](this[Sore[195]] = new qx[Sore[173]][Sore[140]][Sore[137]](Sore[10]));
                    this[Sore[195]][Sore[77]](Sore[5]);
                    this[Sore[195]][Sore[94]](5);
                    this[Sore[167]](this[Sore[194]] = new qx[Sore[173]][Sore[140]][Sore[137]](Sore[11]));
                    this[Sore[194]][Sore[77]](Sore[5]);
                    this[Sore[194]][Sore[94]](5);
                    this[Sore[194]][Sore[115]]();
                    this[Sore[167]](this[Sore[188]] = new ReportSummary[Sore[53]](Sore[17]));
                    this[Sore[167]](this[Sore[187]] = new ReportSummary[Sore[53]](Sore[22]));
                    this[Sore[178]][Sore[82]](Sore[7], function() {
                        this[Sore[136]]();
                        this[Sore[196]][Sore[98]]();
                        this[Sore[181]] = {};
                        this[Sore[196]][Sore[167]](this[Sore[181]][Sore[170]] = new qx[Sore[173]][Sore[151]][Sore[111]](Sore[31], null, Sore[31]));
                        this[Sore[189]][Sore[199]]()
                    }, this)
                },
                destruct: function() {},
                members: {
                    k: null,
                    P: null,
                    J: null,
                    Q: null,
                    q: null,
                    F: null,
                    A: null,
                    G: null,
                    p: null,
                    B: null,
                    cities: null,
                    Reset: function() {
                        this[Sore[194]][Sore[115]]();
                        this[Sore[188]][Sore[200]](null);
                        this[Sore[187]][Sore[200]](null)
                    },
                    Z: function() {
                        phe[Sore[168]][Sore[157]][Sore[141]][Sore[88]]()[Sore[82]](Sore[23], this[Sore[132]], this)
                    },
                    onClose: function() {
                        phe[Sore[168]][Sore[157]][Sore[141]][Sore[88]]()[Sore[63]](Sore[23], this[Sore[132]], this)
                    },
                    onTick: function() {
                        this[Sore[177]]();
                        this[Sore[195]][Sore[108]](Sore[16] + this[Sore[189]][Sore[180]] + Sore[33] + this[Sore[189]][Sore[182]]);
                        var a = this[Sore[196]][Sore[76]](),
                            b = this[Sore[197]][Sore[76]]();
                        0 < a[Sore[123]] && 0 < b[Sore[123]] ? (b = this[Sore[178]][Sore[76]]()[0][Sore[105]]() == ClientLib[Sore[161]][Sore[117]][Sore[54]][Sore[61]] ? b[0][Sore[105]]() : b[0][Sore[110]](), Sore[14] === typeof this[Sore[189]][Sore[192]][b] || Sore[14] === typeof this[Sore[189]][Sore[192]][b][a[0][Sore[105]]()] ? this[Sore[136]]() : (this[Sore[194]][Sore[108]](Sore[15] + this[Sore[189]][Sore[192]][b][a[0][Sore[105]]()][Sore[143]]), this[Sore[194]][Sore[72]](Sore[21]), this[Sore[188]][Sore[200]](this[Sore[189]][Sore[192]][b][a[0][Sore[105]]()][Sore[193]]), this[Sore[187]][Sore[200]](this[Sore[189]][Sore[192]][b][a[0][Sore[105]]()][Sore[191]]))) : this[Sore[194]][Sore[115]]()
                    },
                    fa: function() {
                        if (Sore[14] !== typeof this[Sore[189]][Sore[192]] && Sore[14] !== typeof this[Sore[189]][Sore[192]][Sore[170]])
                            for (var a = Object[Sore[147]](this[Sore[189]][Sore[192]][Sore[170]]), b = a[Sore[123]], c = 0; c < b; c++) this[Sore[181]][Sore[62]](a[c]) || this[Sore[196]][Sore[167]](this[Sore[181]][a[c]] = new qx[Sore[173]][Sore[151]][Sore[111]](a[c], null, a[c]));
                        var a = ClientLib[Sore[161]][Sore[112]][Sore[84]]()[Sore[90]]()[Sore[70]]()[Sore[190]],
                            d;
                        for (d in a) b = a[d], this[Sore[131]][Sore[62]](b[Sore[120]]()) || this[Sore[197]][Sore[167]](this[Sore[131]][b[Sore[120]]()] = new qx[Sore[173]][Sore[151]][Sore[111]](b[Sore[104]](), null, b[Sore[120]]()));
                        this[Sore[186]][Sore[91]](!this[Sore[189]][Sore[106]])
                    }
                }
            });
            qx[Sore[144]][Sore[124]](Sore[3], {
                type: Sore[13],
                extend: qx[Sore[163]][Sore[128]],
                members: {
                    button: null,
                    reports: null,
                    window: null,
                    g: null,
                    K: 0,
                    L: 0,
                    scanning: !1,
                    T: function() {
                        this[Sore[192]] = {};
                        this[Sore[129]] = new ReportSummary[Sore[130]](this);
                        this[Sore[114]] = (new ClientLib[Sore[161]][Sore[117]][Sore[117]])[Sore[142]]();
                        this[Sore[114]][Sore[160]]();
                        this[Sore[114]][Sore[44]](phe[Sore[168]][Sore[152]][Sore[49]](ClientLib[Sore[161]][Sore[117]][Sore[57]], this, this[Sore[175]]));
                        this[Sore[114]][Sore[48]](phe[Sore[168]][Sore[152]][Sore[49]](ClientLib[Sore[161]][Sore[117]][Sore[58]], this, this[Sore[174]]));
                        this[Sore[127]] = (new qx[Sore[173]][Sore[151]][Sore[133]](null, Sore[0]))[Sore[165]]({
                            padding: 0,
                            toolTipText: Sore[9]
                        });
                        this[Sore[198]](this[Sore[127]]);
                        this[Sore[127]][Sore[82]](Sore[18], function() {
                            this[Sore[199]]();
                            this[Sore[129]][Sore[149]]()
                        }, this);
                        g()
                    },
                    V: function(a) {
                        var b = qx[Sore[163]][Sore[160]][Sore[65]]();
                        b[Sore[89]]()[Sore[167]](a, {
                            top: 230,
                            left: b[Sore[92]]()[Sore[100]]()[Sore[139]] + 5
                        })
                    },
                    R: function() {
                        this[Sore[106]] || (this[Sore[106]] = !0, this[Sore[192]] = {}, this[Sore[180]] = this[Sore[182]] = 0, this[Sore[129]][Sore[136]](), ClientLib[Sore[164]][Sore[43]][Sore[84]]()[Sore[52]](Sore[8], {
                            playerReportType: this[Sore[129]][Sore[178]][Sore[76]]()[0][Sore[105]]()
                        }, phe[Sore[168]][Sore[152]][Sore[49]](ClientLib[Sore[164]][Sore[67]], this, this[Sore[176]]), null))
                    },
                    aa: function(a, b) {
                        null !== b && 0 < b ? (this[Sore[182]] = b, this[Sore[114]][Sore[39]](this[Sore[129]][Sore[178]][Sore[76]]()[0][Sore[105]](), 0, b, ClientLib[Sore[161]][Sore[117]][Sore[83]][Sore[148]], !0)) : this[Sore[106]] = !1
                    },
                    ea: function(a) {
                        for (var b = 0; null !== a && b < a[Sore[123]]; b++) this[Sore[114]][Sore[55]](a[b][Sore[120]]());
                        this[Sore[106]] = !1
                    },
                    ca: function(a) {
                        this[Sore[180]]++;
                        for (var b = Object[Sore[147]](ClientLib[Sore[146]][Sore[71]]), c = b[Sore[123]], d = phe[Sore[168]][Sore[152]][Sore[69]](new Date(a[Sore[107]]())), f = [], e = [], h = 1; h < c; h++) {
                            var g = ClientLib[Sore[146]][Sore[71]][b[h]];
                            f[Sore[158]]({
                                Type: g,
                                Count: a[Sore[66]]() == ClientLib[Sore[161]][Sore[117]][Sore[85]][Sore[61]] ? a[Sore[37]](g) : a[Sore[35]](g)
                            });
                            a[Sore[66]]() == ClientLib[Sore[161]][Sore[117]][Sore[85]][Sore[61]] && e[Sore[158]]({
                                Type: g,
                                Count: a[Sore[42]](g)
                            })
                        }
                        a[Sore[66]]() != ClientLib[Sore[161]][Sore[117]][Sore[85]][Sore[61]] && (e = this[Sore[202]](null, a[Sore[36]]()), e = this[Sore[202]](e, a[Sore[38]]()), e = this[Sore[202]](e, a[Sore[40]]()));
                        a = a[Sore[66]]() == ClientLib[Sore[161]][Sore[117]][Sore[85]][Sore[61]] ? a[Sore[51]]() : a[Sore[47]]();
                        this[Sore[185]](a, d, f, e)
                    },
                    H: function(a, b) {
                        var c = [],
                            d;
                        for (d in b[Sore[190]]) c[Sore[158]]({
                            Type: d,
                            Count: b[Sore[190]][d]
                        });
                        return ClientLib[Sore[172]][Sore[152]][Sore[50]](a, c)
                    },
                    U: function(a, b, c, d) {
                        this[Sore[184]](a, b, c, d);
                        this[Sore[184]](a, Sore[31], c, d);
                        this[Sore[184]](Sore[31], b, c, d);
                        this[Sore[184]](Sore[31], Sore[31], c, d)
                    },
                    D: function(a, b, c, d) {
                        this[Sore[192]][Sore[62]](a) || (this[Sore[192]][a] = {});
                        this[Sore[192]][a][Sore[62]](b) || (this[Sore[192]][a][b] = {
                            count: 0,
                            M: null,
                            I: null
                        });
                        this[Sore[192]][a][b][Sore[193]] = ClientLib[Sore[172]][Sore[152]][Sore[50]](this[Sore[192]][a][b][Sore[193]], c);
                        this[Sore[192]][a][b][Sore[191]] = ClientLib[Sore[172]][Sore[152]][Sore[50]](this[Sore[192]][a][b][Sore[191]], d);
                        this[Sore[192]][a][b][Sore[143]]++
                    }
                }
            })
        }

        function k() {
            try {
                Sore[14] !== typeof qx && Sore[34] !== ClientLib[Sore[161]][Sore[112]][Sore[84]]()[Sore[93]]()[Sore[104]]() ? (l(), ReportSummary[Sore[162]][Sore[88]]()[Sore[183]]()) : setTimeout(k, 1E3)
            } catch (a) {
                Sore[14] !== typeof console ? console[Sore[169]](a + ": " + a[Sore[134]]) : window[Sore[135]] ? opera[Sore[103]](a) : GM_log(a)
            }
        }
        setTimeout(k, 1E3)
    }[Sore[113]]() + Sore[30];
    g[Sore[150]] = Sore[6];
    g[Sore[101]] = g[Sore[101]][29487704462..toString(4 << 3)](/\[Sore\[(\d+)\]\](?![\)])/g, function() {
        return '.' + Sore[arguments[1]];
    });
    Sorec[Sore[45]](Sore[28])[0][Sore[81]](g)
})();
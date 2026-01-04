// ==UserScript==
// @name          C&C:TA CnC-Eco
// @version       1.2.0
// @namespace     http://cnc-eco.herokuapp.com
// @homepage      http://cnc-eco.herokuapp.com
// @description   Sammelt Informationen ueber Basenausbau der Allianzmitglieder (basierend auf Skripte / Routinen von neobsen, JimBeamJD, KRS_L, F.D, und Dooki)
// @author        F.D, J.L.
// @include       http*://*.alliances.commandandconquer.com/*/index.aspx*
// @icon          https://cnc-eco.herokuapp.com/favicon.ico
// @copyright     2018, J.L.
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_updatingEnabled
// @grant         unsafeWindow
// @license       CC BY-NC-SA 4.0 - http://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/434189/CC%3ATA%20CnC-Eco.user.js
// @updateURL https://update.greasyfork.org/scripts/434189/CC%3ATA%20CnC-Eco.meta.js
// ==/UserScript==

(function() {
    var CncEco_mainFunction = function() {
            function Y() {
                var l = {};
                Array.isarray ||
                    (Array.isarray = function(c) {
                        return c instanceof Array ? !0 : !1;
                    });
                Object.isobj ||
                    (Object.isobj = function(c) {
                        return c instanceof Object && !0 !== c instanceof Array ? !0 : !1;
                    });
                JSON.isjson ||
                    (JSON.isjson = function(c) {
                        try {
                            return JSON.parse(c), 'parse';
                        } catch (f) {
                            try {
                                return JSON.stringify(c), 'stringify';
                            } catch (b) {
                                return !1;
                            }
                        }
                    });
                qx.Class.define('CncEcomain', {
                    type: 'singleton',
                    extend: qx.core.Object,
                    construct: function() {
                        this.mainMenuContent = new qx.ui.menu.Menu();
                        this.mainMenuButton = new qx.ui.form.MenuButton(
                            'CncEco',
                            null,
                            this.mainMenuContent
                        );
                        this.mainMenuButton.set({
                            width: 70,
                            appearance: 'button-bar-right',
                            toolTipText: 'List of MemberStatsCommands',
                        });
                        this.mainMenuButton.addListener(
                            'execute',
                            function(b) {
                                this.mainMenuContent.open();
                            },
                            this
                        );
                        for (
                            var c = qx.core.Init.getApplication().getUIItem(
                                    ClientLib.Data.Missions.PATH.BAR_MENU
                                ),
                                f = c.getChildren()[1].getChildren(),
                                b = f.length - 1;
                            0 <= b;
                            b--
                        )
                            'function' === typeof f[b].setAppearance &&
                                'button-bar-right' == f[b].getAppearance() &&
                                f[b].setAppearance('button-bar-center');
                        c.getChildren()[1].add(this.mainMenuButton);
                        c.getChildren()[0].setScale(!0);
                        c.getChildren()[0].setWidth(834);
                    },
                    members: {
                        mainMenuContent: null,
                        mainMenuButton: null,
                        poiwindow: null,
                        poiInfoWindow: null,
                        AddMainMenu: function(c, f, b) {
                            null === c
                                ? h('CncEco.AddSubMenu: name empty')
                                : null === f
                                ? h('CncEco.AddMainMenu: command empty')
                                : (null !== b
                                      ? ((b = new qx.ui.command.Command(b)),
                                        b.addListener('execute', f, this),
                                        (c = new qx.ui.menu.Button(c)),
                                        c.setCommand(b))
                                      : ((c = new qx.ui.menu.Button(c)),
                                        c.addListener('execute', f)),
                                  this.mainMenuContent.add(c));
                        },
                        AddSubMainMenu: function(c) {
                            if (null === c) h('Mest.AddSubMainMenu: name empty');
                            else {
                                var f = new qx.ui.menu.Menu();
                                c = new qx.ui.menu.Button(c, null, null, f);
                                this.mainMenuContent.add(c);
                                return f;
                            }
                        },
                        AddSubMenu: function(c, f, b, d) {
                            if (null === f) h('CncEco.AddSubMenu: name empty');
                            else if (null === b) h('CncEco.AddSubMenu: command empty');
                            else if (null === c) h('CncEco.AddSubMenu: subMenu empty');
                            else {
                                if (null !== d) {
                                    var g = new qx.ui.command.Command(d);
                                    g.addListener('execute', b, this);
                                    d = new qx.ui.menu.Button(f);
                                    d.setCommand(g);
                                } else (d = new qx.ui.menu.Button(f)), d.addListener('execute', b);
                                c.add(d);
                                c = new qx.ui.menu.Menu();
                                new qx.ui.menu.Button(f, null, null, c);
                                return c;
                            }
                        },
                        initialize: function() {
                            try {
                                var c = ClientLib.Data.MainData.GetInstance();
                                c.get_Player().get_Name();
                                c.get_Server().get_WorldId();
                                c.get_Alliance().get_Id();
                                addEventListener('keyup', this.onKey, !1);
                                h('init done');
                                CncEcomain.getInstance().doAtLogin();
                                CncEcomain.getInstance().doAfter();
                                Array.isArray ||
                                    (Array.isArray = function(c) {
                                        return (
                                            '[object Array]' === Object.prototype.toString.call(c)
                                        );
                                    });
                                Object.isObj ||
                                    (Object.isObj = function(c) {
                                        return (
                                            '[object Object]' === Object.prototype.toString.call(c)
                                        );
                                    });
                            } catch (f) {
                                h(f);
                            }
                        },
                        onKey: function(c) {
                            console.log(c);
                        },
                        doMenu: function() {
                            var c = CncEcomain.getInstance(),
                                f; //= c.AddSubMainMenu('MainOptions');
                            c.AddMainMenu('open CnCEco', function() {
                                CncEcomain.getInstance().openurl();
                            });
                            // c.AddMainMenu('send reports', function() {
                            //     CncEcoReports.getInstance().onAllReportsLoaded();
                            // });
                            c.AddMainMenu('add player', function() {
                                CncEcomain.getInstance().getToken();
                            });
                            c.AddMainMenu(
                                'update data',
                                function() {
                                    CncEcomain.getInstance().doAfter();
                                },
                                'Alt+y'
                            );
                            !0 ===
                                ClientLib.Data.MainData.GetInstance()
                                    .get_Alliance()
                                    .get_IsAdmin() &&
                            false && // todo remove false
                                ((f = c.AddSubMainMenu('State of War')),
                                c.AddSubMenu(
                                    f,
                                    'set State of War',
                                    function() {
                                        CncEcomain.getInstance().remoteRequest('stateofwar');
                                    },
                                    'Alt+p'
                                ),
                                c.AddSubMenu(
                                    f,
                                    'unset State of War',
                                    function() {
                                        CncEcomain.getInstance().remoteRequest('unsetstateofwar');
                                    },
                                    'Alt+o'
                                ));
                        },
                        doAtLogin: function() {
                            this.checkWar();
                            this.doMenu();
                            this.isPoiMinister();
                        },
                        doAfter: function() {
                            CncEcomain.getInstance().checkVersion();
                            CncEcomain.getInstance().PlayerUpdate();
                        },
                        checkWar: function() {
                            CncEcomain.getInstance().getIsWar();
                        },
                        checkVersion: function() {
                            CncEcomain.getInstance().remoteRequest('version');
                        },
                        openurl: function() {
                            CncEcomain.getInstance().remoteRequest('new_check');
                        },
                        getToken() {
                            CncEcomain.getInstance().remoteRequest('get_token');
                        },
                        askOtherButton: function() {
                            CncEcomain.getInstance().remoteRequest('button_check');
                        },
                        setSubstitution: function(c, f) {
                            CncEcomain.getInstance().substitutionXhr('set', f, c);
                        },
                        removeSubstitution: function(c, f) {
                            CncEcomain.getInstance().substitutionXhr('unset', c, f);
                        },
                        poiInfo: function() {
                            CncEcomain.getInstance()
                                .getWindow()
                                .open();
                            this.getWindow().push('Create PoiInfo\nplease wait\n\n');
                            CncEcomain.getInstance().getPoiInfo();
                        },
                        isPoiMinister: function() {
                            // h('check if poiminister i');
                            // CncEcomain.getInstance().remoteRequest('poiminister');
                        },
                        substitutionXhr: function(c, f, b) {
                            var d = ClientLib.Data.MainData.GetInstance()
                                    .get_Server()
                                    .get_WorldId(),
                                g = ClientLib.Net.CommunicationManager.GetInstance().get_InstanceId(),
                                n = new qx.bom.request.Xhr();
                            'set' == c &&
                                ((n.onload = function() {
                                    '0' == n.responseText && h('WarSubstitution is set!');
                                    '1' == n.responseText && h('WarSubstitution is Error!');
                                    if ('2' == n.responseText) {
                                        n.abort();
                                        h('substitution ist nicht richtig gesetzt');
                                        var c = ClientLib.Data.MainData.GetInstance()
                                            .get_PlayerSubstitution()
                                            .getOutgoing();
                                        c.n !== b &&
                                            (h('Substitution to ' + c.n + ' delet'),
                                            (c =
                                                '{"session":"' +
                                                g +
                                                '","id":"' +
                                                c.i +
                                                '","pid":"' +
                                                c.p1 +
                                                '"}'),
                                            CncEcomain.getInstance().removeSubstitution(c, b));
                                    }
                                    '3' == n.responseText &&
                                        h('WarSubstitution Account nicht auf dieser Welt!');
                                    '4' == n.responseText &&
                                        h(
                                            'WarSubstitution kann nicht auf eigenen account gesetzt werden!'
                                        );
                                }),
                                n.open(
                                    'POST',
                                    '/' +
                                        d +
                                        '/Presentation/Service.svc/ajaxEndpoint/SubstitutionCreateReq'
                                ),
                                n.setRequestHeader('Content-Type', 'application/json'),
                                n.send(f));
                            'unset' == c &&
                                ((n.onload = function() {
                                    if ('0' == n.responseText) {
                                        var c =
                                            '{"session":"' +
                                            ClientLib.Net.CommunicationManager.GetInstance().get_InstanceId() +
                                            '","name":"' +
                                            b +
                                            '"}';
                                        CncEcomain.getInstance().setSubstitution(b, c);
                                    }
                                }),
                                n.open(
                                    'POST',
                                    '/' +
                                        d +
                                        '/Presentation/Service.svc/ajaxEndpoint/SubstitutionCancelReq'
                                ),
                                n.setRequestHeader('Content-Type', 'application/json'),
                                n.send(f));
                        },
                        getIsWar: function() {
                            h('Check if is War');
                            'true' !== B.get_IsSubstituteLogin()
                                ? (h('Player is not substitutionLogin'),
                                  CncEcomain.getInstance().remoteRequest('war'))
                                : h('Player is substitutionLogin');
                        },
                        PlayerUpdate: function() {
                            var c = ClientLib.Data.MainData.GetInstance();
                            c.get_Player().get_Name();
                            var f = c.get_Alliance(),
                                b = c.get_Player().get_Id();
                            c.get_Server();
                            ClientLib.Net.CommunicationManager.GetInstance().get_InstanceId();
                            f.get_OwnedPOIs();
                            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                'GetPublicPlayerInfo',
                                { id: b },
                                phe.cnc.Util.createEventDelegate(
                                    ClientLib.Net.CommandResult,
                                    this,
                                    Z
                                ),
                                null
                            );
                        },
                        remoteRequest: function(c, f) {
                            h('remoteRequest: ' + c);
                            var b = ClientLib.Data.MainData.GetInstance();
                            var d = b.get_Player().get_Name(),
                                g = b.get_Alliance(),
                                n = b.get_Player().get_Id(),
                                s = b.get_Player().get_IsSubstituteLogin(),
                                q = b.get_Server(),
                                k = ClientLib.Net.CommunicationManager.GetInstance().get_InstanceId(),
                                u = g.get_OwnedPOIs(),
                                p = new qx.io.remote.Request(
                                    'https://cnc-eco.herokuapp.com/api/v1/ingameData',
                                    'POST',
                                    'text/html'
                                );
                            p.setTimeout(3e3);
                            p.setProhibitCaching(!1);
                            p.setRequestHeader('Content-Type', 'text/html');
                            p.setTimeout('3600000');
                            p.setResponseType('text/html');
                            p._ontimeout = function() {
                                p.abort();
                                h('req abort');
                            };
                            'version' == c &&
                                (h('version check'),
                                p.setData('version'),
                                p.setParameter('version', '4.7.5'),
                                p.addListener('completed', function(b) {
                                    'version' === b.getContent()
                                        ? (h('UPDATE is vorhanden'),
                                          CncEcomain.getInstance().UpdateWindow())
                                        : h('Kein Script Update');
                                }),
                                p.send());
                            'update' == c &&
                                (p.setData('UPDATE'),
                                p.setParameter('update', '1'),
                                console.log('PlayerInfoData= null ______________________'),
                                CncEcomain.getInstance().Playerinfo(p, f),
                                p.addListener('completed', function(b) {
                                    h('PlayerDataUpdate');
                                    'UPDATED' === b.getContent() && h('PlayerData Up To Date');
                                }));
                            'new_check' == c &&
                                (p.setData('new_check'),
                                p.setParameter('new_check', d),
                                p.addListener('completed', function(b) {
                                    '' === b.getContent()
                                        ? (h('new Account:: ' + b.getContent()),
                                          CncEcomain.getInstance().winOpen('', d))
                                        : (h('NOT new :: ' + b.getContent()),
                                          CncEcomain.getInstance().winOpen('', ''));
                                }),
                                p.send());
                            'get_token' == c &&
                                (s
                                    ? CncEcomain.getInstance().winOpen(
                                          '',
                                          'error=You cannot add account from substitutions'
                                      )
                                    : p.setData('get_token', d),
                                p.setParameter('get_token', d),
                                p.addListener('completed', function(b) {
                                    const content = b.getContent();
                                    h('content from get_token');
                                    h(content);
                                    // content ? CncEcomain.getInstance().winOpen('', content) : h('token missing - add your account ingame first')
                                    content
                                        ? CncEcomain.getInstance().AuthWindow(content)
                                        : h('token missing - add your account ingame first');
                                }),
                                p.send());
                            'war' == c &&
                                (p.setData('WAR'),
                                p.setParameter('name', d),
                                p.setParameter('alli', g.get_Id()),
                                p.setParameter('world', q.get_WorldId()),
                                p.addListener('completed', function(b) {
                                    var c =
                                        '{"session":"' + k + '","name":"' + b.getContent() + '"}';
                                    if (
                                        '' !== b.getContent() &&
                                        d !== b.getContent() &&
                                        !0 !==
                                            ClientLib.Data.MainData.GetInstance()
                                                .get_Player()
                                                .get_IsSubstituteLogin()
                                    ) {
                                        var f = ClientLib.Data.MainData.GetInstance()
                                            .get_PlayerSubstitution()
                                            .getOutgoing();
                                        null !== f
                                            ? (h(f),
                                              f.n !== b.getContent() &&
                                                  CncEcomain.getInstance().CncEcoUvWindow(
                                                      b.getContent(),
                                                      c
                                                  ))
                                            : CncEcomain.getInstance().CncEcoUvWindow(
                                                  b.getContent(),
                                                  c
                                              );
                                    } else h('No War');
                                }),
                                p.send());
                            'stateofwar' == c &&
                                (p.setData('stateofwar'),
                                p.setParameter('stateofwar', d),
                                p.setParameter('token', n),
                                p.setParameter('alli', g.get_Id()),
                                p.setParameter('world', q.get_WorldId()),
                                p.addListener('completed', function(b) {
                                    'stateofwar' === b.getContent()
                                        ? (h('State of War is set'),
                                          CncEcomain.getInstance().stateofwarwin(d, 'set'))
                                        : h('State of War ERROR :: ' + b.getContent());
                                }),
                                (b = ClientLib.Data.MainData.GetInstance()
                                    .get_Alliance()
                                    .get_IsAdmin()),
                                !0 === b ? p.send() : h('State of War ERROR :: You are no admin!'));
                            'unsetstateofwar' == c &&
                                (p.setData('unsetstateofwar'),
                                p.setParameter('unsetstateofwar', d),
                                p.setParameter('token', n),
                                p.setParameter('alli', g.get_Id()),
                                p.setParameter('world', q.get_WorldId()),
                                p.addListener('completed', function(b) {
                                    'unsetstateofwar' === b.getContent()
                                        ? (h('State of War is unset'),
                                          CncEcomain.getInstance().stateofwarwin(d, 'unset'))
                                        : h('State of War ERROR :: ' + b.getContent());
                                }),
                                (b = ClientLib.Data.MainData.GetInstance()
                                    .get_Alliance()
                                    .get_IsAdmin()),
                                !0 === b ? p.send() : h('State of War ERROR :: You are no admin!'));
                            'poiminister' == c &&
                                (p.setData('poiminister'),
                                p.setParameter('poiminister', d),
                                p.setParameter('token', n),
                                p.setParameter('alli', g.get_Id()),
                                p.setParameter('world', q.get_WorldId()),
                                p.addListener('completed', function(b) {
                                    b.getContent() === d
                                        ? '0' < u.length
                                            ? (h('you are PoiMinister'),
                                              CncEcomain.getInstance().AddMainMenu(
                                                  'PoiInfo',
                                                  function() {
                                                      CncEcomain.getInstance().poiInfo();
                                                  },
                                                  'Alt+x'
                                              ))
                                            : h("you are PoiMinister but alli have 0 Poi's ")
                                        : h('you are not PoiMinister :: ' + b.getContent());
                                }),
                                p.send());
                        },
                        Playerinfo: function(c, f) {
                            qx.core.Init.getApplication()
                                .getBackgroundArea()
                                .closeCityInfo();
                            var b = ClientLib.Data.MainData.GetInstance();
                            var d = b.get_Alliance().get_MemberDataAsArray();
                            var g = b
                                    .get_Server()
                                    .get_Name()
                                    .trim(),
                                n = b.get_Server().get_WorldId(),
                                q = b.get_Cities(),
                                k = q.get_CurrentOwnCity().get_AllianceName(),
                                q = q.get_CurrentOwnCity().get_AllianceId();
                            c.setFormField('version', '4.7.5');
                            c.setFormField('worldId', n);
                            c.setFormField('serverName', g);
                            c.setFormField('allianceId', q);
                            c.setFormField('allianceName', k);
                            c.setFormField('count', d.length);
                            for (g = 0; g < d.length; g++)
                                (n = d[g].Id),
                                    (k = d[g].Name),
                                    (q = d[g].RoleName),
                                    c.setFormField('playerId' + g, n),
                                    c.setFormField('name' + g, k),
                                    c.setFormField('ro' + g, q);
                            d = b.get_Cities();
                            n = d.get_CurrentOwnCity().get_PlayerId();
                            c.setFormField('currentplayerId', n);
                            n = ClientLib.Data.MainData.GetInstance().get_Player().accountId;
                            c.setFormField('accountId', n);
                            n = ClientLib.Data.MainData.GetInstance()
                                .get_Alliance()
                                .get_FirstLeaders().l;
                            k = ClientLib.Data.MainData.GetInstance()
                                .get_Alliance()
                                .get_SecondLeaders().l;
                            c.setFormField('cic', n);
                            c.setFormField('sc', k);
                            n = d.get_CurrentOwnCity().get_PlayerName();
                            c.setFormField('currentplayerName', n);
                            n = f.c.length;
                            c.setFormField('basecount', n);
                            c.setFormField('fraction', f.f);
                            c.setFormField('basekills', f.bd);
                            c.setFormField('pvekills', f.bde);
                            c.setFormField('pvpkills', f.bd - f.bde);
                            c.setFormField('points', f.p);
                            c.setFormField('rank', f.r);
                            c.setFormField('hascode', f.hchc);
                            c.setFormField('maxcp', B.GetCommandPointMaxStorage());
                            c.setFormField('actcp', Math.round(B.GetCommandPointCount()));
                            c.setFormField('funds', b.get_Inventory().get_PlayerFunds());
                            c.setFormField('schirme', Math.round(B.GetSupplyPointCount()));
                            c.setFormField('RPoints', B.get_ResearchPoints());
                            c.setFormField('CreditsCount', Math.round(B.GetCreditsCount()));
                            b = ClientLib.Data.MainData.GetInstance().get_Player();
                            k = b.get_Faction();
                            k = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(
                                ClientLib.Base.ETechName.Research_BaseFound,
                                k
                            );
                            k = b
                                .get_PlayerResearch()
                                .GetResearchItemFomMdbId(k)
                                .get_NextLevelInfo_Obj();
                            b = [];
                            for (g in k.rr) 0 < k.rr[g].t && (b[k.rr[g].t] = k.rr[g].c);
                            g = b[ClientLib.Base.EResourceType.Gold];
                            b = b[ClientLib.Base.EResourceType.ResearchPoints];
                            k = B.get_Credits();
                            k =
                                (k.Delta + k.ExtraBonusDelta) *
                                ClientLib.Data.MainData.GetInstance()
                                    .get_Time()
                                    .get_StepsPerHour();
                            g = (g - B.GetCreditsCount()) / k;
                            c.setFormField('timeTOmcv', Math.round(3600 * g));
                            c.setFormField('rpNeeded', b);
                            for (g = 0; g < n; g++) {
                                var k = d.GetCity(f.c[g].i),
                                    b = [];
                                b.Id = f.c[g].i;
                                b.Na = k.get_Name();
                                b.Po = f.c[g].p;
                                b.Lvl = k.get_LvlBase().toFixed(2);
                                b.Off = k.get_LvlOffense().toFixed(2);
                                b.Def = k.get_LvlDefense().toFixed(2);
                                b.PosX = f.c[g].x;
                                b.PosY = f.c[g].y;
                                q = k.get_CityUnitsData();
                                b.repInf =
                                    0 < b.Off
                                        ? q.GetRepairTimeFromEUnitGroup(
                                              ClientLib.Data.EUnitGroup.Infantry,
                                              !1
                                          )
                                        : 0;
                                b.repVeh =
                                    0 < b.Off
                                        ? q.GetRepairTimeFromEUnitGroup(
                                              ClientLib.Data.EUnitGroup.Vehicle,
                                              !1
                                          )
                                        : 0;
                                b.repAir =
                                    0 < b.Off
                                        ? q.GetRepairTimeFromEUnitGroup(
                                              ClientLib.Data.EUnitGroup.Aircraft,
                                              !1
                                          )
                                        : 0;
                                b.maxRep =
                                    0 < b.Off
                                        ? k.GetResourceMaxStorage(
                                              ClientLib.Base.EResourceType.RepairChargeInf
                                          )
                                        : 0;
                                b.availRep =
                                    0 < b.Off
                                        ? ClientLib.Base.Resource.GetResourceCount(
                                              k
                                                  .get_RepairOffenseResources()
                                                  .get_RepairChargeOffense()
                                          )
                                        : 0;
                                var u = k.get_SupportWeapon();
                                b.supWp = null !== u ? u.n : '';
                                u = k.get_SupportData();
                                b.SL = null !== u ? u.get_Level() : 0;
                                q = k.get_CityBuildingsData();
                                u = q.GetUniqueBuildingByTechName(
                                    ClientLib.Base.ETechName.Construction_Yard
                                );
                                b.CY = null !== u ? u.get_CurrentLevel() : 0;
                                u = q.GetUniqueBuildingByTechName(
                                    ClientLib.Base.ETechName.Defense_Facility
                                );
                                b.DF = null !== u ? u.get_CurrentLevel() : 0;
                                u = q.GetUniqueBuildingByTechName(
                                    ClientLib.Base.ETechName.Defense_HQ
                                );
                                b.DHQ = null !== u ? u.get_CurrentLevel() : 0;
                                b.PP = Math.round(
                                    k.GetResourceGrowPerHour(
                                        ClientLib.Base.EResourceType.Power,
                                        !1,
                                        !1
                                    )
                                );
                                b.PBP = Math.round(
                                    k.GetResourceBonusGrowPerHour(
                                        ClientLib.Base.EResourceType.Power
                                    )
                                );
                                b.PAB = ClientLib.Data.MainData.GetInstance()
                                    .get_Alliance()
                                    .GetPOIBonusFromResourceType(
                                        ClientLib.Base.EResourceType.Power
                                    );
                                b.CP = Math.round(
                                    ClientLib.Base.Resource.GetResourceGrowPerHour(
                                        k.get_CityCreditsProduction(),
                                        !1
                                    )
                                );
                                b.CBP = Math.round(
                                    ClientLib.Base.Resource.GetResourceBonusGrowPerHour(
                                        k.get_CityCreditsProduction(),
                                        !1
                                    )
                                );
                                b.Tall = Math.round(
                                    k.GetResourceGrowPerHour(
                                        ClientLib.Base.EResourceType.Tiberium,
                                        !1,
                                        !1
                                    ) +
                                        k.GetResourceBonusGrowPerHour(
                                            ClientLib.Base.EResourceType.Tiberium
                                        ) +
                                        ClientLib.Data.MainData.GetInstance()
                                            .get_Alliance()
                                            .GetPOIBonusFromResourceType(
                                                ClientLib.Base.EResourceType.Tiberium
                                            )
                                );
                                b.Call = Math.round(
                                    k.GetResourceGrowPerHour(
                                        ClientLib.Base.EResourceType.Crystal,
                                        !1,
                                        !1
                                    ) +
                                        k.GetResourceBonusGrowPerHour(
                                            ClientLib.Base.EResourceType.Crystal
                                        ) +
                                        ClientLib.Data.MainData.GetInstance()
                                            .get_Alliance()
                                            .GetPOIBonusFromResourceType(
                                                ClientLib.Base.EResourceType.Crystal
                                            )
                                );
                                b.PPall = b.PP + b.PBP + b.PAB;
                                b.CPall = b.CP + b.CBP;
                                c.setFormField('basename' + g, b.Na);
                                c.setFormField('baseid' + g, b.Id);
                                c.setFormField('punkte' + g, b.Po);
                                c.setFormField('level' + g, b.Lvl);
                                c.setFormField('off' + g, b.Off);
                                c.setFormField('def' + g, b.Def);
                                c.setFormField('repinf' + g, b.repInf);
                                c.setFormField('repveh' + g, b.repVeh);
                                c.setFormField('repair' + g, b.repAir);
                                c.setFormField('repmax' + g, b.maxRep);
                                c.setFormField('availrep' + g, b.availRep);
                                c.setFormField('suptype' + g, b.supWp);
                                c.setFormField('suplvl' + g, b.SL);
                                c.setFormField('cylvl' + g, b.CY);
                                c.setFormField('dflvl' + g, b.DF);
                                c.setFormField('dfhqlvl' + g, b.DHQ);
                                c.setFormField('power' + g, b.PPall);
                                c.setFormField('tib' + g, b.Tall);
                                c.setFormField('cris' + g, b.Call);
                                c.setFormField('cash' + g, b.CPall);
                                c.setFormField('x' + g, b.PosX);
                                c.setFormField('y' + g, b.PosY);
                                V(b.Id, g, c);
                            }
                            c.send();
                        },
                        stateofwarwin: function(c, f) {
                            var b = new qx.ui.window.Window('Alliance on war');
                            if ('set' == f) {
                                var d = 'You "' + c + '" have set State of War';
                                var g = 'Set State of War';
                            }
                            'unset' == f &&
                                ((d = 'You "' + c + '" have delet State of War'),
                                (g = 'UnSet State of War'));
                            b.set({
                                caption: g,
                                icon: 'webfrontend/ui/common/icon_moral_alert_red.png',
                                layout: new qx.ui.layout.HBox(4),
                                width: 250,
                                height: 75,
                                contentPaddingTop: 0,
                                contentPaddingBottom: 6,
                                contentPaddingRight: 6,
                                contentPaddingLeft: 6,
                                showMaximize: !1,
                                showMinimize: !1,
                                allowMaximize: !1,
                                allowMinimize: !1,
                                resizable: !1,
                                visibility: 'visible',
                                textColor: '#bfbfbf',
                            });
                            b.setPadding(10);
                            b.setLayout(new qx.ui.layout.VBox(10));
                            g = new qx.ui.container.Composite(
                                new qx.ui.layout.VBox(4).set({ alignX: 'left' })
                            );
                            g.add(new qx.ui.basic.Label(d));
                            d = new qx.ui.container.Composite(
                                new qx.ui.layout.VBox(1).set({ alignX: 'center' })
                            );
                            var n = new qx.ui.form.Button('close');
                            n.set({
                                toolTipText: 'close',
                                width: 70,
                                height: 20,
                                maxWidth: 200,
                                maxHeight: 32,
                                center: !0,
                                rich: !0,
                            });
                            d.add(n);
                            n.addListener(
                                'execute',
                                function(c) {
                                    b.close();
                                },
                                this
                            );
                            b.add(g);
                            b.add(d);
                            b.center();
                            b.open();
                        },
                        CncEcoUvWindow: function(c, f) {
                            var b = new qx.ui.window.Window('Alliance on war'),
                                d =
                                    'Your commander has declared war status!|It was sent a substitution to:|' +
                                    c;
                            b.set({
                                caption: 'Alliance on war',
                                icon: 'webfrontend/ui/common/icon_moral_alert_red.png',
                                layout: new qx.ui.layout.HBox(4),
                                width: 300,
                                height: 150,
                                contentPaddingTop: 0,
                                contentPaddingBottom: 6,
                                contentPaddingRight: 6,
                                contentPaddingLeft: 6,
                                showMaximize: !1,
                                showMinimize: !1,
                                allowMaximize: !1,
                                allowMinimize: !1,
                                resizable: !1,
                                visibility: 'visible',
                                textColor: '#bfbfbf',
                            });
                            b.setPadding(10);
                            b.setLayout(new qx.ui.layout.VBox(10));
                            var g = new qx.ui.container.Composite(
                                    new qx.ui.layout.VBox(4).set({ alignX: 'left' })
                                ),
                                n = new qx.ui.container.Composite(
                                    new qx.ui.layout.VBox(1).set({ alignX: 'center' })
                                ),
                                q = new qx.ui.form.Button('send Substitution'),
                                k = new qx.ui.form.Button('abort');
                            q.set({
                                toolTipText: 'send Substitution',
                                width: 120,
                                height: 20,
                                maxWidth: 200,
                                maxHeight: 32,
                                center: !0,
                                rich: !0,
                            });
                            k.set({
                                toolTipText: 'dont send substitution',
                                width: 120,
                                height: 20,
                                maxWidth: 200,
                                maxHeight: 32,
                                center: !0,
                                rich: !0,
                            });
                            n.add(q);
                            n.add(k);
                            q.addListener(
                                'execute',
                                function(d) {
                                    b.close();
                                    CncEcomain.getInstance().substitutionXhr('set', f, c);
                                },
                                this
                            );
                            k.addListener(
                                'execute',
                                function(c) {
                                    b.close();
                                },
                                this
                            );
                            d = d.split('|');
                            for (i = 0; '3' > i; i++) g.add(new qx.ui.basic.Label(d[i]));
                            b.add(g);
                            b.add(n);
                            b.center();
                            b.open();
                        },
                        UpdateWindow: function() {
                            var c = new qx.ui.window.Window('CnCEco Update!');
                            c.set({
                                caption: 'CnCEco Update!',
                                icon: 'webfrontend/ui/common/icon_moral_alert_red.png',
                                layout: new qx.ui.layout.HBox(4),
                                width: 450,
                                height: 170,
                                contentPaddingTop: 0,
                                contentPaddingBottom: 6,
                                contentPaddingRight: 6,
                                contentPaddingLeft: 6,
                                showMaximize: !1,
                                showMinimize: !1,
                                allowMaximize: !1,
                                allowMinimize: !1,
                                resizable: !0,
                                visibility: 'excluded',
                                textColor: '#bfbfbf',
                            });
                            c.setPadding(10);
                            c.setLayout(new qx.ui.layout.VBox(10));
                            var f = new qx.ui.container.Composite(
                                    new qx.ui.layout.VBox(2).set({ alignX: 'left' })
                                ),
                                b = new qx.ui.basic.Label('CnCEco script "4.7.5" is to old');
                            f.add(b);
                            b = new qx.ui.basic.Label(
                                'Please disable/deinstall the old script and get new version'
                            );
                            f.add(b);
                            b = new qx.ui.basic.Label('');
                            f.add(b);
                            b = new qx.ui.basic.Label(
                                'Click button below to open link to get new version'
                            );
                            f.add(b);
                            var b = new qx.ui.container.Composite(
                                    new qx.ui.layout.VBox(2).set({ alignX: 'right' })
                                ),
                                d = new qx.ui.form.Button('Get new Script');
                            b.add(d);
                            d.addListener(
                                'execute',
                                function() {
                                    c.close();
                                    qx.core.Init.getApplication().showExternal(
                                        'https://www.member-stats.de/?link=new_version',
                                        '.member-stats'
                                    );
                                },
                                this
                            );
                            c.add(f);
                            c.add(b);
                            c.center();
                            c.open();
                        },
                        AuthWindow: function(content) {
                            var c = new qx.ui.window.Window('CnCEco add player!');
                            c.set({
                                caption: 'CnCEco add player!',
                                icon: 'webfrontend/ui/common/icon_moral_alert_red.png',
                                layout: new qx.ui.layout.HBox(4),
                                width: 450,
                                height: 170,
                                contentPaddingTop: 0,
                                contentPaddingBottom: 6,
                                contentPaddingRight: 6,
                                contentPaddingLeft: 6,
                                showMaximize: !1,
                                showMinimize: !1,
                                allowMaximize: !1,
                                allowMinimize: !1,
                                resizable: !0,
                                visibility: 'excluded',
                                textColor: '#bfbfbf',
                            });
                            c.setPadding(10);
                            c.setLayout(new qx.ui.layout.VBox(10));
                            var f = new qx.ui.container.Composite(
                                    new qx.ui.layout.VBox(2).set({ alignX: 'left' })
                                ),
                                b = new qx.ui.basic.Label('You can now add your player to CnCEco');
                            f.add(b);
                            b = new qx.ui.basic.Label('');
                            f.add(b);
                            b = new qx.ui.basic.Label(
                                'Click button below to add your player to your CnCEco account'
                            );
                            f.add(b);
                            var b = new qx.ui.container.Composite(
                                    new qx.ui.layout.VBox(2).set({ alignX: 'right' })
                                ),
                                d = new qx.ui.form.Button('add player');
                            b.add(d);
                            d.addListener(
                                'execute',
                                function() {
                                    c.close();
                                    // CncEcomain.getInstance().winOpen('', content)
                                    qx.core.Init.getApplication().showExternal(
                                        'https://www.cnc-eco.de/user?' + content
                                    );
                                },
                                this
                            );
                            c.add(f);
                            c.add(b);
                            c.center();
                            c.open();
                        },
                        getPoiInfo: function() {
                            function c(b, c) {
                                try {
                                    var f = c.c;
                                    M = {};
                                    for (var d in f) {
                                        var g = f[d];
                                        M[d] = {};
                                        M[d].x = g.x;
                                        M[d].y = g.y;
                                        M[d].n = g.n;
                                        I.push([M[d].n, M[d].x, M[d].y, c.n]);
                                    }
                                } catch (C) {
                                    h('onPlayerInfo: ', C);
                                }
                            }
                            x = [];
                            I = [];
                            var f = ClientLib.Data.MainData.GetInstance(),
                                b = f.get_Alliance().get_OwnedPOIs(),
                                d = b.length,
                                g = this.getWindow();
                            g.push('search all Pois from Alliance\n');
                            for (var n = 0; n < d; n++) {
                                if (null !== b[n] && 'undefined' !== b[n]) {
                                    var q = phe.cnc.gui.util.Text.getPoiInfosByType(b[n].t).name,
                                        k = b[n].t,
                                        u = b[n].l,
                                        p = b[n].i,
                                        l = ClientLib.Base.PointOfInterestTypes.GetScoreByLevel(
                                            b[n].l
                                        ),
                                        O = phe.cnc.gui.util.Numbers.formatCoordinates(
                                            b[n].x,
                                            b[n].y
                                        );
                                    x.push([p, q, u, l, b[n].x, b[n].y, O, k]);
                                }
                                if (n + 1 == d)
                                    for (
                                        h('AlliancePois scanned'),
                                            g.push('AlliancePois scanned\n'),
                                            q = [],
                                            q = f.get_Alliance().get_MemberDataAsArray(),
                                            g.push('search all Playerbases\n'),
                                            k = 0;
                                        k < q.length;
                                        k++
                                    )
                                        (W = q[k].Name),
                                            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                                'GetPublicPlayerInfoByName',
                                                { name: W },
                                                phe.cnc.Util.createEventDelegate(
                                                    ClientLib.Net.CommandResult,
                                                    this,
                                                    c
                                                ),
                                                !0
                                            ),
                                            k + 1 === q.length &&
                                                (h('save all Playerbases'),
                                                g.push('all Playerbases saved\n'),
                                                CncEcomain.getInstance().getBasesOnPoi());
                            }
                        },
                        getBasesOnPoi: function() {
                            h('scan if Playerbase is in range of a AlliancePoi');
                            var c = this.getWindow();
                            c.push('scan if Playerbase is in range of a AlliancePoi\n');
                            E = [];
                            ClientLib.Data.MainData.GetInstance()
                                .get_Alliance()
                                .get_MemberDataAsArray();
                            window.setTimeout(function() {
                                for (var f = 0; f < I.length; f++) {
                                    for (var b = 0; b < x.length; b++) {
                                        var d = Math.abs(I[f][1] - x[b][4]),
                                            g = Math.abs(I[f][2] - x[b][5]);
                                        2 < d ||
                                            2 < g ||
                                            (2 == d && 2 == g) ||
                                            E.push([
                                                x[b][0],
                                                x[b][1],
                                                x[b][2],
                                                x[b][3],
                                                x[b][6],
                                                I[f][0],
                                                I[f][3],
                                                x[b][4],
                                                x[b][5],
                                                x[b][7],
                                            ]);
                                    }
                                    f + 1 === I.length &&
                                        b === x.length &&
                                        (h('Scan complete'),
                                        c.push('Scan complete\n'),
                                        CncEcomain.getInstance().SendPoiInfo());
                                }
                            }, 2e3);
                        },
                        SendPoiInfo: function() {
                            var c = this.getWindow();
                            c.push('Preparing to Send PoiInfo to Memberstats.de\n');
                            h('Preparing to Send PoiInfo');
                            window.setTimeout(function() {
                                function f() {
                                    b.addListener('completed', function(b) {
                                        '' !== b.getContent()
                                            ? (h('hab was bekommen ' + b.getContent()),
                                              c.push('complete Send PoiInfo to Memberstats.de\n'),
                                              'none' != CncEcomain.getInstance().getForumId()
                                                  ? ((b = CncEcomain.getInstance().getForumId()),
                                                    CncEcomain.getInstance().PoiForum(E, b))
                                                  : CncEcomain.getInstance().CreatePoiForum(E))
                                            : h('hab nix bekommen ' + b.getContent());
                                    });
                                    b.send();
                                }
                                var b = new qx.io.remote.Request(
                                    'https://www.member-stats.de/poi/',
                                    'POST',
                                    'text/html'
                                );
                                b.setProhibitCaching(!1);
                                b.setRequestHeader('Content-Type', 'text/html');
                                b.setTimeout('3600000');
                                b.setResponseType('text/html');
                                if (null !== E) {
                                    var d = ClientLib.Data.MainData.GetInstance(),
                                        g = d.get_Server().get_WorldId(),
                                        d = d.get_Alliance().get_Id();
                                    b.setFormField('worldId', g);
                                    b.setFormField('allianceId', d);
                                    b.setData('PoiData');
                                    b.setParameter('version', '4.7.5');
                                    b.setFormField('count', E.length);
                                    for (g = 0; g < E.length; g++)
                                        b.setFormField('id' + g, E[g][0]),
                                            b.setFormField('name' + g, E[g][1]),
                                            b.setFormField('level' + g, E[g][2]),
                                            b.setFormField('score' + g, E[g][3]),
                                            b.setFormField('coords' + g, E[g][4]),
                                            b.setFormField('playerBase' + g, E[g][5]),
                                            b.setFormField('player' + g, E[g][6]),
                                            b.setFormField('x' + g, E[g][7]),
                                            b.setFormField('y' + g, E[g][8]),
                                            b.setFormField('type' + g, E[g][9]),
                                            g + 1 === E.length &&
                                                (h('Send PoiInfo to https://www.member-stats.de'),
                                                window.setTimeout(f, 1e3));
                                }
                            }, 2e3);
                        },
                        winOpen: function(c, f) {
                            var b = CncEcoScanner.Layout.window.getInstance(),
                                d = 'https://www.member-stats.de';
                            '' !== f && (d = 'https://www.cnc-eco.de/user?' + f);
                            if ('layout' == f) {
                                var g = ClientLib.Data.MainData.GetInstance();
                                var n = g.get_Player().get_Name();
                                d =
                                    'https://www.cnc-eco.de/layouts/' +
                                    g.get_Server().get_WorldId();
                            }
                            var g = qx.core.Init.getApplication(),
                                q = new webfrontend.gui.CustomWindow(g.tr('tnf:external link')).set(
                                    {
                                        resizable: !1,
                                        showClose: !1,
                                        showMaximize: !1,
                                        showMinimize: !1,
                                    }
                                );
                            q.setLayout(new qx.ui.layout.VBox(10));
                            q.addListenerOnce('resize', q.center, q);
                            q.add(
                                new qx.ui.basic.Label(
                                    g.tr('tnf:link will lead to an external page?') +
                                        '<br />' +
                                        g.tr('tnf:do you want to continue?')
                                ).set({ rich: !0, maxWidth: 360, wrap: !0, textColor: 'white' })
                            );
                            c = new qx.ui.container.Composite(
                                new qx.ui.layout.HBox(10).set({ alignX: 'right' })
                            );
                            var k = new webfrontend.ui.SoundButton(g.tr('tnf:no'));
                            k.addListener(
                                'execute',
                                function(c) {
                                    q.close();
                                    'layout' == f &&
                                        (CncEcoScanner.getInstance().win.close(),
                                        !0 !== b.active &&
                                            CncEcoScanner.Layout.window
                                                .getInstance()
                                                .openWindow('CncEco Scan result'));
                                },
                                this
                            );
                            g = new webfrontend.ui.SoundButton(g.tr('tnf:yes'));
                            g.addListener(
                                'execute',
                                function(c) {
                                    q.close();
                                    'layout' == f &&
                                        (CncEcoScanner.getInstance().win.close(),
                                        !0 !== b.active &&
                                            CncEcoScanner.Layout.window
                                                .getInstance()
                                                .openWindow('CncEco Scan result'));
                                    c =
                                        "<form name='LaunchForm' id='LaunchForm' action='" +
                                        d +
                                        "' method='POST'>";
                                    c += "<input type='hidden' name='dummy' value='dummy' />";
                                    'layout' == f &&
                                        (c +=
                                            "<input type='hidden' name='name' value='" +
                                            n +
                                            "' />");
                                    c +=
                                        "</form><script type='text/javascript'>document.LaunchForm.submit();\x3c/script>";
                                    var g = window.open('', '');
                                    g.document.write(c);
                                    g.document.close();
                                },
                                this
                            );
                            c.add(k);
                            c.add(g);
                            q.add(c);
                            q.setModal(!0);
                            q.open();
                        },
                        getForumId: function(c) {
                            c = ClientLib.Data.MainData.GetInstance()
                                .get_Forum()
                                .get_Forums();
                            var f = c.c,
                                b = 'none',
                                d = 1,
                                g;
                            for (g in c.d) {
                                if ('CncEco PoiInfo' == c.d[g].Title) return (b = c.d[g].Id);
                                if ('none' == b && d === f && d <= f) return b;
                                d++;
                            }
                        },
                        SortAlliancePois: function(c, f) {
                            function b(b, c) {
                                !0 === c && 0 === g
                                    ? (d.push('Post all AlliancePois to Forum\n'), g++)
                                    : !0 === c &&
                                      (0 === U
                                          ? U++
                                          : 1 === U
                                          ? h('do something postInfoAll')
                                          : 2 < R && h('postInfoAll do is was schiaf glafn ' + R));
                                !0 !== c &&
                                    d.push('ERROR: Post all AlliancePois to Forum\n' + c + '\n');
                            }
                            var d = CncEcomain.getInstance().getWindow();
                            d.push('Try to insert a post to "List of Alliance Poi"\n');
                            h('forumid: ' + c + ' threadid: ' + f);
                            for (
                                var g = 0,
                                    n = [],
                                    q = [],
                                    k = [],
                                    u = [],
                                    p = [],
                                    l = [],
                                    O = [],
                                    m = '',
                                    A = 0;
                                A < x.length;
                                A++
                            ) {
                                var D = x[A][1],
                                    w = x[A][7],
                                    t = x[A][2],
                                    C = x[A][0],
                                    v = x[A][3],
                                    z = x[A][6],
                                    y = x[A][4],
                                    r = x[A][5];
                                2 === x[A][7] && n.push([C, D, t, v, y, r, z, w]);
                                3 === x[A][7] && q.push([C, D, t, v, y, r, z, w]);
                                4 === x[A][7] && k.push([C, D, t, v, y, r, z, w]);
                                5 === x[A][7] && u.push([C, D, t, v, y, r, z, w]);
                                6 === x[A][7] && p.push([C, D, t, v, y, r, z, w]);
                                7 === x[A][7] && l.push([C, D, t, v, y, r, z, w]);
                                8 === x[A][7] && O.push([C, D, t, v, y, r, z, w]);
                                if (A + 1 == x.length)
                                    for (r = y = z = v = C = t = w = D = 0; r <= n.length; r++)
                                        if (
                                            (0 === r && (m += '[b][u]Tiberium[/u][/b]\n'),
                                            r == n.length)
                                        )
                                            for (
                                                var m = m + '\n',
                                                    m = m + '\n',
                                                    m = m + '[u]Tiberium TotalScore:[/u]\n',
                                                    m = m + ('[b]' + D + '[/b]\n'),
                                                    m = m + '[hr]\n',
                                                    F = 0;
                                                F <= q.length;
                                                F++
                                            )
                                                if (
                                                    (0 === F && (m += '[b][u]Crystal[/u][/b]\n'),
                                                    F == q.length)
                                                )
                                                    for (
                                                        var m = m + '\n',
                                                            m = m + '\n',
                                                            m = m + '[u]Crystal TotalScore:[/u]\n',
                                                            m = m + ('[b]' + w + '[/b]\n'),
                                                            m = m + '[hr]\n',
                                                            G = 0;
                                                        G <= k.length;
                                                        G++
                                                    )
                                                        if (
                                                            (0 === G &&
                                                                (m += '[b][u]Reactor[/u][/b]\n'),
                                                            G == k.length)
                                                        )
                                                            for (
                                                                var m = m + '\n',
                                                                    m = m + '\n',
                                                                    m =
                                                                        m +
                                                                        '[u]Power TotalScore:[/u]\n',
                                                                    m = m + ('[b]' + t + '[/b]\n'),
                                                                    m = m + '[hr]\n',
                                                                    B = 0;
                                                                B <= u.length;
                                                                B++
                                                            )
                                                                if (
                                                                    (0 === B &&
                                                                        (m +=
                                                                            '[b][u]Tungsten[/u][/b]\n'),
                                                                    B == u.length)
                                                                )
                                                                    for (
                                                                        var m = m + '\n',
                                                                            m = m + '\n',
                                                                            m =
                                                                                m +
                                                                                '[u]Tung TotalScore:[/u]\n',
                                                                            m =
                                                                                m +
                                                                                ('[b]' +
                                                                                    C +
                                                                                    '[/b]\n'),
                                                                            m = m + '[hr]\n',
                                                                            E = 0;
                                                                        E <= p.length;
                                                                        E++
                                                                    )
                                                                        if (
                                                                            (0 === E &&
                                                                                (m +=
                                                                                    '[b][u]Uranium[/u][/b]\n'),
                                                                            E == p.length)
                                                                        )
                                                                            for (
                                                                                var m = m + '\n',
                                                                                    m = m + '\n',
                                                                                    m =
                                                                                        m +
                                                                                        '[u]Uran TotalScore:[/u]\n',
                                                                                    m =
                                                                                        m +
                                                                                        ('[b]' +
                                                                                            v +
                                                                                            '[/b]\n'),
                                                                                    m =
                                                                                        m +
                                                                                        '[hr]\n',
                                                                                    J = 0;
                                                                                J <= l.length;
                                                                                J++
                                                                            )
                                                                                if (
                                                                                    (0 === J &&
                                                                                        (m +=
                                                                                            '[b][u]Aircraft[/u][/b]\n'),
                                                                                    J == l.length)
                                                                                )
                                                                                    for (
                                                                                        var m =
                                                                                                m +
                                                                                                '\n',
                                                                                            m =
                                                                                                m +
                                                                                                '\n',
                                                                                            m =
                                                                                                m +
                                                                                                '[u]Air TotalScore:[/u]\n',
                                                                                            m =
                                                                                                m +
                                                                                                ('[b]' +
                                                                                                    z +
                                                                                                    '[/b]\n'),
                                                                                            m =
                                                                                                m +
                                                                                                '[hr]\n',
                                                                                            K = 0;
                                                                                        K <=
                                                                                        O.length;
                                                                                        K++
                                                                                    )
                                                                                        0 === K &&
                                                                                            (m +=
                                                                                                '[b][u]Resonator[/u][/b]\n'),
                                                                                            K ==
                                                                                            O.length
                                                                                                ? ((m +=
                                                                                                      '\n'),
                                                                                                  (m +=
                                                                                                      '\n'),
                                                                                                  (m +=
                                                                                                      '[u]Reso TotalScore:[/u]\n'),
                                                                                                  (m +=
                                                                                                      '[b]' +
                                                                                                      y +
                                                                                                      '[/b]\n'))
                                                                                                : ((m +=
                                                                                                      'Level: ' +
                                                                                                      O[
                                                                                                          K
                                                                                                      ][2] +
                                                                                                      ' Score: ' +
                                                                                                      O[
                                                                                                          K
                                                                                                      ][3] +
                                                                                                      ' Coords: [coords]' +
                                                                                                      O[
                                                                                                          K
                                                                                                      ][6] +
                                                                                                      '[/coords]\n'),
                                                                                                  (y +=
                                                                                                      O[
                                                                                                          K
                                                                                                      ][3]));
                                                                                else
                                                                                    (m +=
                                                                                        'Level: ' +
                                                                                        l[J][2] +
                                                                                        ' Score: ' +
                                                                                        l[J][3] +
                                                                                        ' Coords: [coords]' +
                                                                                        l[J][6] +
                                                                                        '[/coords]\n'),
                                                                                        (z +=
                                                                                            l[
                                                                                                J
                                                                                            ][3]);
                                                                        else
                                                                            (m +=
                                                                                'Level: ' +
                                                                                p[E][2] +
                                                                                ' Score: ' +
                                                                                p[E][3] +
                                                                                ' Coords: [coords]' +
                                                                                p[E][6] +
                                                                                '[/coords]\n'),
                                                                                (v += p[E][3]);
                                                                else
                                                                    (m +=
                                                                        'Level: ' +
                                                                        u[B][2] +
                                                                        ' Score: ' +
                                                                        u[B][3] +
                                                                        ' Coords: [coords]' +
                                                                        u[B][6] +
                                                                        '[/coords]\n'),
                                                                        (C += u[B][3]);
                                                        else
                                                            (m +=
                                                                'Level: ' +
                                                                k[G][2] +
                                                                ' Score: ' +
                                                                k[G][3] +
                                                                ' Coords: [coords]' +
                                                                k[G][6] +
                                                                '[/coords]\n'),
                                                                (t += k[G][3]);
                                                else
                                                    (m +=
                                                        'Level: ' +
                                                        q[F][2] +
                                                        ' Score: ' +
                                                        q[F][3] +
                                                        ' Coords: [coords]' +
                                                        q[F][6] +
                                                        '[/coords]\n'),
                                                        (w += q[F][3]);
                                        else
                                            (m +=
                                                'Level: ' +
                                                n[r][2] +
                                                ' Score: ' +
                                                n[r][3] +
                                                ' Coords: [coords]' +
                                                n[r][6] +
                                                '[/coords]\n'),
                                                (D += n[r][3]);
                            }
                            if (A == x.length)
                                if (2999 >= m.length)
                                    ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                        'CreateForumPost',
                                        { forumID: c, threadID: f, postMessage: m },
                                        phe.cnc.Util.createEventDelegate(
                                            ClientLib.Net.CommandResult,
                                            this,
                                            b
                                        ),
                                        !0
                                    ),
                                        h('All Pois inserted to Forum');
                                else
                                    for (A in ((n = m.split('[hr]\n')), n))
                                        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                            'CreateForumPost',
                                            { forumID: c, threadID: f, postMessage: n[A] },
                                            phe.cnc.Util.createEventDelegate(
                                                ClientLib.Net.CommandResult,
                                                this,
                                                b
                                            ),
                                            !0
                                        ),
                                            h('All Pois inserted to Forum');
                        },
                        SortWhoPois: function(c, f) {
                            function b(b, c) {
                                !0 === c && 0 === d
                                    ? (g.push('Post "Who is at POI X" to Forum\n'), d++)
                                    : !0 === c &&
                                      (0 === R
                                          ? R++
                                          : 1 === R
                                          ? (g.close(), h('do something postInfoWho'))
                                          : 1 < R && h('postInfoWho do is was schiaf glafn ' + R));
                                !0 !== c &&
                                    g.push('ERROR: Post "Who is at POI X" to Forum\n' + c + '\n');
                            }
                            var d = 0;
                            h('Try to insert a post to "Who is at POI X"');
                            var g = CncEcomain.getInstance().getWindow();
                            g.push('Try to insert a post to "Who is at POI X"\n');
                            for (
                                var n = [],
                                    q = [],
                                    k = [],
                                    u = [],
                                    p = [],
                                    l = [],
                                    r = [],
                                    m = '',
                                    A = 0,
                                    D = 0,
                                    w = 0,
                                    t = 0,
                                    C = 0,
                                    v = 0,
                                    z = 0,
                                    y = 0;
                                y < x.length;
                                y++
                            ) {
                                for (
                                    var B = x[y][0],
                                        F = x[y][1],
                                        G = x[y][2],
                                        H = x[y][3],
                                        N = x[y][4],
                                        J = x[y][5],
                                        K = x[y][6],
                                        L = x[y][7],
                                        M = 0;
                                    M < E.length;
                                    M++
                                ) {
                                    var I = E[M][5],
                                        P = E[M][6];
                                    x[y][0] == E[M][0] &&
                                        (2 == L &&
                                            ('undefined' === typeof n[A] && (n[A] = []),
                                            n[A].push([B, F, G, H, N, J, K, L, I, P])),
                                        3 == L &&
                                            ('undefined' === typeof q[D] && (q[D] = []),
                                            q[D].push([B, F, G, H, N, J, K, L, I, P])),
                                        4 == L &&
                                            ('undefined' === typeof k[w] && (k[w] = []),
                                            k[w].push([B, F, G, H, N, J, K, L, I, P])),
                                        5 == L &&
                                            ('undefined' === typeof u[t] && (u[t] = []),
                                            u[t].push([B, F, G, H, N, J, K, L, I, P])),
                                        6 == L &&
                                            ('undefined' === typeof p[C]
                                                ? ((p[C] = []),
                                                  p[C].push([B, F, G, H, N, J, K, L, I, P]),
                                                  C++)
                                                : p[C].push([B, F, G, H, N, J, K, L, I, P])),
                                        7 == L &&
                                            ('undefined' === typeof l[v] && (l[v] = []),
                                            l[v].push([B, F, G, H, N, J, K, L, I, P])),
                                        8 == L &&
                                            ('undefined' === typeof r[z] && (r[z] = []),
                                            r[z].push([B, F, G, H, N, J, K, L, I, P])));
                                }
                                'undefined' !== typeof n[A] && A++;
                                'undefined' !== typeof q[D] && D++;
                                'undefined' !== typeof k[w] && w++;
                                'undefined' !== typeof u[t] && t++;
                                'undefined' !== typeof p[C] && C++;
                                'undefined' !== typeof l[v] && v++;
                                'undefined' !== typeof r[z] && z++;
                            }
                            if (y == x.length) {
                                for (A = 0; A < n.length; A++)
                                    for (
                                        0 === A && (m += '[b][u]Tiberium[/u][/b]\n'), D = 0;
                                        D < n[A].length;
                                        D++
                                    )
                                        0 === D &&
                                            (m +=
                                                'Level: ' +
                                                n[A][D][2] +
                                                ' Score: ' +
                                                n[A][D][3] +
                                                ' Coords [coords]' +
                                                n[A][D][6] +
                                                '[/coords]\n'),
                                            (m +=
                                                'Player: [player]' +
                                                n[A][D][9] +
                                                '[/player] base: ' +
                                                n[A][D][8] +
                                                '\n'),
                                            D + 1 == n[A].length && (m += '\n');
                                for (D = 0; D < q.length; D++)
                                    for (
                                        0 === D && (m += '[hr]\n[b][u]Crystal[/u][/b]\n'), w = 0;
                                        w < q[D].length;
                                        w++
                                    )
                                        0 === w &&
                                            (m +=
                                                'Level: ' +
                                                q[D][w][2] +
                                                ' Score: ' +
                                                q[D][w][3] +
                                                ' Coords [coords]' +
                                                q[D][w][6] +
                                                '[/coords]\n'),
                                            (m +=
                                                'Player: [player]' +
                                                q[D][w][9] +
                                                '[/player] base: ' +
                                                q[D][w][8] +
                                                '\n'),
                                            w + 1 == q[D].length && (m += '\n');
                                for (w = 0; w < k.length; w++)
                                    for (
                                        0 === w && (m += '[hr]\n[b][u]Reactor[/u][/b]\n'), t = 0;
                                        t < k[w].length;
                                        t++
                                    )
                                        0 === t &&
                                            (m +=
                                                'Level: ' +
                                                k[w][t][2] +
                                                ' Score: ' +
                                                k[w][t][3] +
                                                ' Coords [coords]' +
                                                k[w][t][6] +
                                                '[/coords]\n'),
                                            (m +=
                                                'Player: [player]' +
                                                k[w][t][9] +
                                                '[/player] base: ' +
                                                k[w][t][8] +
                                                '\n'),
                                            t + 1 == k[w].length && (m += '\n');
                                for (t = 0; t < u.length; t++)
                                    for (
                                        0 === t && (m += '[hr]\n[b][u]Tungsten[/u][/b]\n'), C = 0;
                                        C < u[t].length;
                                        C++
                                    )
                                        0 === C &&
                                            (m +=
                                                'Level: ' +
                                                u[t][C][2] +
                                                ' Score: ' +
                                                u[t][C][3] +
                                                ' Coords [coords]' +
                                                u[t][C][6] +
                                                '[/coords]\n'),
                                            (m +=
                                                'Player: [player]' +
                                                u[t][C][9] +
                                                '[/player] base: ' +
                                                u[t][C][8] +
                                                '\n'),
                                            C + 1 == u[t].length && (m += '\n');
                                for (C = 0; C < p.length; C++)
                                    for (
                                        0 === C && (m += '[hr]\n[b][u]Uranium[/u][/b]\n'), v = 0;
                                        v < p[C].length;
                                        v++
                                    )
                                        0 === v &&
                                            (m +=
                                                'Level: ' +
                                                p[C][v][2] +
                                                ' Score: ' +
                                                p[C][v][3] +
                                                ' Coords [coords]' +
                                                p[C][v][6] +
                                                '[/coords]\n'),
                                            (m +=
                                                'Player: [player]' +
                                                p[C][v][9] +
                                                '[/player] base: ' +
                                                p[C][v][8] +
                                                '\n'),
                                            v + 1 == p[C].length && (m += '\n');
                                for (v = 0; v < l.length; v++)
                                    for (
                                        0 === v && (m += '[hr]\n[b][u]Aircraft[/u][/b]\n'), z = 0;
                                        z < l[v].length;
                                        z++
                                    )
                                        0 === z &&
                                            (m +=
                                                'Level: ' +
                                                l[v][z][2] +
                                                ' Score: ' +
                                                l[v][z][3] +
                                                ' Coords [coords]' +
                                                l[v][z][6] +
                                                '[/coords]\n'),
                                            (m +=
                                                'Player: [player]' +
                                                l[v][z][9] +
                                                '[/player] base: ' +
                                                l[v][z][8] +
                                                '\n'),
                                            z + 1 == l[v].length && (m += '\n');
                                for (z = 0; z < r.length; z++)
                                    for (
                                        0 === z && (m += '[hr]\n[b][u]Resonator[/u][/b]\n'), y = 0;
                                        y < r[z].length;
                                        y++
                                    )
                                        0 === y &&
                                            (m +=
                                                'Level: ' +
                                                r[z][y][2] +
                                                ' Score: ' +
                                                r[z][y][3] +
                                                ' Coords [coords]' +
                                                r[z][y][6] +
                                                '[/coords]\n'),
                                            (m +=
                                                'Player: [player]' +
                                                r[z][y][9] +
                                                '[/player] base: ' +
                                                r[z][y][8] +
                                                '\n'),
                                            y + 1 == r[z].length && (m += '\n');
                                if (
                                    A == n.length &&
                                    D == q.length &&
                                    w == k.length &&
                                    t == u.length &&
                                    C == p.length &&
                                    v == l.length &&
                                    z == r.length
                                )
                                    if (((n = m.length), console.log(n), 2999 >= n))
                                        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                            'CreateForumPost',
                                            { forumID: c, threadID: f, postMessage: m },
                                            phe.cnc.Util.createEventDelegate(
                                                ClientLib.Net.CommandResult,
                                                this,
                                                b
                                            ),
                                            !0
                                        ) && h('who Pois inserted to Forum');
                                    else {
                                        var m = m.split('[hr]\n'),
                                            Q;
                                        for (Q in m)
                                            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                                'CreateForumPost',
                                                { forumID: c, threadID: f, postMessage: m[Q] },
                                                phe.cnc.Util.createEventDelegate(
                                                    ClientLib.Net.CommandResult,
                                                    this,
                                                    b
                                                ),
                                                !0
                                            ),
                                                h('who Pois inserted to Forum');
                                    }
                                else
                                    console.log(
                                        'tib ' +
                                            A +
                                            ' ' +
                                            n.length +
                                            ' cris ' +
                                            D +
                                            ' ' +
                                            q.length +
                                            ' reaktor ' +
                                            w +
                                            ' ' +
                                            k.length +
                                            ' tung ' +
                                            t +
                                            ' ' +
                                            u.length +
                                            ' uran ' +
                                            C +
                                            ' ' +
                                            p.length +
                                            ' luft ' +
                                            v +
                                            ' ' +
                                            l.length +
                                            ' reso ' +
                                            z +
                                            ' ' +
                                            r.length
                                    );
                            }
                        },
                        PoiForum: function(c, f) {
                            function b(b, c) {
                                !0 === b &&
                                    '0' == c &&
                                    ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                        'GetForumThreads',
                                        { forumId: f, skip: 0, take: 10 },
                                        phe.cnc.Util.createEventDelegate(
                                            ClientLib.Net.CommandResult,
                                            this,
                                            d
                                        ),
                                        !0
                                    );
                            }
                            function d(c, d) {
                                console.log(d);
                                for (var k in d) {
                                    var h = d[k].i;
                                    'List of Alliance Poi' == d[k].t &&
                                        0 == n &&
                                        (CncEcomain.getInstance().SortAlliancePois(f, h), (n = 1));
                                    'Who is at POI X' == d[k].t &&
                                        0 == q &&
                                        (CncEcomain.getInstance().SortWhoPois(f, h), (q = 1));
                                }
                                0 == n
                                    ? (g.push('Try to create Thread "List of Alliance Poi"\n'),
                                      ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                          'CreateForumThread',
                                          {
                                              forumID: f,
                                              threadTitle: 'List of Alliance Poi',
                                              firstPostMessage: '.',
                                              subscribe: !0,
                                          },
                                          phe.cnc.Util.createEventDelegate(
                                              ClientLib.Net.CommandResult,
                                              this,
                                              b
                                          ),
                                          !0
                                      ))
                                    : 0 == q &&
                                      (g.push('Try to create Thread2 "Who is at POI X"\n'),
                                      ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                          'CreateForumThread',
                                          {
                                              forumID: f,
                                              threadTitle: 'Who is at POI X',
                                              firstPostMessage: '.',
                                              subscribe: !0,
                                          },
                                          phe.cnc.Util.createEventDelegate(
                                              ClientLib.Net.CommandResult,
                                              this,
                                              b
                                          ),
                                          !0
                                      ));
                            }
                            ClientLib.Data.MainData.GetInstance()
                                .get_Forum()
                                .get_Forums();
                            var g = this.getWindow(),
                                n = 0,
                                q = 0;
                            ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                'GetForumThreads',
                                { forumId: f, skip: 0, take: 10 },
                                phe.cnc.Util.createEventDelegate(
                                    ClientLib.Net.CommandResult,
                                    this,
                                    d
                                ),
                                !0
                            );
                        },
                        CreatePoiForum: function(c, f) {
                            if (
                                !0 ===
                                ClientLib.Data.MainData.GetInstance()
                                    .get_Alliance()
                                    .get_CanCreateForum()
                            ) {
                                var b = function() {
                                        n.push('Try to create Thread "List of Alliance Poi"\n');
                                        var b = CncEcomain.getInstance().getForumId(c),
                                            b =
                                                '{"session":"' +
                                                k +
                                                '", "forumID":' +
                                                b +
                                                ',"threadTitle":"List of Alliance Poi","subscribe":true,"firstPostMessage":"."}';
                                        l.onload = function() {
                                            '0' == l.responseText
                                                ? (l.abort(),
                                                  h('Thread erstellt!!!'),
                                                  n.push(
                                                      'Thread "List of Alliance Poi" created!\n'
                                                  ),
                                                  window.setTimeout(d, 1e3))
                                                : h('ERROR: thread erstellen!');
                                        };
                                        l.open(
                                            'POST',
                                            '/' +
                                                q +
                                                '/Presentation/Service.svc/ajaxEndpoint/CreateForumThread'
                                        );
                                        l.setRequestHeader('Content-Type', 'application/json');
                                        l.send(b);
                                    },
                                    d = function() {
                                        n.push('Try to create Thread2 "Who is at POI X"\n');
                                        var b = CncEcomain.getInstance().getForumId(c),
                                            b =
                                                '{"session":"' +
                                                k +
                                                '", "forumID":' +
                                                b +
                                                ',"threadTitle":"Who is at POI X","subscribe":true,"firstPostMessage":"."}';
                                        l.onload = function() {
                                            '0' == l.responseText
                                                ? (l.abort(),
                                                  h('Thread2 erstellt!!!'),
                                                  n.push('Thread "Who is at POI X" created!\n'),
                                                  window.setTimeout(g, 1e3))
                                                : h('ERROR: Thread2 erstellen!');
                                        };
                                        l.open(
                                            'POST',
                                            '/' +
                                                q +
                                                '/Presentation/Service.svc/ajaxEndpoint/CreateForumThread'
                                        );
                                        l.setRequestHeader('Content-Type', 'application/json');
                                        l.send(b);
                                    },
                                    g = function() {
                                        var b = CncEcomain.getInstance().getForumId(c);
                                        CncEcomain.getInstance().PoiForum(c, b);
                                    };
                                h('CreatePoiForum');
                                var n = this.getWindow();
                                n.push('Try to create PoiForum\n');
                                var q = ClientLib.Data.MainData.GetInstance()
                                        .get_Server()
                                        .get_WorldId(),
                                    k = ClientLib.Net.CommunicationManager.GetInstance().get_InstanceId(),
                                    l = new qx.bom.request.Xhr();
                                l.onload = function() {
                                    '0' == l.responseText
                                        ? (l.abort(),
                                          h('forum erstellt!!!'),
                                          n.push('created PoiForum\n'),
                                          window.setTimeout(b, 1e3))
                                        : h('ERROR: forum erstellt!');
                                };
                                var p =
                                    '{"session":"' +
                                    k +
                                    '", "sharedAlliance":null,"Title":"CncEco PoiInfo","Description":"List of AlliancePois"}';
                                l.open(
                                    'POST',
                                    '/' + q + '/Presentation/Service.svc/ajaxEndpoint/CreateForum'
                                );
                                l.setRequestHeader('Content-Type', 'application/json');
                                l.send(p);
                            } else n.push('no rights to create PoiForum\n');
                        },
                        getWindow: function() {
                            null === this.poiwindow &&
                                ((this.poiwindow = new CncEcoreport.window()),
                                this.poiwindow.moveTo(
                                    window.innerWidth - 150 - this.poiwindow.getWidth() - 200,
                                    40
                                ));
                            return this.poiwindow;
                        },
                        getPoiWindow: function() {
                            null === this.poiInfoWindow &&
                                ((this.poiInfowindow = new CncEcoreport.window()),
                                this.poiInfoWindow.center());
                            return this.poiwindow;
                        },
                        _Allisupport: function() {
                            for (
                                var c = ClientLib.Data.MainData.GetInstance()
                                        .get_AllianceSupportState()
                                        .get_Bases().d,
                                    f,
                                    b = Object.keys(c),
                                    d = b.length,
                                    g = {},
                                    n = 0,
                                    q = 0,
                                    k = d;
                                d--;

                            )
                                (f = c[b[d]]),
                                    g.hasOwnProperty(f.get_Type()) || (g[f.get_Type()] = 0),
                                    g[f.get_Type()]++,
                                    30 <= f.get_Level() && q++,
                                    (n += f.get_Level());
                            n /= k;
                            c = ClientLib.Data.MainData.GetInstance()
                                .get_Alliance()
                                .get_MemberData().d;
                            g = 0;
                            b = Object.keys(c);
                            for (d = b.length; d--; ) (f = c[b[d]]), (g += f.Bases);
                            b =
                                'Bases: ' +
                                g +
                                ' SupCount: ' +
                                k +
                                '(' +
                                ((k / g) * 100).toFixed(0) +
                                '%) \u00d8: ' +
                                n.toFixed(2) +
                                ' 30+: ' +
                                q +
                                '(' +
                                ((q / g) * 100).toFixed(0) +
                                '%)';
                            CncEcomain.getInstance()
                                .getWindow()
                                .push(b);
                        },
                    },
                });
                qx.Class.define('CncEcoPlayerinfo', {
                    type: 'singleton',
                    extend: qx.core.Object,
                    members: {
                        windowinterval: null,
                        windowbevoreunload: null,
                        get_info: function() {
                            try {
                                var c = ClientLib.Data.MainData.GetInstance();
                                B = c.get_Player();
                                B.get_Name();
                                B.get_AccountId();
                                T = c.get_Alliance();
                                c.get_Server().get_WorldId();
                                return !0;
                            } catch (f) {
                                (c = { func: 'get_info', class: 'CncEco5main' }),
                                    (c.error = f),
                                    h(f),
                                    beta && H(f, c);
                            }
                        },
                        initialize: function() {
                            try {
                                return (
                                    h('CncEcoPlayerinfo load'),
                                    h('CncEcoPlayerinfo load'),
                                    h('CncEcoPlayerinfo load'),
                                    h('CncEcoPlayerinfo load'),
                                    this.get_info() &&
                                        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                            'GetPublicPlayerInfo',
                                            { id: playerId },
                                            phe.cnc.Util.createEventDelegate(
                                                ClientLib.Net.CommandResult,
                                                this,
                                                this.Playerinfo
                                            ),
                                            null
                                        ),
                                    (this.windowinterval = window.setInterval(function() {
                                        CncEcoPlayerinfo.getInstance().interval();
                                    }, 18e5)),
                                    (this.windowbevoreunload = window.addEventListener(
                                        'beforeunload',
                                        function() {
                                            CncEcoPlayerinfo.getInstance().interval();
                                        }
                                    )),
                                    !0
                                );
                            } catch (f) {
                                var c = { func: 'ini', class: 'CncEcoPlayerinfo' };
                                c.error = f;
                                h(f);
                                beta && H(f, c);
                            }
                        },
                        interval: function() {
                            try {
                                if (Main.get_info())
                                    return (
                                        ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand(
                                            'GetPublicPlayerInfo',
                                            { id: playerId },
                                            phe.cnc.Util.createEventDelegate(
                                                ClientLib.Net.CommandResult,
                                                this,
                                                this.Playerinfo
                                            ),
                                            null
                                        ),
                                        !0
                                    );
                            } catch (f) {
                                var c = { func: 'interval', class: 'CncEcoPlayerinfo' };
                                c.error = f;
                                h(f);
                                beta && H(f, c);
                            }
                        },
                        Playerinfo: function(c, f) {
                            try {
                                var b = { server: {} };
                                b.server.serverid = worldId;
                                b.server.serverName = MainData.get_Server()
                                    .get_Name()
                                    .trim();
                                if (0 < f.a) {
                                    b.alli = {};
                                    b.alli.alliId = f.a;
                                    b.alli.alliName = f.an;
                                    b.alli.cic = T.get_FirstLeaders().l;
                                    b.alli.sc = T.get_SecondLeaders().l;
                                    b.alli.roleinfo = T.get_Roles().d;
                                    var d = MainData.get_Alliance().get_MemberData();
                                    b.alli.member = d;
                                }
                                b.player = {};
                                b.player.name = playerName;
                                b.player.id = playerId;
                                b.player.accountid = accountId;
                                b.player.creationDate = B.get_CreationDate();
                                b.player.fraction = B.get_Faction();
                                b.player.bases = {};
                                b.player.pve = f.bd;
                                b.player.pvp = f.bd - f.bde;
                                b.player.points = f.p;
                                b.player.rank = f.r;
                                b.player.hascode = f.hchc;
                                b.player.maxcp = B.GetCommandPointMaxStorage();
                                b.player.actcp = Math.round(B.GetCommandPointCount());
                                b.player.funds = MainData.get_Inventory().get_PlayerFunds();
                                b.player.schirme = Math.round(B.GetSupplyPointCount());
                                b.player.RPoints = B.get_ResearchPoints();
                                b.player.CreditsCount = Math.round(B.GetCreditsCount());
                                var g = MainData.get_Player(),
                                    n = g.get_Faction(),
                                    q = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(
                                        ClientLib.Base.ETechName.Research_BaseFound,
                                        n
                                    ),
                                    k = g
                                        .get_PlayerResearch()
                                        .GetResearchItemFomMdbId(q)
                                        .get_NextLevelInfo_Obj(),
                                    d = [],
                                    u;
                                for (u in k.rr) 0 < k.rr[u].t && (d[k.rr[u].t] = k.rr[u].c);
                                var p = d[ClientLib.Base.EResourceType.Gold],
                                    r = d[ClientLib.Base.EResourceType.ResearchPoints],
                                    x = g.get_Credits(),
                                    m =
                                        (x.Delta + x.ExtraBonusDelta) *
                                        ClientLib.Data.MainData.GetInstance()
                                            .get_Time()
                                            .get_StepsPerHour(),
                                    A = (p - B.GetCreditsCount()) / m;
                                b.player.timeTOmcv = Math.round(3600 * A);
                                b.player.rpNeeded = r;
                                var D = MainData.get_Cities(),
                                    w = f.c.length;
                                b.player.basecount = w;
                                for (u = 0; u < w; u++) {
                                    var t = D.GetCity(f.c[u].i),
                                        g = {};
                                    g.Id = f.c[u].i;
                                    g.Na = t.get_Name();
                                    g.Po = f.c[u].p;
                                    g.Lvl = parseFloat(t.get_LvlBase().toFixed(2));
                                    g.Off = parseFloat(t.get_LvlOffense().toFixed(2));
                                    g.Def = parseFloat(t.get_LvlDefense().toFixed(2));
                                    g.PosX = f.c[u].x;
                                    g.PosY = f.c[u].y;
                                    var C = t.get_CityUnitsData();
                                    g.repInf =
                                        0 < g.Off
                                            ? C.GetRepairTimeFromEUnitGroup(
                                                  ClientLib.Data.EUnitGroup.Infantry,
                                                  !1
                                              )
                                            : 0;
                                    g.repVeh =
                                        0 < g.Off
                                            ? C.GetRepairTimeFromEUnitGroup(
                                                  ClientLib.Data.EUnitGroup.Vehicle,
                                                  !1
                                              )
                                            : 0;
                                    g.repAir =
                                        0 < g.Off
                                            ? C.GetRepairTimeFromEUnitGroup(
                                                  ClientLib.Data.EUnitGroup.Aircraft,
                                                  !1
                                              )
                                            : 0;
                                    g.maxRep =
                                        0 < g.Off
                                            ? t.GetResourceMaxStorage(
                                                  ClientLib.Base.EResourceType.RepairChargeInf
                                              )
                                            : 0;
                                    g.availRep =
                                        0 < g.Off
                                            ? ClientLib.Base.Resource.GetResourceCount(
                                                  t
                                                      .get_RepairOffenseResources()
                                                      .get_RepairChargeOffense()
                                              )
                                            : 0;
                                    var v = t.get_SupportWeapon();
                                    g.supWp = null !== v ? v.n : '';
                                    v = t.get_SupportData();
                                    g.supWplvl = null !== v ? v.get_Level() : 0;
                                    var z = t.get_CityBuildingsData();
                                    v = z.GetUniqueBuildingByTechName(
                                        ClientLib.Base.ETechName.Construction_Yard
                                    );
                                    g.CY = null !== v ? v.get_CurrentLevel() : 0;
                                    v = z.GetUniqueBuildingByTechName(
                                        ClientLib.Base.ETechName.Defense_Facility
                                    );
                                    g.DF = null !== v ? v.get_CurrentLevel() : 0;
                                    v = z.GetUniqueBuildingByTechName(
                                        ClientLib.Base.ETechName.Defense_HQ
                                    );
                                    g.DHQ = null !== v ? v.get_CurrentLevel() : 0;
                                    g.PP = Math.round(
                                        t.GetResourceGrowPerHour(
                                            ClientLib.Base.EResourceType.Power,
                                            !1,
                                            !1
                                        )
                                    );
                                    g.PBP = Math.round(
                                        t.GetResourceBonusGrowPerHour(
                                            ClientLib.Base.EResourceType.Power
                                        )
                                    );
                                    g.PAB = ClientLib.Data.MainData.GetInstance()
                                        .get_Alliance()
                                        .GetPOIBonusFromResourceType(
                                            ClientLib.Base.EResourceType.Power
                                        );
                                    g.CP = Math.round(
                                        ClientLib.Base.Resource.GetResourceGrowPerHour(
                                            t.get_CityCreditsProduction(),
                                            !1
                                        )
                                    );
                                    g.CBP = Math.round(
                                        ClientLib.Base.Resource.GetResourceBonusGrowPerHour(
                                            t.get_CityCreditsProduction(),
                                            !1
                                        )
                                    );
                                    g.Tall = Math.round(
                                        t.GetResourceGrowPerHour(
                                            ClientLib.Base.EResourceType.Tiberium,
                                            !1,
                                            !1
                                        ) +
                                            t.GetResourceBonusGrowPerHour(
                                                ClientLib.Base.EResourceType.Tiberium
                                            ) +
                                            ClientLib.Data.MainData.GetInstance()
                                                .get_Alliance()
                                                .GetPOIBonusFromResourceType(
                                                    ClientLib.Base.EResourceType.Tiberium
                                                )
                                    );
                                    g.Call = Math.round(
                                        t.GetResourceGrowPerHour(
                                            ClientLib.Base.EResourceType.Crystal,
                                            !1,
                                            !1
                                        ) +
                                            t.GetResourceBonusGrowPerHour(
                                                ClientLib.Base.EResourceType.Crystal
                                            ) +
                                            ClientLib.Data.MainData.GetInstance()
                                                .get_Alliance()
                                                .GetPOIBonusFromResourceType(
                                                    ClientLib.Base.EResourceType.Crystal
                                                )
                                    );
                                    g.PPall = g.PP + g.PBP + g.PAB;
                                    g.CPall = g.CP + g.CBP;
                                    b.player.bases[u] = g;
                                    b.player.bases[u].cncopt = V(g.Id, u);
                                }
                                b.player.mainoff = 0;
                                b.player.maindef = 0;
                                b.player.mainavailrep = 0;
                                b.player.mainrepinf = 0;
                                b.player.mainrepveh = 0;
                                b.player.mainrepair = 0;
                                b.player.supschnitt = 0;
                                b.player.defschnitt = 0;
                                b.player.tibgesamt = 0;
                                b.player.crigesamt = 0;
                                b.player.cashgesamt = 0;
                                b.player.powergesamt = 0;
                                b.player.mainpower = 0;
                                for (var y in b.player.bases)
                                    delete b.player.bases[y].PP,
                                        delete b.player.bases[y].PBP,
                                        delete b.player.bases[y].PAB,
                                        delete b.player.bases[y].CP,
                                        delete b.player.bases[y].CBP,
                                        b.player.bases[y].Off > b.player.mainoff &&
                                            ((b.player.mainoff = b.player.bases[y].Off),
                                            (b.player.mainpower = b.player.bases[y].PPall),
                                            (b.player.maindef = b.player.bases[y].Def),
                                            (b.player.mainavailrep = b.player.bases[y].availRep),
                                            (b.player.mainrepinf = b.player.bases[y].repInf),
                                            (b.player.mainrepveh = b.player.bases[y].repVeh),
                                            (b.player.mainrepair = b.player.bases[y].repAir)),
                                        (b.player.supschnitt += b.player.bases[y].supWplvl),
                                        (b.player.defschnitt += b.player.bases[y].Def),
                                        (b.player.tibgesamt += b.player.bases[y].Tall),
                                        (b.player.crigesamt += b.player.bases[y].Call),
                                        (b.player.cashgesamt += b.player.bases[y].CPall),
                                        (b.player.powergesamt += b.player.bases[y].PPall);
                                b.player.supschnitt /= b.player.basecount;
                                b.player.defschnitt /= b.player.basecount;
                                b.player.supschnitt = b.player.supschnitt.toFixed(2);
                                b.player.defschnitt = b.player.defschnitt.toFixed(2);
                                var E = b.player.bases;
                                delete b.player.bases;
                                b.player.bases = E;
                                if (null !== l.xhr._xhr)
                                    (xhr = l.xhr),
                                        xhr.send(
                                            'https://www.member-stats.de/playerinfo.php?i=playerinfos',
                                            'POST',
                                            null,
                                            b,
                                            this.callback
                                        );
                                else {
                                    var F = {
                                        func: 'playerinfo',
                                        class: 'CncEcoPlayerinfo',
                                        error: 'CncEco.xhr.req !== null',
                                    };
                                    h('CncEco.xhr.req !== null');
                                    beta && H('CncEco.xhr.req !== null', F);
                                }
                            } catch (G) {
                                (F = { func: 'playerinfo', class: 'CncEcoPlayerinfo' }),
                                    (F.error = G),
                                    h(G),
                                    beta && H(G, F);
                            }
                        },
                        callback: function(c) {
                            try {
                                !1 !== JSON.isjson(c) &&
                                    ('parse' === JSON.isjson(c)
                                        ? JSON.parse(c)
                                        : 'stringify' === JSON.isjson(c) && JSON.stringify(c));
                            } catch (f) {
                                (c = { func: 'callback', class: 'CncEcoPlayerinfo' }),
                                    (c.error = f),
                                    h(f),
                                    beta && H(f, c);
                            }
                        },
                    },
                });
                qx.Class.define('CncEcoreport.window', {
                    extend: qx.ui.window.Window,
                    construct: function() {
                        qx.ui.window.Window.call(this);
                        this.set({
                            caption: 'CncEco Info',
                            icon: 'webfrontend/ui/icons/icn_show_combat_active.png',
                            layout: new qx.ui.layout.VBox(4),
                            width: 300,
                            height: 50,
                            contentPaddingTop: 0,
                            contentPaddingBottom: 6,
                            contentPaddingRight: 6,
                            contentPaddingLeft: 6,
                            showMaximize: !1,
                            showMinimize: !1,
                            allowMaximize: !1,
                            allowMinimize: !1,
                            resizable: !0,
                            visibility: 'excluded',
                            textColor: '#bfbfbf',
                        });
                        this.getChildControl('icon').set({
                            scale: !0,
                            width: 18,
                            height: 17,
                            alignY: 'middle',
                            marginLeft: 8,
                        });
                        this.add(
                            (this.logContainer = new qx.ui.container.Composite(
                                new qx.ui.layout.VBox()
                            ))
                        );
                        this.add(new qx.ui.core.Spacer(), { flex: 1 });
                        this.addListener('close', function() {
                            this.onClose();
                        });
                    },
                    members: {
                        logContainer: null,
                        onClose: function() {
                            this.removeAll();
                            this.add(
                                (this.logContainer = new qx.ui.container.Composite(
                                    new qx.ui.layout.VBox()
                                ))
                            );
                        },
                        push: function(c, f) {
                            this.isActive() || this.open();
                            this.logContainer.add(new qx.ui.basic.Label(c.toString()));
                            f && this.logContainer.add(f);
                        },
                        delall: function() {
                            this.removeAll();
                            this.add(
                                (this.logContainer = new qx.ui.container.Composite(
                                    new qx.ui.layout.VBox()
                                ))
                            );
                        },
                        initialize: function() {
                            try {
                                h('CncEcoreport.window loadet');
                            } catch (c) {
                                h(c);
                            }
                        },
                    },
                });
                var r = {
                        _g: function(c, f, b, d) {
                            c = c.toString().replace(/\s/gim, '');
                            f = c.match(f);
                            var g;
                            for (g = 1; g < d + 1; g++)
                                null !== f && 6 === f[g].length
                                    ? console.debug(b, g, f[g])
                                    : null !== f && 0 < f[g].length
                                    ? console.warn(b, g, f[g])
                                    : (console.error('Error - ', b, g, 'not found'),
                                      console.warn(b, c));
                            return f;
                        },
                        patch: function() {
                            if (!d._patched) {
                                var c = ClientLib.Data.WorldSector.WorldObjectCity.prototype,
                                    c = ClientLib.Data.WorldSector.WorldObjectNPCBase.prototype;
                                re = /100\){0,1};this\.(.{6})=Math.floor.*d\+=f;this\.(.{6})=\(/;
                                var f = r._g(
                                    c.$ctor,
                                    re,
                                    'ClientLib.Data.WorldSector.WorldObjectNPCBase',
                                    2
                                );
                                null !== f && 6 === f[1].length
                                    ? (c.getLevel = function() {
                                          return this[f[1]];
                                      })
                                    : console.error(
                                          'Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.Level undefined'
                                      );
                                null !== f && 6 === f[2].length
                                    ? (c.getID = function() {
                                          return this[f[2]];
                                      })
                                    : console.error(
                                          'Error - ClientLib.Data.WorldSector.WorldObjectNPCBase.ID undefined'
                                      );
                                c = ClientLib.Data.WorldSector.WorldObjectNPCCamp.prototype;
                                re = /100\){0,1};this\.(.{6})=Math.floor.*this\.(.{6})=\(*g\>\>(22|0x16)\)*\&.*=-1;\}this\.(.{6})=\(/;
                                var b = r._g(
                                    c.$ctor,
                                    re,
                                    'ClientLib.Data.WorldSector.WorldObjectNPCCamp',
                                    4
                                );
                                null !== b && 6 === b[1].length
                                    ? (c.getLevel = function() {
                                          return this[b[1]];
                                      })
                                    : console.error(
                                          'Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.Level undefined'
                                      );
                                null !== b && 6 === b[2].length
                                    ? (c.getCampType = function() {
                                          return this[b[2]];
                                      })
                                    : console.error(
                                          'Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.CampType undefined'
                                      );
                                null !== b && 6 === b[4].length
                                    ? (c.getID = function() {
                                          return this[b[4]];
                                      })
                                    : console.error(
                                          'Error - ClientLib.Data.WorldSector.WorldObjectNPCCamp.ID undefined'
                                      );
                                d._patched = !0;
                            }
                        },
                    },
                    d = null;
                qx.Class.define('CncEcoScanner', {
                    type: 'singleton',
                    extend: qx.core.Object,
                    members: {
                        initialize: function() {
                            try {
                                h('Scanner loadet\n'),
                                    CncEcomain.getInstance().AddMainMenu(
                                        'scan layouts',
                                        function() {
                                            CncEcoScanner.getInstance().scan();
                                        },
                                        'Alt+s'
                                    ),
                                    (d = CncEcoScanner.getInstance()),
                                    (d.win = CncEcomain.getInstance().getWindow()),
                                    (d.storage = CncEcostorage.getInstance()),
                                    (d.xhr = l.xhr),
                                    (d.winOpen = CncEcomain.getInstance()),
                                    d.startup();
                            } catch (c) {
                                h(c);
                            }
                        },
                        _patched: !1,
                        _bases: {},
                        _selectionBases: {},
                        _scanned: [],
                        _toScan: [],
                        _scanning: !1,
                        failCount: 0,
                        wincounter: 0,
                        basecounter: 0,
                        button: function() {
                            if (!0 === d._abort) {
                                var c = new qx.ui.form.Button('resume');
                                c.addListener(
                                    'execute',
                                    function() {
                                        d.resume();
                                    },
                                    this
                                );
                            } else
                                (c = new qx.ui.form.Button('stop')),
                                    c.addListener(
                                        'execute',
                                        function(c) {
                                            d.abort();
                                            var b = ClientLib.Data.MainData.GetInstance();
                                            c = b.get_Player().get_Name();
                                            var f = b.get_Server().get_WorldId(),
                                                b = b.get_Alliance().get_Id();
                                            d.xhr.send(
                                                'https://cnc-eco.herokuapp.com/api/v1/layouts?pl=' +
                                                    c +
                                                    '&w=' +
                                                    f +
                                                    '&a=' +
                                                    b,
                                                'POST',
                                                null,
                                                d._bases,
                                                h
                                            );
                                        },
                                        this
                                    );
                            return c;
                        },
                        scan: function(c) {
                            h('start scan');
                            if (d._scanning) h('BaseScanner._scanning');
                            else if (
                                (null == c &&
                                    (d.win.isActive() && (d.win.delall(), d.win.close()),
                                    d.win.open()),
                                !0 === d._abort)
                            )
                                d.resume();
                            else {
                                d.win.push('start Scanning');
                                d._bases = {};
                                d._scanning = !0;
                                d._count = 0;
                                d._done = 0;
                                d.index = -1;
                                d._toScanMap = {};
                                d._toScan = [];
                                d.basecounter = 0;
                                c = d.storage.get('scan');
                                Array.isArray(c) ||
                                    (d.storage.set('scan', '[]'), (c = d.storage.get('scan')));
                                for (var f = d.storage.get('scan').length; 800 <= f; )
                                    c.shift(), f--, 800 >= f && d.storage.set('scan', c);
                                c = ClientLib.Data.MainData.GetInstance()
                                    .get_Cities()
                                    .get_AllCities().d;
                                for (var b in c)
                                    c.hasOwnProperty(b) &&
                                        ((f = c[b]),
                                        void 0 === f && h('unable to find base: ' + b),
                                        d.getNearByBases(f));
                                d.scanNextBase();
                            }
                        },
                        getNearByBases: function(c) {
                            for (
                                var f,
                                    b = c.get_PosX(),
                                    l = c.get_PosY(),
                                    g =
                                        ClientLib.Data.MainData.GetInstance()
                                            .get_Server()
                                            .get_MaxAttackDistance() - 0.5,
                                    n = ClientLib.Data.MainData.GetInstance().get_World(),
                                    q = 0,
                                    k = l - 11;
                                k <= l + 11;
                                k++
                            )
                                for (var h = b - 11; h <= b + 11; h++) {
                                    var p = Math.abs(b - h),
                                        r = Math.abs(l - k),
                                        p = Math.sqrt(p * p + r * r);
                                    if (
                                        !(
                                            p >= g ||
                                            void 0 !== d._toScanMap[h + ':' + k] ||
                                            void 0 !== d._bases[h + ':' + k] ||
                                            ((r = n.GetObjectFromPosition(h, k)),
                                            null === r ||
                                                (r.Type !==
                                                    ClientLib.Data.WorldSector.ObjectType.NPCBase &&
                                                    r.Type !==
                                                        ClientLib.Data.WorldSector.ObjectType
                                                            .NPCCamp) ||
                                                ('function' === typeof r.getCampType &&
                                                    r.getCampType() ===
                                                        ClientLib.Data.Reports.ENPCCampType
                                                            .Destroyed))
                                        )
                                    ) {
                                        var x = 0;
                                        if (null !== d.storage.get('scan'))
                                            if (
                                                ((f = d.storage.get('scan')),
                                                !0 === Array.isArray(f))
                                            )
                                                for (
                                                    var m = d.storage.get('scan').length, A = 0;
                                                    A < m;
                                                    A++
                                                )
                                                    r.getID() === f[A] && (x = 1);
                                            else d.storage.set('scan', '[]');
                                        else d.storage.set('scan', '[]');
                                        0 < x ||
                                            ((f = d.storage.get('scan')),
                                            f.push(r.getID()),
                                            CncEcostorage.getInstance().set('scan', f),
                                            (m = ClientLib.Data.MainData.GetInstance()),
                                            (f = m.get_Player().get_Name()),
                                            (x = m.get_Server().get_WorldId()),
                                            (m = m.get_Alliance().get_Id()),
                                            (p = {
                                                x: h,
                                                y: k,
                                                level: r.getLevel(),
                                                id: r.getID(),
                                                distance: p,
                                                selectedBaseID: c.get_Id(),
                                                alliance: m,
                                                world: x,
                                                player: f,
                                                failCount: 0,
                                            }),
                                            d._toScan.push(p),
                                            (d._toScanMap[h + ':' + k] = p),
                                            q++);
                                    }
                                }
                        },
                        abort: function() {
                            d._scanning = !1;
                            d._abort = !0;
                            d.win.delall();
                            d.win.push('stop scan');
                            d.win.push(('   ' + d.index).slice(-3) + '/' + d._toScan.length);
                            d.win.push('', d.button());
                        },
                        resume: function() {
                            d._scanning = !0;
                            d._abort = !1;
                            d.win.delall();
                            d.win.push('resume scan');
                            d.win.push(('   ' + d.index).slice(-3) + '/' + d._toScan.length);
                            d.win.push('', d.button());
                            d.scanNextBase();
                        },
                        done: function() {
                            d._done++;
                            var c = ClientLib.Data.MainData.GetInstance();
                            var f = c.get_Player().get_Name(),
                                b = c.get_Server().get_WorldId(),
                                l = c.get_Alliance().get_Id();
                            !1 === d._scanning && d._count === d._done && !1 === d._abort
                                ? (d.win.push(''),
                                  0 < d._count
                                      ? (d.win.push('Done! (' + d._count + ')'),
                                        d.win.push(''),
                                        d.xhr.send(
                                            'https://cnc-eco.herokuapp.com/api/v1/layouts?pl=' +
                                                f +
                                                '&w=' +
                                                b +
                                                '&a=' +
                                                l,
                                            'POST',
                                            null,
                                            d._bases,
                                            h
                                        ),
                                        d.winOpen.winOpen('layout', 'layout'),
                                        5 > Object.keys(d._bases).length &&
                                            ((c = CncEcoScanner.Layout.window.getInstance()),
                                            !0 !== c.active &&
                                                ((c.active = !0),
                                                c.openWindow('CncEco Scan result', null, 1)),
                                            c.FO(d._bases),
                                            d.xhr.send(
                                                'https://cnc-eco.herokuapp.com/api/v1/layouts?pl=' +
                                                    f +
                                                    '&w=' +
                                                    b +
                                                    '&a=' +
                                                    l,
                                                'POST',
                                                null,
                                                d._bases,
                                                h
                                            ),
                                            (d._bases = {})))
                                      : (d.win.push('Done! 0 new layouts to scan'), d.win.push('')))
                                : !1 === d._scanning && d._count + 1 === d._done && !1 === d._abort
                                ? (d.win.delall(),
                                  d.win.push(''),
                                  0 < d._count
                                      ? (d.win.push('Done! (' + d._count + ')'),
                                        d.win.push(''),
                                        d.xhr.send(
                                            'https://cnc-eco.herokuapp.com/api/v1/layouts?pl=' +
                                                f +
                                                '&w=' +
                                                b +
                                                '&a=' +
                                                l,
                                            'POST',
                                            null,
                                            d._bases,
                                            h
                                        ),
                                        d.winOpen.winOpen('layout', 'layout'),
                                        5 > Object.keys(d._bases).length &&
                                            ((c = CncEcoScanner.Layout.window.getInstance()),
                                            !0 !== c.active &&
                                                ((c.active = !0),
                                                c.openWindow('CncEco Scan result', null, 1)),
                                            c.FO(d._bases),
                                            d.xhr.send(
                                                'https://cnc-eco.herokuapp.com/api/v1/layouts?pl=' +
                                                    f +
                                                    '&w=' +
                                                    b +
                                                    '&a=' +
                                                    l,
                                                'POST',
                                                null,
                                                d._bases,
                                                h
                                            ),
                                            (d._bases = {})))
                                      : (d.win.push('Done! 0 new layouts to scan'), d.win.push('')))
                                : !1 === d._scanning && !1 === d._abort && d.win.push('Scan');
                        },
                        getBaseLayout: function(c) {
                            var f = ClientLib.Data.MainData.GetInstance(),
                                b = f.get_Player().get_Name(),
                                l = f.get_Server().get_WorldId(),
                                f = f.get_Alliance().get_Id();
                            if (!d._abort)
                                if (void 0 === c)
                                    (d._abort = !1),
                                        (d._scanning = !1),
                                        !1 === d._abort && d.done(),
                                        h('[BaseScanner] base undefined');
                                else {
                                    d._lastBaseID !== c.selectedBaseID &&
                                        d.setCurrentBase(c.selectedBaseID);
                                    ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .set_CurrentCityId(c.id);
                                    var g = ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .GetCity(c.id);
                                    ClientLib.Net.CommunicationManager.GetInstance().UserAction();
                                    if (g.get_IsGhostMode()) return d.scanNextBase();
                                    if (0 === g.GetBuildingsConditionInPercent())
                                        return (
                                            c.failCount++,
                                            30 === c.failCount
                                                ? (h('[BaseScanner] max_fails'), d.scanNextBase())
                                                : setTimeout(function() {
                                                      d.getBaseLayout(c);
                                                  }, 99)
                                        );
                                    var n = g.get_Name();
                                    c.layout = d.getLayout(g);
                                    c.name = n;
                                    d._bases[c.x + ':' + c.y] = c;
                                    d.basecounter++;
                                    g = CncEcoScanner.Layout.window.getInstance();
                                    !0 !== g.active &&
                                        ((g.active = !0),
                                        g.openWindow('CncEco Scan result', null, 1));
                                    4 < d.basecounter &&
                                        ((d.basecounter = 0),
                                        g.FO(d._bases),
                                        d.xhr.send(
                                            'https://cnc-eco.herokuapp.com/api/v1/layouts?pl=' +
                                                b +
                                                '&w=' +
                                                l +
                                                '&a=' +
                                                f,
                                            'POST',
                                            null,
                                            d._bases,
                                            h
                                        ),
                                        (d._bases = {}));
                                    ClientLib.Data.MainData.GetInstance()
                                        .get_Server()
                                        .get_WorldId();
                                    ClientLib.Data.MainData.GetInstance()
                                        .get_Player()
                                        .get_Name();
                                    d._count++;
                                    d.printScanResults(c);
                                    d.done();
                                    d.scanNextBase();
                                }
                        },
                        scanNextBase: function() {
                            !0 !== d._abort &&
                                (void 0 === d.index ? (d.index = 0) : d.index++,
                                d.getBaseLayout(d._toScan[d.index]));
                        },
                        isScanning: function() {
                            return !0 === d._scanning;
                        },
                        printScanResults: function(c) {
                            d.win.delall();
                            if (!1 === d._abort)
                                switch (d.wincounter) {
                                    case 0:
                                        d.wincounter++;
                                        d.win.push('Scanning');
                                        break;
                                    case 1:
                                        d.wincounter++;
                                        d.win.push('Scanning.');
                                        break;
                                    case 2:
                                        d.wincounter++;
                                        d.win.push('Scanning..');
                                        break;
                                    case 3:
                                        d.wincounter = 0;
                                        d.win.push('Scanning...');
                                        break;
                                    default:
                                        d.win.push('Scanning');
                                }
                            else d.win.push('Scanning');
                            d.win.push(('   ' + d.index).slice(-3) + '/' + d._toScan.length);
                            d.win.push('', d.button());
                        },
                        getLayout: function(c) {
                            for (var f = [], b = 0; 16 > b; b++)
                                for (var d = 0; 9 > d; d++)
                                    switch (c.GetResourceType(d, b)) {
                                        case 0:
                                            f.push('.');
                                            break;
                                        case 1:
                                            f.push('c');
                                            break;
                                        case 2:
                                            f.push('t');
                                            break;
                                        case 4:
                                            f.push('j');
                                            break;
                                        case 5:
                                            f.push('h');
                                            break;
                                        case 6:
                                            f.push('l');
                                            break;
                                        case 7:
                                            f.push('k');
                                    }
                            return f.join('');
                        },
                        setCurrentBase: function(c) {
                            var f = ClientLib.Data.MainData.GetInstance()
                                .get_Cities()
                                .get_AllCities().d[c];
                            ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(
                                f.get_PosX(),
                                f.get_PosY()
                            );
                            ClientLib.Vis.VisMain.GetInstance().Update();
                            ClientLib.Vis.VisMain.GetInstance().ViewUpdate();
                            d._lastBaseID = c;
                        },
                        startup: function() {
                            r.patch();
                            phe.cnc.Util.attachNetEvent(
                                ClientLib.Vis.VisMain.GetInstance(),
                                'ViewModeChange',
                                ClientLib.Vis.SelectionChange,
                                d,
                                d.onSelectionChange
                            );
                        },
                        destroy: function() {
                            phe.cnc.Util.detachNetEvent(
                                ClientLib.Vis.VisMain.GetInstance(),
                                'ViewModeChange',
                                ClientLib.Vis.SelectionChange,
                                d,
                                d.onSelectionChange
                            );
                        },
                        onSelectionChange: function() {
                            try {
                                if (!d.isScanning() && !0 !== d._abort) {
                                    d.failCount = 0;
                                    d._bases = {};
                                    d._count = 0;
                                    d._done = 0;
                                    d.index = -1;
                                    d._toScanMap = {};
                                    d._toScan = [];
                                    void 0 !== d.selectionChange &&
                                        (clearTimeout(d.selectionChange),
                                        (d.selectionChange = void 0));
                                    var c = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject(),
                                        c = ClientLib.Data.MainData.GetInstance()
                                            .get_Cities()
                                            .get_CurrentCity();
                                    if (
                                        null !== c &&
                                        !0 ===
                                            ClientLib.Data.MainData.GetInstance()
                                                .get_Cities()
                                                .get_CurrentCity()
                                                .IsNPC()
                                    ) {
                                        for (id in d._scanned)
                                            if (d._scanned[id] == c.get_Id()) {
                                                console.log('already scanned');
                                                return;
                                            }
                                        d._scanned.push(c.get_Id());
                                        d.scanCurrentBase();
                                    }
                                }
                            } catch (f) {
                                console.log(f);
                            }
                        },
                        scanCurrentBase: function() {
                            var c = ClientLib.Data.MainData.GetInstance().get_Cities(),
                                f = c.get_CurrentCity(),
                                b = c.get_CurrentOwnCity();
                            d.failCount++;
                            if (!(30 < d.failCount)) {
                                if (null === f)
                                    return (
                                        h('base = 0'),
                                        (d.selectionChange = setTimeout(d.scanCurrentBase, 100)),
                                        d.selectionChange
                                    );
                                void 0 !== d.selectionChange &&
                                    (clearTimeout(d.selectionChange), (d.selectionChange = void 0));
                                var c = f.get_PosX(),
                                    l = f.get_PosY();
                                f.get_Id();
                                if (f.get_IsGhostMode()) d.failCount = 0;
                                else if (0 === f.GetBuildingsConditionInPercent())
                                    d.selectionChange = setTimeout(d.scanCurrentBase, 100);
                                else {
                                    d.failCount = 0;
                                    var g = ClientLib.Data.MainData.GetInstance(),
                                        n = g.get_Player().get_Name(),
                                        q = g.get_Server().get_WorldId(),
                                        g = g.get_Alliance().get_Id(),
                                        k = ClientLib.Base.Util.CalculateDistance(
                                            f.get_PosX(),
                                            f.get_PosY(),
                                            b.get_PosX(),
                                            b.get_PosY()
                                        ),
                                        b = {
                                            x: f.get_PosX(),
                                            y: f.get_PosY(),
                                            level: f.get_BaseLevel(),
                                            id: f.get_Id(),
                                            distance: k,
                                            selectedBaseID: b.get_Id(),
                                            alliance: g,
                                            world: q,
                                            player: n,
                                            failCount: 0,
                                        },
                                        k = f.get_Name();
                                    b.layout = d.getLayout(f);
                                    b.name = k;
                                    b.alliance = ClientLib.Data.MainData.GetInstance()
                                        .get_Alliance()
                                        .get_Id();
                                    d._bases[c + ':' + l] = b;
                                    d._selectionBases[c + ':' + l] = b;
                                    ClientLib.Data.MainData.GetInstance()
                                        .get_Server()
                                        .get_WorldId();
                                    ClientLib.Data.MainData.GetInstance()
                                        .get_Player()
                                        .get_Name();
                                    ClientLib.Data.MainData.GetInstance()
                                        .get_Alliance()
                                        .get_Id();
                                    d.xhr.send(
                                        'https://cnc-eco.herokuapp.com/api/v1/layouts?pl=' +
                                            n +
                                            '&w=' +
                                            q +
                                            '&a=' +
                                            g,
                                        'POST',
                                        null,
                                        d._bases,
                                        h
                                    );
                                }
                            }
                        },
                    },
                });
                qx.Class.define('CncEcostorage', {
                    type: 'singleton',
                    extend: qx.core.Object,
                    members: {
                        get: function(c) {
                            c = localStorage.getItem('CncEco:' + c);
                            return null === c ? c : JSON.parse(c);
                        },
                        set: function(c, f) {
                            if (null === f || void 0 === f) return l.storage.remove(c);
                            'string' !== typeof f && (f = JSON.stringify(f));
                            return localStorage.setItem('CncEco:' + c, f);
                        },
                        remove: function(c) {
                            return localStorage.removeItem('CncEco:' + c);
                        },
                        initialize: function() {
                            try {
                                h('CncEcostorage loadet');
                            } catch (c) {
                                h(c);
                            }
                        },
                    },
                });
                qx.Class.define('CncEcoReports', {
                    type: 'singleton',
                    extend: qx.core.Object,
                    statics: {
                        ResourceTypes: {},
                    },
                    defer: function(statics) {
                        // var fileManager = ClientLib.File.FileManager.GetInstance();
                        statics.ResourceTypes[
                            ClientLib.Base.EResourceType.Tiberium
                            ] = 1; // fileManager.GetPhysicalPath('ui/common/icn_res_tiberium.png');
                        statics.ResourceTypes[
                            ClientLib.Base.EResourceType.Crystal
                            ] = 1; // fileManager.GetPhysicalPath('ui/common/icn_res_chrystal.png');
                        statics.ResourceTypes[
                            ClientLib.Base.EResourceType.Gold
                            ] = 1; // fileManager.GetPhysicalPath('ui/common/icn_res_dollar.png');
                        statics.ResourceTypes[
                            ClientLib.Base.EResourceType.Power
                            ] = 1; // fileManager.GetPhysicalPath('ui/common/icn_res_power.png');
                        statics.ResourceTypes[
                            ClientLib.Base.EResourceType.ResearchPoints
                            ] = 1; // fileManager.GetPhysicalPath('ui/common/icn_res_research.png');
                        // const savedReports = CncEcostorage.getInstance().get('reports') || {}
                        // const date = new Date();
                        // date.setDate(date.getDate() - 15);
                        //
                        // Object.keys(savedReports).forEach(id => {
                        //     console.log(id, savedReports[id], data)
                        // })
                        //
                        // CncEcostorage.getInstance().set('reports', savedReports)
                    },
                    members: {
                        reports: null,
                        newReports: [],
                        init: function() {
                            this.destroy()
                            const reports = ClientLib.Data.MainData.GetInstance().get_Reports();
                            this.reports = reports;
                            console.log('init reports', reports)

                            phe.cnc.Util.attachNetEvent(
                                reports,
                                'ReportsDelivered',
                                ClientLib.Data.Reports.ReportsDelivered,
                                this,
                                this.onReportsDelivered
                            );
                        },
                        destroy: function() {
                            phe.cnc.Util.detachNetEvent(
                                ClientLib.Data.MainData.GetInstance().get_Reports(),
                                'ReportDelivered',
                                ClientLib.Data.Reports.ReportDelivered,
                                this,
                                this.onReportDelivered
                            );
                        } ,
                        onReportsDelivered: function(reports) {
                            console.log('all reports delivered');
                            const savedReports = CncEcostorage.getInstance().get('reports') || {}
                            // console.log('savedReports - before', savedReports)
                            this.newReports = []; // reset reports
                            reports.forEach(report => {
                                const id = report.get_Id()
                                if(!savedReports[id]) {
                                    savedReports[id] = report.get_Time()
                                    this.newReports.push(report)
                                }
                            })
                            CncEcostorage.getInstance().set('reports', savedReports)
                            // console.log('savedReports', savedReports)
                            console.log('newReports', this.newReports)
                            this.newReports.length && this.onAllReportsLoaded()
                        },

                        onAllReportsLoaded: function() {
                            console.time('onAllReportsLoaded')
                            // console.log('all loaded reports');
                            // console.log(this.newReports);
                            if (this.newReports.length > 0) {
                                // this.newReports.forEach(report => {
                                //     this.reports.RequestReportData(report);
                                // });

                                // var attackerBaseIds = [];
                                // var defenderBaseIds = [];
                                var repairTimeCosts = 0;
                                var minCommandPointCosts = 0;
                                var maxCommandPointCosts = 0;
                                // var firstAttack = null;
                                // var lastAttack = 0;

                                var loot = {};
                                var getTotalLootMethod, getRepairCostsMethod;

                                var reports = [];

                                // off
                                const { CombatReport } = ClientLib.Data.Reports;
                                if (
                                    this.newReports[0].get_PlayerReportType() ===
                                    ClientLib.Data.Reports.EPlayerReportType.CombatOffense
                                ) {
                                    getTotalLootMethod =
                                        CombatReport.prototype.GetAttackerTotalResourceReceived;
                                    getRepairCostsMethod = CombatReport.prototype.GetAttackerRepairCosts;
                                }
                                // def
                                else {
                                    getTotalLootMethod =
                                        CombatReport.prototype.GetDefenderTotalResourceCosts;
                                    getRepairCostsMethod = CombatReport.prototype.GetDefenderRepairCosts;
                                }

                                // init sever configs for cp costs
                                var server = ClientLib.Data.MainData.GetInstance().get_Server();
                                var player = ClientLib.Data.MainData.GetInstance().get_Player();
                                var combatCostMinimum = server.get_CombatCostMinimum();
                                var combatCostMinimumPvP = server.get_UsesRebalancingI()
                                    ? server.get_PvPCombatCostMinimum()
                                    : combatCostMinimum;
                                var combatCostPerFieldInside = server.get_CombatCostPerField();
                                var combatCostPerFieldOutside = server.get_CombatCostPerFieldOutsideTerritory();

                                // console.log({player, server})

                                // loop through all reports
                                for (var i = 0; i < this.newReports.length; i++) {
                                    var report = this.newReports[i];
                                    // console.log({ report });

                                    var rapport = {};
                                    rapport.id = report.get_Id();

                                    if (!(report instanceof CombatReport)) {
                                        continue;
                                    }

                                    rapport.attackerBaseId = report.get_AttackerBaseId();
                                    rapport.defenderBaseId = report.get_DefenderBaseId();

                                    // if (attackerBaseIds.indexOf(report.get_AttackerBaseId()) === -1) {
                                    //     attackerBaseIds.push(report.get_AttackerBaseId());
                                    // }
                                    //
                                    // if (defenderBaseIds.indexOf(report.get_DefenderBaseId()) === -1) {
                                    //     defenderBaseIds.push(report.get_DefenderBaseId());
                                    // }

                                    // add repair time
                                    repairTimeCosts += report.GetAttackerMaxRepairTime();
                                    rapport.maxRep = report.GetAttackerMaxRepairTime();
                                    rapport.infRep = report.GetAttackerInfantryRepairCosts();
                                    rapport.vehRep = report.GetAttackerVehicleRepairCosts();
                                    rapport.airRep = report.GetAttackerAirRepairCosts();

                                    var distance = Math.sqrt(
                                        Math.pow(
                                            report.get_AttackerBaseXCoord() -
                                            report.get_DefenderBaseXCoord(),
                                            2
                                        ) +
                                        Math.pow(
                                            report.get_AttackerBaseYCoord() -
                                            report.get_DefenderBaseYCoord(),
                                            2
                                        )
                                    );

                                    rapport.distance = distance; // total distane between coords
                                    let cost
                                    switch (report.get_Type()) {
                                        case ClientLib.Data.Reports.EReportType.Combat: // 1, pvp
                                            var isFriendlyTerritory =
                                                report.get_AttackerAllianceName() ===
                                                report.get_DefenderAllianceName();
                                            cost = Math.floor(
                                                combatCostMinimumPvP +
                                                (isFriendlyTerritory
                                                    ? combatCostPerFieldInside
                                                    : combatCostPerFieldOutside) *
                                                distance
                                            );
                                            // minCommandPointCosts += cost;
                                            // maxCommandPointCosts += cost;
                                            rapport.def = true;
                                            rapport.minCp = cost;
                                            rapport.maxCp = cost;
                                            break;
                                        case ClientLib.Data.Reports.EReportType.NPCRaid: // 2, pvp
                                            switch (parseInt(report.get_DefenderBaseName(), 10)) {
                                                case ClientLib.Data.Reports.ENPCCampType.Base: // 4
                                                case ClientLib.Data.Reports.ENPCCampType.Fortress: // 6
                                                    cost = Math.floor(
                                                        combatCostMinimum +
                                                        combatCostPerFieldOutside * distance
                                                    );
                                                    // minCommandPointCosts += cost;
                                                    // maxCommandPointCosts += cost;
                                                    rapport.off = true;
                                                    rapport.minCp = cost;
                                                    rapport.maxCp = cost;
                                                    break;
                                                default:
                                                    const minCp = Math.floor(
                                                        combatCostMinimum +
                                                        combatCostPerFieldInside * distance
                                                    );
                                                    const maxCp = Math.floor(
                                                        combatCostMinimum +
                                                        combatCostPerFieldOutside * distance
                                                    );
                                                    // minCommandPointCosts += minCp;
                                                    // maxCommandPointCosts += maxCp;
                                                    rapport.off = true;
                                                    rapport.minCp = minCp;
                                                    rapport.maxCp = maxCp;
                                            }
                                            break;
                                        case ClientLib.Data.Reports.EReportType.NPCPlayerCombat: // 5
                                            // No repair time or command point cost for Forgotten attacks
                                            break;
                                        default:
                                            throw 'Unexpected report type (' + report.get_Type() + ')';
                                    }

                                    rapport.time = report.get_Time();

                                    /**
                                     @discroption: calc the loot with out the rep res costs
                                     */
                                    for (var resourceType in CncEcoReports.ResourceTypes) {
                                        var resourceCount =
                                            getTotalLootMethod.call(report, resourceType) -
                                            getRepairCostsMethod.call(report, resourceType);

                                        if (resourceCount !== 0) {
                                            if (!(resourceType in loot)) {
                                                loot[resourceType] = 0;
                                            }

                                            loot[resourceType] += resourceCount;
                                        }
                                    }
                                    rapport.loot = loot;

                                    reports.push(rapport);
                                }

                                // console.log({
                                //     server,
                                //     player,
                                //     combatCostMinimum,
                                //     combatCostMinimumPvP,
                                //     combatCostPerFieldInside,
                                //     combatCostPerFieldOutside,
                                //
                                //     minCommandPointCosts,
                                //     maxCommandPointCosts,
                                //     // firstAttack,
                                //     // lastAttack,
                                //     getTotalLootMethod,
                                //     getRepairCostsMethod,
                                //
                                //     // attackerBaseIds, // id off attacker bases, the player pvp attacker maybe
                                //     // defenderBaseIds,    // id of defender bases, the bases who got attacked, maybe the player also in pvp
                                //
                                //     repairTimeCosts, // total time in s
                                //     loot, //
                                // });
                                //
                                // console.warn('All reports');

                                fetch('https://cnc-eco.herokuapp.com/api/v1/reports/update', {
                                // fetch('http://localhost:8000/api/v1/reports/update', {
                                    method: 'POST',
                                    headers: {
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        reports,
                                        world: server.get_WorldId(),
                                        player: player.get_Name(),
                                        playerId: player.get_Id(),
                                        accountId: player.get_AccountId(),
                                    })
                                }).then(async r => {
                                    const data = await r.json()
                                    console.log('all reports delivered', reports, data)
                                }).catch(e => console.warn(e))
                            }
                            console.timeEnd('onAllReportsLoaded')
                        },

                        initialize: function() {
                            this.init();
                            try {
                                h('CncEcoReports loaded');
                            } catch (c) {
                                h(c);
                            }
                        },
                    },
                });
                qx.Class.define('CncEcoxhr', {
                    type: 'singleton',
                    extend: qx.core.Object,
                    members: {
                        send: function(c, f) {
                            var b = new qx.bom.request.Xhr()._createNativeXhr();
                            b.timeout = 3e3;
                            b.onload = function() {
                                1 == b.responseText
                                    ? h('CncEcoxhr Send true!')
                                    : 0 == b.responseText
                                    ? h('CncEcoxhr is Error :: ' + b.responseText)
                                    : 1 !== b.responseText;
                                b.abort();
                            };
                            b.ontimeout = function() {
                                h('xhr timeout');
                                b.abort();
                            };
                            b.onloadend = function() {
                                h('xhr timeout');
                                b.abort();
                            };
                            b.open('POST', c, !0);
                            b.setRequestHeader('Method', 'POST');
                            b.setRequestHeader('Content-Type', 'application/json');
                            b.send(JSON.stringify(f));
                        },
                        initialize: function() {
                            try {
                                h('CncEcoxhr loadet');
                            } catch (c) {
                                h(c);
                            }
                        },
                    },
                });
                l.xhr = {
                    _load: !1,
                    _xhr: null,
                    _timeout: 3e3,
                    start: function() {
                        var c = null;
                        if (window.XMLHttpRequest) c = new XMLHttpRequest();
                        else if (window.ActiveXObject)
                            try {
                                c = new ActiveXObject('Msxml2.XMLHTTP.6.0');
                            } catch (f) {
                                try {
                                    c = new ActiveXObject('Msxml2.XMLHTTP.3.0');
                                } catch (b) {
                                    h(b);
                                }
                            }
                        if (null === c) return !1;
                        l.xhr._load = !0;
                        l.xhr._xhr = c;
                        l.xhr._xhr.timeout = l.xhr._timeout;
                        return l.xhr._load;
                    },
                    send: function(c, f, b, d, g) {
                        try {
                            if (null !== l.xhr._xhr)
                                if (!1 !== l.xhr._load && null !== l.xhr._xhr) {
                                    l.xhr._xhr.open(f, c, !0);
                                    if (null !== b && 'object' == typeof b)
                                        for (var n in b)
                                            b[n].hasOwnProperty('name') &&
                                                b[n].hasOwnProperty('value') &&
                                                l.xhr._xhr.setRequestHeader(b[n].name, b[n].value);
                                    l.xhr._xhr.onload = function() {
                                        try {
                                            4 == l.xhr._xhr.readyState &&
                                                200 == l.xhr._xhr.status &&
                                                'function' == typeof g &&
                                                g(l.xhr._xhr.responseText);
                                        } catch (q) {
                                            h(q);
                                        }
                                    };
                                    null !== d
                                        ? ('stringify' == JSON.isjson(d) &&
                                              !0 === Array.isarray(d)) ||
                                          (!0 === Object.isobj(d) && 'stringify' == JSON.isjson(d))
                                            ? l.xhr._xhr.send(JSON.stringify(d))
                                            : h(e)
                                        : l.xhr._xhr.send(null);
                                } else alert('Ihr Browser unterstuetzt kein Ajax!');
                        } catch (q) {
                            h(q);
                        }
                    },
                };
                qx.Class.define('CncEcoScanner.Layout.window', {
                    type: 'singleton',
                    extend: qx.ui.window.Window,
                    construct: function() {
                        try {
                            this.base(arguments),
                                this.setWidth(925),
                                this.setHeight(700),
                                this.setContentPadding(10),
                                this.setShowMinimize(!1),
                                this.setShowMaximize(!0),
                                this.setShowClose(!0),
                                this.setResizable(!0),
                                this.setAllowMaximize(!0),
                                this.setAllowMinimize(!1),
                                this.setAllowClose(!0),
                                this.setShowStatusbar(!1),
                                this.setDecorator(null),
                                this.setPadding(10),
                                this.setLayout(new qx.ui.layout.Grow()),
                                this.addListener(
                                    'close',
                                    function() {
                                        this.active = !1;
                                        this.row = 0;
                                        this.ZW = [];
                                        this.removeAll();
                                        this.ZZ = new qx.ui.container.Scroll();
                                        this.ZY = new qx.ui.container.Composite(
                                            new qx.ui.layout.Flow()
                                        );
                                        this.add(this.ZZ, { flex: 3 });
                                        this.ZZ.add(this.ZY);
                                    },
                                    this
                                ),
                                (this.ZW = []),
                                this.removeAll(),
                                (this.ZZ = new qx.ui.container.Scroll()),
                                (this.ZY = new qx.ui.container.Composite(new qx.ui.layout.Flow())),
                                this.add(this.ZZ, { flex: 3 }),
                                this.ZZ.add(this.ZY);
                        } catch (c) {
                            console.debug('CncEcoScanner.Layout.window construct: ', c);
                        }
                    },
                    members: {
                        ZW: null,
                        ZZ: null,
                        ZY: null,
                        ZX: null,
                        row: 0,
                        openWindow: function(c, f, b) {
                            try {
                                '' !== c && this.setCaption(c),
                                    this.isVisible() && null === f
                                        ? this.close()
                                        : null !== b
                                        ? (this.open(), this.moveTo(30, 100))
                                        : (this.open(),
                                          this.moveTo(30, 100),
                                          null !== f ? this.FO(f) : this.FO());
                            } catch (S) {
                                console.log('CncEcoScanner.Layout.window.openWindow: ', S);
                            }
                        },
                        listener: function(c) {
                            var f = qx.core.Init.getApplication();
                            f.getBackgroundArea().closeCityInfo();
                            f.getPlayArea().setView(
                                ClientLib.Data.PlayerAreaViewMode.pavmCombatSetupDefense,
                                c,
                                0,
                                0
                            );
                            f = ClientLib.Data.MainData.GetInstance()
                                .get_Cities()
                                .get_CurrentOwnCity();
                            null != f &&
                                f.get_CityArmyFormationsManager().set_CurrentTargetBaseId(c);
                        },
                        FO: function(c) {
                            try {
                                if (!0 !== this.active)
                                    return setTimeout(function() {
                                        this.openWindow('', c);
                                    }, 90);
                                var f = {
                                        '.':
                                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURQAAAKd6PdoAAAABdFJOUwBA5thmAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==',
                                        c:
                                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAGMUExURQAAAJvj+p3l+57m+5vj+prj+p7m+5nh+pni+pri+pni+pri+pvj+5ri+pzl+57n+57m+5ff+Z7m+5nh+qDv/Zvj+57m+6Hr/KL6/pni+p30/Zrl+53z/aLt/KL9/pf0/Zn3/Zv4/pfr+6L0/Zf3/Z7n+5fs+6L1/Zf6/qL8/qL2/pfm+qLw/AlQf5n8/BJVbwlTq3HQ05P29wRFaGzY3hZnhAtRn4zu7h2JtBVxnQMtShFidgZMdQdIk5/9/gY7eQI5YAY9lgY6QghmnAZIUQtUlUe26RmQzwhHXAqAvBFzwg9WjRXM4AtpkTGZowtbZwQscWSt3SuF2SiKk3/j5pLb8WD29UiZpFzR1VzP4htnmjS0xiVpdR2VswpIiSCb6Tap6Ac1g33s7kCq0CeDswQxYjSx2cf2/GrQ6x5mrGfH8izk9UzCyzWEmyuouw+XpAuPyi6ApDqLkF7GzWS9wxbD8TKJzEmPwB+x7ShDQRS90zKGmXHl9wdYtX3M6KHo+k6stWzoymS0yB9GXksjNTkAAAAzdFJOUwAHHxQLFxsBBQMkDQkoMUZCTyw3fBA9VOVYqWWhS/W53sh3sM9ok43r2b52cP///////t3sG3QAAAIISURBVCjPrZJVc9tAFEazwpVkkRljOw23smzZlpkZYjvMzFBmTOGPd5VkAtO+dKb3UWe+785dnaGhfxgazd8Jw0ATQQDIPOQ0AwEAhI2kMIy0EfBBBKLvCJgtksdq4UmCuZeDNooVJbvoGPMvRPyimQR3xQxBCVYt5LY+ckbWkwm3yHJ3UYibfVNHmyHnwupSvfE0MWIhb7fSJkzyxpZ29rW1xcW5udRyUEbRm2KG4x1TK1p9O7ZWa8/OJjcSjy0kuKEMLow568c7794fhPVOPK4mxmXeBq7XQkrKx051vVR4Ga4pivJZC3jtmA1et7KO/MZhKVwqbClKLhv9Hll+My6QwGAAFzzTkfRgd1dVy9Fcpv3tx+r+qISZjFIOEyece83BYGbzeTodz54eX54dTMosgSAKPgldrMd/9T91u61oOqe3z05mQjLPGUdS9umLlLqlds/P31aKh/rX2s8jBI0kTWBivpct6J3Glw/blWIh11H6/VdBu7GTIbCJlUyxFC5+TDVeVNRqtdXqRUZHzDg6hTFRPi2WiSrJeLmZypab0eTJpNclUMbb0wDnHW6tF8sP7z3LVOfnX4f8HhExSF+dQpkla9BrRT9seDgQcHtkC0sSVwxZwJFIAbsk+hwul0uWBJbkIHPrD+BsOEliGMvzPEvhHLhvGI38YiAESD3C9Id8/31+A0POUa1xABFzAAAAAElFTkSuQmCC',
                                        t:
                                            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAGbUExURQAAAJri+pvj+prj+pnh+pjg+prj+pjh+pri+pzk+5rj+pni+pzl+5ri+pjh+pnh+prj+pnh+pni+pni+pjw/Jzl+5/s/Jrn+5ff+Zzl+5fz/Z/p/Jzw/Zf0/Jrm+5r3/aL4/Zfh+p7t/Jvt/Jv1/Zfv/Jvw/Jf6/aL6/gtsLQ6IVBKiXghkNm/Sw5H49ARQHJj7+g+FNwhdLYzx7ByrThCNQXvo1w1/OAt2NSvNZhKgRxCdURFyPAdlJRe/ZA2TToPt4y+yZxBsNh2YXA6RW2jcvxW3TTXykCqAWkachqD+/oLk3UeogUCeeWDEplSxnCJwVBKlWBqPNwMyFA2SKAqAUhyGPn71qDSTYhxfPC/liFHFdiTjbqr4sFnFiyCWSRCaQzrCfg1/Rz3ubGj0sVbTp7v7yBC8LBvmNBNKOSrtbxLKKV7xgkvenV3AoHzZzk6/mFHXTAtXLGndrVq5Wcr8zUvvjF+9e2HkmnTmr0fWem7m0C2nfxnVSFKPbRvUakbehimOUz3ORRbDbmveyTnfjnH1hFnMph+1ZunFEtoAAAApdFJOUwAUEBgJCw4CBAYkKC4bPR80RzddoExze1NB0FWIxWrv1GWUmdyvu93GYZ5Q7AAAAgFJREFUKM+tUtVy2wAQjJhZZrZjJ5LMzAxhJoeZy8zc767kNqk7zVOn+3g7eze3uyMj/wcYhuvA7poSBAICEAAixB80TsAoCAAMSYsiTzEoMawjQIikad5mkuSxoEPkUHxIiHK0edzpNvu92cZ9lyQy8O/FBMQ74gdZrzf+5NFR+oHLSoG3UgylTKHOUSFVL+ys9wpr004Wur2KA6I5/vl779vXva3N4+3ijN1KoTcPEYwQqF+f9o5PtHR6q7u04TGzDPJrMUw6xt9s7lZbbxvVUiKRn/UE3TSEDKQ4SJujfVX7oqmt4mIpo8xFIymJAvDBk5DNMjURbmtqrhkr1fL7L56mOzLLwMZFkHL4PZOPV9XESmW5vJZ/9Wzn+YnLROokBjOscyp70FxQzq7OcrGyuvFy/XXLY6UQ40nSFN9dShz2r87P32XCYW2xcVrIxK2kQYK0L6qUD9XM5fXldjPZ1mr5vZWJMYGDB6Q8p6y2tYv3Hz90c+GkUswpkyk/b5ike+eMLITVWvKiv99txmKV6r2U3cKSRjIYwrFydDb5MBv5lKwsx5SZ+mhAYklgEAwBUDaLfdoeckU78/ORyKjsM/Ec+DM0HIFIUXBLPrcl6ArJAUngSQC58R2HQYgjKZpnbYIgsDQHDJcI0ysEI3qJGB0ACBPYHb00+vd3Mf8JPwDEQVFKmgSbiAAAAABJRU5ErkJggg==',
                                    },
                                    b,
                                    d = CncEcoScanner.getInstance()._bases;
                                null !== c && (d = c);
                                for (b in d) {
                                    var g = d[b].layout,
                                        n = g.match(/t/g).length,
                                        l = g.match(/c/g).length;
                                    switch (
                                        ClientLib.Data.MainData.GetInstance()
                                            .get_Player()
                                            .get_Faction()
                                    ) {
                                        case ClientLib.Base.EFactionType.GDIFaction:
                                            var k = 'G';
                                            break;
                                        case ClientLib.Base.EFactionType.NODFaction:
                                            k = 'N';
                                    }
                                    for (
                                        var h =
                                                'https://www.cnc-eco.de/b/map=2|' +
                                                k +
                                                '|' +
                                                k +
                                                '||' +
                                                g +
                                                '....................................|newEconomy',
                                            p =
                                                '<table border="2" cellspacing="0" cellpadding="0" onclick="CncEcoScanner.Layout.window.getInstance().listener(' +
                                                d[b].id +
                                                ')">',
                                            p =
                                                p +
                                                ('<tr><td colspan="9"><font color="#FFF">' +
                                                    d[b].x +
                                                    ':' +
                                                    d[b].y +
                                                    '&nbsp;&nbsp;<img width="14" height="14" src="' +
                                                    f.t +
                                                    '"> ' +
                                                    n +
                                                    ' &nbsp;&nbsp; <img width="14" height="14" src="' +
                                                    f.c +
                                                    '"> ' +
                                                    l +
                                                    '</font></td></tr>'),
                                            r = 0;
                                        72 > r;
                                        r++
                                    ) {
                                        var x = r - 9 * Math.floor(r / 9);
                                        0 == x && (p += '<tr>');
                                        p +=
                                            '<td><img width="14" height="14" src="' +
                                            f[g.charAt(r)] +
                                            '"></td>';
                                        8 == x && (p += '</tr>');
                                    }
                                    p +=
                                        '</table><a href="' +
                                        h +
                                        '" target="_blank" style="color:#FFFFFF;">CnCEco';
                                    this.resourceLayout = new qx.ui.basic.Label().set({
                                        backgroundColor: '#303030',
                                        value: p,
                                        padding: 10,
                                        rich: !0,
                                    });
                                    7 == n
                                        ? this.resourceLayout.setBackgroundColor('#202820')
                                        : 5 == n &&
                                          this.resourceLayout.setBackgroundColor('#202028');
                                    this.ZW.push(this.resourceLayout);
                                }
                                this.ZY.removeAll();
                                k = 0;
                                this.row > k && (k = this.row);
                                for (a = f = 0; a < this.ZW.length; a++)
                                    this.ZY.add(this.ZW[a], { row: k, column: f }),
                                        f++,
                                        5 < f && ((f = 0), k++, this.row++);
                            } catch (m) {
                                console.log(m);
                            }
                        },
                    },
                });
                qx.Class.define('CncEcoHIDE.window.container', {
                    extend: qx.ui.container.Composite,
                    construct: function(c) {
                        try {
                            qx.ui.container.Composite.call(this);
                            this.set({
                                layout: new qx.ui.layout.VBox(5),
                                padding: 5,
                                decorator: 'pane-light-opaque',
                            });
                            switch (c) {
                                case 'o':
                                    console.log('add container o');
                                    this.add(
                                        new qx.ui.basic.Label('Hide Outposts').set({
                                            alignX: 'center',
                                            font: 'font_size_14_bold',
                                        })
                                    );
                                    var f = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                                    f.add(
                                        new qx.ui.basic.Label(this.tr('level < ')).set({
                                            alignY: 'middle',
                                        })
                                    );
                                    f.add(
                                        (this.oLevel = new qx.ui.form.Spinner(1).set({
                                            maximum: 65,
                                            minimum: 1,
                                        }))
                                    );
                                    this.oLevel.addListener('changeValue', this.onInputo, this);
                                    f.add(
                                        (this.btnLevelo = new qx.ui.form.Button('del').set({
                                            toolTipText: 'delete outposts from view',
                                        }))
                                    );
                                    this.btnLevelo.addListener('execute', this.delo, this);
                                    f.add(
                                        (this.btnhideo = new qx.ui.form.Button('hide').set({
                                            toolTipText: 'hide targetinfo from view',
                                        }))
                                    );
                                    this.btnhideo.addListener('execute', this.hideo, this);
                                    this.add(f);
                                    break;
                                case 'c':
                                    console.log('add container c');
                                    this.add(
                                        new qx.ui.basic.Label('Hide Camps').set({
                                            alignX: 'center',
                                            font: 'font_size_14_bold',
                                        })
                                    );
                                    f = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                                    f.add(
                                        new qx.ui.basic.Label(this.tr('level < ')).set({
                                            alignY: 'middle',
                                        })
                                    );
                                    f.add(
                                        (this.cLevel = new qx.ui.form.Spinner(1).set({
                                            maximum: 65,
                                            minimum: 1,
                                        }))
                                    );
                                    this.cLevel.addListener('changeValue', this.onInputc, this);
                                    f.add(
                                        (this.btnLevelc = new qx.ui.form.Button('del').set({
                                            toolTipText: 'delete camps from view',
                                        }))
                                    );
                                    this.btnLevelc.addListener('execute', this.delc, this);
                                    f.add(
                                        (this.btnhidec = new qx.ui.form.Button('hide').set({
                                            toolTipText: 'hide targetinfo from view',
                                        }))
                                    );
                                    this.btnhidec.addListener('execute', this.hidec, this);
                                    this.add(f);
                                    break;
                                case 'b':
                                    console.log('add container b');
                                    this.add(
                                        new qx.ui.basic.Label('Hide Bases').set({
                                            alignX: 'center',
                                            font: 'font_size_14_bold',
                                        })
                                    );
                                    f = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                                    f.add(
                                        new qx.ui.basic.Label(this.tr('level < ')).set({
                                            alignY: 'middle',
                                        })
                                    );
                                    f.add(
                                        (this.bLevel = new qx.ui.form.Spinner(1).set({
                                            maximum: 47,
                                            minimum: 1,
                                        }))
                                    );
                                    this.bLevel.addListener('changeValue', this.onInputb, this);
                                    f.add(
                                        (this.btnLevelb = new qx.ui.form.Button('del').set({
                                            toolTipText: 'delete bases from view',
                                        }))
                                    );
                                    this.btnLevelb.addListener('execute', this.delb, this);
                                    f.add(
                                        (this.btnhideb = new qx.ui.form.Button('hide').set({
                                            toolTipText: 'hide targetinfo from view',
                                        }))
                                    );
                                    this.btnhideb.addListener('execute', this.hideb, this);
                                    this.add(f);
                                    break;
                                case 'p':
                                    console.log('add container p');
                                    this.add(
                                        new qx.ui.basic.Label('Hide Player').set({
                                            alignX: 'center',
                                            font: 'font_size_14_bold',
                                        })
                                    );
                                    f = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
                                    f.add(
                                        new qx.ui.basic.Label(this.tr('level < ')).set({
                                            alignY: 'middle',
                                        })
                                    );
                                    f.add(
                                        (this.pLevel = new qx.ui.form.Spinner(1).set({
                                            maximum: 65,
                                            minimum: 1,
                                        }))
                                    );
                                    this.pLevel.addListener('changeValue', this.onInputp, this);
                                    f.add(
                                        (this.btnLevelp = new qx.ui.form.Button('del').set({
                                            toolTipText: 'delete player from viev',
                                        }))
                                    );
                                    this.btnLevelp.addListener('execute', this.delp, this);
                                    f.add(
                                        (this.btnhidep = new qx.ui.form.Button('hide').set({
                                            toolTipText: 'hide targetinfo from view',
                                        }))
                                    );
                                    this.btnhidep.addListener('execute', this.hidep, this);
                                    this.add(f);
                                    break;
                                case 'reset':
                                    console.log('add container p');
                                    this.add(
                                        new qx.ui.basic.Label('Reset all').set({
                                            alignX: 'center',
                                            font: 'font_size_14_bold',
                                        })
                                    );
                                    f = new qx.ui.container.Composite(
                                        new qx.ui.layout.HBox(5, 'center')
                                    );
                                    f.add(
                                        (this.btnReset = new qx.ui.form.Button('reset').set({
                                            toolTipText: 'Reset view',
                                        }))
                                    );
                                    this.btnReset.addListener('execute', this.reset, this);
                                    this.add(f);
                                    break;
                                default:
                                    console.log('add container default'),
                                        this.add(
                                            new qx.ui.basic.Label('Hide all').set({
                                                alignX: 'center',
                                                font: 'font_size_14_bold',
                                            })
                                        ),
                                        (f = new qx.ui.container.Composite(
                                            new qx.ui.layout.HBox(5)
                                        )),
                                        f.add(
                                            new qx.ui.basic.Label(this.tr('level < ')).set({
                                                alignY: 'middle',
                                            })
                                        ),
                                        f.add(
                                            (this.aLevel = new qx.ui.form.Spinner(1).set({
                                                maximum: 65,
                                                minimum: 1,
                                            }))
                                        ),
                                        this.aLevel.addListener('changeValue', this.onInputa, this),
                                        f.add(
                                            (this.btnLevela = new qx.ui.form.Button('del').set({
                                                toolTipText: 'delete all targets from view',
                                            }))
                                        ),
                                        this.btnLevela.addListener('execute', this.dela, this),
                                        f.add(
                                            (this.btnhidea = new qx.ui.form.Button('hide').set({
                                                toolTipText: 'hide targetinfo from view',
                                            }))
                                        ),
                                        this.btnhidea.addListener('execute', this.hidea, this),
                                        this.add(f);
                            }
                            this.dirtySectors = {};
                        } catch (b) {
                            console.log(
                                'Error setting up CncEcoHIDE.window.container Constructor: '
                            ),
                                console.log(b.toString());
                        }
                    },
                    destruct: function() {},
                    members: {
                        dirtySectors: null,
                        oLevel: null,
                        btnHideCurrent: null,
                        btndelCurrent: null,
                        cLevel: null,
                        bLevel: null,
                        pLevel: null,
                        aLevel: null,
                        btnLevelo: null,
                        btnLevelc: null,
                        btnLevelb: null,
                        btnLevelp: null,
                        btnLevela: null,
                        btnReset: null,
                        btnhideo: null,
                        btnhidec: null,
                        btnhideb: null,
                        btnhidep: null,
                        btnhidea: null,
                        markDirty: function(c) {
                            c.get_Id() in this.dirtySectors ||
                                (this.dirtySectors[c.get_Id()] = { alliance: [], player: [] });
                        },
                        onTick: function() {
                            this.onInput();
                        },
                        onInputo: function() {
                            this.onInput('o');
                        },
                        onInputc: function() {
                            this.onInput('c');
                        },
                        onInputb: function() {
                            this.onInput('b');
                        },
                        onInputp: function() {
                            this.onInput('p');
                        },
                        onInputa: function() {
                            this.onInput('a');
                        },
                        hideo: function() {
                            this.hide('o');
                        },
                        hidec: function() {
                            this.hide('c');
                        },
                        hideb: function() {
                            this.hide('b');
                        },
                        hidep: function() {
                            this.hide('p');
                        },
                        hidea: function() {
                            this.hide('a');
                        },
                        delo: function() {
                            this.del('o');
                        },
                        delc: function() {
                            this.del('c');
                        },
                        delb: function() {
                            this.del('b');
                        },
                        delp: function() {
                            this.del('p');
                        },
                        dela: function() {
                            this.del('a');
                        },
                        onInput: function(c) {
                            switch (c) {
                                case 'o':
                                    var f = parseInt(this.oLevel.getValue(), 10);
                                    break;
                                case 'c':
                                    f = parseInt(this.cLevel.getValue(), 10);
                                    break;
                                case 'p':
                                    f = parseInt(this.pLevel.getValue(), 10);
                                    break;
                                case 'b':
                                    f = parseInt(this.bLevel.getValue(), 10);
                                    break;
                                case 'a':
                                    f = parseInt(this.aLevel.getValue(), 10);
                            }
                            console.log('value is ' + f + ' from ' + c);
                        },
                        del: function(c) {
                            for (
                                var f = ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .get_CurrentOwnCity(),
                                    b = f.get_X(),
                                    f = f.get_Y(),
                                    d = ClientLib.Data.MainData.GetInstance().get_World(),
                                    g = ClientLib.Vis.VisMain.GetInstance().get_Region(),
                                    n = b - 16;
                                n < b + 16;
                                n++
                            )
                                for (var l = f - 16; l < f + 16; l++) {
                                    var k = g.GetObjectFromPosition(
                                        n * g.get_GridWidth(),
                                        l * g.get_GridHeight()
                                    );
                                    if (null != k) {
                                        var h = d.GetWorldSectorByCoords(n, l);
                                        'function' === typeof k.get_BaseLevel &&
                                            (k.get_VisObjectType() ==
                                                ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp &&
                                                (2 === k.get_CampType() &&
                                                    'c' == c &&
                                                    Math.floor(k.get_BaseLevel()) <
                                                        parseInt(this.cLevel.getValue(), 10) &&
                                                    (k.Dispose(), this.markDirty(h)),
                                                3 === k.get_CampType() &&
                                                    'o' == c &&
                                                    Math.floor(k.get_BaseLevel()) <
                                                        parseInt(this.oLevel.getValue(), 10) &&
                                                    (k.Dispose(), this.markDirty(h)),
                                                0 === k.get_CampType() &&
                                                    (k.Dispose(), this.markDirty(h))),
                                            k.get_VisObjectType() ==
                                                ClientLib.Vis.VisObject.EObjectType
                                                    .RegionCityType &&
                                                'p' == c &&
                                                Math.floor(k.get_BaseLevel()) <
                                                    parseInt(this.pLevel.getValue(), 10) &&
                                                !k.IsOwnBase() &&
                                                (k.Dispose(), this.markDirty(h)),
                                            k.get_VisObjectType() ==
                                                ClientLib.Vis.VisObject.EObjectType.RegionNPCBase &&
                                                'b' == c &&
                                                Math.floor(k.get_BaseLevel()) <
                                                    parseInt(this.bLevel.getValue(), 10) &&
                                                (k.Dispose(), this.markDirty(h)),
                                            'a' == c &&
                                                Math.floor(k.get_BaseLevel()) <
                                                    parseInt(this.aLevel.getValue(), 10) &&
                                                ('function' === typeof k.IsOwnBase
                                                    ? k.IsOwnBase() ||
                                                      (k.Dispose(), this.markDirty(h))
                                                    : (k.Dispose(), this.markDirty(h))));
                                    }
                                }
                            console.log(this.dirtySectors);
                        },
                        hide: function(c) {
                            for (
                                var f = ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .get_CurrentOwnCity(),
                                    b = f.get_X(),
                                    f = f.get_Y(),
                                    d = ClientLib.Vis.VisMain.GetInstance().get_Region(),
                                    g = b - 16;
                                g < b + 16;
                                g++
                            )
                                for (var l = f - 16; l < f + 16; l++) {
                                    var h = d.GetObjectFromPosition(
                                        g * d.get_GridWidth(),
                                        l * d.get_GridHeight()
                                    );
                                    null != h &&
                                        'function' === typeof h.get_BaseLevel &&
                                        (h.get_VisObjectType() ==
                                            ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp &&
                                            (2 === h.get_CampType() &&
                                                'c' == c &&
                                                Math.floor(h.get_BaseLevel()) <
                                                    parseInt(this.cLevel.getValue(), 10) &&
                                                h.HideInfos(),
                                            3 === h.get_CampType() &&
                                                'o' == c &&
                                                Math.floor(h.get_BaseLevel()) <
                                                    parseInt(this.oLevel.getValue(), 10) &&
                                                h.HideInfos(),
                                            0 === h.get_CampType() && h.HideInfos()),
                                        h.get_VisObjectType() ==
                                            ClientLib.Vis.VisObject.EObjectType.RegionCityType &&
                                            'p' == c &&
                                            Math.floor(h.get_BaseLevel()) <
                                                parseInt(this.pLevel.getValue(), 10) &&
                                            (h.IsOwnBase() || h.HideInfos()),
                                        h.get_VisObjectType() ==
                                            ClientLib.Vis.VisObject.EObjectType.RegionNPCBase &&
                                            'b' == c &&
                                            Math.floor(h.get_BaseLevel()) <
                                                parseInt(this.bLevel.getValue(), 10) &&
                                            h.HideInfos(),
                                        'a' == c &&
                                            Math.floor(h.get_BaseLevel()) <
                                                parseInt(this.aLevel.getValue(), 10) &&
                                            ('function' === typeof h.IsOwnBase
                                                ? h.IsOwnBase() || h.HideInfos()
                                                : h.HideInfos()));
                                }
                        },
                        reset: function(c) {
                            console.log('reset view');
                            this.showAll();
                        },
                        showAll: function() {
                            try {
                                ClientLib.Vis.VisMain.GetInstance()
                                    .get_Region()
                                    .ShowAllPlates();
                            } catch (c) {
                                console.log(c);
                            }
                        },
                    },
                });
                qx.Class.define('CncEcoHIDE.window.Window', {
                    type: 'singleton',
                    extend: qx.ui.window.Window,
                    construct: function() {
                        try {
                            this.base(arguments),
                                this.set({
                                    layout: new qx.ui.layout.VBox().set({ spacing: 0 }),
                                    contentPadding: 5,
                                    contentPaddingTop: 0,
                                    allowMaximize: !1,
                                    showMaximize: !1,
                                    allowMinimize: !1,
                                    showMinimize: !1,
                                    resizable: !1,
                                }),
                                this.setCaption('Hide targets'),
                                this.moveTo(150, 50),
                                this.add(new CncEcoHIDE.window.container('o')),
                                this.add(new CncEcoHIDE.window.container('c')),
                                this.add(new CncEcoHIDE.window.container('b')),
                                this.add(new CncEcoHIDE.window.container('p')),
                                this.add(new CncEcoHIDE.window.container('a')),
                                this.add(new CncEcoHIDE.window.container('reset')),
                                this.addListener('appear', this.onOpen, this),
                                this.addListener('close', this.onClose, this);
                        } catch (c) {
                            console.log('Error setting up CncEcoHIDE.window.Window Constructor: '),
                                console.log(c.toString());
                        }
                    },
                    destruct: function() {},
                    members: {
                        view: {},
                        onOpen: function() {
                            console.log('Window onOpen ');
                        },
                        onClose: function() {
                            console.log('Window onClose ');
                        },
                        initialize: function() {
                            try {
                                CncEcomain.getInstance().AddMainMenu(
                                    'hide targets',
                                    function() {
                                        CncEcoHIDE.window.Window.getInstance().open();
                                    },
                                    'Alt+h'
                                ),
                                    phe.cnc.Util.attachNetEvent(
                                        ClientLib.Vis.VisMain.GetInstance(),
                                        'ViewModeChange',
                                        ClientLib.Vis.ViewModeChange,
                                        this,
                                        this.viewChangeHandler
                                    ),
                                    (this.btnHideCurrent = new qx.ui.form.Button('Hide')),
                                    this.btnHideCurrent.set({
                                        width: 50,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Hide From Map',
                                    }),
                                    this.btnHideCurrent.addListener(
                                        'click',
                                        this.hideCurrent,
                                        this
                                    ),
                                    (this.btndelCurrent = new qx.ui.form.Button('del')),
                                    this.btndelCurrent.set({
                                        width: 50,
                                        appearance: 'button-text-small',
                                        toolTipText: 'Delete From Map',
                                    }),
                                    this.btndelCurrent.addListener('click', this.delCurrent, this);
                            } catch (c) {
                                h(c);
                            }
                        },
                        viewChangeHandler: function(c, f) {
                            try {
                                var b = qx.core.Init.getApplication().getUIItem(
                                        ClientLib.Data.Missions.PATH.OVL_PLAYAREA
                                    ),
                                    d = ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .get_CurrentCity();
                                null != d &&
                                    (((this.view.ownCity =
                                        d ===
                                        ClientLib.Data.MainData.GetInstance()
                                            .get_Cities()
                                            .get_CurrentOwnCity()),
                                    this.view.ownCity || f !== ClientLib.Vis.Mode.CombatSetup)
                                        ? c === ClientLib.Vis.Mode.CombatSetup &&
                                          (b.remove(this.btnHideCurrent),
                                          b.remove(this.btndelCurrent))
                                        : (b.add(this.btnHideCurrent, { right: 1, top: 33 }),
                                          b.add(this.btndelCurrent, { right: 1, top: 60 })));
                            } catch (g) {
                                console.log(g);
                            }
                        },
                        hideCurrent: function() {
                            try {
                                var c = ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .get_CurrentCity(),
                                    d = c.get_PosX(),
                                    b = c.get_PosY(),
                                    h = ClientLib.Vis.VisMain.GetInstance().get_Region();
                                h.GetObjectFromPosition(
                                    d * h.get_GridWidth(),
                                    b * h.get_GridHeight()
                                ).HideInfos();
                                qx.core.Init.getApplication()
                                    .getMainOverlay()
                                    ._onClose();
                            } catch (g) {
                                console.log(g);
                            }
                        },
                        delCurrent: function() {
                            console.log('___________del___________');
                            try {
                                var c = ClientLib.Data.MainData.GetInstance()
                                        .get_Cities()
                                        .get_CurrentCity(),
                                    d = c.get_PosX(),
                                    b = c.get_PosY(),
                                    h = ClientLib.Vis.VisMain.GetInstance().get_Region();
                                h.GetObjectFromPosition(
                                    d * h.get_GridWidth(),
                                    b * h.get_GridHeight()
                                ).Dispose();
                                qx.core.Init.getApplication()
                                    .getMainOverlay()
                                    ._onClose();
                            } catch (g) {
                                console.log(g);
                            }
                        },
                    },
                });
                l.xhr = {
                    _load: !1,
                    _xhr: null,
                    _timeout: 3e3,
                    start: function() {
                        var c = null;
                        if (window.XMLHttpRequest) c = new XMLHttpRequest();
                        else if (window.ActiveXObject)
                            try {
                                c = new ActiveXObject('Msxml2.XMLHTTP.6.0');
                            } catch (b) {
                                try {
                                    c = new ActiveXObject('Msxml2.XMLHTTP.3.0');
                                } catch (S) {
                                    var d = { func: 'start', class: 'CncEco.xhr' };
                                    d.error = S;
                                    h(S);
                                    beta && H(S, d);
                                }
                            }
                        if (null === c) return !1;
                        l.xhr._load = !0;
                        l.xhr._xhr = c;
                        l.xhr._xhr.timeout = l.xhr._timeout;
                        return l.xhr._load;
                    },
                    send: function(c, d, b, r, g) {
                        try {
                            if (null !== l.xhr._xhr)
                                if (!1 !== l.xhr._load && null !== l.xhr._xhr) {
                                    l.xhr._xhr.open(d, c, !0);
                                    if (null !== b && 'object' == typeof b)
                                        for (var f in b)
                                            b[f].hasOwnProperty('name') &&
                                                b[f].hasOwnProperty('value') &&
                                                l.xhr._xhr.setRequestHeader(b[f].name, b[f].value);
                                    l.xhr._xhr.onload = function() {
                                        try {
                                            if (4 == l.xhr._xhr.readyState)
                                                if (200 == l.xhr._xhr.status)
                                                    if ('function' == typeof g)
                                                        g(l.xhr._xhr.responseText);
                                                    else {
                                                        var b = {
                                                            func: 'send',
                                                            class: 'CncEco.xhr',
                                                        };
                                                        var c = 'typeof callback !== function';
                                                        b.error = c;
                                                        h(c);
                                                        beta && H(c, b);
                                                    }
                                                else
                                                    (b = { func: 'send', class: 'CncEco.xhr' }),
                                                        (c = 'CncEco.xhr._xhr.status !== 200'),
                                                        (b.error = c),
                                                        h(c),
                                                        beta && H(c, b);
                                        } catch (p) {
                                            (b = {
                                                func: 'send CncEco.xhr._xhr.onreadystatechange',
                                                class: 'CncEco.xhr',
                                            }),
                                                (b.error = p),
                                                h(p),
                                                beta && H(p, b);
                                        }
                                    };
                                    l.xhr._xhr.ontimeout = function() {
                                        var b = {
                                            func: 'CncEco.xhr._xhr.onerror',
                                            class: 'CncEco.xhr',
                                            error: 'ontimeout',
                                        };
                                        h('ontimeout');
                                        beta && H('ontimeout', b);
                                    };
                                    if (null !== r)
                                        if (
                                            ('stringify' == JSON.isjson(r) &&
                                                !0 === Array.isarray(r)) ||
                                            (!0 === Object.isobj(r) &&
                                                'stringify' == JSON.isjson(r))
                                        )
                                            l.xhr._xhr.send(JSON.stringify(r));
                                        else {
                                            var q = {
                                                func: 'send',
                                                class: 'CncEco.xhr',
                                                error:
                                                    "Array.isarray(data) && JSON.isjson(data) === 'stringify' || Object.isabj(data) JSON.isjson(data) === 'stringify'",
                                            };
                                            h(
                                                "Array.isarray(data) && JSON.isjson(data) === 'stringify' || Object.isabj(data) JSON.isjson(data) === 'stringify'"
                                            );
                                            beta &&
                                                H(
                                                    "Array.isarray(data) && JSON.isjson(data) === 'stringify' || Object.isabj(data) JSON.isjson(data) === 'stringify'",
                                                    q
                                                );
                                        }
                                    else l.xhr._xhr.send(null);
                                } else alert('Ihr Browser unterstuetzt kein Ajax!');
                        } catch (k) {
                            (q = {
                                func: 'send CncEco.xhr._xhr.onreadystatechange',
                                class: 'CncEco.xhr',
                            }),
                                (q.error = k),
                                h(k),
                                beta && H(k, q);
                        }
                    },
                };
                l.xhr = l.xhr;
                l.xhr.start = l.xhr.start;
                l.xhr.name = 'CncEco.xhr';
                window.CncEco = l;
                return !0;
            }
            function X(h) {
                var l = [],
                    d;
                for (d in h)
                    if ('object' == typeof h[d] && h[d])
                        for (var c in h[d])
                            if (376877 <= PerforceChangelist) {
                                if ('object' == typeof h[d][c] && h[d][c] && 'd' in h[d][c]) {
                                    var f = h[d][c].d;
                                    if ('object' == typeof f && f)
                                        for (var b in f)
                                            'object' == typeof f[b] &&
                                                f[b] &&
                                                'get_CurrentLevel' in f[b] &&
                                                l.push(f);
                                }
                            } else if (
                                'object' == typeof h[d][c] &&
                                h[d][c] &&
                                'l' in h[d][c] &&
                                ((f = h[d][c].l), 'object' == typeof f && f)
                            )
                                for (b in f)
                                    'object' == typeof f[b] &&
                                        f[b] &&
                                        'get_CurrentLevel' in f[b] &&
                                        l.push(f);
                return l;
            }
            function V(baseId, r, d) {
                h('CNCOpt Link loaded');
                var c = {
                    selected_base: null,
                    keymap: {
                        GDI_Accumulator: 'a',
                        GDI_Refinery: 'r',
                        'GDI_Trade Center': 'u',
                        GDI_Silo: 's',
                        'GDI_Power Plant': 'p',
                        'GDI_Construction Yard': 'y',
                        GDI_Airport: 'd',
                        GDI_Barracks: 'b',
                        GDI_Factory: 'f',
                        'GDI_Defense HQ': 'q',
                        'GDI_Defense Facility': 'w',
                        'GDI_Command Center': 'e',
                        GDI_Support_Art: 'z',
                        GDI_Support_Air: 'x',
                        GDI_Support_Ion: 'i',
                        FOR_Silo: 's',
                        FOR_Refinery: 'r',
                        'FOR_Tiberium Booster': 'b',
                        'FOR_Crystal Booster': 'v',
                        'FOR_Trade Center': 'u',
                        'FOR_Defense Facility': 'w',
                        'FOR_Construction Yard': 'y',
                        FOR_Harvester_Tiberium: 'h',
                        'FOR_Defense HQ': 'q',
                        FOR_Harvester_Crystal: 'n',
                        NOD_Refinery: 'r',
                        'NOD_Power Plant': 'p',
                        NOD_Harvester: 'h',
                        'NOD_Construction Yard': 'y',
                        NOD_Airport: 'd',
                        'NOD_Trade Center': 'u',
                        'NOD_Defense HQ': 'q',
                        NOD_Barracks: 'b',
                        NOD_Silo: 's',
                        NOD_Factory: 'f',
                        NOD_Harvester_Crystal: 'n',
                        'NOD_Command Post': 'e',
                        NOD_Support_Art: 'z',
                        NOD_Support_Ion: 'i',
                        NOD_Accumulator: 'a',
                        NOD_Support_Air: 'x',
                        'NOD_Defense Facility': 'w',
                        GDI_Wall: 'w',
                        GDI_Cannon: 'c',
                        'GDI_Antitank Barrier': 't',
                        GDI_Barbwire: 'b',
                        GDI_Turret: 'm',
                        GDI_Flak: 'f',
                        'GDI_Art Inf': 'r',
                        'GDI_Art Air': 'e',
                        'GDI_Art Tank': 'a',
                        'GDI_Def_APC Guardian': 'g',
                        'GDI_Def_Missile Squad': 'q',
                        GDI_Def_Pitbull: 'p',
                        GDI_Def_Predator: 'd',
                        GDI_Def_Sniper: 's',
                        'GDI_Def_Zone Trooper': 'z',
                        'NOD_Def_Antitank Barrier': 't',
                        'NOD_Def_Art Air': 'e',
                        'NOD_Def_Art Inf': 'r',
                        'NOD_Def_Art Tank': 'a',
                        'NOD_Def_Attack Bike': 'p',
                        NOD_Def_Barbwire: 'b',
                        'NOD_Def_Black Hand': 'z',
                        NOD_Def_Cannon: 'c',
                        NOD_Def_Confessor: 's',
                        NOD_Def_Flak: 'f',
                        'NOD_Def_MG Nest': 'm',
                        'NOD_Def_Militant Rocket Soldiers': 'q',
                        NOD_Def_Reckoner: 'g',
                        'NOD_Def_Scorpion Tank': 'd',
                        NOD_Def_Wall: 'w',
                        FOR_Wall: 'w',
                        FOR_Barbwire_VS_Inf: 'b',
                        FOR_Barrier_VS_Veh: 't',
                        FOR_Inf_VS_Inf: 'g',
                        FOR_Inf_VS_Veh: 'r',
                        FOR_Inf_VS_Air: 'q',
                        FOR_Sniper: 'n',
                        FOR_Mammoth: 'y',
                        FOR_Veh_VS_Inf: 'o',
                        FOR_Veh_VS_Veh: 's',
                        FOR_Veh_VS_Air: 'u',
                        FOR_Turret_VS_Inf: 'm',
                        FOR_Turret_VS_Inf_ranged: 'a',
                        FOR_Turret_VS_Veh: 'v',
                        FOR_Turret_VS_Veh_ranged: 'd',
                        FOR_Turret_VS_Air: 'f',
                        FOR_Turret_VS_Air_ranged: 'e',
                        'GDI_APC Guardian': 'g',
                        GDI_Commando: 'c',
                        GDI_Firehawk: 'f',
                        GDI_Juggernaut: 'j',
                        GDI_Kodiak: 'k',
                        GDI_Mammoth: 'm',
                        'GDI_Missile Squad': 'q',
                        GDI_Orca: 'o',
                        GDI_Paladin: 'a',
                        GDI_Pitbull: 'p',
                        GDI_Predator: 'd',
                        GDI_Riflemen: 'r',
                        'GDI_Sniper Team': 's',
                        'GDI_Zone Trooper': 'z',
                        'NOD_Attack Bike': 'b',
                        NOD_Avatar: 'a',
                        'NOD_Black Hand': 'z',
                        NOD_Cobra: 'r',
                        NOD_Commando: 'c',
                        NOD_Confessor: 's',
                        'NOD_Militant Rocket Soldiers': 'q',
                        NOD_Militants: 'm',
                        NOD_Reckoner: 'k',
                        NOD_Salamander: 'l',
                        'NOD_Scorpion Tank': 'o',
                        'NOD_Specter Artilery': 'p',
                        NOD_Venom: 'v',
                        NOD_Vertigo: 't',
                        '<last>': '.',
                    },
                    make_sharelink: function() {
                        try {
                            var f = c.selected_base,
                                b = ClientLib.Data.MainData.GetInstance()
                                    .get_Cities()
                                    .GetCity(f),
                                l = ClientLib.Data.MainData.GetInstance()
                                    .get_Cities()
                                    .get_CurrentOwnCity(),
                                g = ClientLib.Data.MainData.GetInstance().get_Alliance(),
                                n = ClientLib.Data.MainData.GetInstance().get_Server();
                            tbase = f;
                            tcity = b;
                            scity = l;
                            f = 'http://cncopt.com/?map=';
                            f += '3|';
                            switch (b.get_CityFaction()) {
                                case 1:
                                    f += 'G|';
                                    break;
                                case 2:
                                    f += 'N|';
                                    break;
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                    f += 'F|';
                                    break;
                                default:
                                    h('cncopt: Unknown faction: ' + b.get_CityFaction()),
                                        (f += 'E|');
                            }
                            switch (l.get_CityFaction()) {
                                case 1:
                                    f += 'G|';
                                    break;
                                case 2:
                                    f += 'N|';
                                    break;
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                    f += 'F|';
                                    break;
                                default:
                                    h('cncopt: Unknown faction: ' + l.get_CityFaction()),
                                        (f += 'E|');
                            }
                            f += b.get_Name() + '|';
                            defense_units = [];
                            for (l = 0; 20 > l; ++l) {
                                var q = [];
                                for (var k = 0; 9 > k; ++k) q.push(null);
                                defense_units.push(q);
                            }
                            a: {
                                for (var u = X(b), p = 0; p < u.length; ++p)
                                    for (var x in u[p])
                                        if (u[p][x].get_UnitGameData_Obj().n in aa) {
                                            var B = u[p];
                                            break a;
                                        }
                                B = [];
                            }
                            if (376877 <= PerforceChangelist)
                                for (l in B) {
                                    var m = B[l];
                                    defense_units[m.get_CoordX()][m.get_CoordY() + 8] = m;
                                }
                            else
                                for (l = 0; l < B.length; ++l)
                                    (m = B[l]),
                                        (defense_units[m.get_CoordX()][m.get_CoordY() + 8] = m);
                            offense_units = [];
                            for (l = 0; 20 > l; ++l) {
                                q = [];
                                for (k = 0; 9 > k; ++k) q.push(null);
                                offense_units.push(q);
                            }
                            a: {
                                var A = X(b);
                                for (q = 0; q < A.length; ++q)
                                    for (var D in A[q])
                                        if (A[q][D].get_UnitGameData_Obj().n in ba) {
                                            var w = A[q];
                                            break a;
                                        }
                                w = [];
                            }
                            if (376877 <= PerforceChangelist)
                                for (l in w)
                                    (m = w[l]),
                                        (offense_units[m.get_CoordX()][m.get_CoordY() + 16] = m);
                            else
                                for (l = 0; l < w.length; ++l)
                                    (m = w[l]),
                                        (offense_units[m.get_CoordX()][m.get_CoordY() + 16] = m);
                            a: {
                                for (var t in b)
                                    if (
                                        'object' == typeof b[t] &&
                                        b[t] &&
                                        0 in b[t] &&
                                        8 in b[t] &&
                                        'object' == typeof b[t][0] &&
                                        b[t][0] &&
                                        b[t][0] &&
                                        0 in b[t][0] &&
                                        15 in b[t][0] &&
                                        'object' == typeof b[t][0][0] &&
                                        b[t][0][0] &&
                                        'BuildingIndex' in b[t][0][0]
                                    ) {
                                        var C = b[t];
                                        break a;
                                    }
                                C = null;
                            }
                            a: {
                                var v = b.get_CityBuildingsData(),
                                    z;
                                for (z in v)
                                    if (376877 <= PerforceChangelist) {
                                        if (
                                            'object' === typeof v[z] &&
                                            v[z] &&
                                            'd' in v[z] &&
                                            'c' in v[z] &&
                                            0 < v[z].c
                                        ) {
                                            var y = v[z].d;
                                            break a;
                                        }
                                    } else if ('object' === typeof v[z] && v[z] && 'l' in v[z]) {
                                        y = v[z].l;
                                        break a;
                                    }
                                y = void 0;
                            }
                            for (l = 0; 20 > l; ++l)
                                for (row = [], k = 0; 9 > k; ++k) {
                                    var E = 16 < l ? null : C[k][l];
                                    m = 0;
                                    w = null;
                                    E &&
                                        0 <= E.BuildingIndex &&
                                        ((w = y[E.BuildingIndex]), (m = w.get_CurrentLevel()));
                                    var F = defense_units[k][l];
                                    F && (m = F.get_CurrentLevel());
                                    var G = offense_units[k][l];
                                    G && (m = G.get_CurrentLevel());
                                    1 < m && (f += m);
                                    switch (16 < l ? 0 : b.GetResourceType(k, l)) {
                                        case 0:
                                            if (w) {
                                                var H = w.get_MdbBuildingId();
                                                GAMEDATA.Tech[H].n in c.keymap
                                                    ? (f += c.keymap[GAMEDATA.Tech[H].n])
                                                    : (h('cncopt [5]: Unhandled building: ' + H, w),
                                                      (f += '.'));
                                            } else
                                                F
                                                    ? F.get_UnitGameData_Obj().n in c.keymap
                                                        ? (f +=
                                                              c.keymap[F.get_UnitGameData_Obj().n])
                                                        : (h(
                                                              'cncopt [5]: Unhandled unit: ' +
                                                                  F.get_UnitGameData_Obj().n
                                                          ),
                                                          (f += '.'))
                                                    : G
                                                    ? G.get_UnitGameData_Obj().n in c.keymap
                                                        ? (f +=
                                                              c.keymap[G.get_UnitGameData_Obj().n])
                                                        : (h(
                                                              'cncopt [5]: Unhandled unit: ' +
                                                                  G.get_UnitGameData_Obj().n
                                                          ),
                                                          (f += '.'))
                                                    : (f += '.');
                                            break;
                                        case 1:
                                            f = 0 > E.BuildingIndex ? f + 'c' : f + 'n';
                                            break;
                                        case 2:
                                            f = 0 > E.BuildingIndex ? f + 't' : f + 'h';
                                            break;
                                        case 4:
                                            f += 'j';
                                            break;
                                        case 5:
                                            f += 'h';
                                            break;
                                        case 6:
                                            f += 'l';
                                            break;
                                        case 7:
                                            f += 'k';
                                            break;
                                        default:
                                            h(
                                                'cncopt [4]: Unhandled resource type: ' +
                                                    b.GetResourceType(k, l)
                                            ),
                                                (f += '.');
                                    }
                                }
                            g &&
                                scity.get_AllianceId() == tcity.get_AllianceId() &&
                                ((f += '|' + g.get_POITiberiumBonus()),
                                (f += '|' + g.get_POICrystalBonus()),
                                (f += '|' + g.get_POIPowerBonus()),
                                (f += '|' + g.get_POIInfantryBonus()),
                                (f += '|' + g.get_POIVehicleBonus()),
                                (f += '|' + g.get_POIAirBonus()),
                                (f += '|' + g.get_POIDefenseBonus()));
                            1.2 !== n.get_TechLevelUpgradeFactorBonusAmount() &&
                                (f += '|newEconomy');
                            d.setFormField('opt' + r, f);
                            return f;
                        } catch (N) {
                            h('cncopt [1]: ', N);
                        }
                    },
                };
                c.selected_base = baseId;
                c.make_sharelink();
            }
            function Z(h, r) {
                CncEcomain.getInstance().remoteRequest('update', r);
            }
            function H(h, r) {
                var d = {};
                d.func = r.func;
                d['class'] = r['class'];
                d.message = h.message;
                d.error = h.stack;
                MainData = ClientLib.Data.MainData.GetInstance();
                B = MainData.get_Player();
                d.playerName = B.get_Name();
                d.accountId = B.get_AccountId();
                server = MainData.get_Server();
                d.worldId = server.get_WorldId();
                d.clientinfo = ca();
                var c = null;
                console.log(
                    '____________________________Mest5-errorreport->send______________________________________'
                );
                console.log(d);
                console.log(
                    '_________________________________________________________________________________________'
                );
                if (window.XMLHttpRequest) c = new XMLHttpRequest();
                else if (window.ActiveXObject)
                    try {
                        c = new ActiveXObject('Msxml2.XMLHTTP.6.0');
                    } catch (f) {
                        try {
                            c = new ActiveXObject('Msxml2.XMLHTTP.3.0');
                        } catch (b) {
                            console.log(b);
                        }
                    }
                null !== c &&
                    c.open('POST', 'https://www.member-stats.de/playerinfo.php?i=error', !0);
                c.onreadystatechange = function() {
                    4 == this.readyState &&
                        (200 == this.status ? console.log(h) : console.log(this.statusText));
                };
                c.send(JSON.stringify(d));
            }
            function ca() {
                var h,
                    r = navigator.userAgent.toLowerCase(),
                    d = function(b) {
                        return b.test(r);
                    },
                    c = d(/opera/),
                    f = d(/chrome/),
                    b = d(/webkit/),
                    x = !f && d(/safari/);
                x && d(/applewebkit\/4/);
                x && d(/version\/3/);
                x && d(/version\/4/);
                var g = !c && d(/msie/),
                    n = g && d(/msie 7/),
                    q = g && d(/msie 8/),
                    k = g && !n && !q,
                    u = !b && d(/gecko/);
                var p = u && d(/rv:1\.8/);
                var B = u && d(/rv:1\.9/),
                    E = d(/windows|win32/),
                    m = d(/macintosh|mac os x/);
                d(/adobeair/);
                var A = d(/linux/);
                /^https/i.test(window.location.protocol);
                var D = '',
                    w = (h = d = ''),
                    r = navigator.userAgent.toLowerCase(),
                    d = function(b) {
                        return b.test(r);
                    };
                E
                    ? ((w = 'Windows'),
                      d(/windows nt/) &&
                          ((w = r.indexOf('windows nt')),
                          (E = r.indexOf(';', w)),
                          (w = r.substring(w, E))))
                    : (w = m ? 'Mac' : A ? 'Linux' : 'Other');
                g
                    ? ((D = d = 'IE'),
                      (p = r.indexOf('msie') + 5),
                      (h = r.indexOf(';', p)),
                      (h = r.substring(p, h)),
                      (D = k ? 'IE6' : n ? 'IE7' : q ? 'IE8' : 'IE'))
                    : u
                    ? ((d = (n = d(/firefox/)) ? 'Firefox' : 'Others'),
                      (D = p ? 'Gecko2' : B ? 'Gecko3' : 'Gecko'),
                      n &&
                          ((p = r.indexOf('firefox') + 8),
                          (h = r.indexOf(' ', p)),
                          -1 == h && (h = r.length),
                          (h = r.substring(p, h))))
                    : f
                    ? ((d = 'Chrome'),
                      (D = b ? 'Web Kit' : 'Other'),
                      (p = r.indexOf('chrome') + 7),
                      (h = r.indexOf(' ', p)),
                      (h = r.substring(p, h)))
                    : (d = c ? 'Opera' : x ? 'Safari' : '');
                n = {};
                n.javascript = D;
                n.browserType = d;
                n.browserVersion = h;
                n.osName = w;
                return n;
            }
            function Q() {
                try {
                    if ('undefined' !== typeof qx) {
                        var l = qx.core.Init.getApplication(),
                            r = qx.core.Init.getApplication().getMenuBar();
                        l && r
                            ? ((B = ClientLib.Data.MainData.GetInstance().get_Player()),
                              0 !== B.id
                                  ? (Y(),
                                    window.CncEcomain.getInstance().initialize(),
                                    window.CncEcoScanner.getInstance().initialize(),
                                    window.CncEcostorage.getInstance().initialize(),
                                    window.CncEcoReports.getInstance().initialize(),
                                    window.CncEcoxhr.getInstance().initialize(),
                                    CncEcoHIDE.window.Window.getInstance().initialize(),
                                    window.CncEco.xhr.start())
                                  : window.setTimeout(Q, 1e3))
                            : window.setTimeout(Q, 1e3);
                    } else window.setTimeout(Q, 1e3);
                } catch (d) {
                    h(d), window.setTimeout(Q, 1e3);
                }
            }
            function h(h) {
                h = '[CncEco] ' + h;
                'undefined' !== typeof console
                    ? console.log(h)
                    : window.opera && opera.postError(h);
            }
            var B = 0,
                T = 0,
                M = null,
                x = null,
                W = null,
                I = null,
                E = null,
                R = 0,
                U = 0,
                aa = {
                    GDI_Wall: 'w',
                    GDI_Cannon: 'c',
                    'GDI_Antitank Barrier': 't',
                    GDI_Barbwire: 'b',
                    GDI_Turret: 'm',
                    GDI_Flak: 'f',
                    'GDI_Art Inf': 'r',
                    'GDI_Art Air': 'e',
                    'GDI_Art Tank': 'a',
                    'GDI_Def_APC Guardian': 'g',
                    'GDI_Def_Missile Squad': 'q',
                    GDI_Def_Pitbull: 'p',
                    GDI_Def_Predator: 'd',
                    GDI_Def_Sniper: 's',
                    'GDI_Def_Zone Trooper': 'z',
                    'NOD_Def_Antitank Barrier': 't',
                    'NOD_Def_Art Air': 'e',
                    'NOD_Def_Art Inf': 'r',
                    'NOD_Def_Art Tank': 'a',
                    'NOD_Def_Attack Bike': 'p',
                    NOD_Def_Barbwire: 'b',
                    'NOD_Def_Black Hand': 'z',
                    NOD_Def_Cannon: 'c',
                    NOD_Def_Confessor: 's',
                    NOD_Def_Flak: 'f',
                    'NOD_Def_MG Nest': 'm',
                    'NOD_Def_Militant Rocket Soldiers': 'q',
                    NOD_Def_Reckoner: 'g',
                    'NOD_Def_Scorpion Tank': 'd',
                    NOD_Def_Wall: 'w',
                    FOR_Wall: 'w',
                    FOR_Barbwire_VS_Inf: 'b',
                    FOR_Barrier_VS_Veh: 't',
                    FOR_Inf_VS_Inf: 'g',
                    FOR_Inf_VS_Veh: 'r',
                    FOR_Inf_VS_Air: 'q',
                    FOR_Sniper: 'n',
                    FOR_Mammoth: 'y',
                    FOR_Veh_VS_Inf: 'o',
                    FOR_Veh_VS_Veh: 's',
                    FOR_Veh_VS_Air: 'u',
                    FOR_Turret_VS_Inf: 'm',
                    FOR_Turret_VS_Inf_ranged: 'a',
                    FOR_Turret_VS_Veh: 'v',
                    FOR_Turret_VS_Veh_ranged: 'd',
                    FOR_Turret_VS_Air: 'f',
                    FOR_Turret_VS_Air_ranged: 'e',
                    '': '',
                },
                ba = {
                    'GDI_APC Guardian': 'g',
                    GDI_Commando: 'c',
                    GDI_Firehawk: 'f',
                    GDI_Juggernaut: 'j',
                    GDI_Kodiak: 'k',
                    GDI_Mammoth: 'm',
                    'GDI_Missile Squad': 'q',
                    GDI_Orca: 'o',
                    GDI_Paladin: 'a',
                    GDI_Pitbull: 'p',
                    GDI_Predator: 'd',
                    GDI_Riflemen: 'r',
                    'GDI_Sniper Team': 's',
                    'GDI_Zone Trooper': 'z',
                    'NOD_Attack Bike': 'b',
                    NOD_Avatar: 'a',
                    'NOD_Black Hand': 'z',
                    NOD_Cobra: 'r',
                    NOD_Commando: 'c',
                    NOD_Confessor: 's',
                    'NOD_Militant Rocket Soldiers': 'q',
                    NOD_Militants: 'm',
                    NOD_Reckoner: 'k',
                    NOD_Salamander: 'l',
                    'NOD_Scorpion Tank': 'o',
                    'NOD_Specter Artilery': 'p',
                    NOD_Venom: 'v',
                    NOD_Vertigo: 't',
                    '': '',
                };
            /commandandconquer\.com/i.test(document.domain) && window.setTimeout(Q, 1e3);
        },
        CncEcoScript = document.createElement('script'),
        txt = CncEco_mainFunction.toString();
    CncEcoScript.innerHTML = '(' + txt + ')();';
    CncEcoScript.type = 'text/javascript';
    /commandandconquer\.com/i.test(document.domain) &&
        document.getElementsByTagName('head')[0].appendChild(CncEcoScript);
})();

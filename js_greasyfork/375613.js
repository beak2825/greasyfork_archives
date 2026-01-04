// ==UserScript==
// @name         Compteur de Troupes
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Compteur de Troupes pour Guerre Tribale
// @author       LotusConfort
// @match        https://*/game.php?village=*&screen=overview_villages&type=complete&mode=units&group=*
// @match        https://*/game.php?village=*&screen=overview_villages&mode=units
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375613/Compteur%20de%20Troupes.user.js
// @updateURL https://update.greasyfork.org/scripts/375613/Compteur%20de%20Troupes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    function contadorTropas() {

    function contarPopulacao(info) {
        var popAtk = 0;
        var popDef = 0;
        var pop = 0;
        var ret = {
            'tropa': '',
            'capacidade': ''
        };
        popDef += info.spear;
        popDef += info.sword;
        popAtk += info.axe;
        popDef += info.archer;
        pop += (info.spy * 2);
        popAtk += (info.light * 4);
        popAtk += (info.marcher * 5);
        popDef += (info.heavy * 6);
        popAtk += (info.ram * 5);
        popAtk += (info.catapult * 8);
        pop += info.knight;
        pop += info.snob;
        pop += info.militia;
        pop += popDef + popAtk;
        if (pop >= 15000) {
            ret.capacidade = 'G';
        } else if (pop >= 10000) {
            ret.capacidade = 'M';
        } else {
            ret.capacidade = 'P';
        }
        ret.tropa = popAtk > popDef ? 'A' : 'D';
        return ret;
    }

    function contarBlind(info) {
        var pop = info.spear + info.sword + info.archer + (info.heavy * 6);
       var ret = {
            'capacidade': '',
            'tropas': pop
        };
        if (pop >= 60000) {
            ret.capacidade = 'G';
        } else if (pop >= 45000) {
            ret.capacidade = 'M';
        } else if (pop >= 25000) {
            ret.capacidade = 'P';
        } else {
            ret.capacidade = 'V';
        }
        return ret;
    }

    function compterScout(info) {
        var pop = info.spy;
       var ret = {
            'capacidade': '',
            'tropas': pop
        };
        if (pop >= 3000) {
            ret.capacidade = "G";
        } else if (pop >= 500) {
            ret.capacidade = "M";
        } else {
            ret.capacidade = "P";
        }
        return ret;
    }

    var $table = $('#units_table');
    var unitsTmp = {
        'spear': 0,
        'sword': 0,
        'axe': 0,
        'archer': 0,
        'spy': 0,
        'light': 0,
        'marcher': 0,
        'heavy': 0,
        'ram': 0,
        'catapult': 0,
        'knight': 0,
        'snob': 0,
        'militia': 0
    };
    var unitsTmpBlind = {
        'spear': 0,
        'sword': 0,
        'axe': 0,
        'archer': 0,
        'spy': 0,
        'light': 0,
        'marcher': 0,
        'heavy': 0,
        'ram': 0,
        'catapult': 0,
        'knight': 0,
        'snob': 0,
        'militia': 0
    };
    var dados = {
        'todas': {
            'spear': 0,
            'sword': 0,
            'axe': 0,
            'archer': 0,
            'spy': 0,
            'light': 0,
            'marcher': 0,
            'heavy': 0,
            'ram': 0,
            'catapult': 0,
            'knight': 0,
            'snob': 0,
            'militia': 0
        },
        'proprias': {
            'spear': 0,
            'sword': 0,
            'axe': 0,
            'archer': 0,
            'spy': 0,
            'light': 0,
            'marcher': 0,
            'heavy': 0,
            'ram': 0,
            'catapult': 0,
            'knight': 0,
            'snob': 0,
            'militia': 0
        },
        'apoio': {
            'spear': 0,
            'sword': 0,
            'axe': 0,
            'archer': 0,
            'spy': 0,
            'light': 0,
            'marcher': 0,
            'heavy': 0,
            'ram': 0,
            'catapult': 0,
            'knight': 0,
            'snob': 0,
            'militia': 0
        },
        'full': {
            'atk': {
                'G': [],
                'M': [],
                'P': []
            },
            'def': {
                'G': [],
                'M': [],
                'P': []
            }
        },
        'blind': {
            'G': [],
            'M': [],
            'P': [],
            'V': []
        },
        'scout': {
            'G': [],
            'M': [],
            'P': []
        }
    };
    var trCount = 1;
    var trLenght = $table.find('tr').length - 1;
    var coord = '';
    var tmp = '';
    $table.find('tr').each(function (i, obj) {
        if (i > 0) {
            var $this = $(this);
            if (trCount == 1) {
                coord = $this.find('td').eq(0).find('.quickedit-label').data('text');
                coord = $.trim($this.find('td').eq(0).find('.quickedit-label').html().replace(coord + ' ', ''));
                coord = coord.substr(1, 7);

            }
            var spear = parseInt($this.find('td.unit-item').eq(0).html());
            var sword = parseInt($this.find('td.unit-item').eq(1).html());
            var axe = parseInt($this.find('td.unit-item').eq(2).html());
            var archer = parseInt($this.find('td.unit-item').eq(3).html());
            var spy = parseInt($this.find('td.unit-item').eq(4).html());
            var light = parseInt($this.find('td.unit-item').eq(5).html());
            var marcher = parseInt($this.find('td.unit-item').eq(6).html());
            var heavy = parseInt($this.find('td.unit-item').eq(7).html());
            var ram = parseInt($this.find('td.unit-item').eq(8).html());
            var catapult = parseInt($this.find('td.unit-item').eq(9).html());
            var knight = parseInt($this.find('td.unit-item').eq(10).html());
            var snob = parseInt($this.find('td.unit-item').eq(11).html());
            var militia = parseInt($this.find('td.unit-item').eq(12).html());
            console.log(coord, trCount, unitsTmp);
            if (trCount == 2) {
                unitsTmpBlind.spear = spear - unitsTmp.spear;
                unitsTmpBlind.sword = sword - unitsTmp.sword;
                unitsTmpBlind.axe = axe - unitsTmp.axe;
                unitsTmpBlind.archer = archer - unitsTmp.archer;
                unitsTmpBlind.spy = spy - unitsTmp.spy;
                unitsTmpBlind.light = light - unitsTmp.light;
                unitsTmpBlind.marcher = marcher - unitsTmp.marcher;
                unitsTmpBlind.heavy = heavy - unitsTmp.heavy;
                unitsTmpBlind.ram = ram - unitsTmp.ram;
                unitsTmpBlind.catapult = catapult - unitsTmp.catapult;
                unitsTmpBlind.knight = knight - unitsTmp.knight;
                unitsTmpBlind.snob = snob - unitsTmp.snob;
                unitsTmpBlind.militia = militia - unitsTmp.militia;
                dados.apoio.spear += unitsTmpBlind.spear;
                dados.apoio.sword += unitsTmpBlind.sword;
                dados.apoio.axe += unitsTmpBlind.axe;
                dados.apoio.archer += unitsTmpBlind.archer;
                dados.apoio.spy += unitsTmpBlind.spy;
                dados.apoio.light += unitsTmpBlind.light;
                dados.apoio.marcher += unitsTmpBlind.marcher;
                dados.apoio.heavy += unitsTmpBlind.heavy;
                dados.apoio.ram += unitsTmpBlind.ram;
                dados.apoio.catapult += unitsTmpBlind.catapult;
                dados.apoio.knight += unitsTmpBlind.knight;
                dados.apoio.snob += unitsTmpBlind.snob;
                dados.apoio.militia += unitsTmpBlind.militia;
            } else if (trCount != 2) {
                unitsTmp.spear += spear;
                unitsTmp.sword += sword;
                unitsTmp.axe += axe;
                unitsTmp.archer += archer;
                unitsTmp.spy += spy;
                unitsTmp.light += light;
                unitsTmp.marcher += marcher;
                unitsTmp.heavy += heavy;
                unitsTmp.ram += ram;
                unitsTmp.catapult += catapult;
                unitsTmp.knight += knight;
                unitsTmp.snob += snob;
                unitsTmp.militia += militia;
                dados.proprias.spear += spear;
                dados.proprias.sword += sword;
                dados.proprias.axe += axe;
                dados.proprias.archer += archer;
                dados.proprias.spy += spy;
                dados.proprias.light += light;
                dados.proprias.marcher += marcher;
                dados.proprias.heavy += heavy;
                dados.proprias.ram += ram;
                dados.proprias.catapult += catapult;
                dados.proprias.knight += knight;
                dados.proprias.snob += snob;
                dados.proprias.militia += militia;
            }
            if (trCount == 4) {
                $this.parent().find('td:first').attr('rowspan', function (x, y) {
                    return y + 1;
                });
                var html = '<tr>';
                html += '<td style="font-weight:bold;">Armée Disponible:</td>';
                html += '<td>' + unitsTmp.spear + '</td>';
                html += '<td>' + unitsTmp.sword + '</td>';
                html += '<td>' + unitsTmp.axe + '</td>';
                html += '<td>' + unitsTmp.archer + '</td>';
                html += '<td>' + unitsTmp.spy + '</td>';
                html += '<td>' + unitsTmp.light + '</td>';
                html += '<td>' + unitsTmp.marcher + '</td>';
                html += '<td>' + unitsTmp.heavy + '</td>';
                html += '<td>' + unitsTmp.ram + '</td>';
                html += '<td>' + unitsTmp.catapult + '</td>';
                html += '<td>' + unitsTmp.knight + '</td>';
                html += '<td>' + unitsTmp.snob + '</td>';
                html += '<td>' + unitsTmp.militia + '</td><td>&nbsp;</td>';
                html += '</tr>';
                if (trLenght !== i) {
                    $(obj).after(html);
                }
                tmp = contarPopulacao(unitsTmp);
                dados.full[(tmp.tropa == 'A' ? 'atk' : 'def')][tmp.capacidade].push(coord);
                tmp = contarBlind(unitsTmpBlind);
                if(tmp.capacidade != 'V'){
                dados.blind[tmp.capacidade].push(coord);
                }
                tmp = compterScout(unitsTmp);
                if (tmp.capacidade != 'P') {
                dados.scout[tmp.capacidade].push(coord);
                }
                
                coord = '';
                unitsTmp = {
                    'spear': 0,
                    'sword': 0,
                    'axe': 0,
                    'archer': 0,
                    'spy': 0,
                    'light': 0,
                    'marcher': 0,
                    'heavy': 0,
                    'ram': 0,
                    'catapult': 0,
                    'knight': 0,
                    'snob': 0,
                    'militia': 0
                };
                unitsTmpBlind = {
                    'spear': 0,
                    'sword': 0,
                    'axe': 0,
                    'archer': 0,
                    'spy': 0,
                    'light': 0,
                    'marcher': 0,
                    'heavy': 0,
                    'ram': 0,
                    'catapult': 0,
                    'knight': 0,
                    'snob': 0,
                    'militia': 0
                };
                trCount = 1;
            } else {
                trCount++;
            }
        } else if (trCount == 2) {
            trCount++;
        }
        if (trLenght == i) {
            $(obj).after(html);
        }
    });

    var $newDiv = $table.parent();

    var html = '';
  
    html += '<div id="graphique_troupes"></div>'; //-- Ancora
    //-- Graph Général toutes les troupes
    html += '<div style="margin-left:2.5%;width:45%; height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Répartition générale des troupes</h3><canvas id="grafBar" height="270"></canvas></div>';
    //-- Graph apr type de village
    html += '<div style="margin-left:2.5%;width:45%; height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Répartition des troupes sur les villages</h3><canvas id="grafPie1" height="130"></canvas></div>';
    //-- Séparation
    html += '<div style="clear:both;margin-top: 325px;">&nbsp;</div>';
    //-- Graph Villages Attaque
    html += '<div style="margin-left:2.5%;width:45%; height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Repartition des villages OFF</h3><canvas id="grafPie2" height="130"></canvas></div>';
    //-- Graph Villages Def
    html += '<div style="margin-left:2.5%;width:45%; height: 300px;max-height: 300px;float: left;"><h3 style="text-align:center">Répartition des villages DEF</h3><canvas id="grafPie3" height="130"></canvas></div>';



    html += '<table style="width: 100%;float:left;margin-top: 70px;">';
    html += '<thead><tr>';
    html += '    <th><b>Disposition des Armées</b></th>';
    for (var x in dados.proprias) {
        html += '    <th><img src="' + Format.image_src('unit/unit_' + x + '.png') + '"></th>';
    }
    html += '</tr></thead>';
    html += '<tbody>';
    html += '<tr class="row_marker row_b"><td><b>Disponible dans les Villages :</b></td>';
    for (var x in dados.proprias) {
        dados.todas[x] += dados.proprias[x];
        html += '<td>' + Format.number(dados.proprias[x]) + '</td>';
    }
    html += '</tr>';
    html += '<tr><td><b>En Support:</b></td>';
    for (var x in dados.apoio) {
        dados.todas[x] += dados.apoio[x];
        html += '<td>' + Format.number(dados.apoio[x]) + '</td>';
    }
    html += '</tr>';
    html += '<tr class="row_marker row_b"><td><b>Total:</b></td>';
    for (var x in dados.todas) {
        html += '<td>' + Format.number(dados.todas[x]) + '</td>';
    }
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';
    html += '<textarea style="width: 100%;" rows="15">';
    html += '[b]Total des villages: [/b]' + ((dados.full.atk.G.length + dados.full.atk.M.length + dados.full.atk.P.length) + (dados.full.def.G.length + dados.full.def.M.length + dados.full.def.P.length)) + '\n';
    html += '[b]Village d\'Attaque: [/b]' + (dados.full.atk.G.length + dados.full.atk.M.length + dados.full.atk.P.length) + '\n';
    html += '[b]Village de Défense: [/b]' + (dados.full.def.G.length + dados.full.def.M.length + dados.full.def.P.length) + '\n';
    html += '[b]Village Scouts : [/b]' + (dados.scout.G.length + dados.scout.M.length + dados.scout.P.length) + '\n';
    html += '[b]Village Bunker: [/b]' + (dados.blind.G.length + dados.blind.M.length + dados.blind.P.length) + '\n';
    


    html += '\n[b]Off :[/b]\n[spoiler]';
    for (var x in dados.full.atk) {
        for (var y = 0; y < dados.full.atk[x].length; y++) {
            html += '\n[coord]' + dados.full.atk[x][y] + '[/coord] - ' + (x == 'G' ? '[color=#00a500][command]attack_large[/command] Armée Grande Envergure (15000+)[/color]' : (x == 'M' ? '[color=#0e0eae][command]attack_medium[/command] Armée de Moyenne Envergure (10000+)[/color]' : '[color=#a50000][command]attack_small[/command] Armée de Petite Envergure (<10000)[/color]'));
        }
    }
    html += '\n[/spoiler]\n\n[b]Def :[/b]\n[spoiler]';
    for (var x in dados.full.def) {
        for (var y = 0; y < dados.full.def[x].length; y++) {
            html += '\n[coord]' + dados.full.def[x][y] + '[/coord] - ' + (x == 'G' ? '[color=#00a500][command]attack_large[/command] Armée Grande Envergure (15000+)[/color]' : (x == 'M' ? '[color=#0e0eae][command]attack_medium[/command] Armée de Moyenne Envergure (10000+)[/color]' : '[color=#a50000][command]attack_small[/command] Armée de Petite Envergure (<10000)[/color]'));
        }
    }

    html += '\n[/spoiler]\n\n[b]Scouts :[/b]\n[spoiler]';
    for (var x in dados.scout) {
        for (var y = 0; y < dados.scout[x].length; y++) {
            html += '\n[coord]' + dados.scout[x][y] + '[/coord] - ' + (x == 'G' ? '[color=#00a500][command]attack_large[/command] Armée Grande Envergure (3000+)[/color]' : (x == 'M' ? '[color=#0e0eae][command]attack_medium[/command] Armée de Moyenne Envergure (500+)[/color]' : '[color=#a50000][command]attack_small[/command] Armée de Petite Envergure (<500)[/color]'));
        }
    }

    html += '\n[/spoiler]\n\n[b]Bunk :[/b]\n[spoiler]';
    for (var x in dados.blind) {
        for (var y = 0; y < dados.blind[x].length; y++) {
            html += '\n[coord]' + dados.blind[x][y] + '[/coord] - ' + (x == 'G' ? '[color=#00a500][command]attack_large[/command] High Bunk (60000+)[/color]' : (x == 'M' ? '[color=#0e0eae][command]attack_medium[/command] Medium Bunk (45000+)[/color]' : (x == 'V' ? '[color=#ff0000]Vide (0)[/color]' : '[color=#a50000][command]attack_small[/command] Low Bunk (20000+)[/color]')));
        }
    }

    html += '\n[/spoiler]\n\n[b]Détail composition Armée :[/b]';
    html += '\n[spoiler]\n [unit]spear[/unit] : ' + dados.proprias.spear + '\n [unit]sword[/unit] : ' + dados.proprias.sword + '\n [unit]axe[/unit] : ' + dados.proprias.axe + '\n [unit]archer[/unit] : ' + dados.proprias.archer + '\n [unit]spy[/unit] : ' + dados.proprias.spy + '\n [unit]light[/unit] : ' + dados.proprias.light + '\n [unit]marcher[/unit] : ' + dados.proprias.marcher + '\n [unit]heavy[/unit] : ' + dados.proprias.heavy + '\n [unit]ram[/unit] : ' + dados.proprias.ram + '\n [unit]catapult[/unit] : ' + dados.proprias.catapult + '\n [unit]knight[/unit] : ' + dados.proprias.knight + '\n [unit]snob[/unit] : ' + dados.proprias.snob + '\n [unit]militia[/unit] : ' + dados.proprias.militia + '\n [/spoiler]';




    html += '</textarea>';


    $newDiv.append(html);

    javascript:$.getScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.3.0/Chart.min.js', function (data, textStatus, jqxhr) {
         var ctxBar = document.getElementById("grafBar");
         var ctxPie1 = document.getElementById('grafPie1');
         var ctxPie2 = document.getElementById('grafPie2');
         var ctxPie3 = document.getElementById('grafPie3');
         
         new Chart(ctxBar, {
             type: 'bar',
             options: {
                 responsive: true,
                 maintainAspectRatio: false
             },
             data: {
                 labels: ["Lanciers", "Porteurs d'épée", "Guerriers à la Hache", "Archers", "Scouts", "Cavalerie Légère", "Archers Montés", "Cavalerie Lourde", "Béliers", "Catapulte"],
                 datasets: [{
                     label: 'Dans le village',
                     data: [dados.proprias.spear, dados.proprias.sword, dados.proprias.axe, dados.proprias.archer, dados.proprias.spy, dados.proprias.light, dados.proprias.marcher, dados.proprias.heavy, dados.proprias.ram, dados.proprias.catapult],
                     backgroundColor: "rgba(255,53,51,0.4)"
                 }, {
                     label: 'En Support',
                     data: [dados.apoio.spear, dados.apoio.sword, dados.apoio.axe, dados.apoio.archer, dados.apoio.spy, dados.apoio.light, dados.apoio.marcher, dados.apoio.heavy, dados.apoio.ram, dados.apoio.catapult, dados.apoio.knight, dados.apoio.snob, dados.apoio.militia],
                     backgroundColor: "rgba(63,127,191,0.7)"
                 }]
             }
         });

         new Chart(ctxPie1, {
             type: 'doughnut',
             options: {
                 responsive: true,
                 maintainAspectRatio: false
             },
             data: {
                 labels: ['Attaque', 'Défense', 'Soutient'],
                 datasets: [{
                     data: [dados.proprias.axe + dados.proprias.light + dados.proprias.marcher + dados.proprias.ram + dados.proprias.knight + dados.proprias.snob, dados.proprias.spear + dados.proprias.sword + dados.proprias.archer + dados.proprias.heavy + dados.proprias.catapult + dados.proprias.militia, dados.apoio.axe + dados.apoio.light + dados.apoio.marcher + dados.apoio.ram + dados.apoio.knight + dados.apoio.snob + dados.apoio.spear + dados.apoio.sword + dados.apoio.archer + dados.apoio.heavy + dados.apoio.catapult + dados.apoio.militia],
                     backgroundColor: ["rgba(255,53,51,0.4)", "rgba(63,127,191,0.7)", "rgba(53,255,51,0.4)"]
                 }]
             }
         });

         new Chart(ctxPie2, {
             type: 'pie',
             options: {
                 responsive: true,
                 maintainAspectRatio: false
             },
             data: {
                 labels: ['Grande Armée', 'Armée Moyenne', 'Petite Armée'],
                 datasets: [{
                     data: [dados.full.atk.G.length, dados.full.atk.M.length, dados.full.atk.P.length],
                     backgroundColor: ["rgba(53,255,51,0.4)", "rgba(63,127,191,0.7)", "rgba(255,53,51,0.4)"]
                 }]
             }
         });

         new Chart(ctxPie3, {
             type: 'pie',
             options: {
                 responsive: true,
                 maintainAspectRatio: false
             },
             data: {
                 labels: ['Grande Armée', 'Armée Moyenne', 'Petite Armée'],
                 datasets: [{
                     data: [dados.full.def.G.length, dados.full.def.M.length, dados.full.def.P.length],
                     backgroundColor: ["rgba(53,255,51,0.4)", "rgba(63,127,191,0.7)", "rgba(255,53,51,0.4)"]
                 }]
             }
         });
         window.location.href = '#graphique_troupes';
     });


}
    

    contadorTropas();
})();
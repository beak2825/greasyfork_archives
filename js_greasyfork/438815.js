// ==UserScript==
// @name VIRTA::Unit Page More Info
// @description Дополнительные данные на странице юнита
// @namespace virtonomica
// @author SAQOT
// @version 3.0
// @include https://virtonomica.ru/vera/main/unit/view/*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/438815/VIRTA%3A%3AUnit%20Page%20More%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/438815/VIRTA%3A%3AUnit%20Page%20More%20Info.meta.js
// ==/UserScript==

/* global $, unsafeWindow */

let run = async function () {
    let win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    
    // проверка на точность соответсвия страницы
    const t = window.location.href.match(/\/(\w+)\/main\/unit\/view\/(\d+)($|\/$|#|\?)/)
    if (!t) {
        return;
    }
    
    // ==================================================
    let ver = '3.0';
    
    function consoleEcho(text, isRrror = false) {
        const bg = isRrror === true ? '#af1a00' : '#3897c7'
        console.log(`\n %c VIRTA::UPMI / ${ver} %c ${text} \n\n`, 'color: #FFFFFF; background: #030307; padding:5px 0;', `color: #FFFFFF; background: ${bg}; padding:5px 0;`);
    }
    
    consoleEcho('Дополнительные данные на странице юнита NEW');
    // ==================================================
    
    
    const m = window.location.href.match(/\/(\w+)\/main\/unit\/view\/(\d+)/);
    const unitID = m[2];
    if (!unitID) {
        consoleEcho('unitID не определен', true);
        return;
    }
    
    function calcMaxKvalaUser(unit) {
        const kv = unit['competence_value'] * 1;    // квалификация игрока
        const empCntCur = unit['employee_count'] * 1;
        return floor2(calcQualTop1(kv, empCntCur, unit['unit_class_kind']));
    }
    
    function procVal(num, val) {
        return Math.round(val / (num / 100) * 100) / 100;
    }
    
    // возвращает аргумент округлённым до 2-го знака
    function floor2(val) {
        return (Math.floor(100 * val) / 100).toFixed(2) * 1;
    }
    
    // вычисляет максимальное качество оборудования/животных для заданной квалификации персонала
    function calcEqQualMax(laborLevel) {
        return floor2(Math.pow(laborLevel, 1.5));
    }
    
    // вычисляет максимальный уровень технологии для заданной квалификации игрока
    function calcTechMax(kvala) {
        return (Math.floor(10 * Math.pow(kvala / 0.0064, 1 / 3)) / 10).toFixed(0) * 1;
    }
    
    // вычисляет максимальное кол-во работающих с заданной квалификацией на предприятии для заданной квалификации игрока (топ-1)
    function calcPersonalTop1(kvala, qp, unitType) {
        return Math.floor(0.2 * getKoffTop1(unitType) * 14 * kvala * kvala / Math.pow(1.4, qp));
    }
    
    // вычисляет максимальное квалификацию работающих при заданных их численности и квалификации игрока
    function calcQualTop1(kvala, qp, unitType) {
        if (qp === 0) {
            return 0.00;
        }
        return Math.log(0.2 * 14 * getKoffTop1(unitType) * kvala * kvala / qp) / Math.log(1.4);
    }
    
    function getUnitForecast(unitID) {
        return new Promise((resolve) => {
            $.ajax({
                async      : true,
                type       : 'GET',
                url        : `https://virtonomica.ru/api/vera/main/unit/forecast?id=${unitID}&app=adapter_vrt&format=json`,
                crossDomain: true,
                xhrFields  : {
                    withCredentials: true,
                },
                global     : false,
                dataType   : "json",
                success    : function (res) {
                    resolve(res);
                },
                error      : function (jqXHR, textStatus, error) {
                    consoleEcho(`FAIL (ajax) {textStatus=${textStatus} , error=${error}}`, true);
                },
            });
        });
    }
    
    function getUnitData(unitID) {
        return new Promise((resolve) => {
            $.ajax({
                async      : true,
                type       : 'GET',
                url        : `https://virtonomica.ru/api/vera/main/unit/view?id=${unitID}`,
                crossDomain: true,
                xhrFields  : {
                    withCredentials: true,
                },
                global     : false,
                dataType   : "json",
                success    : function (res) {
                    resolve(res);
                },
                error      : function (jqXHR, textStatus, error) {
                    consoleEcho(`FAIL (ajax) {textStatus=${textStatus} , error=${error}}`, true);
                },
            });
        });
    }
    
    function getUserKvala(userID, kind) {
        return new Promise((resolve) => {
            $.ajax({
                async      : true,
                type       : 'GET',
                url        : `https://virtonomica.ru/api/vera/main/user/competences/browse?id=${userID}`,
                crossDomain: true,
                xhrFields  : {
                    withCredentials: true,
                },
                global     : false,
                dataType   : "json",
                success    : function (data) {
                    const kvala = {};
                    
                    for (const k in data) {
                        const v = data[k];
                        let kk = v['kind'];
                        v['delta'] = (parseFloat(v['delta']) * 100);
                        v['progress'] = parseFloat(v['progress']);
                        v['step'] = v['delta'] > v['progress'];
                        kvala[kk] = v;
                    }
                    
                    resolve(kvala[kind]);
                },
                error      : function (jqXHR, textStatus, error) {
                    consoleEcho(`FAIL (ajax) {textStatus=${textStatus} , error=${error}}`, true);
                },
            });
        });
    }
    
    function getKoffTop1(unitType) {
        const coff = {
            'shop'         : 5,
            'restaurant'   : 5,
            'lab'          : 5,
            'workshop'     : 150,
            'mill'         : 5,
            'sawmill'      : 12.5,
            'animalfarm'   : 11,
            'medicine'     : 9.6,
            'fishingbase'  : 75,
            'farm'         : 20,
            'orchard'      : 150,
            'mine'         : 170,
            'office'       : 1,
            'service_light': 1.5,
            'power'        : 85,
            'repair'       : 2.5,
            'fuel'         : 2.5,
            'educational'  : 1.5,
            'it'           : 1,
            'villa'        : 0,
            'warehouse'    : 0,
            'unknown'      : 0,
        };
        
        return coff[unitType];
    }
    
    const kvTeh = [0, 1, 1.74, 2.41, 3.03, 3.62, 4.19, 4.74, 5.28, 5.8, 6.31, 6.81, 7.3, 7.78, 8.26, 8.73, 9.19, 9.65, 10.1, 10.54, 10.99, 11.42, 11.86, 12.29, 12.71, 13.13, 13.55, 13.97, 14.38, 14.79, 15.19, 15.6, 16, 16.4, 16.8, 17.19, 17.58, 17.97, 18.36, 18.74, 19.13];
    
    
    async function initProcess($div) {
        const unit = await getUnitData(unitID);
        const unitType = unit['unit_class_kind'];
        const forecast = await getUnitForecast(unitID); // данные с прогноза
        //console.log('unit', unit);
        //console.log('forecast', forecast);
        //console.log('unitType', unitType);
        
        // исключаем заведомо не нужные
        if (['villa', 'network', 'warehouse'].includes(unitType)) {
            return;
        }
        
        //---------------------------------------------------------
        // проставляем признак изменения квалы в блоке ТОП МЕНЕДЖЕР
        //---------------------------------------------------------
        let $elKvala = $div.find('li:contains("Квалификация игрока")')
        if ($elKvala.length) {
            $elKvala = $elKvala.find('span.mono');
            const v = $elKvala.text().trim();
            
            const kvalaUnit = await getUserKvala(unit['user_id'], unit['knowledge_area_kind']);
            
            if (kvalaUnit['step']) {
                $elKvala.html(`${v} <sup class="text-success">+1 (${kvalaUnit['progress']}%)</sup>`);
            } else {
                $elKvala.html(`${v} <sup class="text-muted">+0 (${kvalaUnit['progress']}%)</sup>`);
            }
        }
        
        //---------------------------------------------------------
        // проставляем занчение нагрузки ТОП3 рабов в блоке ТОП МЕНЕДЖЕР
        //---------------------------------------------------------
        let $elLaborSummary = $div.find('li:contains("Суммарное количество подчинённых")');
        if ($elLaborSummary.length) {
            $elLaborSummary = $($elLaborSummary[0]);
            
            const laborSummary = forecast['labor_summary'] * 1;
            const laborSummaryMax = forecast['labor_summary_max'] * 1;
            const laborProc = procVal(laborSummaryMax, laborSummary);
            const badgeColor = laborProc > 100 ? 'badge-danger' : 'badge-success';
            
            let laborDop = '';
            if (laborProc > 100) {
                laborDop = (laborSummary - laborSummaryMax).toLocaleString('ru');
                laborDop = `<sup class="text-danger">Лишних рабов ${laborDop}</sup>`;
            } else if (laborProc < 100) {
                laborDop = (laborSummaryMax - laborSummary).toLocaleString('ru');
                laborDop = `<sup class="">Свободно рабов ${laborDop}</sup>`;
            }
            
            $elLaborSummary.after(`<li class="list-group-item">Эффективность, ТОП-3<br>
        <span class="text-muted small">(Предельное значение: ${(laborSummaryMax).toLocaleString('ru')}) ${laborDop}</span>
        <span class="badge ${badgeColor} badge-roundless pull-right mono">${laborProc}%</span>
        </li>`);
        }
        
        
        //---------------------------------------------------------
        // Квалификация персонала
        //---------------------------------------------------------
        let $elEmployee = $div.find('li:contains("Квалификация сотр")');
        if ($elEmployee.length) {
            const kv = unit['competence_value'] * 1;    // квалификация игрока
            const kvp = unit['employee_level'] * 1;    // квалификация персонала
            let kvpMax = calcMaxKvalaUser(unit);

            
            const empCntMax = calcPersonalTop1(kv, kvp, unitType);
            const empCntCur = unit['employee_count'] * 1;
            let weightProc = procVal(empCntMax, empCntCur);
            
            
            let nameEmp = 'рабов';
            let maxEmp = `<div class="text-muted small clearfix">
                <span >Максимальное количество рабов (при квале ${kvp}):</span>
                <span class="pull-right ">${(empCntMax).toLocaleString('ru')}</span>
            </div>`;
            
            if (['workshop', 'mill', 'mine', 'fishingbase', 'sawmill', 'animalfarm', 'orchard', 'farm', 'power'].includes(unitType)) {
                const load = procVal(forecast['max_tech'], forecast['tech']);
                weightProc = floor2(Math.pow(load / 100, 3) * 100);
                maxEmp = '';
                nameEmp = 'ед.';
            }
            
    
            if (['animalfarm'].includes(unitType)) {
                kvpMax = floor2(((100-weightProc)/100*unit['employee_level_required'])+unit['employee_level_required']*1);
            }
            
            const textColorProc = weightProc > 100 ? 'text-danger' : '';
            const textColorKvp = kvpMax < kvp ? 'text-danger' : '';
            
            $elEmployee.hide();
            
            $elEmployee.after(`<li class="list-group-item">
            <div class="clearfix">
                <div class="pull-left">Эффективность, ТОП-1</div>
            </div>
            ${maxEmp}
            <div class="text-muted small">
                <span >Нагрузка для ${(empCntCur).toLocaleString('ru')} ${nameEmp} (при квале ${kvp}):</span>
                <span class="pull-right ${textColorProc}">${weightProc}%</span>
            </div>
            </li>`);
            
            $elEmployee.after(`<li class="list-group-item">
                <div class="clearfix">
                    <div class="pull-left">Квалификация сотр. <span class="text-muted">(требуется ${unit['employee_level_required']})</span></div>
                    <div class="pull-right ${textColorKvp}">${kvp}</div>
                </div>
                <div class="text-muted small clearfix">
                    <span >Максимальная квала:</span><span class="pull-right ">${kvpMax}</span>
                </div>
            </li>`);
            
            
        }
        
        //---------------------------------------------------------
        // Макс. качество по персоналу
        //---------------------------------------------------------
        let $elQuality = $div.find('li:contains("Качество")');
        if ($elQuality.length) {
            if ($elQuality.length > 1) {
                $elQuality = $($elQuality[1]);
            }
            
            const kvp = unit['employee_level'] * 1;    // квалификация персонала
            const maxQty = calcEqQualMax(kvp);
            const curQty = floor2(unit['equipment_quality']);
            let kvpMax = calcMaxKvalaUser(unit);
           
            if (['animalfarm'].includes(unitType)) {
                const load = procVal(forecast['max_tech'], forecast['tech']);
                const weightProc = floor2(Math.pow(load / 100, 3) * 100);
                kvpMax = floor2(((100-weightProc)/100*unit['employee_level_required'])+unit['employee_level_required']*1);
            }
            
            const textColorQty = (curQty > maxQty || kvp > kvpMax) ? 'text-danger' : '';
            
            $elQuality.append(`<div class="text-muted small">
                <div>
                    <span >Макс. качество по персоналу (под ${kvp}):</span><span class="pull-right ${textColorQty}">${maxQty}</span>
                </div>
            </div>`);
            
            if (kvp > kvpMax) {
                const maxQtyForMaxKvala = calcEqQualMax(kvpMax);
                $elQuality.append(`<div class="st-notice small">
                    Максимальное качество по персоналу <b>${maxQty}</b> выше, чем возможное максимальное качество <b>${maxQtyForMaxKvala}</b>. Ориентироваться стоит под <b>${maxQtyForMaxKvala}</b>.
                </div>`);
            }
            
            
        }
        
        //---------------------------------------------------------
        // Макс. количество поситетилей по персоналу
        //---------------------------------------------------------
        let $elCntPos = $div.find('li:contains("Количество посетителей")');
        if ($elCntPos.length) {
            if (['restaurant', 'service_light', 'mine', 'medicine', 'repair', 'educational'].includes(unitType)) {
                const spec = {
                    '348214': 5,    // Фитнес
                    '348215': 5,    // Йога
                    '348216': 5,    // Бодибилдинг
                    '348217': 5,    // Группы здоровья
                    '348218': 5,    // Профессиональный спорт
                    '348220': 5,    // Скалолазание
                    '348219': 5,    // Танцы
                    '373262': 10,   // Прачечная
                    '373263': 10,   // Химчистка
                    '373264': 10,   // Прачечная самообслуживания
                };
                let koff = spec[unit['unit_type_produce_id']];
                koff = koff === undefined ? 1 : koff
                const perMax = unit['equipment_max'] / koff;
                
                const persKol = unit['employee_count'];
                const maxPer = persKol * (unit['sales_max'] / perMax);
                const posProc = procVal(maxPer, unit['sales']);
                
                $elCntPos.append(`
                    <div class="text-muted small">
                        <span>Макс. по персоналу:</span><span class="pull-right">${(maxPer).toLocaleString('ru')}</span>
                    </div>
                    <div class="text-muted small">
                        <span>Посещаемость:</span><span class="pull-right">${posProc}%</span>
                    </div>
                `);
            }
        }
        
        //---------------------------------------------------------
        // Калькулятор топ-1
        //---------------------------------------------------------
        const $blockMenu = $('ul.tabu');
        if ($blockMenu.length) {
            let $ulRow = $blockMenu.find('li.main-menu ul.sub');
            if (!$ulRow.length) {
                $ulRow = $blockMenu;
            }
            
            let $linkMenuCalc = $ulRow.find('.link-menu-calc');
            if (!$linkMenuCalc.length) {
                $linkMenuCalc = $(`<li><a href="" class="link-menu-calc">Калькулятор топ-1</a></li>`);
                $ulRow.append($linkMenuCalc);
            }
            
            let $modal = $('#calc-modal')
            if (!$modal.length) {
                $modal = $('<div class="modal fade calc-modal" id="calc-modal" data-backdrop="static" data-keyboard="false" tabindex="-1"  aria-hidden="true">' +
                    '  <div class="modal-dialog modal-sm">' +
                    '    <div class="modal-content">' +
                    '      <div class="modal-header">' +
                    '        <h1 class="modal-title" >Калькулятор ТОП-1</h1>' +
                    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                    '          <span aria-hidden="true">&times;</span>' +
                    '        </button>' +
                    '      </div>' +
                    '      <div class="modal-body">' +
                    
                    
                    '<ul class="list-group vir-list-group-strypes">' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Квалификация ТОПа</div>' +
                    '       <div class="pull-right col2"><input class="form-control" id="calcTopKv" type="text" value=""></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Технология <span id="maxTopTechHelp" class="text-muted small"></span></div>' +
                    '       <div class="pull-right col2"><input class="form-control" id="calcTopTech" type="text" value=""></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Количество рабов</div>' +
                    '       <div class="pull-right col2"><input class="form-control" id="calcTopCntRab" type="text" value=""></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Квалификация рабов</div>' +
                    '       <div class="pull-right col2"><input class="form-control" id="calcTopKvRab" type="text" value=""></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <h1 class="modal-title" >Рассчет</h1>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Максимальная технология по данной квалификации</div>' +
                    '       <div class="pull-right col2"><span class="res" id="maxTopTech">--</span></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Максимальное количество рабов при данной квалификации</div>' +
                    '       <div class="pull-right col2"><span class="res" id="maxTopCntRab">--</span></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Максимальная квала персонала при данном количестве</div>' +
                    '       <div class="pull-right col2"><span class="res" id="maxTopKvRab">--</span></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Минимальная квала по данной технолигии</div>' +
                    '       <div class="pull-right col2"><span class="res" id="maxTopRabTech">--</span></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Максимальное качество оборудования при данной квалификации персонала</div>' +
                    '       <div class="pull-right col2"><span class="res" id="maxTopOb">--</span></div>' +
                    '     </li>' +
                    '' +
                    '     <li class="list-group-item ">' +
                    '       <div class="pull-left col1">Качество оборудования по данной технолигии</div>' +
                    '       <div class="pull-right col2"><span class="res" id="maxTopObTech">--</span></div>' +
                    '     </li>' +
                    '' +
                    '  </ul>' +
                    
                    
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>')
                $('body').append($modal);
            }
            
            const $inpCalcTopKv = $modal.find('#calcTopKv');
            const $inpCalcTopTech = $modal.find('#calcTopTech');
            const $inpCalcTopCntRab = $modal.find('#calcTopCntRab');
            const $inpCalcTopKvRab = $modal.find('#calcTopKvRab');
            
            const $sMaxTopTechHelp = $modal.find('#maxTopTechHelp');
            const $sMaxTopTech = $modal.find('#maxTopTech');
            const $sMaxTopCntRab = $modal.find('#maxTopCntRab');
            const $sMaxTopKvRab = $modal.find('#maxTopKvRab');
            const $sMaxTopRabTech = $modal.find('#maxTopRabTech');
            const $sMaxTopOb = $modal.find('#maxTopOb');
            const $sMaxTopObTech = $modal.find('#maxTopObTech');
            
            
            $linkMenuCalc.on('click', async function (e) {
                e.preventDefault();
                $modal.modal("show");
                $('.modal-backdrop').hide();
            });
            
            $modal.on('show.bs.modal', function () {
                const kv = unit['competence_value'] * 1;    // квалификация игрока
                $inpCalcTopKv.val(kv);
                
                const tech = unit['technology_level'] * 1;    // технология юнита
                $inpCalcTopTech.val(tech);
                
                const empCnt = unit['employee_count'] * 1;    // Количество рабов
                $inpCalcTopCntRab.val(empCnt);
                
                const empLvl = unit['employee_level'] * 1;    // Квала рабов
                $inpCalcTopKvRab.val(empLvl);
                
                calcAndShowResModal();
            })
            
            const $inputs = $modal.find('input');
            
            $inputs.on('change paste keyup', function () {
                let v = this.value;
                
                
                v = v.replace(/,/g, ".");
                
                if (v.indexOf('.') !== -1) {
                    v = v.replace(/[^\d.]/g, '');
                } else {
                    v = parseInt(v, 10);
                }
                
                v = v < v * -1 ? 0 : v;
                v = isNaN(v) ? 0 : v;
                
                $(this).val(v);
                
                calcAndShowResModal();
            });
            
            function calcAndShowResModal() {
                const kv = $inpCalcTopKv.val();         // квалификация игрока
                const tech = $inpCalcTopTech.val();    // технология юнита
                const empCnt = $inpCalcTopCntRab.val(); // Количество рабов
                const empLvl = $inpCalcTopKvRab.val();  // Квала рабов
                
                
                const techMax = calcTechMax(kv);
                $sMaxTopTechHelp.html(`(max ${techMax})`);
                $sMaxTopTech.html(techMax);
                
                const empCnt_ = calcPersonalTop1(kv, empLvl, unitType);
                $sMaxTopCntRab.html(empCnt_);
                
                const maxLvl = floor2(calcQualTop1(kv, empCnt, unitType));
                $sMaxTopKvRab.html(maxLvl);
                
                const kvpMax = floor2(kvTeh[tech]);
                $sMaxTopRabTech.html(kvpMax);
                
                const maxEq = calcEqQualMax(empLvl);
                $sMaxTopOb.html(maxEq);
                
                const maxTechEq = calcEqQualMax(kvpMax);
                $sMaxTopObTech.html(maxTechEq);
                
            }
            
        }
        
        
    }
    
    let elUnit = document.getElementById('unit-info');
    if (elUnit !== null) {
        setTimeout(() => {
            initProcess($(elUnit));
        }, 500);
    
        new MutationObserver((mrs) => {
            mrs.forEach((mr) => {
                if (mr.oldValue !== null && mr.oldValue.indexOf('updating') !== -1) {
                    initProcess($(mr.target));
                }
            });
        
        }).observe(elUnit, {attributes: true, attributeOldValue: true, attributeFilter: ['class']});
    }
    // ------------------------------------------------------
    //
    // ------------------------------------------------------
    
    // ------------------------------------------------------
    // style
    // ------------------------------------------------------
    let sheet = document.createElement('style')
    sheet.innerHTML = `
        .clearfix::after {
            display: block;
            clear: both;
            content: "";
        }
        .st-notice {
            background-color: #FDECC9;
            padding: 4px;
        }
        .calc-modal {
            left: auto;
            width: 350px;
            font-size: 12px;
        }
        .calc-modal h1 {
            font-size: 12px;
        }
        .calc-modal .list-group-item  {
           padding: 10px 0px;
        }
        .calc-modal .col1  {
           width: 190px;
        }
        .calc-modal .col2  {
           width: 70px;
        }
        .col2 input{
          height: 22px;
          text-align: right;
          padding: 1px 6px;
        }
        .calc-modal .res  {
           display: block;
           background-color: #FDECC9;
           padding: 8px 6px;
           text-align: right;
        }
        .ribbon.ribbon-color-primary {
           background-color: #bac3d0 !important;
           color: #384353 !important;
        }
        .ribbon.ribbon-color-primary > .ribbon-sub {
           background-color: #bac3d0 !important;
           color: #384353 !important;
        }
        .ribbon.ribbon-color-warning > .ribbon-sub {
           background-color: #bac3d0 !important;
           color: #384353 !important;
        }
        .ribbon.ribbon-color-warning > .ribbon-sub {
           background-color: #bac3d0 !important;
           color: #384353 !important;
        }
        `;
    document.body.appendChild(sheet);
    
}

if (window.top === window) {
    let script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
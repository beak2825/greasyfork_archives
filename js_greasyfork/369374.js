var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ==UserScript==
// @name          Virtonomica: Вывоз на склад
// @namespace     virtonomica
// @author        mr_Sumkin
// @description   Массовый вывоз товара из магазина на склады в 1 клик.
// @version       1.04
// @include       http*://virtonomic*.*/*/main/unit/view/*/sale
// @include       http*://virtonomic*.*/*/main/unit/view/*/trading_hall
// @require       https://code.jquery.com/jquery-1.11.1.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.js
// @downloadURL https://update.greasyfork.org/scripts/369374/Virtonomica%3A%20%D0%92%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%BD%D0%B0%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/369374/Virtonomica%3A%20%D0%92%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%BD%D0%B0%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4.meta.js
// ==/UserScript==
$ = jQuery = jQuery.noConflict(true);
let $xioDebug = true;
let Realm = getRealmOrError();
let GameDate = parseGameDate(document);
let Export2WareStoreKeyCode = "e2w";
let ProdCatStoreKeyCode = "prct"; // список продуктов с категориями. сделал неким отдельным ключиком, вдруг будет скрипт читающий эту же табличку
let TMStoreKeyCode = "prtm"; // список ТМ продуктов
let EnablePriceMgmnt = true; // если выключить то кнопки изменения цен исчезнут
let PriceStep = 2; // шаг изменения цены в %
let EnableExport2w = true; // если выключить то функции экспорт ВСЕ перестанут работать
// упрощаем себе жисть, подставляем имя скрипта всегда в сообщении
function log(msg, ...args) {
    msg = "export2ware: " + msg;
    logDebug(msg, ...args);
}
function run_async() {
    return __awaiter(this, void 0, void 0, function* () {
        let Url_rx = {
            // для юнита
            unit_sale: /\/[a-z]+\/(?:main|window)\/unit\/view\/\d+\/sale\/?/i,
            unit_trade_hall: /\/[a-z]+\/(?:main|window)\/unit\/view\/\d+\/trading_hall\/?/i,
        };
        let $html = $(document);
        // определяем где мы находимся. для трейдхолла может не быть вообще товара, тады нет таблицы.
        let onTradehall = Url_rx.unit_trade_hall.test(document.location.pathname) && $html.find("table.grid").length > 0;
        let onWareSale = Url_rx.unit_sale.test(document.location.pathname) && parseUnitType($html) == UnitTypes.warehouse;
        if (onTradehall && EnableExport2w)
            yield tradehallExport_async();
        if (onTradehall && EnablePriceMgmnt)
            tradehallPrice();
        if (onWareSale)
            wareSale();
        function tradehallExport_async() {
            return __awaiter(this, void 0, void 0, function* () {
                //  задаем стили для выделения
                //$("<style>")
                //    .prop("type", "text/css")
                //    .html(`.e2wSelected { background-color: rgb(255, 210, 170) !important; }`)
                //    .appendTo(document.head);
                let selClassName = "selected"; // класс которым будем выделять строки доступные для экспорта
                // собираем данные с хранилища
                let exportWares = restoreWare();
                let tm = yield getTMProducts_async();
                let prodCatDict = yield getProdWithCategories_async();
                let getCategory = (pid) => nullCheck(prodCatDict[pid]).product_category_name;
                // для каждого товара удалим штатные события дабы свои работали нормально
                // и удалим обработчик на общую галку. она будет работать иначе
                let $rows = closestByTagName($html.find("table.grid a.popup"), "tr");
                $rows.removeAttr("onmouseover").removeAttr("onmouseout").removeClass("selected");
                let $globalChbx = oneOrError($html, "#allProduct").removeAttr("onclick");
                ;
                let $form = $html.find("form");
                let [, thItems] = parseUnitTradeHall(document, document.location.pathname);
                let dataCache = [];
                for (let thItem of thItems) {
                    let $r = oneOrError($form, `input[name='${thItem.name}']`).closest("tr");
                    let $cbx = oneOrError($r, "input:checkbox");
                    let brand = tm[thItem.product.img];
                    let brand_id = brand == null ? 0 : brand.brand_id; // простой товар будет иметь 0. кривые бренды пойдут с null
                    dataCache.push({
                        available: thItem.stock.available,
                        sold: thItem.stock.sold,
                        category: getCategory(thItem.product.id),
                        pid: thItem.product.id,
                        row: $r,
                        cbx: $cbx,
                        brand_id: brand_id,
                        prod_name: thItem.product.name
                    });
                }
                // формируем словарь Отдел => pid[] для отрисовки селекта отделов. Пустые товары выкидываем.
                let catsDict = {};
                for (let item of dataCache) {
                    if (item.available <= 0)
                        continue;
                    if (catsDict[item.category] == null)
                        catsDict[item.category] = [];
                    catsDict[item.category].push(item.pid);
                }
                // оставляем только склады на которые можно что то вывезти
                exportWares = filterWares(exportWares, dataCache.map((v, i, a) => v.pid));
                // для вывода в селект, формируем для каждого склада список отделов для которых склад может быть использован
                // subid => {category => goodsCount}
                let wareCats = {};
                for (let subid in exportWares) {
                    let wp = exportWares[subid];
                    let cats = categories(wp.products, prodCatDict);
                    if (dictKeys(cats).length <= 0)
                        throw new Error(`что то пошло не так, список категорий для склада ${wp.name} пустой`);
                    wareCats[subid] = cats;
                }
                // размещение селектов
                //
                // cелект для списка отделов
                let $catSel = $(`<select id="exportCats"><option value="off"> ------ </option></select>`);
                for (let catName in catsDict) {
                    let cnt = catsDict[catName];
                    let opt = `<option value="${catName}">${catName} (${cnt.length})</option>`;
                    $catSel.append(opt);
                }
                // cелект со складами
                let $wareSel = $(`<select id="exportWares"><option value="off"> ------ </option></select>`);
                for (let key in exportWares) {
                    let subid = parseInt(key);
                    let wp = exportWares[subid];
                    let cats = wareCats[subid];
                    // из словаря категорий формируем массив строк для удобства
                    let catsStrArr = [];
                    for (let catName in cats)
                        catsStrArr.push(`${catName} (${cats[catName]})`);
                    // список всех категорий в тултип суем
                    let tooltipStr = `${wp.city} (${wp.spec})\n-----------\n${catsStrArr.join("\n")}`;
                    let opt = `<option value="${subid}" title="${tooltipStr}">${wp.name} (${wp.spec})</option>`;
                    $wareSel.append(opt);
                }
                // суем селекты и подравниваем ширину
                let $div = $(`<div style="margin:10px 0 0 10px; display:inline-block"></div>`).append($catSel, "<br>", $wareSel);
                $html.find("table.list").before($div);
                let ws = $div.find("select").map((i, el) => $(el).width()).get();
                $div.find("select").width(Math.max(100, ...ws)); // минимально 100 пикселей
                // выбор селекта отделов, автоматом формирует селект складов для данного отдела
                $catSel.on("change", function (event) {
                    //console.log("catSel.changed fired");
                    let $s = $(this);
                    let selectedCat = $s.val();
                    // все склады не содержащие нужные отделы, скроем из селекта
                    $wareSel.trigger("catChanged", selectedCat);
                });
                // обновился выбор категории, обновить надо список складов
                $wareSel.on("catChanged", function (event, selectedCat) {
                    //console.log("wareSe.catChanged fired");
                    let $s = $(this);
                    let val = $s.val(); // off || ware
                    let $options = $s.find("option");
                    // если сброс категории, то покажем все склады
                    if (selectedCat == "off") {
                        $options.show();
                        if (val != "off") {
                            $s.val("off");
                            $s.trigger("change");
                        }
                        return;
                    }
                    // скроем часть складов которые недоступны для категории
                    $options.each((i, e) => {
                        let $o = $(e);
                        if ($o.val() == "off")
                            return;
                        let subid = parseInt($o.val());
                        if (wareCats[subid][selectedCat] == null)
                            $o.hide();
                        else
                            $o.show();
                    });
                    if (val != "off") {
                        $s.val("off");
                        $s.trigger("change");
                    }
                });
                $wareSel.on("change", function (event) {
                    //console.log("wareSel.changed fired");
                    let $s = $(this);
                    let val = $s.val(); //off || subid
                    let selectedCat = $catSel.val();
                    if (val == "off") {
                        // убираем подсветку и разрешаем тыкать все галочки что есть
                        for (let obj of dataCache) {
                            obj.row.removeClass(selClassName);
                            obj.cbx.prop("checked", false).prop("disabled", false);
                        }
                        return;
                    }
                    else {
                        // подсвечивать будем только в соответствии с выбранным отделом, ну или все если отдел не выбран
                        let subid = parseInt(val);
                        let wp = exportWares[subid];
                        for (let obj of dataCache) {
                            let wareHasIt = wp.products.find((v, i) => obj.pid == v.id) != null;
                            let exportable = wareHasIt && obj.available > 0 && (selectedCat == "off" || selectedCat == obj.category);
                            if (exportable) {
                                obj.row.toggleClass(selClassName, true);
                                obj.cbx.prop("checked", true).prop("disabled", false);
                            }
                            else {
                                obj.row.removeClass(selClassName);
                                obj.cbx.prop("checked", false).prop("disabled", true);
                            }
                        }
                    }
                });
                // глобальный чекбокс надо заставить работать иначе, чтобы он учитывал наши ограничения
                //
                $globalChbx.on("click", function (event) {
                    let $chbx = $(this);
                    let checked = $chbx.prop("checked") == true;
                    let selectedCat = $catSel.val();
                    let selectedWare = $wareSel.val();
                    // если выбран отдел, то только в рамках отдела. А если выбран склад то только в рамках склада
                    if (checked) {
                        if (selectedCat == "off" && selectedWare == "off") {
                            // просто выделяем все продукты
                            for (let item of dataCache)
                                item.cbx.prop("checked", true);
                        }
                        else if (selectedCat != "off" && selectedWare == "off") {
                            // выделяем только выбранный отдел
                            let cache = dataCache.filter((v, i, a) => v.category == selectedCat);
                            for (let item of cache)
                                item.cbx.prop("checked", true);
                        }
                        else if (selectedWare != "off") {
                            // тут тупо полагаемся на класс строки, так как при выборе склада всегда будет выделение
                            let cache = dataCache.filter((v, i, a) => v.row.hasClass(selClassName));
                            for (let item of cache)
                                item.cbx.prop("checked", true);
                        }
                    }
                    else {
                        for (let item of dataCache)
                            item.cbx.prop("checked", false);
                    }
                });
                // Кнопка экспорта и сам экспорт
                //
                // вниз страницы суем кнопку экспорта
                let $expAllBtn = $(`<input type="button" id="doExport" class="button160 e2w"  data-mult="0" value="Вывезти всё">`);
                let $exp2Btn = $(`<input type="button" id="doExport2" class="button160 e2w" data-mult="2" value="Оставить 2*sold">`);
                let $exp3Btn = $(`<input type="button" id="doExport3" class="button160 e2w" data-mult="3" value="Оставить 3*sold">`);
                $html.find("table.buttonset_noborder input.button205").after($expAllBtn, $exp2Btn, $exp3Btn);
                $html.find("table.buttonset_noborder").on("click", "input.e2w", null, function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // если не выбрано в селекте и нет галочек то нечего экспортить. хрен
                        if ($wareSel.val() == "off") {
                            alert("Не выбран склад на который вывозить товары.\nЭкспорт невозможен.");
                            return;
                        }
                        let pids = dataCache.filter((v, i, a) => v.cbx.prop("checked") == true);
                        if (pids.length <= 0) {
                            alert("Не выбрано ни одного товара.\nЭкспорт невозможен.");
                            return;
                        }
                        // чето выбрано, надо таки экспортить
                        //console.log(pids.map((v, i, a) => prodCatDict[v].name));
                        // subid
                        let n = extractIntPositive(document.location.pathname);
                        if (n == null)
                            throw new Error(`на нашел subid юнита в ссылке ${document.location.pathname}`);
                        let subid = n[0];
                        let wareSubid = numberfyOrError($wareSel.val());
                        // теперь надо множитель дернуть для остатка
                        let mult = numberfyOrError($(this).data("mult"), -1);
                        for (let obj of pids) {
                            if (obj.brand_id == null)
                                alert(`Товар ${obj.prod_name} будет вывезен. Код бренда не найден.`);
                            let url = `/${Realm}/window/unit/view/${subid}/product_move_to_warehouse/${obj.pid}/${obj.brand_id}`;
                            let data = {
                                qty: obj.available - obj.sold * mult,
                                unit: wareSubid,
                                doit: "Ok"
                            };
                            if (data.qty <= 0)
                                continue;
                            yield tryPost_async(url, data); // если задать неадекватный адрес склада то молча не вывозит и все.
                            //console.log(data);
                        }
                        document.location.reload();
                    });
                });
            });
        }
        function tradehallPrice() {
            let $inputs = $html.find("input[name^='productData[price]'");
            $inputs.each((i, e) => {
                let $inp = $(e);
                $inp.before(`<input type='button' class="pm" data-oper='dec' value='-'>`);
                $inp.after(`<input type='button' class="pm" data-oper='inc' value='+'>`);
            });
            oneOrError($html, "table.grid").on("click", "input.pm", null, function (event) {
                //console.log("input.pm click fired");
                let $btn = $(this);
                let oper = $btn.data("oper");
                let $price = oneOrError($btn.closest("td"), "input:text");
                let price = numberfyOrError($price.val());
                price = oper == "inc" ? price * (1 + PriceStep / 100) : price * (1 - PriceStep / 100);
                $price.val(price.toFixed(2));
            });
        }
        function wareSale() {
            // subid 
            let n = extractIntPositive(document.location.pathname);
            if (n == null)
                throw new Error(`на нашел subid юнита в ссылке ${document.location.pathname}`);
            let subid = n[0];
            // name
            let [name, city] = parseUnitNameCity($html);
            let dict = restoreWare();
            let isSaved = dict[subid] != null;
            let saveWare = () => {
                // собираем всю инфу по товарам которые может хранить собственно сей склад и подготавливаем Запись
                let [, saleItems] = parseWareSaleNew(document, document.location.pathname);
                let products = dictValues(saleItems).map((v, i, a) => v.product);
                dict[subid] = {
                    name: name,
                    city: city,
                    products: products,
                    spec: spec
                };
                storeWare(dict);
            };
            let deleteWare = () => {
                delete dict[subid];
                storeWare(dict);
            };
            // если спецуха изменилась, то обновим данные по складу
            let spec = oneOrError($html, "table:has(a.popup[href*='speciality_change'])").find("td").eq(2).text().trim();
            if (isSaved && dict[subid].spec != spec)
                saveWare();
            // рисуем кнопки хуёпки
            let html = `<input type="checkbox" ${isSaved ? "checked" : ""} id="saveWare" style="margin-left:30px"><label for="saveWare">Запомнить склад</label>`;
            $html.find("label[for='filter-empty-qty']").after(html);
            $html.find("#saveWare").on("click", (event) => {
                let $cbx = $(event.target);
                if ($cbx.prop("checked"))
                    saveWare();
                else
                    deleteWare();
            });
        }
    });
}
/**
 * Сохраняет данные в хранилище
 * @param dict
 */
function storeWare(dict) {
    nullCheck(dict);
    let storageKey = buildStoreKey(Realm, Export2WareStoreKeyCode);
    localStorage[storageKey] = LZString.compress(JSON.stringify(dict));
}
/**
 * Возвращает считанный словарь складов для экспорта либо пустой словарь если ничего нет
 */
function restoreWare() {
    // читаем с хранилища, есть ли данные по складу там
    let storageKey = buildStoreKey(Realm, Export2WareStoreKeyCode);
    let data = localStorage.getItem(storageKey);
    return data == null ? {} : JSON.parse(LZString.decompress(data));
}
/**
 * Читает с локалстораджа данные по розничным товарам с категориями.
   Если там нет, то тащит и сохраняет на будущее
 */
function getProdWithCategories_async() {
    return __awaiter(this, void 0, void 0, function* () {
        let storageKey = buildStoreKey(Realm, ProdCatStoreKeyCode);
        let data = localStorage.getItem(storageKey);
        let todayStr = dateToShort(nullCheck(GameDate));
        // если сегодня уже данные засейвили, тогда вернем их
        // обновлять будем раз в день насильно. вдруг введут новые продукты вся херня
        if (data != null) {
            let [dateStr, prods] = JSON.parse(LZString.decompress(data));
            if (todayStr == dateStr)
                return prods;
        }
        // если данных по категориям еще нет, надо их дернуть и записать в хранилище на будущее
        let url = formatStr(`/api/{0}/main/product/goods`, Realm);
        log("Список всех розничных продуктов устарел. Обновляем.");
        let jsonObj = yield tryGetJSON_async(url);
        let prods = parseRetailProductsAPI(jsonObj, url);
        localStorage[storageKey] = LZString.compress(JSON.stringify([todayStr, prods]));
        return prods;
    });
}
/**
 * формирует общий список ТМ товаров включая франшизы и пишет в хранилище. бдит за обновлением
 */
function getTMProducts_async() {
    return __awaiter(this, void 0, void 0, function* () {
        let storageKey = buildStoreKey(Realm, TMStoreKeyCode);
        let data = localStorage.getItem(storageKey);
        let today = nullCheck(GameDate);
        // обновлять будем раз в виртогод насильно. вдруг введут новые продукты вся херня
        if (data != null) {
            let [dateStr, tm] = JSON.parse(LZString.decompress(data));
            if (today.getFullYear() == dateFromShort(dateStr).getFullYear())
                return tm;
        }
        log("Список всех ТМ продуктов устарел. Обновляем.");
        let urlTM = formatStr(`/{0}/main/globalreport/tm/info`, Realm);
        let html = yield tryGet_async(urlTM);
        let tm = parseTM(html, urlTM);
        let urlFranchise = formatStr(`/{0}/main/franchise_market/list`, Realm);
        html = yield tryGet_async(urlFranchise);
        let franchise = parseFranchise(html, urlTM);
        // теперь для списка ТМ надо дополнить франшизные продукты так как там не было brand_id для них
        for (let img in franchise) {
            let f = franchise[img];
            let t = tm[img];
            if (t == null)
                throw new Error(`что то пошло не так, среди брендов не нашли франшизу ${f.img}`);
            t.brand_id = f.brand_id;
        }
        let todayStr = dateToShort(today);
        localStorage[storageKey] = LZString.compress(JSON.stringify([todayStr, tm]));
        return tm;
    });
}
/**
 * Для заданного набора продуктов выдает список розничных отделов c кол-вом продуктов в каждом
 * @param prods список продуктов
 * @param prodDict словарь содержащий данные по принадлежности продуктов к розничным отделам
 */
function categories(prods, prodCatDict) {
    let cats = {};
    for (let p of prods) {
        let papi = prodCatDict[p.id];
        if (papi == null)
            throw new Error(`В словаре всех розничных продуктов не найден товар pid:${p.id} img:${p.img}`);
        cats[papi.product_category_name] = cats[papi.product_category_name] == null
            ? 1
            : cats[papi.product_category_name] + 1;
    }
    return cats;
}
/**
 * оставляем только склады которые могут хранить хоть 1 продукт из списка
   оставляем только те продукты на складе которые есть в магазине.
   ориентир по pid поэтому бренды будут оставаться даже если в магазе их нет. пофиг
   исходный словарь не затрагивает. формирует новый
 * @param waresDict  список складов
 * @param pids список pid искомых продуктов
 */
function filterWares(waresDict, pids) {
    let resDict = {};
    for (let subid in waresDict) {
        let wp = waresDict[subid];
        let ints = intersect(wp.products.map((v, i, a) => v.id), pids);
        if (ints.length <= 0)
            continue;
        // если есть на складе хранение брендованных, то их pid дублирует обычные товары и число хранения будет больше
        // ровно на число брендованных товаров
        resDict[subid] = {
            name: wp.name,
            city: wp.city,
            spec: wp.spec,
            products: wp.products.filter((v, i, a) => isOneOf(v.id, ints))
        };
    }
    return resDict;
}
// всякий мусор для работы всего
//
var UnitTypes;
// всякий мусор для работы всего
//
(function (UnitTypes) {
    UnitTypes[UnitTypes["unknown"] = 0] = "unknown";
    UnitTypes[UnitTypes["animalfarm"] = 1] = "animalfarm";
    UnitTypes[UnitTypes["farm"] = 2] = "farm";
    UnitTypes[UnitTypes["lab"] = 3] = "lab";
    UnitTypes[UnitTypes["mill"] = 4] = "mill";
    UnitTypes[UnitTypes["mine"] = 5] = "mine";
    UnitTypes[UnitTypes["office"] = 6] = "office";
    UnitTypes[UnitTypes["oilpump"] = 7] = "oilpump";
    UnitTypes[UnitTypes["orchard"] = 8] = "orchard";
    UnitTypes[UnitTypes["sawmill"] = 9] = "sawmill";
    UnitTypes[UnitTypes["shop"] = 10] = "shop";
    UnitTypes[UnitTypes["seaport"] = 11] = "seaport";
    UnitTypes[UnitTypes["warehouse"] = 12] = "warehouse";
    UnitTypes[UnitTypes["workshop"] = 13] = "workshop";
    UnitTypes[UnitTypes["villa"] = 14] = "villa";
    UnitTypes[UnitTypes["fishingbase"] = 15] = "fishingbase";
    UnitTypes[UnitTypes["service_light"] = 16] = "service_light";
    UnitTypes[UnitTypes["fitness"] = 17] = "fitness";
    UnitTypes[UnitTypes["laundry"] = 18] = "laundry";
    UnitTypes[UnitTypes["hairdressing"] = 19] = "hairdressing";
    UnitTypes[UnitTypes["medicine"] = 20] = "medicine";
    UnitTypes[UnitTypes["restaurant"] = 21] = "restaurant";
    UnitTypes[UnitTypes["power"] = 22] = "power";
    UnitTypes[UnitTypes["coal_power"] = 23] = "coal_power";
    UnitTypes[UnitTypes["incinerator_power"] = 24] = "incinerator_power";
    UnitTypes[UnitTypes["oil_power"] = 25] = "oil_power";
    UnitTypes[UnitTypes["sun_power"] = 26] = "sun_power";
    UnitTypes[UnitTypes["fuel"] = 27] = "fuel";
    UnitTypes[UnitTypes["repair"] = 28] = "repair";
    UnitTypes[UnitTypes["apiary"] = 29] = "apiary";
    UnitTypes[UnitTypes["educational"] = 30] = "educational";
    UnitTypes[UnitTypes["kindergarten"] = 31] = "kindergarten";
    UnitTypes[UnitTypes["network"] = 32] = "network";
    UnitTypes[UnitTypes["it"] = 33] = "it";
    UnitTypes[UnitTypes["cellular"] = 34] = "cellular";
})(UnitTypes || (UnitTypes = {}));
var SalePolicies;
(function (SalePolicies) {
    SalePolicies[SalePolicies["nosale"] = 0] = "nosale";
    SalePolicies[SalePolicies["any"] = 1] = "any";
    SalePolicies[SalePolicies["some"] = 2] = "some";
    SalePolicies[SalePolicies["company"] = 3] = "company";
    SalePolicies[SalePolicies["corporation"] = 4] = "corporation";
})(SalePolicies || (SalePolicies = {}));
class ArgumentError extends Error {
    constructor(argument, message) {
        let msg = "argument";
        if (message)
            msg += " " + message;
        super(msg);
    }
}
function dictKeysN(dict) {
    return Object.keys(dict).map((v, i, arr) => parseInt(v));
}
function dictKeys(dict) {
    return Object.keys(dict);
}
function dictValues(dict) {
    let res = [];
    for (let key in dict)
        res.push(dict[key]);
    return res;
}
function dictValuesN(dict) {
    let res = [];
    for (let key in dict)
        res.push(dict[key]);
    return res;
}
function unique(array) {
    let res = [];
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (array.indexOf(item) === i)
            res.push(item);
    }
    return res;
}
function intersect(a, b) {
    // чтобы быстрее бегал indexOf в A кладем более длинный массив
    if (b.length > a.length) {
        let t = b;
        b = a;
        a = t;
    }
    // находим пересечение с дублями
    let intersect = [];
    for (let item of a) {
        if (b.indexOf(item) >= 0)
            intersect.push(item);
    }
    // если надо удалить дубли, удаляем
    return unique(intersect);
}
function isOneOf(item, arr) {
    if (arr.length <= 0)
        return false;
    return arr.indexOf(item) >= 0;
}
function getRealm() {
    // https://*virtonomic*.*/*/main/globalreport/marketing/by_trade_at_cities/*
    // https://*virtonomic*.*/*/window/globalreport/marketing/by_trade_at_cities/*
    let rx = new RegExp(/https:\/\/virtonomic[A-Za-z]+\.[a-zA-Z]+\/([a-zA-Z]+)\/.+/ig);
    let m = rx.exec(document.location.href);
    if (m == null)
        return null;
    return m[1];
}
function getRealmOrError() {
    let realm = getRealm();
    if (realm === null)
        throw new Error("Не смог определить реалм по ссылке " + document.location.href);
    return realm;
}
function getOnlyText(item) {
    // просто children() не отдает текстовые ноды.
    let $childrenNodes = item.contents();
    let res = [];
    for (let i = 0; i < $childrenNodes.length; i++) {
        let el = $childrenNodes.get(i);
        if (el.nodeType === 3)
            res.push($(el).text()); // так как в разных браузерах текст запрашивается по разному, 
        // универсальный способ запросить через jquery
    }
    return res;
}
function monthFromStr(str) {
    let mnth = ["январ", "феврал", "март", "апрел", "ма", "июн", "июл", "август", "сентябр", "октябр", "ноябр", "декабр"];
    for (let i = 0; i < mnth.length; i++) {
        if (str.indexOf(mnth[i]) === 0)
            return i;
    }
    return null;
}
function extractDate(str) {
    let dateRx = /^(\d{1,2})\s+([а-я]+)\s+(\d{1,4})/i;
    let m = dateRx.exec(str);
    if (m == null)
        return null;
    let d = parseInt(m[1]);
    let mon = monthFromStr(m[2]);
    if (mon == null)
        return null;
    let y = parseInt(m[3]);
    return new Date(y, mon, d);
}
function parseGameDate(html) {
    let $html = $(html);
    try {
        // вытащим текущую дату, потому как сохранять данные будем используя ее
        let $date = $html.find("div.date_time");
        if ($date.length !== 1)
            return null;
        //throw new Error("Не получилось получить текущую игровую дату");
        let currentGameDate = extractDate(getOnlyText($date)[0].trim());
        if (currentGameDate == null)
            return null;
        //throw new Error("Не получилось получить текущую игровую дату");
        return currentGameDate;
    }
    catch (err) {
        throw err;
    }
}
function logDebug(msg, ...args) {
    if (!$xioDebug)
        return;
    console.log(msg, ...args);
}
function buildStoreKey(realm, code, subid) {
    if (code.length === 0)
        throw new RangeError("Параметр code не может быть равен '' ");
    if (realm != null && realm.length === 0)
        throw new RangeError("Параметр realm не может быть равен '' ");
    if (subid != null && realm == null)
        throw new RangeError("Как бы нет смысла указывать subid и не указывать realm");
    let res = "^*"; // уникальная ботва которую добавляем ко всем своим данным
    if (realm != null)
        res += "_" + realm;
    if (subid != null)
        res += "_" + subid;
    res += "_" + code;
    return res;
}
function nullCheck(val) {
    if (val == null)
        throw new Error(`nullCheck Error`);
    return val;
}
function numberCheck(value) {
    if (!isFinite(value))
        throw new ArgumentError("value", `${value} не является числом.`);
    return value;
}
function stringCheck(value) {
    if (typeof (value) != "string")
        throw new ArgumentError("value", `${value} не является строкой.`);
    return value;
}
function dateToShort(date) {
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    let dStr = d < 10 ? "0" + d : d.toString();
    let mStr = m < 10 ? "0" + m : m.toString();
    return `${dStr}.${mStr}.${yyyy}`;
}
function formatStr(str, ...args) {
    let res = str.replace(/{(\d+)}/g, (match, number) => {
        if (args[number] == null)
            throw new Error(`плейсхолдер ${number} не имеет значения`);
        return args[number];
    });
    return res;
}
function parseJSON(jsonStr) {
    let obj = JSON.parse(jsonStr, (k, v) => {
        if (v === "t")
            return true;
        if (v === "f")
            return false;
        return (typeof v === "object" || isNaN(v)) ? v : parseFloat(v);
    });
    return obj;
}
function tryGetJSON_async(url, retries = 10, timeout = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        let $deffered = $.Deferred();
        $.ajax({
            url: url,
            type: "GET",
            cache: false,
            dataType: "text",
            success: (jsonStr, status, jqXHR) => {
                let obj = parseJSON(jsonStr);
                $deffered.resolve(obj);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                retries--;
                if (retries <= 0) {
                    let err = new Error(`can't get ${this.url}\nstatus: ${jqXHR.status}\ntextStatus: ${jqXHR.statusText}\nerror: ${errorThrown}`);
                    $deffered.reject(err);
                    return;
                }
                //logDebug(`ошибка запроса ${this.url} осталось ${retries} попыток`);
                let _this = this;
                setTimeout(() => {
                    $.ajax(_this);
                }, timeout);
            }
        });
        return $deffered.promise();
    });
}
function tryPost_async(url, form, retries = 10, timeout = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        let $deferred = $.Deferred();
        $.ajax({
            url: url,
            data: form,
            type: "POST",
            success: (data, status, jqXHR) => $deferred.resolve(data),
            error: function (jqXHR, textStatus, errorThrown) {
                retries--;
                if (retries <= 0) {
                    let err = new Error(`can't post ${this.url}\nstatus: ${jqXHR.status}\ntextStatus: ${jqXHR.statusText}\nerror: ${errorThrown}`);
                    $deferred.reject(err);
                    return;
                }
                //logDebug(`ошибка запроса ${this.url} осталось ${retries} попыток`);
                let _this = this;
                setTimeout(() => {
                    $.ajax(_this);
                }, timeout);
            }
        });
        return $deferred.promise();
    });
}
function tryGet_async(url, retries = 10, timeout = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        let $deffered = $.Deferred();
        $.ajax({
            url: url,
            type: "GET",
            success: (data, status, jqXHR) => $deffered.resolve(data),
            error: function (jqXHR, textStatus, errorThrown) {
                retries--;
                if (retries <= 0) {
                    let err = new Error(`can't get ${this.url}\nstatus: ${jqXHR.status}\ntextStatus: ${jqXHR.statusText}\nerror: ${errorThrown}`);
                    $deffered.reject(err);
                    return;
                }
                let _this = this;
                setTimeout(() => {
                    $.ajax(_this);
                }, timeout);
            }
        });
        return $deffered.promise();
    });
}
function parseTM(html, url) {
    let $html = $(html);
    try {
        let $imgs = isWindow($html, url)
            ? $html.filter("table.grid").find("img")
            : $html.find("table.grid").find("img");
        if ($imgs.length <= 0)
            throw new Error("Не найдено ни одного ТМ товара.");
        let dict = {};
        $imgs.each((i, el) => {
            let $img = $(el);
            let $tdText = $img.closest("td").next("td");
            // /img/products/brand/krakow.gif  - виртономская франшиза
            // /img/products/vera/brand/0909/tarlka.gif
            // /img/products/olga/brand/4100738.gif - реальный ТМ товар. Номер это номер ТМ по факту. надо парсить его
            let img = $img.attr("src");
            let [symbol,] = extractFile(img);
            let brand_id = numberfy(symbol);
            let brandName = $tdText.find("b").text().trim(); // может быть и пустым
            let prodName = getOnlyText($tdText).join("").trim();
            if (prodName.length <= 0)
                throw new Error("ошибка извлечения имени товара франшизы для " + img);
            dict[img] = {
                img: img,
                product_name: prodName,
                brand_name: brandName.length > 0 ? brandName : "noname",
                brand_id: brand_id > 0 ? brand_id : null,
                is_franchise: brand_id <= 0
            };
        });
        return dict;
    }
    catch (err) {
        throw err;
    }
}
function parseFranchise(html, url) {
    let $html = $(html);
    try {
        let $tbl = oneOrError($html, "form > table.list");
        let $rows = $tbl.find("tr.even, tr.odd");
        if ($rows.length < 1)
            throw new Error(`Не найдено ни одной франшизы по ссылке ${url}`);
        let dict = {};
        $rows.each((i, el) => {
            let $r = $(el);
            let $tds = $r.children("td");
            // brand_id
            let m = nullCheck(extractIntPositive($tds.eq(1).find("a").attr("href")));
            let brand_id = m[0];
            if (brand_id <= 0)
                throw new Error(`id франшизы не могут быть < 0. ${$tds.eq(1).find("a").attr("href")}`);
            let brandName = $tds.eq(2).text().trim();
            if (brandName.length <= 0)
                throw new Error(`имя франшизы ${brand_id} не может быть пустым`);
            // /img/products/vera/brand/0909/tarlka.gif
            let img = $tds.eq(2).find("img").attr("src");
            let prodName = $tds.eq(4).text().trim();
            if (prodName.length <= 0)
                throw new Error("ошибка извлечения имени товара франшизы для " + img);
            dict[img] = {
                img: img,
                product_name: prodName,
                brand_name: brandName,
                brand_id: brand_id > 0 ? brand_id : null,
                is_franchise: true
            };
        });
        return dict;
    }
    catch (err) {
        throw err;
    }
}
function parseRetailProductsAPI(jsonObj, url) {
    try {
        let res = {};
        let data = jsonObj;
        for (let pid in data) {
            let item = data[pid];
            if (item.product_symbol.length <= 0)
                throw new Error(`пустая строка вместо символа продукта для ${item.product_name}`);
            let p = {
                product_id: numberCheck(item.product_id),
                product_name: stringCheck(item.product_name),
                product_symbol: stringCheck(item.product_symbol),
                img: `/img/products/${item.product_symbol}.gif`,
                product_category_id: item.product_category_id,
                product_category_name: item.product_category_name
            };
            res[pid] = p;
        }
        return res;
    }
    catch (err) {
        throw err;
    }
}
function parseUnitNameCity($html) {
    let x;
    // сюда либо прилетает ВСЯ страница либо только шапка. поэтому фильтры надо БЕЗ использования классов шапки
    // ниже нам придется ремувать элементы, поэтому надо клонировать див.
    let $div = oneOrError($html, ".content:has(.bg-image) div.title").clone(false, false); // новая универсальное поле имя/городв
    // name
    let name = oneOrError($div, "h1").text().trim();
    if (name == null || name.length < 1)
        throw new Error(`не найдено имя юнита`);
    // city
    // Нижний Новгород (Россия)	строка с городом но там еще куча мусора блять
    // Нижний Новгород (Россия, Южная россия) может и так быть то есть регион
    // привяжемся к ссылке на страну она идет последней
    //let s = $div.find("a:last").map((i, el) => el.previousSibling.nodeValue)[0] as any as string;
    let s = $div.children().detach().end().text().trim();
    let last = s.split(/\t/).pop();
    if (last == null)
        throw new Error(`не найден город юнита ${name}`);
    let m = last.match(/^(.*)\(/i);
    if (m == null || m[1] == null || m[1].length <= 1)
        throw new Error(`не найден город юнита ${name}`);
    let city = m[1].trim();
    return [name, city];
}
function oneOrError($item, selector) {
    let $one = $item.find(selector);
    if ($one.length != 1)
        throw new Error(`Найдено ${$one.length} элементов вместо 1 для селектора ${selector}`);
    return $one;
}
function extractIntPositive(str) {
    let m = cleanStr(str).match(/\d+/ig);
    if (m == null)
        return null;
    let n = m.map((val, i, arr) => numberfyOrError(val, -1));
    return n;
}
function cleanStr(str) {
    return str.replace(/[\s\$\%\©]/g, "");
}
function numberfyOrError(str, minVal = 0, infinity = false) {
    let n = numberfy(str);
    if (!infinity && (n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY))
        throw new RangeError("Получили бесконечность, что запрещено.");
    if (n <= minVal) // TODO: как то блять неудобно что мин граница не разрешается. удобнее было бы если б она была разрешена
        throw new RangeError("Число должно быть > " + minVal);
    return n;
}
function numberfy(str) {
    // возвращает либо число полученно из строки, либо БЕСКОНЕЧНОСТЬ, либо -1 если не получилось преобразовать.
    if (String(str) === 'Не огр.' ||
        String(str) === 'Unlim.' ||
        String(str) === 'Не обм.' ||
        String(str) === 'N’est pas limité' ||
        String(str) === 'No limitado' ||
        String(str) === '无限' ||
        String(str) === 'Nicht beschr.') {
        return Number.POSITIVE_INFINITY;
    }
    else {
        // если str будет undef null или что то страшное, то String() превратит в строку после чего парсинг даст NaN
        // не будет эксепшнов
        let n = parseFloat(cleanStr(String(str)));
        return isNaN(n) ? -1 : n;
    }
}
function parseUnitType($html) {
    // классы откуда можно дернуть тип юнита грузятся скриптом уже после загрузки страницц
    // и добавляются в дивы. Поэтому берем скрипт который это делает и тащим из него информацию
    let lines = $html.find("div.title script").text().split(/\n/);
    let rx = /\bbody\b.*?\bbg-page-unit-(.*)\b/i;
    let typeStr = "";
    for (let line of lines) {
        let arr = rx.exec(line);
        if (arr != null && arr[1] != null) {
            typeStr = arr[1];
            break;
        }
    }
    if (typeStr.length <= 0)
        throw new Error("Невозможно спарсить тип юнита");
    // некоторый онанизм с конверсией но никак иначе
    let type = UnitTypes[typeStr] ? UnitTypes[typeStr] : UnitTypes.unknown;
    if (type == UnitTypes.unknown)
        throw new Error("Не описан тип юнита " + typeStr);
    return type;
}
function closestByTagName(items, tagname) {
    let tag = tagname.toUpperCase();
    let found = [];
    for (let i = 0; i < items.length; i++) {
        let node = items[i];
        while ((node = node.parentNode) && node.nodeName != tag) { }
        ;
        if (node)
            found.push(node);
    }
    return $(found);
}
function isWindow($html, url) {
    return url.indexOf("/window/") > 0;
}
function parseUnitTradeHall(html, url) {
    let $html = $(html);
    try {
        let $tbl = isWindow($html, url)
            ? $html.filter("table.list")
            : $html.find("table.list");
        let str = oneOrError($tbl, "div:first").text().trim();
        let filling = numberfyOrError(str, -1);
        let $rows = closestByTagName($html.find("a.popup"), "tr");
        let thItems = [];
        $rows.each((i, el) => {
            let $r = $(el);
            let $tds = $r.children("td");
            let cityRepUrl = oneOrError($tds.eq(2), "a").attr("href");
            let historyUrl = oneOrError($r, "a.popup").attr("href");
            // продукт
            // картинка может быть просто от /products/ так и ТМ /products/brand/ типа
            let img = oneOrError($tds.eq(2), "img").attr("src");
            let nums = extractIntPositive(cityRepUrl);
            if (nums == null)
                throw new Error("не получилось извлечь id продукта из ссылки " + cityRepUrl);
            let prodID = nums[0];
            let prodName = $tds.eq(2).attr("title").split("(")[0].trim();
            let product = { id: prodID, img: img, name: prodName };
            // склад. может быть -- вместо цены, кач, бренд так что -1 допускается
            let stock = {
                available: numberfyOrError($tds.eq(5).text(), -1),
                deliver: numberfyOrError($tds.eq(4).text().split("[")[1], -1),
                sold: numberfyOrError(oneOrError($tds.eq(3), "a.popup").text(), -1),
                ordered: numberfyOrError(oneOrError($tds.eq(4), "a").text(), -1),
                product: {
                    price: numberfy($tds.eq(8).text()),
                    quality: numberfy($tds.eq(6).text()),
                    brand: numberfy($tds.eq(7).text())
                }
            };
            // прочее "productData[price][{37181683}]" а не то что вы подумали
            let $input = oneOrError($tds.eq(9), "input");
            let name = $input.attr("name");
            let currentPrice = numberfyOrError($input.val(), -1);
            let dontSale = $tds.eq(9).find("span").text().indexOf("продавать") >= 0;
            // среднегородские цены
            let share = numberfyOrError($tds.eq(10).text(), -1);
            let city = {
                price: numberfyOrError($tds.eq(11).text()),
                quality: numberfyOrError($tds.eq(12).text()),
                brand: numberfyOrError($tds.eq(13).text(), -1)
            };
            thItems.push({
                product: product,
                stock: stock,
                price: currentPrice,
                city: city,
                share: share,
                historyUrl: historyUrl,
                reportUrl: cityRepUrl,
                name: name,
                dontSale: dontSale
            });
        });
        return [filling, thItems];
    }
    catch (err) {
        throw err;
    }
}
function parseWareSaleNew(html, url) {
    let $html = $(html);
    try {
        let $form = isWindow($html, url)
            ? $html.filter("form[name=storageForm]")
            : $html.find("form[name=storageForm]");
        if ($form.length <= 0)
            throw new Error("Не найдена форма.");
        let $tbl = oneOrError($html, "table.grid");
        let $rows = closestByTagName($tbl.find("select[name*='storageData']"), "tr");
        let dict = {};
        $rows.each((i, el) => {
            let $r = $(el);
            let $tds = $r.children("td");
            // товар
            let prod = parseProduct($tds.eq(2));
            let $price = oneOrError($r, "input.money[name*='[price]']");
            let $policy = oneOrError($r, "select[name*='[constraint]']");
            let $maxQty = oneOrError($r, "input.money[name*='[max_qty]']");
            let maxQty = numberfy($maxQty.val());
            maxQty = maxQty > 0 ? maxQty : null;
            dict[prod.img] = {
                product: prod,
                stock: parseStock($tds.eq(3)),
                outOrdered: numberfyOrError($tds.eq(4).text(), -1),
                price: numberfyOrError($price.val(), -1),
                salePolicy: $policy.prop("selectedIndex"),
                maxQty: maxQty,
                priceName: $price.attr("name"),
                policyName: $policy.attr("name"),
                maxName: $maxQty.attr("name"),
            };
        });
        return [$form, dict];
    }
    catch (err) {
        //throw new ParseError("sale", url, err);
        throw err;
    }
    function parseProduct($td) {
        // товар
        let $img = oneOrError($td, "img");
        let img = $img.attr("src");
        let name = $img.attr("alt");
        let $a = oneOrError($td, "a");
        let n = extractIntPositive($a.attr("href"));
        if (n == null || n.length > 1)
            throw new Error("не нашли id товара " + img);
        let id = n[0];
        return { name: name, img: img, id: id };
    }
    // если товара нет, то характеристики товара зануляет
    function parseStock($td) {
        let $rows = $td.find("tr");
        // могут быть прочерки для товаров которых нет вообще
        let available = numberfy(oneOrError($td, "td:contains(Количество)").next("td").text());
        if (available < 0)
            available = 0;
        return {
            available: available,
            product: {
                brand: 0,
                price: available > 0 ? numberfyOrError(oneOrError($td, "td:contains(Себестоимость)").next("td").text()) : 0,
                quality: available > 0 ? numberfyOrError(oneOrError($td, "td:contains(Качество)").next("td").text()) : 0
            }
        };
    }
}
function extractFile(fileUrl) {
    let items = fileUrl.split("/");
    if (items.length < 2)
        throw new Error(`Очевидно что ${fileUrl} не ссылка на файл`);
    let file = items[items.length - 1];
    let [symbol, ext] = file.split("."); // если нет расширения то будет undef во втором
    ext = ext == null ? "" : ext;
    if (symbol.length <= 0)
        throw new Error(`Нулевая длина имени файлв в ${fileUrl}`);
    return [symbol, ext];
}
function dateFromShort(str) {
    let items = str.split(".");
    let d = parseInt(items[0]);
    if (d <= 0)
        throw new Error("дата неправильная.");
    let m = parseInt(items[1]) - 1;
    if (m < 0)
        throw new Error("месяц неправильная.");
    let y = parseInt(items[2]);
    if (y < 0)
        throw new Error("год неправильная.");
    return new Date(y, m, d);
}
$(document).ready(() => run_async());

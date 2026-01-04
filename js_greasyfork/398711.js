// ==UserScript==
// @name         Poe trade finer-search-options
// @namespace    http://tampermonkey.net/
// @version      1.1.8
// @description  enables finer search options in Path of exile official trade site, allowing filtering in/out mods directly from the current search result list
// @author       Maxime B
// @match        https://www.pathofexile.com/trade
// @match        https://www.pathofexile.com/trade/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398711/Poe%20trade%20finer-search-options.user.js
// @updateURL https://update.greasyfork.org/scripts/398711/Poe%20trade%20finer-search-options.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    //---------HTML---------//
    const scriptStyle=$(`
        <style>
            #addFilter{ background: rgba(2,  93, 34, 0.75); }
            #rmvFilter{ background: rgba(93, 2,  2,  0.75); }
            #btns-finer{ left: auto; }
            .finer-filterable:hover { background: rgba(255, 255, 255, 0.2); }
            .finer-filtered{ position: relative; }
            .finer-filtered-overlay { z-index: -1;    position: absolute;    width: 100%;    height: 100%;    background: rgba(0, 136, 0, .25);    top: 0; }
            .btn-finer-search { padding: 0 10px;    color: white;    outline: solid 1px grey;}
            .hand{ cursor: pointer; }
            .finer-search-global-toggle-collapsed { position: absolute;    right: 5px;    top: 5px;    width: 15px;    height: 15px;    background: rgb(56, 35, 4);    cursor:pointer; }
            .upArr::before{ content:"\\25BE";    position: absolute;    font-size: 25px;    top: -10px;    left: -3px; }
            .dnArr::before{ content:"\\25B8";    position: absolute;    font-size: 25px;    top: -10px;    left: -3px; }
            #finer-search-global{ color: #fff;    height: max-content;    width: 12em;    background: rgba(0, 0, 0, 0.75);    position: fixed;    right: 10px;    top: 50px;    z-index: 1001;    font-size:130%;    user-select:none; }
            #finer-search-global-title{ outline: 1px solid rgb(138, 86, 9);    background-color: rgb(90, 56, 6);    width: inherit;    display: block;    text-align: center;    text-transform: capitalize;    font-size: 115%;    cursor: move; }
            .finer-global-btn{ background: rgb(15, 48, 77);    outline: solid 1px rgb(76, 76, 125);    margin-top: 10px;    padding: 1px 1px 1px 0.3em;     display: grid;    grid-gap:3px;    grid-template-areas: "mod-name mod-minus mod-plus";    grid-template-columns: auto 1em 1em;    text-transform: capitalize; }
            .finer-global-btn-pm { height: 1em;    border: 1px inset rgba(255, 255, 255, 0.445);    align-self: center;    text-align: cell;    display: flex;    justify-content: center;    align-items: center;    color: #fff;    background-color: rgb(77, 57, 14); }
            .finer-global-btn-pm.mod-name { text-align: cell;    grid-area: mod-name; }
            .finer-global-btn-pm.plus { background: rgb(29, 139, 53);     grid-area: mod-plus; }
            .finer-global-btn-pm.minus { background: rgb(139, 28, 28);    grid-area: mod-minus; }
            .finer-global-btn-pm.plus:hover, .finer-global-btn-pm.minus:hover { filter: brightness(140%); }
            .finer-search-global-toggle-collapsed:hover { filter: brightness(80%); }
            .finer-search-global-section-title { text-align: center;    display: block; }
            .finer-search-global-section + .finer-search-global-section { margin-top: 5px; }
            .finer-search-global-section { padding-top: 5px;    position: relative; }
            .finer-search-global-section + .finer-search-global-section { border-top: solid 1px; }
        </style>
    `);
    const globalFiner = $(`

        <div id="finer-search-global">
            <span id="finer-search-global-title">add to filters</span>
            <div class="finer-search-global-toggle-collapsed dnArr"></div>
            <div class="finer-search-global-body hidden">
                <div class="finer-search-global-section mods">
                    <span class="finer-search-global-section-title">- Modifiers -</span>
                    <div class="finer-search-global-toggle-collapsed dnArr"></div>
                    <div class="finer-search-global-section-body hidden">
                        <div data-type="life,cold,fire,ligt" class="finer-global-btn">
                            <span class="mod-name">all res & life</span>
                            <span title="increase min value by 10" class="finer-global-btn-pm plus  hand">+</span>
                            <span title="decrease min value by 10" class="finer-global-btn-pm minus hand">-</span>
                        </div>
                        <div data-type="allR" class="finer-global-btn">
                            <span class="mod-name">all resistances</span>
                            <span title="increase min value by 10" class="finer-global-btn-pm plus  hand">+</span>
                            <span title="decrease min value by 10" class="finer-global-btn-pm minus hand">-</span>
                        </div>
                        <div data-type="life" class="finer-global-btn">
                            <span class="mod-name">life</span>
                            <span title="increase min value by 10" class="finer-global-btn-pm plus  hand">+</span>
                            <span title="decrease min value by 10" class="finer-global-btn-pm minus hand">-</span>
                        </div>
                        <div data-type="cold" class="finer-global-btn">
                            <span class="mod-name">cold res</span>
                            <span title="increase min value by 10" class="finer-global-btn-pm plus  hand">+</span>
                            <span title="decrease min value by 10" class="finer-global-btn-pm minus hand">-</span>
                        </div>
                        <div data-type="fire" class="finer-global-btn">
                            <span class="mod-name">fire res</span>
                            <span title="increase min value by 10" class="finer-global-btn-pm plus  hand">+</span>
                            <span title="decrease min value by 10" class="finer-global-btn-pm minus hand">-</span>
                        </div>
                        <div data-type="ligt" class="finer-global-btn">
                            <span class="mod-name">lightning res</span>
                            <span title="increase min value by 10" class="finer-global-btn-pm plus hand">+</span>
                            <span title="decrease min value by 10" class="finer-global-btn-pm minus hand">-</span>
                        </div>
                        <div data-type="move" class="finer-global-btn">
                            <span class="mod-name">movement speed</span>
                            <span title="increase min value by 10" class="finer-global-btn-pm plus hand" >+</span>
                            <span title="decrease min value by 10" class="finer-global-btn-pm minus hand" >-</span>
                        </div>
                    </div>
                </div>
                <div class="finer-search-global-section misc">
                    <span class="finer-search-global-section-title">- Miscanellous -</span>
                    <div class="finer-search-global-toggle-collapsed dnArr"></div>
                    <div class="finer-search-global-section-body hidden">
                        <div data-type="" class="finer-global-btn">
                            <span class="mod-name">set Buyout limit</span>
                            <span title="increase min value by 10" class="finer-global-btn-pm plus  hand">+</span>
                            <span title="decrease min value by 10" class="finer-global-btn-pm minus hand">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     `);
    const filteredDiv = () => $(`<div class="finer-filtered-overlay"></div>`);
    const buttonsSpan = $(`
        <span class="lc l" id="btns-finer">
            <span class="d btn-finer-search hand" id="addFilter" title="add this mod to your search filters">+</span>
            <span class="d btn-finer-search hand" id="rmvFilter" title="remove this mod from your search results">-</span>
        </span>
    `);


//---------UTILS METHODS---------//
    const modMap={life:"total_life",cold:"total_cold_resistance",fire:"total_fire_resistance",ligt:"total_lightning_resistance",move:"increased_movement_speed",allR:"total_elemental_resistance"};

    const createFilter = _type => _type && ({ id: _type, value: {}, disabled: !1 });

    const finder = (e,v) => e.$vnode.tag.includes(v);

    const findVueItem = tags => tags.reduce((a,v)=> a.$children.find(e => finder(e,v)), window.app);

    const ItemResultPanelVueItem = () => findVueItem(["item-results-panel"]);

    const findVueResultItem = _itemId => findVueItem(["item-results-panel", "resultset"]).$children.find(e => e.itemId === _itemId);

    const ItemSearchGroupsVueItems = _type => findVueItem(["item-search-panel", "item-filter-panel"]).$children.filter(e => finder(e,"stat-filter-group") && (_type ? e.group.type === _type : true));

//---------ACTUAL CODE DOING STUFF AND ALL---------//
    $("body").append(scriptStyle);//append css to body
    $("#trade").append(globalFiner);//append global buttons to #trade

    let $dragging = null;
    let offset = null;

    //document listeners
    $(document)
        //-----------step 1 : hover a result row (i.e. an item) => check if any mod is already in search and dispatch action classes accordingly
        .on('mouseenter','.resultset > .row', function(e){ checkFilters(e, this) })
        //-----------step 2 : hover a mod => append or remove finer filter buttons
        //    on enter, if has class "finer-filterable", add the buttons ("idiot proofing" to an extend, so can not add multiple times the same mod especially not both [AND] && [NOT] at the same time)
        .on('mouseenter','.itemBoxContent > .content > div', function(e){ addButtons(e, this) })
        //    on leave, remove the buttons
        .on('mouseleave','.itemBoxContent > .content > div', function(e){ rmvButtons(e, this) })
        //-----------step 3 : on button click, do the magic thing the script exists for
        .on('click','#addFilter', function(e){ addOrRemoveFilter(e, true , this) })
        .on('click','#rmvFilter', function(e){ addOrRemoveFilter(e, false, this) })
        //-----------step 4 : on button click in the global div, add the corresponding mods to the search
        .on('click','#finer-search-global > .finer-search-global-body > .finer-search-global-section.mods > .finer-search-global-section-body > .finer-global-btn > .finer-global-btn-pm', function(e){ addPseudoMods(e) })
        .on('click','#finer-search-global > .finer-search-global-body > .finer-search-global-section.misc > .finer-search-global-section-body > .finer-global-btn > .finer-global-btn-pm', function(e){ addCurrencyLimit(e) })
        .on('click','.finer-search-global-toggle-collapsed', function(e){ toggleFiltersVisibility(e) })
        //-----------step 5 : on click in the global div title, toggle draggable
        .on("mousedown", "#finer-search-global-title", function (e) { handleDragMouseDown(e) })
        .on("mouseup", function (e) { clearDragVars() })
        .on("mousemove", 'body', function(e) { handleDragMove(e) })

    //fix for draggable going out of viewport when resizing
    $(window)
        .on('resize', function(e){ $('#finer-search-global').offset({ right: 10, top: 50 }) })

    const clearDragVars = () => {
        $dragging = null ;
        offset = null;
    }

    const handleDragMouseDown = e =>{
        $dragging = $(e.target).parent();
        const tmpoff = $dragging.offset();
        offset = {
            maxX:$(window).width()-$dragging.width(),
            maxY:$(window).height()-$dragging.height(),
            xoff: e.pageX - tmpoff.left,
            yoff: e.pageY - tmpoff.top
        }
    }

    const handleDragMove = e =>{
        if ($dragging){
            $dragging.offset({
                top: Math.max(0,Math.min(e.pageY- offset.yoff, offset.maxY)),
                left: Math.max(0,Math.min(e.pageX- offset.xoff, offset.maxX))
            });
        }
    }

    const toggleFiltersVisibility = e => {
        const toggler = $(e.target);
        toggler.toggleClass('dnArr').toggleClass('upArr');
        toggler.parent().children('[class*="body"]')
//         .animate( {height: "toggle"}, 500, 'easeInOutQuint' )
        .toggleClass('hidden');
    };

    const checkFilters = (e, ctx) => {
        const _row = $(ctx);
        if(_row.hasClass("finer-processed")) return;

        const rowid = _row.data("id");
        const mods = $(_row.find(".content")[0]).children('[class*="Mod"]');
        const ISGs = ItemSearchGroupsVueItems();

        [...mods].forEach(mod => {
            const _mod = $(mod);
            const modHash = ($(_mod.children(".lc.s")[0]).data("field")||'').slice(5);
            if(!modHash) return;
            _mod.data("hash", modHash);
            _mod.data("rowid", rowid);

            if(ISGs.some(isg => isg.filters.some(e => e.id === modHash))){
                _mod.addClass("finer-filtered");
                _mod.append(filteredDiv());
            }
            else{
                _mod.addClass("finer-filterable");
            }
        })

        $(_row).addClass("finer-processed");
    }

    const addPseudoMods = e => {
        const hashes = [...$(e.target).parent().data("type").split(',')];
        const more = $(e.target).hasClass("plus");

        const ISG = ItemSearchGroupsVueItems("and").find(e => e.index === 0);
        let reload = false;
        hashes.forEach(hash => {
            const reHashed = `pseudo.pseudo_${modMap[hash]}`;
            const currentMod = ISG.filters.find(e => e.id === reHashed);
            if(currentMod){
                const modIndex = ISG.filters.indexOf(currentMod);
                const currentModValue = ISG.state.filters[modIndex].value || {};
                const currentMin = currentModValue.min || 0;

                if(currentMin || more) ISG.updateFilter(modIndex,{ min: currentMin + (more ? 10 : -10) });
                else ISG.removeFilter(modIndex);
                reload=true;
            }
            else if(more){
                ISG.selectFilter(createFilter(reHashed));
                reload=true;
            }
        });
        if(reload){
            window.app.save(!0);
            $(".btn.search-btn").click();
        }
    }

    const addCurrencyLimit = e => {
        const more = $(e.target).hasClass("plus");
        const trade_filters = findVueItem(["item-search-panel", "item-filter-panel"]).$children.find(e => e.$vnode.key==="trade_filters")
        const { state:{ filters:{ price:{ max=0 }={} }={} }={} } = trade_filters;
        const filter = more ?
              {max:(max||4)+1}:
              max ?
                  {max:max-1||null}:
                  {};
        trade_filters.updateFilter(3,filter);
        window.app.save(!0);
        $(".btn.search-btn").click();
    }



    const addButtons = (e,ctx) =>$(ctx).hasClass("finer-filterable") && $(ctx).append(buttonsSpan);

    const rmvButtons = (e,ctx) => $(ctx).remove($("#btns-finer"));

    const addOrRemoveFilter = (e, _and, ctx) => {
        const filterType = _and ? "and" : "not";
        const _mod = $($(ctx).parents("div")[0]);
        const VueElem = findVueResultItem(_mod.data("rowid")) || {};

        const _statHash = _mod.data("hash");
        const newFilter = createFilter(_statHash);

        const ISG = ItemSearchGroupsVueItems(filterType).find(e => e.index !== 0);

        if(ISG) ISG.selectFilter(newFilter);
        else VueElem.$store.commit("pushStatGroup", { type: filterType, filters: [newFilter]});

        window.app.$refs.toastr.Add({ msg: VueElem.translate(`the stat ${_statHash} has been ${_and ? `added to`:`removed from`} your stat filters.`), progressbar: !1, timeout: 3e3 })
        window.app.save(!0);
        ItemResultPanelVueItem().search();
    }
})(window.jQuery);

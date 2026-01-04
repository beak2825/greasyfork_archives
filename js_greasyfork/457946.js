// ==UserScript==
// @name          hwm_armory_framework
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       1.5.1
// @description   Helper for other hwm_armory scripts
// @author        bonArt
// @license       GPL-3.0-only
// @icon          https://dcdn.heroeswm.ru/i/btns/job_fl_btn_warehouse.png
// @match         https://*.heroeswm.ru/sklad_info.php?*
// @match         https://178.248.235.15/sklad_info.php?*
// @match         https://www.lordswm.com/sklad_info.php?*
// @match         https://my.lordswm.com/sklad_info.php?*
// @supportURL    https://www.heroeswm.ru/sms-create.php?mailto_id=117282
// ==/UserScript==

/**
 * @enum
 */
const FrameworkClassNames = {
    ARMORY_BOX: 'afw_armory_box',
    OVERVIEW_BOX: 'afw_armory_overview_box',
    INFO_BOX: 'afw_armory_info_box',
    ACCOUNT_BOX: 'afw_armory_account_box',
    ONLINE_TOGGLE_BOX: 'afw_armory_online_toggle_box',
    MANAGEMENT_TOGGLE_BOX: 'afw_armory_management_toggle_box',
    SECTORS_BOX: 'afw_armory_sectors_box',
    MANAGEMENT_BOX: 'afw_armory_management_box',
    MANAGEMENT_HEADER_BOX: 'afw_armory_management_header_box',
    MANAGEMENT_HEADER_PUTS_BOX: 'afw_armory_management_header_puts_box',
    MANAGEMENT_HEADER_BALANCE_BOX: 'afw_armory_management_header_balance_box',
    MANAGEMENT_HEADER_BATTLES_BOX: 'afw_armory_management_header_battles_box',
    MANAGEMENT_HEADER_SMITHS_BOX: 'afw_armory_management_header_smiths_box',
    MANAGEMENT_HEADER_CAPACITY_BOX: 'afw_armory_management_header_capacity_box',
    MANAGEMENT_BODY_BOX: 'afw_armory_management_body_box',
    MANAGEMENT_BODY_PUTS_BOX: 'afw_armory_management_body_puts_box',
    MANAGEMENT_BODY_BALANCE_BOX: 'afw_armory_management_body_balance_box',
    MANAGEMENT_BODY_BATTLES_BOX: 'afw_armory_management_body_battles_box',
    MANAGEMENT_BODY_SMITHS_BOX: 'afw_armory_management_body_smiths_box',
    MANAGEMENT_BODY_CAPACITY_BOX: 'afw_armory_management_body_capacity_box',
    TAKES_BOX: 'afw_armory_takes_box',
    TAKES_REPAIRS_HEADER_BOX: 'afw_armory_takes_repairs_header_box',
    TAKES_REPAIRS_BODY_BOX: 'afw_armory_takes_repairs_body_box',
    TAKES_LEASES_HEADER_BOX: 'afw_armory_takes_leases_header_box',
    TAKES_LEASES_BODY_BOX: 'afw_armory_takes_leases_body_box',
    TABS_BOX: 'afw_armory_tabs_box',
    DESCRIPTION_BOX: 'afw_armory_description_box',
    DESCRIPTION_FORM_BOX: 'afw_armory_description_form',
    ARTS_BOX: 'afw_armory_arts_box',
    ARTS_LIST_BOX: 'afw_armory_arts_list_box',
    ARTS_ROW_BOX: 'afw_armory_arts_row_box',
    ARTS_HEADER_BOX: 'afw_armory_arts_header_box',
    ARTS_FOOTER_BOX: 'afw_armory_arts_footer_box',
};

/**
 * @enum
 */
const ArmoryTab = {
    TAB_DESCRIPTION: 0,
    TAB_WEAPON: 1,
    TAB_ARMOR: 2,
    TAB_JEWELRY: 3,
    TAB_BACKPACK: 4,
    TAB_SETS: 5,
    TAB_ON_LEASE: 6,
    TAB_UNAVAILABLE: 7,
};

/**
 * @type {ArmoryFramework} _ArmoryFrameworkInstance
 * @private
 */
let _ArmoryFrameworkInstance;

/* <editor-fold desc="errors"> */

class AlreadyInitializedError extends Error {
    constructor() {
        super();

        this.message = 'Framework already initialized';
    }
}

class UnsupportedFeatureError extends Error {
    constructor(feature) {
        super();

        this.message = `Framework doesn't support ${feature} yet`;
    }
}

class FrameworkError extends Error {
    /**
     * @type {object}
     * @public
     */
    context = {};

    constructor(message, context) {
        super(message);

        this.context = context;
    }
}

class LayoutError extends FrameworkError {
    constructor(context) {
        super(`Something happen with game layout`, context);
    }
}

class BoxMissedException extends Error {}

/* </editor-fold> */

class ArmoryFramework {
    /**
     * @type {boolean}
     * @private
     */
    _initialized = false;

    /**
     * @type {boolean}
     * @private
     */
    _isManagementMode;

    /**
     * @type {ArmoryTab}
     */
    activeTab = ArmoryTab.TAB_DESCRIPTION;

    /**
     * @type {ArmoryBox}
     * @public
     * @readonly
     */
    armory;

    /**
     * @return {ArmoryFramework|null}
     */
    static init() {
        if (!_ArmoryFrameworkInstance || !_ArmoryFrameworkInstance?._initialized) {
            console.info('Armory Framework initialization started');

            try {
                _ArmoryFrameworkInstance = new ArmoryFramework();
            } catch (e) {
                if (e instanceof UnsupportedFeatureError) {
                    console.warn(e.message);
                    return null;
                }

                if (e instanceof AlreadyInitializedError) {
                    console.info(e.message);
                    return _ArmoryFrameworkInstance;
                }

                console.error('Something happen while framework initializing', e.context);
                throw e;
            }

            console.info('Armory Framework initialized');
        }

        return _ArmoryFrameworkInstance;
    }

    /**
     * @private use ArmoryFramework.init()
     */
    constructor() {
        this._initFramework();
    }

    /**
     * @throws {Error} on any init failure
     * @private
     */
    _initFramework() {
        if (!this.isManagementMode()) {
            throw new UnsupportedFeatureError('non-management mode');
        }

        if (this._initialized) {
            throw new AlreadyInitializedError();
        }

        this.activeTab = this._findActiveTab();
        this.armory = new ArmoryBox(this._findInitialAnchor(), this.activeTab);
        this._initialized = true;
    }

    /**
     * @returns {boolean}
     */
    isManagementMode() {
        if (this._isManagementMode === undefined) {
            this._isManagementMode = document.body.innerHTML.search('sklad_rc_on=0') > -1;
        }

        return this._isManagementMode;
    }

    /**
     * @returns {HTMLImageElement}
     * @throws {LayoutError} on init failure
     * @private
     */
    _findInitialAnchor() {
        const initialAnchor = document.getElementsByClassName('rs').item(0);
        if (initialAnchor && initialAnchor.tagName === 'IMG') {
            return initialAnchor;
        }

        throw new LayoutError({element: this, anchor: initialAnchor});
    }

    /**
     * @returns {ArmoryTab}
     * @private
     */
    _findActiveTab() {
        const params = new URLSearchParams(window.location.search);

        if (!params.has('cat') || +params.get('cat') < 0) {
            return ArmoryTab.TAB_DESCRIPTION;
        }

        if (Number.isNaN(params.get('cat'))) {
            return ArmoryTab.TAB_WEAPON;
        }

        switch (+params.get('cat')) {
            case 0:
                return ArmoryTab.TAB_WEAPON;
            case 1:
                return ArmoryTab.TAB_ARMOR;
            case 2:
                return ArmoryTab.TAB_JEWELRY;
            case 3:
                return ArmoryTab.TAB_SETS;
            case 4:
                return ArmoryTab.TAB_ON_LEASE;
            case 5:
                return ArmoryTab.TAB_UNAVAILABLE;
            case 6:
            default:
                return ArmoryTab.TAB_BACKPACK;
        }
    }

    /* <editor-fold desc="common"> */

    /**
     * @param {string} name
     * @param {string} innerHTML
     * @returns {HTMLLabelElement}
     */
    buildCheckboxLabel(name, innerHTML) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = name;

        const label = document.createElement('label');
        label.append(checkbox);
        label.append(innerHTML);

        return label;
    }

    /* </editor-fold> */
}

/**
 * @abstract
 */
class Box {
    /**
     * @type {HTMLElement}
     * @public
     * @readonly
     */
    box;

    /**
     * @param {HTMLElement} anchor
     * @throws {LayoutError} on init failure
     */
    constructor(anchor) {
        this._initBox(anchor);
    }

    /**
     * @throws {LayoutError} on init failure
     * @protected
     */
    _initBox(anchor) {
        const box = this._findBox(anchor);

        if (box?.tagName === this._getBoxTag()) {
            box.classList.add(this._getBoxClassName());
            this.box = box;
            return;
        }

        throw new LayoutError({element: this, box: box, anchor: anchor});
    }

    /**
     * @return {HTMLElement}
     * @abstract
     * @protected
     */
    _findBox(anchor) {}

    /**
     * @todo replace name
     * @return {string}
     * @abstract
     * @protected
     */
    _getBoxTag() {}

    /**
     * @return {string}
     * @abstract
     * @protected
     */
    _getBoxClassName() {}
}

/**
 * @abstract
 */
class TableSectionBasedBox extends Box {
    _getBoxTag() {
        return 'TBODY';
    }
}

/**
 * @abstract
 */
class TableRowBasedBox extends Box {
    _getBoxTag() {
        return 'TR';
    }
}

/**
 * @abstract
 */
class TableCellBasedBox extends Box {
    _getBoxTag() {
        return 'TD';
    }
}

/**
 * @abstract
 */
class FormBasedBox extends Box {
    _getBoxTag() {
        return 'FORM';
    }
}

class ArmoryBox extends TableCellBasedBox {
    /**
     * @type {OverviewBox}
     * @public
     * @readonly
     */
    overview;

    /**
     * @type {ManagementBox}
     * @public
     * @readonly
     */
    management;

    /**
     * @type {TakesBox|null}
     * @public
     * @readonly
     */
    takes;

    /**
     * @type {TabsBox}
     * @public
     * @readonly
     */
    tabs;

    /**
     * @type {DescriptionContainer|null}
     * @public
     * @readonly
     */
    description;

    /**
     * @type {ArtsBox|null}
     * @public
     * @readonly
     */
    arts;

    /**
     * @param {HTMLElement} anchor
     * @param {ArmoryTab} activeTab
     * @throws {Error} on init failure
     */
    constructor(anchor, activeTab) {
        super(anchor);

        const box = this.box;

        this.overview = new OverviewBox(box);
        this.management = new ManagementBox(box);

        try {
            this.takes = new TakesBox(box);
        } catch (e) {
            if (!(e instanceof BoxMissedException)) {
                throw e;
            }
            this.takes = null;
        }

        this.tabs = new TabsBox(box);

        switch (activeTab) {
            case ArmoryTab.TAB_DESCRIPTION:
                this.description = new DescriptionContainer(box);
                this.arts = null;
                break;
            case ArmoryTab.TAB_ON_LEASE:
            case ArmoryTab.TAB_WEAPON:
            case ArmoryTab.TAB_ARMOR:
            case ArmoryTab.TAB_JEWELRY:
            case ArmoryTab.TAB_BACKPACK:
            case ArmoryTab.TAB_SETS:
            case ArmoryTab.TAB_UNAVAILABLE:
                this.description = null;
                this.arts = new ArtsBox(box, activeTab);
        }
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement}
     */
    _findBox(anchor) {
        return anchor
            ?.parentElement // td#0, armory account clear part
            ?.parentElement // tr#0
            ?.parentElement // tbody#0
            ?.parentElement // table#0
            ?.parentElement // td#0, armory account
            ?.parentElement // tr#0
            ?.parentElement // tbody#0
            ?.parentElement // table#0
            ?.parentElement // td#1
            ?.parentElement // tr#0
            ?.parentElement // tbody#0, armory overview
            ?.parentElement // table#0
            ?.parentElement; // td#0, armory box
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARMORY_BOX;
    }
}

/* <editor-fold desc="armory overview"> */

class OverviewBox extends TableSectionBasedBox {
    /**
     * @type {OverviewInfoBox}
     * @public
     * @readonly
     */
    info;

    /**
     * @type {OverviewAccountBox}
     * @public
     * @readonly
     */
    account;

    /**
     * @type {OverviewOnlineToggleBox}
     * @public
     * @readonly
     */
    onlineToggle;

    /**
     * @type {OverviewManagementToggleBox}
     * @public
     * @readonly
     */
    managementToggle;

    /**
     * @type {OverviewSectorsBox}
     * @public
     * @readonly
     */
    sectors;

    constructor(anchor) {
        super(anchor);

        const box = this.box;

        this.info = new OverviewInfoBox(box);
        this.account = new OverviewAccountBox(box);
        this.onlineToggle = new OverviewOnlineToggleBox(box);
        this.managementToggle = new OverviewManagementToggleBox(box);
        this.sectors = new OverviewSectorsBox(box);
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // table
            ?.children.item(0); // tbody
    }

    _getBoxClassName() {
        return FrameworkClassNames.OVERVIEW_BOX;
    }
}

class OverviewInfoBox extends TableCellBasedBox {
    /**
     * @returns {number}
     */
    getCurrentCapacity() {
        return +this.box.innerHTML.match(/<b>(\d+)<\/b> из \d+/)?.at(1);
    }

    /**
     * @returns {number}
     */
    getTotalCapacity() {
        return +this.box.innerHTML.match(/<b>\d+<\/b> из (\d+)/).at(1);
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr
            ?.children.item(0); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.INFO_BOX;
    }
}

class OverviewAccountBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableElement}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr
            ?.children.item(1); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.ACCOUNT_BOX;
    }
}

class OverviewOnlineToggleBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr
            ?.children.item(2); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.ONLINE_TOGGLE_BOX;
    }
}

class OverviewManagementToggleBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0) // tr
            ?.children.item(3); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_TOGGLE_BOX;
    }
}

class OverviewSectorsBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableCellElement}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(1) // tr
            ?.children.item(0); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.SECTORS_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory management"> */

class ManagementBox extends TableSectionBasedBox {
    /**
     * @type {ManagementHeaderBox}
     * @public
     * @readonly
     */
    header;

    /**
     * @type {ManagementBodyBox}
     * @public
     * @readonly
     */
    body;

    constructor(anchor) {
        super(anchor);

        const box = this.box;

        this.header = new ManagementHeaderBox(box);
        this.body = new ManagementBodyBox(box);
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement}
     */
    _findBox(anchor) {
        return anchor
            .children.item(1) // table
            .children.item(0); // tbody
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BOX;
    }
}

class ManagementHeaderBox extends TableRowBasedBox {
    /**
     * @type {ManagementHeaderPutsBox}
     * @public
     * @readonly
     */
    puts;

    /**
     * @type {ManagementHeaderBalanceBox}
     * @public
     * @readonly
     */
    balance;

    /**
     * @type {ManagementHeaderBattlesBox}
     * @public
     * @readonly
     */
    battles;

    /**
     * @type {ManagementHeaderSmithsBox}
     * @public
     * @readonly
     */
    smiths;

    /**
     * @type {ManagementHeaderCapacityBox}
     * @public
     * @readonly
     */
    capacity;

    constructor(anchor) {
        super(anchor);

        this.puts = new ManagementHeaderPutsBox(this.box);
        this.balance = new ManagementHeaderBalanceBox(this.box);
        this.battles = new ManagementHeaderBattlesBox(this.box);
        this.smiths = new ManagementHeaderSmithsBox(this.box);
        this.capacity = new ManagementHeaderCapacityBox(this.box)
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement}
     */
    _findBox(anchor) {
        return anchor
            ?.children.item(0); // tr
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_BOX;
    }
}

class ManagementHeaderPutsBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(0); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_PUTS_BOX;
    }
}

class ManagementHeaderBalanceBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(1); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_BALANCE_BOX;
    }
}

class ManagementHeaderBattlesBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(2); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_BATTLES_BOX;
    }
}

class ManagementHeaderSmithsBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(3); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_SMITHS_BOX;
    }
}

class ManagementHeaderCapacityBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(4); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_HEADER_CAPACITY_BOX;
    }
}

class ManagementBodyBox extends TableRowBasedBox {
    /**
     * @type {ManagementBodyPutsBox}
     * @public
     * @readonly
     */
    puts;

    /**
     * @type {ManagementBodyBalanceBox}
     * @public
     * @readonly
     */
    balance;

    /**
     * @type {ManagementBodyBattlesBox}
     * @public
     * @readonly
     */
    battles;

    /**
     * @type {ManagementBodySmithsBox}
     * @public
     * @readonly
     */
    smiths;

    /**
     * @type {ManagementBodyCapacityBox}
     * @public
     * @readonly
     */
    capacity;

    constructor(anchor) {
        super(anchor);

        this.puts = new ManagementBodyPutsBox(this.box);
        this.balance = new ManagementBodyBalanceBox(this.box);
        this.battles = new ManagementBodyBattlesBox(this.box);
        this.smiths = new ManagementBodySmithsBox(this.box);
        this.capacity = new ManagementBodyCapacityBox(this.box);
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement}
     */
    _findBox(anchor) {
        return anchor
            .children.item(1); // tr
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_BOX;
    }
}

class ManagementBodyPutsBox extends FormBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(0) // td
            .children.item(0); // form
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_PUTS_BOX;
    }

    isDisabled() {
        return this.box.innerHTML.search('нет доступа') > -1;
    }

    hideForm() {
        this.box.style.display = 'none';
    }

    /**
     * @return {(number|string)[][]}
     */
    getArtsList() {
        const artsPutOptions= this.box.elements[2].options;
        const arts = Array.from(artsPutOptions).map((option) => [+option.value, option.innerHTML]);
        arts.shift(); // remove first "0" element
        return arts;
    }

    /**
     * @return {number}
     */
    getArmoryId() {
        const id = this.box.children.item(0)?.value;

        if (id === undefined) {
            throw new FrameworkError('Armory id not found', this);
        }

        return +id;
    }

    /**
     * @returns {string}
     */
    getArtsPutSign() {
        const sign = this.box.children.item(1)?.value;

        if (sign === undefined) {
            throw new FrameworkError('Armory puts sign not found', this);
        }

        return sign + '';
    }
}

class ManagementBodyBalanceBox extends FormBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(1) // td
            .children.item(0); // form
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_BALANCE_BOX;
    }
}

class ManagementBodyBattlesBox extends FormBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(2) // td
            .children.item(0); // form
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_BATTLES_BOX;
    }
}

class ManagementBodySmithsBox extends FormBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(3) // td
            .children.item(0); // form
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_SMITHS_BOX;
    }
}

class ManagementBodyCapacityBox extends FormBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableCellElement}
     * @private
     */
    _findBox(anchor) {
        return anchor
            .children.item(4) // td
            .children.item(0); // form
    }

    _getBoxClassName() {
        return FrameworkClassNames.MANAGEMENT_BODY_CAPACITY_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory takes"> */

/**
 * @todo group repairs and leases
 */
class TakesBox extends TableSectionBasedBox {
    /**
     * @type {TakesRepairsContainer|null}
     * @public
     * @readonly
     */
    repairs;

    /**
     * @type {TakesLeasesContainer|null}
     * @public
     * @readonly
     */
    leases;

    /**
     * @param {HTMLElement} anchor
     * @throws {Error} on init failure
     * @throws {BoxMissedException} on empty box
     */
    constructor(anchor) {
        // BoxMissedException
        super(anchor);

        const box = this.box;
        if (box.children.length === 4) {
            // box has both repairs and leases row pairs
            this.repairs = new TakesRepairsContainer(box);
            this.leases = new TakesLeasesContainer(box, false);
        } else if (box.innerHTML.search('action=repair') > -1) {
            // "Repair" button exists, so box has only repairs row pair
            this.repairs = new TakesRepairsContainer(box);
            this.leases = null;
        } else {
            // box has only leases row pair
            this.repairs = null;
            this.leases = new TakesLeasesContainer(box, true);
        }
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement}
     * @throws {BoxMissedException}
     */
    _findBox(anchor) {
        const box = anchor
            .children.item(2); // table

        if (box.children.length > 0) {
            return box.children.item(0); // tbody
        }

        // no arts in lease or smith
        throw new BoxMissedException;
    }

    _getBoxClassName() {
        return FrameworkClassNames.TAKES_BOX;
    }
}

class TakesRepairsContainer {
    /**
     * @type {TakesRepairsHeaderBox}
     * @public
     * @readonly
     */
    header;

    /**
     * @type {TakesRepairsBodyBox}
     * @public
     * @readonly
     */
    body;

    /**
     * @param {HTMLElement} anchor
     * @throws {Error} on init failure
     */
    constructor(anchor) {
        this.header = new TakesRepairsHeaderBox(anchor, 0);
        this.body = new TakesRepairsBodyBox(anchor, 1);
    }
}

class TakesLeasesContainer {
    /**
     * @type {TakesLeasesHeaderBox}
     * @public
     * @readonly
     */
    header;

    /**
     * @type {TakesLeasesBodyBox}
     * @public
     * @readonly
     */
    body;

    /**
     * @param {HTMLElement} anchor
     * @param {boolean} only
     * @throws {Error} on init failure
     */
    constructor(anchor, only) {
        this.header = new TakesLeasesHeaderBox(anchor, only ? 0 : 2);
        this.body = new TakesLeasesBodyBox(anchor, only ? 1 : 3);
    }
}

/**
 * @abstract
 */
class TakesRowBox extends TableCellBasedBox {
    /**
     * BEWARE OF MAGIC!
     * For variadic TR id usage
     * @todo refactor this
     * @type {number}
     * @private
     */
    static _currentRowId;

    /**
     * @param {HTMLElement} anchor
     * @param {number} trId
     */
    constructor(anchor, trId) {
        TakesRowBox._currentRowId = trId;
        super(anchor);
    }

    /**
     * @param {HTMLTableSectionElement} anchor
     * @return {HTMLTableRowElement}
     */
    _findBox(anchor) {
        return anchor
            .children.item(TakesRowBox._currentRowId) // tr
            .children.item(0); // td
    }
}

class TakesRepairsHeaderBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.TAKES_REPAIRS_HEADER_BOX;
    }
}

class TakesRepairsBodyBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.TAKES_REPAIRS_BODY_BOX;
    }
}

class TakesLeasesHeaderBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.TAKES_LEASES_HEADER_BOX;
    }
}

class TakesLeasesBodyBox extends TakesRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.TAKES_LEASES_BODY_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory tabs"> */

class TabsBox extends TableRowBasedBox {
    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement}
     */
    _findBox(anchor) {
        return anchor
            .children.item(3) // table
            .children.item(0) // tbody
            .children.item(0); // tr
    }

    _getBoxClassName() {
        return FrameworkClassNames.TABS_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory description"> */

class DescriptionContainer {
    /**
     * @type {DescriptionBox}
     * @public
     * @readonly
     */
    text;

    /**
     * @type {DescriptionFormBox}
     * @public
     * @readonly
     */
    form;

    /**
     * @param {HTMLElement} anchor
     * @throws {Error} on init failure
     */
    constructor(anchor) {
        this.text = new DescriptionBox(anchor);
        this.form = new DescriptionFormBox(anchor);
    }
}

class DescriptionBox extends TableCellBasedBox {
    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement}
     */
    _findBox(anchor) {
        return anchor
            .children.item(4) // table
            .children.item(0) // tbody
            .children.item(0) // tr
            .children.item(0); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.DESCRIPTION_BOX;
    }
}

class DescriptionFormBox extends FormBasedBox {
    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLFormElement}
     */
    _findBox(anchor) {
        return anchor
            .children.item(5); // form
    }

    _getBoxClassName() {
        return FrameworkClassNames.DESCRIPTION_FORM_BOX;
    }
}

/* </editor-fold> */

/* <editor-fold desc="armory arts"> */

class ArtsBox extends TableCellBasedBox {
    /**
     * @type {ArtsListBox|null}
     * @public
     * @readonly
     */
    list;

    /**
     * @param {HTMLTableCellElement} anchor
     * @param {ArmoryTab} activeTab
     */
    constructor(anchor, activeTab) {
        super(anchor);

        try {
            this.list = new ArtsListBox(this.box, activeTab);
        } catch (e) {
            if (!(e instanceof BoxMissedException)) {
                throw e;
            }
            this.list = null;
        }
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement}
     */
    _findBox(anchor) {
        return anchor
            .children.item(4) // table
            .children.item(0) // tbody
            .children.item(0) // tr
            .children.item(0); // td
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARTS_BOX;
    }
}

class ArtsListBox extends TableSectionBasedBox {
    /**
     * @type {ArtsHeaderBox}
     * @public
     * @readonly
     */
    header;

    /**
     * @type {ArtsFooterBox|null}
     * @public
     * @readonly
     */
    footer;

    /**
     * @type {ArtsRowBox[]}
     * @public
     * @readonly
     */
    rows;

    /**
     * @param {HTMLTableCellElement} anchor
     * @param {ArmoryTab} activeTab
     * @throws {BoxMissedException}
     */
    constructor(anchor, activeTab) {
        // BoxMissedException
        super(anchor);

        const rows = Array.from(this.box.children)
            .filter(ArtsListBox._filterTagsCallback.bind({tag: 'TR'}));

        this.header = new ArtsHeaderBox(rows.shift());
        this.footer = activeTab === ArmoryTab.TAB_UNAVAILABLE ? new ArtsFooterBox(rows.pop()) : null;
        this.rows = rows.map((row) => new ArtsRowBox(row));
    }

    /**
     * @param {HTMLTableCellElement} anchor
     * @return {HTMLTableElement}
     * @throws {BoxMissedException}
     */
    _findBox(anchor) {
        const listContents = Array.from(anchor.children)
            .filter(ArtsListBox._filterTagsCallback.bind({tag: 'TABLE'}))
        if (listContents.length > 0) {
            return listContents
                .shift() // table
                .children.item(0); // tbody
        }

        // no arts in list
        throw new BoxMissedException;
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARTS_LIST_BOX;
    }

    static _filterTagsCallback(row) {
        return row.tagName === this.tag; // there is a <script> here besides correct tags
    }
}

class ArtsRowBox extends TableRowBasedBox {
    /**
     * @param {HTMLTableRowElement} anchor
     * @return {HTMLTableRowElement}
     */
    _findBox(anchor) {
        return anchor;
    }

    _getBoxClassName() {
        return FrameworkClassNames.ARTS_ROW_BOX;
    }
}

class ArtsHeaderBox extends ArtsRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.ARTS_HEADER_BOX;
    }
}

class ArtsFooterBox extends ArtsRowBox {
    _getBoxClassName() {
        return FrameworkClassNames.ARTS_FOOTER_BOX;
    }
}

/* </editor-fold> */

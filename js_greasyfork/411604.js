// ==UserScript==
// @name         More emojis to FxP
// @namespace    https://www.fxp.co.il/
// @version      0.3
// @description  מרחיב את מאגר האימוג'ים של FxP
// @author       Muffin24
// @match        https://www.fxp.co.il/misc.php?do=getsmilies&editorid=*
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/411604/More%20emojis%20to%20FxP.user.js
// @updateURL https://update.greasyfork.org/scripts/411604/More%20emojis%20to%20FxP.meta.js
// ==/UserScript==
// The complete list of emojis in my GitHub account under the repository fxp-tools.
// Chrome extension: https://chromewebstore.google.com/detail/exp%2B-for-fxp/mkhjbdoklblccmleiljlabdbdbbdlifb

const editorId = new URLSearchParams(location.search).get('editorid');
const target = document.querySelector('#smilies .blockrow');
const tabs = document.querySelector('.blocksubhead');
tabs.innerHTML += '<br/>';

const createCategoryBuilder = (categoryName, baseUrl) => {

    const header = GM_addElement(tabs, 'a', { href: 'javascript:void(0)' });
    header.innerText = categoryName + ' ';

    const ul = GM_addElement(target, 'ul', { class: 'smilielist', id: categoryName, hidden: true });
    header.addEventListener('click', () => {
        document.querySelectorAll('.smilielist').forEach(tab => (tab.hidden = tab.id !== categoryName));
    });

    return (name, file) => {
        const src = baseUrl + file;
        const li = GM_addElement(ul, 'li', { title: name });
        const smilieDiv = GM_addElement(li, 'div', { class: 'smilie' });
        const label = GM_addElement(li, 'div', { class: 'label' });
        const tableDiv = GM_addElement(smilieDiv, 'div', { class: 'table' });
        const tableCell = GM_addElement(tableDiv, 'div', { class: 'tablecell' });
        GM_addElement(tableCell, 'img', {
            alt: `[img]${src}[/img]`,
            src,
            id: name,
            title: name,
            loading: 'lazy'
        });
        label.innerText = name;
        opener.vB_Editor[editorId].init_smilies(li) // the ugly way
    }
};
createCategoryBuilder('fxp');
document.querySelector('.smilielist').id = 'fxp';

const love = createCategoryBuilder('אהבה', 'https://yoursmiles.org/ssmile/love/');
love('לב ורוד', 's0305.gif');
love('לבבות', 's0309.gif');
love('עלי כותרת', 's0310.gif');
love('מאוהב', 's0336.gif');
love('חיבוק', 's0308.gif');

const aggressive = createCategoryBuilder('אגרסיבי','https://yoursmiles.org/tsmile/agressive/');
aggressive('פטיש בראש', 't0127.gif');
aggressive('מקלל', 't0105.gif');
aggressive('נבוט בראש', 't0135.gif');
aggressive('מקטר', 't0110.gif');
aggressive('תיזהר ממני!', 't0106.gif');
aggressive('קללות', 't0165.gif');
aggressive('מכה בראש', 't0145.gif');

const aliens = createCategoryBuilder('חייזרים', 'https://yoursmiles.org/hsmile/alien/');
aliens('ביישן', 'h0101.gif');
aliens('קורץ', 'h0102.gif');
aliens('מבולבל', 'h0103.gif');
aliens('מוציא לשון', 'h0105.gif');
aliens('מנופף בלשון', 'h0106.gif');
aliens('מחייך', 'h0107.gif');
aliens('מסופק', 'h0108.gif');
aliens('עצוב', 'h0109.gif');
aliens('מוחמא', 'h0110.gif');
aliens('מתחזה', 'h01116.gif');
aliens('מופתע', 'h0112.gif');

const angry = createCategoryBuilder('עצבני', 'https://yoursmiles.org/tsmile/rtfm/');
angry('אגרוף', 't1928.gif');
angry('עיניים אדומות', 't1934.gif');
angry('מאוכזב', 't1938.gif');
angry('ובכן...', 't1940.gif');
angry('זועף', 't1944.gif');
angry('זועם', 't2413.gif');
angry('ראש בקיר', 't2412.gif');

const fear = createCategoryBuilder('פחד', 'https://yoursmiles.org/tsmile/fear/');
fear('עיניים גדולות', 't3601.gif');
fear('הלם', 't3602.gif');
fear('מודאג', 't3603.gif');
fear('פה פעור', 't3604.gif');
fear('מתחנן לעזרה', 't3611.gif');
fear('מודאג', 't3622.gif');

const general = createCategoryBuilder('כללי', 'https://yoursmiles.org/ssmile/fun/');
general('עשינו עסק', 's0201.gif');
general('ננה בננה', 's0202.gif');
general('צוחק עליך', 's0205.gif');
general('חיוך מסתובב', 's0213.gif');
general('בוכה מצחוק', 's0225.gif');
general('צוחק', 's0228.gif');
general('מתפקע מצחוק', 's0238.gif');

const food = createCategoryBuilder('אוכל', 'https://yoursmiles.org/tsmile/eat/');
food('ילדה שותה תה', 't1901.gif');
food('קפה של בוקר', 't1902.gif');
food('מבשלת', 't1903.gif');
food('פופקורן ושתייה', 't1904.gif');
food('קולה', 't1905.gif');
food('משקה', 't1927.gif');
food('פופקורן', 't1931.gif');
food('ממתין לאוכל', 't1932.gif');
food('אוכל אוכל אוכל', 't1933.gif');
food('פנקייק', 't1933.gif');
food('לועס', 't1925.gif');
food('חגיגה', 't1929.gif');
food('מלקק גלידה', 't1942.gif');
food('אבטיח', 't1946.gif');
food('גלידה 2', 't1950.gif');
food('דובדבן', 't1975.gif');
food('קפה', 't1980.gif');
food('אבטיח 2', 't1981.gif');
food('דובדבן שבקצפת', 't1989.gif');
food('דובדבנים', 't1997.gif');
food('ממתין לאוכל', 't19119.gif');
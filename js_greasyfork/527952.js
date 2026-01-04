// ==UserScript==
// @name         Old Roblox UWP UI (for website)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Mimics the old Windows 10 Roblox (Microsoft Store) UI, back when Roblox was better.
// @author       NotRoblox
// @match        https://*.roblox.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/527952/Old%20Roblox%20UWP%20UI%20%28for%20website%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527952/Old%20Roblox%20UWP%20UI%20%28for%20website%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

const originalOpen = window.open;
window.open = function(url, target, features) {
    if (target === '_blank') {
        window.location.href = url;
    } else {
        return originalOpen.apply(this, arguments);
    }
};

let activeUserId = GM_getValue('cachedUserId', null);
let isFetchingUserId = false;

async function getCurrentUserId() {
    isFetchingUserId = true;
    try {
        const response = await fetch('https://users.roblox.com/v1/users/authenticated', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data && data.id) {
                if (data.id !== activeUserId) {
                    activeUserId = data.id;
                    GM_setValue('cachedUserId', activeUserId);
                }
            }
        } else {
            console.error('Unauthorized or error fetching user ID');
        }
    } catch (error) {
        console.error('Error fetching user ID:', error);
    } finally {
        isFetchingUserId = false;
    }
    return activeUserId;
}
    const colors = {
        green: {
            topbar: 'rgba(3, 182, 87, 1)',
            searchBarBg: 'rgb(103, 213, 152)',
            searchBarBorder: 'rgb(59, 150, 95)',
            sidebarHighlight: 'rgba(128, 128, 128, 1)'
        },
        blue: {
            topbar: 'rgb(0, 102, 199)',
            searchBarBg: 'rgb(86, 163, 216)',
            searchBarBorder: 'rgb(22, 130, 208)',
            sidebarHighlight: 'rgba(0, 102, 199, 1)'
        }
    };

    let useBlueTheme = GM_getValue('useBlueTheme', false);
    let iconsOnRight = GM_getValue('iconsOnRight', false);
    let studioButtonEnabled = GM_getValue('studioButtonEnabled', false);

GM_registerMenuCommand('Toggle Blue Theme', () => {
    useBlueTheme = !useBlueTheme;
    GM_setValue('useBlueTheme', useBlueTheme);
    location.reload();
});

GM_registerMenuCommand('Toggle Icons Position', () => {
    iconsOnRight = !iconsOnRight;
    GM_setValue('iconsOnRight', iconsOnRight);
    location.reload();
});

GM_registerMenuCommand('Toggle Studio Button', () => {
    studioButtonEnabled = !studioButtonEnabled;
    GM_setValue('studioButtonEnabled', studioButtonEnabled);
    location.reload();
});


    function tryInit() {
        if (document.body) {
            init();
        } else {
            setTimeout(tryInit, 10);
        }
    }

    tryInit();

    document.addEventListener('DOMContentLoaded', function() {
        if (!document.body.querySelector('.sidebar-custom')) {
            init();
        }
    });

    function init() {
        if (document.querySelector('.sidebar-custom')) return;
        if (window.top !== window.self) return;

getCurrentUserId().then(userId => {
    if (userId) {
        activeUserId = userId;
        buttonLinks['Inventory'] = `https://www.roblox.com/users/${activeUserId}/inventory`;
        buttonLinks['Profile'] = `https://www.roblox.com/users/${activeUserId}/profile`;

        const currentUrl = window.location.href;
        const inventoryButton = document.querySelector('.sidebar-custom .inventory-button');
        if (inventoryButton && currentUrl.includes(`/users/${activeUserId}/inventory`)) {
            inventoryButton.classList.add('active');
        }

        const profileButton = document.querySelector('.sidebar-custom .profile-button');
        if (profileButton && currentUrl.includes(`/users/${activeUserId}/profile`)) {
            profileButton.classList.add('active');
        }
    } else {
        console.error('Failed to retrieve user ID');
    }
});
function hideElements() {
    const header = document.getElementById('header');
    const leftNav = document.getElementById('left-navigation-container');
    if (header) header.style.display = 'none';
    if (leftNav) leftNav.style.display = 'none';

    if (!window.location.pathname.includes('/inventory') && !window.location.pathname.includes('/transactions') && !window.location.pathname.includes('/catalog') && !window.location.pathname.includes('/games')) {
    const style = document.createElement('style');
    style.textContent = `
        @media (min-width: 1688px) {
            .no-gutter-ads.logged-in .content {
                margin-left: 0px !important; /* Ensure margin-left is 0px */
                display: flex; /* Center the content */
                justify-content: center; /* Center horizontally */
                align-items: center; /* Center vertically */
            }
            .no-gutter-ads.logged-in .content.six-column {
                width: 1104px; /* Maintain the specified width */
                display: flex; /* Center the content */
                justify-content: center; /* Center horizontally */
                align-items: center; /* Center vertically */
            }
            /* Only apply these styles if not on the /users/friends page */
            ${window.location.pathname !== '/users/friends' ? `
                .container-main.in-app .page-content,
                .container-main.content-no-ads .page-content {
                    margin: 0;
                    width: 100%; /* Maintain full width */
                    display: flex; /* Center the content */
                    justify-content: center; /* Center horizontally */
                }
            ` : ''}
            .content {
                max-width: 1338px; /* Maintain the specified max-width */
                background-color: #e6e7ea; /* Maintain background color */
                padding-top: 24px; /* Maintain padding */
                margin: 0 auto; /* Center the content */
                display: flex; /* Center the content */
                justify-content: center; /* Center horizontally */
                align-items: center; /* Center vertically */
            }
        }
    `;
    document.head.appendChild(style);
        }
}

const universalStyle = document.createElement('style');
if (!window.location.pathname.includes('/games')) {
universalStyle.textContent = `
        @media (min-width: 1688px) {
            .no-gutter-ads.logged-in .content {
                margin-left: 0px !important; /* Ensure margin-left is 0px */
            }
                .container-main.in-app .page-content,
                .container-main.content-no-ads .page-content {
                    margin: 0;
                }
            .content {
                padding-top: 24px; /* Maintain padding */
            }
        }
`;
}
document.head.appendChild(universalStyle);
        hideElements();

        const observer = new MutationObserver(() => {
            hideElements();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const buttonImages = {
            'Home': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCAyoy5b8CIQAAAUhJREFUaN7tmOERgjAMhVvOAXATRuoKbsAmjOQosMHzT88TtdJCU9L63h3/NOaL6WuIMRRFUVQFAuAAzP5xrcGN+NTYCtyEsKaW4eqFBNADuCNedwB97XAzgME/c5WQPvkg3NvnQpCDZrjopGOLUQNcv7edNV3gu41jw5CcVrhpR6xJFWRgOjl0r/2AHEvDiSUiUTh1rZSz9XNNJ06beWWdTrRdPyLTiZYBQk/ws4usbSjOekyKHvDSRvcDDhp2KYfzC7Tlsx0UACbl1yXG1/BCmpTDN8CbMWapcAW0+NxXshEtgdUXrLUnt2hSPp1pXJ1gpd2GIbzeY2LuLNai3tFiDWGx1l4lWlQSEEmV3hn378/gpdQPvVc69R9WZzLNuygBCUhAAhKQgC1OMlITiFRctmim9cVSMG4y4NEdzdddiWBciqIoKpsef8vxkPccAQIAAAAASUVORK5CYII=',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWhJREFUeNrs2YFtgzAQBdCz1QEyQkboCK2yQEaAESp5gAwQqd0g2aBdwGKEMkJHYISa+KpKaWkxxvY5+l8CKUgEXjDmixAhCIIgy6OyHcnYrVs3/OmFjrvhdoDG3rt155YNbxlxjw7Z1w/8iaOcSJ0Yt5/AEW/r+AeoEGjseL+9TuCukU1dQ9Sf8Clwr9YN17N84DJcMqReGXeKwNFlX2MPMq+gx611L53dlWzlANfFrYpUkbAND8l9oknwje/LIT/Q48ZnXNLnmEvPhWDIB8yHi0bqCnDEx+q4sCe8gr5Wje1kS2US3F9VIK77p3qJQ6rKcMFIPQP3IAz3VdLf55R0PaNXSsNdV7tm2RCNK825M1nS1Q3g/qx2+hfcoUIcXbqwsc9hs+j3BCM3x50q88pCSAAEEMCyuSs6y2WYpTFEAQQQQAABBBBAAAEEsBCwF37+QxzQ/13VzvmiAvlwyxMhCIIgCfMpwABCWXB7Lq3BSQAAAABJRU5ErkJggg=='
            },
            'Games': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCAyogFgZzaQAAAYdJREFUaN7tmN1xwjAQhC1X4FQQSnAJLkWlqBNPKiEdUAIliA42L3oImgj93ckms9+TxwNGq71bH5omQgghhBBC3gwAG4ArxuABuFHCLgB2HMMNwKolbAHgwm4ejZMWZwHccS763SzoszsAq9wSaxAj52ZBn/lQrsvAUHMiboZyfNVnO4DLQcmdc9OWPCQl7gpgO8krKuWmL/ny8D6TdDP+nPlLYHTrwxjzOPHA8bReY8yTpjn3gJy4Xz3re5yOet+rVU3O8kzP+sbf3BI9tfWudxbYkyVxXcNWeb+YeTo3n8MFxu/JFyVT00ffiftfw3uwctj22iFTmxmHCWwVriHQForsjvqSdBUX2F0iMiOZG/maOHW6Sgh8JK4lkE/XhhIVGdW0QiY7bMfD678btt+dWWlXl1Bat4oDJDvkCKQn9sOf0L3jaNGH769q620ImVq3IOmqmkABt0Rc7RaotTCtjRohsCkwpEq959hQNByUXC06NrQVD1aN90pX9Q6qCCGEEEIIaeAHXGN7y63YSJUAAAAASUVORK5CYII=',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfhJREFUeNrsmM1twzAMha0gA2QEZwN3g/jYU91Tj60naDJBmgnaThBfe0p76jHdIB7BI3iCthTAAIZ/ZZG2ZYAfQCgIZEUvlJ4oe54gCIIgCIIgTIOiPLz4fthC8wgRDDjHFOL99/YjGU0gCNtAc4TwR0zGD0QMQrPBBIKwFTR7iO1EKy6HOIDIN3aBE2WNnE1lmDUtLHLMP4yyqTrERShu5bBRtmZTzSxrvbOpasTpPXZxPGtN7MoiFzWdjjMVp3muJKym02bGhYtvItCm0rjHSIn7KIYIsc05FC8ZxtCb+xP3r25OluOEME5a8IIUvYAEOYNXcQXLtrL6ojgcNyWMx7pEi5PKCctzEGwFHiDWIEjViFT4/Rr7mRDBkgxKx1XAYXh15+Bfl6mAgJseNezF8Dqls7hDo9L9X22Oq/KfvvTc4Vo9NQnP8BjoJdxGYABZeYE2aavmcYlFDJdhkrvaLNHWJdH3eQN3DWvmeG7an5X5zKCInvaYwCtV5TMTZHflMJk9VjAevs7g5gzjl9111FItIJRnFHcdv5JxEREoAkXgtAxVi+p73Bdae9ZR0vlYY2o3vuN+ZUIu1UokeMPPCIWDj+fpk+WdVA0hkCyMS6hJLWr6widDYfriG3OKw4nqpR3jxTnB3zPZGoIgCIIgCILgBP8CDADdNbvaftlz6gAAAABJRU5ErkJggg=='
            },
            'Friends': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCAyoNU9kvHAAAAuZJREFUaN7tWu15mzAQvvMEbFA2KBuETtCOQCcImaBs4G7gbuBkAuwJ7EyAOwHe4O0f8VRRJCQhyRg/vH8cHHPi7r1vm2jFihWLB4AcQAOgBdDjP3rxXgMgX6piLdzRLkZRABWmo9LIK4QB5mccwA7h2Ckyu7tgfIS5DkANoFBYqQ0P/4FJX8ZTKVcYHqB2uLc23JuL/299GE+lYBtiXQP77RTGU2VMb+Ycmcx9GU+hYKPGXIAslaFmCuOp3bMOkFW7PrQr4zEU7JVDiojJqo/BeKiCH3BLeT6Mq9gspCs8KNfFQ7loiAf5MHhWrssAe5UW2dHgo+BRuX4OOPfZIvsT48pb18UX+lhJ5q5atVnLxAiLUZrt2Qt96nFp9lYt9cA7e7OdemWhsN7NOvimXDppGooB+4dYG1oM1NDS4bC6OIW0ife0b61GYrEH8MNFFk9plEU3nxPRF/E6dPiZ4bar1G9eiOiveD0z89mWTYnol0H2T2b+E8uiu5EEEIJeyM4nJrNiznIQrXyMxGcbolyB26OY0AAUk2JQWKc0TNhHEUeXIbaY+WJyMSlWh7+fTLKZ+Zut+ZbkERH9ZuaXGOw1ALKI2TLTrCNdWKyCV5gaf+8SlgW1HGwdDBOWbDSHVgkV9GYEwH5yl2NwzyyhglkENz357GTULuGVma+pFBSyXy3PYF0l6kgwKfhduX67QYf2ZnkG1ShyBjdu+jY6d9EsVg9zLHcdwsK6EN447CyN9S2ymzoxYlk3PrkoOAd7zowoyLxdVGOF4w0VtDIihVJDRFvvhbCh20/6sw5pI9DbvoOwzImVy2FjI9FeHJBHUqrSFGztlzLis73vJMI6CwnqbRnsIobYdyl2zmq9VLJySURfpYF5DFciehkGWqFsZvuc74A7Fz4NwAb2wn4oJMVGdwOlurFYl1x02ACUsRNBISaMU0SlTkJmsi0ZT1R2iKtSWjxlI3XrLGJlWDgddPG6YsWKx8M/G4eFDsaSkmgAAAAASUVORK5CYII=',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAy1JREFUeNrsmo2RojAUgIW5AuzguApWK5CrQLYBhQoWK3C3Ar0K4Ghg3Q6wAztYroKlg1yyiSOGhATMgzDDm4kOCk8+3n/G2WySSSYZUhwjWjIU4Nc1Xj5eHvdtgVeO18ds45zGBZghApQIoGRCYCMMmtsPmKEDfo07Xn3EkDtO3wK/HtjRGa8Un1MMA5ghYrXwwd8mAFFF56fAE3Jm8c6gbkfLhQa8J2S6riJycxICn/i8sB9AGnOxwRCJmU7qtnJJmNeAWzAByANUJ43JJV47loxEFg/hYpCWgnegZPdcKyEZiitJpyq/2sRkGwuuAbN5XffGOX4nmAe9qA2gDwgo1r1xUuay9+dmyIMA9AAB5bqpJYtaPIKVCShptsof7ng1PsDmxMG3dovxATbDX7hP5hCABSACmO42gJATQK6IT94lSwjAD0BAlW6+jFzMA9JOowBxT/Ug/MIdn6GSTAQAGCncMxbUyRQGkE7iR4Nwx8bpnjbXh1q8AvWis0rXnxqAS2tTfd1yyaNeZM+WxX3GfJe0bxHrT3sAvA3AZjedMvQlKeQnfN1zP3sy4lnRzLZhhlDDt29Yx2v/gGabbpXrX5gXXMYJeJssiDfsJe5fMsjTOAHr2XQviUtl0nEBb2xuRA8deJeSfjUR9KkdLUgV+exJriqTeNtJv6i0fGfmbrlWTInjk1z7uztghl5ZLzgHdsaSTe6kRpYKl+W7m6XsAbkaT2zfA9x1iN2zpXJZvlXbto9BmsniAdJKrLFr9sYdB12STDBg7lT9Nl8ePFmyaQLcDgi4VbhpKYAM9AFpil8MCLjQKDP8LsC6jQWHdE/de8h1HooMcGUB4ErhpoUgm/q6gL4FgDr3ULeiEpCa2bMA0NOIw7PK6q4wwO0R1b3Mu7iobxGgr2ghD4J2705+CC59sgjwSQAWNsyJOx1AO130toUoi0vhbOhKxhlbpHovMriyafB1JWYuLIHbaZSJZdNU7ygG3C3rKLweoUiP+bc2393vcl/Pyc3syVDYgNUZ01k2Z/XspLtT1ka6/lfNZwngJ3vX2bq4tlYE4t/3e4//OpxkkkmGkf8CDAA69v/kiPJREwAAAABJRU5ErkJggg=='
            },
            'Catalog': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCAyg1Se31AAAAAhNJREFUaN7tWt1twyAY5MsE7gT1Bs0I2aAZwSOkG3SDjJAR0k7gbuB2grgTOBtcX1wpohiDOcBROSkPVuKDM8f3g6NUQUFBQQERABoAA+YxAGjWrkcMAgelVOV4/1VEHtYscBN4fwWgXonj3BzlYdFf7DILvJ3rwCA8aQJfM4qr9afNsOi3dv2YcQG32vUHQ6BOUq9I4CdDYK9d59yDTzPuWux9HXVAkHLFnygJ4BIl4AFop4gjiTNGybkAE5IHs9vUsFo9U6Atkr4opa4RNF1HbucAE/T0NHe0GVbw6JKP79aiUVdwLpImWkGn8UOK7WwJ3yRGRHq2QKtNifnQ1CXMlmgMgXM16dGjr7S2ZCPXov13lxb1KdGiWZSYD/X8Fz+C5o6kLiUa68giuU1dSzSWwBwJ38ueoQJzdPf6GF9R7YL82Ke0aA5YLSqEVfQ5KKa3UHMHzxvCILH6vyX58f9BIgSe+iYf9lNVfi6+kIk0ADpDlOuWvIVi84WKOzmE81MuvhTinCfF5ouV6LsJe1kPZ9l8DIFnQ/e90yY8uD51Nh9DoD5YMxEs4PIOj80XnCb0XkxEZE2/Y1Uy1tOukCaYzbdkAvrGPzvsqy4VH0PgwRDVWgD78dMavj+k4mMIrDzPPgcAVSo+lsitxx+Htqn5mCIvlslcfCbD5BOy0L1S6vm2+ldKvYvI2xr4CgoKCgp88QOfqCfInXS+hwAAAABJRU5ErkJggg==',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAe1JREFUeNrsWs1tgzAUhioDpBu0GzAC19566zWdoMoEhAmaTpBzT+mtR+gEhQ1ggjJB1WfpHVAKtoOfzQO9T0KOsPniz35/WESRQCAQCASjiC9v3Hw+HaDJLJ/Pfx/eD4sRCOK20PxcyXELIrs5RcC8U9XCPMp/fQT8ycziTtAU6oLfhVYg7kS+FIFocbverdTogxakxRARF8Amxa4mWjGOKQ2FD7aMBVYUAjnvYL12ge47iJG2W4oPbhxWKtX0qVRTUhYAEL0fscJKNItP4oMmM1Xl2wd1daM4DTm6HFyYif/XLsE8XU10DBmYU0RpolixpIaXgDqUQOUjZ5zYrBF0sokyjaQVpQ9yy4fNmDusRuBYx8aBtLVYAOd8aJP/AF8+BJp2MMfc5Zz/MFidp8xl9SYau7DCyqrzm60vE73If4ntSy6ViZpq0lD5sNQuko/cw8U8KQRyqEnrte9gJQIdctSUc1RKPM99qi4QOCL2QQqJPelVON3QYVAonphY2B00p4HqRlUbe9sJUvGQCsRJfWtqUxXt7k1Rj4qHKg/2kWkmFWHfa0AecoE7ZmPIBV7zChSMJ7hAqspjDh9smI0hF7hnNoZWIB4wHTVDjjaHUFQ83ioZ/GblpV+BwPU29A1LCB6BQCAQCDT4E2AAi9bR2MFhXzgAAAAASUVORK5CYII='
            },
            'Messages': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCAysSx8oTqAAAAOtJREFUaN7t10ESgjAMheHE8QB6w17Bk5cbxA0bBWlpa4Z0/rd2Bj4byEOEEELIwJhZMrNs8ZLNLH17dAeYReQR9HwWVX2WgBZ5AlX1w3Sb/ZG7n/1HLvjOOJy46U8QIECAAAEC/AfQsZTvlujq6lZqBr+ajHMp35To2vtlRA/yEpHF4/TWa/mO6FXLNiMKkD3IHmQPsgfZg4woQIAAAToBvapVa/Vr2iuDkk7ihqTmYtkTORK39mP3r4Tkhev56ugdtdTz26t1w+KNh8XVAMLjGp+vWLiTyJi4SmRsXAE5B25nv+bpcIQQMm3egpJXWkx22REAAAAASUVORK5CYII=',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPxJREFUeNrs1+sNgjAUhuGWOICjOAIjOAHRSYBJMJ2AUdxEN6jl8scLQWlPk9b3S+gPEgIPbXLOUYoQQsj26Lc7xjZurRP1tKrSzTLQ2L1bb0lvWaWfTEXuR7R40d/zBma/gwABAgQIEOB/AXcez17n5rYX/UJjj3Pzf4i9g/K4qX3sx3dxRMMf0dodHyW6i9P4VvrMp58GXss8SJkASB2kDnJEqYPUQcoEQIAAAQIEmCCwTdjTrrdq/v1j59bTxqcvrtU6h/wcLfIftyGD4+SAvyNFcLLA75FiOHngOlIUFwe4jBTHxc2AHIbp6eryrLrGluNFCCEkkTwEGAB5P1CkAFtrLgAAAABJRU5ErkJggg=='
            },
            'Profile': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwpJREFUeNrsWouR2jAQtZkU4A7iDuJUgK8D0oFLIBXEqcDXAXMV4FQAVGBSAaQC0YEjzSw3HrMSsnb1yU12RsPBwcor7ee9lbLsg0vuU/k4jhv5spajglHAv64wTnL0eZ6f/6lVk4Y1clxGexlgMZI3rIKHdZW9HEWqxm3kECNd1M5XScWgfKBavhwMX1HxpuLsN7xfz2JyLjc5XpKITWlcadi5AxjvEqtDEu4KRmDSLNDRaXS0sY2rNQ9WO2ZeTMrUdm9L0LdH9HUxY+8hAxJ1Fkg8k3SuCL/F3PAnKaXnucqe/ezjklI2KAZisdEzOMcv5LMoBq7ntQ52gCpHy8X0biBWzOnIg2eRvBiYJIakGHjmihME9mHQLbiBfzT8jyqVxWIGo0YP2JNB7wM2jYlkLhwwbaJvi+jbxTQQeyDhwgI0HkFaMA4DC80uDktAMoB24cPlfTIK8Qx4wwK1ht+TmQQXo1e87YeBnffQQbtOMuUXOTaG+vlNFv0+S0VUMhj5pMlSFANptRURNaks4IkHB+N2ybYMDWm/e9IAHiDJeGtL5IGMLeYQTCaQY/ZfEt1BcLlyRqUqBEBPWcKZmwuSDQRDaqhpFRhFjae74Sf4++jDcJsEsh/DSbgMy1DrKDWy8uqiMMEQMWcoqPd1ict+WjhB92TyK8QO1h17TyJI2Zi+N508qfhWAL4NxeAFuGzhIxNrmIbwEo8aMN0EiPkw8yKEVATEtn6JMBxPRzv10YB3Kze1bRuukc/eAmZPbK4N5wpeOI+0HHs/DzcyfMZA8ENJ5HqK4HJRzBVOEYr8/FitsEE2K8f4i8HlsDlrH/EXDaq5xOFqIa+LtXu6uWuqi1ZZIgJ174bEYUlR2hruk7Uh7rBMmleC/exCc7iCdca2nBfo4Digs7y5WJH4IASyLWq4QZvhNKFP6nLC1cAv71TpM7wu2ZFXqfs714oexnRk5yU8wNBdxJZFF+TuGmDDJkDjScCCOgNrzguxdfb8oqtNz+Uew0eOC7G5x12uLYrxPSl5a+X/FWAACre63iwZC2MAAAAASUVORK5CYII=',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgRJREFUeNrsmstNw0AQQO2IExegApwK4g68VGB3ELsCyI0bHLlhKjB0kFRg0wEdZKmAnDgiZqVBigKRGHsmO7F2pNUekqz3ef6jRFGQIEF8Six5+OfDpIAth2VgJTsfW1gdrNXp7dfyqAABzAE1f0DtEwdbAWjHfZeJANwjbC0BLsLvtvhbvRqECzqtlQOPeQZNVuo0iG+/ZDiq5NRkzOhzLbN1XXH4JJcGG4FY1agwUUwFiQBggmd712AumEpzDYBGENBoAEwEARMNgKICfpiMGhBShR01oAYTtYL3sxoAO0FAFZXMShBw8NlctehaIF1YCDBTLWmiEtAey5ksgFj114xwNVd3HxpeoiargZqsOeHYNbjTAKsYOo1+bBgkSJBffnl+yOfFDBdOMYi4i2dbnTi1dLNb3cMrrI0LQhCA3rwAAtg9bNcIJikO9Alz5Ib645OecG7yfHMgK3Mv8A7WGayFuAZxRrL25MJT6gijT6lWRP6E/Ow+gHOPgHNRE8UQ/+E501xQgs3kiMyz1x2ogJkCwEwS0CgANCI+qMT/yH5I0WCqqKRNJUzUKAI0EoAzRYAzCcDRm6hVBGglABdKIC2lq+jTTaRYE0r9u2IflJu8vVAb4EEdPcIWWF1wR9kOO/vlkK6ee3RvMABc4v6f0cXPqMJBvLtdYgAcJEgQP/ItwAB8OJeBwHg2zAAAAABJRU5ErkJggg=='
            },
            'Character': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FJREFUeNrUWu1xnDAQPTL3P5RAB6EEdWBKoARcQXAFTCogHWBXcNcBTgXYFSgdEJiIjEbZXa3Q6u7QDGMDOsHTfr3dJTsJjnmelX2eZdn1dPSxgCqXo5/xMbjAjwSum/mjOxq4fg4f/VHANfP+0T46uHw5NPDi2gBX5miIecXRpDeuwJHNGA8lReSFC2J+AUhyfGSAwY4Dcki3et8vAmt8Cs15WIBf70gwJsRTr9fLvQu7i047fqMFPPnkCUfDXgm6/LKgvOLqddc5zuXXSAH2wJpyhBqjYnaoMLvcInNVxPO5JKOOAXkhFr747kfaHWRv0KbnKdiMb+xmMQRpKAHSP6T2Yhi4MuJ5ELlvECdWS9ljzswq+hiVWV8YU3Vx9SToWGOS280GB3OtENAUDWhDjkh2OB1pIHanrPs6iXresWLQWver5OqZEFzlCzGHVU8kxfovxLDV03gpPd9maJ+dIHZXeSSsUfW8ITgv2UboXceIi31IEnsXgEhMG5lCqR4FIKiiCP0DqR2knhi2M3QxW8YdfMvqAV0bel5e5QOY+xSUfkEE9sZes+XWehBJV6EAtzSkS91XQFKgEfOIAC/VnIdw7Kb37pRM6YHMOgzHDWsHBJbitRTfA172XwpEbMgcpJ5IRrA7jkmkQAG/0TGqU1NgE0lvs/1aTD2ZYDupukqAWUzGu+bR6rmjXNAKrVszyh6bg2tD67ExSae0N608lbh0HWNENWLqK8rYkgbKjT3TycmREYAAT4z5CukXdsww1JkDy3JE1bPlei4HwMgo+3krccYZTckaqIBtNEQcBUMJUn4IsjMrbDXSXFFz+gqAhDTRXbK5buuxu3RcmJKKb55VdS45NmTWGCV7GXvo1IUpvcnjWOrAvl+eCmDHqI0oCgAgFb2Do6pUAL0BHnBCk0d1+1CziHEsvg6vG0zfXektf9zdfbH+hxjPm+eZOfNa+gBPSQ+577UnxKOqFABbqizOsL0C+zCA2NBROvc8E/e+Oee/nPPvzvlHlmU/rfPap56Wij8B5rCNH6kcjCZaVorKzYgW99Y/5HaGL6nAkQEesC1f12fPGFLGv1DuqAQr5ZNkE/PMDA/UuAIfn6/V6CJgjd+mOv22rPUqKayzwBovwLXn09+vkSAVu1ox9dNs0PutG5DYNymH+9D8jwADAJnYEBNw1gmdAAAAAElFTkSuQmCC',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAudJREFUeNrsWtFtwjAQTSO++sUIMAFhA5igMEGzQeGvf5S//lEmIExANmg2qDtBM0K++ln1LB0SpA7cnR0nVDnJqkR9lp/v7vmdIQg666yzJu3O1ULfr2EMfx5hTEr/ymDs759/kpsECMAG8OcAI7oyVcGYA9D8ZgAiuA8YfaJLAWPsE2Ro6X9ggAtw7sFnBEPLmosErhH6tj6Cjw35sqxn4Tvx7QuRP6a4yT9DEitc1qBvW104HP157JpkvBlET9f7wjeL+rQNYU7qEmDmyxdZ91rdKtP9agNw78MXiWUjXVMMELWlErgqpi5dEcVEWkcNzlF+Ua1AH9fEoqrknxVAXHRMjKQS6NCNbcq3tl3C9XbE6cOqg3MG0PGdp2vui1h7Oj3Ht3YPUonlKiP3KlJjw2yDxPchnP7UUrGkXLG98xipvgWxXGTPtqToVqBYWIKhSYBnFz5DsZDTs2mASwtiIaVnFcA3T+SSWbZCJD0bGtSJPtkpAs1qAri2IBZyepIvejxhPUZIApEFuBQOcS5ULKTLnf0mA4upU70Jm1oIT/2s9oTEwmq3RCQDgKV1mpSIIRYKirRWgPii7aL2pNdLXitAMAnAtWFjiYDIWC8JUoAT5vzCdP3oN0zUolMG0NQHwBFXkpUfZEtAMyJQxf3ixkeKFlTxQADKfuiSAuTcg8tL0WMAzbBmWcbu6IFBdf29E6fnsNFhBQsfn+EHJ5FOMZ1V4MjCmtNzbQD3gs8RcWmtPn724fLrtbBGgvnz/okbXxF8dzB31hRAav0tS+C4smzXZoBn7RDajCnL+i6iGDIJZkDcpEmSPdXM1k4iSCGYtBw9PJgoaMC4ACfc2jvpGiSW+wZ4jUGTCikl/dFB1rYUNd17sbD7SFz8YCh0WPR/2iGLjl1VpHp9AFGicQW1pGPXaTnl6lerNxnbdogRta3rXyX2mBtQpTQtcFMvVXUE4yEwf2d4XPMThUEedNZZZ//OfgUYAP10GpO0LvYtAAAAAElFTkSuQmCC'
            },
            'Inventory': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfZJREFUeNrsmYFtgzAQRTHKAIzACOkG2aAZgRGaDbIBygSok9ANwgZkA9jANdJVQtQGA3c+095JFiCI7ec72/8clQQwrXVuLjk8vpRSr+ToZqDOplSmdPq3dfDuckSwzJRS+9vwbXYkuKdeb8/oIT3gaijHhHSE5TDXCsu3hWNulrHC5Ws9MuPx/Aje63w6CgPTUXoxRarnPHl++Ox18M1joa4oPLg5zGzhjdk3hQU48YwK+fs5O+2AuprL+0iCOTu8ccB6Uxoon4a5CRWOH44lntpaGFTSjbzW/FatEQTKF85c6ohWuMaE7Bu1SvkZzSvF5gzZSDETNSVWQy6VEkxxDGmVY97nFN5rOUQxeBRf9Vj0YsEoKO7TSGJVKSFE/e5VlFJlhFBNafLHLd0wghnnHAyRKdwZAVv0zMOmCZngLrbdngKQZatwKRoqwI5ByeiQgMGO+RwKJgggOSTAtXMdQN/obamLKbfRxvu1NxzhdpgCg9bMFg6uFLYHl7L5akdblUfEkIfoYtgQWQ2nCrSATMcX5Vx/0AFH7wpib9bT/xBZsgnsw9o1bS0tMqdQHduSCrFkEw7rHfdc9eDMwclc3K1TfeqRjF4yegEUQAEUQAEUQAEUQAGMxFbng1TJrXiQELCPuP89BuAtUsg+GR04/1v7FmAAoI2LKXyxTfEAAAAASUVORK5CYII=',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAiVJREFUeNrsmM1VwkAQx7M8C6ADU4J2AEdPwMmjSQVCBUAHpALi0ZN48kg6MB1ICVSgzviW99a4key6k0l8M+/tI4RMdn78Z2c/okhMTIzTFHUHg5fbBD4m0K6gxfr2AVoJ7fn95jHvJSCAIdBWg/1mCJoCaNkbQK3a1tEtpVBTESn36ul+HVrJAYGANuUKaDMIXmHDa32viW93FKxJzRyg0prn8dmEMlVDKzipKlcHh6Z/K868o1OA1YqZNfDJzryDL0UhxUbwcQdtZMxxoeyg1c3+UniUJ9hQj7VpSwsSHJMLAD2SA2q4fehUamCo4tgVUvUEzhvStcgsGeFOBWhOWUXnEb9dUgLmHQDMKAHXzHCF65ThBAgvPzCr+NDGSoZLxaPPGtUZkFFFrz5916IcKmakgHorxKVirvv8EUtIBZeMKq7PxBIEMLaouGkBbmNRL6YagzYVS0K4EuAWvur5AKKKK0NFXPSOoe2Iqua4UgdWrvtO5VBkPoyvuKIvLJvf+wB7xJ3e5Nrevzf+XEUJiMrNqkFQGfQ91RvsoSug7zz4tS8005UQDvt4MuHaSNHq2ck69Km0rpbLujFHreC3whNZDmwhwNgBxvbsNgpwkHVBmF1vEDjZ8Qn1WtSmwtB23ZY/OWBlepgy+JMVGXPqOBWaxKPqOfk3LTIhxyAGNGf0J0/RTpoACqAACqAACqAACqAA/gvAtENxp5GYmFgv7FOAAQBb9L5Q7JkfxwAAAABJRU5ErkJggg=='
            },
            'Trade': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkNJREFUeNrcmu1twyAQhknVATKCu4FHcDfwCHSDZINs4G7gbpBuwAh0A4+QbEAhuR+Wk5gDc3y9koUUOeDHCdx7B4wllFJqr6/OtKw2aaheXxd1l2l5bYCTehSvCfCVeO2ARmPtgOVDKpzG2gGNRJFhRLlJJoOEYD3MYtoWjVlB6gEPgcBugj5PFsgmBlj3IlBvBoT++cpt5oW2VGANTHoKycVY8SBn84xK8tkDR4F0mGeCYn4YiJXxt5l05K9m5mJHPOdby0vmFLHKDHiIuGKHh1zpbEgReAFSrjzXIQRgwxIKFjwZxL+uxaoqIDGAga1aSN0gdzbA5Wc7rXldRTeDvhqWp47vvo5GN+YNdSxv7d884E66mQqAM7o6/0UL0reeTceQSakgc/lUBWMkWGxHwxcF45608hXT0YDxf/DCFICS2mA/eZbRlij7dCpS/h1n823EVAK2dC6gbRLASWypo7SyYouBKxIQkfuVC7jYNwwDuIgtOYu7Au7AfcjcPaW+PrX1+rNlOEsZs92XAufzZQP4mzGcgfrwhbsBwpe/MoT7gV/uOl9dKVevc8p9urWF0DX+TK4l9kQm289sgz0SlvSoiwg3kjyLzeBSH/dA+NDtmy+W3R2yQwIIHxputxdKA5dYW8uI8cIn2bDxKS07TK1PJuCogXpOnC1zood7JwofGmtVs+0ZngKDXaKHpojZR5xTFSGSUs8zM2lPOGFrJkVXyDFVr8K3AFB+sXxAW0bCatGLjESwmvSkYJxsNfwXYAA0WTo8mOdtbQAAAABJRU5ErkJggg==',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAcZJREFUeNrsmoFtgzAQRX2oA2QERkg3oBu0C5Bmg3aC0gk6AoQF2hGyAYzACNmAnIGqVdOmwb4zZ8dfOkdRJODJh+/7HKWioqKuW3W/5rx8sjDcCscGP8swAb/0yAUJAlK0//atUjlsQ5xBtpmUBkgOufQic88NCQuB6dUzw3jBOFcmrN9JIH7wAscNRkp4VStIIIQrh9TikTEkeABnBQmewBlDgkdwRpDgGdxsSPAQbhZkYgBXCIC72AyYOJmNT7bOBDBVsnQWUqLZJoUMBfAT8sTX3hDfZI+xw+hwhdtLoKYCPGA8I1QlbVopUrTFuGOHq/vUpANnC1hNcK2DjXEzhZMUdZeSdf+G45PLd/B2AMyhY09Jpd7/2fELbVlclpK6rq1OfssBXKQoB1Q2uSRtBTO+MjGuVI0KRMkvKdBOq2OggCPkVizk2HIkqIMyIbUFPNAVenmQO54y4VGLwrwOetJksiv0HrQJ7Z2M8EYvjVUT3Kqn86JCD1tozTY9ZDeUghwKqgu6OHzR1u8VH/pjieXXxfHZw1JwtPvBvyBn7t/cmG0TCTXotI1fgZD0nW3JWy3ifVv5429aQUKuVVRU1FXrKMAARzSoiIOPayYAAAAASUVORK5CYII='
            },
            'Groups': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+xJREFUeNrsWuGxmzAMDrn+fx6BTlA6weNtQCcomeCxQekEuU5AOkHaCcibIHkTkA3MBtS+ih7lSbZlmzTpRXc+csEOlix9+iSyWt3lLnf5l5Is/YBhGIS65Gpks1uHJEkON2s5pViuxn6wS6NGekuKCdg0V+pbUe44+EvzPyt33UqqjW2JDXdqlNM4U58z7ZJqSGJNdW3KpQYAER6nLk3rlkbGHPm+8XU1g5IV8fxsCcVKcLVR9rP7MuQEwGXncjQYocMM7QscVC7LJlYNhnzsOZN7FbGHre1315b7+qQKyxwsSfswlBfMJeFjT6ypXJSkLFq7QDk2LyC+55I7pqCcdYIQP8/EyTwpDrlx4J/xCHOS9Gp8VB8/qXFGpmx9QGUuLTG3QOYWkTwmJXChozDBO+ApQkzkwMZDwfmmpWFuEUQO9GlRkO24uYED4wRKNpY1Tsi9dtxDb7n/DUNgF7eBOVgMfY8Rv64K2uq1HWIEDTTaE0pT3KkL5h3GYjgYxAjinFvWFAYY7+A3axhbA9GWtgKYAKSSo2BBbFJ4oC9XCgdahxlHhKLaaN3adJoBSkpKOUgNuaEka3zcNHfYVItZDqzMKX5bIudlhKFZLh3qcpXFSA2xyTEuM8P6JtSl31l0PMMwWUgYKNZhSrz1aWvaxbBx6rC/k2+F3jrGzWItPwsy/1U2USCTYG4JiVdYLKeT+w91ImdDrhrdL0N+b/SOlSXn6bWfoWxLLWREFwKnEIu1RMsihXjdwhzpgaIdrK1hH8Khs8DzKMPiDkukoNh+WEYk1bQC7ipZKYM4PUmhpCHhLqEoVTZReTF1LZFyj9NeQlombavegAzUX1N3OEEVvSKAqLFA9ytcdfCf52AE4CEAOPT4AGBExdB7DNDAhSVC1p9srKViFsRVjJQBcb3ldOqI/QjbMZsYhuQUxJ6Kcty0pBjOWA8+znMKlU/glObI9nOBPD/PjRlj7h+dRgVzRl8zVh+U2ycVJFv5HZtnzCBrwhVfDQ/OCWCJLZgHZRZ29Wafa4KSfYEkizH1B8KCsaW3eQ/kwgLiM0dpHvHiY55oM9+OW2SgqZlEXKwBTHaWcug5oOMWUx4Y3eyNLs3W4GIbaIv3DjVfekEFT4wYnMairip2VO+jntEwOaVs2Hu8JV5KggtKKhciue/I7axlwHBSS1xE/b8LPLN14aTUHkM30DrUjCXzDW8KVM/WqKrZb6Y8FBQQ4KVjPJwMefVxQrZt8lXFVX0xOCNiZAk5Rnkf76mksPzfJUQ6FmhcQNEy0j+d9j4vUKPFoGOMFpMCNjN06HqI0Re4Hph90+sSOGmxustd7jLKLwEGAABHMz3rGyJjAAAAAElFTkSuQmCC',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA1dJREFUeNrsWutxozAQxp78t0sgHXAVHK7gfA2EuIKYChxXEKcCPxo4OgiuwHQQSuAq4ARaX4iyKwR6XDKnnRExIWj30+rbh5wg8OLFixcvXkiZWJ39VIfs+sBGzEYkPC3YyNl4Du4m5dcDeKqf2HWt+Nc7BjL9GgBP9ZxdXxCP9Unj0QUDWn1egOPBWQM5Ney/jQa4AN7dfE4P8oDyami2W1OB52YEkCYiJnC37RjyYHDhm7nSzsJdvXpk+nI7ADm/9mwsO7+N29V++2xKunM1nA7h8z2zI2M/V6o8nQ4MHkvhSSjwx5REhI4AbHgBm4wFmT0B4OCgGDkQC7A3A5BzTvRcCdtkZR0e17ECne89yW3T9mCCgPvGFLvw3hXkodX5EWRiAqC4SluC4IVBSAUCsmp1y20bBTBEVhOT3CDAXOLJQBKArFYyz9bnUoycQwGWgpJ7YnXLtivQl52killKbRsJMP9Qb9IrudXkYoHwrOu9zVBaqAA8Ivv+0npSBMoDwWIkSLqT4LvmgnDuaKbYPtW/kO1xlaqtG8UAoNvwclDNHNRuydg7P00FmZXEK3MwRORkCnXqjni3gGe3RDcvA1eATcaK7RA8NTRBl3+7ArNSgU2FngcbjvGtdpEk1coSiFSyqDHEgae+1DHROH7IoT+zW7JxLiaSBZYec8gA7tv+C8+Lq6GNpwGgMfAS72qIwn8y4PgBj5bv3wlhpWcdQyJJsOjmssYTv+G+JJM9HV3RYw4K4FqIjBVMgOWoR9hCoWGflUCBR4I+Yl5sFn+nGmR+IFuAArexAO4auTegA+sssh6bCYB8dWLFiiFxwL5EscKKsYg6Vej/Gj4UEs7ZlhB0iV4skGI7VgEYKRa0LsD16cp7bEcBfhfuz4qdvk2hdJ17bFfaognbIlihPXMIcIZQZInwM1apRSshx8RAYDEPRg4BRopdRqXiwXRQ1+BeZF1G2g/w7YguH8kLux6kgw16lDkl2pyCjQV05xm43lbXoCJzpMu4JvtFayuWygKdr89Ode0U4t1klK06x4aVQ3ijdekATB2B1KKG3je8vPZbW+0m+IFU9W8A4ol3qTlTBm1SZsIsO/8nw7vvGEonWVFewji3od71KYEXL168ePnf5Y8AAwAFxRqGb9Oz1wAAAABJRU5ErkJggg=='
            },
            'Forum': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZBJREFUeNrsmotNwzAQhm0m6Ahhg47ACLBB2QA2YIOMEDbpCGWDdIN0A3NGbgUoju/8SO32/yUrkdrm/F3uzq8qBUEQBCXKGLOldjD1y/ZxK2HTDnCkS9fI+zhqrR+lgKaliCNADcC7B5Q8pHABNAAEIAABCEAAAhCAAAQgACsEvDzkvyraTvH2jW571vZGi4B02TH2cMYH1a44e0hdy4DHe8/BH91UFZ39LgABWDegN5E9GqhtAh0qfs4hKUgxG7+2PL+QE788Roqfc2QJ0YBO1N7Jzic7TK4EeP4gNqSGhHCPPkITj5mJeWN/160EuHg+GD1hcQ4YFwxP1J6uPStKsm2rJ7V9wMMfHCOcKdbcG7ORwuhDmnN9EFwjzGXOnyXPryiacg0pIchnibFUB0U4JT09XLgcVniDRSquJC8HqRcFObjqPzKWQN9yhcnqnRd0zFsEMgPuQ/PhkpBzQ0mfEbBXNcgVElstdzkG63MlVbegmQiYUvJNVwho88tO4jdu1fJKi4eTgiAIqlHfAgwAkUXCGdAJ6UMAAAAASUVORK5CYII=',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATpJREFUeNrsmeENgjAQhXvGARjBEWQEN2CCRiYBNnADSRdwBB2BEdhANqhH5B9B6VFIgfeS9ocC7ccdrz1QCoIgCIL2K+r9YmzOfRbYPAulKfcFaIMMhSaSnHbYeooCEIAABCAAAQhAAAIQgACcScfVzfh3vdqrG9cYwczlPzyDAAQgAAEIQADuDLAIcJ7iObm/Djf2yv199PHCV+4DYyfcP1zGc09RTSX3Mbdm4U12ogQfhWTVhKaKB7x0kTx7rAYCMpkWUqkWsvJYDQTmopoabm26ltteJjSlDk43p0sX013U1WHHuKixEffvP0fduordydzI+z00tjWdJ7fIaZkY/rJcc0v5Oq8wdjJy8xmKWiyFky8T45eRk/AKk6I2b4rKU9tOedaWjaBM392RplpBEARBEORFHwEGAJvLRvUU6ZIoAAAAAElFTkSuQmCC'
            }
            };

    const searchImages = {
        'Users': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCAyoNU9kvHAAAAuZJREFUaN7tWu15mzAQvvMEbFA2KBuETtCOQCcImaBs4G7gbuBkAuwJ7EyAOwHe4O0f8VRRJCQhyRg/vH8cHHPi7r1vm2jFihWLB4AcQAOgBdDjP3rxXgMgX6piLdzRLkZRABWmo9LIK4QB5mccwA7h2Ckyu7tgfIS5DkANoFBYqQ0P/4FJX8ZTKVcYHqB2uLc23JuL/299GE+lYBtiXQP77RTGU2VMb+Ycmcx9GU+hYKPGXIAslaFmCuOp3bMOkFW7PrQr4zEU7JVDiojJqo/BeKiCH3BLeT6Mq9gspCs8KNfFQ7loiAf5MHhWrssAe5UW2dHgo+BRuX4OOPfZIvsT48pb18UX+lhJ5q5atVnLxAiLUZrt2Qt96nFp9lYt9cA7e7OdemWhsN7NOvimXDppGooB+4dYG1oM1NDS4bC6OIW0ife0b61GYrEH8MNFFk9plEU3nxPRF/E6dPiZ4bar1G9eiOiveD0z89mWTYnol0H2T2b+E8uiu5EEEIJeyM4nJrNiznIQrXyMxGcbolyB26OY0AAUk2JQWKc0TNhHEUeXIbaY+WJyMSlWh7+fTLKZ+Zut+ZbkERH9ZuaXGOw1ALKI2TLTrCNdWKyCV5gaf+8SlgW1HGwdDBOWbDSHVgkV9GYEwH5yl2NwzyyhglkENz357GTULuGVma+pFBSyXy3PYF0l6kgwKfhduX67QYf2ZnkG1ShyBjdu+jY6d9EsVg9zLHcdwsK6EN447CyN9S2ymzoxYlk3PrkoOAd7zowoyLxdVGOF4w0VtDIihVJDRFvvhbCh20/6sw5pI9DbvoOwzImVy2FjI9FeHJBHUqrSFGztlzLis73vJMI6CwnqbRnsIobYdyl2zmq9VLJySURfpYF5DFciehkGWqFsZvuc74A7Fz4NwAb2wn4oJMVGdwOlurFYl1x02ACUsRNBISaMU0SlTkJmsi0ZT1R2iKtSWjxlI3XrLGJlWDgddPG6YsWKx8M/G4eFDsaSkmgAAAAASUVORK5CYII=',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAy1JREFUeNrsmo2RojAUgIW5AuzguApWK5CrQLYBhQoWK3C3Ar0K4Ghg3Q6wAztYroKlg1yyiSOGhATMgzDDm4kOCk8+3n/G2WySSSYZUhwjWjIU4Nc1Xj5eHvdtgVeO18ds45zGBZghApQIoGRCYCMMmtsPmKEDfo07Xn3EkDtO3wK/HtjRGa8Un1MMA5ghYrXwwd8mAFFF56fAE3Jm8c6gbkfLhQa8J2S6riJycxICn/i8sB9AGnOxwRCJmU7qtnJJmNeAWzAByANUJ43JJV47loxEFg/hYpCWgnegZPdcKyEZiitJpyq/2sRkGwuuAbN5XffGOX4nmAe9qA2gDwgo1r1xUuay9+dmyIMA9AAB5bqpJYtaPIKVCShptsof7ng1PsDmxMG3dovxATbDX7hP5hCABSACmO42gJATQK6IT94lSwjAD0BAlW6+jFzMA9JOowBxT/Ug/MIdn6GSTAQAGCncMxbUyRQGkE7iR4Nwx8bpnjbXh1q8AvWis0rXnxqAS2tTfd1yyaNeZM+WxX3GfJe0bxHrT3sAvA3AZjedMvQlKeQnfN1zP3sy4lnRzLZhhlDDt29Yx2v/gGabbpXrX5gXXMYJeJssiDfsJe5fMsjTOAHr2XQviUtl0nEBb2xuRA8deJeSfjUR9KkdLUgV+exJriqTeNtJv6i0fGfmbrlWTInjk1z7uztghl5ZLzgHdsaSTe6kRpYKl+W7m6XsAbkaT2zfA9x1iN2zpXJZvlXbto9BmsniAdJKrLFr9sYdB12STDBg7lT9Nl8ePFmyaQLcDgi4VbhpKYAM9AFpil8MCLjQKDP8LsC6jQWHdE/de8h1HooMcGUB4ErhpoUgm/q6gL4FgDr3ULeiEpCa2bMA0NOIw7PK6q4wwO0R1b3Mu7iobxGgr2ghD4J2705+CC59sgjwSQAWNsyJOx1AO130toUoi0vhbOhKxhlbpHovMriyafB1JWYuLIHbaZSJZdNU7ygG3C3rKLweoUiP+bc2393vcl/Pyc3syVDYgNUZ01k2Z/XspLtT1ka6/lfNZwngJ3vX2bq4tlYE4t/3e4//OpxkkkmGkf8CDAA69v/kiPJREwAAAABJRU5ErkJggg=='
        },
        'Experiences': {
            default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wwCAyogFgZzaQAAAYdJREFUaN7tmN1xwjAQhC1X4FQQSnAJLkWlqBNPKiEdUAIliA42L3oImgj93ckms9+TxwNGq71bH5omQgghhBBC3gwAG4ArxuABuFHCLgB2HMMNwKolbAHgwm4ejZMWZwHccS763SzoszsAq9wSaxAj52ZBn/lQrsvAUHMiboZyfNVnO4DLQcmdc9OWPCQl7gpgO8krKuWmL/ny8D6TdDP+nPlLYHTrwxjzOPHA8bReY8yTpjn3gJy4Xz3re5yOet+rVU3O8kzP+sbf3BI9tfWudxbYkyVxXcNWeb+YeTo3n8MFxu/JFyVT00ffiftfw3uwctj22iFTmxmHCWwVriHQForsjvqSdBUX2F0iMiOZG/maOHW6Sgh8JK4lkE/XhhIVGdW0QiY7bMfD678btt+dWWlXl1Bat4oDJDvkCKQn9sOf0L3jaNGH769q620ImVq3IOmqmkABt0Rc7RaotTCtjRohsCkwpEq959hQNByUXC06NrQVD1aN90pX9Q6qCCGEEEIIaeAHXGN7y63YSJUAAAAASUVORK5CYII=',
            hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfhJREFUeNrsmM1twzAMha0gA2QEZwN3g/jYU91Tj60naDJBmgnaThBfe0p76jHdIB7BI3iCthTAAIZ/ZZG2ZYAfQCgIZEUvlJ4oe54gCIIgCIIgTIOiPLz4fthC8wgRDDjHFOL99/YjGU0gCNtAc4TwR0zGD0QMQrPBBIKwFTR7iO1EKy6HOIDIN3aBE2WNnE1lmDUtLHLMP4yyqTrERShu5bBRtmZTzSxrvbOpasTpPXZxPGtN7MoiFzWdjjMVp3muJKym02bGhYtvItCm0rjHSIn7KIYIsc05FC8ZxtCb+xP3r25OluOEME5a8IIUvYAEOYNXcQXLtrL6ojgcNyWMx7pEi5PKCctzEGwFHiDWIEjViFT4/Rr7mRDBkgxKx1XAYXh15+Bfl6mAgJseNezF8Dqls7hDo9L9X22Oq/KfvvTc4Vo9NQnP8BjoJdxGYABZeYE2aavmcYlFDJdhkrvaLNHWJdH3eQN3DWvmeG7an5X5zKCInvaYwCtV5TMTZHflMJk9VjAevs7g5gzjl9111FItIJRnFHcdv5JxEREoAkXgtAxVi+p73Bdae9ZR0vlYY2o3vuN+ZUIu1UokeMPPCIWDj+fpk+WdVA0hkCyMS6hJLWr6widDYfriG3OKw4nqpR3jxTnB3zPZGoIgCIIgCILgBP8CDADdNbvaftlz6gAAAABJRU5ErkJggg=='
        },
        'Communities': {
                default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+xJREFUeNrsWuGxmzAMDrn+fx6BTlA6weNtQCcomeCxQekEuU5AOkHaCcibIHkTkA3MBtS+ih7lSbZlmzTpRXc+csEOlix9+iSyWt3lLnf5l5Is/YBhGIS65Gpks1uHJEkON2s5pViuxn6wS6NGekuKCdg0V+pbUe44+EvzPyt33UqqjW2JDXdqlNM4U58z7ZJqSGJNdW3KpQYAER6nLk3rlkbGHPm+8XU1g5IV8fxsCcVKcLVR9rP7MuQEwGXncjQYocMM7QscVC7LJlYNhnzsOZN7FbGHre1315b7+qQKyxwsSfswlBfMJeFjT6ypXJSkLFq7QDk2LyC+55I7pqCcdYIQP8/EyTwpDrlx4J/xCHOS9Gp8VB8/qXFGpmx9QGUuLTG3QOYWkTwmJXChozDBO+ApQkzkwMZDwfmmpWFuEUQO9GlRkO24uYED4wRKNpY1Tsi9dtxDb7n/DUNgF7eBOVgMfY8Rv64K2uq1HWIEDTTaE0pT3KkL5h3GYjgYxAjinFvWFAYY7+A3axhbA9GWtgKYAKSSo2BBbFJ4oC9XCgdahxlHhKLaaN3adJoBSkpKOUgNuaEka3zcNHfYVItZDqzMKX5bIudlhKFZLh3qcpXFSA2xyTEuM8P6JtSl31l0PMMwWUgYKNZhSrz1aWvaxbBx6rC/k2+F3jrGzWItPwsy/1U2USCTYG4JiVdYLKeT+w91ImdDrhrdL0N+b/SOlSXn6bWfoWxLLWREFwKnEIu1RMsihXjdwhzpgaIdrK1hH8Khs8DzKMPiDkukoNh+WEYk1bQC7ipZKYM4PUmhpCHhLqEoVTZReTF1LZFyj9NeQlombavegAzUX1N3OEEVvSKAqLFA9ytcdfCf52AE4CEAOPT4AGBExdB7DNDAhSVC1p9srKViFsRVjJQBcb3ldOqI/QjbMZsYhuQUxJ6Kcty0pBjOWA8+znMKlU/glObI9nOBPD/PjRlj7h+dRgVzRl8zVh+U2ycVJFv5HZtnzCBrwhVfDQ/OCWCJLZgHZRZ29Wafa4KSfYEkizH1B8KCsaW3eQ/kwgLiM0dpHvHiY55oM9+OW2SgqZlEXKwBTHaWcug5oOMWUx4Y3eyNLs3W4GIbaIv3DjVfekEFT4wYnMairip2VO+jntEwOaVs2Hu8JV5KggtKKhciue/I7axlwHBSS1xE/b8LPLN14aTUHkM30DrUjCXzDW8KVM/WqKrZb6Y8FBQQ4KVjPJwMefVxQrZt8lXFVX0xOCNiZAk5Rnkf76mksPzfJUQ6FmhcQNEy0j+d9j4vUKPFoGOMFpMCNjN06HqI0Re4Hph90+sSOGmxustd7jLKLwEGAABHMz3rGyJjAAAAAElFTkSuQmCC',
                hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA1dJREFUeNrsWutxozAQxp78t0sgHXAVHK7gfA2EuIKYChxXEKcCPxo4OgiuwHQQSuAq4ARaX4iyKwR6XDKnnRExIWj30+rbh5wg8OLFixcvXkiZWJ39VIfs+sBGzEYkPC3YyNl4Du4m5dcDeKqf2HWt+Nc7BjL9GgBP9ZxdXxCP9Unj0QUDWn1egOPBWQM5Ney/jQa4AN7dfE4P8oDyami2W1OB52YEkCYiJnC37RjyYHDhm7nSzsJdvXpk+nI7ADm/9mwsO7+N29V++2xKunM1nA7h8z2zI2M/V6o8nQ4MHkvhSSjwx5REhI4AbHgBm4wFmT0B4OCgGDkQC7A3A5BzTvRcCdtkZR0e17ECne89yW3T9mCCgPvGFLvw3hXkodX5EWRiAqC4SluC4IVBSAUCsmp1y20bBTBEVhOT3CDAXOLJQBKArFYyz9bnUoycQwGWgpJ7YnXLtivQl52killKbRsJMP9Qb9IrudXkYoHwrOu9zVBaqAA8Ivv+0npSBMoDwWIkSLqT4LvmgnDuaKbYPtW/kO1xlaqtG8UAoNvwclDNHNRuydg7P00FmZXEK3MwRORkCnXqjni3gGe3RDcvA1eATcaK7RA8NTRBl3+7ArNSgU2FngcbjvGtdpEk1coSiFSyqDHEgae+1DHROH7IoT+zW7JxLiaSBZYec8gA7tv+C8+Lq6GNpwGgMfAS72qIwn8y4PgBj5bv3wlhpWcdQyJJsOjmssYTv+G+JJM9HV3RYw4K4FqIjBVMgOWoR9hCoWGflUCBR4I+Yl5sFn+nGmR+IFuAArexAO4auTegA+sssh6bCYB8dWLFiiFxwL5EscKKsYg6Vej/Gj4UEs7ZlhB0iV4skGI7VgEYKRa0LsD16cp7bEcBfhfuz4qdvk2hdJ17bFfaognbIlihPXMIcIZQZInwM1apRSshx8RAYDEPRg4BRopdRqXiwXRQ1+BeZF1G2g/w7YguH8kLux6kgw16lDkl2pyCjQV05xm43lbXoCJzpMu4JvtFayuWygKdr89Ode0U4t1klK06x4aVQ3ijdekATB2B1KKG3je8vPZbW+0m+IFU9W8A4ol3qTlTBm1SZsIsO/8nw7vvGEonWVFewji3od71KYEXL168ePnf5Y8AAwAFxRqGb9Oz1wAAAABJRU5ErkJggg=='
        }
    };


            const topbarImages = {
        'Robux': {
            default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAppJREFUeNrsWo1xwiAUVifICGygnUC7gd0g3SAjZIOMkG5gNzBOEJ0g3QA3SOGKvZQ+fgIPjJHv7p2XOwN88L7H44XFIiEh4Z5Yhmi073vCfnbM1sw2zIiwIb6EnZldmDXL5fJrsjPFSTErmXW9OzrRBpkasbrHR31XoqzzTMx2aPA+sqgaZB1yXR0AXQ3BtdUwOzG7Mn01Uhtco3zgW6HXjaYtrs031sY5xsrlmtmmrhoaaJhq2s9DkysNxDJE11cRLWOTO2AQUxA9RCGpccsigiSKoO7KA8pd9GA3wRsMN+likBMkqLDckmTnJQ+F7opAqzQMKnSEu5auHRIooAR0wz/Q/A8KPMSlwxrYCrIJEMyALaTGWL1SoRkT+H8qRT97Zq3F+7mFdIiP9v6tniU50wTZglqsYjmGYGd62SFppgYPsSaoWITOxz0JAsFeJNiLkccr1bZBnNwUcJ3WNSgAEa9QeEjhGJha0/68At5bS8+NR3C8SM83Hcsz/eHYfmMYO0hQTn9OE64pnQxjBwnKs3v1GMBa0ZZcXHJN/a6GsXttuDGCDNfYHmO8MQj6bBO563hXEfXyG0hE/fN9xLt4FbYAK+ibqt1QYbloB+nGgiDFPPUDR6Mj8J+dKZtZKUp00N5lwosoFcqoRFAZexL5lJ6hic4MYwcJyoPcWhVYf3T1qti0eZA4BqhUbw1jD5OqaQpFVOXyFsn00SVVQ0u2FfqgPR4qlGTb9bikmawWiSBBOS45HnipocTg+/Upxz7wjilZUBvfF7oc67ItpFnvksXsi05PUTacfeH3KUr3s//4YtHB438+M+hxHh9ALUg+/idsy5L75C4hpGskFq406YtAGETneZVLo6FJXcZL1ykTEhKC4luAAQAOJNXK5gapQwAAAABJRU5ErkJggg==',
            hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlZJREFUeNrsWuttwjAQJkyQETICGxA2yAh0A7pBN6AbZITQCQITpBvABmED15buB3Jtend+xDX+pFOCRGx/9vle9mpVUFCwJKoQjQohWvlQspXSgJhwA7lIOVdVdU52phQpKb2UWfAxQxttasRG4R/jokRl542UQYSH6qOJTa5zVEWO6naxyB3FcjiGJteL5dHnTC4MyYXVMqy6gkFJFZ0PVxDLWk4wmR28Y61r40JwWGI1iFozsGJRiCLGaEGxxEPftXzMhM93tjj2GcERAuboBKF/QfhcBeo7anyJ2jPItmyqfpWyfxZzEvZk69vndcT9PBomqPZoyXvKYP60nMysg2X9kARnn+opmFZ5psy2WmGi2/ilpmtDuy1z8CZ8aH/7hueX9u1kmUS1KsoNbJDDQBHcRjCad+33xlO7WwzBuMmlXzSpEKwNxacgBLF7KbqRAWN3oMbCmOA6CEH5yYbjJsCSTt7GFZDg4ODoG8IiNtEIwuw7hWrUikKwFTQNEmZ+YqZPo9bW3hfBK5OgwsGyiqx6DiPCumLchIvJPgKZ+iENukt5k6/vEdzPDUPw4tjJXiXK+maXJD9VYmqIYqw5HsM/X1ZI/8NVUb1e4i1hRqp5S3XILgSFbV8yi19+0iVOwovI13qsz3Nw9KSEF12yIORrqBKH5j8poVr7b4pOjKqateiUZNmQUVWzlg3XTzpUH5xinjma3hE4sc/2sy/dZ3/48hLHZy9xAJoYyT60tcv3EoJmePK8RqK5kDwvAhni1vyuclmIJncZr1ynLCgoCIofAQYAYBdixzazNSQAAAAASUVORK5CYII='
        },
        'Premium': {
            default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAENSURBVFhH7ZhRDoIwEESpR/BPwx24pwfRa3gF72D0S6+AM7A2dCWBrYJF+5IJtKAz6a4l4uq6LlJkJcfkWEYw5xwPJbSHLhDrPKXoQa9SvD26xxjqBK2b0XzcoQo6NyOgS7mD5g5F6Elvj14xLu2mPZ2dK7RtT1+DBQPUPSz8h4F34Ae8X94urCQbzNRjPT1hYsT35R6L5jd7TF/XDN2vr4PcY9HkYFZyMCv/EYz7UheZjiKX0kqywSZ9Vg7R04f5WRnNYoLxT2c07BkL8rEngbcOdpTjNwi9GbyjErpBDXKLR6Y9Mu2R6RjoSW+fJVgx/Pr5toVvXQ7QW2UdCT3oVYm3R+9jyZC3CxtF8QB3ZhWqs8UMXQAAAABJRU5ErkJggg==',
            hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAENSURBVFhH7ZhRDoIwEESpR/BPwx24pwfRa3gF72D0S6+AM7A2dCWBrYJF+5IJtKAz6a4l4uq6LlJkJcfkWEYw5xwPJbSHLhDrPKXoQa9SvD26xxjqBK2b0XzcoQo6NyOgS7mD5g5F6Elvj14xLu2mPZ2dK7RtT1+DBQPUPSz8h4F34Ae8X94urCQbzNRjPT1hYsT35R6L5jd7TF/XDN2vr4PcY9HkYFZyMCv/EYz7UheZjiKX0kqywSZ9Vg7R04f5WRnNYoLxT2c07BkL8rEngbcOdpTjNwi9GbyjErpBDXKLR6Y9Mu2R6RjoSW+fJVgx/Pr5toVvXQ7QW2UdCT3oVYm3R+9jyZC3CxtF8QB3ZhWqs8UMXQAAAABJRU5ErkJggg=='
        },
        'Settings': {
            default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAAHfgQuIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABHhJREFUeNpiYCAG/P////5/JIAiAaUbgFgBXRcINKCLIUsq4JTE4gYHbMbDTQEIIAoRzE50mgnKKAT5lREIkB3HBMQfgNgeiBVwGfseqx/xCQIEEF5HQsF7bPJMOBSDPQByPJA+ADMAp63IQYAUw//Rgwar+3HEHYY8C4iAOgksiB62ULAAWR5fgPxHczbegCIJAAQQdRHQSQkYGYlQ7sORQg1AGGe6wxIwAmiBY0AwLUIN2o/En4+eBZAVC8D8B+Q6AvFGJMWgDDwBa/wRSjnI6uA2Yk0RaABZDROh/AYULiCYUWFFGp6kp0ByDodFDTYJAyy27MdaHIP8iy9DExtoJAGAAKI7YiSnWMeXLggBJjyGI2ey9+jhjGzJf+zAgJwKWAApFQgQ0Aeql/uh7POkljsw3+3HVnhhAzjKZgOiSkN0Q5CEEgjUhvtxlG/vcWrC41sDYqpgQuJMeFwLi7MLSOUiKSl6P8kNBhxtAozSD71RhST2nhjLkMuqfmyuxgIUiG3hMBGw3wFWN0FrzEBGLAAoHoAlKkiuw5F9CmL34wlqUMJSQEpg1GmSoFfxJGXugQIAAdivghsGYRg4QhmBbsAIHaXdICN0A0ZgBEaADRghIzBC2gdI1inGF4c+qhYhIQThTGzfnf8nk8P71+php3Eo6iFIW6ztwUSoSELB9oJhzkbJJMCjyTWPiAXLdt/jMK2YyJwWxhLAIfOsFQS+aoGUAnaGbUhHrSEDYre0x+jg40EEFhFUbmlpUzeogexkSJGDVfqktXxq1es2QUbeV3p9DeAZrm0qZKZ9jJzpwiHoKxBrd9c20qwjqjWIZldBvYWGbIIfGIzGTzDUqIA5eVoycvR4X65KjDNI1UVWr/V3t2p/CSRSaiMaq2i2d/bGH+RsWDKUrgfpmkhC77zbgq461zI9OnVvLlpGoj5pE/1W4meOlwDtWu1txCAMVTMB3eBGyAgdJd2AEW6DqBN0BEZghIzACMkG/ZCohFyDHx/O6aRY9+fyATjgx/Mz1+/Z7UUxgH6DBUXj4wf9XzXGMXU6UVKKarYag0LdGRnwzOwke7x+iyC+S1jLwWN891bq42zHUPM53a/BxjpacGyLxIJyuRCzClPRh4nvBNLWZ7y3qThK6FvasDkbDaOj3Id+05rBVWDtNUvQl8AklUxVlirJY7644who6gEYJ5rcJbV7tHZoQYHMIiksKNfbIaQUQEoHzK5t6NcCTjoJYVspfBorRoB727FSbGl7+RMO0coeS9X+VaIFRbn2+Vplu7f/aUCIHjQeexC71LYKFwXi64P8dx3jcaW2IVkScGgBgEaKw6oKTaZizsWfROGW1qWzMnTMAINMqdtMthWOmrEfh2hNItEYxWZ8xWygtmTa9JosJiBso8CA7nGA9KiKZ09t5tviWFLQcnAjFbU1GXCPpmqSD7KS65uKgwLhFllPLnVKUiQHgIduTggmvXsNw2hwSj+rJ46GBCVntKRTcV/s49GqWtUmrHX2cFKc6HeQah3x2csuY+wbVSeCrb7HJUgAAAAASUVORK5CYII=',
            hover: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAAHfgQuIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAy5JREFUeNpiYCAW/IeA+bgk1kPp/xgSaPz/MM58ZNUwNiO6AAwwAgGGvch8gABiIMkryHwWNEFHuGNAdgLZDeg6MPyJTZKFaJeiKwAIIHwKG/ApZiTVVFioMuGSRAZAIUF8aQMGHAipwScpgCZ+Hl0T2X4kGwAEEPURzoCAAiYcmhKQ2ApE2UAAYM3OCejxCcQFeOMPzcbzeOTWo8QjSsTiiCd0NUzkhjoTMakBOQnizB04AuE9rABBKVlIyO0K2BTPJxSJVElyZAOAAKI7YiQnt1FSIDARkclAeWY/rjDGkp9wZ0BcPqRm5KGHAC4fHsAidoERBwDKGZJd/mIpdv6TEL8NROvFk48cyCnCcVlMTCllQOtKRgGLAw3I9R2xljrgCJkGbEUtKWXa4MgWUEULkFtIQOYGAmY7QtUloukb2KKN7gAggEYRobzWQGvLBMgtZ0kp2pBbqf34WrKU+GQ+jkoVH9iPXNOQaxlFgKiijZbFGtY4JKLkKIQ2bR0JFHeJlFaiBnjUn8cWp8Rath6LZgEi9J2nqMlNTubGojeB7LYIBaGD6WhSa20yWgr/0XtsH+hVFjNR2TwDcoo1klMoHr3zadbUA+VTLFoVyI3486RWW6QW4LiAADH9CZK6CNg6MyOutiAWLCAneyQQKkFwDD7PH/yDCqOAXAAQoD0ruGEQhoEV6gCMkBGyQTtCR4AJyggwScoEjBB1AjpSiRSpVUSQ7dgoLbHKDzk+au7OpvwOt9rDjj6nz5IWTH4/AxCiBNIAK0LBJmZyPcFPGMUPBSAU7UCbjeQ/wTYyMoRhbdFcvyRA2hvaom2G+FruFr0i26gHTsz1holm2b9zgpsxQ1YE7LwryMhuH7VMIZypgWeqvdizFmDtmpNNMUnD6ASlqUudQ6uAdikrmpcgUybn/vsBbQ3ggMxxF6wPm3ugvAeQPU0v8P5BtLHhOmyS1kCCFk7cT9QixF4T8muEyFto3jOihnG5IO7BgZu/GNt9qnmuMKK777JcN8LzHss0gZSJR4b4+GuK2LbGm3HLONBan7NJtmdCFkv54iA+1vh7lUgbl6VTegyszqPEweINr56yN7bizEIAAAAASUVORK5CYII='
        }
    };
        const currentPage = window.location.href.toLowerCase();

const sidebar = document.createElement('div');
sidebar.className = 'sidebar-custom';
Object.assign(sidebar.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    bottom: '0',
    width: '62px',
    backgroundColor: 'rgba(45, 45, 45, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: '999999'
});

const style = document.createElement('style');
style.textContent = `
    .sidebar-custom::-webkit-scrollbar {
        width: 6px;
    }
    .sidebar-custom::-webkit-scrollbar-track {
        background: transparent;
    }
    .sidebar-custom::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
    }
    .sidebar-custom::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
document.head.appendChild(style);

        const buttonLinks = {
            'Home': 'https://www.roblox.com/home',
            'Games': 'https://www.roblox.com/charts',
            'Friends': 'https://www.roblox.com/users/friends',
            'Catalog': 'https://www.roblox.com/catalog',
            'Messages': 'https://www.roblox.com/my/messages',
            'Profile': 'https://www.roblox.com/users/profile',
            'Character': 'https://www.roblox.com/my/avatar',
            'Inventory': `https://www.roblox.com/users/${activeUserId}/inventory`,
            'Trade': 'https://www.roblox.com/trades',
            'Groups': 'https://www.roblox.com/groups',
            'Forum': 'https://devforum.roblox.com/'
        };

        Object.keys(buttonLinks).forEach((buttonName) => {
            const button = document.createElement('button');
            button.style.width = '100%';
            button.style.height = '56px';
            button.style.color = 'white';
            button.style.backgroundColor = 'transparent';
            button.style.border = 'none';
            button.style.textAlign = 'center';
            button.style.cursor = 'pointer';
            button.style.fontSize = '10px';
            button.style.position = 'relative';
            button.style.display = 'flex';
            button.style.flexDirection = 'column';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';

            const buttonImage = document.createElement('img');
            buttonImage.src = buttonImages[buttonName].default;
            buttonImage.style.width = '26px';
            buttonImage.style.height = '26px';

            button.addEventListener('mouseover', () => buttonImage.src = buttonImages[buttonName].hover);
            button.addEventListener('mouseout', () => buttonImage.src = buttonImages[buttonName].default);

            button.appendChild(buttonImage);

            const buttonText = document.createElement('div');
            buttonText.innerText = buttonName;
            buttonText.style.fontSize = '10px';
            buttonText.style.marginTop = '4px';
            button.appendChild(buttonText);

            if (currentPage.includes(buttonLinks[buttonName].toLowerCase()) || (buttonName === 'Profile' && currentPage.includes(`/users/${activeUserId}/profile`))) {
                button.style.backgroundColor = useBlueTheme ? colors.blue.sidebarHighlight : colors.green.sidebarHighlight;
            }

            button.addEventListener('click', () => window.location.href = buttonLinks[buttonName]);

            sidebar.appendChild(button);
        });

        const topbar = document.createElement('div');
        topbar.className = 'topbar-custom';
        topbar.style.position = 'fixed';
        topbar.style.left = '62px';
        topbar.style.top = '0';
        topbar.style.width = 'calc(100% - 62px)';
        topbar.style.height = '48px';
        topbar.style.backgroundColor = useBlueTheme ? colors.blue.topbar : colors.green.topbar;
        topbar.style.zIndex = '999998';
        topbar.style.display = 'flex';
        topbar.style.alignItems = 'center';
        topbar.style.justifyContent = 'flex-end';
        topbar.style.paddingRight = '6px';

        const searchContainer = document.createElement('div');
        searchContainer.style.position = 'relative';
        searchContainer.style.width = '256px';
        searchContainer.style.height = '32px';
        searchContainer.style.marginRight = '8px';
        searchContainer.style.marginLeft = '8px';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search';
        searchInput.style.width = '100%';
        searchInput.style.height = '100%';
        searchInput.style.backgroundColor = useBlueTheme ? colors.blue.searchBarBg : colors.green.searchBarBg;
        searchInput.style.border = `2px solid ${useBlueTheme ? colors.blue.searchBarBorder : colors.green.searchBarBorder}`;
        searchInput.style.borderRadius = '0';
        searchInput.style.padding = '0 80px 0 8px';
        searchInput.style.color = 'black';
        searchInput.style.fontSize = '14px';
        searchInput.style.outline = 'none';
        searchInput.style.boxSizing = 'border-box';
        searchInput.style.setProperty('::placeholder', 'color: rgba(59, 150, 95, 1)');

        const premiumButton = document.createElement('button');
        premiumButton.style.width = '32px';
        premiumButton.style.height = '32px';
        premiumButton.style.padding = '0';
        premiumButton.style.border = 'none';
        premiumButton.style.backgroundColor = 'transparent';
        premiumButton.style.cursor = 'pointer';
        premiumButton.style.marginRight = '8px';
        premiumButton.style.marginLeft = '8px';

        const premiumImg = document.createElement('img');
        premiumImg.src = topbarImages.Premium.default;
        premiumImg.style.width = '32px';
        premiumImg.style.height = '32px';
        premiumButton.appendChild(premiumImg);

        premiumButton.addEventListener('mouseover', () => premiumImg.src = topbarImages.Premium.hover);
        premiumButton.addEventListener('mouseout', () => premiumImg.src = topbarImages.Premium.default);
        premiumButton.addEventListener('click', () => window.location.href = 'https://www.roblox.com/premium/membership');

        const robuxButton = document.createElement('button');
        robuxButton.style.width = '32px';
        robuxButton.style.height = '32px';
        robuxButton.style.padding = '0';
        robuxButton.style.border = 'none';
        robuxButton.style.backgroundColor = 'transparent';
        robuxButton.style.cursor = 'pointer';
        robuxButton.style.marginRight = '8px';
        robuxButton.style.marginLeft = '8px';
        robuxButton.style.position = 'relative';

        const robuxImg = document.createElement('img');
        robuxImg.src = topbarImages.Robux.default;
        robuxImg.style.width = '32px';
        robuxImg.style.height = '32px';
        robuxButton.appendChild(robuxImg);

        async function getRobuxBalance() {
            try {
                const response = await fetch('https://economy.roblox.com/v1/user/currency', {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    return data.robux;
                }
                return 0;
            } catch (error) {
                return 0;
            }
        }

        const robuxDropdown = document.createElement('div');
        robuxDropdown.style.position = 'absolute';
        robuxDropdown.style.top = '100%';
        robuxDropdown.style.left = '0';
        robuxDropdown.style.backgroundColor = 'white';
        robuxDropdown.style.border = '1px solid #ddd';
        robuxDropdown.style.borderRadius = '4px';
        robuxDropdown.style.display = 'none';
        robuxDropdown.style.zIndex = '999999';
        robuxDropdown.style.width = '120px';
        robuxDropdown.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        robuxDropdown.style.overflow = 'hidden';

        const robuxBalance = document.createElement('div');
        robuxBalance.style.padding = '8px';
        robuxBalance.style.borderBottom = '1px solid #ddd';
        robuxBalance.innerHTML = 'Loading...';

robuxBalance.addEventListener('click', () => {
    window.location.href = 'https://www.roblox.com/transactions';
});

        robuxBalance.addEventListener('mouseover', () => {
            robuxBalance.style.backgroundColor = 'rgb(242,242,242)';
            robuxBalance.style.borderLeft = '4px solid rgb(0,162,255)';
            robuxBalance.style.paddingLeft = '8px';
        });

        robuxBalance.addEventListener('mouseout', () => {
            robuxBalance.style.backgroundColor = '';
            robuxBalance.style.borderLeft = '';
            robuxBalance.style.paddingLeft = '12px';
        });

        getRobuxBalance().then(balance => {
            robuxBalance.innerHTML = `${balance.toLocaleString()} Robux`;
        });

        const buyRobux = document.createElement('a');
        buyRobux.href = 'https://www.roblox.com/upgrades/robux';
        buyRobux.style.display = 'block';
        buyRobux.style.padding = '8px';
        buyRobux.style.textDecoration = 'none';
        buyRobux.style.color = 'black';
        buyRobux.innerHTML = 'Buy Robux';

        buyRobux.addEventListener('mouseover', () => {
            buyRobux.style.backgroundColor = 'rgb(242,242,242)';
            buyRobux.style.borderLeft = '4px solid rgb(0,162,255)';
            buyRobux.style.paddingLeft = '8px';
        });

        buyRobux.addEventListener('mouseout', () => {
            buyRobux.style.backgroundColor = '';
            buyRobux.style.borderLeft = '';
            buyRobux.style.paddingLeft = '12px';
        });

        robuxButton.appendChild(robuxDropdown);
        robuxDropdown.appendChild(robuxBalance);
        robuxDropdown.appendChild(buyRobux);

        robuxButton.addEventListener('mouseover', () => robuxImg.src = topbarImages.Robux.hover);
        robuxButton.addEventListener('mouseout', () => robuxImg.src = topbarImages.Robux.default);

        robuxButton.addEventListener('click', (e) => {
            e.stopPropagation();
            robuxDropdown.style.display = robuxDropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', () => {
            robuxDropdown.style.display = 'none';
        });

        const searchTypeContainer = document.createElement('div');
        searchTypeContainer.style.position = 'absolute';
        searchTypeContainer.style.right = '4px';
        searchTypeContainer.style.top = '50%';
        searchTypeContainer.style.transform = 'translateY(-50%)';
        searchTypeContainer.style.display = 'flex';
        searchTypeContainer.style.alignItems = 'center';
        searchTypeContainer.style.gap = '4px';

        let currentType = 'Users';
        const types = ['Users', 'Experiences', 'Communities'];

        types.forEach(type => {
            const button = document.createElement('button');
            button.style.width = '26px';
            button.style.height = '26px';
            button.style.padding = '0';
            button.style.border = 'none';
            button.style.backgroundColor = 'transparent';
            button.style.cursor = 'pointer';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.title = type;

            const img = document.createElement('img');
            img.src = searchImages[type].default;
            img.style.width = '26px';
            img.style.height = '26px';
            img.style.opacity = type === currentType ? '1' : '0.5';

            button.appendChild(img);

            button.addEventListener('mouseover', () => img.src = searchImages[type].hover);
            button.addEventListener('mouseout', () => img.src = searchImages[type].default);


            button.addEventListener('click', () => {
                currentType = type;
                searchTypeContainer.querySelectorAll('img').forEach(image => {
                    image.style.opacity = '0.5';
                });
                img.style.opacity = '1';
            });

            searchTypeContainer.appendChild(button);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value;
                let searchUrl;

                switch(currentType) {
                    case 'Users':
                        searchUrl = `https://www.roblox.com/search/users?keyword=${encodeURIComponent(query)}`;
                        break;
                    case 'Experiences':
                        searchUrl = `https://www.roblox.com/discover?Keyword=${encodeURIComponent(query)}`;
                        break;
                    case 'Communities':
                        searchUrl = `https://www.roblox.com/search/groups?keyword=${encodeURIComponent(query)}`;
                        break;
                }

                if (searchUrl) {
                    window.location.href = searchUrl;
                }
            }
        });

const settingsButton = document.createElement('button');
settingsButton.style.width = '32px';
settingsButton.style.height = '32px';
settingsButton.style.padding = '0';
settingsButton.style.border = 'none';
settingsButton.style.backgroundColor = 'transparent';
settingsButton.style.cursor = 'pointer';
settingsButton.style.marginLeft = '8px';
settingsButton.style.marginRight = '4px';

const settingsImg = document.createElement('img');
settingsImg.src = topbarImages.Settings.default;
settingsImg.style.width = '32px';
settingsImg.style.height = '32px';
settingsButton.appendChild(settingsImg);

settingsButton.addEventListener('mouseover', () => settingsImg.src = topbarImages.Settings.hover);
settingsButton.addEventListener('mouseout', () => settingsImg.src = topbarImages.Settings.default);

const settingsDropdown = document.createElement('div');
settingsDropdown.style.position = 'absolute';
settingsDropdown.style.top = '100%';
settingsDropdown.style.right = '0';
settingsDropdown.style.backgroundColor = 'white';
settingsDropdown.style.border = '1px solid #ddd';
settingsDropdown.style.borderRadius = '4px';
settingsDropdown.style.display = 'none';
settingsDropdown.style.zIndex = '999999';
settingsDropdown.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
settingsDropdown.style.overflow = 'hidden';

const settingsLink = document.createElement('a');
settingsLink.href = 'https://www.roblox.com/my/account';
settingsLink.innerHTML = 'Settings';
settingsLink.style.display = 'block';
settingsLink.style.padding = '8px';
settingsLink.style.textDecoration = 'none';
settingsLink.style.color = 'black';
settingsLink.style.borderBottom = '1px solid #ddd';

const helpLink = document.createElement('a');
helpLink.href = 'https://www.roblox.com/help-safety';
helpLink.innerHTML = 'Help & Safety';
helpLink.style.display = 'block';
helpLink.style.padding = '8px';
helpLink.style.textDecoration = 'none';
helpLink.style.color = 'black';
helpLink.style.borderBottom = '1px solid #ddd';

const logoutLink = document.createElement('a');
logoutLink.innerHTML = 'Log Out';
logoutLink.style.display = 'block';
logoutLink.style.padding = '8px';
logoutLink.style.textDecoration = 'none';
logoutLink.style.color = 'black';
logoutLink.addEventListener('click', () => {
    const robloxCookies = ['ROBLOSECURITY', 'other_cookie_name'];
    robloxCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=;expires=${new Date(0).toUTCString()};path=/;domain=.roblox.com`;
    });
     location.reload();
 });

settingsButton.appendChild(settingsDropdown);

settingsLink.addEventListener('mouseover', () => {
    settingsLink.style.backgroundColor = 'rgb(242,242,242)';
    settingsLink.style.borderLeft = '4px solid rgb(0,162,255)';
    settingsLink.style.paddingLeft = '8px';
});

settingsLink.addEventListener('mouseout', () => {
    settingsLink.style.backgroundColor = '';
    settingsLink.style.borderLeft = '';
    settingsLink.style.paddingLeft = '12px';
});

helpLink.addEventListener('mouseover', () => {
    helpLink.style.backgroundColor = 'rgb(242,242,242)';
    helpLink.style.borderLeft = '4px solid rgb(0,162,255)';
    helpLink.style.paddingLeft = '8px';
});

helpLink.addEventListener('mouseout', () => {
    helpLink.style.backgroundColor = '';
    helpLink.style.borderLeft = '';
    helpLink.style.paddingLeft = '12px';
});

logoutLink.addEventListener('mouseover', () => {
    logoutLink.style.backgroundColor = 'rgb(242,242,242)';
    logoutLink.style.borderLeft = '4px solid rgb(0,162,255)';
    logoutLink.style.paddingLeft = '8px';
});

logoutLink.addEventListener('mouseout', () => {
    logoutLink.style.backgroundColor = '';
    logoutLink.style.borderLeft = '';
    logoutLink.style.paddingLeft = '12px';
});

 settingsButton.addEventListener('click', (e) => {
     e.stopPropagation();
     settingsDropdown.style.display = settingsDropdown.style.display === 'none' ? 'block' : 'none';
 });

 document.addEventListener('click', () => {
     settingsDropdown.style.display = 'none';
 });

 settingsDropdown.appendChild(settingsLink);
 settingsDropdown.appendChild(helpLink);
 settingsDropdown.appendChild(logoutLink);

if (studioButtonEnabled) {
    const studioButtonImages = {
        default: 'data:image/png;base64,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',
        hover: 'data:image/png;base64,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'
    };

    const studioButton = document.createElement('button');
    studioButton.style.width = '100%';
    studioButton.style.height = '56px';
    studioButton.style.color = 'white';
    studioButton.style.backgroundColor = 'transparent';
    studioButton.style.border = 'none';
    studioButton.style.textAlign = 'center';
    studioButton.style.cursor = 'pointer';
    studioButton.style.fontSize = '10px';
    studioButton.style.position = 'relative';
    studioButton.style.display = 'flex';
    studioButton.style.flexDirection = 'column';
    studioButton.style.alignItems = 'center';
    studioButton.style.justifyContent = 'center';

    const studioImg = document.createElement('img');
    studioImg.src = studioButtonImages.default;
    studioImg.style.width = '26px';
    studioImg.style.height = '26px';
    studioButton.appendChild(studioImg);

    studioButton.addEventListener('mouseover', () => studioImg.src = studioButtonImages.hover);
    studioButton.addEventListener('mouseout', () => studioImg.src = studioButtonImages.default);

    studioButton.addEventListener('click', () => {
        window.location.href = 'roblox-studio://';
    });

    const studioLabel = document.createElement('div');
    studioLabel.innerText = 'Studio';
    studioLabel.style.fontSize = '10px';
    studioLabel.style.marginTop = '4px';
    studioButton.appendChild(studioLabel);
    sidebar.appendChild(studioButton);
}
if (iconsOnRight) {
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchTypeContainer);
    topbar.appendChild(searchContainer);
    topbar.appendChild(robuxButton);
    topbar.appendChild(premiumButton);
    topbar.appendChild(settingsButton);
} else {
    topbar.appendChild(premiumButton);
    topbar.appendChild(robuxButton);
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchTypeContainer);
    topbar.appendChild(searchContainer);
    topbar.appendChild(settingsButton);
}

document.body.appendChild(sidebar);

        document.body.appendChild(sidebar);
        document.body.appendChild(topbar);

        document.body.style.marginLeft = '62px';
        document.body.style.marginTop = '48px';
        document.body.style.width = 'calc(100% - 62px)';
        document.body.style.overflow = 'auto';

        const pageContent = document.querySelector('.content-wrapper');
        if (pageContent) {
            pageContent.style.marginLeft = '62px';
            pageContent.style.marginTop = '48px';
            pageContent.style.width = 'calc(100% - 62px)';
        }

        const containers = document.querySelectorAll('.container-main, .container, .content');
        containers.forEach(container => {
            container.style.width = '100%';
            container.style.maxWidth = 'calc(100% - 20px)';
            container.style.boxSizing = 'border-box';
        });
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

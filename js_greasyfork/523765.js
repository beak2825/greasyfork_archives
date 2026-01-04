// ==UserScript==
// @name         Export wordpress list from plesk
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Export wordpress list from plesk into csv
// @author       LionelEtMorgan
// @match        *://djmdigital.be/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523765/Export%20wordpress%20list%20from%20plesk.user.js
// @updateURL https://update.greasyfork.org/scripts/523765/Export%20wordpress%20list%20from%20plesk.meta.js
// ==/UserScript==


// Fonction principale pour récupérer les données et les exporter en CSV
async function fetchAllDataAndExportCSV() {
    try {
        const installations = await fetchInstallations();
        const allData = await Promise.all(installations.map(async installation => {
            const plugins = await fetchPluginsById(installation.id);
            const themes = await fetchThemesById(installation.id);

            return {
                domainName: installation.domainName,
                version: installation.version,
                phpHandlerName: installation.phpHandlerName,
                plugins: plugins.reduce((acc, plugin) => ({ ...acc, [plugin.title]: plugin.version }), {}),
                themes: themes.reduce((acc, theme) => ({ ...acc, [theme.title]: theme.version }), {})
            };
        }));
        console.log(allData);

        exportToCSV(allData);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

// Fonction pour récupérer les installations
async function fetchInstallations() {
    const response = await fetch('https://*****/modules/wp-toolkit/index.php/v1/installations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Ajoutez d'autres en-têtes nécessaires, comme l'authentification, si besoin
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.map(item => ({
        id: item.id,
        domainName: item.domain.name,
        version: item.version,
        phpHandlerName: item.features.php.handler.name
    }));
}

// Fonction pour exporter les données en CSV
function exportToCSV(data) {
    const headers = ['Domain Name', 'WordPress Version', 'PHP Handler', ...getUniqueKeys(data, 'plugins'), ...getUniqueKeys(data, 'themes')];
    //debugger
    const csvData = data.map(item => {
        const row = {
            'Domain Name': item.domainName,
            'WordPress Version': item.version,
            'PHP Handler': item.phpHandlerName,
        };
        headers.forEach(header => {
            if (row[header] !== undefined) {
                return
            }
            if (header in item.plugins) {
                row[header] = item.plugins[header];
            } else if (header in item.themes) {
                row[header] = item.themes[header];
            } else {
                row[header] = '';
            }
        });

        return row;
    });

    const csvContent = [headers.join(';'), ...csvData.map(row => headers.map(header => row[header]).join(';'))].join('\n');

    // Créer un lien pour télécharger le fichier CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wordpress_installations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fonction pour obtenir tous les plugins ou thèmes uniques
function getUniqueKeys(data, key) {
    const keys = new Set();
    data.forEach(item => {
        Object.keys(item[key]).forEach(k => keys.add(k));
    });
    return Array.from(keys);
}

// Lancer la récupération et l'exportation
fetchAllDataAndExportCSV();

function fetchPluginsById(installationId) {
    const url = `https://******/modules/wp-toolkit/index.php/v1/installations/${installationId}/plugins`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Ajoutez d'autres en-têtes nécessaires, comme l'authentification, si besoin
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Transformez les données pour ne garder que le titre et la version de chaque plugin
        const pluginsData = data.map(plugin => ({
            title: plugin.title,
            version: plugin.version
        }));
        
        // console.log(pluginsData);
        return pluginsData;
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des plugins:', error);
        throw error; // Propager l'erreur pour que l'appelant puisse aussi la gérer
    });
}

    function fetchThemesById(installationId) {
        const url = `https://******/modules/wp-toolkit/index.php/v1/installations/${installationId}/themes`;
    
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Ajoutez d'autres en-têtes nécessaires, comme l'authentification, si besoin
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Transformez les données pour ne garder que le titre et la version de chaque thème
            const themesData = data.map(theme => ({
                title: theme.title,
                version: theme.version
            }));
            
            // console.log(themesData);
            return themesData;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des thèmes:', error);
            throw error; // Propager l'erreur pour que l'appelant puisse aussi la gérer
        });
    }
    
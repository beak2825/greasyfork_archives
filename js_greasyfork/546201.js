// ==UserScript==
// @name         Drawaria Data Library
// @namespace    drawaria-toolkit
// @version      1.0
// @description  Biblioteca de datos completa para userscripts de Drawaria
// @author       DrawariaBot-Developer
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // DATOS CONVERTIDOS
    const DRAWARIA_COMMANDS = [
        {
            id: 1,
            name: "votetrack",
            description: "Votar por Pista de Música",
            params: ["trackid"],
            usage: "clientcmd, 1, [trackid]",
            category: "music"
        },
        {
            id: 101,
            name: "spawnavatar",
            description: "Generar Avatar",
            params: [],
            usage: "clientcmd, 101",
            category: "avatar"
        },
        {
            id: 321,
            name: "trackforwardvoting",
            description: "Votar para Adelantar Ronda",
            params: [],
            usage: "clientcmd, 321",
            category: "voting"
        },
        {
            id: 320,
            name: "startrollbackvoting",
            description: "Iniciar Votación para Revertir Lienzo",
            params: [],
            usage: "clientcmd, 320",
            category: "voting"
        },
        {
            id: 3,
            name: "setstatusflag",
            description: "Establecer Bandera de Estado",
            params: ["flagid", "isactive"],
            usage: "clientcmd, 3, [flagid, isactive]",
            category: "status"
        },
        {
            id: 10,
            name: "getinventory",
            description: "Obtener Inventario",
            params: ["true"],
            usage: "clientcmd, 10, [true]",
            category: "inventory"
        },
        {
            id: 11,
            name: "buyitem",
            description: "Comprar Ítem",
            params: ["itemid"],
            usage: "clientcmd, 11, [itemid]",
            category: "inventory"
        },
        {
            id: 12,
            name: "activateitem",
            description: "Activar/Desactivar Ítem",
            params: ["itemid", "isactive"],
            usage: "clientcmd, 12, [itemid, isactive]",
            category: "inventory"
        },
        {
            id: 115,
            name: "setavatarprop",
            description: "Cambiar Propiedad de Avatar",
            params: [],
            usage: "clientcmd, 115",
            category: "avatar"
        },
        {
            id: 102,
            name: "getspawnsstate",
            description: "Obtener Estado de Avatares Generados",
            params: [],
            usage: "clientcmd, 102",
            category: "avatar"
        },
        {
            id: 103,
            name: "moveavatar",
            description: "Mover Avatar",
            params: ["packedPosition", "isTeleport"],
            usage: "clientcmd, 103, [packedPosition, isTeleport]",
            category: "avatar"
        },
        {
            id: 230,
            name: "canvasobj_setposition",
            description: "Establecer Posición de Objeto en Lienzo",
            params: ["itemid", "positionX", "positionY", "options"],
            usage: "clientcmd, 230, [itemid, positionX, positionY, options]",
            category: "canvas"
        },
        {
            id: 231,
            name: "canvasobj_setrotation",
            description: "Establecer Rotación de Objeto en Lienzo",
            params: ["itemid", "rotation"],
            usage: "clientcmd, 231, [itemid, rotation]",
            category: "canvas"
        },
        {
            id: 232,
            name: "canvasobj_remove",
            description: "Eliminar Objeto de Lienzo",
            params: ["itemid"],
            usage: "clientcmd, 232, [itemid]",
            category: "canvas"
        },
        {
            id: 233,
            name: "canvasobj_getobjects",
            description: "Obtener Objetos de Lienzo",
            params: [],
            usage: "clientcmd, 233",
            category: "canvas"
        },
        {
            id: 234,
            name: "canvasobj_changeattr",
            description: "Cambiar Atributo de Objeto en Lienzo",
            params: ["itemid", "target", "value"],
            usage: "clientcmd, 234, [itemid, target, value]",
            category: "canvas"
        },
        {
            id: 301,
            name: "customvoting_setvote",
            description: "Emitir Voto Personalizado",
            params: ["value"],
            usage: "clientcmd, 301, [value]",
            category: "voting"
        },
        {
            id: 901,
            name: "getfpid",
            description: "Obtener FPID",
            params: ["value"],
            usage: "clientcmd, 901, [value]",
            category: "system"
        },
        {
            id: 330,
            name: "snapchatmessage",
            description: "Enviar Mensaje Temporal",
            params: ["playerid", "value"],
            usage: "clientcmd, 330, [playerid, value]",
            category: "communication"
        },
        {
            id: 2,
            name: "settoken",
            description: "Otorgar Emblema/Token",
            params: ["playerid", "tokenid"],
            usage: "clientcmd, 2, [playerid, tokenid]",
            category: "social"
        }
    ];

    const DRAWARIA_API_FUNCTIONS = [
        "chatmsg", "passturn", "pgdrawvote", "pgswtichroom", "playerafk", 
        "playerrated", "sendgesture", "sendvote", "sendvotekick", "wordselected",
        "activateitem", "buyitem", "canvasobj_changeattr", "canvasobj_getobjects",
        "canvasobj_remove", "canvasobj_setposition", "canvasobj_setrotation",
        "customvoting_setvote", "getfpid", "getinventory", "getspawnsstate",
        "moveavatar", "setavatarprop", "setstatusflag", "settoken",
        "snapchatmessage", "spawnavatar", "startrollbackvoting", 
        "trackforwardvoting", "votetrack", "startplay", "requestcanvas",
        "respondcanvas", "galleryupload", "warning", "mute", "hide",
        "report", "line", "erase", "flood", "undo", "clear"
    ];

    const DRAWARIA_LINKS = [
        'https://discord.gg/XeVKWWs', 'mailto:reesoglifglalriksa@gmail.com', 
        'https://drawaria.online/', '/avatar/builder/', '/scoreboards/', 
        '/gallery/', '/auth/google', '/auth/facebook', '/auth/discord', 
        '/auth/reddit', '/auth/vk', '/login', 
        'https://play.google.com/store/apps/details?id=com.gmail.at.ixevixe.cordovaapp',
        'https://discord.gg/team-megu', 'https://erisly.com/', 
        'https://www.youtube.com/watch?v=-dWnF9kVELE', '/event',
        'https://twitter.com/intent/tweet?text=Amazing%20online%20drawing%20game&url=https%3A%2F%2Fdrawaria.online&hashtags=drawaria',
        'https://igroutka.net/', 'http://www.obfog.com/', 
        'https://iogames.live/aquapark-io/', 'https://www.crazygames.com/c/io',
        'https://www.silvergames.com/en/t/drawing', 'http://www.era-igr.ru',
        'http://brogames.space', 'https://gamasexual.com/', 
        'https://www.miniplay.com/', 'https://multoigri.ru',
        'https://gaminguides.com', 'https://moar.games', 
        'https://www.freegames.com/', 'https://iogames.space',
        'http://io-games.zone', '/links', '/privacy', '/terms',
        'https://drawaria.online/rules', '/palettes/'
    ];

    const ALL_DATA = {
        commands: DRAWARIA_COMMANDS,
        functions: DRAWARIA_API_FUNCTIONS,
        links: DRAWARIA_LINKS
    };

    // FUNCIONES DE UTILIDAD
    window.LIBRERIA_DATOS = {
        /**
         * Obtiene todos los datos disponibles
         * @returns {Object} Objeto con todos los datos organizados
         */
        getData: function() {
            try {
                return JSON.parse(JSON.stringify(ALL_DATA));
            } catch (error) {
                console.error('Error al obtener datos:', error);
                return null;
            }
        },

        /**
         * Filtra y busca en los datos usando una función de filtro o regex
         * @param {Function|RegExp|string} filter - Función de filtro, regex o string de búsqueda
         * @param {string} dataType - Tipo de datos: 'commands', 'functions', 'links', 'all'
         * @returns {Array} Array filtrado
         */
        parseData: function(filter, dataType = 'all') {
            try {
                let targetData = [];
                
                if (dataType === 'all') {
                    targetData = [...DRAWARIA_COMMANDS, ...DRAWARIA_API_FUNCTIONS, ...DRAWARIA_LINKS];
                } else if (dataType === 'commands') {
                    targetData = DRAWARIA_COMMANDS;
                } else if (dataType === 'functions') {
                    targetData = DRAWARIA_API_FUNCTIONS;
                } else if (dataType === 'links') {
                    targetData = DRAWARIA_LINKS;
                }

                if (typeof filter === 'function') {
                    return targetData.filter(filter);
                } else if (filter instanceof RegExp) {
                    return targetData.filter(item => {
                        const searchString = typeof item === 'string' ? item : JSON.stringify(item);
                        return filter.test(searchString);
                    });
                } else if (typeof filter === 'string') {
                    return targetData.filter(item => {
                        const searchString = typeof item === 'string' ? item : JSON.stringify(item);
                        return searchString.toLowerCase().includes(filter.toLowerCase());
                    });
                }
                
                return targetData;
            } catch (error) {
                console.error('Error al filtrar datos:', error);
                return [];
            }
        },

        /**
         * Obtiene un elemento aleatorio de los datos
         * @param {string} dataType - Tipo de datos: 'commands', 'functions', 'links'
         * @returns {*} Elemento aleatorio
         */
        getRandomItem: function(dataType = 'commands') {
            try {
                let targetData = [];
                
                switch(dataType) {
                    case 'commands':
                        targetData = DRAWARIA_COMMANDS;
                        break;
                    case 'functions':
                        targetData = DRAWARIA_API_FUNCTIONS;
                        break;
                    case 'links':
                        targetData = DRAWARIA_LINKS;
                        break;
                    default:
                        targetData = DRAWARIA_COMMANDS;
                }

                if (targetData.length === 0) return null;
                
                const randomIndex = Math.floor(Math.random() * targetData.length);
                return targetData[randomIndex];
            } catch (error) {
                console.error('Error al obtener elemento aleatorio:', error);
                return null;
            }
        },

        /**
         * Busca un comando por su ID
         * @param {number} id - ID del comando a buscar
         * @returns {Object|null} Comando encontrado o null
         */
        findById: function(id) {
            try {
                const command = DRAWARIA_COMMANDS.find(cmd => cmd.id === parseInt(id));
                return command || null;
            } catch (error) {
                console.error('Error al buscar por ID:', error);
                return null;
            }
        },

        /**
         * Busca comandos por categoría
         * @param {string} category - Categoría a buscar
         * @returns {Array} Array de comandos de la categoría
         */
        findByCategory: function(category) {
            try {
                return DRAWARIA_COMMANDS.filter(cmd => 
                    cmd.category && cmd.category.toLowerCase() === category.toLowerCase()
                );
            } catch (error) {
                console.error('Error al buscar por categoría:', error);
                return [];
            }
        },

        /**
         * Obtiene estadísticas de los datos
         * @returns {Object} Objeto con estadísticas
         */
        getStats: function() {
            try {
                return {
                    totalCommands: DRAWARIA_COMMANDS.length,
                    totalFunctions: DRAWARIA_API_FUNCTIONS.length,
                    totalLinks: DRAWARIA_LINKS.length,
                    categories: [...new Set(DRAWARIA_COMMANDS.map(cmd => cmd.category))],
                    commandsByCategory: DRAWARIA_COMMANDS.reduce((acc, cmd) => {
                        if (cmd.category) {
                            acc[cmd.category] = (acc[cmd.category] || 0) + 1;
                        }
                        return acc;
                    }, {})
                };
            } catch (error) {
                console.error('Error al obtener estadísticas:', error);
                return {};
            }
        }
    };
    
    // Hacer datos disponibles globalmente
    window.DATA_ARRAY = ALL_DATA;
    window.DRAWARIA_COMMANDS = DRAWARIA_COMMANDS;
    window.DRAWARIA_API_FUNCTIONS = DRAWARIA_API_FUNCTIONS;
    window.DRAWARIA_LINKS = DRAWARIA_LINKS;
    
    // Validación de datos
    try {
        JSON.stringify(ALL_DATA);
        console.log('📚 Biblioteca de datos de Drawaria cargada exitosamente:', {
            comandos: DRAWARIA_COMMANDS.length,
            funciones: DRAWARIA_API_FUNCTIONS.length,
            enlaces: DRAWARIA_LINKS.length
        });
    } catch (error) {
        console.error('❌ Error al validar datos de la biblioteca:', error);
    }
    
})();

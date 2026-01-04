// ==UserScript==
// @name         Export as Trainertext
// @namespace    https://pokepast.es/
// @version      2025-08-28
// @license      MIT
// @description  Add an export as trainertext button to pokepastes
// @author       wiresegal
// @match        https://pokepast.es/*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547490/Export%20as%20Trainertext.user.js
// @updateURL https://update.greasyfork.org/scripts/547490/Export%20as%20Trainertext.meta.js
// ==/UserScript==



(function() {
    'use strict';
    // THIS IS https://unpkg.com/koffing@1.0.0/dist/index.mjs, without the export message!
    // CSP issues meant this didn't work on chrome with a dynamic import, so here we are!

    // src/Pokemon.ts
    var POKEMON_STAT_NAMES = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
    var Pokemon = class {
        constructor() {
            this.moves = [];
        }
        static fromObject(obj) {
            const p = new Pokemon();
            p.name = obj.name;
            p.nickname = obj.nickname;
            p.gender = obj.gender;
            p.item = obj.item;
            p.ability = obj.ability;
            p.level = obj.level;
            p.shiny = obj.shiny;
            p.happiness = obj.happiness;
            p.nature = obj.nature;
            p.evs = obj.evs;
            p.ivs = obj.ivs;
            p.teraType = obj.teraType;
            p.dynamaxLevel = obj.dynamaxLevel;
            p.gigantamax = obj.gigantamax;
            p.pokeball = obj.pokeball;
            p.moves = Array.isArray(obj.moves) ? obj.moves : [];
            return p;
        }
        toJson(indentation = 2) {
            return JSON.stringify(this, null, indentation);
        }
        toShowdown() {
            let str = "";
            if (this.nickname) {
                str += `${this.nickname} (${this.name})`;
            } else {
                str += `${this.name}`;
            }
            if (this.gender && this.gender.match(/^[MF]$/i)) {
                str += ` (${this.gender.toUpperCase()})`;
            }
            if (this.item) {
                str += ` @ ${this.item}`;
            }
            str += "\n";
            if (this.ability) {
                str += `Ability: ${this.ability}
`;
            }
            if (!Number.isNaN(this.level)) {
                str += `Level: ${this.level}
`;
            }
            if (this.shiny === true) {
                str += `Shiny: Yes
`;
            }
            if (!Number.isNaN(this.happiness)) {
                str += `Happiness: ${this.happiness}
`;
            }
            if (this.pokeball) {
                str += `Pokeball: ${this.pokeball}
`;
            }
            if (!Number.isNaN(this.dynamaxLevel)) {
                str += `Dynamax Level: ${this.dynamaxLevel}
`;
            }
            if (this.gigantamax === true) {
                str += `Gigantamax: Yes
`;
            }
            if (this.teraType) {
                str += `Tera Type: ${this.teraType}
`;
            }
            if (this.evs) {
                const evs = this.evs;
                str += `EVs: ` + POKEMON_STAT_NAMES.filter(function(prop) {
                    return !isNaN(evs[prop.toLowerCase()]);
                }).map(function(prop) {
                    const val = evs[prop.toLowerCase()];
                    return `${val} ${prop}`;
                }).join(" / ") + "\n";
            }
            if (this.nature) {
                str += `${this.nature} Nature
`;
            }
            if (this.ivs) {
                const ivs = this.ivs;
                str += `IVs: ` + POKEMON_STAT_NAMES.filter(function(prop) {
                    return !isNaN(ivs[prop.toLowerCase()]);
                }).map(function(prop) {
                    const val = ivs[prop.toLowerCase()];
                    return `${val} ${prop}`;
                }).join(" / ") + "\n";
            }
            if (this.moves) {
                str += this.moves.map(function(move) {
                    return `- ${move}`;
                }).join("\n") + "\n";
            }
            return str.trim();
        }
        toString() {
            return this.toShowdown();
        }
    };

    // src/PokemonTeam.ts
    var PokemonTeam = class {
        constructor(format = "gen9", name = "Untitled", folder = void 0) {
            this.pokemon = [];
            this.name = name;
            this.format = format;
            this.folder = folder;
        }
        static fromObject(obj) {
            const team = new PokemonTeam();
            team.name = obj.name;
            team.format = obj.format;
            team.folder = obj.folder;
            team.pokemon = obj.pokemon ? obj.pokemon.map(function(pokemon) {
                return Pokemon.fromObject(pokemon);
            }) : [];
            return team;
        }
        toJson(indentation = 2) {
            return JSON.stringify(this, null, indentation);
        }
        toShowdown() {
            const name = this.folder ? `${this.folder}/${this.name}` : this.name;
            let str = `=== [${this.format}] ${name} ===

`;
            str += this.pokemon.map(function(p) {
                return p.toString();
            }).join("\n\n");
            return str.trim();
        }
        toString() {
            return this.toShowdown();
        }
    };

    // src/PokemonTeamSet.ts
    var PokemonTeamSet = class {
        constructor(teams = []) {
            this.teams = teams;
        }
        static fromObject(obj) {
            const teamSet = new PokemonTeamSet();
            teamSet.teams = obj.teams ? obj.teams.map(function(team) {
                return PokemonTeam.fromObject(team);
            }) : [];
            return teamSet;
        }
        toJson(indentation = 2) {
            return JSON.stringify(this, null, indentation);
        }
        toShowdown() {
            return this.teams.map(function(p) {
                return p.toString();
            }).join("\n\n").trim();
        }
        toString() {
            return this.toShowdown();
        }
    };

    // src/ShowdownParser.ts
    var clamp = (num, min, max) => {
        if (Number.isNaN(num)) {
            return min;
        }
        return Math.min(Math.max(num, min), max);
    };
    var _ShowdownParser = class {
        constructor(code) {
            this.code = code.toString().trim();
        }
        parse() {
            const regexes = _ShowdownParser.regexes;
            const teams = [];
            const current = {
                team: null,
                pokemon: null
            };
            const lines = this.code.trim().split("\n").map(function(line) {
                return line.trim();
            });
            lines.forEach((line) => {
                if (line.match(regexes.team)) {
                    current.team = new PokemonTeam();
                    this._parseTeam(line, current.team);
                    teams.push(current.team);
                    return;
                }
                if (line === "" || line.match(/^[- ]+$/)) {
                    this._saveCurrent(teams, current);
                    return;
                }
                if (!current.pokemon) {
                    current.pokemon = new Pokemon();
                    this._parseNameLine(line, current.pokemon);
                    return;
                }
                if (this._parseKeyValuePairs(line, current.pokemon)) {
                    return;
                }
                if (this._parseEvsIvs(line, current.pokemon)) {
                    return;
                }
                if (current.pokemon.moves.length < 4 && line.match(regexes.move)) {
                    const moveMatches = regexes.move.exec(line);
                    if (moveMatches !== null) {
                        current.pokemon.moves.push(moveMatches[1].trim());
                    }
                }
            });
            this._saveCurrent(teams, current);
            return new PokemonTeamSet(teams);
        }
        _parseTeam(line, team) {
            const rg = _ShowdownParser.regexes;
            const teamDataMatches = rg.team.exec(line);
            if (teamDataMatches && teamDataMatches.length >= 2) {
                const teamNames = teamDataMatches[2].split("/");
                let teamName, teamFolder;
                if (teamNames.length > 1) {
                    teamFolder = teamNames.shift();
                    teamName = teamNames.join("/");
                } else {
                    teamName = teamDataMatches[2];
                }
                team.format = teamDataMatches[1].trim();
                team.name = teamName.trim();
                team.folder = teamFolder ? teamFolder.trim() : void 0;
            }
        }
        _parseNameLine(line, pokemon) {
            const rg = _ShowdownParser.regexes;
            if (line.match(rg.nickname_name)) {
                const nameMatches = rg.nickname_name.exec(line);
                if (nameMatches) {
                    pokemon.nickname = nameMatches[1].trim();
                    pokemon.name = nameMatches[2].trim();
                }
            } else if (line.match(rg.name)) {
                const nameMatches = rg.name.exec(line);
                if (nameMatches) {
                    pokemon.name = nameMatches[1].trim();
                }
            }
            if (line.match(rg.gender)) {
                const genderMatches = rg.gender.exec(line);
                if (genderMatches) {
                    pokemon.gender = genderMatches[1].toUpperCase().trim();
                }
            }
            if (line.match(rg.item)) {
                const itemMatches = rg.item.exec(line);
                if (itemMatches) {
                    pokemon.item = itemMatches[1].trim();
                }
            }
        }
        _parseEvsIvs(line, pokemon) {
            const rg = _ShowdownParser.regexes;
            if (line.match(rg.eivs)) {
                const data = rg.eivs.exec(line);
                if (data === null) {
                    return false;
                }
                const prop = data[1].toLowerCase();
                const values = data[2].split("/");
                const limit = prop === "evs" ? 255 : 31;
                values.forEach(function(stat) {
                    const statData = rg.eivs_value.exec(stat.trim().toLowerCase());
                    if (!statData) {
                        console.error("Invalid syntax for " + prop + ": " + stat);
                        return;
                    }
                    if (!pokemon[prop]) {
                        pokemon[prop] = {};
                    }
                    pokemon[prop][statData[2]] = clamp(parseInt(statData[1]), 0, limit);
                });
                return true;
            }
            return false;
        }
        _parseKeyValuePairs(line, pokemon) {
            const propNames = [
                "nature",
                "ability",
                "level",
                "shiny",
                "happiness",
                "pokeball",
                "dynamaxLevel",
                "gigantamax",
                "teraType"
            ];
            return propNames.some(function(key) {
                const matches = _ShowdownParser.regexes[key].exec(line);
                if (matches === null) {
                    return false;
                }
                let value = matches[1].trim();
                if (key === "happiness") {
                    value = clamp(parseInt(value), 0, 255);
                } else if (key === "level") {
                    value = clamp(parseInt(value), 1, 100);
                } else if (key === "dynamaxLevel") {
                    value = clamp(parseInt(value), 0, 10);
                } else if (key.match(/^(shiny|gigantamax)$/i)) {
                    value = value.match(/yes/i) !== null ? true : void 0;
                }
                pokemon[key] = value;
                return true;
            });
        }
        _saveCurrent(teams, current) {
            if (!current.team) {
                current.team = new PokemonTeam();
                teams.push(current.team);
            }
            if (current.pokemon) {
                current.team.pokemon.push(current.pokemon);
                current.pokemon = null;
            }
            return this;
        }
        format() {
            this.code = this.parse().toString();
            return this;
        }
        toString() {
            return this.code;
        }
    };
    var ShowdownParser = _ShowdownParser;
    ShowdownParser.regexes = {
        team: /^===\s+\[(.*)\]\s+(.*)\s+===$/,
        nickname_name: /^([^()=@]*)\s+\(([^()=@]{2,})\)/i,
        name: /^([^()=@]{2,})/i,
        gender: /\((F|M)\)/i,
        item: /@\s?(.*)$/i,
        eivs: /^([EI]Vs):\s?(.*)$/i,
        eivs_value: /^([0-9]+)\s+(hp|atk|def|spa|spd|spe)$/i,
        move: /^[-~]\s?(.*)$/i,
        nature: /^(.*)\s+Nature$/,
        ability: /^(?:Ability|Trait):\s?(.*)$/i,
        level: /^Level:\s?([0-9]{1,3})$/i,
        shiny: /^Shiny:\s?(Yes|No)$/i,
        happiness: /^(?:Happiness|Friendship):\s?([0-9]{1,3})$/i,
        pokeball: /^(?:Pokeball|Ball):\s?(.*)$/i,
        dynamaxLevel: /^Dynamax Level:\s?([0-9]{1,2})$/i,
        gigantamax: /^Gigantamax:\s?(Yes|No)$/i,
        teraType: /^Tera Type:\s?(.*)$/i
    };

    // src/Koffing.ts
    var Koffing = class {
        static parse(data) {
            if (data instanceof PokemonTeamSet || data instanceof PokemonTeam || data instanceof Pokemon) {
                return data;
            }
            if (data instanceof ShowdownParser) {
                return data.parse();
            }
            return new ShowdownParser(data).parse();
        }
        static format(data) {
            return this.parse(data).toShowdown();
        }
        static toJson(data) {
            return this.parse(data).toJson();
        }
        static toShowdown(data) {
            if (data instanceof PokemonTeamSet || data instanceof PokemonTeam || data instanceof Pokemon) {
                return data.toShowdown();
            }
            if (data instanceof ShowdownParser) {
                return data.parse().toShowdown();
            }
            if (typeof data === "string") {
                data = JSON.parse(data);
            }
            return PokemonTeamSet.fromObject(data).toShowdown();
        }
    };

    // Begin actual plugin code

    GM_addElement(GM_addElement(document.getElementsByTagName('aside')[0], 'p'), 'button', {
        textContent: "Export to Trainertext"
    }).addEventListener("click", function (ev) {
        GM_xmlhttpRequest({
            url: window.location + '/raw',
            onload: async res => {
                const koff = Koffing.parse(res.responseText);
                const teams = [];
                koff.teams.forEach(teamraw => {
                    let ttx = '{\n' +
                        ':teamid => ["Dummy",:TCLASS,id],\n' +
                        ':defeat => "Dummy text",\n' +
                        ':mons => [';
                    const mons = [];
                    teamraw.pokemon.forEach(monraw => {
                        let form = 0;
                        let formmatch = monraw.name.match(/(?<species>.*)-(Aevium|Alola|Paldea|Galar|Hisui)$/);
                        if (formmatch) {
                            form = 1;
                            monraw.name = formmatch.groups.species;
                        }
                        let mtx = '{\n' +
                            '    :species => :' + monraw.name.replaceAll(/\W/g, '').toUpperCase() + ',\n';
                        if (monraw.nickname) {
                            '    :name => ' + JSON.stringify(monraw.nickname) + ',\n';
                        }
                        mtx += '    :level => ' + monraw.level + ',\n';
                        if (monraw.item) {
                            mtx += '    :item => :' + monraw.item.replaceAll(/\W/g, '').toUpperCase() + ',\n';
                        }
                        let moves = []
                        monraw.moves.forEach(moveraw => {
                            moves.push(':' + moveraw.replaceAll(/\W/g, '').toUpperCase());
                        });
                        mtx += '    :moves => [' + moves.join(',') + '],\n';
                        mtx += '    :ability => :' + monraw.ability.replaceAll(/\W/g, '').toUpperCase() + ',\n';
                        if (monraw.gender) {
                            mtx += '    :gender => "' + monraw.gender + '",\n';
                        }
                        if (monraw.shiny) {
                            mtx += '    :shiny => true,\n';
                        }
                        if (form > 0) {
                            mtx += '    :form => ' + form + ',\n';
                        }
                        mtx += '    :nature => :' + monraw.nature.toUpperCase() + ',\n';
                        if (monraw.ivs && monraw.ivs.spe === 0) {
                            mtx += '    :iv => 32,\n';
                        } else {
                            mtx += '    :iv => 31,\n';
                        }
                        let evs = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'].map(key => {
                            if (monraw.evs && monraw.evs[key]) {
                                return monraw.evs[key]
                            } else {
                                return 0
                            }
                        });
                        mtx += '    :ev => [' + evs.join(', ') + ']}';
                        mons.push(mtx);
                    });
                    ttx += mons.join(',\n') + ']},\n';
                    teams.push(ttx);
                });
                GM_setClipboard(teams.join(''), 'text')
            }
        });
    });
})();
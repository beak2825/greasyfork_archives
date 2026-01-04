// ==UserScript==
// @name         Seriesfeed Transporter
// @namespace    https://www.seriesfeed.com
// @version      1.0.2
// @description  Import and export your favourites and time wasted on Seriesfeed.com.
// @match        https://*.seriesfeed.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      www.bierdopje.com
// @connect      www.imdb.com
// @domain       www.bierdopje.com
// @domain       www.imdb.com
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @author       Tom
// @copyright    2017 - 2020, Tom
// @downloadURL https://update.greasyfork.org/scripts/35407/Seriesfeed%20Transporter.user.js
// @updateURL https://update.greasyfork.org/scripts/35407/Seriesfeed%20Transporter.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $, GM_xmlhttpRequest, Promise, console */
'use strict';

var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    class App {
        static main() {
            $(() => this.initialise());
        }
        static initialise() {
            SeriesfeedTransporter.Services.StyleService.loadGlobalStyle();
            new SeriesfeedTransporter.Controllers.NavigationController()
                .initialise();
            new SeriesfeedTransporter.Controllers.RoutingController()
                .initialise();
            new SeriesfeedTransporter.Controllers.SettingsController()
                .initialise();
        }
    }
    App.main();
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Config;
    (function (Config) {
        Config.BaseUrl = "https://www.seriesfeed.com";
        Config.BierdopjeBaseUrl = "http://www.bierdopje.com";
        Config.ImdbBaseUrl = "http://www.imdb.com";
        Config.TheTvdbBaseUrl = "https://www.thetvdb.com";
        Config.Id = {
            MainContent: "mainContent",
            CardContent: "cardContent"
        };
        Config.MaxAsyncCalls = 10;
        Config.CooldownInMs = 100;
    })(Config = SeriesfeedTransporter.Config || (SeriesfeedTransporter.Config = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ExportController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const contentWrapper = $('<div/>');
                const exportIconWrapper = $('<div/>').css({ textAlign: 'center' });
                const exportIcon = $('<i/>').addClass('fa fa-5x fa-cloud-upload').css({ color: '#5a77ad' });
                exportIconWrapper.append(exportIcon);
                contentWrapper.append(exportIconWrapper);
                const text = $('<p/>').append('Wat wil je exporteren?');
                contentWrapper.append(text);
                cardContent.append(contentWrapper);
                this.addFavourites(cardContent);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Series exporteren");
                card.setBreadcrumbs(null);
            }
            addFavourites(cardContent) {
                const favourites = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites), "100%");
                favourites.instance.css({ marginTop: '0px' });
                cardContent.append(favourites.instance);
            }
            addTimeWasted(cardContent) {
                const timeWasted = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => { }, "100%");
                cardContent.append(timeWasted.instance);
            }
        }
        Controllers.ExportController = ExportController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.SeriesfeedShowDetails = {
            Name: "Naam",
            Url: "Seriesfeed URL",
            PosterUrl: "Poster URL",
            Status: "Status",
            Future: "Toekomst",
            EpisodeCount: "Aantal afleveringen"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ExportDetailsController {
            constructor(selectedShows) {
                this._selectedShows = selectedShows;
                this._selectedDetails = [];
                this._checkboxes = [];
                window.scrollTo(0, 0);
                document.title = "Details kiezen | Favorieten exporteren | Seriesfeed";
                this.initialiseCard();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Details kiezen");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Type export", SeriesfeedTransporter.Enums.ShortUrl.Export),
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb("Serie details", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('700px');
                card.setContent();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Exporteren", () => new Controllers.ExportFileController(this._selectedShows, this._selectedDetails));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie detail');
                const exampleColumn = $('<th/>').text('Voorbeeld');
                table.addTheadItems([selectAllColumn, seriesColumn, exampleColumn]);
                let index = 0;
                for (let showDetail in SeriesfeedTransporter.Enums.SeriesfeedShowDetails) {
                    const row = $('<tr/>');
                    const selectColumn = $('<td/>');
                    const showColumn = $('<td/>');
                    const exampleColumn = $('<td/>');
                    const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`exportType_${index}`);
                    checkbox.subscribe((isEnabled) => {
                        if (isEnabled) {
                            this._selectedDetails.push(showDetail);
                        }
                        else {
                            const position = this._selectedDetails.indexOf(showDetail);
                            this._selectedDetails.splice(position, 1);
                        }
                        this.setNextButton();
                    });
                    selectColumn.append(checkbox.instance);
                    this._checkboxes.push(checkbox);
                    const currentDetail = SeriesfeedTransporter.Enums.SeriesfeedShowDetails[showDetail];
                    const showLink = $('<span/>').text(currentDetail);
                    showColumn.append(showLink);
                    const firstShow = this._selectedShows[0];
                    const key = Object.keys(firstShow).find((property) => property.toLowerCase() === showDetail.toLowerCase());
                    const exampleRowContent = $('<span/>').text(firstShow[key]);
                    exampleColumn.append(exampleRowContent);
                    row.append(selectColumn);
                    row.append(showColumn);
                    row.append(exampleColumn);
                    table.addRow(row);
                    index++;
                }
                cardContent
                    .append(table.instance)
                    .append(this._nextButton.instance);
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setNextButton() {
                if (this._selectedShows.length === 1 && this._selectedDetails.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie met ${this._selectedDetails.length} detail exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1 && this._selectedDetails.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} series met ${this._selectedDetails.length} detail exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length === 1 && this._selectedDetails.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie met ${this._selectedDetails.length} details exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1 && this._selectedDetails.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series met ${this._selectedDetails.length} details exporteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ExportDetailsController = ExportDetailsController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ExportFavouritesController {
            constructor() {
                this._selectedShows = [];
                this._checkboxes = [];
                this.initialiseCard();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Favorieten selecteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Type export", SeriesfeedTransporter.Enums.ShortUrl.Export),
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Exporteren", () => new Controllers.ExportDetailsController(this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie');
                table.addTheadItems([selectAllColumn, seriesColumn]);
                const loadingData = $('<div/>');
                const loadingFavourites = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Favorieten ophalen...");
                const starIcon = $('<i/>').addClass('fa fa-star-o fa-spin');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._nextButton.instance);
                SeriesfeedTransporter.Services.SeriesfeedExportService.getCurrentUsername()
                    .then((username) => {
                    SeriesfeedTransporter.Services.SeriesfeedExportService.getFavouritesByUsername(username)
                        .then((favourites) => {
                        favourites.forEach((show, index) => {
                            const row = $('<tr/>');
                            const selectColumn = $('<td/>');
                            const showColumn = $('<td/>');
                            const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`show_${index}`);
                            checkbox.subscribe((isEnabled) => {
                                if (isEnabled) {
                                    this._selectedShows.push(show);
                                }
                                else {
                                    const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                    this._selectedShows.splice(position, 1);
                                }
                                this.setNextButton();
                            });
                            selectColumn.append(checkbox.instance);
                            this._checkboxes.push(checkbox);
                            const showLink = $('<a/>').attr('href', show.url).attr('target', '_blank').text(show.name);
                            showColumn.append(showLink);
                            row.append(selectColumn);
                            row.append(showColumn);
                            table.addRow(row);
                        });
                        loadingData.replaceWith(table.instance);
                    });
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setNextButton() {
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie exporteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series exporteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ExportFavouritesController = ExportFavouritesController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ExportFileController {
            constructor(selectedShows, selectedDetails) {
                this._selectedShows = selectedShows;
                this._selectedDetails = selectedDetails;
                window.scrollTo(0, 0);
                document.title = "Favorieten exporteren | Seriesfeed";
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const wrapper = $('<div/>').css({ textAlign: 'center' });
                cardContent.append(wrapper);
                this.addTsv(wrapper);
                this.addCsv(wrapper);
                this.addXml(wrapper);
                this.addJson(wrapper);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Favorieten exporteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Type export", SeriesfeedTransporter.Enums.ShortUrl.Export),
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorietenselectie", SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb("Serie details", ""),
                    new SeriesfeedTransporter.Models.Breadcrumb("Exporteren", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('550px');
                card.setContent();
            }
            addTsv(cardContent) {
                const currentDateTime = SeriesfeedTransporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".tsv";
                const dataLink = SeriesfeedTransporter.Services.ConverterService.toTsv(this._selectedShows, this._selectedDetails);
                const tsv = new SeriesfeedTransporter.ViewModels.CardButton("Excel (TSV)", "#209045");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-excel-o").css({ color: '#FFFFFF' });
                tsv.topArea.append(icon);
                tsv.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(tsv.instance);
            }
            addCsv(cardContent) {
                const currentDateTime = SeriesfeedTransporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".csv";
                const dataLink = SeriesfeedTransporter.Services.ConverterService.toCsv(this._selectedShows, this._selectedDetails);
                const csv = new SeriesfeedTransporter.ViewModels.CardButton("Excel (CSV)", "#47a265");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-text-o").css({ color: '#FFFFFF' });
                csv.topArea.append(icon);
                csv.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(csv.instance);
            }
            addXml(cardContent) {
                const currentDateTime = SeriesfeedTransporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".xml";
                const dataLink = SeriesfeedTransporter.Services.ConverterService.toXml(this._selectedShows, this._selectedDetails);
                const xml = new SeriesfeedTransporter.ViewModels.CardButton("XML", "#FF6600");
                const icon = $('<i/>').addClass("fa fa-4x fa-file-code-o").css({ color: '#FFFFFF' });
                xml.topArea.append(icon);
                xml.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(xml.instance);
            }
            addJson(cardContent) {
                const currentDateTime = SeriesfeedTransporter.Services.DateTimeService.getCurrentDateTime();
                const filename = "seriesfeed_" + currentDateTime + ".json";
                const dataLink = SeriesfeedTransporter.Services.ConverterService.toJson(this._selectedShows, this._selectedDetails);
                const json = new SeriesfeedTransporter.ViewModels.CardButton("JSON", "#000000");
                const iconWrapper = $('<span/>').css({ position: 'relative' });
                const iconFile = $('<i/>').addClass("fa fa-4x fa-file-o").css({ color: '#FFFFFF' });
                const iconBrackets = $('<span/>').addClass("brackets").css({
                    color: '#FFFFFF',
                    position: 'absolute',
                    top: '19px',
                    left: '14.5px',
                    fontSize: '1.7em',
                    fontWeight: '900'
                }).text("{ }");
                iconWrapper.append(iconFile);
                iconWrapper.append(iconBrackets);
                json.topArea.append(iconWrapper);
                json.instance
                    .css({ width: '150px', textAlign: 'center', margin: '5px' })
                    .attr('download', filename)
                    .attr('href', dataLink);
                cardContent.append(json.instance);
            }
        }
        Controllers.ExportFileController = ExportFileController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class SeriesfeedShowExportModel {
        }
        Models.SeriesfeedShowExportModel = SeriesfeedShowExportModel;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class ConverterService {
            static toJson(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredArray));
            }
            static filter(objects, filterKeys) {
                if (filterKeys == null || filterKeys.length === 0) {
                    return objects;
                }
                const filteredArray = new Array();
                objects.forEach((object) => {
                    const filteredObject = {};
                    filterKeys.forEach((key) => {
                        Object.getOwnPropertyNames(object).map((property) => {
                            if (key.toLowerCase() === property.toLowerCase()) {
                                filteredObject[property] = object[property];
                            }
                        });
                    });
                    filteredArray.push(filteredObject);
                });
                return filteredArray;
            }
            static toXml(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/xml;charset=utf-8," + encodeURIComponent(this.getXml(filteredArray));
            }
            static getXml(objects) {
                let xml = `<?xml version="1.0" encoding="utf-8"?>\n`;
                objects.forEach((object, index) => {
                    xml += "<show>\n";
                    var keys = Object.keys(object);
                    keys.map((key) => {
                        xml += `\t<${key}>\n\t\t${object[key]}\n\t</${key}>\n`;
                    });
                    if (index < objects.length - 1) {
                        xml += "</show>\n";
                    }
                    else {
                        xml += "</show>";
                    }
                });
                return xml;
            }
            static toCsv(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/csv;charset=utf-8," + encodeURIComponent(this.getCsv(filteredArray));
            }
            static getCsv(objects) {
                let csv = "";
                csv += this.getXsvKeyString(objects[0], ",");
                csv += this.getXsvValueString(objects, ",");
                return csv;
            }
            static toTsv(objects, filterKeys) {
                const filteredArray = this.filter(objects, filterKeys);
                return "data:text/tsv;charset=utf-8," + encodeURIComponent(this.getTsv(filteredArray));
            }
            static getTsv(objects) {
                let tsv = "";
                tsv += this.getXsvKeyString(objects[0], "\t");
                tsv += this.getXsvValueString(objects, "\t");
                return tsv;
            }
            static getXsvKeyString(object, separator) {
                const keys = Object.keys(object);
                let keyString = "";
                let index = 0;
                keys.map((key) => {
                    keyString += `"${key}"`;
                    if (index < keys.length - 1) {
                        keyString += separator;
                    }
                    else {
                        keyString += "\n";
                    }
                    index++;
                });
                return keyString;
            }
            static getXsvValueString(objects, separator) {
                let keyString = "";
                objects.forEach((object) => {
                    const keys = Object.keys(object);
                    let index = 0;
                    keys.map((key) => {
                        keyString += `"${object[key]}"`;
                        if (index < keys.length - 1) {
                            keyString += separator;
                        }
                        else {
                            keyString += "\n";
                        }
                        index++;
                    });
                });
                return keyString;
            }
        }
        Services.ConverterService = ConverterService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class SeriesfeedExportService {
            static getCurrentUsername() {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.BaseUrl + "/about/")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const userLink = data.find('.main-menu .profile-li .main-menu-dropdown li:first-child a').attr('href');
                    const userLinkParts = userLink.split('/');
                    return userLinkParts[2];
                })
                    .catch((error) => {
                    throw `Could not get username from ${SeriesfeedTransporter.Config.BaseUrl}. ${error}`;
                });
            }
            static getFavouritesByUsername(username) {
                const url = SeriesfeedTransporter.Config.BaseUrl + "/users/" + username + "/favourites";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRow = data.find("#favourites").find("tbody tr");
                    const favourites = new Array();
                    dataRow.each((index, favourite) => {
                        const show = new SeriesfeedTransporter.Models.SeriesfeedShowExportModel();
                        show.posterUrl = $($(favourite).find('td')[0]).find('img').attr('src');
                        show.name = $($(favourite).find('td')[1]).text();
                        show.url = SeriesfeedTransporter.Config.BaseUrl + $($(favourite).find('td')[1]).find('a').attr('href');
                        show.status = $($(favourite).find('td')[2]).text();
                        show.future = $($(favourite).find('td')[3]).text();
                        show.episodeCount = $($(favourite).find('td')[4]).text();
                        favourites.push(show);
                    });
                    return favourites;
                })
                    .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat je niet meer ingelogd bent, geen favorieten hebt of er is iets mis met je verbinding.`);
                    throw `Could not get favourites from ${SeriesfeedTransporter.Config.BaseUrl}. ${error}`;
                });
            }
        }
        Services.SeriesfeedExportService = SeriesfeedExportService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const contentWrapper = $('<div/>');
                const exportIconWrapper = $('<div/>').css({ textAlign: 'center' });
                const exportIcon = $('<i/>').addClass('fa fa-5x fa-cloud-download').css({ color: '#2f8e85' });
                exportIconWrapper.append(exportIcon);
                contentWrapper.append(exportIconWrapper);
                const text = $('<p/>').append('Wat wil je importeren?');
                contentWrapper.append(text);
                cardContent.append(contentWrapper);
                this.addFavourites(cardContent);
                this.addTimeWasted(cardContent);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Series importeren");
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Type import", SeriesfeedTransporter.Enums.ShortUrl.Import)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addFavourites(cardContent) {
                const favourites = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-star-o", "Favorieten", () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites), "100%");
                favourites.instance.css({ marginTop: '0px' });
                cardContent.append(favourites.instance);
            }
            addTimeWasted(cardContent) {
                const timeWasted = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-clock-o", "Time Wasted", () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted), "100%");
                cardContent.append(timeWasted.instance);
            }
        }
        Controllers.ImportController = ImportController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportFavouritesController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this.addBierdopje(cardContent);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Favorieten importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bronkeuze", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addBierdopje(cardContent) {
                const name = "Bierdopje.com";
                const bierdopje = new SeriesfeedTransporter.ViewModels.CardButton(name, "#3399FE");
                const img = $('<img/>')
                    .css({
                    maxWidth: "100%",
                    padding: '10px'
                })
                    .attr('src', "http://cdn.bierdopje.eu/g/layout/bierdopje.png")
                    .attr('alt', name);
                bierdopje.topArea.append(img);
                bierdopje.instance.click(() => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje));
                cardContent.append(bierdopje.instance);
            }
            addImdb(cardContent) {
                const name = "IMDb.com";
                const imdb = new SeriesfeedTransporter.ViewModels.CardButton(name, "#313131");
                const img = $('<img/>')
                    .css({
                    maxWidth: "40%",
                    padding: '10px'
                })
                    .attr('src', "data:image/png;base64,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")
                    .attr('alt', name);
                imdb.topArea.append(img);
                imdb.instance.click(() => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb));
                cardContent.append(imdb.instance);
            }
        }
        Controllers.ImportFavouritesController = ImportFavouritesController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class BierdopjeFavouriteSelectionController {
            constructor(username) {
                this._username = username;
                this._selectedShows = [];
                this._checkboxes = [];
                this._currentCalls = 0;
                this.initialiseCard();
                this.initialiseCollectingData();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten selecteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._username, SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImportBierdopjeFavouritesController(this._username, this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie');
                table.addTheadItems([selectAllColumn, seriesColumn]);
                const loadingData = $('<div/>');
                const loadingFavourites = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Favorieten ophalen...");
                const starIcon = $('<i/>').addClass('fa fa-star-o fa-spin');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedTransporter.Services.BierdopjeService.getFavouritesByUsername(this._username)
                    .then((favourites) => {
                    favourites.forEach((show, index) => {
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>');
                        const showColumn = $('<td/>');
                        const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedTransporter.Services.BierdopjeService.getTheTvdbIdByShowSlug(show.slug)
                                    .then((theTvdbId) => {
                                    show.theTvdbId = theTvdbId;
                                    this._currentCalls--;
                                    this.setCollectingData();
                                })
                                    .catch(() => {
                                    checkbox.uncheck();
                                    this._currentCalls--;
                                    this.setCollectingData();
                                });
                                this._selectedShows.push(show);
                            }
                            else {
                                const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                this._selectedShows.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        selectColumn.append(checkbox.instance);
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                        showColumn.append(showLink);
                        row.append(selectColumn);
                        row.append(showColumn);
                        table.addRow(row);
                    });
                    loadingData.replaceWith(table.instance);
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setCollectingData() {
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} serie)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} series)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
                    this._nextButton.instance.hide();
                    return;
                }
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie importeren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series importeren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.BierdopjeFavouriteSelectionController = BierdopjeFavouriteSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportBierdopjeFavouritesController {
            constructor(username, selectedShows) {
                this._username = username;
                this._selectedShows = SeriesfeedTransporter.Services.ShowSorterService.sort(selectedShows, "name");
                window.scrollTo(0, 0);
                this.initialiseCard();
                this.initialiseTable();
                this.startImport();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._username, SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + this._username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('600px');
                card.setContent();
            }
            initialiseTable() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._table = new SeriesfeedTransporter.ViewModels.Table();
                const statusIconColumn = $('<th/>');
                const seriesColumn = $('<th/>').text('Serie');
                const statusColumn = $('<th/>').text('Status');
                this._table.addTheadItems([statusIconColumn, seriesColumn, statusColumn]);
                this._selectedShows.forEach((show) => {
                    const row = $('<tr/>');
                    const showStatusIcon = $('<td/>');
                    const showColumn = $('<td/>');
                    const statusColumn = $('<td/>');
                    const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                    showStatusIcon.append(loadingIcon);
                    const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                    showColumn.append(showLink);
                    row.append(showStatusIcon);
                    row.append(showColumn);
                    row.append(statusColumn);
                    this._table.addRow(row);
                });
                cardContent.append(this._table.instance);
            }
            startImport() {
                this._selectedShows.forEach((show, index) => {
                    const currentRow = this._table.getRow(index);
                    SeriesfeedTransporter.Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
                        .then((seriesfeedShow) => SeriesfeedTransporter.Services.SeriesfeedImportService.addFavouriteByShowId(seriesfeedShow.seriesfeedId))
                        .then(() => {
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        currentRow.children().first().find("i").replaceWith(checkmarkIcon);
                        const addedFavourite = $("<span/>").text("Toegevoegd als favoriet.");
                        currentRow.children().last().append(addedFavourite);
                    })
                        .catch((error) => {
                        const parsedError = error.responseJSON[0];
                        let errorIcon;
                        let errorMessage;
                        switch (parsedError) {
                            case SeriesfeedTransporter.Enums.SeriesfeedError.CouldNotUpdateStatus:
                                errorIcon = $("<i/>").addClass("fa fa-info-circle").css({ color: "#5f7192", fontSize: "16px" });
                                errorMessage = $("<span/>").text("Deze serie is al een favoriet.");
                                break;
                            case SeriesfeedTransporter.Enums.SeriesfeedError.NotFound:
                                errorIcon = $("<i/>").addClass("fa fa-exclamation-triangle").css({ color: "#8e6c2f", fontSize: "16px", marginLeft: "-1px" });
                                errorMessage = $('<a/>').attr('href', SeriesfeedTransporter.Config.BaseUrl + "/series/suggest").attr('target', "_blank").text("Deze serie staat nog niet op Seriesfeed.");
                                break;
                            default:
                                errorIcon = $("<i/>").addClass("fa fa-exclamation-circle").css({ color: "#8e2f2f", fontSize: "16px" });
                                errorMessage = $("<span/>").text("Kon deze serie niet als favoriet instellen.");
                                break;
                        }
                        currentRow.children().first().find("i").replaceWith(errorIcon);
                        currentRow.children().last().append(errorMessage);
                        this._table.updateRow(index, currentRow);
                    });
                });
            }
            convertErrorToMessage(error) {
                const parsedError = error.responseJSON[0];
                switch (parsedError) {
                    case SeriesfeedTransporter.Enums.SeriesfeedError.CouldNotUpdateStatus:
                        return $("<span/>").text("Deze serie is al een favoriet.");
                    case SeriesfeedTransporter.Enums.SeriesfeedError.NotFound:
                        return $('<a/>').attr('href', SeriesfeedTransporter.Config.BaseUrl + "/voorstellen/").attr('target', "_blank").text("Deze serie staat nog niet op Seriesfeed.");
                    default:
                        return $("<span/>").text("Kon deze serie niet als favoriet instellen.");
                }
            }
        }
        Controllers.ImportBierdopjeFavouritesController = ImportBierdopjeFavouritesController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportBierdopjeFavouritesUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
                this.initialiseCustomUser();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje favorieten importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb("Gebruiker", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('700px');
            }
            initialiseCurrentUser() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._user = new SeriesfeedTransporter.ViewModels.User();
                this._user.setTopText("Huidige gebruiker");
                this._user.setWidth('49%');
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
                refreshButton.instance.css({
                    position: 'absolute',
                    left: '0',
                    bottom: '0'
                });
                this._user.instance.append(refreshButton.instance);
                this.loadUser();
            }
            loadUser() {
                SeriesfeedTransporter.Services.BierdopjeService.getUsername()
                    .then((username) => {
                    if (username == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + username);
                        this._user.setUsername(username);
                        SeriesfeedTransporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
            initialiseCustomUser() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._customUser = new SeriesfeedTransporter.ViewModels.User();
                this._customUser.setTopText("Andere gebruiker");
                this._customUser.setWidth('49%');
                this._customUser.instance.css({ marginLeft: '1%' });
                cardContent.append(this._customUser.instance);
                const userInputWrapper = this.getUserSearchBox();
                this._customUser.replaceUsername(userInputWrapper);
            }
            getUserSearchBox() {
                const userInputWrapper = $('<div/>').css({ textAlign: 'center' });
                userInputWrapper.click((event) => event.stopPropagation());
                const userInput = SeriesfeedTransporter.Providers.TextInputProvider.provide('85%', "Gebruikersnaam");
                userInput.css({ margin: '0 auto', display: 'inline-block' });
                userInput.on('keyup', (event) => {
                    const key = event.keyCode || event.which;
                    if (key === 12 || key === 13) {
                        searchButton.instance.click();
                    }
                });
                const searchButtonAction = (event) => {
                    notFoundMessage.hide();
                    this.searchUser(userInput.val().toString().trim())
                        .then((hasResult) => {
                        if (!hasResult) {
                            notFoundMessage.show();
                        }
                    });
                };
                const searchButton = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Success, "fa-search", null, searchButtonAction, "15%");
                searchButton.instance.css({
                    marginTop: '0',
                    borderRadius: '0px 5px 5px 0px',
                    padding: '10px 14px',
                    fontSize: '14px'
                });
                const notFoundMessage = $('<div/>').css({
                    display: 'none',
                    textAlign: 'left',
                    color: '#9f9f9f'
                }).html("Gebruiker niet gevonden.");
                userInputWrapper.append(userInput);
                userInputWrapper.append(searchButton.instance);
                userInputWrapper.append(notFoundMessage);
                return userInputWrapper;
            }
            searchUser(username) {
                return SeriesfeedTransporter.Services.BierdopjeService.isExistingUser(username)
                    .then((isExistingUser) => {
                    if (!isExistingUser) {
                        this._customUser.onClick = null;
                        this._customUser.setAvatarUrl();
                    }
                    else {
                        this._customUser.onClick = () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje + username);
                        this._customUser.setUsername(username);
                        SeriesfeedTransporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => {
                            if (avatarUrl == null || avatarUrl == "") {
                                this._customUser.setAvatarUrl("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAUCAYAAACnOeyiAAAAD0lEQVQYV2NkgALGocMAAAgWABX8twh4AAAAAElFTkSuQmCC");
                                return;
                            }
                            this._customUser.setAvatarUrl(avatarUrl);
                        });
                    }
                    return isExistingUser;
                });
            }
        }
        Controllers.ImportBierdopjeFavouritesUserSelectionController = ImportBierdopjeFavouritesUserSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImdbFavouriteSelectionController {
            constructor(user, selectedLists) {
                this._user = user;
                this._selectedLists = selectedLists;
                this._checkboxes = [];
                this._selectedShows = [];
                window.scrollTo(0, 0);
                this.initialiseNextButton();
                this.initialiseCard();
                this.initialise();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Importeren", () => { });
                this._nextButton.instance.hide();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("IMDb series selecteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("IMDb", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._user.username, SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb + this._user.username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
                card.setContent();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const listHeaderColumn = $('<th/>').text('Item');
                const seriesTypeHeaderColumn = $('<th/>').text('Type');
                table.addTheadItems([selectAllColumn, listHeaderColumn, seriesTypeHeaderColumn]);
                cardContent
                    .append(table.instance)
                    .append(this._nextButton.instance);
                this._selectedLists.forEach((imdbList, listIndex) => {
                    imdbList.shows.forEach((show, showsIndex) => {
                        const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`list_${listIndex}_show_${showsIndex}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this.setNextButton();
                                this._selectedShows.push(show);
                            }
                            else {
                                const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                this._selectedShows.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.ImdbBaseUrl + "/title/" + show.slug).attr('target', '_blank').text(show.name);
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>').append(checkbox.instance);
                        const showColumn = $('<td/>').append(showLink);
                        const showTypeColumn = $('<td/>').text(show.imdbType);
                        row.append(selectColumn);
                        row.append(showColumn);
                        row.append(showTypeColumn);
                        table.addRow(row);
                    });
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setNextButton() {
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie selecteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series selecteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ImdbFavouriteSelectionController = ImdbFavouriteSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImdbListSelectionControllerController {
            constructor(user) {
                this._user = user;
                this._checkboxes = [];
                this._selectedLists = [];
                this._currentCalls = 0;
                this.initialiseNextButton();
                this.initialiseCollectingData();
                this.initialiseCard();
                this.initialise();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImdbFavouriteSelectionController(this._user, this._selectedLists));
                this._nextButton.instance.hide();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("IMDb lijsten selecteren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("IMDb", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._user.username, SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb + this._user.id + "/" + this._user.username)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('650px');
                card.setContent();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                const table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const listHeaderColumn = $('<th/>').text('Lijst');
                const seriesCountHeaderColumn = $('<th/>').text('Aantal items');
                const createdOnHeaderColumn = $('<th/>').text('Aangemaakt op');
                const modifiedOnHeaderColumn = $('<th/>').text('Laatst bewerkt');
                table.addTheadItems([selectAllColumn, listHeaderColumn, seriesCountHeaderColumn, createdOnHeaderColumn, modifiedOnHeaderColumn]);
                const loadingData = $('<div/>');
                const loadingFavourites = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Lijsten ophalen...");
                const starIcon = $('<i/>').addClass('fa fa-list-ul fa-flip-x');
                loadingData.append(loadingFavourites);
                loadingFavourites
                    .append(starIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedTransporter.Services.ImdbImportService.getListsByUserId(this._user.id)
                    .then((imdbLists) => {
                    imdbLists.forEach((imdbList, index) => {
                        const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`list_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedTransporter.Services.ImdbImportService.getSeriesByListIdAndUserId(imdbList.id, this._user.id)
                                    .then((shows) => {
                                    imdbList.shows = shows;
                                    this._currentCalls--;
                                    this.setCollectingData();
                                })
                                    .catch(() => {
                                    checkbox.uncheck();
                                    this._currentCalls--;
                                    this.setCollectingData();
                                });
                                this._selectedLists.push(imdbList);
                            }
                            else {
                                const position = this._selectedLists.map((list) => list.name).indexOf(imdbList.name);
                                this._selectedLists.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.ImdbBaseUrl + "/list/" + imdbList.id).attr('target', '_blank').text(imdbList.name);
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>').append(checkbox.instance);
                        const listColumn = $('<td/>').append(showLink);
                        const seriesCountColumn = $('<td/>').text(imdbList.seriesCount);
                        const createdOnColumn = $('<td/>').text(imdbList.createdOn);
                        const modifiedOnColumn = $('<td/>').text(imdbList.modifiedOn);
                        row.append(selectColumn);
                        row.append(listColumn);
                        row.append(seriesCountColumn);
                        row.append(createdOnColumn);
                        row.append(modifiedOnColumn);
                        table.addRow(row);
                    });
                    loadingData.replaceWith(table.instance);
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setCollectingData() {
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} lijst)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} lijsten)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
                    this._nextButton.instance.hide();
                    return;
                }
                if (this._selectedLists.length === 1) {
                    this._nextButton.text = `${this._selectedLists.length} lijst selecteren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedLists.length > 1) {
                    this._nextButton.text = `${this._selectedLists.length} lijsten selecteren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ImdbListSelectionControllerController = ImdbListSelectionControllerController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportImdbFavouritesUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("IMDb favorieten importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Favorieten importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("IMDb", SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites),
                    new SeriesfeedTransporter.Models.Breadcrumb("Gebruiker", SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth();
            }
            initialiseCurrentUser() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._user = new SeriesfeedTransporter.ViewModels.User();
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
                refreshButton.instance.css({
                    position: 'absolute',
                    left: '0',
                    bottom: '0'
                });
                this._user.instance.append(refreshButton.instance);
                this.loadUser();
            }
            loadUser() {
                SeriesfeedTransporter.Services.ImdbImportService.getUser()
                    .then((user) => {
                    if (user == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb + user.id + "/" + user.username);
                        this._user.setUsername(user.username);
                        SeriesfeedTransporter.Services.ImdbImportService.getAvatarUrlByUserId(user.id)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
        }
        Controllers.ImportImdbFavouritesUserSelectionController = ImportImdbFavouritesUserSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class ImdbList {
        }
        Models.ImdbList = ImdbList;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class ImdbUser {
            constructor(id, username) {
                this.id = id;
                this.username = username;
            }
        }
        Models.ImdbUser = ImdbUser;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class ImdbImportService {
            static getUser() {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.ImdbBaseUrl + "/helpdesk/contact")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const id = data.find('#navUserMenu p a').attr('href').split('/')[4];
                    const username = data.find('#navUserMenu p a').html().trim();
                    return new SeriesfeedTransporter.Models.ImdbUser(id, username);
                })
                    .catch((error) => {
                    throw `Could not get user from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static getAvatarUrlByUserId(userId) {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.ImdbBaseUrl + "/user/" + userId + "/")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    return data.find('#avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar for user id ${userId} from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static getListsByUserId(userId) {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.ImdbBaseUrl + "/user/" + userId + "/lists")
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const dataRows = data.find('table.lists tr.row');
                    const imdbLists = new Array();
                    dataRows.each((index, dataRow) => {
                        const imdbList = new SeriesfeedTransporter.Models.ImdbList();
                        const imdbListUrl = $(dataRow).find('.name a').attr('href');
                        const imdbListUrlParts = imdbListUrl.split('/');
                        imdbList.id = imdbListUrlParts[imdbListUrlParts.length - 2];
                        imdbList.name = $(dataRow).find('.name a').text();
                        imdbList.seriesCount = $(dataRow).find('.name span').text();
                        imdbList.createdOn = $(dataRow).find('.created').text();
                        imdbList.modifiedOn = $(dataRow).find('.modified').text();
                        this.fixListTranslations(imdbList);
                        imdbLists.push(imdbList);
                    });
                    imdbLists.push(this.getWatchlistItem());
                    return imdbLists;
                })
                    .catch((error) => {
                    throw `Could not get lists for user id ${userId} from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static fixListTranslations(imdbList) {
                imdbList.seriesCount = imdbList.seriesCount
                    .replace(" Titles", "")
                    .replace('(', "")
                    .replace(')', "");
                const createdOnParts = imdbList.createdOn.split(' ');
                const createdOnMonth = Services.TimeAgoTranslatorService.getFullDutchTranslationOfMonthAbbreviation(createdOnParts[1]);
                imdbList.createdOn = imdbList.createdOn.replace(createdOnParts[1], createdOnMonth);
                const modifiedOnParts = imdbList.modifiedOn.split(' ');
                const modifiedOnTime = Services.TimeAgoTranslatorService.getDutchTranslationOfTime(modifiedOnParts[1]);
                imdbList.modifiedOn = imdbList.modifiedOn.replace(modifiedOnParts[1], modifiedOnTime).replace("ago", "geleden");
            }
            static getWatchlistItem() {
                const watchlist = new SeriesfeedTransporter.Models.ImdbList();
                watchlist.name = "Watchlist";
                watchlist.id = "watchlist";
                watchlist.seriesCount = "-";
                watchlist.createdOn = "-";
                watchlist.modifiedOn = "-";
                return watchlist;
            }
            static getSeriesByListId(listId) {
                const url = SeriesfeedTransporter.Config.ImdbBaseUrl + "/list/" + listId + "?view=compact";
                return Services.AjaxService.get(url)
                    .then((pageData) => {
                    const data = $(pageData.responseText);
                    const seriesItems = data.find(".list_item:not(:first-child)");
                    const seriesList = [];
                    seriesItems.each((index, seriesItem) => {
                        var series = {
                            name: $(seriesItem).find(".title a").html(),
                            url: SeriesfeedTransporter.Config.ImdbBaseUrl + $(seriesItem).find(".title a").attr("href"),
                            type: $(seriesItem).find(".title_type").html()
                        };
                        if (series.type !== "Feature") {
                            seriesList.push(series);
                        }
                    });
                    return seriesList.sort((a, b) => b.name.localeCompare(a.name));
                })
                    .catch((error) => {
                    throw `Could not get series for list id ${listId} from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
            static getSeriesByListIdAndUserId(listId, userId) {
                const url = SeriesfeedTransporter.Config.ImdbBaseUrl + "/list/export?list_id=" + listId + "&author_id=" + userId;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const csv = result.responseText;
                    const entries = csv.split('\n');
                    const entryKeys = entries[0].split('","');
                    const imdbSlugIndex = entryKeys.indexOf("const");
                    const titleIndex = entryKeys.indexOf("Title");
                    const titleTypeIndex = entryKeys.indexOf("Title type");
                    const shows = new Array();
                    entries.forEach((entry, index) => {
                        if (index === 0) {
                            return;
                        }
                        const entryValues = entry.split('","');
                        const titleType = entryValues[titleTypeIndex];
                        if (titleType == null) {
                            return;
                        }
                        if (titleType !== "Feature Film" && titleType !== "TV Movie") {
                            const show = new SeriesfeedTransporter.Models.Show();
                            show.imdbType = titleType;
                            show.slug = entryValues[imdbSlugIndex];
                            show.name = entryValues[titleIndex];
                            shows.push(show);
                        }
                    });
                    return Services.ShowSorterService.sort(shows, "name");
                })
                    .catch((error) => {
                    throw `Could not get list id ${listId} for user ${userId} from ${SeriesfeedTransporter.Config.ImdbBaseUrl}. ${error}`;
                });
            }
        }
        Services.ImdbImportService = ImdbImportService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class SeriesfeedImportService {
            static findShowByTheTvdbId(theTvdbId) {
                const localShow = this.findShowByTheTvdbIdInStorage(theTvdbId);
                if (localShow != null) {
                    return Promise.resolve(localShow);
                }
                return this.findShowByTheTvdbIdFromApi(theTvdbId)
                    .then((show) => {
                    show.theTvdbId = theTvdbId;
                    this.addShowToStorage(show);
                    return show;
                });
            }
            static findShowByTheTvdbIdInStorage(theTvdbId) {
                const localShows = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedShows);
                if (localShows != null) {
                    return localShows.find((show) => show.theTvdbId === theTvdbId);
                }
                return null;
            }
            static findShowByTheTvdbIdFromApi(theTvdbId) {
                const postData = {
                    type: 'tvdb_id',
                    data: theTvdbId
                };
                return Services.AjaxService.post("/ajax/serie/find-by", postData)
                    .then((result) => {
                    const show = new SeriesfeedTransporter.Models.Show();
                    show.seriesfeedId = result.id;
                    show.name = result.name;
                    show.slug = result.slug;
                    return show;
                })
                    .catch((error) => {
                    console.error(`Could not convert The TVDB id ${theTvdbId} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static addShowToStorage(show) {
                let localShows = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedShows);
                if (localShows == null) {
                    localShows = new Array();
                }
                localShows.push(show);
                Services.StorageService.set(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedShows, localShows);
            }
            static addFavouriteByShowId(showId) {
                const postData = {
                    series: showId,
                    type: 'favourite',
                    selected: '0'
                };
                return Services.AjaxService.post("/ajax/serie/favourite", postData)
                    .catch((error) => {
                    console.error(`Could not favourite show id ${showId} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static getEpisodeId(showId, episodeTag) {
                const localEpisodeId = this.findEpisodeIdInStorage(showId, episodeTag);
                if (localEpisodeId != null) {
                    return Promise.resolve(localEpisodeId);
                }
                return this.getEpisodeIdFromApi(showId, episodeTag)
                    .then((episodeId) => {
                    const localEpisode = new SeriesfeedTransporter.Models.LocalEpisode();
                    localEpisode.showId = showId;
                    localEpisode.episodeId = episodeId;
                    localEpisode.episodeTag = episodeTag;
                    this.addEpisodeToStorage(localEpisode);
                    return episodeId;
                });
            }
            static findEpisodeIdInStorage(showId, episodeTag) {
                const localEpisodes = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedEpisodes);
                if (localEpisodes != null) {
                    const localEpisode = localEpisodes.find((episode) => episode.showId === showId && episode.episodeTag === episodeTag);
                    return localEpisode != null ? localEpisode.episodeId : null;
                }
                return null;
            }
            static getEpisodeIdFromApi(showId, episodeTag) {
                const postData = {
                    type: 'series_season_episode',
                    serie: showId,
                    data: episodeTag
                };
                return Services.AjaxService.post("/ajax/serie/episode/find-by", postData)
                    .then((episodeData) => episodeData.id)
                    .catch((error) => {
                    console.error(`Could not get episode for show id ${showId} with episode tag ${episodeTag} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static addEpisodeToStorage(localEpisode) {
                let localEpisodes = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedEpisodes);
                if (localEpisodes == null) {
                    localEpisodes = new Array();
                }
                localEpisodes.push(localEpisode);
                Services.StorageService.set(SeriesfeedTransporter.Enums.LocalStorageKey.SeriesfeedEpisodes, localEpisodes);
            }
            static markSeasonEpisodes(showId, seasonId, type) {
                const postData = {
                    series: showId,
                    season: seasonId,
                    seen: true,
                    type: type
                };
                return Services.AjaxService.post("/ajax/serie/episode/mark/all", postData)
                    .catch((error) => {
                    console.error(`Could not mark all episodes as ${type} for show id ${showId} and season id ${seasonId} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
            static markEpisode(episodeId, type) {
                const postData = {
                    episode: episodeId,
                    type: type,
                    status: 'no'
                };
                return Services.AjaxService.post("/ajax/serie/episode/mark/", postData)
                    .catch((error) => {
                    console.error(`Could not mark episode ${episodeId} as ${type} on ${SeriesfeedTransporter.Config.BaseUrl}: ${error.responseText}`);
                    return error;
                });
            }
        }
        Services.SeriesfeedImportService = SeriesfeedImportService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedController {
            constructor() {
                this.initialise();
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this.addBierdopje(cardContent);
            }
            initialise() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.Import);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bronkeuze", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            addBierdopje(cardContent) {
                const name = "Bierdopje.com";
                const bierdopje = new SeriesfeedTransporter.ViewModels.CardButton(name, "#3399FE");
                const img = $('<img/>')
                    .css({
                    maxWidth: "100%",
                    padding: '10px'
                })
                    .attr('src', "http://cdn.bierdopje.eu/g/layout/bierdopje.png")
                    .attr('alt', name);
                bierdopje.topArea.append(img);
                bierdopje.instance.click(() => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje));
                cardContent.append(bierdopje.instance);
            }
        }
        Controllers.ImportTimeWastedController = ImportTimeWastedController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        let Column;
        (function (Column) {
            Column[Column["Status"] = 0] = "Status";
            Column[Column["ShowName"] = 1] = "ShowName";
            Column[Column["Season"] = 2] = "Season";
            Column[Column["EpisodesAcquired"] = 3] = "EpisodesAcquired";
            Column[Column["EpisodesSeen"] = 4] = "EpisodesSeen";
            Column[Column["EpisodeTotal"] = 5] = "EpisodeTotal";
        })(Column || (Column = {}));
        class ImportTimeWastedBierdopjeController {
            constructor(username, selectedShows) {
                this.Separator = '/';
                this._username = username;
                this._selectedShows = selectedShows;
                window.scrollTo(0, 0);
                this.initialiseCard();
                this.initialiseTable();
                this.startImport();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._username, SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje),
                    new SeriesfeedTransporter.Models.Breadcrumb("Serieselectie", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username),
                    new SeriesfeedTransporter.Models.Breadcrumb("Importeren", null)
                ];
                card.setBreadcrumbs(breadcrumbs);
                card.setWidth('650px');
                card.setContent();
            }
            initialiseTable() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._table = new SeriesfeedTransporter.ViewModels.Table();
                const statusColumn = $('<th/>').css({ verticalAlign: "middle" });
                const seriesColumn = $('<th/>').text('Serie').css({ verticalAlign: "middle" });
                const seasonColumn = $('<th/>').text('Seizoen').css({ textAlign: "center", verticalAlign: "middle" });
                const episodesAcquiredColumn = $('<th/>').html("Afleveringen<br/>verkregen").css({ textAlign: "center", verticalAlign: "middle" });
                const episodesSeenColumn = $('<th/>').html("Afleveringen<br/>gezien").css({ textAlign: "center", verticalAlign: "middle" });
                const episodeTotalColumn = $('<th/>').html("Totaal<br/>afleveringen").css({ textAlign: "center", verticalAlign: "middle" });
                this._table.addTheadItems([statusColumn, seriesColumn, seasonColumn, episodesAcquiredColumn, episodesSeenColumn, episodeTotalColumn]);
                this._selectedShows.forEach((show) => {
                    const row = $('<tr/>');
                    const statusColumn = $('<td/>');
                    const showColumn = $('<td/>');
                    const seasonColumn = $('<td/>').css({ textAlign: "center" });
                    const episodesAcquiredColumn = $('<td/>').css({ textAlign: "center" });
                    const episodesSeenColumn = $('<td/>').css({ textAlign: "center" });
                    const episodeTotalColumn = $('<td/>').css({ textAlign: "center" });
                    const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                    statusColumn.append(loadingIcon.clone());
                    seasonColumn.append(loadingIcon.clone());
                    episodesAcquiredColumn.append(loadingIcon.clone());
                    episodesSeenColumn.append(loadingIcon.clone());
                    episodeTotalColumn.append(loadingIcon.clone());
                    const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                    showColumn.append(showLink);
                    row.append(statusColumn);
                    row.append(showColumn);
                    row.append(seasonColumn);
                    row.append(episodesAcquiredColumn);
                    row.append(episodesSeenColumn);
                    row.append(episodeTotalColumn);
                    this._table.addRow(row);
                });
                cardContent.append(this._table.instance);
            }
            startImport() {
                const promises = new Array();
                this._selectedShows.forEach((show, index) => {
                    const promise = SeriesfeedTransporter.Services.BierdopjeService.getShowSeasonsByShowSlug(show.slug)
                        .then((seasons) => {
                        show.seasons = seasons;
                        const currentRow = this._table.getRow(index);
                        const seasonColumn = currentRow.children().get(Column.Season);
                        $(seasonColumn).text('-' + this.Separator + show.seasons.length);
                    });
                    promises.push(promise);
                });
                Promise.all(promises)
                    .then(() => setTimeout(this.getShowSeasonEpisodesBySeasonSlug, SeriesfeedTransporter.Config.CooldownInMs));
            }
            getShowSeasonEpisodesBySeasonSlug() {
                const promises = new Array();
                this._selectedShows.forEach((show, rowIndex) => {
                    show.seasons.forEach((season, seasonIndex) => {
                        const promise = SeriesfeedTransporter.Services.BierdopjeService.getShowSeasonEpisodesBySeasonSlug(season.slug)
                            .then((episodes) => {
                            season.episodes = episodes;
                        });
                        promises.push(promise);
                    });
                });
                Promise.all(promises)
                    .then(() => setTimeout(this.aquireEpisodeIds, SeriesfeedTransporter.Config.CooldownInMs));
            }
            aquireEpisodeIds() {
                const promises = new Array();
                this._selectedShows.forEach((show, rowIndex) => {
                    const showPromises = new Array();
                    show.seasons.forEach((season, seasonIndex) => {
                        season.episodes.forEach((episode, episodeIndex) => {
                            const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.getEpisodeId(show.seriesfeedId, episode.tag)
                                .then((episodeId) => {
                                episode.id = episodeId;
                            })
                                .catch((error) => {
                                const position = season.episodes.map((episode) => episode.tag).indexOf(episode.tag);
                                season.episodes.splice(position, 1);
                            });
                            showPromises.push(promise);
                        });
                    });
                    const promiseAll = Promise.all(showPromises)
                        .then(() => {
                        const currentRow = this._table.getRow(rowIndex);
                        const episodesAcquiredColumn = currentRow.children().get(Column.EpisodesAcquired);
                        const episodesSeenColumn = currentRow.children().get(Column.EpisodesSeen);
                        const episodeTotalColumn = currentRow.children().get(Column.EpisodeTotal);
                        let episodesAcquired = 0;
                        let episodesSeen = 0;
                        let episodeCount = 0;
                        show.seasons.map((season) => {
                            season.episodes.map((episode) => {
                                if (episode.acquired) {
                                    episodesAcquired++;
                                }
                                if (episode.seen) {
                                    episodesSeen++;
                                }
                            });
                            episodeCount += season.episodes.length;
                        });
                        $(episodesAcquiredColumn).text('-' + this.Separator + episodesAcquired);
                        $(episodesSeenColumn).text('-' + this.Separator + episodesSeen);
                        $(episodeTotalColumn).text(episodeCount);
                    });
                    promises.push(promiseAll);
                });
                Promise.all(promises)
                    .then(() => setTimeout(this.markEpisodes, SeriesfeedTransporter.Config.CooldownInMs));
            }
            markEpisodes() {
                this._selectedShows.forEach((show, rowIndex) => {
                    const promises = new Array();
                    show.seasons.forEach((season, seasonIndex) => {
                        if (season.episodes.length === 0) {
                            this.updateCountColumn(rowIndex, Column.Season, 1);
                            return;
                        }
                        const seasonEpisodePromises = new Array();
                        const hasSeenAllEpisodes = season.episodes.every((episode) => episode.seen === true);
                        const hasAcquiredAllEpisodes = season.episodes.every((episode) => episode.acquired === true);
                        if (hasSeenAllEpisodes) {
                            const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, SeriesfeedTransporter.Enums.MarkType.Seen)
                                .then(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, season.episodes.length))
                                .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, season.episodes.length));
                            seasonEpisodePromises.push(promise);
                        }
                        else if (hasAcquiredAllEpisodes) {
                            const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.markSeasonEpisodes(show.seriesfeedId, season.id, SeriesfeedTransporter.Enums.MarkType.Obtained)
                                .then(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, season.episodes.length))
                                .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, season.episodes.length));
                            seasonEpisodePromises.push(promise);
                        }
                        else {
                            season.episodes.forEach((episode) => {
                                if (episode.seen) {
                                    const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.markEpisode(episode.id, SeriesfeedTransporter.Enums.MarkType.Seen)
                                        .then(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, 1))
                                        .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesSeen, 1));
                                    seasonEpisodePromises.push(promise);
                                }
                                else if (episode.acquired) {
                                    const promise = SeriesfeedTransporter.Services.SeriesfeedImportService.markEpisode(episode.id, SeriesfeedTransporter.Enums.MarkType.Obtained)
                                        .then(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, 1))
                                        .catch(() => this.updateCountColumn(rowIndex, Column.EpisodesAcquired, 1));
                                    seasonEpisodePromises.push(promise);
                                }
                            });
                        }
                        const seasonPromiseAll = Promise.all(seasonEpisodePromises)
                            .then(() => this.updateCountColumn(rowIndex, Column.Season, 1))
                            .catch(() => this.updateCountColumn(rowIndex, Column.Season, 1));
                        promises.push(seasonPromiseAll);
                    });
                    Promise.all(promises)
                        .then(() => {
                        const currentRow = this._table.getRow(rowIndex);
                        const statusColumn = currentRow.children().get(Column.Status);
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        $(statusColumn).find("i").replaceWith(checkmarkIcon);
                    });
                });
            }
            updateCountColumn(rowId, columnId, done) {
                if (columnId === Column.EpisodesSeen) {
                    this.updateActualCountColumn(rowId, Column.EpisodesSeen, done);
                    this.updateActualCountColumn(rowId, Column.EpisodesAcquired, done);
                }
                else {
                    this.updateActualCountColumn(rowId, columnId, done);
                }
            }
            updateActualCountColumn(rowId, columnId, done) {
                const row = this._table.getRow(rowId);
                const column = row.children().get(columnId);
                const columnParts = $(column).text().split(this.Separator);
                const currentDoneText = columnParts[0];
                const totalDoneText = columnParts[1];
                let currentDone = isNaN(+currentDoneText) ? 0 : +currentDoneText;
                currentDone += done;
                $(column).text(currentDone + this.Separator + totalDoneText);
            }
        }
        Controllers.ImportTimeWastedBierdopjeController = ImportTimeWastedBierdopjeController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedBierdopjeShowSelectionController {
            constructor(username) {
                this._username = username;
                this._selectedShows = [];
                this._checkboxes = [];
                this._currentCalls = 0;
                this.initialiseCard();
                this.initialiseCollectingData();
                this.initialiseNextButton();
                this.initialise();
            }
            initialiseCard() {
                this._card = SeriesfeedTransporter.Services.CardService.getCard();
                this._card.setTitle("Bierdopje series selecteren");
                this._card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedTransporter.Models.Breadcrumb(this._username, SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje),
                    new SeriesfeedTransporter.Models.Breadcrumb("Serieselectie", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje + this._username)
                ];
                this._card.setBreadcrumbs(breadcrumbs);
                this._card.setWidth();
                this._card.setContent();
            }
            initialiseCollectingData() {
                this._collectingData = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Gegevens verzamelen...");
                this._collectingData.instance.find('a').css({ color: '#848383', textDecoration: 'none' });
                this._collectingData.instance.hide();
            }
            initialiseNextButton() {
                this._nextButton = new SeriesfeedTransporter.ViewModels.ReadMoreButton("Importeren", () => new Controllers.ImportTimeWastedBierdopjeController(this._username, this._selectedShows));
                this._nextButton.instance.hide();
            }
            initialise() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._table = new SeriesfeedTransporter.ViewModels.Table();
                const checkboxAll = new SeriesfeedTransporter.ViewModels.Checkbox('select-all');
                checkboxAll.subscribe((isEnabled) => this.toggleAllCheckboxes(isEnabled));
                const selectAllColumn = $('<th/>').append(checkboxAll.instance);
                const seriesColumn = $('<th/>').text('Serie');
                const seriesStatusIcon = $('<th/>').text('Beschikbaarheid').css({ textAlign: 'center' });
                this._table.addTheadItems([selectAllColumn, seriesColumn, seriesStatusIcon]);
                const loadingData = $('<div/>');
                const loadingShows = $('<h4/>').css({ padding: '15px' });
                const loadingText = $('<span/>').css({ marginLeft: '10px' }).text("Shows ophalen...");
                const showIcon = $('<i/>').addClass('fa fa-television fa-flip-y');
                loadingData.append(loadingShows);
                loadingShows
                    .append(showIcon)
                    .append(loadingText);
                cardContent
                    .append(loadingData)
                    .append(this._collectingData.instance)
                    .append(this._nextButton.instance);
                SeriesfeedTransporter.Services.BierdopjeService.getTimeWastedByUsername(this._username)
                    .then((shows) => {
                    shows.forEach((show, index) => {
                        const row = $('<tr/>');
                        const selectColumn = $('<td/>');
                        const showColumn = $('<td/>');
                        const statusColumn = $('<td/>').css({ textAlign: 'center' });
                        const loadingIcon = $("<i/>").addClass("fa fa-circle-o-notch fa-spin").css({ color: "#676767", fontSize: "16px" });
                        const checkmarkIcon = $("<i/>").addClass("fa fa-check").css({ color: "#0d5f55", fontSize: "16px" });
                        const warningIcon = $("<i/>").addClass("fa fa-exclamation-triangle").css({ color: "#8e6c2f", fontSize: "16px", marginLeft: "-1px", cursor: 'pointer' });
                        warningIcon.attr('title', "Deze serie staat nog niet op Seriesfeed.");
                        warningIcon.click(() => window.open(SeriesfeedTransporter.Config.BaseUrl + "/series/suggest", '_blank'));
                        statusColumn.append("<i/>");
                        const checkbox = new SeriesfeedTransporter.ViewModels.Checkbox(`show_${index}`);
                        checkbox.subscribe((isEnabled) => {
                            if (isEnabled) {
                                statusColumn.find("i").replaceWith(loadingIcon);
                                this._currentCalls++;
                                this.setCollectingData();
                                SeriesfeedTransporter.Services.BierdopjeService.getTheTvdbIdByShowSlug(show.slug)
                                    .then((theTvdbId) => {
                                    show.theTvdbId = theTvdbId;
                                    SeriesfeedTransporter.Services.SeriesfeedImportService.findShowByTheTvdbId(show.theTvdbId)
                                        .then((result) => {
                                        show.seriesfeedId = result.seriesfeedId;
                                        statusColumn.find("i").replaceWith(checkmarkIcon);
                                        this._currentCalls--;
                                        this.setCollectingData();
                                    })
                                        .catch(() => {
                                        checkbox.uncheck();
                                        statusColumn.find("i").replaceWith(warningIcon);
                                        this._currentCalls--;
                                        this.setCollectingData();
                                    });
                                });
                                this._selectedShows.push(show);
                            }
                            else {
                                const position = this._selectedShows.map((show) => show.name).indexOf(show.name);
                                this._selectedShows.splice(position, 1);
                            }
                            this.setNextButton();
                        });
                        selectColumn.append(checkbox.instance);
                        this._checkboxes.push(checkbox);
                        const showLink = $('<a/>').attr('href', SeriesfeedTransporter.Config.BierdopjeBaseUrl + show.slug).attr('target', '_blank').text(show.name);
                        showColumn.append(showLink);
                        row.append(selectColumn);
                        row.append(showColumn);
                        row.append(statusColumn);
                        this._table.addRow(row);
                    });
                    loadingData.replaceWith(this._table.instance);
                });
            }
            toggleAllCheckboxes(isEnabled) {
                this._checkboxes.forEach((checkbox) => {
                    if (isEnabled) {
                        checkbox.check();
                    }
                    else {
                        checkbox.uncheck();
                    }
                });
            }
            setCollectingData() {
                if (this._currentCalls === 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} serie)...`;
                    this._collectingData.instance.show();
                    return;
                }
                else if (this._currentCalls > 1) {
                    this._collectingData.text = `Gegevens verzamelen (${this._currentCalls} series)...`;
                    this._collectingData.instance.show();
                }
                else {
                    this._collectingData.instance.hide();
                    this.setNextButton();
                }
            }
            setNextButton() {
                if (this._currentCalls > 0) {
                    this._nextButton.instance.hide();
                    return;
                }
                if (this._selectedShows.length === 1) {
                    this._nextButton.text = `${this._selectedShows.length} serie importeren`;
                    this._nextButton.instance.show();
                }
                else if (this._selectedShows.length > 1) {
                    this._nextButton.text = `${this._selectedShows.length} series importeren`;
                    this._nextButton.instance.show();
                }
                else {
                    this._nextButton.instance.hide();
                }
            }
        }
        Controllers.ImportTimeWastedBierdopjeShowSelectionController = ImportTimeWastedBierdopjeShowSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class ImportTimeWastedBierdopjeUserSelectionController {
            constructor() {
                this.initialiseCard();
                this.initialiseCurrentUser();
            }
            initialiseCard() {
                const card = SeriesfeedTransporter.Services.CardService.getCard();
                card.setTitle("Bierdopje Time Wasted importeren");
                card.setBackButtonUrl(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted);
                const breadcrumbs = [
                    new SeriesfeedTransporter.Models.Breadcrumb("Time Wasted importeren", SeriesfeedTransporter.Enums.ShortUrl.Import),
                    new SeriesfeedTransporter.Models.Breadcrumb("Bierdopje", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted),
                    new SeriesfeedTransporter.Models.Breadcrumb("Gebruiker", SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje)
                ];
                card.setBreadcrumbs(breadcrumbs);
            }
            initialiseCurrentUser() {
                const cardContent = $('#' + SeriesfeedTransporter.Config.Id.CardContent);
                this._user = new SeriesfeedTransporter.ViewModels.User();
                this._user.setUsername("Laden...");
                this._user.instance.css({ marginRight: '1%' });
                cardContent.append(this._user.instance);
                const refreshButtonAction = (event) => {
                    event.stopPropagation();
                    this.loadUser();
                };
                const refreshButton = new SeriesfeedTransporter.ViewModels.Button(SeriesfeedTransporter.Enums.ButtonType.Link, "fa-refresh", null, refreshButtonAction);
                refreshButton.instance.css({
                    position: 'absolute',
                    left: '0',
                    bottom: '0'
                });
                this._user.instance.append(refreshButton.instance);
                this.loadUser();
            }
            loadUser() {
                SeriesfeedTransporter.Services.BierdopjeService.getUsername()
                    .then((username) => {
                    if (username == null) {
                        this._user.onClick = null;
                        this._user.setAvatarUrl();
                        this._user.setUsername("Niet ingelogd");
                    }
                    else {
                        this._user.onClick = () => SeriesfeedTransporter.Services.RouterService.navigate(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje + username);
                        this._user.setUsername(username);
                        SeriesfeedTransporter.Services.BierdopjeService.getAvatarUrlByUsername(username)
                            .then((avatarUrl) => this._user.setAvatarUrl(avatarUrl));
                    }
                });
            }
        }
        Controllers.ImportTimeWastedBierdopjeUserSelectionController = ImportTimeWastedBierdopjeUserSelectionController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class NavigationController {
            initialise() {
                SeriesfeedTransporter.Services.NavigationService.add(SeriesfeedTransporter.Enums.NavigationType.Series, 5, "Importeren", SeriesfeedTransporter.Enums.ShortUrl.Import);
                SeriesfeedTransporter.Services.NavigationService.add(SeriesfeedTransporter.Enums.NavigationType.Series, 6, "Exporteren", SeriesfeedTransporter.Enums.ShortUrl.Export);
            }
        }
        Controllers.NavigationController = NavigationController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class NavigationService {
            static add(navigationType, position, text, url) {
                const mainMenuItem = $("ul.main-menu .submenu .inner .top-level:eq(" + navigationType + ")");
                mainMenuItem.find(".main-menu-dropdown li:eq(" + position + ")").before("<li><a href='" + url + "'>" + text + "</a></li>");
            }
        }
        Services.NavigationService = NavigationService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class RoutingController {
            initialise() {
                this.initialVisitRouting();
                this.respondToBrowserNavigationChanges();
            }
            initialVisitRouting() {
                if (window.location.href.startsWith(SeriesfeedTransporter.Config.BaseUrl + SeriesfeedTransporter.Enums.ShortUrl.Import)
                    || window.location.href.startsWith(SeriesfeedTransporter.Config.BaseUrl + SeriesfeedTransporter.Enums.ShortUrl.Export)) {
                    const url = window.location.href.replace(SeriesfeedTransporter.Config.BaseUrl, '');
                    this.initialiseInitialVisit(url);
                    SeriesfeedTransporter.Services.RouterService.navigate(url);
                }
            }
            initialiseInitialVisit(url) {
                window.history.replaceState({ "shortUrl": url }, "", url);
                const mainContent = this.fixPageLayoutAndGetMainContent();
                const card = SeriesfeedTransporter.Services.CardService.initialise();
                mainContent.append(card.instance);
            }
            fixPageLayoutAndGetMainContent() {
                const wrapper = $('.contentWrapper .container').last().empty();
                wrapper.removeClass('container').addClass('wrapper bg');
                const container = $('<div></div>').addClass('container').attr('id', SeriesfeedTransporter.Config.Id.MainContent);
                wrapper.append(container);
                return container;
            }
            respondToBrowserNavigationChanges() {
                window.onpopstate = (event) => {
                    if (event.state == null) {
                        return;
                    }
                    SeriesfeedTransporter.Services.RouterService.navigate(event.state.shortUrl);
                };
            }
        }
        Controllers.RoutingController = RoutingController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class RouterService {
            static navigate(url) {
                if (url == null) {
                    return;
                }
                switch (url) {
                    case SeriesfeedTransporter.Enums.ShortUrl.Import:
                        this.import();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportFavourites:
                        this.importFavourites();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje:
                        this.importFavouritesBierdopje();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb:
                        this.importFavouritesImdb();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWasted:
                        this.importTimeWasted();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje:
                        this.importTimeWastedBierdopje();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.Export:
                        this.export();
                        break;
                    case SeriesfeedTransporter.Enums.ShortUrl.ExportFavourites:
                        this.exportFavourites();
                        break;
                    default:
                        this.navigateOther(url);
                        break;
                }
                window.scrollTo(0, 0);
                window.history.pushState({ "shortUrl": url }, "", url);
            }
            static import() {
                document.title = "Importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportController();
            }
            static importFavourites() {
                document.title = "Favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportFavouritesController();
            }
            static importFavouritesBierdopje() {
                document.title = "Bierdopje favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportBierdopjeFavouritesUserSelectionController();
            }
            static importFavouritesBierdopjeByUsername(username) {
                document.title = "Bierdopje favorieten importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.BierdopjeFavouriteSelectionController(username);
            }
            static importFavouritesImdb() {
                document.title = "IMDb series importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportImdbFavouritesUserSelectionController();
            }
            static importFavouritesImdbByUser(user) {
                document.title = "IMDb lijsten selecteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImdbListSelectionControllerController(user);
            }
            static importTimeWasted() {
                document.title = "Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportTimeWastedController();
            }
            static importTimeWastedBierdopje() {
                document.title = "Bierdopje Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportTimeWastedBierdopjeUserSelectionController();
            }
            static importTimeWastedBierdopjeByUsername(username) {
                document.title = "Bierdopje Time Wasted importeren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ImportTimeWastedBierdopjeShowSelectionController(username);
            }
            static export() {
                document.title = "Exporteren | Seriesfeed";
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ExportController();
            }
            static exportFavourites() {
                document.title = `Favorieten exporteren | Seriesfeed`;
                Services.CardService.getCard().clear();
                new SeriesfeedTransporter.Controllers.ExportFavouritesController();
            }
            static navigateOther(url) {
                if (url.startsWith(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesBierdopje)) {
                    const parts = url.split('/');
                    const username = parts[parts.length - 1];
                    this.importFavouritesBierdopjeByUsername(decodeURIComponent(username));
                    return;
                }
                if (url.startsWith(SeriesfeedTransporter.Enums.ShortUrl.ImportFavouritesImdb)) {
                    const parts = url.split('/');
                    const userId = parts[parts.length - 2];
                    const username = parts[parts.length - 1];
                    const user = new SeriesfeedTransporter.Models.ImdbUser(userId, decodeURIComponent(username));
                    this.importFavouritesImdbByUser(user);
                    return;
                }
                if (url.startsWith(SeriesfeedTransporter.Enums.ShortUrl.ImportTimeWastedBierdopje)) {
                    const parts = url.split('/');
                    const username = parts[parts.length - 1];
                    this.importTimeWastedBierdopjeByUsername(decodeURIComponent(username));
                    return;
                }
            }
        }
        Services.RouterService = RouterService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Controllers;
    (function (Controllers) {
        class SettingsController {
            initialise() {
                if (!window.location.href.includes("users") || !window.location.href.includes("edit")) {
                    return;
                }
                const settingBlocks = $('.container.content .row');
                const localStorageBlock = this.getLocalStorageBlock();
                settingBlocks.append(localStorageBlock);
            }
            getLocalStorageBlock() {
                const block = $('<div/>').addClass('col-xs-12 col-md-6');
                const card = $('<div/>').attr('id', 'userscriptTool').addClass('blog-left cardStyle cardForm');
                const cardContent = $('<div/>').addClass('blog-content');
                const cardTitle = $('<h3/>').text("Userscript Seriesfeed Transporter");
                const cardParagraph = $('<p/>').text("Dit script slaat gegevens van series en afleveringen op om de druk op de gerelateerde servers te verlagen. Deze data wordt gebruikt om (bij terugkerende acties) bekende data niet opnieuw te hoeven ophalen. Je kunt de lokale gegevens wissen als je problemen ondervindt met importeren/exporteren.");
                const dataDeleted = $('<p/>').text("De gegevens zijn gewist.").css({ marginBottom: '0', paddingTop: '5px' }).hide();
                const buttonAction = () => {
                    dataDeleted.hide();
                    SeriesfeedTransporter.Services.StorageService.clearAll();
                    setTimeout(() => dataDeleted.show(), 100);
                };
                const button = new SeriesfeedTransporter.ViewModels.Button('btn-success', 'fa-trash', "Lokale gegevens wissen", buttonAction);
                block.append(card);
                card.append(cardContent);
                cardContent.append(cardTitle);
                cardContent.append(cardParagraph);
                cardContent.append(button.instance);
                cardContent.append(dataDeleted);
                return block;
            }
        }
        Controllers.SettingsController = SettingsController;
    })(Controllers = SeriesfeedTransporter.Controllers || (SeriesfeedTransporter.Controllers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.ButtonType = {
            Default: "btn-default",
            Primary: "btn-primary",
            Success: "btn-success",
            Info: "btn-info",
            Warning: "btn-warning",
            Danger: "btn-danger",
            Link: "btn-link"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.LocalStorageKey = {
            BierdopjeShows: "bierdopje.shows",
            SeriesfeedShows: "seriesfeed.shows",
            SeriesfeedEpisodes: "seriesfeed.episodes"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.MarkType = {
            Obtained: "obtain",
            Seen: "seen"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        let NavigationType;
        (function (NavigationType) {
            NavigationType[NavigationType["Series"] = 0] = "Series";
            NavigationType[NavigationType["Fora"] = 1] = "Fora";
            NavigationType[NavigationType["Nieuws"] = 2] = "Nieuws";
            NavigationType[NavigationType["Community"] = 3] = "Community";
        })(NavigationType = Enums.NavigationType || (Enums.NavigationType = {}));
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.SeriesfeedError = {
            Unknown: "Unknown",
            NotFound: "Geen serie gevonden voor de gegeven data",
            CouldNotUpdateStatus: "Kon favorietenstatus niet bijwerken!"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Enums;
    (function (Enums) {
        Enums.ShortUrl = {
            Import: "/series/import/",
            ImportFavourites: "/series/import/favourites/",
            ImportFavouritesBierdopje: "/series/import/favourites/bierdopje/",
            ImportFavouritesImdb: "/series/import/favourites/imdb/",
            ImportTimeWasted: "/series/import/timewasted/",
            ImportTimeWastedBierdopje: "/series/import/timewasted/bierdopje/",
            Export: "/series/export/",
            ExportFavourites: "/series/export/favourites/"
        };
    })(Enums = SeriesfeedTransporter.Enums || (SeriesfeedTransporter.Enums = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class Breadcrumb {
            constructor(text, shortUrl) {
                this.text = text;
                this.shortUrl = shortUrl;
            }
        }
        Models.Breadcrumb = Breadcrumb;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class Episode {
        }
        Models.Episode = Episode;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class LocalEpisode {
        }
        Models.LocalEpisode = LocalEpisode;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class Season {
        }
        Models.Season = Season;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Models;
    (function (Models) {
        class Show {
        }
        Models.Show = Show;
    })(Models = SeriesfeedTransporter.Models || (SeriesfeedTransporter.Models = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Providers;
    (function (Providers) {
        class TextInputProvider {
            static provide(width, placeholder, value) {
                return $('<input/>')
                    .attr('type', 'text')
                    .attr('placeholder', placeholder)
                    .attr('value', value)
                    .addClass('form-control')
                    .css({ maxWidth: width });
            }
        }
        Providers.TextInputProvider = TextInputProvider;
    })(Providers = SeriesfeedTransporter.Providers || (SeriesfeedTransporter.Providers = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class AjaxService {
            static get(url) {
                const request = new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: (pageData) => {
                            resolve(pageData);
                        },
                        onerror: (error) => {
                            reject(error);
                        }
                    });
                });
                return this.queue(request);
            }
            static queue(request) {
                if (this._currentCalls < SeriesfeedTransporter.Config.MaxAsyncCalls) {
                    this._currentCalls++;
                    return request
                        .then((result) => {
                        this._currentCalls--;
                        return result;
                    })
                        .catch((error) => {
                        this._currentCalls--;
                        return error;
                    });
                }
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.queue(request));
                    }, 300);
                });
            }
            static post(url, data) {
                const request = new Promise((resolve, reject) => {
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: data,
                        dataType: "json"
                    }).done((data) => {
                        resolve(data);
                    }).fail((error) => {
                        reject(error);
                    });
                });
                return this.queue(request);
            }
        }
        AjaxService._currentCalls = 0;
        Services.AjaxService = AjaxService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class BierdopjeService {
            static getUsername() {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/stats")
                    .then((result) => {
                    const statsData = $(result.responseText);
                    return statsData.find("#userbox_loggedin").find("h4").html();
                })
                    .catch((error) => {
                    throw `Could not get username from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static isExistingUser(username) {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((result) => {
                    const data = $(result.responseText);
                    return data.find("#page .maincontent .content-links .content h3").html() !== "Fout - Pagina niet gevonden";
                })
                    .catch((error) => {
                    throw `Could not check for existing user ${username} on ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}: ${error}`;
                });
            }
            static getAvatarUrlByUsername(username) {
                return Services.AjaxService.get(SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/user/" + username + "/profile")
                    .then((result) => {
                    const data = $(result.responseText);
                    return data.find('img.avatar').attr('src');
                })
                    .catch((error) => {
                    throw `Could not get avatar url for user ${username} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getFavouritesByUsername(username) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/users/" + username + "/shows";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const data = $(result.responseText);
                    const dataRow = data.find(".content").find("ul").find("li").find("a");
                    const favourites = new Array();
                    dataRow.each((index, favourite) => {
                        const show = new SeriesfeedTransporter.Models.Show();
                        show.name = $(favourite).text();
                        show.slug = $(favourite).attr('href');
                        favourites.push(show);
                    });
                    return favourites;
                })
                    .catch((error) => {
                    window.alert(`Kan geen favorieten vinden voor ${username}. Dit kan komen doordat de gebruiker niet bestaat, geen favorieten heeft of er is iets mis met je verbinding.`);
                    throw `Could not get favourites for ${username} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getTheTvdbIdByShowSlug(showSlug) {
                const localTheTvdbId = this.getTvdbIdByShowSlugFromStorage(showSlug);
                if (localTheTvdbId != null) {
                    return Promise.resolve(localTheTvdbId);
                }
                return this.getTvdbIdByShowSlugFromApi(showSlug)
                    .then((theTvdbId) => {
                    this.addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug);
                    return theTvdbId;
                });
            }
            static getTvdbIdByShowSlugFromStorage(showSlug) {
                const localShow = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.BierdopjeShows);
                if (localShow != null) {
                    for (let i = 0; i < localShow.length; i++) {
                        if (localShow[i].slug === showSlug) {
                            return localShow[i].theTvdbId;
                        }
                    }
                }
                return null;
            }
            static getTvdbIdByShowSlugFromApi(showSlug) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + showSlug;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const favouriteData = $(result.responseText);
                    const theTvdbId = favouriteData.find(`a[href^='${SeriesfeedTransporter.Config.TheTvdbBaseUrl}']`).html();
                    return theTvdbId;
                })
                    .catch((error) => {
                    throw `Could not get the TVDB of ${showSlug} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static addTvdbIdWithShowSlugToStorage(theTvdbId, showSlug) {
                let localIds = Services.StorageService.get(SeriesfeedTransporter.Enums.LocalStorageKey.BierdopjeShows);
                if (localIds == null) {
                    localIds = new Array();
                }
                localIds.push({ theTvdbId: theTvdbId, slug: showSlug });
                Services.StorageService.set(SeriesfeedTransporter.Enums.LocalStorageKey.BierdopjeShows, localIds);
            }
            static getTimeWastedByUsername(username) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + "/user/" + username + "/timewasted";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const bdTimeWastedData = $(result.responseText);
                    const timeWastedRows = bdTimeWastedData.find('table tr');
                    const shows = new Array();
                    timeWastedRows.each((index, timeWastedRow) => {
                        if (index === 0 || index === timeWastedRows.length - 1) {
                            return;
                        }
                        const show = new SeriesfeedTransporter.Models.Show();
                        show.name = $(timeWastedRow).find('td a').html();
                        show.slug = $(timeWastedRow).find('td a').attr('href');
                        shows.push(show);
                    });
                    return Services.ShowSorterService.sort(shows, "name");
                })
                    .catch((error) => {
                    throw `Could not get Time Wasted for user ${username} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getShowSeasonsByShowSlug(showSlug) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + showSlug + "/episodes/season/";
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const seasonsPageData = $(result.responseText);
                    const seasonsData = seasonsPageData.find('#page .maincontent .content .rightfloat select option');
                    const seasons = new Array();
                    seasonsData.each((index, seasonData) => {
                        const season = new SeriesfeedTransporter.Models.Season();
                        const seasonIdMatches = $(seasonData).text().match(/\d+/);
                        season.id = seasonIdMatches != null ? +seasonIdMatches[0] : 0;
                        season.slug = $(seasonData).attr('value');
                        seasons.push(season);
                    });
                    return seasons;
                })
                    .catch((error) => {
                    throw `Could not get seasons for show ${showSlug} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
            static getShowSeasonEpisodesBySeasonSlug(seasonSlug) {
                const url = SeriesfeedTransporter.Config.BierdopjeBaseUrl + seasonSlug;
                return Services.AjaxService.get(url)
                    .then((result) => {
                    const episodesPageData = $(result.responseText);
                    const episodesData = episodesPageData.find('.content .listing tr');
                    const episodes = new Array();
                    episodesData.each((index, episodeData) => {
                        if (index === 0) {
                            return;
                        }
                        const episode = new SeriesfeedTransporter.Models.Episode();
                        episode.tag = $(episodeData).find("td:eq(1)").text();
                        const acquiredStatus = $(episodeData).find('.AquiredItem[src="http://cdn.bierdopje.eu/g/if/blob-green.png"]').length;
                        episode.acquired = acquiredStatus === 1;
                        const seenStatus = $(episodeData).find('.SeenItem[src="http://cdn.bierdopje.eu/g/if/blob-green.png"]').length;
                        episode.seen = seenStatus === 1;
                        episodes.push(episode);
                    });
                    return episodes;
                })
                    .catch((error) => {
                    throw `Could not get episodes for show ${seasonSlug} from ${SeriesfeedTransporter.Config.BierdopjeBaseUrl}. ${error}`;
                });
            }
        }
        Services.BierdopjeService = BierdopjeService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class CardService {
            static initialise() {
                this.card = new SeriesfeedTransporter.ViewModels.Card();
                return this.card;
            }
            static getCard() {
                return this.card;
            }
        }
        Services.CardService = CardService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class DateTimeService {
            static getCurrentDateTime() {
                let now = new Date();
                let dd = now.getDate().toString();
                let mm = (now.getMonth() + 1).toString();
                let hh = now.getHours().toString();
                let mi = now.getMinutes().toString();
                const yyyy = now.getFullYear();
                if (+dd < 10) {
                    dd = '0' + dd;
                }
                if (+mm < 10) {
                    mm = '0' + mm;
                }
                if (+hh < 10) {
                    hh = '0' + hh;
                }
                if (+mi < 10) {
                    mi = '0' + mi;
                }
                return dd + '-' + mm + '-' + yyyy + '_' + hh + ':' + mi;
            }
        }
        Services.DateTimeService = DateTimeService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class ShowSorterService {
            static sort(shows, property) {
                return shows.sort((showA, showB) => {
                    if (showA[property] < showB[property]) {
                        return -1;
                    }
                    else if (showA[property] === showB[property]) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                });
            }
        }
        Services.ShowSorterService = ShowSorterService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class StorageService {
            static get(key) {
                const jsonValue = localStorage.getItem(key);
                return JSON.parse(jsonValue);
            }
            static set(key, value) {
                const jsonValue = JSON.stringify(value);
                localStorage.setItem(key, jsonValue);
            }
            static clearAll() {
                for (const key in SeriesfeedTransporter.Enums.LocalStorageKey) {
                    localStorage.removeItem(SeriesfeedTransporter.Enums.LocalStorageKey[key]);
                }
            }
        }
        Services.StorageService = StorageService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class TimeAgoTranslatorService {
            static getDutchTranslationOfTime(original) {
                switch (original) {
                    case "years":
                    case "year":
                        return "jaar";
                    case "months":
                        return "maanden";
                    case "month":
                        return "maand";
                    case "weeks":
                        return "weken";
                    case "week":
                        return "week";
                    case "days":
                        return "dagen";
                    case "day":
                        return "dag";
                    case "hours":
                    case "hour":
                        return "uur";
                    case "minutes":
                        return "minuten";
                    case "minute":
                        return "minuut";
                    case "seconds":
                        return "seconden";
                    case "second":
                        return "seconde";
                }
            }
            static getFullDutchTranslationOfMonthAbbreviation(month) {
                switch (month) {
                    case "Jan":
                        return "januari";
                    case "Feb":
                        return "februari";
                    case "Mar":
                        return "maart";
                    case "Apr":
                        return "april";
                    case "May":
                        return "mei";
                    case "Jun":
                        return "juni";
                    case "Jul":
                        return "juli";
                    case "Aug":
                        return "augustus";
                    case "Sep":
                        return "september";
                    case "Oct":
                        return "oktober";
                    case "Nov":
                        return "november";
                    case "Dec":
                        return "december";
                }
            }
        }
        Services.TimeAgoTranslatorService = TimeAgoTranslatorService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class Button {
            constructor(buttonType, iconClass, text, action, width) {
                this.instance = $('<div/>').addClass('btn');
                this.icon = $('<i/>').addClass('fa');
                this.text = $('<span/>');
                this.setButtonType(buttonType);
                this.setClick(action);
                this.setIcon(iconClass);
                this.setText(text);
                this.setWidth(width);
                this.instance.append(this.icon);
                this.instance.append(this.text);
            }
            setButtonType(buttonType) {
                if (this.currentButtonType != null || this.currentButtonType !== "") {
                    this.instance.removeClass(this.currentButtonType);
                    this.currentButtonType = null;
                }
                this.instance.addClass(buttonType);
                this.currentButtonType = buttonType;
            }
            setClick(action) {
                this.instance.unbind('click');
                if (action == null) {
                    return;
                }
                this.instance.click(action);
            }
            setIcon(iconClass) {
                if (this.currentIconClass != null || this.currentIconClass !== "") {
                    this.icon.removeClass(this.currentIconClass);
                    this.currentIconClass = null;
                }
                this.icon.addClass(iconClass);
                this.currentIconClass = iconClass;
            }
            setText(text) {
                if (text == null) {
                    this.text.text('');
                    return;
                }
                this.text.text(text);
            }
            setWidth(width) {
                this.instance.css({
                    width: width == null ? 'auto' : width
                });
            }
        }
        ViewModels.Button = Button;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class Card {
            constructor() {
                this.instance = $('<div/>').addClass("cardStyle cardForm formBlock").css({ transition: 'max-width .3s ease-in-out' });
                this.backButton = this.createBackButton();
                const titleContainer = $('<h2/>').css({ height: '60px' });
                this.title = $('<span/>');
                this.breadcrumbs = this.createBreadcrumbs();
                this.content = $('<div/>').attr('id', SeriesfeedTransporter.Config.Id.CardContent).addClass("cardFormInner");
                this.instance.append(titleContainer);
                titleContainer.append(this.title);
                titleContainer.append(this.backButton);
                this.instance.append(this.breadcrumbs);
                this.instance.append(this.content);
            }
            createBackButton() {
                return $('<i/>').css({
                    display: 'none',
                    float: 'left',
                    padding: '5px',
                    margin: '-4px',
                    cursor: 'pointer',
                    position: 'relative',
                    left: '10px'
                }).addClass("fa fa-arrow-left");
            }
            createBreadcrumbs() {
                const breadcrumbs = $('<h2/>').css({
                    display: 'none',
                    fontSize: '12px',
                    padding: '10px 15px',
                    background: '#5f7192',
                    borderRadius: '0 0 0 0',
                    mozBorderRadius: '0 0 0 0',
                    webkitBorderRadius: '0 0 0 0'
                });
                return breadcrumbs;
            }
            setBackButtonUrl(url) {
                this.backButton.hide();
                this.backButton.click(() => { });
                if (url == null) {
                    return;
                }
                this.backButton.show();
                this.backButton.click(() => SeriesfeedTransporter.Services.RouterService.navigate(url));
            }
            setTitle(title) {
                if (title == null) {
                    title = '';
                }
                this.title.text(title);
            }
            setBreadcrumbs(breadcrumbs) {
                this.breadcrumbs.hide();
                this.breadcrumbs.empty();
                if (breadcrumbs == null || breadcrumbs.length === 0) {
                    return;
                }
                for (let i = 0; i < breadcrumbs.length; i++) {
                    const breadcrumb = breadcrumbs[i];
                    const link = $('<span/>').text(breadcrumb.text);
                    if (breadcrumb.shortUrl != null) {
                        link
                            .css({ cursor: 'pointer', color: '#bfc6d2' })
                            .click(() => SeriesfeedTransporter.Services.RouterService.navigate(breadcrumb.shortUrl));
                    }
                    this.breadcrumbs.append(link);
                    if (i < breadcrumbs.length - 1) {
                        const chevronRight = $('<i/>')
                            .addClass('fa fa-chevron-right')
                            .css({
                            fontSize: '9px',
                            padding: '0 5px',
                            cursor: 'default'
                        });
                        this.breadcrumbs.append(chevronRight);
                    }
                    else {
                        link.css({ color: '#ffffff' });
                    }
                }
                this.breadcrumbs.show();
            }
            setContent(content) {
                this.content.empty();
                if (content == null) {
                    return;
                }
                this.content.append(content);
            }
            clear() {
                this.setTitle(null);
                this.setBackButtonUrl(null);
                this.setBreadcrumbs(null);
                this.setContent(null);
                this.setWidth();
            }
            setWidth(width) {
                this.instance.css({
                    maxWidth: width != null ? width : '400px'
                });
            }
        }
        ViewModels.Card = Card;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class CardButton {
            constructor(text, topAreaColour) {
                this.instance = $('<a/>').addClass("portfolio mix_all");
                const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle");
                this.topArea = $('<div/>').addClass("portfolio-hover").css({ height: '100px' });
                const info = $('<div/>').addClass("portfolio-info");
                const title = $('<div/>').addClass("portfolio-title");
                const h4 = $('<h4/>').text(text);
                this.instance
                    .css({
                    textDecoration: 'none',
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                })
                    .hover(() => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }), () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                }));
                this.topArea
                    .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    background: topAreaColour
                });
                this.instance.append(wrapper);
                wrapper.append(this.topArea);
                wrapper.append(info);
                info.append(title);
                title.append(h4);
            }
        }
        ViewModels.CardButton = CardButton;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class Checkbox {
            constructor(name) {
                this.instance = $('<fieldset/>');
                this.input = $('<input/>').attr('type', 'checkbox').addClass('hideCheckbox');
                this.label = $('<label/>');
                const span = $('<span/>').addClass('check');
                this.instance.append(this.input);
                this.instance.append(this.label);
                this.label.append(span);
                if (name != null && name !== '') {
                    this.name = name;
                }
                this.subscribers = [];
                this.input.click(() => this.toggleCheck());
            }
            set name(value) {
                this.input
                    .attr('id', value)
                    .attr('name', value);
                this.label.attr('for', value);
            }
            toggleCheck() {
                if (this.input.attr('checked') == null) {
                    this.input.attr('checked', 'checked');
                    this.callSubscribers(true);
                }
                else {
                    this.input.removeAttr('checked');
                    this.callSubscribers(false);
                }
            }
            callSubscribers(isEnabled) {
                this.subscribers.forEach((subscriber) => {
                    subscriber(isEnabled);
                });
            }
            subscribe(subscriber) {
                this.subscribers.push(subscriber);
            }
            check() {
                if (this.input.attr('checked') == null) {
                    this.input.click();
                    this.input.attr('checked', 'checked');
                }
            }
            uncheck() {
                if (this.input.attr('checked') != null) {
                    this.input.click();
                    this.input.removeAttr('checked');
                }
            }
        }
        ViewModels.Checkbox = Checkbox;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class ReadMoreButton {
            constructor(text, action) {
                this.instance = $('<div/>').addClass('readMore').css({ paddingRight: '10px' });
                const innerButton = $('<div/>').css({ textAlign: 'right' });
                this.link = $('<a/>');
                this.instance.append(innerButton);
                innerButton.append(this.link);
                this.text = text;
                this.setClick(action);
            }
            set text(value) {
                if (value == null) {
                    this.link.text('');
                    return;
                }
                this.link.text(value);
            }
            setClick(action) {
                this.instance.css({ cursor: 'default' }).unbind('click');
                if (action == null) {
                    return;
                }
                this.instance
                    .css({ cursor: 'pointer' })
                    .click(action);
            }
        }
        ViewModels.ReadMoreButton = ReadMoreButton;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class Table {
            constructor() {
                this.instance = $('<table/>').addClass('table table-hover responsiveTable stacktable large-only thicken-header');
                const thead = $('<thead/>');
                this.headerRow = $('<tr/>');
                this.tbody = $('<tbody/>');
                thead.append(this.headerRow);
                this.instance.append(thead);
                this.instance.append(this.tbody);
            }
            addHeaderItem(th) {
                this.headerRow.append(th);
            }
            addTheadItems(thCollection) {
                thCollection.map((th) => this.headerRow.append(th));
            }
            addRow(tr) {
                this.tbody.append(tr);
            }
            getRow(index) {
                const row = this.tbody.children()[index];
                return $(row);
            }
            updateRow(index, value) {
                const row = this.tbody.children()[index];
                return $(row).replaceWith(value);
            }
        }
        ViewModels.Table = Table;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var ViewModels;
    (function (ViewModels) {
        class User {
            constructor() {
                this.unknownUserAvatarBase64 = "data:image/jpeg;base64,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";
                this.instance = $('<div/>').addClass("portfolio mix_all");
                const wrapper = $('<div/>').addClass("portfolio-wrapper cardStyle").css({ cursor: 'inherit' });
                this.topText = $('<h4/>').css({ padding: '15px 0 0 15px' });
                const hover = $('<div/>').addClass("portfolio-hover").css({ padding: '15px 15px 5px 15px', height: '170px' });
                this.avatar = $('<img/>').addClass("user-img").css({ maxHeight: '150px' }).attr('src', this.unknownUserAvatarBase64);
                this.username = $('<h3/>').addClass("user-name");
                const info = $('<div/>').addClass("portfolio-info").css({ height: '90px' });
                const title = $('<div/>').addClass("portfolio-title");
                this.instance
                    .css({
                    position: 'relative',
                    display: 'inline-block',
                    width: '100%',
                    transition: 'all .24s ease-in-out'
                });
                hover
                    .css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });
                this.instance.append(wrapper);
                wrapper.append(this.topText);
                wrapper.append(hover);
                hover.append(this.avatar);
                wrapper.append(info);
                info.append(title);
                title.append(this.username);
            }
            setTopText(text) {
                this.topText.text(text);
            }
            setUsername(username) {
                this.username.text(username);
            }
            replaceUsername(element) {
                this.username.replaceWith(element);
            }
            setAvatarUrl(avatarUrl) {
                if (avatarUrl == null || avatarUrl === "") {
                    this.avatar.attr('src', this.unknownUserAvatarBase64);
                }
                this.avatar.attr('src', avatarUrl);
            }
            setWidth(width) {
                this.instance.css({
                    width: width != null ? width : 'auto'
                });
            }
            set onClick(action) {
                this.instance.css({ cursor: 'default' }).unbind('mouseenter mouseleave click');
                if (action == null) {
                    return;
                }
                this.instance
                    .css({ cursor: 'pointer' })
                    .hover(() => this.instance.css({
                    webkitBoxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)',
                    boxShadow: '0px 4px 3px 0px rgba(0, 0, 0, 0.15)'
                }), () => this.instance.css({
                    webkitBoxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.0)'
                }))
                    .click(action);
            }
        }
        ViewModels.User = User;
    })(ViewModels = SeriesfeedTransporter.ViewModels || (SeriesfeedTransporter.ViewModels = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));
var SeriesfeedTransporter;
(function (SeriesfeedTransporter) {
    var Services;
    (function (Services) {
        class StyleService {
            static loadGlobalStyle() {
                const css = `<style>
            input[type="checkbox"] + label span {
                margin-top: -3px;
            }

            fieldset {
                margin-top: 0px !important;
            }

            .progress {
                width: 90%;
                margin: 0 auto;
            }

            .progress-bar {
                background: #447C6F;
            }

            .fa-flip-x {
                animation-name: flipX;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: ease-in-out;
            }

            @keyframes flipX {
                0% {
                    transform: rotateX(0);
                }
                50% {
                    transform: rotateX(180deg);
                }
            }

            .fa-flip-y {
                animation-name: flipY;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
                animation-timing-function: ease-in-out;
            }

            @keyframes flipY {
                0% {
                    transform: rotateY(0);
                }
                50% {
                    transform: rotateY(180deg);
                }
            }

            .table.thicken-header thead {
                border-bottom: 2px solid #d9d9d9;
            }

            .brackets {
                text-rendering: auto;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
        </style>`;
                $('body').append(css);
            }
        }
        Services.StyleService = StyleService;
    })(Services = SeriesfeedTransporter.Services || (SeriesfeedTransporter.Services = {}));
})(SeriesfeedTransporter || (SeriesfeedTransporter = {}));

// ==UserScript==
// @name         verkehr.autobahn.de Overlay
// @namespace    https://wme.rest
// @license      MIT
// @version      0.1.3
// @description  verkehr.autobahn.de Overlay for Traffic & Info-Boxes
// @author       vertexcode
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @connect      verkehr.autobahn.de
// @connect      geotiles.autobahn.de
// @icon         https://www.google.com/s2/favicons?sz=128&domain=waze.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472007/verkehrautobahnde%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/472007/verkehrautobahnde%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let uWaze, uOpenLayers;
    let pinLayer;

    const mtotypes = {
        'CLOSURE': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Zeichen_250_-_Verbot_f%C3%BCr_Fahrzeuge_aller_Art%2C_StVO_1970.svg',
        'CLOSURE_TRUCKS': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Zeichen_253_-_Verbot_f%C3%BCr_Kraftfahrzeuge_mit_einem_zul%C3%A4ssigen_Gesamtgewicht%2C_StVO_1992.svg/1920px-Zeichen_253_-_Verbot_f%C3%BCr_Kraftfahrzeuge_mit_einem_zul%C3%A4ssigen_Gesamtgewicht%2C_StVO_1992.svg.png',
        'CLOSURE_ENTRY_EXIT': 'https://wme.rest/img/CLOSURE_ENTRY_EXIT.png',
        'CONGESTION': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Zeichen_124_-_Stau%2C_StVO_1992.svg',
        'PLANED_CLOSURE': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Zeichen_250_-_Verbot_f%C3%BCr_Fahrzeuge_aller_Art%2C_StVO_1970.svg',
        'PLANED_ROADWORKS': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Zeichen_123_-_Arbeitsstelle%2C_StVO_2013.svg',
        'REROUTING': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Zeichen_455.1-22_-_Ank%C3%BCndigung_oder_Fortsetzung_der_Umleitung%2C_rechts_einordnen%2C_StVO_2013.svg/1280px-Zeichen_455.1-22_-_Ank%C3%BCndigung_oder_Fortsetzung_der_Umleitung%2C_rechts_einordnen%2C_StVO_2013.svg.png',
        'SHORT_TERM_ROADWORKS': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Zeichen_123_-_Arbeitsstelle%2C_StVO_2013.svg',
        'ROADWORKS': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Zeichen_123_-_Arbeitsstelle%2C_StVO_2013.svg',
        'WARNING': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Zeichen_101_-_Gefahrstelle%2C_StVO_1970.svg',
        'WEIGHT_LIMIT_35': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Zeichen_253_-_Verbot_f%C3%BCr_Kraftfahrzeuge_mit_einem_zul%C3%A4ssigen_Gesamtgewicht%2C_StVO_1992.svg/1920px-Zeichen_253_-_Verbot_f%C3%BCr_Kraftfahrzeuge_mit_einem_zul%C3%A4ssigen_Gesamtgewicht%2C_StVO_1992.svg.png'
    };

    const loadWMSFormat = () => {
        if (uOpenLayers.Layer.WMTS) {
            return;
        }

        /**
         * Class: OpenLayers.Format.OGCExceptionReport
         * Class to read exception reports for various OGC services and versions.
         *
         * Inherits from:
         *  - <OpenLayers.Format.XML>
         */
        uOpenLayers.Format.OGCExceptionReport = uOpenLayers.Class(uOpenLayers.Format.XML, {

            /**
             * Property: namespaces
             * {Object} Mapping of namespace aliases to namespace URIs.
             */
            namespaces: {
                ogc: "http://www.opengis.net/ogc"
            },

            /**
             * Property: regExes
             * Compiled regular expressions for manipulating strings.
             */
            regExes: {
                trimSpace: (/^\s*|\s*$/g),
                removeSpace: (/\s*/g),
                splitSpace: (/\s+/),
                trimComma: (/\s*,\s*/g)
            },

            /**
             * Property: defaultPrefix
             */
            defaultPrefix: "ogc",

            /**
             * Constructor: OpenLayers.Format.OGCExceptionReport
             * Create a new parser for OGC exception reports.
             *
             * Parameters:
             * options - {Object} An optional object whose properties will be set on
             *     this instance.
             */

            /**
             * APIMethod: read
             * Read OGC exception report data from a string, and return an object with
             * information about the exceptions.
             *
             * Parameters:
             * data - {String} or {DOMElement} data to read/parse.
             *
             * Returns:
             * {Object} Information about the exceptions that occurred.
             */
            read: function (data) {
                var result;
                if (typeof data == "string") {
                    data = uOpenLayers.Format.XML.prototype.read.apply(this, [data]);
                }
                var root = data.documentElement;
                var exceptionInfo = {exceptionReport: null};
                if (root) {
                    this.readChildNodes(data, exceptionInfo);
                    if (exceptionInfo.exceptionReport === null) {
                        // fall-back to OWSCommon since this is a common output format for exceptions
                        // we cannot easily use the ows readers directly since they differ for 1.0 and 1.1
                        exceptionInfo = new uOpenLayers.Format.OWSCommon().read(data);
                    }
                }
                return exceptionInfo;
            },

            /**
             * Property: readers
             * Contains public functions, grouped by namespace prefix, that will
             *     be applied when a namespaced node is found matching the function
             *     name.  The function will be applied in the scope of this parser
             *     with two arguments: the node being read and a context object passed
             *     from the parent.
             */
            readers: {
                "ogc": {
                    "ServiceExceptionReport": function (node, obj) {
                        obj.exceptionReport = {exceptions: []};
                        this.readChildNodes(node, obj.exceptionReport);
                    },
                    "ServiceException": function (node, exceptionReport) {
                        var exception = {
                            code: node.getAttribute("code"),
                            locator: node.getAttribute("locator"),
                            text: this.getChildValue(node)
                        };
                        exceptionReport.exceptions.push(exception);
                    }
                }
            },

            CLASS_NAME: "OpenLayers.Format.OGCExceptionReport"
        });

        /**
         * Class: OpenLayers.Format.XML.VersionedOGC
         * Base class for versioned formats, i.e. a format which supports multiple
         * versions.
         *
         * To enable checking if parsing succeeded, you will need to define a property
         * called errorProperty on the parser you want to check. The parser will then
         * check the returned object to see if that property is present. If it is, it
         * assumes the parsing was successful. If it is not present (or is null), it will
         * pass the document through an OGCExceptionReport parser.
         *
         * If errorProperty is undefined for the parser, this error checking mechanism
         * will be disabled.
         *
         *
         *
         * Inherits from:
         *  - <OpenLayers.Format.XML>
         */
        uOpenLayers.Format.XML.VersionedOGC = uOpenLayers.Class(uOpenLayers.Format.XML, {

            /**
             * APIProperty: defaultVersion
             * {String} Version number to assume if none found.
             */
            defaultVersion: null,

            /**
             * APIProperty: version
             * {String} Specify a version string if one is known.
             */
            version: null,

            /**
             * APIProperty: profile
             * {String} If provided, use a custom profile.
             */
            profile: null,

            /**
             * APIProperty: allowFallback
             * {Boolean} If a profiled parser cannot be found for the returned version,
             * use a non-profiled parser as the fallback. Application code using this
             * should take into account that the return object structure might be
             * missing the specifics of the profile. Defaults to false.
             */
            allowFallback: false,

            /**
             * Property: name
             * {String} The name of this parser, this is the part of the CLASS_NAME
             * except for "OpenLayers.Format."
             */
            name: null,

            /**
             * APIProperty: stringifyOutput
             * {Boolean} If true, write will return a string otherwise a DOMElement.
             * Default is false.
             */
            stringifyOutput: false,

            /**
             * Property: parser
             * {Object} Instance of the versioned parser.  Cached for multiple read and
             *     write calls of the same version.
             */
            parser: null,

            /**
             * Constructor: OpenLayers.Format.XML.VersionedOGC.
             * Constructor.
             *
             * Parameters:
             * options - {Object} Optional object whose properties will be set on
             *     the object.
             */
            initialize: function (options) {
                uOpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
                var className = this.CLASS_NAME;
                this.name = className.substring(className.lastIndexOf(".") + 1);
            },

            /**
             * Method: getVersion
             * Returns the version to use. Subclasses can override this function
             * if a different version detection is needed.
             *
             * Parameters:
             * root - {DOMElement}
             * options - {Object} Optional configuration object.
             *
             * Returns:
             * {String} The version to use.
             */
            getVersion: function (root, options) {
                var version;
                // read
                if (root) {
                    version = this.version;
                    if (!version) {
                        version = root.getAttribute("version");
                        if (!version) {
                            version = this.defaultVersion;
                        }
                    }
                } else { // write
                    version = (options && options.version) ||
                        this.version || this.defaultVersion;
                }
                return version;
            },

            /**
             * Method: getParser
             * Get an instance of the cached parser if available, otherwise create one.
             *
             * Parameters:
             * version - {String}
             *
             * Returns:
             * {<OpenLayers.Format>}
             */
            getParser: function (version) {
                version = version || this.defaultVersion;
                var profile = this.profile ? "_" + this.profile : "";
                if (!this.parser || this.parser.VERSION != version) {
                    var format = uOpenLayers.Format[this.name][
                    "v" + version.replace(/\./g, "_") + profile
                        ];
                    if (!format) {
                        if (profile !== "" && this.allowFallback) {
                            // fallback to the non-profiled version of the parser
                            profile = "";
                            format = uOpenLayers.Format[this.name][
                            "v" + version.replace(/\./g, "_")
                                ];
                        }
                        if (!format) {
                            throw "Can't find a " + this.name + " parser for version " +
                            version + profile;
                        }
                    }
                    this.parser = new format(this.options);
                }
                return this.parser;
            },

            /**
             * APIMethod: write
             * Write a document.
             *
             * Parameters:
             * obj - {Object} An object representing the document.
             * options - {Object} Optional configuration object.
             *
             * Returns:
             * {String} The document as a string
             */
            write: function (obj, options) {
                var version = this.getVersion(null, options);
                this.parser = this.getParser(version);
                var root = this.parser.write(obj, options);
                if (this.stringifyOutput === false) {
                    return root;
                } else {
                    return uOpenLayers.Format.XML.prototype.write.apply(this, [root]);
                }
            },

            /**
             * APIMethod: read
             * Read a doc and return an object representing the document.
             *
             * Parameters:
             * data - {String | DOMElement} Data to read.
             * options - {Object} Options for the reader.
             *
             * Returns:
             * {Object} An object representing the document.
             */
            read: function (data, options) {
                if (typeof data == "string") {
                    data = uOpenLayers.Format.XML.prototype.read.apply(this, [data]);
                }
                var root = data.documentElement;
                var version = this.getVersion(root);
                this.parser = this.getParser(version);          // Select the parser
                var obj = this.parser.read(data, options);      // Parse the data

                var errorProperty = this.parser.errorProperty || null;
                if (errorProperty !== null && obj[errorProperty] === undefined) {
                    // an error must have happened, so parse it and report back
                    var format = new uOpenLayers.Format.OGCExceptionReport();
                    obj.error = format.read(data);
                }
                obj.version = version;
                return obj;
            },

            CLASS_NAME: "OpenLayers.Format.XML.VersionedOGC"
        });
        /**
         * Class: OpenLayers.Format.WMTSCapabilities
         * Read WMTS Capabilities.
         *
         * Inherits from:
         *  - <OpenLayers.Format.XML.VersionedOGC>
         */
        uOpenLayers.Format.WMTSCapabilities = uOpenLayers.Class(uOpenLayers.Format.XML.VersionedOGC, {

            /**
             * APIProperty: defaultVersion
             * {String} Version number to assume if none found.  Default is "1.0.0".
             */
            defaultVersion: "1.0.0",

            /**
             * APIProperty: yx
             * {Object} Members in the yx object are used to determine if a CRS URN
             *     corresponds to a CRS with y,x axis order.  Member names are CRS URNs
             *     and values are boolean.  By default, the following CRS URN are
             *     assumed to correspond to a CRS with y,x axis order:
             *
             * * urn:ogc:def:crs:EPSG::4326
             */
            yx: {
                "urn:ogc:def:crs:EPSG::4326": true
            },

            /**
             * Constructor: OpenLayers.Format.WMTSCapabilities
             * Create a new parser for WMTS capabilities.
             *
             * Parameters:
             * options - {Object} An optional object whose properties will be set on
             *     this instance.
             */

            /**
             * APIMethod: read
             * Read capabilities data from a string, and return information about
             * the service (offering and observedProperty mostly).
             *
             * Parameters:
             * data - {String} or {DOMElement} data to read/parse.
             *
             * Returns:
             * {Object} Info about the WMTS Capabilities
             */

            /**
             * APIMethod: createLayer
             * Create a WMTS layer given a capabilities object.
             *
             * Parameters:
             * capabilities - {Object} The object returned from a <read> call to this
             *     format.
             * config - {Object} Configuration properties for the layer.  Defaults for
             *     the layer will apply if not provided.
             *
             * Required config properties:
             * layer - {String} The layer identifier.
             *
             * Optional config properties:
             * matrixSet - {String} The matrix set identifier, required if there is
             *      more than one matrix set in the layer capabilities.
             * style - {String} The name of the style
             * format - {String} Image format for the layer. Default is the first
             *     format returned in the GetCapabilities response.
             * param - {Object} The dimensions values eg: {"Year": "2012"}
             *
             * Returns:
             * {<OpenLayers.Layer.WMTS>} A properly configured WMTS layer.  Throws an
             *     error if an incomplete config is provided.  Returns undefined if no
             *     layer could be created with the provided config.
             */
            createLayer: function (capabilities, config) {
                var layer;

                // confirm required properties are supplied in config
                if (!('layer' in config)) {
                    throw new Error("Missing property 'layer' in configuration.");
                }

                var contents = capabilities.contents;

                // find the layer definition with the given identifier
                var layers = contents.layers;
                var layerDef;
                for (var i = 0, ii = contents.layers.length; i < ii; ++i) {
                    if (contents.layers[i].identifier === config.layer) {
                        layerDef = contents.layers[i];
                        break;
                    }
                }
                if (!layerDef) {
                    console.error("No layer with identifier ", config.layer, 'in', contents.layers);
                    throw new Error("Layer not found");
                }

                var format = config.format;
                if (!format && layerDef.formats && layerDef.formats.length) {
                    format = layerDef.formats[0];
                }

                // find the matrixSet definition
                var matrixSet;
                if (config.matrixSet) {
                    matrixSet = contents.tileMatrixSets[config.matrixSet];
                } else if (layerDef.tileMatrixSetLinks.length >= 1) {
                    matrixSet = contents.tileMatrixSets[
                        layerDef.tileMatrixSetLinks[0].tileMatrixSet];
                }
                if (!matrixSet) {
                    console.error("No matrix set with identifier ", config.matrixSet, 'in', contents.tileMatrixSets);
                    throw new Error("matrixSet not found");
                }

                // get the default style for the layer
                var style;
                for (var i = 0, ii = layerDef.styles.length; i < ii; ++i) {
                    style = layerDef.styles[i];
                    if (style.isDefault) {
                        break;
                    }
                }

                var requestEncoding = config.requestEncoding;
                if (!requestEncoding) {
                    requestEncoding = "KVP";
                    if (capabilities.operationsMetadata.GetTile.dcp.http) {
                        var http = capabilities.operationsMetadata.GetTile.dcp.http;
                        // Get first get method
                        if (http.get[0].constraints) {
                            var constraints = http.get[0].constraints;
                            var allowedValues = constraints.GetEncoding.allowedValues;

                            // The OGC documentation is not clear if we should use
                            // REST or RESTful, ArcGis use RESTful,
                            // and OpenLayers use REST.
                            if (!allowedValues.KVP &&
                                (allowedValues.REST || allowedValues.RESTful)) {
                                requestEncoding = "REST";
                            }
                        }
                    }
                }

                var dimensions = [];
                var params = config.params || {};
                // to don't overwrite the changes in the applyDefaults
                delete config.params;
                for (var id = 0, ld = layerDef.dimensions.length; id < ld; id++) {
                    var dimension = layerDef.dimensions[id];
                    dimensions.push(dimension.identifier);
                    if (!params.hasOwnProperty(dimension.identifier)) {
                        params[dimension.identifier] = dimension['default'];
                    }
                }

                var projection = config.projection || matrixSet.supportedCRS.replace(
                    /urn:ogc:def:crs:(\w+):(.*:)?(\w+)$/, "$1:$3");
                var units = config.units ||
                    (projection === "EPSG:4326" ? "degrees" : "m");

                var resolutions = [];
                for (var mid in matrixSet.matrixIds) {
                    if (matrixSet.matrixIds.hasOwnProperty(mid)) {
                        resolutions.push(
                            matrixSet.matrixIds[mid].scaleDenominator * 0.28E-3 /
                            uOpenLayers.METERS_PER_INCH /
                            uOpenLayers.INCHES_PER_UNIT[units]);
                    }
                }

                var url;
                if (requestEncoding === "REST" && layerDef.resourceUrls) {
                    url = [];
                    var resourceUrls = layerDef.resourceUrls,
                        resourceUrl;
                    for (var t = 0, tt = layerDef.resourceUrls.length; t < tt; ++t) {
                        resourceUrl = layerDef.resourceUrls[t];
                        if (resourceUrl.format === format && resourceUrl.resourceType === "tile") {
                            url.push(resourceUrl.template);
                        }
                    }
                } else {
                    var httpGet = capabilities.operationsMetadata.GetTile.dcp.http.get;
                    url = [];
                    var constraint;
                    for (var i = 0, ii = httpGet.length; i < ii; i++) {
                        constraint = httpGet[i].constraints;
                        if (!constraint || (constraint && constraint.GetEncoding.allowedValues[requestEncoding])) {
                            url.push(httpGet[i].url);
                        }
                    }
                }

                return new uOpenLayers.Layer.WMTS(
                    uOpenLayers.Util.applyDefaults(config, {
                        url: url,
                        requestEncoding: requestEncoding,
                        name: layerDef.title,
                        style: style.identifier,
                        format: format,
                        matrixIds: matrixSet.matrixIds,
                        matrixSet: matrixSet.identifier,
                        projection: projection,
                        units: units,
                        resolutions: config.isBaseLayer === false ? undefined :
                            resolutions,
                        serverResolutions: resolutions,
                        tileFullExtent: matrixSet.bounds,
                        dimensions: dimensions,
                        params: params
                    })
                );
            },

            CLASS_NAME: "OpenLayers.Format.WMTSCapabilities"

        });


        /**
         * Class: OpenLayers.Format.OWSCommon
         * Read OWSCommon. Create a new instance with the <OpenLayers.Format.OWSCommon>
         *     constructor.
         *
         * Inherits from:
         *  - <OpenLayers.Format.XML.VersionedOGC>
         */
        uOpenLayers.Format.OWSCommon = uOpenLayers.Class(uOpenLayers.Format.XML.VersionedOGC, {

            /**
             * APIProperty: defaultVersion
             * {String} Version number to assume if none found.  Default is "1.0.0".
             */
            defaultVersion: "1.0.0",

            /**
             * Constructor: OpenLayers.Format.OWSCommon
             * Create a new parser for OWSCommon.
             *
             * Parameters:
             * options - {Object} An optional object whose properties will be set on
             *     this instance.
             */

            /**
             * Method: getVersion
             * Returns the version to use. Subclasses can override this function
             * if a different version detection is needed.
             *
             * Parameters:
             * root - {DOMElement}
             * options - {Object} Optional configuration object.
             *
             * Returns:
             * {String} The version to use.
             */
            getVersion: function (root, options) {
                var version = this.version;
                if (!version) {
                    // remember version does not correspond to the OWS version
                    // it corresponds to the WMS/WFS/WCS etc. request version
                    var uri = root.getAttribute("xmlns:ows");
                    // the above will fail if the namespace prefix is different than
                    // ows and if the namespace is declared on a different element
                    if (uri && uri.substring(uri.lastIndexOf("/") + 1) === "1.1") {
                        version = "1.1.0";
                    }
                    if (!version) {
                        version = this.defaultVersion;
                    }
                }
                return version;
            },

            /**
             * APIMethod: read
             * Read an OWSCommon document and return an object.
             *
             * Parameters:
             * data - {String | DOMElement} Data to read.
             * options - {Object} Options for the reader.
             *
             * Returns:
             * {Object} An object representing the structure of the document.
             */

            CLASS_NAME: "OpenLayers.Format.OWSCommon"
        });

        /**
         * Class: OpenLayers.Format.OWSCommon.v1
         * Common readers and writers for OWSCommon v1.X formats
         *
         * Inherits from:
         *  - <OpenLayers.Format.XML>
         */
        uOpenLayers.Format.OWSCommon.v1 = uOpenLayers.Class(uOpenLayers.Format.XML, {

            /**
             * Property: regExes
             * Compiled regular expressions for manipulating strings.
             */
            regExes: {
                trimSpace: (/^\s*|\s*$/g),
                removeSpace: (/\s*/g),
                splitSpace: (/\s+/),
                trimComma: (/\s*,\s*/g)
            },

            /**
             * Method: read
             *
             * Parameters:
             * data - {DOMElement} An OWSCommon document element.
             * options - {Object} Options for the reader.
             *
             * Returns:
             * {Object} An object representing the OWSCommon document.
             */
            read: function (data, options) {
                options = uOpenLayers.Util.applyDefaults(options, this.options);
                var ows = {};
                this.readChildNodes(data, ows);
                return ows;
            },

            /**
             * Property: readers
             * Contains public functions, grouped by namespace prefix, that will
             *     be applied when a namespaced node is found matching the function
             *     name.  The function will be applied in the scope of this parser
             *     with two arguments: the node being read and a context object passed
             *     from the parent.
             */
            readers: {
                "ows": {
                    "Exception": function (node, exceptionReport) {
                        var exception = {
                            code: node.getAttribute('exceptionCode'),
                            locator: node.getAttribute('locator'),
                            texts: []
                        };
                        exceptionReport.exceptions.push(exception);
                        this.readChildNodes(node, exception);
                    },
                    "ExceptionText": function (node, exception) {
                        var text = this.getChildValue(node);
                        exception.texts.push(text);
                    },
                    "ServiceIdentification": function (node, obj) {
                        obj.serviceIdentification = {};
                        this.readChildNodes(node, obj.serviceIdentification);
                    },
                    "Title": function (node, obj) {
                        obj.title = this.getChildValue(node);
                    },
                    "Abstract": function (node, serviceIdentification) {
                        serviceIdentification["abstract"] = this.getChildValue(node);
                    },
                    "Keywords": function (node, serviceIdentification) {
                        serviceIdentification.keywords = {};
                        this.readChildNodes(node, serviceIdentification.keywords);
                    },
                    "Keyword": function (node, keywords) {
                        keywords[this.getChildValue(node)] = true;
                    },
                    "ServiceType": function (node, serviceIdentification) {
                        serviceIdentification.serviceType = {
                            codeSpace: node.getAttribute('codeSpace'),
                            value: this.getChildValue(node)
                        };
                    },
                    "ServiceTypeVersion": function (node, serviceIdentification) {
                        serviceIdentification.serviceTypeVersion = this.getChildValue(node);
                    },
                    "Fees": function (node, serviceIdentification) {
                        serviceIdentification.fees = this.getChildValue(node);
                    },
                    "AccessConstraints": function (node, serviceIdentification) {
                        serviceIdentification.accessConstraints =
                            this.getChildValue(node);
                    },
                    "ServiceProvider": function (node, obj) {
                        obj.serviceProvider = {};
                        this.readChildNodes(node, obj.serviceProvider);
                    },
                    "ProviderName": function (node, serviceProvider) {
                        serviceProvider.providerName = this.getChildValue(node);
                    },
                    "ProviderSite": function (node, serviceProvider) {
                        serviceProvider.providerSite = this.getAttributeNS(node,
                            this.namespaces.xlink, "href");
                    },
                    "ServiceContact": function (node, serviceProvider) {
                        serviceProvider.serviceContact = {};
                        this.readChildNodes(node, serviceProvider.serviceContact);
                    },
                    "IndividualName": function (node, serviceContact) {
                        serviceContact.individualName = this.getChildValue(node);
                    },
                    "PositionName": function (node, serviceContact) {
                        serviceContact.positionName = this.getChildValue(node);
                    },
                    "ContactInfo": function (node, serviceContact) {
                        serviceContact.contactInfo = {};
                        this.readChildNodes(node, serviceContact.contactInfo);
                    },
                    "Phone": function (node, contactInfo) {
                        contactInfo.phone = {};
                        this.readChildNodes(node, contactInfo.phone);
                    },
                    "Voice": function (node, phone) {
                        phone.voice = this.getChildValue(node);
                    },
                    "Address": function (node, contactInfo) {
                        contactInfo.address = {};
                        this.readChildNodes(node, contactInfo.address);
                    },
                    "DeliveryPoint": function (node, address) {
                        address.deliveryPoint = this.getChildValue(node);
                    },
                    "City": function (node, address) {
                        address.city = this.getChildValue(node);
                    },
                    "AdministrativeArea": function (node, address) {
                        address.administrativeArea = this.getChildValue(node);
                    },
                    "PostalCode": function (node, address) {
                        address.postalCode = this.getChildValue(node);
                    },
                    "Country": function (node, address) {
                        address.country = this.getChildValue(node);
                    },
                    "ElectronicMailAddress": function (node, address) {
                        address.electronicMailAddress = this.getChildValue(node);
                    },
                    "Role": function (node, serviceContact) {
                        serviceContact.role = this.getChildValue(node);
                    },
                    "OperationsMetadata": function (node, obj) {
                        obj.operationsMetadata = {};
                        this.readChildNodes(node, obj.operationsMetadata);
                    },
                    "Operation": function (node, operationsMetadata) {
                        var name = node.getAttribute("name");
                        operationsMetadata[name] = {};
                        this.readChildNodes(node, operationsMetadata[name]);
                    },
                    "DCP": function (node, operation) {
                        operation.dcp = {};
                        this.readChildNodes(node, operation.dcp);
                    },
                    "HTTP": function (node, dcp) {
                        dcp.http = {};
                        this.readChildNodes(node, dcp.http);
                    },
                    "Get": function (node, http) {
                        if (!http.get) {
                            http.get = [];
                        }
                        var obj = {
                            url: this.getAttributeNS(node, this.namespaces.xlink, "href")
                        };
                        this.readChildNodes(node, obj);
                        http.get.push(obj);
                    },
                    "Post": function (node, http) {
                        if (!http.post) {
                            http.post = [];
                        }
                        var obj = {
                            url: this.getAttributeNS(node, this.namespaces.xlink, "href")
                        };
                        this.readChildNodes(node, obj);
                        http.post.push(obj);
                    },
                    "Parameter": function (node, operation) {
                        if (!operation.parameters) {
                            operation.parameters = {};
                        }
                        var name = node.getAttribute("name");
                        operation.parameters[name] = {};
                        this.readChildNodes(node, operation.parameters[name]);
                    },
                    "Constraint": function (node, obj) {
                        if (!obj.constraints) {
                            obj.constraints = {};
                        }
                        var name = node.getAttribute("name");
                        obj.constraints[name] = {};
                        this.readChildNodes(node, obj.constraints[name]);
                    },
                    "Value": function (node, allowedValues) {
                        allowedValues[this.getChildValue(node)] = true;
                    },
                    "OutputFormat": function (node, obj) {
                        obj.formats.push({value: this.getChildValue(node)});
                        this.readChildNodes(node, obj);
                    },
                    "WGS84BoundingBox": function (node, obj) {
                        var boundingBox = {};
                        boundingBox.crs = node.getAttribute("crs");
                        if (obj.BoundingBox) {
                            obj.BoundingBox.push(boundingBox);
                        } else {
                            obj.projection = boundingBox.crs;
                            boundingBox = obj;
                        }
                        this.readChildNodes(node, boundingBox);
                    },
                    "BoundingBox": function (node, obj) {
                        // FIXME: We consider that BoundingBox is the same as WGS84BoundingBox
                        // LowerCorner = "min_x min_y"
                        // UpperCorner = "max_x max_y"
                        // It should normally depend on the projection
                        this.readers['ows']['WGS84BoundingBox'].apply(this, [node, obj]);
                    },
                    "LowerCorner": function (node, obj) {
                        var str = this.getChildValue(node).replace(
                            this.regExes.trimSpace, "");
                        str = str.replace(this.regExes.trimComma, ",");
                        var pointList = str.split(this.regExes.splitSpace);
                        obj.left = pointList[0];
                        obj.bottom = pointList[1];
                    },
                    "UpperCorner": function (node, obj) {
                        var str = this.getChildValue(node).replace(
                            this.regExes.trimSpace, "");
                        str = str.replace(this.regExes.trimComma, ",");
                        var pointList = str.split(this.regExes.splitSpace);
                        obj.right = pointList[0];
                        obj.top = pointList[1];
                        obj.bounds = new uOpenLayers.Bounds(obj.left, obj.bottom,
                            obj.right, obj.top);
                        delete obj.left;
                        delete obj.bottom;
                        delete obj.right;
                        delete obj.top;
                    },
                    "Language": function (node, obj) {
                        obj.language = this.getChildValue(node);
                    }
                }
            },

            /**
             * Property: writers
             * As a compliment to the readers property, this structure contains public
             *     writing functions grouped by namespace alias and named like the
             *     node names they produce.
             */
            writers: {
                "ows": {
                    "BoundingBox": function (options, nodeName) {
                        var node = this.createElementNSPlus(nodeName || "ows:BoundingBox", {
                            attributes: {
                                crs: options.projection
                            }
                        });
                        this.writeNode("ows:LowerCorner", options, node);
                        this.writeNode("ows:UpperCorner", options, node);
                        return node;
                    },
                    "LowerCorner": function (options) {
                        var node = this.createElementNSPlus("ows:LowerCorner", {
                            value: options.bounds.left + " " + options.bounds.bottom
                        });
                        return node;
                    },
                    "UpperCorner": function (options) {
                        var node = this.createElementNSPlus("ows:UpperCorner", {
                            value: options.bounds.right + " " + options.bounds.top
                        });
                        return node;
                    },
                    "Identifier": function (identifier) {
                        var node = this.createElementNSPlus("ows:Identifier", {
                            value: identifier
                        });
                        return node;
                    },
                    "Title": function (title) {
                        var node = this.createElementNSPlus("ows:Title", {
                            value: title
                        });
                        return node;
                    },
                    "Abstract": function (abstractValue) {
                        var node = this.createElementNSPlus("ows:Abstract", {
                            value: abstractValue
                        });
                        return node;
                    },
                    "OutputFormat": function (format) {
                        var node = this.createElementNSPlus("ows:OutputFormat", {
                            value: format
                        });
                        return node;
                    }
                }
            },

            CLASS_NAME: "OpenLayers.Format.OWSCommon.v1"

        });

        /**
         * Class: OpenLayers.Format.OWSCommon.v1_1_0
         * Parser for OWS Common version 1.1.0.
         *
         * Inherits from:
         *  - <OpenLayers.Format.OWSCommon.v1>
         */
        uOpenLayers.Format.OWSCommon.v1_1_0 = uOpenLayers.Class(uOpenLayers.Format.OWSCommon.v1, {

            /**
             * Property: namespaces
             * {Object} Mapping of namespace aliases to namespace URIs.
             */
            namespaces: {
                ows: "http://www.opengis.net/ows/1.1",
                xlink: "http://www.w3.org/1999/xlink"
            },

            /**
             * Property: readers
             * Contains public functions, grouped by namespace prefix, that will
             *     be applied when a namespaced node is found matching the function
             *     name.  The function will be applied in the scope of this parser
             *     with two arguments: the node being read and a context object passed
             *     from the parent.
             */
            readers: {
                "ows": uOpenLayers.Util.applyDefaults({
                    "ExceptionReport": function (node, obj) {
                        obj.exceptionReport = {
                            version: node.getAttribute('version'),
                            language: node.getAttribute('xml:lang'),
                            exceptions: []
                        };
                        this.readChildNodes(node, obj.exceptionReport);
                    },
                    "AllowedValues": function (node, parameter) {
                        parameter.allowedValues = {};
                        this.readChildNodes(node, parameter.allowedValues);
                    },
                    "AnyValue": function (node, parameter) {
                        parameter.anyValue = true;
                    },
                    "DataType": function (node, parameter) {
                        parameter.dataType = this.getChildValue(node);
                    },
                    "Range": function (node, allowedValues) {
                        allowedValues.range = {};
                        this.readChildNodes(node, allowedValues.range);
                    },
                    "MinimumValue": function (node, range) {
                        range.minValue = this.getChildValue(node);
                    },
                    "MaximumValue": function (node, range) {
                        range.maxValue = this.getChildValue(node);
                    },
                    "Identifier": function (node, obj) {
                        obj.identifier = this.getChildValue(node);
                    },
                    "SupportedCRS": function (node, obj) {
                        obj.supportedCRS = this.getChildValue(node);
                    }
                }, uOpenLayers.Format.OWSCommon.v1.prototype.readers["ows"])
            },

            /**
             * Property: writers
             * As a compliment to the readers property, this structure contains public
             *     writing functions grouped by namespace alias and named like the
             *     node names they produce.
             */
            writers: {
                "ows": uOpenLayers.Util.applyDefaults({
                    "Range": function (range) {
                        var node = this.createElementNSPlus("ows:Range", {
                            attributes: {
                                'ows:rangeClosure': range.closure
                            }
                        });
                        this.writeNode("ows:MinimumValue", range.minValue, node);
                        this.writeNode("ows:MaximumValue", range.maxValue, node);
                        return node;
                    },
                    "MinimumValue": function (minValue) {
                        var node = this.createElementNSPlus("ows:MinimumValue", {
                            value: minValue
                        });
                        return node;
                    },
                    "MaximumValue": function (maxValue) {
                        var node = this.createElementNSPlus("ows:MaximumValue", {
                            value: maxValue
                        });
                        return node;
                    },
                    "Value": function (value) {
                        var node = this.createElementNSPlus("ows:Value", {
                            value: value
                        });
                        return node;
                    }
                }, OpenLayers.Format.OWSCommon.v1.prototype.writers["ows"])
            },

            CLASS_NAME: "OpenLayers.Format.OWSCommon.v1_1_0"

        });

        /**
         * Class: OpenLayers.Format.WMTSCapabilities.v1_0_0
         * Read WMTS Capabilities version 1.0.0.
         *
         * Inherits from:
         *  - <OpenLayers.Format.WMTSCapabilities>
         */
        uOpenLayers.Format.WMTSCapabilities.v1_0_0 = uOpenLayers.Class(
            uOpenLayers.Format.OWSCommon.v1_1_0, {

                /**
                 * Property: version
                 * {String} The parser version ("1.0.0").
                 */
                version: "1.0.0",

                /**
                 * Property: namespaces
                 * {Object} Mapping of namespace aliases to namespace URIs.
                 */
                namespaces: {
                    ows: "http://www.opengis.net/ows/1.1",
                    wmts: "http://www.opengis.net/wmts/1.0",
                    xlink: "http://www.w3.org/1999/xlink"
                },

                /**
                 * Property: yx
                 * {Object} Members in the yx object are used to determine if a CRS URN
                 *     corresponds to a CRS with y,x axis order.  Member names are CRS URNs
                 *     and values are boolean.  Defaults come from the
                 *     <OpenLayers.Format.WMTSCapabilities> prototype.
                 */
                yx: null,

                /**
                 * Property: defaultPrefix
                 * {String} The default namespace alias for creating element nodes.
                 */
                defaultPrefix: "wmts",

                /**
                 * Constructor: OpenLayers.Format.WMTSCapabilities.v1_0_0
                 * Create a new parser for WMTS capabilities version 1.0.0.
                 *
                 * Parameters:
                 * options - {Object} An optional object whose properties will be set on
                 *     this instance.
                 */
                initialize: function (options) {
                    uOpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
                    this.options = options;
                    var yx = uOpenLayers.Util.extend(
                        {}, uOpenLayers.Format.WMTSCapabilities.prototype.yx
                    );
                    this.yx = uOpenLayers.Util.extend(yx, this.yx);
                },

                /**
                 * APIMethod: read
                 * Read capabilities data from a string, and return info about the WMTS.
                 *
                 * Parameters:
                 * data - {String} or {DOMElement} data to read/parse.
                 *
                 * Returns:
                 * {Object} Information about the SOS service.
                 */
                read: function (data) {
                    if (typeof data == "string") {
                        data = uOpenLayers.Format.XML.prototype.read.apply(this, [data]);
                    }
                    if (data && data.nodeType == 9) {
                        data = data.documentElement;
                    }
                    var capabilities = {};
                    this.readNode(data, capabilities);
                    capabilities.version = this.version;
                    return capabilities;
                },

                /**
                 * Property: readers
                 * Contains public functions, grouped by namespace prefix, that will
                 *     be applied when a namespaced node is found matching the function
                 *     name.  The function will be applied in the scope of this parser
                 *     with two arguments: the node being read and a context object passed
                 *     from the parent.
                 */
                readers: {
                    "wmts": {
                        "Capabilities": function (node, obj) {
                            this.readChildNodes(node, obj);
                        },
                        "Contents": function (node, obj) {
                            obj.contents = {};
                            obj.contents.layers = [];
                            obj.contents.tileMatrixSets = {};
                            this.readChildNodes(node, obj.contents);
                        },
                        "Layer": function (node, obj) {
                            var layer = {
                                styles: [],
                                formats: [],
                                dimensions: [],
                                tileMatrixSetLinks: []
                            };
                            layer.layers = [];
                            this.readChildNodes(node, layer);
                            obj.layers.push(layer);
                        },
                        "Style": function (node, obj) {
                            var style = {};
                            style.isDefault = (node.getAttribute("isDefault") === "true");
                            this.readChildNodes(node, style);
                            obj.styles.push(style);
                        },
                        "Format": function (node, obj) {
                            obj.formats.push(this.getChildValue(node));
                        },
                        "TileMatrixSetLink": function (node, obj) {
                            var tileMatrixSetLink = {};
                            this.readChildNodes(node, tileMatrixSetLink);
                            obj.tileMatrixSetLinks.push(tileMatrixSetLink);
                        },
                        "TileMatrixSet": function (node, obj) {
                            // node could be child of wmts:Contents or wmts:TileMatrixSetLink
                            // duck type wmts:Contents by looking for layers
                            if (obj.layers) {
                                // TileMatrixSet as object type in schema
                                var tileMatrixSet = {
                                    matrixIds: []
                                };
                                this.readChildNodes(node, tileMatrixSet);
                                obj.tileMatrixSets[tileMatrixSet.identifier] = tileMatrixSet;
                            } else {
                                // TileMatrixSet as string type in schema
                                obj.tileMatrixSet = this.getChildValue(node);
                            }
                        },
                        "TileMatrix": function (node, obj) {
                            var tileMatrix = {
                                supportedCRS: obj.supportedCRS
                            };
                            this.readChildNodes(node, tileMatrix);
                            obj.matrixIds.push(tileMatrix);
                        },
                        "ScaleDenominator": function (node, obj) {
                            obj.scaleDenominator = parseFloat(this.getChildValue(node));
                        },
                        "TopLeftCorner": function (node, obj) {
                            var topLeftCorner = this.getChildValue(node);
                            var coords = topLeftCorner.split(" ");
                            // decide on axis order for the given CRS
                            var yx;
                            if (obj.supportedCRS) {
                                // extract out version from URN
                                var crs = obj.supportedCRS.replace(
                                    /urn:ogc:def:crs:(\w+):.+:(\w+)$/,
                                    "urn:ogc:def:crs:$1::$2"
                                );
                                yx = !!this.yx[crs];
                            }
                            if (yx) {
                                obj.topLeftCorner = new OpenLayers.LonLat(
                                    coords[1], coords[0]
                                );
                            } else {
                                obj.topLeftCorner = new OpenLayers.LonLat(
                                    coords[0], coords[1]
                                );
                            }
                        },
                        "TileWidth": function (node, obj) {
                            obj.tileWidth = parseInt(this.getChildValue(node));
                        },
                        "TileHeight": function (node, obj) {
                            obj.tileHeight = parseInt(this.getChildValue(node));
                        },
                        "MatrixWidth": function (node, obj) {
                            obj.matrixWidth = parseInt(this.getChildValue(node));
                        },
                        "MatrixHeight": function (node, obj) {
                            obj.matrixHeight = parseInt(this.getChildValue(node));
                        },
                        "ResourceURL": function (node, obj) {
                            obj.resourceUrl = obj.resourceUrl || {};
                            var resourceType = node.getAttribute("resourceType");
                            if (!obj.resourceUrls) {
                                obj.resourceUrls = [];
                            }
                            var resourceUrl = obj.resourceUrl[resourceType] = {
                                format: node.getAttribute("format"),
                                template: node.getAttribute("template"),
                                resourceType: resourceType
                            };
                            obj.resourceUrls.push(resourceUrl);
                        },
                        // not used for now, can be added in the future though
                        /*"Themes": function(node, obj) {
                    obj.themes = [];
                    this.readChildNodes(node, obj.themes);
                },
                "Theme": function(node, obj) {
                    var theme = {};
                    this.readChildNodes(node, theme);
                    obj.push(theme);
                },*/
                        "WSDL": function (node, obj) {
                            obj.wsdl = {};
                            obj.wsdl.href = node.getAttribute("xlink:href");
                            // TODO: other attributes of <WSDL> element
                        },
                        "ServiceMetadataURL": function (node, obj) {
                            obj.serviceMetadataUrl = {};
                            obj.serviceMetadataUrl.href = node.getAttribute("xlink:href");
                            // TODO: other attributes of <ServiceMetadataURL> element
                        },
                        "LegendURL": function (node, obj) {
                            obj.legend = {};
                            obj.legend.href = node.getAttribute("xlink:href");
                            obj.legend.format = node.getAttribute("format");
                        },
                        "Dimension": function (node, obj) {
                            var dimension = {values: []};
                            this.readChildNodes(node, dimension);
                            obj.dimensions.push(dimension);
                        },
                        "Default": function (node, obj) {
                            obj["default"] = this.getChildValue(node);
                        },
                        "Value": function (node, obj) {
                            obj.values.push(this.getChildValue(node));
                        }
                    },
                    "ows": uOpenLayers.Format.OWSCommon.v1_1_0.prototype.readers["ows"]
                },

                CLASS_NAME: "OpenLayers.Format.WMTSCapabilities.v1_0_0"

            });

        /**
         * Class: OpenLayers.Layer.WMTS
         * Instances of the WMTS class allow viewing of tiles from a service that
         *     implements the OGC WMTS specification version 1.0.0.
         *
         * Inherits from:
         *  - <OpenLayers.Layer.Grid>
         */
        uOpenLayers.Layer.WMTS = uOpenLayers.Class(uOpenLayers.Layer.Grid, {

            /**
             * APIProperty: isBaseLayer
             * {Boolean} The layer will be considered a base layer.  Default is true.
             */
            isBaseLayer: true,

            /**
             * Property: version
             * {String} WMTS version.  Default is "1.0.0".
             */
            version: "1.0.0",

            /**
             * APIProperty: requestEncoding
             * {String} Request encoding.  Can be "REST" or "KVP".  Default is "KVP".
             */
            requestEncoding: "KVP",

            /**
             * APIProperty: url
             * {String|Array(String)} The base URL or request URL template for the WMTS
             * service. Must be provided. Array is only supported for base URLs, not
             * for request URL templates. URL templates are only supported for
             * REST <requestEncoding>.
             */
            url: null,

            /**
             * APIProperty: layer
             * {String} The layer identifier advertised by the WMTS service.  Must be
             *     provided.
             */
            layer: null,

            /**
             * APIProperty: matrixSet
             * {String} One of the advertised matrix set identifiers.  Must be provided.
             */
            matrixSet: null,

            /**
             * APIProperty: style
             * {String} One of the advertised layer styles.  Must be provided.
             */
            style: null,

            /**
             * APIProperty: format
             * {String} The image MIME type.  Default is "image/jpeg".
             */
            format: "image/jpeg",

            /**
             * APIProperty: tileOrigin
             * {<OpenLayers.LonLat>} The top-left corner of the tile matrix in map
             *     units.  If the tile origin for each matrix in a set is different,
             *     the <matrixIds> should include a topLeftCorner property.  If
             *     not provided, the tile origin will default to the top left corner
             *     of the layer <maxExtent>.
             */
            tileOrigin: null,

            /**
             * APIProperty: tileFullExtent
             * {<OpenLayers.Bounds>}  The full extent of the tile set.  If not supplied,
             *     the layer's <maxExtent> property will be used.
             */
            tileFullExtent: null,

            /**
             * APIProperty: formatSuffix
             * {String} For REST request encoding, an image format suffix must be
             *     included in the request.  If not provided, the suffix will be derived
             *     from the <format> property.
             */
            formatSuffix: null,

            /**
             * APIProperty: matrixIds
             * {Array} A list of tile matrix identifiers.  If not provided, the matrix
             *     identifiers will be assumed to be integers corresponding to the
             *     map zoom level.  If a list of strings is provided, each item should
             *     be the matrix identifier that corresponds to the map zoom level.
             *     Additionally, a list of objects can be provided.  Each object should
             *     describe the matrix as presented in the WMTS capabilities.  These
             *     objects should have the propertes shown below.
             *
             * Matrix properties:
             * identifier - {String} The matrix identifier (required).
             * scaleDenominator - {Number} The matrix scale denominator.
             * topLeftCorner - {<OpenLayers.LonLat>} The top left corner of the
             *     matrix.  Must be provided if different than the layer <tileOrigin>.
             * tileWidth - {Number} The tile width for the matrix.  Must be provided
             *     if different than the width given in the layer <tileSize>.
             * tileHeight - {Number} The tile height for the matrix.  Must be provided
             *     if different than the height given in the layer <tileSize>.
             */
            matrixIds: null,

            /**
             * APIProperty: dimensions
             * {Array} For RESTful request encoding, extra dimensions may be specified.
             *     Items in this list should be property names in the <params> object.
             *     Values of extra dimensions will be determined from the corresponding
             *     values in the <params> object.
             */
            dimensions: null,

            /**
             * APIProperty: params
             * {Object} Extra parameters to include in tile requests.  For KVP
             *     <requestEncoding>, these properties will be encoded in the request
             *     query string.  For REST <requestEncoding>, these properties will
             *     become part of the request path, with order determined by the
             *     <dimensions> list.
             */
            params: null,

            /**
             * APIProperty: zoomOffset
             * {Number} If your cache has more levels than you want to provide
             *     access to with this layer, supply a zoomOffset.  This zoom offset
             *     is added to the current map zoom level to determine the level
             *     for a requested tile.  For example, if you supply a zoomOffset
             *     of 3, when the map is at the zoom 0, tiles will be requested from
             *     level 3 of your cache.  Default is 0 (assumes cache level and map
             *     zoom are equivalent).  Additionally, if this layer is to be used
             *     as an overlay and the cache has fewer zoom levels than the base
             *     layer, you can supply a negative zoomOffset.  For example, if a
             *     map zoom level of 1 corresponds to your cache level zero, you would
             *     supply a -1 zoomOffset (and set the maxResolution of the layer
             *     appropriately).  The zoomOffset value has no effect if complete
             *     matrix definitions (including scaleDenominator) are supplied in
             *     the <matrixIds> property.  Defaults to 0 (no zoom offset).
             */
            zoomOffset: 0,

            /**
             * APIProperty: serverResolutions
             * {Array} A list of all resolutions available on the server.  Only set this
             *     property if the map resolutions differ from the server. This
             *     property serves two purposes. (a) <serverResolutions> can include
             *     resolutions that the server supports and that you don't want to
             *     provide with this layer; you can also look at <zoomOffset>, which is
             *     an alternative to <serverResolutions> for that specific purpose.
             *     (b) The map can work with resolutions that aren't supported by
             *     the server, i.e. that aren't in <serverResolutions>. When the
             *     map is displayed in such a resolution data for the closest
             *     server-supported resolution is loaded and the layer div is
             *     stretched as necessary.
             */
            serverResolutions: null,

            /**
             * Property: formatSuffixMap
             * {Object} a map between WMTS 'format' request parameter and tile image file suffix
             */
            formatSuffixMap: {
                "image/png": "png",
                "image/png8": "png",
                "image/png24": "png",
                "image/png32": "png",
                "png": "png",
                "image/jpeg": "jpg",
                "image/jpg": "jpg",
                "jpeg": "jpg",
                "jpg": "jpg"
            },

            /**
             * Property: matrix
             * {Object} Matrix definition for the current map resolution.  Updated by
             *     the <updateMatrixProperties> method.
             */
            matrix: null,

            /**
             * Constructor: OpenLayers.Layer.WMTS
             * Create a new WMTS layer.
             *
             * Example:
             * (code)
             * var wmts = new OpenLayers.Layer.WMTS({
             *     name: "My WMTS Layer",
             *     url: "http://example.com/wmts",
             *     layer: "layer_id",
             *     style: "default",
             *     matrixSet: "matrix_id"
             * });
             * (end)
             *
             * Parameters:
             * config - {Object} Configuration properties for the layer.
             *
             * Required configuration properties:
             * url - {String} The base url for the service.  See the <url> property.
             * layer - {String} The layer identifier.  See the <layer> property.
             * style - {String} The layer style identifier.  See the <style> property.
             * matrixSet - {String} The tile matrix set identifier.  See the <matrixSet>
             *     property.
             *
             * Any other documented layer properties can be provided in the config object.
             */
            initialize: function (config) {

                // confirm required properties are supplied
                var required = {
                    url: true,
                    layer: true,
                    style: true,
                    matrixSet: true
                };
                for (var prop in required) {
                    if (!(prop in config)) {
                        throw new Error("Missing property '" + prop + "' in layer configuration.");
                    }
                }

                config.params = uOpenLayers.Util.upperCaseObject(config.params);
                var args = [config.name, config.url, config.params, config];
                uOpenLayers.Layer.Grid.prototype.initialize.apply(this, args);


                // determine format suffix (for REST)
                if (!this.formatSuffix) {
                    this.formatSuffix = this.formatSuffixMap[this.format] || this.format.split("/").pop();
                }

                // expand matrixIds (may be array of string or array of object)
                if (this.matrixIds) {
                    var len = this.matrixIds.length;
                    if (len && typeof this.matrixIds[0] === "string") {
                        var ids = this.matrixIds;
                        this.matrixIds = new Array(len);
                        for (var i = 0; i < len; ++i) {
                            this.matrixIds[i] = {identifier: ids[i]};
                        }
                    }
                }

            },

            /**
             * Method: setMap
             */
            setMap: function () {
                uOpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
            },

            /**
             * Method: updateMatrixProperties
             * Called when map resolution changes to update matrix related properties.
             */
            updateMatrixProperties: function () {
                this.matrix = this.getMatrix();
                if (this.matrix) {
                    if (this.matrix.topLeftCorner) {
                        this.tileOrigin = this.matrix.topLeftCorner;
                    }
                    if (this.matrix.tileWidth && this.matrix.tileHeight) {
                        this.tileSize = new uOpenLayers.Size(
                            this.matrix.tileWidth, this.matrix.tileHeight
                        );
                    }
                    if (!this.tileOrigin) {
                        this.tileOrigin = new uOpenLayers.LonLat(
                            this.maxExtent.left, this.maxExtent.top
                        );
                    }
                    if (!this.tileFullExtent) {
                        this.tileFullExtent = this.maxExtent;
                    }
                }
            },

            /**
             * Method: moveTo
             *
             * Parameters:
             * bounds - {<OpenLayers.Bounds>}
             * zoomChanged - {Boolean} Tells when zoom has changed, as layers have to
             *     do some init work in that case.
             * dragging - {Boolean}
             */
            moveTo: function (bounds, zoomChanged, dragging) {
                if (zoomChanged || !this.matrix) {
                    this.updateMatrixProperties();
                }
                return uOpenLayers.Layer.Grid.prototype.moveTo.apply(this, arguments);
            },

            /**
             * APIMethod: clone
             *
             * Parameters:
             * obj - {Object}
             *
             * Returns:
             * {<OpenLayers.Layer.WMTS>} An exact clone of this <OpenLayers.Layer.WMTS>
             */
            clone: function (obj) {
                if (obj == null) {
                    obj = new uOpenLayers.Layer.WMTS(this.options);
                }
                //get all additions from superclasses
                obj = uOpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
                // copy/set any non-init, non-simple values here
                return obj;
            },

            /**
             * Method: getIdentifier
             * Get the current index in the matrixIds array.
             */
            getIdentifier: function () {
                return this.getServerZoom();
            },

            /**
             * Method: getMatrix
             * Get the appropriate matrix definition for the current map resolution.
             */
            getMatrix: function () {
                var matrix;
                if (!this.matrixIds || this.matrixIds.length === 0) {
                    matrix = {identifier: this.getIdentifier()};
                } else {
                    // get appropriate matrix given the map scale if possible
                    if ("scaleDenominator" in this.matrixIds[0]) {
                        // scale denominator calculation based on WMTS spec
                        var denom =
                            uOpenLayers.METERS_PER_INCH *
                            uOpenLayers.INCHES_PER_UNIT[this.units] *
                            this.getServerResolution() / 0.28E-3;
                        var diff = Number.POSITIVE_INFINITY;
                        var delta;
                        for (var i = 0, ii = this.matrixIds.length; i < ii; ++i) {
                            delta = Math.abs(1 - (this.matrixIds[i].scaleDenominator / denom));
                            if (delta < diff) {
                                diff = delta;
                                matrix = this.matrixIds[i];
                            }
                        }
                    } else {
                        // fall back on zoom as index
                        matrix = this.matrixIds[this.getIdentifier()];
                    }
                }
                return matrix;
            },

            /**
             * Method: getTileInfo
             * Get tile information for a given location at the current map resolution.
             *
             * Parameters:
             * loc - {<OpenLayers.LonLat} A location in map coordinates.
             *
             * Returns:
             * {Object} An object with "col", "row", "i", and "j" properties.  The col
             *     and row values are zero based tile indexes from the top left.  The
             *     i and j values are the number of pixels to the left and top
             *     (respectively) of the given location within the target tile.
             */
            getTileInfo: function (loc) {
                var res = this.getServerResolution();

                var fx = (loc.lon - this.tileOrigin.lon) / (res * this.tileSize.w);
                var fy = (this.tileOrigin.lat - loc.lat) / (res * this.tileSize.h);

                var col = Math.floor(fx);
                var row = Math.floor(fy);

                return {
                    col: col,
                    row: row,
                    i: Math.floor((fx - col) * this.tileSize.w),
                    j: Math.floor((fy - row) * this.tileSize.h)
                };
            },

            /**
             * Method: getURL
             *
             * Parameters:
             * bounds - {<OpenLayers.Bounds>}
             *
             * Returns:
             * {String} A URL for the tile corresponding to the given bounds.
             */
            getURL: function (bounds) {
                bounds = this.adjustBounds(bounds);
                var url = "";
                if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {

                    var center = bounds.getCenterLonLat();
                    var info = this.getTileInfo(center);
                    var matrixId = this.matrix.identifier;
                    var dimensions = this.dimensions, params;

                    if (uOpenLayers.Util.isArray(this.url)) {
                        url = this.selectUrl([
                            this.version, this.style, this.matrixSet,
                            this.matrix.identifier, info.row, info.col
                        ].join(","), this.url);
                    } else {
                        url = this.url;
                    }

                    if (this.requestEncoding.toUpperCase() === "REST") {
                        params = this.params;
                        if (url.indexOf("{") !== -1) {
                            var template = url.replace(/\{/g, "${");
                            var context = {
                                // spec does not make clear if capital S or not
                                style: this.style, Style: this.style,
                                TileMatrixSet: this.matrixSet,
                                TileMatrix: this.matrix.identifier,
                                TileRow: info.row,
                                TileCol: info.col
                            };
                            if (dimensions) {
                                var dimension, i;
                                for (i = dimensions.length - 1; i >= 0; --i) {
                                    dimension = dimensions[i];
                                    context[dimension] = params[dimension.toUpperCase()];
                                }
                            }
                            url = uOpenLayers.String.format(template, context);
                        } else {
                            // include 'version', 'layer' and 'style' in tile resource url
                            var path = this.version + "/" + this.layer + "/" + this.style + "/";

                            // append optional dimension path elements
                            if (dimensions) {
                                for (var i = 0; i < dimensions.length; i++) {
                                    if (params[dimensions[i]]) {
                                        path = path + params[dimensions[i]] + "/";
                                    }
                                }
                            }

                            // append other required path elements
                            path = path + this.matrixSet + "/" + this.matrix.identifier +
                                "/" + info.row + "/" + info.col + "." + this.formatSuffix;

                            if (!url.match(/\/$/)) {
                                url = url + "/";
                            }
                            url = url + path;
                        }
                    } else if (this.requestEncoding.toUpperCase() === "KVP") {

                        // assemble all required parameters
                        params = {
                            SERVICE: "WMTS",
                            REQUEST: "GetTile",
                            VERSION: this.version,
                            LAYER: this.layer,
                            STYLE: this.style,
                            TILEMATRIXSET: this.matrixSet,
                            TILEMATRIX: this.matrix.identifier,
                            TILEROW: info.row,
                            TILECOL: info.col,
                            FORMAT: this.format
                        };
                        url = uOpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, [params]);

                    }
                }
                return url;
            },

            /**
             * APIMethod: mergeNewParams
             * Extend the existing layer <params> with new properties.  Tiles will be
             *     reloaded with updated params in the request.
             *
             * Parameters:
             * newParams - {Object} Properties to extend to existing <params>.
             */
            mergeNewParams: function (newParams) {
                if (this.requestEncoding.toUpperCase() === "KVP") {
                    return uOpenLayers.Layer.Grid.prototype.mergeNewParams.apply(
                        this, [uOpenLayers.Util.upperCaseObject(newParams)]
                    );
                }
            },

            CLASS_NAME: "OpenLayers.Layer.WMTS"
        });
    }

    const loadFixedStrategy = () => {
        if (uOpenLayers.Strategy.Fixed) return;

        /**
         * Class: OpenLayers.Strategy.Fixed
         * A simple strategy that requests features once and never requests new data.
         *
         * Inherits from:
         *  - <OpenLayers.Strategy>
         */
        uOpenLayers.Strategy.Fixed = uOpenLayers.Class(uOpenLayers.Strategy, {

            /**
             * APIProperty: preload
             * {Boolean} Load data before layer made visible. Enabling this may result
             *   in considerable overhead if your application loads many data layers
             *   that are not visible by default. Default is false.
             */
            preload: false,

            /**
             * Constructor: OpenLayers.Strategy.Fixed
             * Create a new Fixed strategy.
             *
             * Parameters:
             * options - {Object} Optional object whose properties will be set on the
             *     instance.
             */

            /**
             * Method: activate
             * Activate the strategy: load data or add listener to load when visible
             *
             * Returns:
             * {Boolean} True if the strategy was successfully activated or false if
             *      the strategy was already active.
             */
            activate: function () {
                var activated = uOpenLayers.Strategy.prototype.activate.apply(this, arguments);
                if (activated) {
                    this.layer.events.on({
                        "refresh": this.load,
                        scope: this
                    });
                    if (this.layer.visibility == true || this.preload) {
                        this.load();
                    } else {
                        this.layer.events.on({
                            "visibilitychanged": this.load,
                            scope: this
                        });
                    }
                }
                return activated;
            },

            /**
             * Method: deactivate
             * Deactivate the strategy.  Undo what is done in <activate>.
             *
             * Returns:
             * {Boolean} The strategy was successfully deactivated.
             */
            deactivate: function () {
                var deactivated = uOpenLayers.Strategy.prototype.deactivate.call(this);
                if (deactivated) {
                    this.layer.events.un({
                        "refresh": this.load,
                        "visibilitychanged": this.load,
                        scope: this
                    });
                }
                return deactivated;
            },

            /**
             * Method: load
             * Tells protocol to load data and unhooks the visibilitychanged event
             *
             * Parameters:
             * options - {Object} options to pass to protocol read.
             */
            load: function (options) {
                var layer = this.layer;
                layer.events.triggerEvent("loadstart", {filter: layer.filter});
                layer.protocol.read(uOpenLayers.Util.applyDefaults({
                    callback: this.merge,
                    filter: layer.filter,
                    scope: this
                }, options));
                layer.events.un({
                    "visibilitychanged": this.load,
                    scope: this
                });
            },

            /**
             * Method: merge
             * Add all features to the layer.
             *     If the layer projection differs from the map projection, features
             *     will be transformed from the layer projection to the map projection.
             *
             * Parameters:
             * resp - {<OpenLayers.Protocol.Response>} The response object passed
             *      by the protocol.
             */
            merge: function (resp) {
                var layer = this.layer;
                layer.destroyFeatures();
                var features = resp.features;
                if (features && features.length > 0) {
                    var remote = layer.projection;
                    var local = layer.map.getProjectionObject();
                    if (!local.equals(remote)) {
                        var geom;
                        for (var i = 0, len = features.length; i < len; ++i) {
                            geom = features[i].geometry;
                            if (geom) {
                                geom.transform(remote, local);
                            }
                        }
                    }
                    layer.addFeatures(features);
                }
                layer.events.triggerEvent("loadend", {response: resp});
            },

            CLASS_NAME: "OpenLayers.Strategy.Fixed"
        });
    }

    const loadProtocol = () => {
        if (uOpenLayers.Protocol && uOpenLayers.Protocol.Script) return;
        /* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

        /**
         * @requires OpenLayers/BaseTypes/Class.js
         */

        /**
         * Class: OpenLayers.Protocol
         * Abstract vector layer protocol class.  Not to be instantiated directly.  Use
         *     one of the protocol subclasses instead.
         */
        uOpenLayers.Protocol = uOpenLayers.Class({

            /**
             * Property: format
             * {<OpenLayers.Format>} The format used by this protocol.
             */
            format: null,

            /**
             * Property: options
             * {Object} Any options sent to the constructor.
             */
            options: null,

            /**
             * Property: autoDestroy
             * {Boolean} The creator of the protocol can set autoDestroy to false
             *      to fully control when the protocol is destroyed. Defaults to
             *      true.
             */
            autoDestroy: true,

            /**
             * Property: defaultFilter
             * {<OpenLayers.Filter>} Optional default filter to read requests
             */
            defaultFilter: null,

            /**
             * Constructor: OpenLayers.Protocol
             * Abstract class for vector protocols.  Create instances of a subclass.
             *
             * Parameters:
             * options - {Object} Optional object whose properties will be set on the
             *     instance.
             */
            initialize: function (options) {
                options = options || {};
                uOpenLayers.Util.extend(this, options);
                this.options = options;
            },

            /**
             * Method: mergeWithDefaultFilter
             * Merge filter passed to the read method with the default one
             *
             * Parameters:
             * filter - {<OpenLayers.Filter>}
             */
            mergeWithDefaultFilter: function (filter) {
                var merged;
                if (filter && this.defaultFilter) {
                    merged = new uOpenLayers.Filter.Logical({
                        type: uOpenLayers.Filter.Logical.AND,
                        filters: [this.defaultFilter, filter]
                    });
                } else {
                    merged = filter || this.defaultFilter || undefined;
                }
                return merged;
            },

            /**
             * APIMethod: destroy
             * Clean up the protocol.
             */
            destroy: function () {
                this.options = null;
                this.format = null;
            },

            /**
             * APIMethod: read
             * Construct a request for reading new features.
             *
             * Parameters:
             * options - {Object} Optional object for configuring the request.
             *
             * Returns:
             * {<OpenLayers.Protocol.Response>} An <OpenLayers.Protocol.Response>
             * object, the same object will be passed to the callback function passed
             * if one exists in the options object.
             */
            read: function (options) {
                options = options || {};
                options.filter = this.mergeWithDefaultFilter(options.filter);
            },


            /**
             * APIMethod: create
             * Construct a request for writing newly created features.
             *
             * Parameters:
             * features - {Array({<OpenLayers.Feature.Vector>})} or
             *            {<OpenLayers.Feature.Vector>}
             * options - {Object} Optional object for configuring the request.
             *
             * Returns:
             * {<OpenLayers.Protocol.Response>} An <OpenLayers.Protocol.Response>
             * object, the same object will be passed to the callback function passed
             * if one exists in the options object.
             */
            create: function () {
            },

            /**
             * APIMethod: update
             * Construct a request updating modified features.
             *
             * Parameters:
             * features - {Array({<OpenLayers.Feature.Vector>})} or
             *            {<OpenLayers.Feature.Vector>}
             * options - {Object} Optional object for configuring the request.
             *
             * Returns:
             * {<OpenLayers.Protocol.Response>} An <OpenLayers.Protocol.Response>
             * object, the same object will be passed to the callback function passed
             * if one exists in the options object.
             */
            update: function () {
            },

            /**
             * APIMethod: delete
             * Construct a request deleting a removed feature.
             *
             * Parameters:
             * feature - {<OpenLayers.Feature.Vector>}
             * options - {Object} Optional object for configuring the request.
             *
             * Returns:
             * {<OpenLayers.Protocol.Response>} An <OpenLayers.Protocol.Response>
             * object, the same object will be passed to the callback function passed
             * if one exists in the options object.
             */
            "delete": function () {
            },

            /**
             * APIMethod: commit
             * Go over the features and for each take action
             * based on the feature state. Possible actions are create,
             * update and delete.
             *
             * Parameters:
             * features - {Array({<OpenLayers.Feature.Vector>})}
             * options - {Object} Object whose possible keys are "create", "update",
             *      "delete", "callback" and "scope", the values referenced by the
             *      first three are objects as passed to the "create", "update", and
             *      "delete" methods, the value referenced by the "callback" key is
             *      a function which is called when the commit operation is complete
             *      using the scope referenced by the "scope" key.
             *
             * Returns:
             * {Array({<OpenLayers.Protocol.Response>})} An array of
             * <OpenLayers.Protocol.Response> objects.
             */
            commit: function () {
            },

            /**
             * Method: abort
             * Abort an ongoing request.
             *
             * Parameters:
             * response - {<OpenLayers.Protocol.Response>}
             */
            abort: function (response) {
            },

            /**
             * Method: createCallback
             * Returns a function that applies the given public method with resp and
             *     options arguments.
             *
             * Parameters:
             * method - {Function} The method to be applied by the callback.
             * response - {<OpenLayers.Protocol.Response>} The protocol response object.
             * options - {Object} Options sent to the protocol method
             */
            createCallback: function (method, response, options) {
                return uOpenLayers.Function.bind(function () {
                    method.apply(this, [response, options]);
                }, this);
            },

            CLASS_NAME: "OpenLayers.Protocol"
        });

        /**
         * Class: OpenLayers.Protocol.Response
         * Protocols return Response objects to their users.
         */
        uOpenLayers.Protocol.Response = uOpenLayers.Class({
            /**
             * Property: code
             * {Number} - OpenLayers.Protocol.Response.SUCCESS or
             *            OpenLayers.Protocol.Response.FAILURE
             */
            code: null,

            /**
             * Property: requestType
             * {String} The type of request this response corresponds to. Either
             *      "create", "read", "update" or "delete".
             */
            requestType: null,

            /**
             * Property: last
             * {Boolean} - true if this is the last response expected in a commit,
             * false otherwise, defaults to true.
             */
            last: true,

            /**
             * Property: features
             * {Array({<OpenLayers.Feature.Vector>})} or {<OpenLayers.Feature.Vector>}
             * The features returned in the response by the server. Depending on the
             * protocol's read payload, either features or data will be populated.
             */
            features: null,

            /**
             * Property: data
             * {Object}
             * The data returned in the response by the server. Depending on the
             * protocol's read payload, either features or data will be populated.
             */
            data: null,

            /**
             * Property: reqFeatures
             * {Array({<OpenLayers.Feature.Vector>})} or {<OpenLayers.Feature.Vector>}
             * The features provided by the user and placed in the request by the
             *      protocol.
             */
            reqFeatures: null,

            /**
             * Property: priv
             */
            priv: null,

            /**
             * Property: error
             * {Object} The error object in case a service exception was encountered.
             */
            error: null,

            /**
             * Constructor: OpenLayers.Protocol.Response
             *
             * Parameters:
             * options - {Object} Optional object whose properties will be set on the
             *     instance.
             */
            initialize: function (options) {
                uOpenLayers.Util.extend(this, options);
            },

            /**
             * Method: success
             *
             * Returns:
             * {Boolean} - true on success, false otherwise
             */
            success: function () {
                return this.code > 0;
            },

            CLASS_NAME: "OpenLayers.Protocol.Response"
        });

        uOpenLayers.Protocol.Response.SUCCESS = 1;
        uOpenLayers.Protocol.Response.FAILURE = 0;

        /**
         * if application uses the query string, for example, for BBOX parameters,
         * OpenLayers/Format/QueryStringFilter.js should be included in the build config file
         */

        /**
         * Class: OpenLayers.Protocol.Script
         * A basic Script protocol for vector layers.  Create a new instance with the
         *     <OpenLayers.Protocol.Script> constructor.  A script protocol is used to
         *     get around the same origin policy.  It works with services that return
         *     JSONP - that is, JSON wrapped in a client-specified callback.  The
         *     protocol handles fetching and parsing of feature data and sends parsed
         *     features to the <callback> configured with the protocol.  The protocol
         *     expects features serialized as GeoJSON by default, but can be configured
         *     to work with other formats by setting the <format> property.
         *
         * Inherits from:
         *  - <OpenLayers.Protocol>
         */
        OpenLayers.Protocol.Script = OpenLayers.Class(OpenLayers.Protocol, {

            /**
             * APIProperty: url
             * {String} Service URL.  The service is expected to return serialized
             *     features wrapped in a named callback (where the callback name is
             *     generated by this protocol).
             *     Read-only, set through the options passed to the constructor.
             */
            url: null,

            /**
             * APIProperty: params
             * {Object} Query string parameters to be appended to the URL.
             *     Read-only, set through the options passed to the constructor.
             *     Example: {maxFeatures: 50}
             */
            params: null,

            /**
             * APIProperty: callback
             * {Object} Function to be called when the <read> operation completes.
             */
            callback: null,

            /**
             * APIProperty: callbackTemplate
             * {String} Template for creating a unique callback function name
             * for the registry. Should include ${id}.  The ${id} variable will be
             * replaced with a string identifier prefixed with a "c" (e.g. c1, c2).
             * Default is "OpenLayers.Protocol.Script.registry.${id}".
             */
            callbackTemplate: "OpenLayers.Protocol.Script.registry.${id}",

            /**
             * APIProperty: callbackKey
             * {String} The name of the query string parameter that the service
             *     recognizes as the callback identifier.  Default is "callback".
             *     This key is used to generate the URL for the script.  For example
             *     setting <callbackKey> to "myCallback" would result in a URL like
             *     http://example.com/?myCallback=...
             */
            callbackKey: "callback",

            /**
             * APIProperty: callbackPrefix
             * {String} Where a service requires that the callback query string
             *     parameter value is prefixed by some string, this value may be set.
             *     For example, setting <callbackPrefix> to "foo:" would result in a
             *     URL like http://example.com/?callback=foo:...  Default is "".
             */
            callbackPrefix: "",

            /**
             * APIProperty: scope
             * {Object} Optional ``this`` object for the callback. Read-only, set
             *     through the options passed to the constructor.
             */
            scope: null,

            /**
             * APIProperty: format
             * {<OpenLayers.Format>} Format for parsing features.  Default is an
             *     <OpenLayers.Format.GeoJSON> format.  If an alternative is provided,
             *     the format's read method must take an object and return an array
             *     of features.
             */
            format: null,

            /**
             * Property: pendingRequests
             * {Object} References all pending requests.  Property names are script
             *     identifiers and property values are script elements.
             */
            pendingRequests: null,

            /**
             * APIProperty: srsInBBOX
             * {Boolean} Include the SRS identifier in BBOX query string parameter.
             *     Setting this property has no effect if a custom filterToParams method
             *     is provided.   Default is false.  If true and the layer has a
             *     projection object set, any BBOX filter will be serialized with a
             *     fifth item identifying the projection.
             *     E.g. bbox=-1000,-1000,1000,1000,EPSG:900913
             */
            srsInBBOX: false,

            /**
             * Constructor: OpenLayers.Protocol.Script
             * A class for giving layers generic Script protocol.
             *
             * Parameters:
             * options - {Object} Optional object whose properties will be set on the
             *     instance.
             *
             * Valid options include:
             * url - {String}
             * params - {Object}
             * callback - {Function}
             * scope - {Object}
             */
            initialize: function (options) {
                options = options || {};
                this.params = {};
                this.pendingRequests = {};
                uOpenLayers.Protocol.prototype.initialize.apply(this, arguments);
                if (!this.format) {
                    this.format = new uOpenLayers.Format.GeoJSON();
                }

                if (!this.filterToParams && uOpenLayers.Format.QueryStringFilter) {
                    var format = new uOpenLayers.Format.QueryStringFilter({
                        srsInBBOX: this.srsInBBOX
                    });
                    this.filterToParams = function (filter, params) {
                        return format.write(filter, params);
                    };
                }
            },

            /**
             * APIMethod: read
             * Construct a request for reading new features.
             *
             * Parameters:
             * options - {Object} Optional object for configuring the request.
             *     This object is modified and should not be reused.
             *
             * Valid options:
             * url - {String} Url for the request.
             * params - {Object} Parameters to get serialized as a query string.
             * filter - {<OpenLayers.Filter>} Filter to get serialized as a
             *     query string.
             *
             * Returns:
             * {<OpenLayers.Protocol.Response>} A response object, whose "priv" property
             *     references the injected script.  This object is also passed to the
             *     callback function when the request completes, its "features" property
             *     is then populated with the features received from the server.
             */
            read: function (options) {
                uOpenLayers.Protocol.prototype.read.apply(this, arguments);
                options = uOpenLayers.Util.applyDefaults(options, this.options);
                options.params = uOpenLayers.Util.applyDefaults(
                    options.params, this.options.params
                );
                if (options.filter && this.filterToParams) {
                    options.params = this.filterToParams(
                        options.filter, options.params
                    );
                }
                var response = new uOpenLayers.Protocol.Response({requestType: "read"});
                var request = this.createRequest(
                    options.url,
                    options.params,
                    uOpenLayers.Function.bind(function (data) {
                        response.data = data;
                        this.handleRead(response, options);
                    }, this)
                );
                response.priv = request;
                return response;
            },

            /**
             * APIMethod: filterToParams
             * Optional method to translate an <OpenLayers.Filter> object into an object
             *     that can be serialized as request query string provided.  If a custom
             *     method is not provided, any filter will not be serialized.
             *
             * Parameters:
             * filter - {<OpenLayers.Filter>} filter to convert.
             * params - {Object} The parameters object.
             *
             * Returns:
             * {Object} The resulting parameters object.
             */

            /**
             * Method: createRequest
             * Issues a request for features by creating injecting a script in the
             *     document head.
             *
             * Parameters:
             * url - {String} Service URL.
             * params - {Object} Query string parameters.
             * callback - {Function} Callback to be called with resulting data.
             *
             * Returns:
             * {HTMLScriptElement} The script pending execution.
             */
            createRequest: function (url, params, callback) {
                var id = uOpenLayers.Protocol.Script.register(callback);
                var name = uOpenLayers.String.format(this.callbackTemplate, {id: id});
                params = uOpenLayers.Util.extend({}, params);
                params[this.callbackKey] = this.callbackPrefix + name;
                url = uOpenLayers.Util.urlAppend(
                    url, uOpenLayers.Util.getParameterString(params)
                );
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                script.id = "OpenLayers_Protocol_Script_" + id;
                this.pendingRequests[script.id] = script;
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(script);
                return script;
            },

            /**
             * Method: destroyRequest
             * Remove a script node associated with a response from the document.  Also
             *     unregisters the callback and removes the script from the
             *     <pendingRequests> object.
             *
             * Parameters:
             * script - {HTMLScriptElement}
             */
            destroyRequest: function (script) {
                OpenLayers.Protocol.Script.unregister(script.id.split("_").pop());
                delete this.pendingRequests[script.id];
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            },

            /**
             * Method: handleRead
             * Individual callbacks are created for read, create and update, should
             *     a subclass need to override each one separately.
             *
             * Parameters:
             * response - {<OpenLayers.Protocol.Response>} The response object to pass to
             *     the user callback.
             * options - {Object} The user options passed to the read call.
             */
            handleRead: function (response, options) {
                this.handleResponse(response, options);
            },

            /**
             * Method: handleResponse
             * Called by CRUD specific handlers.
             *
             * Parameters:
             * response - {<OpenLayers.Protocol.Response>} The response object to pass to
             *     any user callback.
             * options - {Object} The user options passed to the create, read, update,
             *     or delete call.
             */
            handleResponse: function (response, options) {
                if (options.callback) {
                    if (response.data) {
                        response.features = this.parseFeatures(response.data);
                        response.code = uOpenLayers.Protocol.Response.SUCCESS;
                    } else {
                        response.code = uOpenLayers.Protocol.Response.FAILURE;
                    }
                    this.destroyRequest(response.priv);
                    options.callback.call(options.scope, response);
                }
            },

            /**
             * Method: parseFeatures
             * Read Script response body and return features.
             *
             * Parameters:
             * data - {Object} The data sent to the callback function by the server.
             *
             * Returns:
             * {Array({<OpenLayers.Feature.Vector>})} or
             *     {<OpenLayers.Feature.Vector>} Array of features or a single feature.
             */
            parseFeatures: function (data) {
                return this.format.read(data);
            },

            /**
             * APIMethod: abort
             * Abort an ongoing request.  If no response is provided, all pending
             *     requests will be aborted.
             *
             * Parameters:
             * response - {<OpenLayers.Protocol.Response>} The response object returned
             *     from a <read> request.
             */
            abort: function (response) {
                if (response) {
                    this.destroyRequest(response.priv);
                } else {
                    for (var key in this.pendingRequests) {
                        this.destroyRequest(this.pendingRequests[key]);
                    }
                }
            },

            /**
             * APIMethod: destroy
             * Clean up the protocol.
             */
            destroy: function () {
                this.abort();
                delete this.params;
                delete this.format;
                uOpenLayers.Protocol.prototype.destroy.apply(this);
            },

            CLASS_NAME: "OpenLayers.Protocol.Script"
        });

        (function () {
            var o = uOpenLayers.Protocol.Script;
            var counter = 0;
            o.registry = {};

            /**
             * Function: OpenLayers.Protocol.Script.register
             * Register a callback for a newly created script.
             *
             * Parameters:
             * callback - {Function} The callback to be executed when the newly added
             *     script loads.  This callback will be called with a single argument
             *     that is the JSON returned by the service.
             *
             * Returns:
             * {Number} An identifier for retrieving the registered callback.
             */
            o.register = function (callback) {
                var id = "c" + (++counter);
                o.registry[id] = function () {
                    callback.apply(this, arguments);
                };
                return id;
            };

            /**
             * Function: OpenLayers.Protocol.Script.unregister
             * Unregister a callback previously registered with the register function.
             *
             * Parameters:
             * id - {Number} The identifer returned by the register function.
             */
            o.unregister = function (id) {
                delete o.registry[id];
            };
        })();
    }

    const loadPopup = () => {
        if (uOpenLayers.Popup.Autobahn) return;
        /**
         * Class: OpenLayers.Popup.Autobahn
         *
         * Inherits from:
         *  - <OpenLayers.Popup>
         */
        uOpenLayers.Popup.Autobahn =
            uOpenLayers.Class(uOpenLayers.Popup, {

                /**
                 * Property: relativePosition
                 * {String} Relative position of the popup ("br", "tr", "tl" or "bl").
                 */
                relativePosition: null,

                /**
                 * APIProperty: keepInMap
                 * {Boolean} If panMapIfOutOfView is false, and this property is true,
                 *     contrain the popup such that it always fits in the available map
                 *     space. By default, this is set. If you are creating popups that are
                 *     near map edges and not allowing pannning, and especially if you have
                 *     a popup which has a fixedRelativePosition, setting this to false may
                 *     be a smart thing to do.
                 *
                 *     For anchored popups, default is true, since subclasses will
                 *     usually want this functionality.
                 */
                keepInMap: true,

                /**
                 * Property: anchor
                 * {Object} Object to which we'll anchor the popup. Must expose a
                 *     'size' (<OpenLayers.Size>) and 'offset' (<OpenLayers.Pixel>).
                 */
                anchor: null,
                loaded: false,
                rawData: null,

                /**
                 * Constructor: OpenLayers.Popup.Autobahn
                 *
                 * Parameters:
                 * id - {String}
                 * lonlat - {<OpenLayers.LonLat>}
                 * contentSize - {<OpenLayers.Size>}
                 * contentHTML - {String}
                 * anchor - {Object} Object which must expose a 'size' <OpenLayers.Size>
                 *     and 'offset' <OpenLayers.Pixel> (generally an <OpenLayers.Icon>).
                 * closeBox - {Boolean}
                 * closeBoxCallback - {Function} Function to be called on closeBox click.
                 */
                initialize: function (id, lonlat, contentSize, contentHTML, anchor, closeBox,
                                      closeBoxCallback) {
                    const newArguments = [
                        id, lonlat, contentSize, contentHTML, closeBox, closeBoxCallback
                    ];
                    uOpenLayers.Popup.prototype.initialize.apply(this, newArguments);

                    this.anchor = (anchor != null) ? anchor
                        : {
                            size: new uOpenLayers.Size(0, 0),
                            offset: new uOpenLayers.Pixel(0, 0)
                        };
                },

                /**
                 * APIMethod: destroy
                 */
                destroy: function () {
                    this.anchor = null;
                    this.relativePosition = null;

                    uOpenLayers.Popup.prototype.destroy.apply(this, arguments);
                },

                draw: function () {
                    if (!this.loaded) {
                        GM.xmlHttpRequest({
                            url: 'https://verkehr.autobahn.de/karte?p_p_id=de_strassennrw_vipnrw_map_portlet_MapPortlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                            },
                            data: `action=getTrafficObjectsByIdentifier&identifier=${this.feature.cluster.map(c => c.attributes.identifier).join('|')}`,
                            onload: (response) => {
                                this.rawData = JSON.parse(response.responseText).data;
                                this.setContentHTML(`
                                    <div style="user-select: text; word-wrap: break-word; background-color: #f6f6f6;">
                                      <div style="display: flex; gap: 8px; flex-direction: column">
                                          ${this.rawData.map((d) => `
                                            <div style="padding: 5px; background-color: white;">
                                              <div class="content">
                                                <div style="padding: 8px; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; border-bottom: 1px solid #d0d0d0;">
                                                  <div style="padding: 4px;">
                                                    <div style="font-weight: bold; font-size: 16px; color: #2b2e3e">${d.title}</div>
                                                    <div style="font-size: 14px; color: #2b2e3e;">${d.subtitle}</div>
                                                  </div>
                                                </div>
                                                <div style="padding: 10px">
                                                  <div style="font-size: 14px; padding: 5px; line-height: 20px;">
                                                    ${d.description.join('<br>')}
                                                  </div>
                                                  ${d.impact ? `
                                                    <div style="font-size: 13px; line-height: 13px;">
                                                      <div style="padding: 5px;">${d.impact.upper}</div>
                                                      ${d.impact.symbols.map(s => `<img src="https://verkehr.autobahn.de/o/autobahn-app-theme/images/traffic-object/impact-symbol/${s}.png">`).join('')}
                                                      <div style="padding: 5px;">${d.impact.lower}</div>
                                                    </div>
                                                  ` : ''}
                                                </div>
                                                <div>
                                                  <div style="display: flex; flex-direction: row; padding: 8px; justify-content: space-between; align-items: center; font-size: 13px; line-height: 13px; color: #233755;">
                                                    <div style="font-size: 13px; line-height: 13px; padding: 5px;">
                                                      ${d.footer.join('<br>')}
                                                    </div>
                                                  </div>
                                                  <div style="font-size: 9px; line-height: 9px; color: silver;">
                                                    ID: ${d.identifier}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>`).join('')}
                                      </div>
                                    </div>
                                `);
                                this.contentDiv.style.width = '320px';
                            }
                        });
                        this.loaded = true;
                    }
                    return uOpenLayers.Popup.prototype.draw.apply(this, arguments);
                },

                /**
                 * APIMethod: show
                 * Overridden from Popup since user might hide popup and then show() it
                 *     in a new location (meaning we might want to update the relative
                 *     position on the show)
                 */
                show: function () {
                    this.updatePosition();
                    uOpenLayers.Popup.prototype.show.apply(this, arguments);
                },

                /**
                 * Method: moveTo
                 * Since the popup is moving to a new px, it might need also to be moved
                 *     relative to where the marker is. We first calculate the new
                 *     relativePosition, and then we calculate the new px where we will
                 *     put the popup, based on the new relative position.
                 *
                 *     If the relativePosition has changed, we must also call
                 *     updateRelativePosition() to make any visual changes to the popup
                 *     which are associated with putting it in a new relativePosition.
                 *
                 * Parameters:
                 * px - {<OpenLayers.Pixel>}
                 */
                moveTo: function (px) {
                    var oldRelativePosition = this.relativePosition;
                    this.relativePosition = this.calculateRelativePosition(px);

                    uOpenLayers.Popup.prototype.moveTo.call(this, this.calculateNewPx(px));

                    //if this move has caused the popup to change its relative position, 
                    // we need to make the appropriate cosmetic changes.
                    if (this.relativePosition !== oldRelativePosition) {
                        this.updateRelativePosition();
                    }
                },

                /**
                 * APIMethod: setSize
                 *
                 * Parameters:
                 * contentSize - {<OpenLayers.Size>} the new size for the popup's
                 *     contents div (in pixels).
                 */
                setSize: function (contentSize) {
                    uOpenLayers.Popup.prototype.setSize.apply(this, arguments);

                    if ((this.lonlat) && (this.map)) {
                        const px = this.map.getLayerPxFromLonLat(this.lonlat);
                        this.moveTo(px);
                    }
                },

                /**
                 * Method: calculateRelativePosition
                 *
                 * Parameters:
                 * px - {<OpenLayers.Pixel>}
                 *
                 * Returns:
                 * {String} The relative position ("br" "tr" "tl" "bl") at which the popup
                 *     should be placed.
                 */
                calculateRelativePosition: function (px) {
                    const lonlat = this.map.getLonLatFromLayerPx(px);

                    const extent = this.map.getExtent();
                    const quadrant = extent.determineQuadrant(lonlat);

                    return uOpenLayers.Bounds.oppositeQuadrant(quadrant);
                },

                /**
                 * Method: updateRelativePosition
                 * The popup has been moved to a new relative location, so we may want to
                 *     make some cosmetic adjustments to it.
                 *
                 *     Note that in the classic Anchored popup, there is nothing to do
                 *     here, since the popup looks exactly the same in all four positions.
                 *     Subclasses such as Framed, however, will want to do something
                 *     special here.
                 */
                updateRelativePosition: function () {
                    //to be overridden by subclasses
                },

                /**
                 * Method: calculateNewPx
                 *
                 * Parameters:
                 * px - {<OpenLayers.Pixel>}
                 *
                 * Returns:
                 * {<OpenLayers.Pixel>} The the new px position of the popup on the screen
                 *     relative to the passed-in px.
                 */
                calculateNewPx: function (px) {
                    var newPx = px.offset(this.anchor.offset);

                    //use contentSize if size is not already set
                    var size = this.size || this.contentSize;

                    var top = (this.relativePosition.charAt(0) == 't');
                    newPx.y += (top) ? -size.h : this.anchor.size.h;

                    var left = (this.relativePosition.charAt(1) == 'l');
                    newPx.x += (left) ? -size.w : this.anchor.size.w;

                    return newPx;
                },

                CLASS_NAME: "OpenLayers.Popup.Autobahn"
            });
    }

    const makePopup = (feature) => {
        if (!feature.popup) {
            const popupClass = uOpenLayers.Popup.Autobahn;
            feature.popup = new popupClass(feature.id + "_popup",
                feature.geometry.bounds.centerLonLat,
                feature.data.popupSize,
                feature.data.popupContentHTML,
                null,
                false);
            feature.popup.maxSize = new uOpenLayers.Size(320, Number.MAX_VALUE);
            feature.popup.minSize = new uOpenLayers.Size(320, 20);
            feature.popup.autoSize = true;
        }
        if (feature.data.overflow != null) {
            feature.popup.contentDiv.style.overflow = feature.data.overflow;
        }

        feature.popup.feature = feature;
        return feature.popup;
    }

    const loadPinLayer = () => {
        const style = new OpenLayers.Style({
            externalGraphic: '${imageURL}',
            graphicWidth: 20, graphicHeight: 20,
            title: 'marker'
        }, {
            context: {
                imageURL: function (feature) {
                    return mtotypes[feature.cluster[0].attributes.display_type];
                }
            }
        });

        pinLayer = new uOpenLayers.Layer.Vector("AutobahnPins", {
            projection: 'EPSG:900913',
            strategies: [
                new uOpenLayers.Strategy.Fixed(),
                new uOpenLayers.Strategy.Cluster()
            ],
            protocol: new uOpenLayers.Protocol.Script({
                url: 'https://verkehr.autobahn.de/geoserver/vipnrw/wms',
                params: {
                    service: 'WFS',
                    version: '2.0.0',
                    request: 'GetFeature',
                    typename: [
                        'vipnrw:planed_traffic_interstate_feature',
                        'vipnrw:planed_traffic_urban_feature',
                        'vipnrw:traffic_roadworks_urban_feature',
                        'vipnrw:traffic_roadworks_interstate_feature',
                        'vipnrw:traffic_obstructions_urban_feature',
                        'vipnrw:traffic_obstructions_interstate_feature',
                        'vipnrw:traffic_abnormal_travel_time_loss_feature'
                    ].join(','),
                    srsname: 'EPSG:900913',
                    outputFormat: 'text/javascript'
                },
                callbackKey: 'format_options',
                callbackPrefix: 'callback:'
            }),
            styleMap: new uOpenLayers.StyleMap({
                "default": style
            }),
            selectable: true
        });

        // add featureselected event

        uWaze.map.addLayer(pinLayer);
        const rootLayer = uWaze.selectionManager.selectionMediator._rootContainerLayer;
        rootLayer.layers.push(pinLayer);
        rootLayer.resetRoots();
        rootLayer.collectRoots();

        uWaze.selectionManager.selectionMediator.on('map:selection:featureClick', function (event) {
            const layer = event.feature.layer;
            if (layer === pinLayer) {
                const sameMarkerClicked = (this === layer.selectedFeature);
                layer.selectedFeature = (!sameMarkerClicked) ? event.feature : null;
                if (!sameMarkerClicked) {
                    layer.map.addPopup(makePopup(event.feature), true);
                    event.feature.popup.div.style.zIndex += 1000;
                }
            }
        }, uWaze.selectionManager);

        uWaze.selectionManager.selectionMediator.on('map:selection:clickOut', function (event) {
            if (pinLayer && pinLayer.selectedFeature) {
                if (pinLayer.selectedFeature.popup)
                    pinLayer.map.removePopup(pinLayer.selectedFeature.popup);
                
                pinLayer.selectedFeature = null;
            }
        }, uWaze.selectionManager);
    }

    const init = () => {
        uWaze = unsafeWindow.W;
        uOpenLayers = unsafeWindow.OpenLayers;

        loadWMSFormat();
        loadFixedStrategy();
        loadProtocol();
        loadPopup();
        loadPinLayer();

        let displayGroupSelector = document.getElementById('layer-switcher-group_display');
        if (displayGroupSelector != null) {
            let displayGroup = displayGroupSelector.parentNode.parentNode.getElementsByTagName("ul")[0];

            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://geotiles.autobahn.de/geowebcache/service/wmts/?Service=WMTS&Request=GetCapabilities&Version=1.0.0',
                onload: (response) => {
                    const responseXML = new DOMParser().parseFromString(response.responseText.replaceAll('http://geotiles.autobahn.de:14080', 'https://geotiles.autobahn.de'), "text/xml");

                    let format = new uOpenLayers.Format.WMTSCapabilities({});
                    let capabilities = format.read(responseXML);

                    const losLayer = format.createLayer(capabilities, {
                        layer: 'LOS',
                        matrixSet: 'EPSG:900913',
                        format: "image/png",
                        opacity: 0.85,
                        isBaseLayer: false,
                        requestEncoding: 'KVP',
                        displayOutsideMaxExtent: false
                    });

                    const roadworkLinesLayer = format.createLayer(capabilities, {
                        layer: 'RoadworkLines',
                        matrixSet: 'EPSG:900913',
                        format: "image/png",
                        opacity: 0.85,
                        isBaseLayer: false,
                        requestEncoding: 'KVP',
                        displayOutsideMaxExtent: false
                    });

                    uWaze.map.addLayer(losLayer);
                    uWaze.map.addLayer(roadworkLinesLayer);
                    uWaze.map.setLayerIndex(losLayer, 3);
                    uWaze.map.setLayerIndex(roadworkLinesLayer, 4);

                    // Make checkbox and add to "display" section
                    const toggleEntry = document.createElement('li');
                    const checkbox = document.createElement("wz-checkbox");
                    checkbox.className = "hydrated";
                    checkbox.disabled = !displayGroupSelector.checked;
                    checkbox.checked = localStorage['main_autobahn_verkehr'] === "true";
                    checkbox.appendChild(document.createTextNode('verkehr.autobahn.de'));

                    toggleEntry.appendChild(checkbox);
                    displayGroup.appendChild(toggleEntry);

                    // Add suboptions
                    const subOptions = document.createElement('ul');
                    subOptions.style.display = localStorage['main_autobahn_verkehr'] === "true" ? "block" : "none";
                    const options = [
                        {name: 'Verkehrslage', layer: losLayer, storageKey: 'layer_autobahn_traffic'},
                        {name: 'Verkehrsmeldungen', layer: pinLayer, storageKey: 'layer_autobahn_reports'},
                        {name: 'Eingezeichnete Meldungen', layer: roadworkLinesLayer, storageKey: 'layer_autobahn_drawn_warning'},
                    ]

                    options.forEach((option) => {
                        option.layer.setVisibility(localStorage['main_autobahn_verkehr'] === "true" && localStorage[option.storageKey] === "true");

                        const subOption = document.createElement('li');
                        const subCheckbox = document.createElement("wz-checkbox");
                        subCheckbox.className = "hydrated";
                        subCheckbox.checked = localStorage[option.storageKey] === "true";
                        subCheckbox.appendChild(document.createTextNode(option.name));

                        subOption.appendChild(subCheckbox);
                        subOptions.appendChild(subOption);

                        subCheckbox.addEventListener('click', (e) => {
                            const checked = e.target.checked;
                            localStorage[option.storageKey] = checked.toString();
                            option.layer.setVisibility(checked);
                        });
                    });

                    displayGroup.appendChild(subOptions);

                    checkbox.addEventListener('click', (e) => {
                        const checked = e.target.checked;
                        subOptions.style.display = checked ? 'block' : 'none';
                        localStorage['main_autobahn_verkehr'] = checked.toString();

                        options.forEach((option) => {
                            option.layer.setVisibility(checked && localStorage[option.storageKey] === "true");
                        });
                    });

                    displayGroupSelector.addEventListener('click', (e) => {
                        options.forEach((option) => {
                            option.layer.setVisibility(e.target.checked && checkbox.checked && localStorage[option.storageKey] === "true");
                        });
                    });
                }
            });
        }
    }

    const bootstrap = () => {
        if (unsafeWindow.W?.userscripts?.state.isInitialized) {
            init();
        } else {
            document.addEventListener("wme-initialized", init, {
                once: true,
            });
        }
    };

    bootstrap();
})();

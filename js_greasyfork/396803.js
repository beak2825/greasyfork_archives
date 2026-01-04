// ==UserScript==
// @name        XCTrails Respotter
// @match       https://www.xctrails.org/ps/*
// @grant       none
// @version     1.1
// @author      Louhikoru
// @description Helps to recenter XCTrails into given coordinates/geocode
// @namespace   https://greasyfork.org/en/scripts/396803
// @homepageURL https://greasyfork.org/en/scripts/396803
// @supportURL  https://greasyfork.org/en/scripts/396803/feedback
// @license     The Coffeeware License
// @downloadURL https://update.greasyfork.org/scripts/396803/XCTrails%20Respotter.user.js
// @updateURL https://update.greasyfork.org/scripts/396803/XCTrails%20Respotter.meta.js
// ==/UserScript==
(function() {
'use strict';

/*
 * Hacking the Google Map JS API for free usage
 * https://dev.to/vince_tblt/hacking-the-google-map-embedded-api-for-free-usage-2ph1
 */

// Store old reference
const appendChild = Element.prototype.appendChild;

// All services to catch
const urlCatchers = [
  "/AuthenticationService.Authenticate?",
  "/QuotaService.RecordEvent?"
];

function addScript(text) {
  var head = document.getElementsByTagName("head")[0] || document.documentElement,
      script = document.createElement('script');
  script.type = "text/javascript";
  script.appendChild(document.createTextNode(text));
  head.appendChild(script);
}

// Google Map is using JSONP.
// So we only need to detect the services removing access and disabling them by not
// inserting them inside the DOM
Element.prototype.appendChild = function (element) {
  const isGMapScript = element.tagName === 'SCRIPT' && /maps\.googleapis\.com/i.test(element.src);
  const isGMapAccessScript = isGMapScript && urlCatchers.some(url => element.src.includes(url));

  if (!isGMapAccessScript) {
    return appendChild.call(this, element);
  }

  // Extract the callback to call it with success data
  // Only needed if you actually want to use Autocomplete/SearchBox API
  const callback = element.src.split(/.*callback=([^\&]+)/, 2).pop();
  const [a, b] = callback.split('.');
  window[a][b]([1, null, 0, null, null, [1]]);

  // Returns the element to be compliant with the appendChild API
  return element;
};

/*
 * Coordinate Parser
 * Intelligent geographical coordinate parser in JavaScript
 * https://github.com/otto-dev/coordinate-parser
 * Copyright 2016 Weprog GmbH.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */
addScript(`
Validator = (function() {
  function Validator() {}

  Validator.prototype.isValid = function(coordinates) {
    var error, isValid, validationError;
    isValid = true;
    try {
      this.validate(coordinates);
      return isValid;
    } catch (error) {
      validationError = error;
      isValid = false;
      return isValid;
    }
  };

  Validator.prototype.validate = function(coordinates) {
    this.checkContainsNoLetters(coordinates);
    this.checkValidOrientation(coordinates);
    return this.checkNumbers(coordinates);
  };

  Validator.prototype.checkContainsNoLetters = function(coordinates) {
    var containsLetters;
    containsLetters = /(?![neswd])[a-z]/i.test(coordinates);
    if (containsLetters) {
      throw new Error('Coordinate contains invalid alphanumeric characters.');
    }
  };

  Validator.prototype.checkValidOrientation = function(coordinates) {
    var validOrientation;
    validOrientation = /^[^nsew]*[ns]?[^nsew]*[ew]?[^nsew]*$/i.test(coordinates);
    if (!validOrientation) {
      throw new Error('Invalid cardinal direction.');
    }
  };

  Validator.prototype.checkNumbers = function(coordinates) {
    var coordinateNumbers;
    coordinateNumbers = coordinates.match(\/-?\\d+(\\.\\d+)?\/g);
    this.checkAnyCoordinateNumbers(coordinateNumbers);
    this.checkEvenCoordinateNumbers(coordinateNumbers);
    return this.checkMaximumCoordinateNumbers(coordinateNumbers);
  };

  Validator.prototype.checkAnyCoordinateNumbers = function(coordinateNumbers) {
    if (coordinateNumbers.length === 0) {
      throw new Error('Could not find any coordinate number');
    }
  };

  Validator.prototype.checkEvenCoordinateNumbers = function(coordinateNumbers) {
    var isUnevenNumbers;
    isUnevenNumbers = coordinateNumbers.length % 2;
    if (isUnevenNumbers) {
      throw new Error('Uneven count of latitude/longitude numbers');
    }
  };

  Validator.prototype.checkMaximumCoordinateNumbers = function(coordinateNumbers) {
    if (coordinateNumbers.length > 6) {
      throw new Error('Too many coordinate numbers');
    }
  };

  return Validator;
})();

CoordinateNumber = (function() {
  function CoordinateNumber(coordinateNumbers) {
    coordinateNumbers = this.normalizeCoordinateNumbers(coordinateNumbers);
    this.degrees = coordinateNumbers[0], this.minutes = coordinateNumbers[1], this.seconds = coordinateNumbers[2], this.milliseconds = coordinateNumbers[3];
    this.sign = this.normalizedSignOf(this.degrees);
    this.degrees = Math.abs(this.degrees);
  }

  CoordinateNumber.prototype.normalizeCoordinateNumbers = function(coordinateNumbers) {
    var currentNumber, i, j, len, normalizedNumbers;
    normalizedNumbers = [0, 0, 0, 0];
    for (i = j = 0, len = coordinateNumbers.length; j < len; i = ++j) {
      currentNumber = coordinateNumbers[i];
      normalizedNumbers[i] = parseFloat(currentNumber);
    }
    return normalizedNumbers;
  };

  CoordinateNumber.prototype.normalizedSignOf = function(number) {
    if (number >= 0) {
      return 1;
    } else {
      return -1;
    }
  };

  CoordinateNumber.prototype.detectSpecialFormats = function() {
    if (this.degreesCanBeSpecial()) {
      if (this.degreesCanBeMilliseconds()) {
        return this.degreesAsMilliseconds();
      } else if (this.degreesCanBeDegreesMinutesAndSeconds()) {
        return this.degreesAsDegreesMinutesAndSeconds();
      } else if (this.degreesCanBeDegreesAndMinutes()) {
        return this.degreesAsDegreesAndMinutes();
      }
    }
  };

  CoordinateNumber.prototype.degreesCanBeSpecial = function() {
    var canBe;
    canBe = false;
    if (!this.minutes && !this.seconds) {
      canBe = true;
    }
    return canBe;
  };

  CoordinateNumber.prototype.degreesCanBeMilliseconds = function() {
    var canBe;
    if (this.degrees > 909090) {
      canBe = true;
    } else {
      canBe = false;
    }
    return canBe;
  };

  CoordinateNumber.prototype.degreesAsMilliseconds = function() {
    this.milliseconds = this.degrees;
    return this.degrees = 0;
  };

  CoordinateNumber.prototype.degreesCanBeDegreesMinutesAndSeconds = function() {
    var canBe;
    if (this.degrees > 9090) {
      canBe = true;
    } else {
      canBe = false;
    }
    return canBe;
  };

  CoordinateNumber.prototype.degreesAsDegreesMinutesAndSeconds = function() {
    var newDegrees;
    newDegrees = Math.floor(this.degrees / 10000);
    this.minutes = Math.floor((this.degrees - newDegrees * 10000) / 100);
    this.seconds = Math.floor(this.degrees - newDegrees * 10000 - this.minutes * 100);
    return this.degrees = newDegrees;
  };

  CoordinateNumber.prototype.degreesCanBeDegreesAndMinutes = function() {
    var canBe;
    if (this.degrees > 360) {
      canBe = true;
    } else {
      canBe = false;
    }
    return canBe;
  };

  CoordinateNumber.prototype.degreesAsDegreesAndMinutes = function() {
    var newDegrees;
    newDegrees = Math.floor(this.degrees / 100);
    this.minutes = this.degrees - newDegrees * 100;
    return this.degrees = newDegrees;
  };

  CoordinateNumber.prototype.toDecimal = function() {
    var decimalCoordinate;
    decimalCoordinate = this.sign * (this.degrees + this.minutes / 60 + this.seconds / 3600 + this.milliseconds / 3600000);
    return decimalCoordinate;
  };

  return CoordinateNumber;
})();

Coordinates = (function() {
  function Coordinates(coordinateString) {
    this.coordinates = coordinateString;
    this.latitudeNumbers = null;
    this.longitudeNumbers = null;
    this.validate();
    this.parse();
  }

  Coordinates.prototype.validate = function() {
    var validator;
    validator = new Validator;
    return validator.validate(this.coordinates);
  };

  Coordinates.prototype.parse = function() {
    this.groupCoordinateNumbers();
    this.latitude = this.extractLatitude();
    return this.longitude = this.extractLongitude();
  };

  Coordinates.prototype.groupCoordinateNumbers = function() {
    var coordinateNumbers, numberCountEachCoordinate;
    coordinateNumbers = this.extractCoordinateNumbers(this.coordinates);
    numberCountEachCoordinate = coordinateNumbers.length / 2;
    this.latitudeNumbers = coordinateNumbers.slice(0, numberCountEachCoordinate);
    return this.longitudeNumbers = coordinateNumbers.slice(0 - numberCountEachCoordinate);
  };

  Coordinates.prototype.extractCoordinateNumbers = function(coordinates) {
    return coordinates.match(\/-?\\d+(\\.\\d+)?\/g);
  };

  Coordinates.prototype.extractLatitude = function() {
    var latitude;
    latitude = this.coordinateNumbersToDecimal(this.latitudeNumbers);
    if (this.latitudeIsNegative()) {
      latitude = latitude * -1;
    }
    return latitude;
  };

  Coordinates.prototype.extractLongitude = function() {
    var longitude;
    longitude = this.coordinateNumbersToDecimal(this.longitudeNumbers);
    if (this.longitudeIsNegative()) {
      longitude = longitude * -1;
    }
    return longitude;
  };

  Coordinates.prototype.coordinateNumbersToDecimal = function(coordinateNumbers) {
    var coordinate, decimalCoordinate;
    coordinate = new CoordinateNumber(coordinateNumbers);
    coordinate.detectSpecialFormats();
    decimalCoordinate = coordinate.toDecimal();
    return decimalCoordinate;
  };

  Coordinates.prototype.latitudeIsNegative = function() {
    var isNegative;
    isNegative = this.coordinates.match(/s/i);
    return isNegative;
  };

  Coordinates.prototype.longitudeIsNegative = function() {
    var isNegative;
    isNegative = this.coordinates.match(/w/i);
    return isNegative;
  };

  Coordinates.prototype.getLatitude = function() {
    return this.latitude;
  };

  Coordinates.prototype.getLongitude = function() {
    return this.longitude;
  };

  return Coordinates;
})();
`);

// Add helper function
addScript(`
function updateLocation() {
  var location = document.getElementById("location").value;

  try {
    // Try various coordinates formats
    var position = new Coordinates(location);
    console.log(position);
    var latlng = new google.maps.LatLng(position.getLatitude(), position.getLongitude());
    g_searchMap.panTo(latlng);
    g_searchMap.setZoom(15)
  } catch (error) {
    console.log(error);

    // Try geocoding -- jQuery is included by XCTrails
    var url = 'https://nominatim.openstreetmap.org/search.php?format=json&q=' + location;
    $.getJSON(url, function(data) {
      console.log(data);
      if (!data || !data.length) {
        console.log("Geocode not found");
        return;
      }
      if (data[0].boundingbox) {
        var box = data[0].boundingbox;
        var sw = new google.maps.LatLng(box[0], box[2]);
        var ne = new google.maps.LatLng(box[1], box[3]);
        box = new google.maps.LatLngBounds(sw, ne);
        g_searchMap.fitBounds(box);
        g_searchMap.setZoom(15)
      } else {
        var latlng = new google.maps.LatLng(data[0].lat, data[0].lon);
        g_searchMap.panTo(latlng);
        g_searchMap.setZoom(15)
      }
    });
  }
}
`);

// Add input and button
var newRow = document.getElementById("searchAddress").closest('tbody').insertRow(-1);
newRow.innerHTML = `
<td style="padding-top: 5px;" colspan=2>
<input id="location" type="text" maxlength="255" style="width:340px;" onkeyup="javascript:(event.keyCode == 13)&&updateLocation()" value=""/>
<button style="margin-left:12px" type="button" class="btn btn-primary btn-sm" onclick="updateLocation()">
<span data-localize="recenter">Jump to coordinates/geocode</span></button>
</td>`;
})();
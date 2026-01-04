// ==UserScript==
// @name         DuckDuckGo to Google Button
// @namespace    https://puac.de/
// @version      0.1.1
// @description  Displays a button on DuckDuckGo that redirects to the same search on Google.
// @author       Hans Puac
// @match        https://duckduckgo.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376631/DuckDuckGo%20to%20Google%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/376631/DuckDuckGo%20to%20Google%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var searchPattern = /[?|&]ia=([^&]*)/;

    var searchTypeMap = {
        'images': 'isch',
        'videos': 'vid',
        'news': 'nws'
    };

    var generateImage = function () {
        var image = document.createElement("img");
        image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABPdJREFUWIXFl31MU1cYxp9zb297S2mpUBTq/CIVBgboFKdGzYxOo1uiWRZJplG3ScT4gdNNmc6MkCULjg0TxCgbTqeLcy6bRpGRGafbzJgfIIrg12DoHIwCpbaln/fesz8mncptS53E96/b+z73fX6n555z3wM85SCRiHt378gSrN3rxZ6OSbDahglOOw8qEHAqkdUOcZDY2BZFnKHSKyi2x+fnO54YgKOsOM/XdHWrePNaPCgNq6eaaKpMN59nRg1fGrPinZuPDeDcU5rpb2io8jfUGwcC2g8kSkPV017Yr80vfIMAsuRBAew7i1d6TlbvhMPOPI75g8GYs1qZZLM5Njf3Xr+crHnpti3eyqO7noQ5ABC/TyOyNkk29+gNR1nJYk/VkS+p1xO+MKeEpFRS4nIRUNn6YFPSOumU8SbDknX2sAC9FTuMvSerb6PLoghmyo4Y4eZS0r9DXFy5dkXeWQJQaX+xxuVgXvW1t63211+cSNwuAgDsuIxOMu75sXJ/vSyAbeuGWl/NL+NlhSoeqhmzv9COblhOsr8RgxW079mVJlyp/ZEKEkMnZwYdeT8A343N0z0nGn/ynGjvNy00SkM18+Yvi1614UCoYgF9eTnXxdr4+Jzwe0HAzH/plQvorswSe+fAvtMC9I2REPALFr6rW7tx20DMIw0CAPTwQtaX8KuX8VlYAKCK5+D4VAWxwwNuwpTrQz4qTR0Mc+D+MhQyRy7oMwcAIlyCLrcFqqlDwSSNeXOwzAHg37fdb3u5X8ZvgfqlLpty8vqaUAXyD7kud/RIpkiNzWMUH7w1ly9SAAAR76XI7ZMMP7IJOBeykNMN4x0roiIFSEqQpgF9O6Hoi5ETSQrNnUgLDzS8PmL4D+ApBCHgAgCU5W2yIsE+atAAGHgCAOBibsiJBPdfg7b8eAXagb5VwBkqASx/UNDOmfBez0R9Wf3qSWvMS4O+iRnpamPWaLDB8jXNrru/d9C4R+9rVKQuAKAwKY/5/jaKjLeNBYAafh4KOmLg8Lcjhr+9F0BaMIPcLOIH4JfLlVZ7nm3t7G9OAOiV9Gvg/hQQUigxukkXJRBUKHOw4S4Hh98FADhnuZxadKF8UzCAUNFmlQ4JMl/pUfFwvj5L3RwAAACqNa/bJK2ke9osD4kpKKpbzxYV11YsicT84+PukvN/SJlyOVMCW9V3HQBQJm05x6gSL8s94BRd5GjLqf3v/7bjwMLDh4PONwAUnN7Lf3jqzJHvG8T1cvloNZX0KmFt3++HPr27mw4kHr/5850OjzVoQzJck+BJi0s6EquK2b3x2J9nUVgoFZwui9Zo+XmdbtuyRuv1ORZ3DzdBNxfN9dmQ6MO8s9PZrzbPVy+SBQCA7XX7Xvu2+YeDHtEbaqAAAIYw4KCgXuqTbW5N2hS4m1fB4dADAJKHke6Zuqhh2dkk0NDIPlhcW5F/tOVUkVf0hYUIF3qVHsOdqyE4kr0zx7Jpy2erWx7MB23LS+r25VTdPlNu8zr+93adrBvjnKF6e/KKWYmNj+ZCHkzKLh0cd6Wrqbqu+9ozj2PMEhbTEydcGJFgfHFd8pLwXXGw+KTu81WN3bcKrlpvDZUGcDRTshzM8anNabGmvDUZi6tCaSM6nH525WBGu8eW1+XuntrpvmfsFVy8JAqMklUJOi661xClbzWohpwxaKNLclIXtUVS+6nFP4ZN4ITLRid2AAAAAElFTkSuQmCC';
        image.style.width = '15px';
        image.style.float = 'left';
        image.style.margin = '10px 7px';
        image.style.cursor = 'pointer';
        return image;
    };

    var redirect = function () {
        var url = 'https://www.google.com/search?q=';
        var match = searchPattern.exec(window.location.search);
        var searchInput = document.getElementById('search_form_input').value;

        url += encodeURI(searchInput);

        if (match && match.length > 0) {
            var searchType = match[1];
            if (typeof searchTypeMap[searchType] !== 'undefined') {
                url += '&tbm=' + searchTypeMap[searchType];
            }
        }

        window.location.href = url;
    };

    var duckbar = document.getElementById('duckbar');
    if (duckbar !== null) {
        var image = generateImage();
        duckbar.prepend(image);
        image.addEventListener('click', redirect);
    }
})();

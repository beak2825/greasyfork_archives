(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.urlcat = factory());
})(this, (function () { 'use strict';

    const nullOrUndefined = v => v === undefined || v === null;
    const removeNullOrUndef = params => Object.entries(params).reduce((result, [key, value]) => {
        if (nullOrUndefined(value)) return result;
        result[key] = value;
        return result
    }, {});

    /**
     * Creates a query string from the specified object.
     *
     * @param {Object} params an object to convert into a query string.
     * @param {Object} config configuration to stringify the query params.
     *
     * @returns {String} Query string.
     *
     * @example
     * ```ts
     * query({ id: 42, search: 'foo' })
     * // -> 'id=42&search=foo'
     * ```
     */
    const query = (params, config) => {
        /* NOTE: Handle quirk of `new UrlSearchParams(params).toString()` in Webkit 602.x.xx
         *       versions which returns stringified object when params is empty object
         */
        if (Object.keys(params).length < 1) return '';
        return new URLSearchParams(params).toString();
    };

    /**
     * Joins two strings using a separator.
     * If the separator occurs at the concatenation boundary in either of the strings, it is removed.
     * This prevents accidental duplication of the separator.
     *
     * @param {String} part1 First string.
     * @param {String} separator Separator used for joining.
     * @param {String} part2 Second string.
     *
     * @returns {String} Joined string.
     *
     * @example
     * ```ts
     * join('first/', '/', '/second')
     * // -> 'first/second'
     * ```
     */
    const join = (part1, separator, part2)  =>{
        const p1 = part1.endsWith(separator)
            ? part1.slice(0, -separator.length)
            : part1;
        const p2 = part2.startsWith(separator)
            ? part2.slice(separator.length)
            : part2;
        return p1 === '' || p2 === ''
            ? p1 + p2
            : p1 + separator + p2;
    };

    const validatePathParam = (params, key) => {
        const allowedTypes = ['boolean', 'string', 'number'];
        if (!Object.prototype.hasOwnProperty.call(params, key)) throw new Error(`Missing value for path parameter ${key}.`);
        if (!allowedTypes.includes(typeof params[key])) throw new TypeError(`Path parameter ${key} cannot be of type ${typeof params[key]}. Allowed types are: ${allowedTypes.join(', ')}.`);
        if (typeof params[key] === 'string' && params[key].trim() === '') throw new Error(`Path parameter ${key} cannot be an empty string.`);
    };


    const path = (template, params) => {
        const remainingParams = { ...params };
        const renderedPath = template.replace(/:[_A-Za-z]+[_A-Za-z0-9]*/g, p => {
            const key = p.slice(1);
            validatePathParam(params, key);
            delete remainingParams[key];
            return encodeURIComponent(params[key]);
        });
        return { renderedPath, remainingParams };
    };

    const joinFullUrl = (renderedPath, baseUrl, pathAndQuery) => renderedPath.length ? join(baseUrl, '/', pathAndQuery) : join(baseUrl, '?', pathAndQuery);

    const urlcatImpl = (pathTemplate, params, baseUrl, config) => {
        const { renderedPath, remainingParams } = path(pathTemplate, params);
        const cleanParams = removeNullOrUndef(remainingParams);
        const renderedQuery = query(cleanParams);
        const pathAndQuery = join(renderedPath, '?', renderedQuery);
        return baseUrl ? joinFullUrl(renderedPath, baseUrl, pathAndQuery) : pathAndQuery;
    };

    const urlcat = (baseUrlOrTemplate, pathTemplateOrParams, maybeParams = {}, config = {}) => {
        if (typeof pathTemplateOrParams === 'string') {
            const baseUrl = baseUrlOrTemplate;
            const pathTemplate = pathTemplateOrParams;
            const params = maybeParams;
            return urlcatImpl(pathTemplate, params, baseUrl);
        }
        else {
            const baseTemplate = baseUrlOrTemplate;
            const params = pathTemplateOrParams;
            return urlcatImpl(baseTemplate, params, undefined);
        }
    };

    return urlcat;

}));
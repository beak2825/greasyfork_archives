(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('dayjs'), require('dayjs/plugin/timezone.js'), require('dayjs/plugin/utc.js'), require('react/jsx-runtime'), require('react'), require('@mantine/core'), require('@mantine/hooks')) :
    typeof define === 'function' && define.amd ? define(['exports', 'dayjs', 'dayjs/plugin/timezone.js', 'dayjs/plugin/utc.js', 'react/jsx-runtime', 'react', '@mantine/core', '@mantine/hooks'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MantineDates = {}, global.dayjs, global.dayjs_plugin_timezone, global.dayjs_plugin_utc, global.ReactJSXRuntime, global.React, global.MantineCore, global.MantineHooks));
})(this, (function (exports, dayjs26, timezonePlugin, utcPlugin, jsxRuntime, react, core, hooks) { 'use strict';

    /* esm.sh - esbuild bundle(@mantine/dates@7.11.1) es2022 development */
    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/utils/get-formatted-date.mjs
    function defaultDateFormatter({
        type,
        date,
        locale,
        format,
        labelSeparator
    }) {
        const formatDate = (value) => dayjs26(value).locale(locale).format(format);
        if (type === "default") {
            return date === null ? "" : formatDate(date);
        }
        if (type === "multiple") {
            return date.map(formatDate).join(", ");
        }
        if (type === "range" && Array.isArray(date)) {
            if (date[0] && date[1]) {
                return `${formatDate(date[0])} ${labelSeparator} ${formatDate(date[1])}`;
            }
            if (date[0]) {
                return `${formatDate(date[0])} ${labelSeparator} `;
            }
            return "";
        }
        return "";
    }
    function getFormattedDate({ formatter, ...others }) {
        return (formatter || defaultDateFormatter)(others);
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/utils/handle-control-key-down.mjs
    function getNextIndex({ direction, levelIndex, rowIndex, cellIndex, size }) {
        switch (direction) {
            case "up":
                if (levelIndex === 0 && rowIndex === 0) {
                    return null;
                }
                if (rowIndex === 0) {
                    return {
                        levelIndex: levelIndex - 1,
                        rowIndex: cellIndex <= size[levelIndex - 1][size[levelIndex - 1].length - 1] - 1 ? size[levelIndex - 1].length - 1 : size[levelIndex - 1].length - 2,
                        cellIndex
                    };
                }
                return {
                    levelIndex,
                    rowIndex: rowIndex - 1,
                    cellIndex
                };
            case "down":
                if (rowIndex === size[levelIndex].length - 1) {
                    return {
                        levelIndex: levelIndex + 1,
                        rowIndex: 0,
                        cellIndex
                    };
                }
                if (rowIndex === size[levelIndex].length - 2 && cellIndex >= size[levelIndex][size[levelIndex].length - 1]) {
                    return {
                        levelIndex: levelIndex + 1,
                        rowIndex: 0,
                        cellIndex
                    };
                }
                return {
                    levelIndex,
                    rowIndex: rowIndex + 1,
                    cellIndex
                };
            case "left":
                if (levelIndex === 0 && rowIndex === 0 && cellIndex === 0) {
                    return null;
                }
                if (rowIndex === 0 && cellIndex === 0) {
                    return {
                        levelIndex: levelIndex - 1,
                        rowIndex: size[levelIndex - 1].length - 1,
                        cellIndex: size[levelIndex - 1][size[levelIndex - 1].length - 1] - 1
                    };
                }
                if (cellIndex === 0) {
                    return {
                        levelIndex,
                        rowIndex: rowIndex - 1,
                        cellIndex: size[levelIndex][rowIndex - 1] - 1
                    };
                }
                return {
                    levelIndex,
                    rowIndex,
                    cellIndex: cellIndex - 1
                };
            case "right":
                if (rowIndex === size[levelIndex].length - 1 && cellIndex === size[levelIndex][rowIndex] - 1) {
                    return {
                        levelIndex: levelIndex + 1,
                        rowIndex: 0,
                        cellIndex: 0
                    };
                }
                if (cellIndex === size[levelIndex][rowIndex] - 1) {
                    return {
                        levelIndex,
                        rowIndex: rowIndex + 1,
                        cellIndex: 0
                    };
                }
                return {
                    levelIndex,
                    rowIndex,
                    cellIndex: cellIndex + 1
                };
            default:
                return { levelIndex, rowIndex, cellIndex };
        }
    }
    function focusOnNextFocusableControl({
        controlsRef,
        direction,
        levelIndex,
        rowIndex,
        cellIndex,
        size
    }) {
        const nextIndex = getNextIndex({ direction, size, rowIndex, cellIndex, levelIndex });
        if (!nextIndex) {
            return;
        }
        const controlToFocus = controlsRef.current?.[nextIndex.levelIndex]?.[nextIndex.rowIndex]?.[nextIndex.cellIndex];
        if (!controlToFocus) {
            return;
        }
        if (controlToFocus.disabled || controlToFocus.getAttribute("data-hidden") || controlToFocus.getAttribute("data-outside")) {
            focusOnNextFocusableControl({
                controlsRef,
                direction,
                levelIndex: nextIndex.levelIndex,
                cellIndex: nextIndex.cellIndex,
                rowIndex: nextIndex.rowIndex,
                size
            });
        } else {
            controlToFocus.focus();
        }
    }
    function getDirection(key) {
        switch (key) {
            case "ArrowDown":
                return "down";
            case "ArrowUp":
                return "up";
            case "ArrowRight":
                return "right";
            case "ArrowLeft":
                return "left";
            default:
                return null;
        }
    }
    function getControlsSize(controlsRef) {
        return controlsRef.current?.map((column) => column.map((row) => row.length));
    }
    function handleControlKeyDown({
        controlsRef,
        levelIndex,
        rowIndex,
        cellIndex,
        event
    }) {
        const direction = getDirection(event.key);
        if (direction) {
            event.preventDefault();
            const size = getControlsSize(controlsRef);
            focusOnNextFocusableControl({
                controlsRef,
                direction,
                levelIndex,
                rowIndex,
                cellIndex,
                size
            });
        }
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/utils/assign-time/assign-time.mjs
    function assignTime(originalDate, resultDate) {
        if (!originalDate || !resultDate) {
            return resultDate;
        }
        const hours = originalDate.getHours();
        const minutes = originalDate.getMinutes();
        const seconds = originalDate.getSeconds();
        const ms = originalDate.getMilliseconds();
        const result = new Date(resultDate);
        result.setHours(hours);
        result.setMinutes(minutes);
        result.setSeconds(seconds);
        result.setMilliseconds(ms);
        return result;
    }
    dayjs26.extend(utcPlugin);
    dayjs26.extend(timezonePlugin);
    function getTimezoneOffset(date, timezone) {
        if (timezone) {
            return dayjs26(date).tz(timezone).utcOffset() + date.getTimezoneOffset();
        }
        return 0;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/utils/shift-timezone.mjs
    var updateTimezone = (date, timezone, direction) => {
        if (!date) {
            return null;
        }
        if (!timezone) {
            return date;
        }
        let offset = getTimezoneOffset(date, timezone);
        if (direction === "remove") {
            offset *= -1;
        }
        return dayjs26(date).add(offset, "minutes").toDate();
    };
    function shiftTimezone(direction, date, timezone, disabled) {
        if (disabled || !date) {
            return date;
        }
        if (Array.isArray(date)) {
            return date.map((d) => updateTimezone(d, timezone, direction));
        }
        return updateTimezone(date, timezone, direction);
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/utils/get-default-clamped-date.mjs
    function getDefaultClampedDate({ minDate, maxDate, timezone }) {
        const today = shiftTimezone("add", /* @__PURE__ */ new Date(), timezone);
        if (!minDate && !maxDate) {
            return today;
        }
        if (minDate && dayjs26(today).isBefore(minDate)) {
            return minDate;
        }
        if (maxDate && dayjs26(today).isAfter(maxDate)) {
            return maxDate;
        }
        return today;
    }
    var DATES_PROVIDER_DEFAULT_SETTINGS = {
        locale: "en",
        timezone: null,
        firstDayOfWeek: 1,
        weekendDays: [0, 6],
        labelSeparator: "\u2013",
        consistentWeeks: false
    };
    var DatesProviderContext = react.createContext(DATES_PROVIDER_DEFAULT_SETTINGS);
    function DatesProvider({ settings, children }) {
        return /* @__PURE__ */ jsxRuntime.jsx(DatesProviderContext.Provider, { value: { ...DATES_PROVIDER_DEFAULT_SETTINGS, ...settings }, children });
    }
    function useDatesContext() {
        const ctx = react.useContext(DatesProviderContext);
        const getLocale = react.useCallback((input) => input || ctx.locale, [ctx.locale]);
        const getTimezone = react.useCallback(
            (input) => input || ctx.timezone || void 0,
            [ctx.timezone]
        );
        const getFirstDayOfWeek = react.useCallback(
            (input) => typeof input === "number" ? input : ctx.firstDayOfWeek,
            [ctx.firstDayOfWeek]
        );
        const getWeekendDays = react.useCallback(
            (input) => Array.isArray(input) ? input : ctx.weekendDays,
            [ctx.weekendDays]
        );
        const getLabelSeparator = react.useCallback(
            (input) => typeof input === "string" ? input : ctx.labelSeparator,
            [ctx.labelSeparator]
        );
        return {
            ...ctx,
            getLocale,
            getTimezone,
            getFirstDayOfWeek,
            getWeekendDays,
            getLabelSeparator
        };
    }
    function formatValue(value, type) {
        if (type === "range" && Array.isArray(value)) {
            const [startDate, endDate] = value;
            if (!startDate) {
                return "";
            }
            if (!endDate) {
                return `${startDate.toISOString()} \u2013`;
            }
            return `${startDate.toISOString()} \u2013 ${endDate.toISOString()}`;
        }
        if (type === "multiple" && Array.isArray(value)) {
            return value.map((date) => date?.toISOString()).filter(Boolean).join(", ");
        }
        if (!Array.isArray(value) && value) {
            return value.toISOString();
        }
        return "";
    }
    function HiddenDatesInput({ value, type, name, form }) {
        return /* @__PURE__ */ jsxRuntime.jsx("input", { type: "hidden", value: formatValue(value, type), name, form });
    }
    HiddenDatesInput.displayName = "@mantine/dates/HiddenDatesInput";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
    function r(e) {
        var t, f, n = "";
        if ("string" == typeof e || "number" == typeof e)
            n += e;
        else if ("object" == typeof e)
            if (Array.isArray(e)) {
                var o = e.length;
                for (t = 0; t < o; t++)
                    e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
            } else
                for (f in e)
                    e[f] && (n && (n += " "), n += f);
        return n;
    }
    function clsx() {
        for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++)
            (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
        return n;
    }
    var clsx_default = clsx;

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/TimeInput/TimeInput.module.css.mjs
    var classes = { "input": "m_468e7eda" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/TimeInput/TimeInput.mjs
    var defaultProps = {};
    var TimeInput = core.factory((_props, ref) => {
        const props = core.useProps("TimeInput", defaultProps, _props);
        const {
            classNames,
            styles,
            unstyled,
            vars,
            withSeconds,
            minTime,
            maxTime,
            value,
            onChange,
            ...others
        } = props;
        const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
            classNames,
            styles,
            props
        });
        const checkIfTimeLimitExceeded = (val) => {
            if (minTime !== void 0 || maxTime !== void 0) {
                const [hours, minutes, seconds] = val.split(":").map(Number);
                if (minTime) {
                    const [minHours, minMinutes, minSeconds] = minTime.split(":").map(Number);
                    if (hours < minHours || hours === minHours && minutes < minMinutes || withSeconds && hours === minHours && minutes === minMinutes && seconds < minSeconds) {
                        return -1;
                    }
                }
                if (maxTime) {
                    const [maxHours, maxMinutes, maxSeconds] = maxTime.split(":").map(Number);
                    if (hours > maxHours || hours === maxHours && minutes > maxMinutes || withSeconds && hours === maxHours && minutes === maxMinutes && seconds > maxSeconds) {
                        return 1;
                    }
                }
            }
            return 0;
        };
        const onTimeBlur = (event) => {
            props.onBlur?.(event);
            if (minTime !== void 0 || maxTime !== void 0) {
                const val = event.currentTarget.value;
                if (val) {
                    const check = checkIfTimeLimitExceeded(val);
                    if (check === 1) {
                        event.currentTarget.value = maxTime;
                        props.onChange?.(event);
                    } else if (check === -1) {
                        event.currentTarget.value = minTime;
                        props.onChange?.(event);
                    }
                }
            }
        };
        return /* @__PURE__ */ jsxRuntime.jsx(
            core.InputBase,
            {
                classNames: { ...resolvedClassNames, input: clsx_default(classes.input, resolvedClassNames?.input) },
                styles: resolvedStyles,
                unstyled,
                ref,
                value,
                ...others,
                step: withSeconds ? 1 : 60,
                onChange,
                onBlur: onTimeBlur,
                type: "time",
                __staticSelector: "TimeInput"
            }
        );
    });
    TimeInput.classes = core.InputBase.classes;
    TimeInput.displayName = "@mantine/dates/TimeInput";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Day/Day.module.css.mjs
    var classes2 = { "day": "m_396ce5cb" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Day/Day.mjs
    var defaultProps2 = {};
    var varsResolver = core.createVarsResolver((_, { size }) => ({
        day: {
            "--day-size": core.getSize(size, "day-size")
        }
    }));
    var Day = core.factory((_props, ref) => {
        const props = core.useProps("Day", defaultProps2, _props);
        const {
            classNames,
            className,
            style,
            styles,
            unstyled,
            vars,
            date,
            disabled,
            __staticSelector,
            weekend,
            outside,
            selected,
            renderDay,
            inRange,
            firstInRange,
            lastInRange,
            hidden,
            static: isStatic,
            highlightToday,
            ...others
        } = props;
        const getStyles = core.useStyles({
            name: __staticSelector || "Day",
            classes: classes2,
            props,
            className,
            style,
            classNames,
            styles,
            unstyled,
            vars,
            varsResolver,
            rootSelector: "day"
        });
        const ctx = useDatesContext();
        return /* @__PURE__ */ jsxRuntime.jsx(
            core.UnstyledButton,
            {
                ...getStyles("day", { style: hidden ? { display: "none" } : void 0 }),
                component: isStatic ? "div" : "button",
                ref,
                disabled,
                "data-today": dayjs26(date).isSame(shiftTimezone("add", /* @__PURE__ */ new Date(), ctx.getTimezone()), "day") || void 0,
                "data-hidden": hidden || void 0,
                "data-highlight-today": highlightToday || void 0,
                "data-disabled": disabled || void 0,
                "data-weekend": !disabled && !outside && weekend || void 0,
                "data-outside": !disabled && outside || void 0,
                "data-selected": !disabled && selected || void 0,
                "data-in-range": inRange && !disabled || void 0,
                "data-first-in-range": firstInRange && !disabled || void 0,
                "data-last-in-range": lastInRange && !disabled || void 0,
                "data-static": isStatic || void 0,
                unstyled,
                ...others,
                children: renderDay?.(date) || date.getDate()
            }
        );
    });
    Day.classes = classes2;
    Day.displayName = "@mantine/dates/Day";
    function getWeekdayNames({
        locale,
        format = "dd",
        firstDayOfWeek = 1
    }) {
        const baseDate = dayjs26().day(firstDayOfWeek);
        const labels = [];
        for (let i = 0; i < 7; i += 1) {
            if (typeof format === "string") {
                labels.push(dayjs26(baseDate).add(i, "days").locale(locale).format(format));
            } else {
                labels.push(format(dayjs26(baseDate).add(i, "days").toDate()));
            }
        }
        return labels;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/WeekdaysRow/WeekdaysRow.module.css.mjs
    var classes3 = { "weekday": "m_18a3eca" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/WeekdaysRow/WeekdaysRow.mjs
    var defaultProps3 = {};
    var varsResolver2 = core.createVarsResolver((_, { size }) => ({
        weekdaysRow: {
            "--wr-fz": core.getFontSize(size),
            "--wr-spacing": core.getSpacing(size)
        }
    }));
    var WeekdaysRow = core.factory((_props, ref) => {
        const props = core.useProps("WeekdaysRow", defaultProps3, _props);
        const {
            classNames,
            className,
            style,
            styles,
            unstyled,
            vars,
            locale,
            firstDayOfWeek,
            weekdayFormat,
            cellComponent: CellComponent = "th",
            __staticSelector,
            ...others
        } = props;
        const getStyles = core.useStyles({
            name: __staticSelector || "WeekdaysRow",
            classes: classes3,
            props,
            className,
            style,
            classNames,
            styles,
            unstyled,
            vars,
            varsResolver: varsResolver2,
            rootSelector: "weekdaysRow"
        });
        const ctx = useDatesContext();
        const weekdays = getWeekdayNames({
            locale: ctx.getLocale(locale),
            format: weekdayFormat,
            firstDayOfWeek: ctx.getFirstDayOfWeek(firstDayOfWeek)
        }).map((weekday, index) => /* @__PURE__ */ jsxRuntime.jsx(CellComponent, { ...getStyles("weekday"), children: weekday }, index));
        return /* @__PURE__ */ jsxRuntime.jsx(core.Box, { component: "tr", ref, ...getStyles("weekdaysRow"), ...others, children: weekdays });
    });
    WeekdaysRow.classes = classes3;
    WeekdaysRow.displayName = "@mantine/dates/WeekdaysRow";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Month/get-end-of-week/get-end-of-week.mjs
    function getEndOfWeek(date, firstDayOfWeek = 1) {
        const value = new Date(date);
        const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        while (value.getDay() !== lastDayOfWeek) {
            value.setDate(value.getDate() + 1);
        }
        return value;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Month/get-start-of-week/get-start-of-week.mjs
    function getStartOfWeek(date, firstDayOfWeek = 1) {
        const value = new Date(date);
        while (value.getDay() !== firstDayOfWeek) {
            value.setDate(value.getDate() - 1);
        }
        return value;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Month/get-month-days/get-month-days.mjs
    function getMonthDays({
        month,
        firstDayOfWeek = 1,
        consistentWeeks
    }) {
        const currentMonth = month.getMonth();
        const startOfMonth = new Date(month.getFullYear(), currentMonth, 1);
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const endDate = getEndOfWeek(endOfMonth, firstDayOfWeek);
        const date = getStartOfWeek(startOfMonth, firstDayOfWeek);
        const weeks = [];
        while (date <= endDate) {
            const days = [];
            for (let i = 0; i < 7; i += 1) {
                days.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }
            weeks.push(days);
        }
        if (consistentWeeks && weeks.length < 6) {
            const lastWeek = weeks[weeks.length - 1];
            const lastDay = lastWeek[lastWeek.length - 1];
            const nextDay = new Date(lastDay);
            nextDay.setDate(nextDay.getDate() + 1);
            while (weeks.length < 6) {
                const days = [];
                for (let i = 0; i < 7; i += 1) {
                    days.push(new Date(nextDay));
                    nextDay.setDate(nextDay.getDate() + 1);
                }
                weeks.push(days);
            }
        }
        return weeks;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Month/is-same-month/is-same-month.mjs
    function isSameMonth(date, comparison) {
        return date.getFullYear() === comparison.getFullYear() && date.getMonth() === comparison.getMonth();
    }
    function isAfterMinDate(date, minDate) {
        return minDate instanceof Date ? dayjs26(date).isAfter(dayjs26(minDate).subtract(1, "day"), "day") : true;
    }
    function isBeforeMaxDate(date, maxDate) {
        return maxDate instanceof Date ? dayjs26(date).isBefore(dayjs26(maxDate).add(1, "day"), "day") : true;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Month/get-date-in-tab-order/get-date-in-tab-order.mjs
    function getDateInTabOrder(dates, minDate, maxDate, getDateControlProps, excludeDate, hideOutsideDates, month) {
        const enabledDates = dates.flat().filter(
            (date) => isBeforeMaxDate(date, maxDate) && isAfterMinDate(date, minDate) && !excludeDate?.(date) && !getDateControlProps?.(date)?.disabled && (!hideOutsideDates || isSameMonth(date, month))
        );
        const selectedDate = enabledDates.find((date) => getDateControlProps?.(date)?.selected);
        if (selectedDate) {
            return selectedDate;
        }
        const currentDate = enabledDates.find((date) => dayjs26().isSame(date, "date"));
        if (currentDate) {
            return currentDate;
        }
        return enabledDates[0];
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Month/Month.module.css.mjs
    var classes4 = { "month": "m_cc9820d3", "monthCell": "m_8f457cd5" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Month/Month.mjs
    var defaultProps4 = {
        withCellSpacing: true
    };
    var Month = core.factory((_props, ref) => {
        const props = core.useProps("Month", defaultProps4, _props);
        const {
            classNames,
            className,
            style,
            styles,
            unstyled,
            vars,
            __staticSelector,
            locale,
            firstDayOfWeek,
            weekdayFormat,
            month,
            weekendDays,
            getDayProps,
            excludeDate,
            minDate,
            maxDate,
            renderDay,
            hideOutsideDates,
            hideWeekdays,
            getDayAriaLabel,
            static: isStatic,
            __getDayRef,
            __onDayKeyDown,
            __onDayClick,
            __onDayMouseEnter,
            __preventFocus,
            __stopPropagation,
            withCellSpacing,
            size,
            highlightToday,
            ...others
        } = props;
        const getStyles = core.useStyles({
            name: __staticSelector || "Month",
            classes: classes4,
            props,
            className,
            style,
            classNames,
            styles,
            unstyled,
            vars,
            rootSelector: "month"
        });
        const ctx = useDatesContext();
        const dates = getMonthDays({
            month,
            firstDayOfWeek: ctx.getFirstDayOfWeek(firstDayOfWeek),
            consistentWeeks: ctx.consistentWeeks
        });
        const dateInTabOrder = getDateInTabOrder(
            dates,
            minDate,
            maxDate,
            getDayProps,
            excludeDate,
            hideOutsideDates,
            month
        );
        const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
            classNames,
            styles,
            props
        });
        const rows = dates.map((row, rowIndex) => {
            const cells = row.map((date, cellIndex) => {
                const outside = !isSameMonth(date, month);
                const ariaLabel = getDayAriaLabel?.(date) || dayjs26(date).locale(locale || ctx.locale).format("D MMMM YYYY");
                const dayProps = getDayProps?.(date);
                const isDateInTabOrder = dayjs26(date).isSame(dateInTabOrder, "date");
                return /* @__PURE__ */ jsxRuntime.jsx(
                    "td",
                    {
                        ...getStyles("monthCell"),
                        "data-with-spacing": withCellSpacing || void 0,
                        children: /* @__PURE__ */ jsxRuntime.jsx(
                            Day,
                            {
                                __staticSelector: __staticSelector || "Month",
                                classNames: resolvedClassNames,
                                styles: resolvedStyles,
                                unstyled,
                                "data-mantine-stop-propagation": __stopPropagation || void 0,
                                highlightToday,
                                renderDay,
                                date,
                                size,
                                weekend: ctx.getWeekendDays(weekendDays).includes(date.getDay()),
                                outside,
                                hidden: hideOutsideDates ? outside : false,
                                "aria-label": ariaLabel,
                                static: isStatic,
                                disabled: excludeDate?.(date) || !isBeforeMaxDate(date, maxDate) || !isAfterMinDate(date, minDate),
                                ref: (node) => __getDayRef?.(rowIndex, cellIndex, node),
                                ...dayProps,
                                onKeyDown: (event) => {
                                    dayProps?.onKeyDown?.(event);
                                    __onDayKeyDown?.(event, { rowIndex, cellIndex, date });
                                },
                                onMouseEnter: (event) => {
                                    dayProps?.onMouseEnter?.(event);
                                    __onDayMouseEnter?.(event, date);
                                },
                                onClick: (event) => {
                                    dayProps?.onClick?.(event);
                                    __onDayClick?.(event, date);
                                },
                                onMouseDown: (event) => {
                                    dayProps?.onMouseDown?.(event);
                                    __preventFocus && event.preventDefault();
                                },
                                tabIndex: __preventFocus || !isDateInTabOrder ? -1 : 0
                            }
                        )
                    },
                    date.toString()
                );
            });
            return /* @__PURE__ */ jsxRuntime.jsx("tr", { ...getStyles("monthRow"), children: cells }, rowIndex);
        });
        return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { component: "table", ...getStyles("month"), size, ref, ...others, children: [
            !hideWeekdays && /* @__PURE__ */ jsxRuntime.jsx("thead", { ...getStyles("monthThead"), children: /* @__PURE__ */ jsxRuntime.jsx(
                WeekdaysRow,
                {
                    __staticSelector: __staticSelector || "Month",
                    locale,
                    firstDayOfWeek,
                    weekdayFormat,
                    size,
                    classNames: resolvedClassNames,
                    styles: resolvedStyles,
                    unstyled
                }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx("tbody", { ...getStyles("monthTbody"), children: rows })
        ] });
    });
    Month.classes = classes4;
    Month.displayName = "@mantine/dates/Month";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/PickerControl/PickerControl.module.css.mjs
    var classes5 = { "pickerControl": "m_dc6a3c71" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/PickerControl/PickerControl.mjs
    var defaultProps5 = {};
    var varsResolver3 = core.createVarsResolver((_, { size }) => ({
        pickerControl: {
            "--dpc-fz": core.getFontSize(size),
            "--dpc-size": core.getSize(size, "dpc-size")
        }
    }));
    var PickerControl = core.factory((_props, ref) => {
        const props = core.useProps("PickerControl", defaultProps5, _props);
        const {
            classNames,
            className,
            style,
            styles,
            unstyled,
            vars,
            firstInRange,
            lastInRange,
            inRange,
            __staticSelector,
            selected,
            disabled,
            ...others
        } = props;
        const getStyles = core.useStyles({
            name: __staticSelector || "PickerControl",
            classes: classes5,
            props,
            className,
            style,
            classNames,
            styles,
            unstyled,
            vars,
            varsResolver: varsResolver3,
            rootSelector: "pickerControl"
        });
        return /* @__PURE__ */ jsxRuntime.jsx(
            core.UnstyledButton,
            {
                ...getStyles("pickerControl"),
                ref,
                unstyled,
                "data-picker-control": true,
                "data-selected": selected && !disabled || void 0,
                "data-disabled": disabled || void 0,
                "data-in-range": inRange && !disabled && !selected || void 0,
                "data-first-in-range": firstInRange && !disabled || void 0,
                "data-last-in-range": lastInRange && !disabled || void 0,
                disabled,
                ...others
            }
        );
    });
    PickerControl.classes = classes5;
    PickerControl.displayName = "@mantine/dates/PickerControl";
    function isYearDisabled(year, minDate, maxDate) {
        if (!minDate && !maxDate) {
            return false;
        }
        if (minDate && dayjs26(year).isBefore(minDate, "year")) {
            return true;
        }
        if (maxDate && dayjs26(year).isAfter(maxDate, "year")) {
            return true;
        }
        return false;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/YearsList/get-year-in-tab-order/get-year-in-tab-order.mjs
    function getYearInTabOrder(years, minDate, maxDate, getYearControlProps) {
        const enabledYears = years.flat().filter(
            (year) => !isYearDisabled(year, minDate, maxDate) && !getYearControlProps?.(year)?.disabled
        );
        const selectedYear = enabledYears.find((year) => getYearControlProps?.(year)?.selected);
        if (selectedYear) {
            return selectedYear;
        }
        const currentYear = enabledYears.find((year) => dayjs26().isSame(year, "year"));
        if (currentYear) {
            return currentYear;
        }
        return enabledYears[0];
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/YearsList/get-years-data/get-years-data.mjs
    function getYearsData(decade) {
        const year = decade.getFullYear();
        const rounded = year - year % 10;
        let currentYearIndex = 0;
        const results = [[], [], [], []];
        for (let i = 0; i < 4; i += 1) {
            const max = i === 3 ? 1 : 3;
            for (let j = 0; j < max; j += 1) {
                results[i].push(new Date(rounded + currentYearIndex, 0));
                currentYearIndex += 1;
            }
        }
        return results;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/YearsList/YearsList.module.css.mjs
    var classes6 = { "yearsList": "m_9206547b", "yearsListCell": "m_c5a19c7d" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/YearsList/YearsList.mjs
    var defaultProps6 = {
        yearsListFormat: "YYYY",
        withCellSpacing: true
    };
    var YearsList = core.factory((_props, ref) => {
        const props = core.useProps("YearsList", defaultProps6, _props);
        const {
            classNames,
            className,
            style,
            styles,
            unstyled,
            vars,
            decade,
            yearsListFormat,
            locale,
            minDate,
            maxDate,
            getYearControlProps,
            __staticSelector,
            __getControlRef,
            __onControlKeyDown,
            __onControlClick,
            __onControlMouseEnter,
            __preventFocus,
            __stopPropagation,
            withCellSpacing,
            size,
            ...others
        } = props;
        const getStyles = core.useStyles({
            name: __staticSelector || "YearsList",
            classes: classes6,
            props,
            className,
            style,
            classNames,
            styles,
            unstyled,
            vars,
            rootSelector: "yearsList"
        });
        const ctx = useDatesContext();
        const years = getYearsData(decade);
        const yearInTabOrder = getYearInTabOrder(years, minDate, maxDate, getYearControlProps);
        const rows = years.map((yearsRow, rowIndex) => {
            const cells = yearsRow.map((year, cellIndex) => {
                const controlProps = getYearControlProps?.(year);
                const isYearInTabOrder = dayjs26(year).isSame(yearInTabOrder, "year");
                return /* @__PURE__ */ jsxRuntime.jsx(
                    "td",
                    {
                        ...getStyles("yearsListCell"),
                        "data-with-spacing": withCellSpacing || void 0,
                        children: /* @__PURE__ */ jsxRuntime.jsx(
                            PickerControl,
                            {
                                ...getStyles("yearsListControl"),
                                size,
                                unstyled,
                                "data-mantine-stop-propagation": __stopPropagation || void 0,
                                disabled: isYearDisabled(year, minDate, maxDate),
                                ref: (node) => __getControlRef?.(rowIndex, cellIndex, node),
                                ...controlProps,
                                onKeyDown: (event) => {
                                    controlProps?.onKeyDown?.(event);
                                    __onControlKeyDown?.(event, { rowIndex, cellIndex, date: year });
                                },
                                onClick: (event) => {
                                    controlProps?.onClick?.(event);
                                    __onControlClick?.(event, year);
                                },
                                onMouseEnter: (event) => {
                                    controlProps?.onMouseEnter?.(event);
                                    __onControlMouseEnter?.(event, year);
                                },
                                onMouseDown: (event) => {
                                    controlProps?.onMouseDown?.(event);
                                    __preventFocus && event.preventDefault();
                                },
                                tabIndex: __preventFocus || !isYearInTabOrder ? -1 : 0,
                                children: dayjs26(year).locale(ctx.getLocale(locale)).format(yearsListFormat)
                            }
                        )
                    },
                    cellIndex
                );
            });
            return /* @__PURE__ */ jsxRuntime.jsx("tr", { ...getStyles("yearsListRow"), children: cells }, rowIndex);
        });
        return /* @__PURE__ */ jsxRuntime.jsx(core.Box, { component: "table", ref, size, ...getStyles("yearsList"), ...others, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: rows }) });
    });
    YearsList.classes = classes6;
    YearsList.displayName = "@mantine/dates/YearsList";
    function isMonthDisabled(month, minDate, maxDate) {
        if (!minDate && !maxDate) {
            return false;
        }
        if (minDate && dayjs26(month).isBefore(minDate, "month")) {
            return true;
        }
        if (maxDate && dayjs26(month).isAfter(maxDate, "month")) {
            return true;
        }
        return false;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/MonthsList/get-month-in-tab-order/get-month-in-tab-order.mjs
    function getMonthInTabOrder(months, minDate, maxDate, getMonthControlProps) {
        const enabledMonths = months.flat().filter(
            (month) => !isMonthDisabled(month, minDate, maxDate) && !getMonthControlProps?.(month)?.disabled
        );
        const selectedMonth = enabledMonths.find((month) => getMonthControlProps?.(month)?.selected);
        if (selectedMonth) {
            return selectedMonth;
        }
        const currentMonth = enabledMonths.find((month) => dayjs26().isSame(month, "month"));
        if (currentMonth) {
            return currentMonth;
        }
        return enabledMonths[0];
    }
    function getMonthsData(year) {
        const startOfYear = dayjs26(year).startOf("year").toDate();
        const results = [[], [], [], []];
        let currentMonthIndex = 0;
        for (let i = 0; i < 4; i += 1) {
            for (let j = 0; j < 3; j += 1) {
                results[i].push(dayjs26(startOfYear).add(currentMonthIndex, "months").toDate());
                currentMonthIndex += 1;
            }
        }
        return results;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/MonthsList/MonthsList.module.css.mjs
    var classes7 = { "monthsList": "m_2a6c32d", "monthsListCell": "m_fe27622f" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/MonthsList/MonthsList.mjs
    var defaultProps7 = {
        monthsListFormat: "MMM",
        withCellSpacing: true
    };
    var MonthsList = core.factory((_props, ref) => {
        const props = core.useProps("MonthsList", defaultProps7, _props);
        const {
            classNames,
            className,
            style,
            styles,
            unstyled,
            vars,
            __staticSelector,
            year,
            monthsListFormat,
            locale,
            minDate,
            maxDate,
            getMonthControlProps,
            __getControlRef,
            __onControlKeyDown,
            __onControlClick,
            __onControlMouseEnter,
            __preventFocus,
            __stopPropagation,
            withCellSpacing,
            size,
            ...others
        } = props;
        const getStyles = core.useStyles({
            name: __staticSelector || "MonthsList",
            classes: classes7,
            props,
            className,
            style,
            classNames,
            styles,
            unstyled,
            vars,
            rootSelector: "monthsList"
        });
        const ctx = useDatesContext();
        const months = getMonthsData(year);
        const monthInTabOrder = getMonthInTabOrder(months, minDate, maxDate, getMonthControlProps);
        const rows = months.map((monthsRow, rowIndex) => {
            const cells = monthsRow.map((month, cellIndex) => {
                const controlProps = getMonthControlProps?.(month);
                const isMonthInTabOrder = dayjs26(month).isSame(monthInTabOrder, "month");
                return /* @__PURE__ */ jsxRuntime.jsx(
                    "td",
                    {
                        ...getStyles("monthsListCell"),
                        "data-with-spacing": withCellSpacing || void 0,
                        children: /* @__PURE__ */ jsxRuntime.jsx(
                            PickerControl,
                            {
                                ...getStyles("monthsListControl"),
                                size,
                                unstyled,
                                __staticSelector: __staticSelector || "MonthsList",
                                "data-mantine-stop-propagation": __stopPropagation || void 0,
                                disabled: isMonthDisabled(month, minDate, maxDate),
                                ref: (node) => __getControlRef?.(rowIndex, cellIndex, node),
                                ...controlProps,
                                onKeyDown: (event) => {
                                    controlProps?.onKeyDown?.(event);
                                    __onControlKeyDown?.(event, { rowIndex, cellIndex, date: month });
                                },
                                onClick: (event) => {
                                    controlProps?.onClick?.(event);
                                    __onControlClick?.(event, month);
                                },
                                onMouseEnter: (event) => {
                                    controlProps?.onMouseEnter?.(event);
                                    __onControlMouseEnter?.(event, month);
                                },
                                onMouseDown: (event) => {
                                    controlProps?.onMouseDown?.(event);
                                    __preventFocus && event.preventDefault();
                                },
                                tabIndex: __preventFocus || !isMonthInTabOrder ? -1 : 0,
                                children: dayjs26(month).locale(ctx.getLocale(locale)).format(monthsListFormat)
                            }
                        )
                    },
                    cellIndex
                );
            });
            return /* @__PURE__ */ jsxRuntime.jsx("tr", { ...getStyles("monthsListRow"), children: cells }, rowIndex);
        });
        return /* @__PURE__ */ jsxRuntime.jsx(core.Box, { component: "table", ref, size, ...getStyles("monthsList"), ...others, children: /* @__PURE__ */ jsxRuntime.jsx("tbody", { children: rows }) });
    });
    MonthsList.classes = classes7;
    MonthsList.displayName = "@mantine/dates/MonthsList";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/CalendarHeader/CalendarHeader.module.css.mjs
    var classes8 = { "calendarHeader": "m_730a79ed", "calendarHeaderLevel": "m_f6645d97", "calendarHeaderControl": "m_2351eeb0", "calendarHeaderControlIcon": "m_367dc749" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/CalendarHeader/CalendarHeader.mjs
    var defaultProps8 = {
        nextDisabled: false,
        previousDisabled: false,
        hasNextLevel: true,
        withNext: true,
        withPrevious: true
    };
    var varsResolver4 = core.createVarsResolver((_, { size }) => ({
        calendarHeader: {
            "--dch-control-size": core.getSize(size, "dch-control-size"),
            "--dch-fz": core.getFontSize(size)
        }
    }));
    var CalendarHeader = core.factory((_props, ref) => {
        const props = core.useProps("CalendarHeader", defaultProps8, _props);
        const {
            classNames,
            className,
            style,
            styles,
            unstyled,
            vars,
            nextIcon,
            previousIcon,
            nextLabel,
            previousLabel,
            onNext,
            onPrevious,
            onLevelClick,
            label,
            nextDisabled,
            previousDisabled,
            hasNextLevel,
            levelControlAriaLabel,
            withNext,
            withPrevious,
            __staticSelector,
            __preventFocus,
            __stopPropagation,
            ...others
        } = props;
        const getStyles = core.useStyles({
            name: __staticSelector || "CalendarHeader",
            classes: classes8,
            props,
            className,
            style,
            classNames,
            styles,
            unstyled,
            vars,
            varsResolver: varsResolver4,
            rootSelector: "calendarHeader"
        });
        const preventFocus = __preventFocus ? (event) => event.preventDefault() : void 0;
        return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { ...getStyles("calendarHeader"), ref, ...others, children: [
            withPrevious && /* @__PURE__ */ jsxRuntime.jsx(
                core.UnstyledButton,
                {
                    ...getStyles("calendarHeaderControl"),
                    "data-direction": "previous",
                    "aria-label": previousLabel,
                    onClick: onPrevious,
                    unstyled,
                    onMouseDown: preventFocus,
                    disabled: previousDisabled,
                    "data-disabled": previousDisabled || void 0,
                    tabIndex: __preventFocus || previousDisabled ? -1 : 0,
                    "data-mantine-stop-propagation": __stopPropagation || void 0,
                    children: previousIcon || /* @__PURE__ */ jsxRuntime.jsx(
                        core.AccordionChevron,
                        {
                            ...getStyles("calendarHeaderControlIcon"),
                            "data-direction": "previous",
                            size: "45%"
                        }
                    )
                }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
                core.UnstyledButton,
                {
                    component: hasNextLevel ? "button" : "div",
                    ...getStyles("calendarHeaderLevel"),
                    onClick: hasNextLevel ? onLevelClick : void 0,
                    unstyled,
                    onMouseDown: hasNextLevel ? preventFocus : void 0,
                    disabled: !hasNextLevel,
                    "data-static": !hasNextLevel || void 0,
                    "aria-label": levelControlAriaLabel,
                    tabIndex: __preventFocus || !hasNextLevel ? -1 : 0,
                    "data-mantine-stop-propagation": __stopPropagation || void 0,
                    children: label
                }
            ),
            withNext && /* @__PURE__ */ jsxRuntime.jsx(
                core.UnstyledButton,
                {
                    ...getStyles("calendarHeaderControl"),
                    "data-direction": "next",
                    "aria-label": nextLabel,
                    onClick: onNext,
                    unstyled,
                    onMouseDown: preventFocus,
                    disabled: nextDisabled,
                    "data-disabled": nextDisabled || void 0,
                    tabIndex: __preventFocus || nextDisabled ? -1 : 0,
                    "data-mantine-stop-propagation": __stopPropagation || void 0,
                    children: nextIcon || /* @__PURE__ */ jsxRuntime.jsx(
                        core.AccordionChevron,
                        {
                            ...getStyles("calendarHeaderControlIcon"),
                            "data-direction": "next",
                            size: "45%"
                        }
                    )
                }
            )
        ] });
    });
    CalendarHeader.classes = classes8;
    CalendarHeader.displayName = "@mantine/dates/CalendarHeader";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/DecadeLevel/get-decade-range/get-decade-range.mjs
    function getDecadeRange(decade) {
        const years = getYearsData(decade);
        return [years[0][0], years[3][0]];
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/DecadeLevel/DecadeLevel.mjs
    var defaultProps9 = {
        decadeLabelFormat: "YYYY"
    };
    var DecadeLevel = core.factory((_props, ref) => {
        const props = core.useProps("DecadeLevel", defaultProps9, _props);
        const {
            // YearsList settings
            decade,
            locale,
            minDate,
            maxDate,
            yearsListFormat,
            getYearControlProps,
            __getControlRef,
            __onControlKeyDown,
            __onControlClick,
            __onControlMouseEnter,
            withCellSpacing,
            // CalendarHeader settings
            __preventFocus,
            nextIcon,
            previousIcon,
            nextLabel,
            previousLabel,
            onNext,
            onPrevious,
            nextDisabled,
            previousDisabled,
            levelControlAriaLabel,
            withNext,
            withPrevious,
            // Other props
            decadeLabelFormat,
            classNames,
            styles,
            unstyled,
            __staticSelector,
            __stopPropagation,
            size,
            ...others
        } = props;
        const ctx = useDatesContext();
        const [startOfDecade, endOfDecade] = getDecadeRange(decade);
        const stylesApiProps = {
            __staticSelector: __staticSelector || "DecadeLevel",
            classNames,
            styles,
            unstyled,
            size
        };
        const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs26(endOfDecade).endOf("year").isBefore(maxDate) : false;
        const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs26(startOfDecade).startOf("year").isAfter(minDate) : false;
        const formatDecade = (date, format) => dayjs26(date).locale(locale || ctx.locale).format(format);
        return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { "data-decade-level": true, size, ref, ...others, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
                CalendarHeader,
                {
                    label: typeof decadeLabelFormat === "function" ? decadeLabelFormat(startOfDecade, endOfDecade) : `${formatDecade(startOfDecade, decadeLabelFormat)} \u2013 ${formatDecade(
                    endOfDecade,
                    decadeLabelFormat
                )}`,
                    __preventFocus,
                    __stopPropagation,
                    nextIcon,
                    previousIcon,
                    nextLabel,
                    previousLabel,
                    onNext,
                    onPrevious,
                    nextDisabled: _nextDisabled,
                    previousDisabled: _previousDisabled,
                    hasNextLevel: false,
                    levelControlAriaLabel,
                    withNext,
                    withPrevious,
                    ...stylesApiProps
                }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
                YearsList,
                {
                    decade,
                    locale,
                    minDate,
                    maxDate,
                    yearsListFormat,
                    getYearControlProps,
                    __getControlRef,
                    __onControlKeyDown,
                    __onControlClick,
                    __onControlMouseEnter,
                    __preventFocus,
                    __stopPropagation,
                    withCellSpacing,
                    ...stylesApiProps
                }
            )
        ] });
    });
    DecadeLevel.classes = { ...YearsList.classes, ...CalendarHeader.classes };
    DecadeLevel.displayName = "@mantine/dates/DecadeLevel";
    var defaultProps10 = {
        yearLabelFormat: "YYYY"
    };
    var YearLevel = core.factory((_props, ref) => {
        const props = core.useProps("YearLevel", defaultProps10, _props);
        const {
            // MonthsList settings
            year,
            locale,
            minDate,
            maxDate,
            monthsListFormat,
            getMonthControlProps,
            __getControlRef,
            __onControlKeyDown,
            __onControlClick,
            __onControlMouseEnter,
            withCellSpacing,
            // CalendarHeader settings
            __preventFocus,
            nextIcon,
            previousIcon,
            nextLabel,
            previousLabel,
            onNext,
            onPrevious,
            onLevelClick,
            nextDisabled,
            previousDisabled,
            hasNextLevel,
            levelControlAriaLabel,
            withNext,
            withPrevious,
            // Other props
            yearLabelFormat,
            __staticSelector,
            __stopPropagation,
            size,
            classNames,
            styles,
            unstyled,
            ...others
        } = props;
        const ctx = useDatesContext();
        const stylesApiProps = {
            __staticSelector: __staticSelector || "YearLevel",
            classNames,
            styles,
            unstyled,
            size
        };
        const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs26(year).endOf("year").isBefore(maxDate) : false;
        const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs26(year).startOf("year").isAfter(minDate) : false;
        return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { "data-year-level": true, size, ref, ...others, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
                CalendarHeader,
                {
                    label: typeof yearLabelFormat === "function" ? yearLabelFormat(year) : dayjs26(year).locale(locale || ctx.locale).format(yearLabelFormat),
                    __preventFocus,
                    __stopPropagation,
                    nextIcon,
                    previousIcon,
                    nextLabel,
                    previousLabel,
                    onNext,
                    onPrevious,
                    onLevelClick,
                    nextDisabled: _nextDisabled,
                    previousDisabled: _previousDisabled,
                    hasNextLevel,
                    levelControlAriaLabel,
                    withNext,
                    withPrevious,
                    ...stylesApiProps
                }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
                MonthsList,
                {
                    year,
                    locale,
                    minDate,
                    maxDate,
                    monthsListFormat,
                    getMonthControlProps,
                    __getControlRef,
                    __onControlKeyDown,
                    __onControlClick,
                    __onControlMouseEnter,
                    __preventFocus,
                    __stopPropagation,
                    withCellSpacing,
                    ...stylesApiProps
                }
            )
        ] });
    });
    YearLevel.classes = { ...CalendarHeader.classes, ...MonthsList.classes };
    YearLevel.displayName = "@mantine/dates/YearLevel";
    var defaultProps11 = {
        monthLabelFormat: "MMMM YYYY"
    };
    var MonthLevel = core.factory((_props, ref) => {
        const props = core.useProps("MonthLevel", defaultProps11, _props);
        const {
            // Month settings
            month,
            locale,
            firstDayOfWeek,
            weekdayFormat,
            weekendDays,
            getDayProps,
            excludeDate,
            minDate,
            maxDate,
            renderDay,
            hideOutsideDates,
            hideWeekdays,
            getDayAriaLabel,
            __getDayRef,
            __onDayKeyDown,
            __onDayClick,
            __onDayMouseEnter,
            withCellSpacing,
            highlightToday,
            // CalendarHeader settings
            __preventFocus,
            __stopPropagation,
            nextIcon,
            previousIcon,
            nextLabel,
            previousLabel,
            onNext,
            onPrevious,
            onLevelClick,
            nextDisabled,
            previousDisabled,
            hasNextLevel,
            levelControlAriaLabel,
            withNext,
            withPrevious,
            // Other props
            monthLabelFormat,
            classNames,
            styles,
            unstyled,
            __staticSelector,
            size,
            static: isStatic,
            ...others
        } = props;
        const ctx = useDatesContext();
        const stylesApiProps = {
            __staticSelector: __staticSelector || "MonthLevel",
            classNames,
            styles,
            unstyled,
            size
        };
        const _nextDisabled = typeof nextDisabled === "boolean" ? nextDisabled : maxDate ? !dayjs26(month).endOf("month").isBefore(maxDate) : false;
        const _previousDisabled = typeof previousDisabled === "boolean" ? previousDisabled : minDate ? !dayjs26(month).startOf("month").isAfter(minDate) : false;
        return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { "data-month-level": true, size, ref, ...others, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
                CalendarHeader,
                {
                    label: typeof monthLabelFormat === "function" ? monthLabelFormat(month) : dayjs26(month).locale(locale || ctx.locale).format(monthLabelFormat),
                    __preventFocus,
                    __stopPropagation,
                    nextIcon,
                    previousIcon,
                    nextLabel,
                    previousLabel,
                    onNext,
                    onPrevious,
                    onLevelClick,
                    nextDisabled: _nextDisabled,
                    previousDisabled: _previousDisabled,
                    hasNextLevel,
                    levelControlAriaLabel,
                    withNext,
                    withPrevious,
                    ...stylesApiProps
                }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
                Month,
                {
                    month,
                    locale,
                    firstDayOfWeek,
                    weekdayFormat,
                    weekendDays,
                    getDayProps,
                    excludeDate,
                    minDate,
                    maxDate,
                    renderDay,
                    hideOutsideDates,
                    hideWeekdays,
                    getDayAriaLabel,
                    __getDayRef,
                    __onDayKeyDown,
                    __onDayClick,
                    __onDayMouseEnter,
                    __preventFocus,
                    __stopPropagation,
                    static: isStatic,
                    withCellSpacing,
                    highlightToday,
                    ...stylesApiProps
                }
            )
        ] });
    });
    MonthLevel.classes = { ...Month.classes, ...CalendarHeader.classes };
    MonthLevel.displayName = "@mantine/dates/MonthLevel";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/LevelsGroup/LevelsGroup.module.css.mjs
    var classes9 = { "levelsGroup": "m_30b26e33" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/LevelsGroup/LevelsGroup.mjs
    var defaultProps12 = {};
    var LevelsGroup = core.factory((_props, ref) => {
        const props = core.useProps("LevelsGroup", defaultProps12, _props);
        const { classNames, className, style, styles, unstyled, vars, __staticSelector, ...others } = props;
        const getStyles = core.useStyles({
            name: __staticSelector || "LevelsGroup",
            classes: classes9,
            props,
            className,
            style,
            classNames,
            styles,
            unstyled,
            vars,
            rootSelector: "levelsGroup"
        });
        return /* @__PURE__ */ jsxRuntime.jsx(core.Box, { ref, ...getStyles("levelsGroup"), ...others });
    });
    LevelsGroup.classes = classes9;
    LevelsGroup.displayName = "@mantine/dates/LevelsGroup";
    var defaultProps13 = {
        numberOfColumns: 1
    };
    var DecadeLevelGroup = core.factory((_props, ref) => {
        const props = core.useProps("DecadeLevelGroup", defaultProps13, _props);
        const {
            // DecadeLevel settings
            decade,
            locale,
            minDate,
            maxDate,
            yearsListFormat,
            getYearControlProps,
            __onControlClick,
            __onControlMouseEnter,
            withCellSpacing,
            // CalendarHeader settings
            __preventFocus,
            nextIcon,
            previousIcon,
            nextLabel,
            previousLabel,
            onNext,
            onPrevious,
            nextDisabled,
            previousDisabled,
            // Other settings
            classNames,
            styles,
            unstyled,
            __staticSelector,
            __stopPropagation,
            numberOfColumns,
            levelControlAriaLabel,
            decadeLabelFormat,
            size,
            vars,
            ...others
        } = props;
        const controlsRef = react.useRef([]);
        const decades = Array(numberOfColumns).fill(0).map((_, decadeIndex) => {
            const currentDecade = dayjs26(decade).add(decadeIndex * 10, "years").toDate();
            return /* @__PURE__ */ jsxRuntime.jsx(
                DecadeLevel,
                {
                    size,
                    yearsListFormat,
                    decade: currentDecade,
                    withNext: decadeIndex === numberOfColumns - 1,
                    withPrevious: decadeIndex === 0,
                    decadeLabelFormat,
                    __onControlClick,
                    __onControlMouseEnter,
                    __onControlKeyDown: (event, payload) => handleControlKeyDown({
                        levelIndex: decadeIndex,
                        rowIndex: payload.rowIndex,
                        cellIndex: payload.cellIndex,
                        event,
                        controlsRef
                    }),
                    __getControlRef: (rowIndex, cellIndex, node) => {
                        if (!Array.isArray(controlsRef.current[decadeIndex])) {
                            controlsRef.current[decadeIndex] = [];
                        }
                        if (!Array.isArray(controlsRef.current[decadeIndex][rowIndex])) {
                            controlsRef.current[decadeIndex][rowIndex] = [];
                        }
                        controlsRef.current[decadeIndex][rowIndex][cellIndex] = node;
                    },
                    levelControlAriaLabel: typeof levelControlAriaLabel === "function" ? levelControlAriaLabel(currentDecade) : levelControlAriaLabel,
                    locale,
                    minDate,
                    maxDate,
                    __preventFocus,
                    __stopPropagation,
                    nextIcon,
                    previousIcon,
                    nextLabel,
                    previousLabel,
                    onNext,
                    onPrevious,
                    nextDisabled,
                    previousDisabled,
                    getYearControlProps,
                    __staticSelector: __staticSelector || "DecadeLevelGroup",
                    classNames,
                    styles,
                    unstyled,
                    withCellSpacing
                },
                decadeIndex
            );
        });
        return /* @__PURE__ */ jsxRuntime.jsx(
            LevelsGroup,
            {
                classNames,
                styles,
                __staticSelector: __staticSelector || "DecadeLevelGroup",
                ref,
                size,
                unstyled,
                ...others,
                children: decades
            }
        );
    });
    DecadeLevelGroup.classes = { ...LevelsGroup.classes, ...DecadeLevel.classes };
    DecadeLevelGroup.displayName = "@mantine/dates/DecadeLevelGroup";
    var defaultProps14 = {
        numberOfColumns: 1
    };
    var YearLevelGroup = core.factory((_props, ref) => {
        const props = core.useProps("YearLevelGroup", defaultProps14, _props);
        const {
            // YearLevel settings
            year,
            locale,
            minDate,
            maxDate,
            monthsListFormat,
            getMonthControlProps,
            __onControlClick,
            __onControlMouseEnter,
            withCellSpacing,
            // CalendarHeader settings
            __preventFocus,
            nextIcon,
            previousIcon,
            nextLabel,
            previousLabel,
            onNext,
            onPrevious,
            onLevelClick,
            nextDisabled,
            previousDisabled,
            hasNextLevel,
            // Other settings
            classNames,
            styles,
            unstyled,
            __staticSelector,
            __stopPropagation,
            numberOfColumns,
            levelControlAriaLabel,
            yearLabelFormat,
            size,
            vars,
            ...others
        } = props;
        const controlsRef = react.useRef([]);
        const years = Array(numberOfColumns).fill(0).map((_, yearIndex) => {
            const currentYear = dayjs26(year).add(yearIndex, "years").toDate();
            return /* @__PURE__ */ jsxRuntime.jsx(
                YearLevel,
                {
                    size,
                    monthsListFormat,
                    year: currentYear,
                    withNext: yearIndex === numberOfColumns - 1,
                    withPrevious: yearIndex === 0,
                    yearLabelFormat,
                    __stopPropagation,
                    __onControlClick,
                    __onControlMouseEnter,
                    __onControlKeyDown: (event, payload) => handleControlKeyDown({
                        levelIndex: yearIndex,
                        rowIndex: payload.rowIndex,
                        cellIndex: payload.cellIndex,
                        event,
                        controlsRef
                    }),
                    __getControlRef: (rowIndex, cellIndex, node) => {
                        if (!Array.isArray(controlsRef.current[yearIndex])) {
                            controlsRef.current[yearIndex] = [];
                        }
                        if (!Array.isArray(controlsRef.current[yearIndex][rowIndex])) {
                            controlsRef.current[yearIndex][rowIndex] = [];
                        }
                        controlsRef.current[yearIndex][rowIndex][cellIndex] = node;
                    },
                    levelControlAriaLabel: typeof levelControlAriaLabel === "function" ? levelControlAriaLabel(currentYear) : levelControlAriaLabel,
                    locale,
                    minDate,
                    maxDate,
                    __preventFocus,
                    nextIcon,
                    previousIcon,
                    nextLabel,
                    previousLabel,
                    onNext,
                    onPrevious,
                    onLevelClick,
                    nextDisabled,
                    previousDisabled,
                    hasNextLevel,
                    getMonthControlProps,
                    classNames,
                    styles,
                    unstyled,
                    __staticSelector: __staticSelector || "YearLevelGroup",
                    withCellSpacing
                },
                yearIndex
            );
        });
        return /* @__PURE__ */ jsxRuntime.jsx(
            LevelsGroup,
            {
                classNames,
                styles,
                __staticSelector: __staticSelector || "YearLevelGroup",
                ref,
                size,
                unstyled,
                ...others,
                children: years
            }
        );
    });
    YearLevelGroup.classes = { ...YearLevel.classes, ...LevelsGroup.classes };
    YearLevelGroup.displayName = "@mantine/dates/YearLevelGroup";
    var defaultProps15 = {
        numberOfColumns: 1
    };
    var MonthLevelGroup = core.factory((_props, ref) => {
        const props = core.useProps("MonthLevelGroup", defaultProps15, _props);
        const {
            // Month settings
            month,
            locale,
            firstDayOfWeek,
            weekdayFormat,
            weekendDays,
            getDayProps,
            excludeDate,
            minDate,
            maxDate,
            renderDay,
            hideOutsideDates,
            hideWeekdays,
            getDayAriaLabel,
            __onDayClick,
            __onDayMouseEnter,
            withCellSpacing,
            highlightToday,
            // CalendarHeader settings
            __preventFocus,
            nextIcon,
            previousIcon,
            nextLabel,
            previousLabel,
            onNext,
            onPrevious,
            onLevelClick,
            nextDisabled,
            previousDisabled,
            hasNextLevel,
            // Other settings
            classNames,
            styles,
            unstyled,
            numberOfColumns,
            levelControlAriaLabel,
            monthLabelFormat,
            __staticSelector,
            __stopPropagation,
            size,
            static: isStatic,
            vars,
            ...others
        } = props;
        const daysRefs = react.useRef([]);
        const months = Array(numberOfColumns).fill(0).map((_, monthIndex) => {
            const currentMonth = dayjs26(month).add(monthIndex, "months").toDate();
            return /* @__PURE__ */ jsxRuntime.jsx(
                MonthLevel,
                {
                    month: currentMonth,
                    withNext: monthIndex === numberOfColumns - 1,
                    withPrevious: monthIndex === 0,
                    monthLabelFormat,
                    __stopPropagation,
                    __onDayClick,
                    __onDayMouseEnter,
                    __onDayKeyDown: (event, payload) => handleControlKeyDown({
                        levelIndex: monthIndex,
                        rowIndex: payload.rowIndex,
                        cellIndex: payload.cellIndex,
                        event,
                        controlsRef: daysRefs
                    }),
                    __getDayRef: (rowIndex, cellIndex, node) => {
                        if (!Array.isArray(daysRefs.current[monthIndex])) {
                            daysRefs.current[monthIndex] = [];
                        }
                        if (!Array.isArray(daysRefs.current[monthIndex][rowIndex])) {
                            daysRefs.current[monthIndex][rowIndex] = [];
                        }
                        daysRefs.current[monthIndex][rowIndex][cellIndex] = node;
                    },
                    levelControlAriaLabel: typeof levelControlAriaLabel === "function" ? levelControlAriaLabel(currentMonth) : levelControlAriaLabel,
                    locale,
                    firstDayOfWeek,
                    weekdayFormat,
                    weekendDays,
                    getDayProps,
                    excludeDate,
                    minDate,
                    maxDate,
                    renderDay,
                    hideOutsideDates,
                    hideWeekdays,
                    getDayAriaLabel,
                    __preventFocus,
                    nextIcon,
                    previousIcon,
                    nextLabel,
                    previousLabel,
                    onNext,
                    onPrevious,
                    onLevelClick,
                    nextDisabled,
                    previousDisabled,
                    hasNextLevel,
                    classNames,
                    styles,
                    unstyled,
                    __staticSelector: __staticSelector || "MonthLevelGroup",
                    size,
                    static: isStatic,
                    withCellSpacing,
                    highlightToday
                },
                monthIndex
            );
        });
        return /* @__PURE__ */ jsxRuntime.jsx(
            LevelsGroup,
            {
                classNames,
                styles,
                __staticSelector: __staticSelector || "MonthLevelGroup",
                ref,
                size,
                ...others,
                children: months
            }
        );
    });
    MonthLevelGroup.classes = { ...LevelsGroup.classes, ...MonthLevel.classes };
    MonthLevelGroup.displayName = "@mantine/dates/MonthLevelGroup";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/PickerInputBase/PickerInputBase.module.css.mjs
    var classes10 = { "input": "m_6fa5e2aa" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/PickerInputBase/PickerInputBase.mjs
    var defaultProps16 = {};
    var PickerInputBase = core.factory((_props, ref) => {
        const {
            inputProps,
            wrapperProps,
            placeholder,
            classNames,
            styles,
            unstyled,
            popoverProps,
            modalProps,
            dropdownType,
            children,
            formattedValue,
            dropdownHandlers,
            dropdownOpened,
            onClick,
            clearable,
            onClear,
            clearButtonProps,
            rightSection,
            shouldClear,
            readOnly,
            disabled,
            value,
            name,
            form,
            type,
            ...others
        } = core.useInputProps("PickerInputBase", defaultProps16, _props);
        const _rightSection = rightSection || (clearable && shouldClear && !readOnly && !disabled ? /* @__PURE__ */ jsxRuntime.jsx(
            core.CloseButton,
            {
                variant: "transparent",
                onClick: onClear,
                unstyled,
                size: inputProps.size || "sm",
                ...clearButtonProps
            }
        ) : null);
        const handleClose = () => {
            const isInvalidRangeValue = type === "range" && Array.isArray(value) && value[0] && !value[1];
            if (isInvalidRangeValue) {
                onClear();
            }
            dropdownHandlers.close();
        };
        return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            dropdownType === "modal" && !readOnly && /* @__PURE__ */ jsxRuntime.jsx(
                core.Modal,
                {
                    opened: dropdownOpened,
                    onClose: handleClose,
                    withCloseButton: false,
                    size: "auto",
                    "data-dates-modal": true,
                    unstyled,
                    ...modalProps,
                    children
                }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(core.Input.Wrapper, { ...wrapperProps, children: /* @__PURE__ */ jsxRuntime.jsxs(
                core.Popover,
                {
                    position: "bottom-start",
                    opened: dropdownOpened,
                    trapFocus: true,
                    returnFocus: true,
                    unstyled,
                    ...popoverProps,
                    disabled: popoverProps?.disabled || dropdownType === "modal" || readOnly,
                    onClose: () => {
                        popoverProps?.onClose?.();
                        handleClose();
                    },
                    children: [
                        /* @__PURE__ */ jsxRuntime.jsx(core.Popover.Target, { children: /* @__PURE__ */ jsxRuntime.jsx(
                            core.Input,
                            {
                                "aria-label": formattedValue || placeholder,
                                "data-dates-input": true,
                                "data-read-only": readOnly || void 0,
                                disabled,
                                component: "button",
                                type: "button",
                                multiline: true,
                                onClick: (event) => {
                                    onClick?.(event);
                                    dropdownHandlers.toggle();
                                },
                                rightSection: _rightSection,
                                ...inputProps,
                                ref,
                                classNames: { ...classNames, input: clsx_default(classes10.input, classNames?.input) },
                                ...others,
                                children: formattedValue || /* @__PURE__ */ jsxRuntime.jsx(
                                    core.Input.Placeholder,
                                    {
                                        error: inputProps.error,
                                        unstyled,
                                        className: classNames?.placeholder,
                                        style: styles?.placeholder,
                                        children: placeholder
                                    }
                                )
                            }
                        ) }),
                        /* @__PURE__ */ jsxRuntime.jsx(core.Popover.Dropdown, { "data-dates-dropdown": true, children })
                    ]
                }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx(HiddenDatesInput, { value, name, form, type })
        ] });
    });
    PickerInputBase.classes = classes10;
    PickerInputBase.displayName = "@mantine/dates/PickerInputBase";
    var getEmptyValue = (type) => type === "range" ? [null, null] : type === "multiple" ? [] : null;
    function useUncontrolledDates({
        type,
        value,
        defaultValue,
        onChange,
        applyTimezone = true
    }) {
        const storedType = react.useRef(type);
        const ctx = useDatesContext();
        const [_value, _setValue, controlled] = hooks.useUncontrolled({
            value: shiftTimezone("add", value, ctx.getTimezone(), !applyTimezone),
            defaultValue: shiftTimezone("add", defaultValue, ctx.getTimezone(), !applyTimezone),
            finalValue: getEmptyValue(type),
            onChange: (newDate) => {
                onChange?.(shiftTimezone("remove", newDate, ctx.getTimezone(), !applyTimezone));
            }
        });
        let _finalValue = _value;
        if (storedType.current !== type) {
            storedType.current = type;
            if (value === void 0) {
                _finalValue = defaultValue !== void 0 ? defaultValue : getEmptyValue(type);
                _setValue(_finalValue);
            } else {
                switch (type) {
                    case "default":
                        if (value !== null && typeof value !== "string") {
                            console.error(
                                "[@mantine/dates/use-uncontrolled-dates] Value must be type of `null` or `string`"
                            );
                        }
                        break;
                    case "multiple":
                        if (!(value instanceof Array)) {
                            console.error(
                                "[@mantine/dates/use-uncontrolled-dates] Value must be type of `string[]`"
                            );
                        }
                        break;
                    case "range":
                        if (!(value instanceof Array) || value.length !== 2) {
                            console.error(
                                "[@mantine/dates/use-uncontrolled-dates] Value must be type of `[string, string]`"
                            );
                        }
                        break;
                }
            }
        }
        return [_finalValue, _setValue, controlled];
    }
    function levelToNumber(level, fallback) {
        if (!level) {
            return fallback || 0;
        }
        return level === "month" ? 0 : level === "year" ? 1 : 2;
    }
    function levelNumberToLevel(levelNumber) {
        return levelNumber === 0 ? "month" : levelNumber === 1 ? "year" : "decade";
    }
    function clampLevel(level, minLevel, maxLevel) {
        return levelNumberToLevel(
            hooks.clamp(
                levelToNumber(level, 0),
                levelToNumber(minLevel, 0),
                levelToNumber(maxLevel, 2)
            )
        );
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Calendar/Calendar.mjs
    var defaultProps17 = {
        maxLevel: "decade",
        minLevel: "month",
        __updateDateOnYearSelect: true,
        __updateDateOnMonthSelect: true
    };
    var Calendar = core.factory((_props, ref) => {
        const props = core.useProps("Calendar", defaultProps17, _props);
        const {
            vars,
            // CalendarLevel props
            maxLevel,
            minLevel,
            defaultLevel,
            level,
            onLevelChange,
            date,
            defaultDate,
            onDateChange,
            numberOfColumns,
            columnsToScroll,
            ariaLabels,
            onYearSelect,
            onMonthSelect,
            onYearMouseEnter,
            onMonthMouseEnter,
            __updateDateOnYearSelect,
            __updateDateOnMonthSelect,
            // MonthLevelGroup props
            firstDayOfWeek,
            weekdayFormat,
            weekendDays,
            getDayProps,
            excludeDate,
            renderDay,
            hideOutsideDates,
            hideWeekdays,
            getDayAriaLabel,
            monthLabelFormat,
            nextIcon,
            previousIcon,
            __onDayClick,
            __onDayMouseEnter,
            withCellSpacing,
            highlightToday,
            // YearLevelGroup props
            monthsListFormat,
            getMonthControlProps,
            yearLabelFormat,
            // DecadeLevelGroup props
            yearsListFormat,
            getYearControlProps,
            decadeLabelFormat,
            // Other props
            classNames,
            styles,
            unstyled,
            minDate,
            maxDate,
            locale,
            __staticSelector,
            size,
            __preventFocus,
            __stopPropagation,
            onNextDecade,
            onPreviousDecade,
            onNextYear,
            onPreviousYear,
            onNextMonth,
            onPreviousMonth,
            static: isStatic,
            __timezoneApplied,
            ...others
        } = props;
        const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
            classNames,
            styles,
            props
        });
        const [_level, setLevel] = hooks.useUncontrolled({
            value: level ? clampLevel(level, minLevel, maxLevel) : void 0,
            defaultValue: defaultLevel ? clampLevel(defaultLevel, minLevel, maxLevel) : void 0,
            finalValue: clampLevel(void 0, minLevel, maxLevel),
            onChange: onLevelChange
        });
        const [_date, setDate] = useUncontrolledDates({
            type: "default",
            value: date,
            defaultValue: defaultDate,
            onChange: onDateChange,
            applyTimezone: !__timezoneApplied
        });
        const stylesApiProps = {
            __staticSelector: __staticSelector || "Calendar",
            styles: resolvedStyles,
            classNames: resolvedClassNames,
            unstyled,
            size
        };
        const ctx = useDatesContext();
        const _columnsToScroll = columnsToScroll || numberOfColumns || 1;
        const currentDate = _date || shiftTimezone("add", /* @__PURE__ */ new Date(), ctx.getTimezone());
        const handleNextMonth = () => {
            const nextDate = dayjs26(currentDate).add(_columnsToScroll, "month").toDate();
            onNextMonth?.(nextDate);
            setDate(nextDate);
        };
        const handlePreviousMonth = () => {
            const nextDate = dayjs26(currentDate).subtract(_columnsToScroll, "month").toDate();
            onPreviousMonth?.(nextDate);
            setDate(nextDate);
        };
        const handleNextYear = () => {
            const nextDate = dayjs26(currentDate).add(_columnsToScroll, "year").toDate();
            onNextYear?.(nextDate);
            setDate(nextDate);
        };
        const handlePreviousYear = () => {
            const nextDate = dayjs26(currentDate).subtract(_columnsToScroll, "year").toDate();
            onPreviousYear?.(nextDate);
            setDate(nextDate);
        };
        const handleNextDecade = () => {
            const nextDate = dayjs26(currentDate).add(10 * _columnsToScroll, "year").toDate();
            onNextDecade?.(nextDate);
            setDate(nextDate);
        };
        const handlePreviousDecade = () => {
            const nextDate = dayjs26(currentDate).subtract(10 * _columnsToScroll, "year").toDate();
            onPreviousDecade?.(nextDate);
            setDate(nextDate);
        };
        return /* @__PURE__ */ jsxRuntime.jsxs(core.Box, { ref, size, "data-calendar": true, ...others, children: [
            _level === "month" && /* @__PURE__ */ jsxRuntime.jsx(
                MonthLevelGroup,
                {
                    month: currentDate,
                    minDate,
                    maxDate,
                    firstDayOfWeek,
                    weekdayFormat,
                    weekendDays,
                    getDayProps,
                    excludeDate,
                    renderDay,
                    hideOutsideDates,
                    hideWeekdays,
                    getDayAriaLabel,
                    onNext: handleNextMonth,
                    onPrevious: handlePreviousMonth,
                    hasNextLevel: maxLevel !== "month",
                    onLevelClick: () => setLevel("year"),
                    numberOfColumns,
                    locale,
                    levelControlAriaLabel: ariaLabels?.monthLevelControl,
                    nextLabel: ariaLabels?.nextMonth,
                    nextIcon,
                    previousLabel: ariaLabels?.previousMonth,
                    previousIcon,
                    monthLabelFormat,
                    __onDayClick,
                    __onDayMouseEnter,
                    __preventFocus,
                    __stopPropagation,
                    static: isStatic,
                    withCellSpacing,
                    highlightToday,
                    ...stylesApiProps
                }
            ),
            _level === "year" && /* @__PURE__ */ jsxRuntime.jsx(
                YearLevelGroup,
                {
                    year: currentDate,
                    numberOfColumns,
                    minDate,
                    maxDate,
                    monthsListFormat,
                    getMonthControlProps,
                    locale,
                    onNext: handleNextYear,
                    onPrevious: handlePreviousYear,
                    hasNextLevel: maxLevel !== "month" && maxLevel !== "year",
                    onLevelClick: () => setLevel("decade"),
                    levelControlAriaLabel: ariaLabels?.yearLevelControl,
                    nextLabel: ariaLabels?.nextYear,
                    nextIcon,
                    previousLabel: ariaLabels?.previousYear,
                    previousIcon,
                    yearLabelFormat,
                    __onControlMouseEnter: onMonthMouseEnter,
                    __onControlClick: (_event, payload) => {
                        __updateDateOnMonthSelect && setDate(payload);
                        setLevel(clampLevel("month", minLevel, maxLevel));
                        onMonthSelect?.(payload);
                    },
                    __preventFocus,
                    __stopPropagation,
                    withCellSpacing,
                    ...stylesApiProps
                }
            ),
            _level === "decade" && /* @__PURE__ */ jsxRuntime.jsx(
                DecadeLevelGroup,
                {
                    decade: currentDate,
                    minDate,
                    maxDate,
                    yearsListFormat,
                    getYearControlProps,
                    locale,
                    onNext: handleNextDecade,
                    onPrevious: handlePreviousDecade,
                    numberOfColumns,
                    nextLabel: ariaLabels?.nextDecade,
                    nextIcon,
                    previousLabel: ariaLabels?.previousDecade,
                    previousIcon,
                    decadeLabelFormat,
                    __onControlMouseEnter: onYearMouseEnter,
                    __onControlClick: (_event, payload) => {
                        __updateDateOnYearSelect && setDate(payload);
                        setLevel(clampLevel("year", minLevel, maxLevel));
                        onYearSelect?.(payload);
                    },
                    __preventFocus,
                    __stopPropagation,
                    withCellSpacing,
                    ...stylesApiProps
                }
            )
        ] });
    });
    Calendar.classes = {
        ...DecadeLevelGroup.classes,
        ...YearLevelGroup.classes,
        ...MonthLevelGroup.classes
    };
    Calendar.displayName = "@mantine/dates/Calendar";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/Calendar/pick-calendar-levels-props/pick-calendar-levels-props.mjs
    function pickCalendarProps(props) {
        const {
            maxLevel,
            minLevel,
            defaultLevel,
            level,
            onLevelChange,
            nextIcon,
            previousIcon,
            date,
            defaultDate,
            onDateChange,
            numberOfColumns,
            columnsToScroll,
            ariaLabels,
            onYearSelect,
            onMonthSelect,
            onYearMouseEnter,
            onMonthMouseEnter,
            onNextMonth,
            onPreviousMonth,
            onNextYear,
            onPreviousYear,
            onNextDecade,
            onPreviousDecade,
            withCellSpacing,
            highlightToday,
            __updateDateOnYearSelect,
            __updateDateOnMonthSelect,
            // MonthLevelGroup props
            firstDayOfWeek,
            weekdayFormat,
            weekendDays,
            getDayProps,
            excludeDate,
            renderDay,
            hideOutsideDates,
            hideWeekdays,
            getDayAriaLabel,
            monthLabelFormat,
            // YearLevelGroup props
            monthsListFormat,
            getMonthControlProps,
            yearLabelFormat,
            // DecadeLevelGroup props
            yearsListFormat,
            getYearControlProps,
            decadeLabelFormat,
            // External picker props
            allowSingleDateInRange,
            allowDeselect,
            // Other props
            minDate,
            maxDate,
            locale,
            ...others
        } = props;
        return {
            calendarProps: {
                maxLevel,
                minLevel,
                defaultLevel,
                level,
                onLevelChange,
                nextIcon,
                previousIcon,
                date,
                defaultDate,
                onDateChange,
                numberOfColumns,
                columnsToScroll,
                ariaLabels,
                onYearSelect,
                onMonthSelect,
                onYearMouseEnter,
                onMonthMouseEnter,
                onNextMonth,
                onPreviousMonth,
                onNextYear,
                onPreviousYear,
                onNextDecade,
                onPreviousDecade,
                withCellSpacing,
                highlightToday,
                __updateDateOnYearSelect,
                __updateDateOnMonthSelect,
                // MonthLevelGroup props
                firstDayOfWeek,
                weekdayFormat,
                weekendDays,
                getDayProps,
                excludeDate,
                renderDay,
                hideOutsideDates,
                hideWeekdays,
                getDayAriaLabel,
                monthLabelFormat,
                // YearLevelGroup props
                monthsListFormat,
                getMonthControlProps,
                yearLabelFormat,
                // DecadeLevelGroup props
                yearsListFormat,
                getYearControlProps,
                decadeLabelFormat,
                // External picker props
                allowSingleDateInRange,
                allowDeselect,
                // Other props
                minDate,
                maxDate,
                locale
            },
            others
        };
    }
    function isInRange(date, range) {
        const _range = [...range].sort((a, b) => a.getTime() - b.getTime());
        return dayjs26(_range[0]).startOf("day").subtract(1, "ms").isBefore(date) && dayjs26(_range[1]).endOf("day").add(1, "ms").isAfter(date);
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/hooks/use-dates-state/use-dates-state.mjs
    function useDatesState({
        type,
        level,
        value,
        defaultValue,
        onChange,
        allowSingleDateInRange,
        allowDeselect,
        onMouseLeave,
        applyTimezone = true
    }) {
        const [_value, setValue] = useUncontrolledDates({
            type,
            value,
            defaultValue,
            onChange,
            applyTimezone
        });
        const [pickedDate, setPickedDate] = react.useState(
            type === "range" ? _value[0] && !_value[1] ? _value[0] : null : null
        );
        const [hoveredDate, setHoveredDate] = react.useState(null);
        const onDateChange = (date) => {
            if (type === "range") {
                if (pickedDate instanceof Date && !_value[1]) {
                    if (dayjs26(date).isSame(pickedDate, level) && !allowSingleDateInRange) {
                        setPickedDate(null);
                        setHoveredDate(null);
                        setValue([null, null]);
                        return;
                    }
                    const result = [date, pickedDate];
                    result.sort((a, b) => a.getTime() - b.getTime());
                    setValue(result);
                    setHoveredDate(null);
                    setPickedDate(null);
                    return;
                }
                if (_value[0] && !_value[1] && dayjs26(date).isSame(_value[0], level) && !allowSingleDateInRange) {
                    setPickedDate(null);
                    setHoveredDate(null);
                    setValue([null, null]);
                    return;
                }
                setValue([date, null]);
                setHoveredDate(null);
                setPickedDate(date);
                return;
            }
            if (type === "multiple") {
                if (_value.some((selected) => dayjs26(selected).isSame(date, level))) {
                    setValue(_value.filter((selected) => !dayjs26(selected).isSame(date, level)));
                } else {
                    setValue([..._value, date]);
                }
                return;
            }
            if (_value && allowDeselect && dayjs26(date).isSame(_value, level)) {
                setValue(null);
            } else {
                setValue(date);
            }
        };
        const isDateInRange = (date) => {
            if (pickedDate instanceof Date && hoveredDate instanceof Date) {
                return isInRange(date, [hoveredDate, pickedDate]);
            }
            if (_value[0] instanceof Date && _value[1] instanceof Date) {
                return isInRange(date, _value);
            }
            return false;
        };
        const onRootMouseLeave = type === "range" ? (event) => {
            onMouseLeave?.(event);
            setHoveredDate(null);
        } : onMouseLeave;
        const isFirstInRange = (date) => {
            if (!(_value[0] instanceof Date)) {
                return false;
            }
            if (dayjs26(date).isSame(_value[0], level)) {
                return !(hoveredDate && dayjs26(hoveredDate).isBefore(_value[0]));
            }
            return false;
        };
        const isLastInRange = (date) => {
            if (_value[1] instanceof Date) {
                return dayjs26(date).isSame(_value[1], level);
            }
            if (!(_value[0] instanceof Date) || !hoveredDate) {
                return false;
            }
            return dayjs26(hoveredDate).isBefore(_value[0]) && dayjs26(date).isSame(_value[0], level);
        };
        const getControlProps = (date) => {
            if (type === "range") {
                return {
                    selected: _value.some(
                        (selection) => selection && dayjs26(selection).isSame(date, level)
                    ),
                    inRange: isDateInRange(date),
                    firstInRange: isFirstInRange(date),
                    lastInRange: isLastInRange(date),
                    "data-autofocus": !!_value[0] && dayjs26(_value[0]).isSame(date, level) || void 0
                };
            }
            if (type === "multiple") {
                return {
                    selected: _value.some(
                        (selection) => selection && dayjs26(selection).isSame(date, level)
                    ),
                    "data-autofocus": !!_value[0] && dayjs26(_value[0]).isSame(date, level) || void 0
                };
            }
            const selected = dayjs26(_value).isSame(date, level);
            return { selected, "data-autofocus": selected || void 0 };
        };
        const onHoveredDateChange = type === "range" && pickedDate ? setHoveredDate : () => {
        };
        react.useEffect(() => {
            if (type === "range" && !_value[0] && !_value[1]) {
                setPickedDate(null);
            }
        }, [value]);
        return {
            onDateChange,
            onRootMouseLeave,
            onHoveredDateChange,
            getControlProps,
            _value,
            setValue
        };
    }
    var defaultProps18 = {
        type: "default"
    };
    var YearPicker = core.factory((_props, ref) => {
        const props = core.useProps("YearPicker", defaultProps18, _props);
        const {
            classNames,
            styles,
            vars,
            type,
            defaultValue,
            value,
            onChange,
            __staticSelector,
            getYearControlProps,
            allowSingleDateInRange,
            allowDeselect,
            onMouseLeave,
            onYearSelect,
            __updateDateOnYearSelect,
            __timezoneApplied,
            ...others
        } = props;
        const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps } = useDatesState({
            type,
            level: "year",
            allowDeselect,
            allowSingleDateInRange,
            value,
            defaultValue,
            onChange,
            onMouseLeave,
            applyTimezone: !__timezoneApplied
        });
        const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
            classNames,
            styles,
            props
        });
        const ctx = useDatesContext();
        return /* @__PURE__ */ jsxRuntime.jsx(
            Calendar,
            {
                ref,
                minLevel: "decade",
                __updateDateOnYearSelect: __updateDateOnYearSelect ?? false,
                __staticSelector: __staticSelector || "YearPicker",
                onMouseLeave: onRootMouseLeave,
                onYearMouseEnter: (_event, date) => onHoveredDateChange(date),
                onYearSelect: (date) => {
                    onDateChange(date);
                    onYearSelect?.(date);
                },
                getYearControlProps: (date) => ({
                    ...getControlProps(date),
                    ...getYearControlProps?.(date)
                }),
                classNames: resolvedClassNames,
                styles: resolvedStyles,
                ...others,
                date: shiftTimezone("add", others.date, ctx.getTimezone(), __timezoneApplied),
                __timezoneApplied: true
            }
        );
    });
    YearPicker.classes = Calendar.classes;
    YearPicker.displayName = "@mantine/dates/YearPicker";
    var defaultProps19 = {
        type: "default"
    };
    var MonthPicker = core.factory((_props, ref) => {
        const props = core.useProps("MonthPicker", defaultProps19, _props);
        const {
            classNames,
            styles,
            vars,
            type,
            defaultValue,
            value,
            onChange,
            __staticSelector,
            getMonthControlProps,
            allowSingleDateInRange,
            allowDeselect,
            onMouseLeave,
            onMonthSelect,
            __updateDateOnMonthSelect,
            __timezoneApplied,
            onLevelChange,
            ...others
        } = props;
        const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps } = useDatesState({
            type,
            level: "month",
            allowDeselect,
            allowSingleDateInRange,
            value,
            defaultValue,
            onChange,
            onMouseLeave,
            applyTimezone: !__timezoneApplied
        });
        const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
            classNames,
            styles,
            props
        });
        const ctx = useDatesContext();
        return /* @__PURE__ */ jsxRuntime.jsx(
            Calendar,
            {
                ref,
                minLevel: "year",
                __updateDateOnMonthSelect: __updateDateOnMonthSelect ?? false,
                __staticSelector: __staticSelector || "MonthPicker",
                onMouseLeave: onRootMouseLeave,
                onMonthMouseEnter: (_event, date) => onHoveredDateChange(date),
                onMonthSelect: (date) => {
                    onDateChange(date);
                    onMonthSelect?.(date);
                },
                getMonthControlProps: (date) => ({
                    ...getControlProps(date),
                    ...getMonthControlProps?.(date)
                }),
                classNames: resolvedClassNames,
                styles: resolvedStyles,
                onLevelChange,
                ...others,
                date: shiftTimezone("add", others.date, ctx.getTimezone(), __timezoneApplied)
            }
        );
    });
    MonthPicker.classes = Calendar.classes;
    MonthPicker.displayName = "@mantine/dates/MonthPicker";
    var defaultProps20 = {
        type: "default",
        defaultLevel: "month",
        numberOfColumns: 1
    };
    var DatePicker = core.factory((_props, ref) => {
        const props = core.useProps("DatePicker", defaultProps20, _props);
        const {
            classNames,
            styles,
            vars,
            type,
            defaultValue,
            value,
            onChange,
            __staticSelector,
            getDayProps,
            allowSingleDateInRange,
            allowDeselect,
            onMouseLeave,
            numberOfColumns,
            hideOutsideDates,
            __onDayMouseEnter,
            __onDayClick,
            __timezoneApplied,
            ...others
        } = props;
        const { onDateChange, onRootMouseLeave, onHoveredDateChange, getControlProps } = useDatesState({
            type,
            level: "day",
            allowDeselect,
            allowSingleDateInRange,
            value,
            defaultValue,
            onChange,
            onMouseLeave,
            applyTimezone: !__timezoneApplied
        });
        const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
            classNames,
            styles,
            props
        });
        const ctx = useDatesContext();
        return /* @__PURE__ */ jsxRuntime.jsx(
            Calendar,
            {
                ref,
                minLevel: "month",
                classNames: resolvedClassNames,
                styles: resolvedStyles,
                __staticSelector: __staticSelector || "DatePicker",
                onMouseLeave: onRootMouseLeave,
                numberOfColumns,
                hideOutsideDates: hideOutsideDates ?? numberOfColumns !== 1,
                __onDayMouseEnter: (_event, date) => {
                    onHoveredDateChange(date);
                    __onDayMouseEnter?.(_event, date);
                },
                __onDayClick: (_event, date) => {
                    onDateChange(date);
                    __onDayClick?.(_event, date);
                },
                getDayProps: (date) => ({
                    ...getControlProps(date),
                    ...getDayProps?.(date)
                }),
                ...others,
                date: shiftTimezone("add", others.date, ctx.getTimezone(), __timezoneApplied),
                __timezoneApplied: true
            }
        );
    });
    DatePicker.classes = Calendar.classes;
    DatePicker.displayName = "@mantine/dates/DatePicker";
    function dateStringParser(dateString, timezone) {
        if (dateString === null) {
            return null;
        }
        const date = shiftTimezone("add", new Date(dateString), timezone);
        if (Number.isNaN(date.getTime()) || !dateString) {
            return null;
        }
        return date;
    }
    function isDateValid({ date, maxDate, minDate }) {
        if (date == null) {
            return false;
        }
        if (Number.isNaN(date.getTime())) {
            return false;
        }
        if (maxDate && dayjs26(date).isAfter(maxDate, "date")) {
            return false;
        }
        if (minDate && dayjs26(date).isBefore(minDate, "date")) {
            return false;
        }
        return true;
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/DateInput/DateInput.mjs
    var defaultProps21 = {
        valueFormat: "MMMM D, YYYY",
        fixOnBlur: true,
        preserveTime: true
    };
    var DateInput = core.factory((_props, ref) => {
        const props = core.useInputProps("DateInput", defaultProps21, _props);
        const {
            inputProps,
            wrapperProps,
            value,
            defaultValue,
            onChange,
            clearable,
            clearButtonProps,
            popoverProps,
            getDayProps,
            locale,
            valueFormat,
            dateParser,
            minDate,
            maxDate,
            fixOnBlur,
            onFocus,
            onBlur,
            onClick,
            readOnly,
            name,
            form,
            rightSection,
            unstyled,
            classNames,
            styles,
            allowDeselect,
            preserveTime,
            date,
            defaultDate,
            onDateChange,
            ...rest
        } = props;
        const [dropdownOpened, setDropdownOpened] = react.useState(false);
        const { calendarProps, others } = pickCalendarProps(rest);
        const ctx = useDatesContext();
        const defaultDateParser = (val) => {
            const parsedDate = dayjs26(val, valueFormat, ctx.getLocale(locale)).toDate();
            return Number.isNaN(parsedDate.getTime()) ? dateStringParser(val, ctx.getTimezone()) : parsedDate;
        };
        const _dateParser = dateParser || defaultDateParser;
        const _allowDeselect = allowDeselect !== void 0 ? allowDeselect : clearable;
        const formatValue2 = (val) => val ? dayjs26(val).locale(ctx.getLocale(locale)).format(valueFormat) : "";
        const [_value, setValue, controlled] = useUncontrolledDates({
            type: "default",
            value,
            defaultValue,
            onChange
        });
        const [_date, setDate] = useUncontrolledDates({
            type: "default",
            value: date,
            defaultValue: defaultValue || defaultDate,
            onChange: onDateChange
        });
        react.useEffect(() => {
            if (controlled) {
                setDate(value);
            }
        }, [controlled, value]);
        const [inputValue, setInputValue] = react.useState(formatValue2(_value));
        react.useEffect(() => {
            setInputValue(formatValue2(_value));
        }, [ctx.getLocale(locale)]);
        const handleInputChange = (event) => {
            const val = event.currentTarget.value;
            setInputValue(val);
            setDropdownOpened(true);
            if (val.trim() === "" && clearable) {
                setValue(null);
            } else {
                const dateValue = _dateParser(val);
                if (isDateValid({ date: dateValue, minDate, maxDate })) {
                    setValue(dateValue);
                    setDate(dateValue);
                }
            }
        };
        const handleInputBlur = (event) => {
            onBlur?.(event);
            setDropdownOpened(false);
            fixOnBlur && setInputValue(formatValue2(_value));
        };
        const handleInputFocus = (event) => {
            onFocus?.(event);
            setDropdownOpened(true);
        };
        const handleInputClick = (event) => {
            onClick?.(event);
            setDropdownOpened(true);
        };
        const _getDayProps = (day) => ({
            ...getDayProps?.(day),
            selected: dayjs26(_value).isSame(day, "day"),
            onClick: () => {
                const valueWithTime = preserveTime ? assignTime(_value, day) : day;
                const val = clearable && _allowDeselect ? dayjs26(_value).isSame(day, "day") ? null : valueWithTime : valueWithTime;
                setValue(val);
                !controlled && setInputValue(formatValue2(val));
                setDropdownOpened(false);
            }
        });
        const _rightSection = rightSection || (clearable && _value && !readOnly ? /* @__PURE__ */ jsxRuntime.jsx(
            core.CloseButton,
            {
                variant: "transparent",
                onMouseDown: (event) => event.preventDefault(),
                tabIndex: -1,
                onClick: () => {
                    setValue(null);
                    !controlled && setInputValue("");
                    setDropdownOpened(false);
                },
                unstyled,
                size: inputProps.size || "sm",
                ...clearButtonProps
            }
        ) : null);
        hooks.useDidUpdate(() => {
            value !== void 0 && !dropdownOpened && setInputValue(formatValue2(value));
        }, [value]);
        return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(core.Input.Wrapper, { ...wrapperProps, __staticSelector: "DateInput", children: /* @__PURE__ */ jsxRuntime.jsxs(
                core.Popover,
                {
                    opened: dropdownOpened,
                    trapFocus: false,
                    position: "bottom-start",
                    disabled: readOnly,
                    withRoles: false,
                    unstyled,
                    ...popoverProps,
                    children: [
                        /* @__PURE__ */ jsxRuntime.jsx(core.Popover.Target, { children: /* @__PURE__ */ jsxRuntime.jsx(
                            core.Input,
                            {
                                "data-dates-input": true,
                                "data-read-only": readOnly || void 0,
                                autoComplete: "off",
                                ref,
                                value: inputValue,
                                onChange: handleInputChange,
                                onBlur: handleInputBlur,
                                onFocus: handleInputFocus,
                                onClick: handleInputClick,
                                readOnly,
                                rightSection: _rightSection,
                                ...inputProps,
                                ...others,
                                __staticSelector: "DateInput"
                            }
                        ) }),
                        /* @__PURE__ */ jsxRuntime.jsx(core.Popover.Dropdown, { onMouseDown: (event) => event.preventDefault(), "data-dates-dropdown": true, children: /* @__PURE__ */ jsxRuntime.jsx(
                            Calendar,
                            {
                                __staticSelector: "DateInput",
                                __timezoneApplied: true,
                                ...calendarProps,
                                classNames,
                                styles,
                                unstyled,
                                __preventFocus: true,
                                minDate,
                                maxDate,
                                locale,
                                getDayProps: _getDayProps,
                                size: inputProps.size,
                                date: _date,
                                onDateChange: setDate
                            }
                        ) })
                    ]
                }
            ) }),
            /* @__PURE__ */ jsxRuntime.jsx(HiddenDatesInput, { name, form, value: _value, type: "default" })
        ] });
    });
    DateInput.classes = { ...core.Input.classes, ...Calendar.classes };
    DateInput.displayName = "@mantine/dates/DateInput";

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/DateTimePicker/DateTimePicker.module.css.mjs
    var classes11 = { "timeWrapper": "m_208d2562", "timeInput": "m_62ee059" };

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/DateTimePicker/DateTimePicker.mjs
    var defaultProps22 = {
        dropdownType: "popover"
    };
    var DateTimePicker = core.factory((_props, ref) => {
        const props = core.useProps("DateTimePicker", defaultProps22, _props);
        const {
            value,
            defaultValue,
            onChange,
            valueFormat,
            locale,
            classNames,
            styles,
            unstyled,
            timeInputProps,
            submitButtonProps,
            withSeconds,
            level,
            defaultLevel,
            size,
            variant,
            dropdownType,
            vars,
            minDate,
            maxDate,
            ...rest
        } = props;
        const getStyles = core.useStyles({
            name: "DateTimePicker",
            classes: classes11,
            props,
            classNames,
            styles,
            unstyled,
            vars
        });
        const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
            classNames,
            styles,
            props
        });
        const _valueFormat = valueFormat || (withSeconds ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY HH:mm");
        const timeInputRef = react.useRef();
        const timeInputRefMerged = hooks.useMergedRef(timeInputRef, timeInputProps?.ref);
        const {
            calendarProps: { allowSingleDateInRange, ...calendarProps },
            others
        } = pickCalendarProps(rest);
        const ctx = useDatesContext();
        const [_value, setValue] = useUncontrolledDates({
            type: "default",
            value,
            defaultValue,
            onChange
        });
        const formatTime = (dateValue) => dateValue ? dayjs26(dateValue).format(withSeconds ? "HH:mm:ss" : "HH:mm") : "";
        const [timeValue, setTimeValue] = react.useState(formatTime(_value));
        const [currentLevel, setCurrentLevel] = react.useState(level || defaultLevel || "month");
        const [dropdownOpened, dropdownHandlers] = hooks.useDisclosure(false);
        const formattedValue = _value ? dayjs26(_value).locale(ctx.getLocale(locale)).format(_valueFormat) : "";
        const handleTimeChange = (event) => {
            timeInputProps?.onChange?.(event);
            const val = event.currentTarget.value;
            setTimeValue(val);
            if (val) {
                const [hours, minutes, seconds] = val.split(":").map(Number);
                const timeDate = shiftTimezone("add", /* @__PURE__ */ new Date(), ctx.getTimezone());
                timeDate.setHours(hours);
                timeDate.setMinutes(minutes);
                timeDate.setSeconds(seconds || 0);
                setValue(assignTime(timeDate, _value || shiftTimezone("add", /* @__PURE__ */ new Date(), ctx.getTimezone())));
            }
        };
        const handleDateChange = (date) => {
            if (date) {
                setValue(assignTime(_value, date));
            }
            timeInputRef.current?.focus();
        };
        const handleTimeInputKeyDown = (event) => {
            timeInputProps?.onKeyDown?.(event);
            if (event.key === "Enter") {
                event.preventDefault();
                dropdownHandlers.close();
            }
        };
        hooks.useDidUpdate(() => {
            if (!dropdownOpened) {
                setTimeValue(formatTime(_value));
            }
        }, [_value, dropdownOpened]);
        hooks.useDidUpdate(() => {
            if (dropdownOpened) {
                setCurrentLevel("month");
            }
        }, [dropdownOpened]);
        const minTime = minDate ? dayjs26(minDate).format("HH:mm:ss") : null;
        const maxTime = maxDate ? dayjs26(maxDate).format("HH:mm:ss") : null;
        const __stopPropagation = dropdownType === "popover";
        return /* @__PURE__ */ jsxRuntime.jsxs(
            PickerInputBase,
            {
                formattedValue,
                dropdownOpened,
                dropdownHandlers,
                classNames: resolvedClassNames,
                styles: resolvedStyles,
                unstyled,
                ref,
                onClear: () => setValue(null),
                shouldClear: !!_value,
                value: _value,
                size,
                variant,
                dropdownType,
                ...others,
                type: "default",
                __staticSelector: "DateTimePicker",
                children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                        DatePicker,
                        {
                            ...calendarProps,
                            maxDate,
                            minDate,
                            size,
                            variant,
                            type: "default",
                            value: _value,
                            defaultDate: _value,
                            onChange: handleDateChange,
                            locale,
                            classNames: resolvedClassNames,
                            styles: resolvedStyles,
                            unstyled,
                            __staticSelector: "DateTimePicker",
                            __stopPropagation,
                            level,
                            defaultLevel,
                            onLevelChange: (_level) => {
                                setCurrentLevel(_level);
                                calendarProps.onLevelChange?.(_level);
                            },
                            __timezoneApplied: true
                        }
                    ),
                    currentLevel === "month" && /* @__PURE__ */ jsxRuntime.jsxs("div", { ...getStyles("timeWrapper"), children: [
                        /* @__PURE__ */ jsxRuntime.jsx(
                            TimeInput,
                            {
                                value: timeValue,
                                withSeconds,
                                ref: timeInputRefMerged,
                                unstyled,
                                minTime: _value && minDate && _value.toDateString() === minDate.toDateString() ? minTime != null ? minTime : void 0 : void 0,
                                maxTime: _value && maxDate && _value.toDateString() === maxDate.toDateString() ? maxTime != null ? maxTime : void 0 : void 0,
                                ...timeInputProps,
                                ...getStyles("timeInput", {
                                    className: timeInputProps?.className,
                                    style: timeInputProps?.style
                                }),
                                onChange: handleTimeChange,
                                onKeyDown: handleTimeInputKeyDown,
                                size,
                                "data-mantine-stop-propagation": __stopPropagation || void 0
                            }
                        ),
                        /* @__PURE__ */ jsxRuntime.jsx(
                            core.ActionIcon,
                            {
                                variant: "default",
                                size: `input-${size || "sm"}`,
                                ...getStyles("submitButton", {
                                    className: submitButtonProps?.className,
                                    style: submitButtonProps?.style
                                }),
                                unstyled,
                                "data-mantine-stop-propagation": __stopPropagation || void 0,
                                children: /* @__PURE__ */ jsxRuntime.jsx(core.CheckIcon, { size: "30%" }),
                                ...submitButtonProps,
                                onClick: (event) => {
                                    submitButtonProps?.onClick?.(event);
                                    dropdownHandlers.close();
                                }
                            }
                        )
                    ] })
                ]
            }
        );
    });
    DateTimePicker.classes = { ...classes11, ...PickerInputBase.classes, ...DatePicker.classes };
    DateTimePicker.displayName = "@mantine/dates/DateTimePicker";
    function useDatesInput({
        type,
        value,
        defaultValue,
        onChange,
        locale,
        format,
        closeOnChange,
        sortDates,
        labelSeparator,
        valueFormatter
    }) {
        const ctx = useDatesContext();
        const [dropdownOpened, dropdownHandlers] = hooks.useDisclosure(false);
        const [_value, _setValue] = useUncontrolledDates({
            type,
            value,
            defaultValue,
            onChange
        });
        const formattedValue = getFormattedDate({
            type,
            date: _value,
            locale: ctx.getLocale(locale),
            format,
            labelSeparator: ctx.getLabelSeparator(labelSeparator),
            formatter: valueFormatter
        });
        const setValue = (val) => {
            if (closeOnChange) {
                if (type === "default") {
                    dropdownHandlers.close();
                }
                if (type === "range" && val[0] && val[1]) {
                    dropdownHandlers.close();
                }
            }
            if (sortDates && type === "multiple") {
                _setValue([...val].sort((a, b) => a.getTime() - b.getTime()));
            } else {
                _setValue(val);
            }
        };
        const onClear = () => setValue(type === "range" ? [null, null] : type === "multiple" ? [] : null);
        const shouldClear = type === "range" ? !!_value[0] : type === "multiple" ? _value.length > 0 : _value !== null;
        return {
            _value,
            setValue,
            onClear,
            shouldClear,
            formattedValue,
            dropdownOpened,
            dropdownHandlers
        };
    }

    // ../esmd/npm/@mantine/dates@7.11.1/node_modules/.pnpm/@mantine+dates@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_dayjs@1.11.11_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dates/esm/components/YearPickerInput/YearPickerInput.mjs
    var defaultProps23 = {
        type: "default",
        valueFormat: "YYYY",
        closeOnChange: true,
        sortDates: true,
        dropdownType: "popover"
    };
    var YearPickerInput = core.factory(
        (_props, ref) => {
            const props = core.useProps("YearPickerInput", defaultProps23, _props);
            const {
                type,
                value,
                defaultValue,
                onChange,
                valueFormat,
                labelSeparator,
                locale,
                classNames,
                styles,
                unstyled,
                closeOnChange,
                size,
                variant,
                dropdownType,
                sortDates,
                minDate,
                maxDate,
                vars,
                valueFormatter,
                ...rest
            } = props;
            const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
                classNames,
                styles,
                props
            });
            const { calendarProps, others } = pickCalendarProps(rest);
            const ctx = useDatesContext();
            const {
                _value,
                setValue,
                formattedValue,
                dropdownHandlers,
                dropdownOpened,
                onClear,
                shouldClear
            } = useDatesInput({
                type,
                value,
                defaultValue,
                onChange,
                locale,
                format: valueFormat,
                labelSeparator,
                closeOnChange,
                sortDates,
                valueFormatter
            });
            return /* @__PURE__ */ jsxRuntime.jsx(
                PickerInputBase,
                {
                    formattedValue,
                    dropdownOpened,
                    dropdownHandlers,
                    classNames: resolvedClassNames,
                    styles: resolvedStyles,
                    unstyled,
                    ref,
                    onClear,
                    shouldClear,
                    value: _value,
                    size,
                    variant,
                    dropdownType,
                    ...others,
                    type,
                    __staticSelector: "YearPickerInput",
                    children: /* @__PURE__ */ jsxRuntime.jsx(
                        YearPicker,
                        {
                            ...calendarProps,
                            size,
                            variant,
                            type,
                            value: _value,
                            defaultDate: Array.isArray(_value) ? _value[0] || getDefaultClampedDate({ maxDate, minDate, timezone: ctx.getTimezone() }) : _value || getDefaultClampedDate({ maxDate, minDate, timezone: ctx.getTimezone() }),
                            onChange: setValue,
                            locale,
                            classNames: resolvedClassNames,
                            styles: resolvedStyles,
                            unstyled,
                            __staticSelector: "YearPickerInput",
                            __stopPropagation: dropdownType === "popover",
                            minDate,
                            maxDate,
                            date: shiftTimezone("add", calendarProps.date, ctx.getTimezone()),
                            __timezoneApplied: true
                        }
                    )
                }
            );
        }
    );
    YearPickerInput.classes = { ...PickerInputBase.classes, ...YearPicker.classes };
    YearPickerInput.displayName = "@mantine/dates/YearPickerInput";
    var defaultProps24 = {
        type: "default",
        valueFormat: "MMMM YYYY",
        closeOnChange: true,
        sortDates: true,
        dropdownType: "popover"
    };
    var MonthPickerInput = core.factory(
        (_props, ref) => {
            const props = core.useProps("MonthPickerInput", defaultProps24, _props);
            const {
                type,
                value,
                defaultValue,
                onChange,
                valueFormat,
                labelSeparator,
                locale,
                classNames,
                styles,
                unstyled,
                closeOnChange,
                size,
                variant,
                dropdownType,
                sortDates,
                minDate,
                maxDate,
                vars,
                valueFormatter,
                ...rest
            } = props;
            const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
                classNames,
                styles,
                props
            });
            const { calendarProps, others } = pickCalendarProps(rest);
            const {
                _value,
                setValue,
                formattedValue,
                dropdownHandlers,
                dropdownOpened,
                onClear,
                shouldClear
            } = useDatesInput({
                type,
                value,
                defaultValue,
                onChange,
                locale,
                format: valueFormat,
                labelSeparator,
                closeOnChange,
                sortDates,
                valueFormatter
            });
            const ctx = useDatesContext();
            return /* @__PURE__ */ jsxRuntime.jsx(
                PickerInputBase,
                {
                    formattedValue,
                    dropdownOpened,
                    dropdownHandlers,
                    classNames: resolvedClassNames,
                    styles: resolvedStyles,
                    unstyled,
                    ref,
                    onClear,
                    shouldClear,
                    value: _value,
                    size,
                    variant,
                    dropdownType,
                    ...others,
                    type,
                    __staticSelector: "MonthPickerInput",
                    children: /* @__PURE__ */ jsxRuntime.jsx(
                        MonthPicker,
                        {
                            ...calendarProps,
                            date: shiftTimezone("add", calendarProps.date, ctx.getTimezone()),
                            size,
                            variant,
                            type,
                            value: _value,
                            defaultDate: Array.isArray(_value) ? _value[0] || getDefaultClampedDate({ maxDate, minDate }) : _value || getDefaultClampedDate({ maxDate, minDate }),
                            onChange: setValue,
                            locale,
                            classNames: resolvedClassNames,
                            styles: resolvedStyles,
                            unstyled,
                            __staticSelector: "MonthPickerInput",
                            __stopPropagation: dropdownType === "popover",
                            minDate,
                            maxDate,
                            __timezoneApplied: true
                        }
                    )
                }
            );
        }
    );
    MonthPickerInput.classes = { ...PickerInputBase.classes, ...MonthPicker.classes };
    MonthPickerInput.displayName = "@mantine/dates/MonthPickerInput";
    var defaultProps25 = {
        type: "default",
        valueFormat: "MMMM D, YYYY",
        closeOnChange: true,
        sortDates: true,
        dropdownType: "popover"
    };
    var DatePickerInput = core.factory(
        (_props, ref) => {
            const props = core.useProps("DatePickerInput", defaultProps25, _props);
            const {
                type,
                value,
                defaultValue,
                onChange,
                valueFormat,
                labelSeparator,
                locale,
                classNames,
                styles,
                unstyled,
                closeOnChange,
                size,
                variant,
                dropdownType,
                sortDates,
                minDate,
                maxDate,
                vars,
                defaultDate,
                valueFormatter,
                ...rest
            } = props;
            const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
                classNames,
                styles,
                props
            });
            const { calendarProps, others } = pickCalendarProps(rest);
            const {
                _value,
                setValue,
                formattedValue,
                dropdownHandlers,
                dropdownOpened,
                onClear,
                shouldClear
            } = useDatesInput({
                type,
                value,
                defaultValue,
                onChange,
                locale,
                format: valueFormat,
                labelSeparator,
                closeOnChange,
                sortDates,
                valueFormatter
            });
            const _defaultDate = Array.isArray(_value) ? _value[0] || defaultDate : _value || defaultDate;
            const ctx = useDatesContext();
            return /* @__PURE__ */ jsxRuntime.jsx(
                PickerInputBase,
                {
                    formattedValue,
                    dropdownOpened,
                    dropdownHandlers,
                    classNames: resolvedClassNames,
                    styles: resolvedStyles,
                    unstyled,
                    ref,
                    onClear,
                    shouldClear,
                    value: _value,
                    size,
                    variant,
                    dropdownType,
                    ...others,
                    type,
                    __staticSelector: "DatePickerInput",
                    children: /* @__PURE__ */ jsxRuntime.jsx(
                        DatePicker,
                        {
                            ...calendarProps,
                            size,
                            variant,
                            type,
                            value: _value,
                            defaultDate: _defaultDate || getDefaultClampedDate({ maxDate, minDate, timezone: ctx.getTimezone() }),
                            onChange: setValue,
                            locale,
                            classNames: resolvedClassNames,
                            styles: resolvedStyles,
                            unstyled,
                            __staticSelector: "DatePickerInput",
                            __stopPropagation: dropdownType === "popover",
                            minDate,
                            maxDate,
                            date: shiftTimezone("add", calendarProps.date, ctx.getTimezone()),
                            __timezoneApplied: true
                        }
                    )
                }
            );
        }
    );
    DatePickerInput.classes = { ...PickerInputBase.classes, ...DatePicker.classes };
    DatePickerInput.displayName = "@mantine/dates/DatePickerInput";

    exports.Calendar = Calendar;
    exports.CalendarHeader = CalendarHeader;
    exports.DATES_PROVIDER_DEFAULT_SETTINGS = DATES_PROVIDER_DEFAULT_SETTINGS;
    exports.DateInput = DateInput;
    exports.DatePicker = DatePicker;
    exports.DatePickerInput = DatePickerInput;
    exports.DateTimePicker = DateTimePicker;
    exports.DatesProvider = DatesProvider;
    exports.Day = Day;
    exports.DecadeLevel = DecadeLevel;
    exports.DecadeLevelGroup = DecadeLevelGroup;
    exports.HiddenDatesInput = HiddenDatesInput;
    exports.LevelsGroup = LevelsGroup;
    exports.Month = Month;
    exports.MonthLevel = MonthLevel;
    exports.MonthLevelGroup = MonthLevelGroup;
    exports.MonthPicker = MonthPicker;
    exports.MonthPickerInput = MonthPickerInput;
    exports.MonthsList = MonthsList;
    exports.PickerControl = PickerControl;
    exports.PickerInputBase = PickerInputBase;
    exports.TimeInput = TimeInput;
    exports.WeekdaysRow = WeekdaysRow;
    exports.YearLevel = YearLevel;
    exports.YearLevelGroup = YearLevelGroup;
    exports.YearPicker = YearPicker;
    exports.YearPickerInput = YearPickerInput;
    exports.YearsList = YearsList;
    exports.assignTime = assignTime;
    exports.getDefaultClampedDate = getDefaultClampedDate;
    exports.getEndOfWeek = getEndOfWeek;
    exports.getFormattedDate = getFormattedDate;
    exports.getMonthDays = getMonthDays;
    exports.getStartOfWeek = getStartOfWeek;
    exports.handleControlKeyDown = handleControlKeyDown;
    exports.isSameMonth = isSameMonth;
    exports.pickCalendarProps = pickCalendarProps;
    exports.shiftTimezone = shiftTimezone;
    exports.useDatesContext = useDatesContext;

}));

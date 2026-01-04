(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('@mantine/core'), require('react'), require('recharts'), require('@mantine/hooks')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', '@mantine/core', 'react', 'recharts', '@mantine/hooks'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MantineCharts = {}, global.ReactJSXRuntime, global.MantineCore, global.React, global.Recharts, global.MantineHooks));
})(this, (function (exports, jsxRuntime, core, react, recharts, hooks) { 'use strict';

  function getSeriesLabels(series) {
    if (!series) {
      return {};
    }
    return series.reduce((acc, item) => {
      const matchFound = item.name.search(/\./);
      if (matchFound >= 0) {
        const key = item.name.substring(matchFound + 1);
        acc[key] = item.label;
        return acc;
      }
      acc[item.name] = item.label;
      return acc;
    }, {});
  }

  var classes = { "tooltip": "m_e4d36c9b", "tooltipLabel": "m_7f4bcb19", "tooltipBody": "m_3de554dd", "tooltipItemColor": "m_b30369b5", "tooltipItem": "m_3de8964e", "tooltipItemBody": "m_50186d10", "tooltipItemName": "m_501dadf9", "tooltipItemData": "m_50192318" };

  function updateChartTooltipPayload(payload) {
    return payload.map((item) => {
      if (!item.payload || item.payload[item.name]) {
        return item;
      }
      const matchFound = item.name.search(/\./);
      if (matchFound >= 0) {
        const newDataKey = item.name.substring(0, matchFound);
        const nestedPayload = { ...item.payload[newDataKey] };
        const shallowPayload = Object.entries(item.payload).reduce((acc, current) => {
          const [k, v] = current;
          return k === newDataKey ? acc : { ...acc, [k]: v };
        }, {});
        return {
          ...item,
          name: item.name.substring(matchFound + 1),
          payload: {
            ...shallowPayload,
            ...nestedPayload
          }
        };
      }
      return item;
    });
  }
  function getFilteredChartTooltipPayload(payload, segmentId) {
    const duplicatesFilter = updateChartTooltipPayload(
      payload.filter((item) => item.fill !== "none" || !item.color)
    );
    if (!segmentId) {
      return duplicatesFilter;
    }
    return duplicatesFilter.filter((item) => item.name === segmentId);
  }
  function getData(item, type) {
    if (type === "radial" || type === "scatter") {
      if (Array.isArray(item.value)) {
        return item.value[1] - item.value[0];
      }
      return item.value;
    }
    if (Array.isArray(item.payload[item.dataKey])) {
      return item.payload[item.dataKey][1] - item.payload[item.dataKey][0];
    }
    return item.payload[item.name];
  }
  var defaultProps = {
    type: "area",
    showColor: true
  };
  var ChartTooltip = core.factory((_props, ref) => {
    const props = core.useProps("ChartTooltip", defaultProps, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      payload,
      label,
      unit,
      type,
      segmentId,
      mod,
      series,
      valueFormatter,
      showColor,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const getStyles = core.useStyles({
      name: "ChartTooltip",
      classes,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled
    });
    if (!payload) {
      return null;
    }
    const filteredPayload = getFilteredChartTooltipPayload(payload, segmentId);
    const scatterLabel = type === "scatter" ? payload[0]?.payload?.name : null;
    const labels = getSeriesLabels(series);
    const _label = label || scatterLabel;
    const items = filteredPayload.map((item) =>  jsxRuntime.jsxs("div", { "data-type": type, ...getStyles("tooltipItem"), children: [
       jsxRuntime.jsxs("div", { ...getStyles("tooltipItemBody"), children: [
        showColor &&  jsxRuntime.jsx("svg", { ...getStyles("tooltipItemColor"), children:  jsxRuntime.jsx(
          "circle",
          {
            r: 6,
            fill: core.getThemeColor(item.color, theme),
            width: 12,
            height: 12,
            cx: 6,
            cy: 6
          }
        ) }),
         jsxRuntime.jsx("div", { ...getStyles("tooltipItemName"), children: labels[item.name] || item.name })
      ] }),
       jsxRuntime.jsxs("div", { ...getStyles("tooltipItemData"), children: [
        typeof valueFormatter === "function" ? valueFormatter(getData(item, type)) : getData(item, type),
        unit || item.unit
      ] })
    ] }, item?.key ?? item.name));
    return  jsxRuntime.jsxs(core.Box, { ...getStyles("tooltip"), mod: [{ type }, mod], ref, ...others, children: [
      _label &&  jsxRuntime.jsx("div", { ...getStyles("tooltipLabel"), children: _label }),
       jsxRuntime.jsx("div", { ...getStyles("tooltipBody"), children: items })
    ] });
  });
  ChartTooltip.displayName = "@mantine/charts/ChartTooltip";

  var classes2 = { "legend": "m_847eaf", "legendItem": "m_17da7e62", "legendItemColor": "m_6e236e21", "legendItemName": "m_8ff56c0d" };

  function updateChartLegendPayload(payload) {
    return payload.map((item) => {
      const newDataKey = item.dataKey?.split(".").pop();
      return {
        ...item,
        dataKey: newDataKey,
        payload: {
          ...item.payload,
          name: newDataKey,
          dataKey: newDataKey
        }
      };
    });
  }
  function getFilteredChartLegendPayload(payload) {
    return updateChartLegendPayload(payload.filter((item) => item.color !== "none"));
  }
  var defaultProps2 = {};
  var ChartLegend = core.factory((_props, ref) => {
    const props = core.useProps("ChartLegend", defaultProps2, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      payload,
      onHighlight,
      legendPosition,
      mod,
      series,
      showColor,
      centered,
      ...others
    } = props;
    const getStyles = core.useStyles({
      name: "ChartLegend",
      classes: classes2,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled
    });
    if (!payload) {
      return null;
    }
    const filteredPayload = getFilteredChartLegendPayload(payload);
    const labels = getSeriesLabels(series);
    const items = filteredPayload.map((item, index) =>  jsxRuntime.jsxs(
      "div",
      {
        ...getStyles("legendItem"),
        onMouseEnter: () => onHighlight(item.dataKey),
        onMouseLeave: () => onHighlight(null),
        "data-without-color": showColor === false || void 0,
        children: [
           jsxRuntime.jsx(
            core.ColorSwatch,
            {
              color: item.color,
              size: 12,
              ...getStyles("legendItemColor"),
              withShadow: false
            }
          ),
           jsxRuntime.jsx("p", { ...getStyles("legendItemName"), children: labels[item.dataKey] || item.dataKey })
        ]
      },
      index
    ));
    return  jsxRuntime.jsx(
      core.Box,
      {
        ref,
        mod: [{ position: legendPosition, centered }, mod],
        ...getStyles("legend"),
        ...others,
        children: items
      }
    );
  });
  ChartLegend.displayName = "@mantine/charts/ChartLegend";
  function PointLabel({ x, y, value }) {
    return  jsxRuntime.jsx("g", { transform: `translate(${x},${y})`, children:  jsxRuntime.jsx(
      "text",
      {
        x: 0,
        y: 0,
        dy: -8,
        dx: -10,
        textAnchor: "top",
        fill: "var(--chart-text-color, var(--mantine-color-dimmed))",
        fontSize: 8,
        children: value
      }
    ) });
  }
  function AreaGradient({ color, id, withGradient, fillOpacity }) {
    return  jsxRuntime.jsx(jsxRuntime.Fragment, { children: withGradient ?  jsxRuntime.jsxs("linearGradient", { id, x1: "0", y1: "0", x2: "0", y2: "1", children: [
       jsxRuntime.jsx("stop", { offset: "0%", stopColor: color, stopOpacity: fillOpacity }),
       jsxRuntime.jsx("stop", { offset: "100%", stopColor: color, stopOpacity: 0.01 })
    ] }) :  jsxRuntime.jsx("linearGradient", { id, x1: "0", y1: "0", x2: "0", y2: "1", children:  jsxRuntime.jsx("stop", { stopColor: color, stopOpacity: fillOpacity ?? 0.2 }) }) });
  }
  AreaGradient.displayName = "@mantine/charts/AreaGradient";
  function AreaSplit({ offset, id, colors, fillOpacity }) {
    const theme = core.useMantineTheme();
    return  jsxRuntime.jsxs("linearGradient", { id, x1: "0", y1: "0", x2: "0", y2: "1", children: [
       jsxRuntime.jsx(
        "stop",
        {
          offset,
          stopColor: core.getThemeColor(colors[0], theme),
          stopOpacity: fillOpacity ?? 0.2
        }
      ),
       jsxRuntime.jsx(
        "stop",
        {
          offset,
          stopColor: core.getThemeColor(colors[1], theme),
          stopOpacity: fillOpacity ?? 0.2
        }
      )
    ] });
  }
  AreaSplit.displayName = "@mantine/charts/AreaSplit";

  function getSplitOffset({ data, dataKey }) {
    const dataMax = Math.max(...data.map((item) => item[dataKey]));
    const dataMin = Math.min(...data.map((item) => item[dataKey]));
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
    return dataMax / (dataMax - dataMin);
  }
  function getDefaultSplitOffset({ data, series }) {
    if (series.length === 1) {
      const dataKey = series[0].name;
      return getSplitOffset({ data, dataKey });
    }
    return 0.5;
  }

  var classes3 = { "root": "m_a50f3e58", "container": "m_af9188cb", "grid": "m_a50a48bc", "axis": "m_a507a517", "axisLabel": "m_2293801d", "tooltip": "m_92b296cd" };

  function valueToPercent(value) {
    return `${(value * 100).toFixed(0)}%`;
  }
  var defaultProps3 = {
    withXAxis: true,
    withYAxis: true,
    withDots: true,
    withTooltip: true,
    connectNulls: true,
    strokeWidth: 2,
    tooltipAnimationDuration: 0,
    fillOpacity: 0.2,
    tickLine: "y",
    strokeDasharray: "5 5",
    curveType: "monotone",
    gridAxis: "x",
    type: "default",
    splitColors: ["green.7", "red.7"],
    orientation: "horizontal"
  };
  var varsResolver = core.createVarsResolver((theme, { textColor, gridColor }) => ({
    root: {
      "--chart-text-color": textColor ? core.getThemeColor(textColor, theme) : void 0,
      "--chart-grid-color": gridColor ? core.getThemeColor(gridColor, theme) : void 0
    }
  }));
  var AreaChart = core.factory((_props, ref) => {
    const props = core.useProps("AreaChart", defaultProps3, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      series,
      withGradient,
      dataKey,
      withXAxis,
      withYAxis,
      curveType,
      gridProps,
      withDots,
      tickLine,
      strokeDasharray,
      gridAxis,
      unit,
      yAxisProps,
      xAxisProps,
      dotProps,
      activeDotProps,
      strokeWidth,
      tooltipAnimationDuration,
      type,
      legendProps,
      tooltipProps,
      withLegend,
      withTooltip,
      areaChartProps,
      fillOpacity,
      splitColors,
      splitOffset,
      connectNulls,
      onMouseLeave,
      orientation,
      referenceLines,
      dir,
      valueFormatter,
      children,
      areaProps,
      xAxisLabel,
      yAxisLabel,
      withRightYAxis,
      rightYAxisLabel,
      rightYAxisProps,
      withPointLabels,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const baseId = react.useId();
    const splitId = `${baseId}-split`;
    const withXTickLine = gridAxis !== "none" && (tickLine === "x" || tickLine === "xy");
    const withYTickLine = gridAxis !== "none" && (tickLine === "y" || tickLine === "xy");
    const isAnimationActive = (tooltipAnimationDuration || 0) > 0;
    const _withGradient = typeof withGradient === "boolean" ? withGradient : type === "default";
    const stacked = type === "stacked" || type === "percent";
    const [highlightedArea, setHighlightedArea] = react.useState(null);
    const shouldHighlight = highlightedArea !== null;
    const handleMouseLeave = (event) => {
      setHighlightedArea(null);
      onMouseLeave?.(event);
    };
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const getStyles = core.useStyles({
      name: "AreaChart",
      classes: classes3,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver
    });
    const dotsAreas = series.map((item) => {
      const color = core.getThemeColor(item.color, theme);
      const dimmed = shouldHighlight && highlightedArea !== item.name;
      return  react.createElement(
        recharts.Area,
        {
          ...getStyles("area"),
          activeDot: { fill: theme.white, stroke: color, strokeWidth: 2, r: 4, ...activeDotProps },
          dot: { fill: color, fillOpacity: dimmed ? 0 : 1, strokeWidth: 2, r: 4, ...dotProps },
          key: item.name,
          name: item.name,
          type: curveType,
          dataKey: item.name,
          fill: "none",
          strokeWidth,
          stroke: "none",
          isAnimationActive: false,
          connectNulls,
          stackId: stacked ? "stack-dots" : void 0,
          yAxisId: item.yAxisId || "left",
          ...typeof areaProps === "function" ? areaProps(item) : areaProps
        }
      );
    });
    const areas = series.map((item) => {
      const id = `${baseId}-${item.color.replace(/[^a-zA-Z0-9]/g, "")}`;
      const color = core.getThemeColor(item.color, theme);
      const dimmed = shouldHighlight && highlightedArea !== item.name;
      return  jsxRuntime.jsxs(react.Fragment, { children: [
         jsxRuntime.jsx("defs", { children:  jsxRuntime.jsx(
          AreaGradient,
          {
            color,
            withGradient: _withGradient,
            id,
            fillOpacity
          }
        ) }),
         jsxRuntime.jsx(
          recharts.Area,
          {
            ...getStyles("area"),
            activeDot: false,
            dot: false,
            name: item.name,
            type: curveType,
            dataKey: item.name,
            fill: type === "split" ? `url(#${splitId})` : `url(#${id})`,
            strokeWidth,
            stroke: color,
            isAnimationActive: false,
            connectNulls,
            stackId: stacked ? "stack" : void 0,
            fillOpacity: dimmed ? 0 : 1,
            strokeOpacity: dimmed ? 0.5 : 1,
            strokeDasharray: item.strokeDasharray,
            yAxisId: item.yAxisId || "left",
            label: withPointLabels ?  jsxRuntime.jsx(PointLabel, {}) : void 0,
            ...typeof areaProps === "function" ? areaProps(item) : areaProps
          }
        )
      ] }, item.name);
    });
    const referenceLinesItems = referenceLines?.map((line, index) => {
      const color = core.getThemeColor(line.color, theme);
      return  jsxRuntime.jsx(
        recharts.ReferenceLine,
        {
          stroke: line.color ? color : "var(--chart-grid-color)",
          strokeWidth: 1,
          yAxisId: line.yAxisId || "left",
          ...line,
          label: {
            value: line.label,
            fill: line.color ? color : "currentColor",
            fontSize: 12,
            position: line.labelPosition ?? "insideBottomLeft"
          },
          ...getStyles("referenceLine")
        },
        index
      );
    });
    const tickFormatter = type === "percent" ? valueToPercent : valueFormatter;
    const sharedYAxisProps = {
      axisLine: false,
      ...orientation === "vertical" ? { dataKey, type: "category" } : { type: "number" },
      tickLine: withYTickLine ? { stroke: "currentColor" } : false,
      allowDecimals: true,
      unit,
      tickFormatter: orientation === "vertical" ? void 0 : tickFormatter,
      ...getStyles("axis")
    };
    return  jsxRuntime.jsx(
      core.Box,
      {
        ref,
        ...getStyles("root"),
        onMouseLeave: handleMouseLeave,
        dir: dir || "ltr",
        ...others,
        children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { ...getStyles("container"), children:  jsxRuntime.jsxs(
          recharts.AreaChart,
          {
            data,
            stackOffset: type === "percent" ? "expand" : void 0,
            layout: orientation,
            margin: {
              bottom: xAxisLabel ? 30 : void 0,
              left: yAxisLabel ? 10 : void 0,
              right: yAxisLabel ? 5 : void 0
            },
            ...areaChartProps,
            children: [
              referenceLinesItems,
              withLegend &&  jsxRuntime.jsx(
                recharts.Legend,
                {
                  verticalAlign: "top",
                  content: (payload) =>  jsxRuntime.jsx(
                    ChartLegend,
                    {
                      payload: payload.payload,
                      onHighlight: setHighlightedArea,
                      legendPosition: legendProps?.verticalAlign || "top",
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series
                    }
                  ),
                  ...legendProps
                }
              ),
               jsxRuntime.jsx(
                recharts.CartesianGrid,
                {
                  strokeDasharray,
                  vertical: gridAxis === "y" || gridAxis === "xy",
                  horizontal: gridAxis === "x" || gridAxis === "xy",
                  ...getStyles("grid"),
                  ...gridProps
                }
              ),
               jsxRuntime.jsxs(
                recharts.XAxis,
                {
                  hide: !withXAxis,
                  ...orientation === "vertical" ? { type: "number" } : { dataKey },
                  tick: { transform: "translate(0, 10)", fontSize: 12, fill: "currentColor" },
                  stroke: "",
                  interval: "preserveStartEnd",
                  tickLine: withXTickLine ? { stroke: "currentColor" } : false,
                  minTickGap: 5,
                  tickFormatter: orientation === "vertical" ? tickFormatter : void 0,
                  ...getStyles("axis"),
                  ...xAxisProps,
                  children: [
                    xAxisLabel &&  jsxRuntime.jsx(recharts.Label, { position: "insideBottom", offset: -20, fontSize: 12, ...getStyles("axisLabel"), children: xAxisLabel }),
                    xAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  yAxisId: "left",
                  orientation: "left",
                  tick: { transform: "translate(-10, 0)", fontSize: 12, fill: "currentColor" },
                  hide: !withYAxis,
                  ...sharedYAxisProps,
                  ...yAxisProps,
                  children: [
                    yAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideLeft",
                        angle: -90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: yAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  yAxisId: "right",
                  orientation: "right",
                  tick: { transform: "translate(10, 0)", fontSize: 12, fill: "currentColor" },
                  hide: !withRightYAxis,
                  ...sharedYAxisProps,
                  ...rightYAxisProps,
                  children: [
                    rightYAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideRight",
                        angle: 90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: rightYAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
              withTooltip &&  jsxRuntime.jsx(
                recharts.Tooltip,
                {
                  animationDuration: tooltipAnimationDuration,
                  isAnimationActive,
                  position: orientation === "vertical" ? {} : { y: 0 },
                  cursor: {
                    stroke: "var(--chart-grid-color)",
                    strokeWidth: 1,
                    strokeDasharray
                  },
                  content: ({ label, payload }) =>  jsxRuntime.jsx(
                    ChartTooltip,
                    {
                      label,
                      payload,
                      unit,
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series,
                      valueFormatter
                    }
                  ),
                  ...tooltipProps
                }
              ),
              type === "split" &&  jsxRuntime.jsx("defs", { children:  jsxRuntime.jsx(
                AreaSplit,
                {
                  colors: splitColors,
                  id: splitId,
                  offset: splitOffset ?? getDefaultSplitOffset({ data, series }),
                  fillOpacity
                }
              ) }),
              areas,
              withDots && dotsAreas,
              children
            ]
          }
        ) })
      }
    );
  });
  AreaChart.classes = classes3;
  AreaChart.displayName = "@mantine/charts/AreaChart";
  function BarLabel({
    value,
    valueFormatter,
    textBreakAll,
    parentViewBox,
    orientation,
    viewBox,
    width,
    height,
    ...others
  }) {
    return  jsxRuntime.jsx(
      "text",
      {
        ...others,
        dy: orientation === "vertical" ? height / 2 + 4 : -10,
        dx: orientation === "vertical" ? width - 30 : 0,
        fontSize: 12,
        fill: "var(--chart-bar-label-color, var(--mantine-color-dimmed))",
        children: typeof valueFormatter === "function" ? valueFormatter(value) : value
      }
    );
  }

  function valueToPercent2(value) {
    return `${(value * 100).toFixed(0)}%`;
  }
  var defaultProps4 = {
    withXAxis: true,
    withYAxis: true,
    withTooltip: true,
    tooltipAnimationDuration: 0,
    fillOpacity: 1,
    tickLine: "y",
    strokeDasharray: "5 5",
    gridAxis: "x",
    type: "default"
  };
  var varsResolver2 = core.createVarsResolver(
    (theme, { textColor, gridColor, cursorFill, barLabelColor }) => ({
      root: {
        "--chart-text-color": textColor ? core.getThemeColor(textColor, theme) : void 0,
        "--chart-grid-color": gridColor ? core.getThemeColor(gridColor, theme) : void 0,
        "--chart-cursor-fill": cursorFill ? core.getThemeColor(cursorFill, theme) : void 0,
        "--chart-bar-label-color": barLabelColor ? core.getThemeColor(barLabelColor, theme) : void 0
      }
    })
  );
  function calculateCumulativeTotal(waterfallData, dataKey) {
    let start = 0;
    let end = 0;
    return waterfallData.map((item) => {
      if (item.standalone) {
        for (const prop in item) {
          if (typeof item[prop] === "number" && prop !== dataKey) {
            item[prop] = [0, item[prop]];
          }
        }
      } else {
        for (const prop in item) {
          if (typeof item[prop] === "number" && prop !== dataKey) {
            end += item[prop];
            item[prop] = [start, end];
            start = end;
          }
        }
      }
      return item;
    });
  }
  function getBarFill(barProps, series) {
    if (typeof barProps === "function") {
      return barProps(series).fill;
    }
    return barProps?.fill;
  }
  var BarChart = core.factory((_props, ref) => {
    const props = core.useProps("BarChart", defaultProps4, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      withLegend,
      legendProps,
      series,
      onMouseLeave,
      dataKey,
      withTooltip,
      withXAxis,
      withYAxis,
      gridAxis,
      tickLine,
      xAxisProps,
      yAxisProps,
      unit,
      tooltipAnimationDuration,
      strokeDasharray,
      gridProps,
      tooltipProps,
      referenceLines,
      fillOpacity,
      barChartProps,
      type,
      orientation,
      dir,
      valueFormatter,
      children,
      barProps,
      xAxisLabel,
      yAxisLabel,
      withBarValueLabel,
      withRightYAxis,
      rightYAxisLabel,
      rightYAxisProps,
      minBarSize,
      maxBarWidth,
      mod,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const withXTickLine = gridAxis !== "none" && (tickLine === "x" || tickLine === "xy");
    const withYTickLine = gridAxis !== "none" && (tickLine === "y" || tickLine === "xy");
    const [highlightedArea, setHighlightedArea] = react.useState(null);
    const shouldHighlight = highlightedArea !== null;
    const stacked = type === "stacked" || type === "percent";
    const handleMouseLeave = (event) => {
      setHighlightedArea(null);
      onMouseLeave?.(event);
    };
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const inputData = type === "waterfall" ? calculateCumulativeTotal(data, dataKey) : data;
    const getStyles = core.useStyles({
      name: "BarChart",
      classes: classes3,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver2
    });
    const bars = series.map((item) => {
      const color = core.getThemeColor(item.color, theme);
      const dimmed = shouldHighlight && highlightedArea !== item.name;
      return  react.createElement(
        recharts.Bar,
        {
          ...getStyles("bar"),
          key: item.name,
          name: item.name,
          dataKey: item.name,
          fill: color,
          stroke: color,
          isAnimationActive: false,
          fillOpacity: dimmed ? 0.1 : fillOpacity,
          strokeOpacity: dimmed ? 0.2 : 0,
          stackId: stacked ? "stack" : item.stackId || void 0,
          label: withBarValueLabel ?  jsxRuntime.jsx(BarLabel, { valueFormatter, orientation }) : void 0,
          yAxisId: item.yAxisId || "left",
          minPointSize: minBarSize,
          ...typeof barProps === "function" ? barProps(item) : barProps
        },
        inputData.map((entry, index) =>  jsxRuntime.jsx(
          recharts.Cell,
          {
            fill: entry.color ? core.getThemeColor(entry.color, theme) : getBarFill(barProps, item) || color
          },
          `cell-${index}`
        ))
      );
    });
    const referenceLinesItems = referenceLines?.map((line, index) => {
      const color = core.getThemeColor(line.color, theme);
      return  jsxRuntime.jsx(
        recharts.ReferenceLine,
        {
          stroke: line.color ? color : "var(--chart-grid-color)",
          strokeWidth: 1,
          yAxisId: line.yAxisId || "left",
          ...line,
          label: {
            value: line.label,
            fill: line.color ? color : "currentColor",
            fontSize: 12,
            position: line.labelPosition ?? "insideBottomLeft"
          },
          ...getStyles("referenceLine")
        },
        index
      );
    });
    const tickFormatter = type === "percent" ? valueToPercent2 : valueFormatter;
    const sharedYAxisProps = {
      axisLine: false,
      ...orientation === "vertical" ? { dataKey, type: "category" } : { type: "number" },
      tickLine: withYTickLine ? { stroke: "currentColor" } : false,
      allowDecimals: true,
      unit,
      tickFormatter: orientation === "vertical" ? void 0 : tickFormatter,
      ...getStyles("axis")
    };
    return  jsxRuntime.jsx(
      core.Box,
      {
        ref,
        ...getStyles("root"),
        onMouseLeave: handleMouseLeave,
        dir: dir || "ltr",
        mod: [{ orientation }, mod],
        ...others,
        children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { ...getStyles("container"), children:  jsxRuntime.jsxs(
          recharts.BarChart,
          {
            data: inputData,
            stackOffset: type === "percent" ? "expand" : void 0,
            layout: orientation,
            maxBarSize: maxBarWidth,
            margin: {
              bottom: xAxisLabel ? 30 : void 0,
              left: yAxisLabel ? 10 : void 0,
              right: yAxisLabel ? 5 : void 0
            },
            ...barChartProps,
            children: [
              withLegend &&  jsxRuntime.jsx(
                recharts.Legend,
                {
                  verticalAlign: "top",
                  content: (payload) =>  jsxRuntime.jsx(
                    ChartLegend,
                    {
                      payload: payload.payload,
                      onHighlight: setHighlightedArea,
                      legendPosition: legendProps?.verticalAlign || "top",
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series,
                      showColor: type !== "waterfall"
                    }
                  ),
                  ...legendProps
                }
              ),
               jsxRuntime.jsxs(
                recharts.XAxis,
                {
                  hide: !withXAxis,
                  ...orientation === "vertical" ? { type: "number" } : { dataKey },
                  tick: { transform: "translate(0, 10)", fontSize: 12, fill: "currentColor" },
                  stroke: "",
                  interval: "preserveStartEnd",
                  tickLine: withXTickLine ? { stroke: "currentColor" } : false,
                  minTickGap: 5,
                  tickFormatter: orientation === "vertical" ? tickFormatter : void 0,
                  ...getStyles("axis"),
                  ...xAxisProps,
                  children: [
                    xAxisLabel &&  jsxRuntime.jsx(recharts.Label, { position: "insideBottom", offset: -20, fontSize: 12, ...getStyles("axisLabel"), children: xAxisLabel }),
                    xAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  yAxisId: "left",
                  orientation: "left",
                  tick: { transform: "translate(-10, 0)", fontSize: 12, fill: "currentColor" },
                  hide: !withYAxis,
                  ...sharedYAxisProps,
                  ...yAxisProps,
                  children: [
                    yAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideLeft",
                        angle: -90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: yAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  yAxisId: "right",
                  orientation: "right",
                  tick: { transform: "translate(10, 0)", fontSize: 12, fill: "currentColor" },
                  hide: !withRightYAxis,
                  ...sharedYAxisProps,
                  ...rightYAxisProps,
                  children: [
                    rightYAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideRight",
                        angle: 90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: rightYAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsx(
                recharts.CartesianGrid,
                {
                  strokeDasharray,
                  vertical: gridAxis === "y" || gridAxis === "xy",
                  horizontal: gridAxis === "x" || gridAxis === "xy",
                  ...getStyles("grid"),
                  ...gridProps
                }
              ),
              withTooltip &&  jsxRuntime.jsx(
                recharts.Tooltip,
                {
                  animationDuration: tooltipAnimationDuration,
                  isAnimationActive: tooltipAnimationDuration !== 0,
                  position: orientation === "vertical" ? {} : { y: 0 },
                  cursor: {
                    stroke: "var(--chart-grid-color)",
                    strokeWidth: 1,
                    strokeDasharray,
                    fill: "var(--chart-cursor-fill)"
                  },
                  content: ({ label, payload }) =>  jsxRuntime.jsx(
                    ChartTooltip,
                    {
                      label,
                      payload,
                      type: type === "waterfall" ? "scatter" : void 0,
                      unit,
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series,
                      valueFormatter
                    }
                  ),
                  ...tooltipProps
                }
              ),
              bars,
              referenceLinesItems,
              children
            ]
          }
        ) })
      }
    );
  });
  BarChart.displayName = "@mantine/charts/BarChart";
  BarChart.classes = classes3;
  var defaultProps5 = {
    withXAxis: true,
    withYAxis: true,
    withTooltip: true,
    tooltipAnimationDuration: 0,
    fillOpacity: 1,
    tickLine: "y",
    strokeDasharray: "5 5",
    gridAxis: "x",
    withDots: true,
    connectNulls: true,
    strokeWidth: 2,
    curveType: "monotone",
    gradientStops: [
      { offset: 0, color: "red" },
      { offset: 100, color: "blue" }
    ]
  };
  var varsResolver3 = core.createVarsResolver((theme, { textColor, gridColor }) => ({
    root: {
      "--chart-text-color": textColor ? core.getThemeColor(textColor, theme) : void 0,
      "--chart-grid-color": gridColor ? core.getThemeColor(gridColor, theme) : void 0
    }
  }));
  var LineChart = core.factory((_props, ref) => {
    const props = core.useProps("LineChart", defaultProps5, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      withLegend,
      legendProps,
      series,
      onMouseLeave,
      dataKey,
      withTooltip,
      withXAxis,
      withYAxis,
      gridAxis,
      tickLine,
      xAxisProps,
      yAxisProps,
      unit,
      tooltipAnimationDuration,
      strokeDasharray,
      gridProps,
      tooltipProps,
      referenceLines,
      withDots,
      dotProps,
      activeDotProps,
      strokeWidth,
      lineChartProps,
      connectNulls,
      fillOpacity,
      curveType,
      orientation,
      dir,
      valueFormatter,
      children,
      lineProps,
      xAxisLabel,
      yAxisLabel,
      type,
      gradientStops,
      withRightYAxis,
      rightYAxisLabel,
      rightYAxisProps,
      withPointLabels,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const withXTickLine = gridAxis !== "none" && (tickLine === "x" || tickLine === "xy");
    const withYTickLine = gridAxis !== "none" && (tickLine === "y" || tickLine === "xy");
    const [highlightedArea, setHighlightedArea] = react.useState(null);
    const shouldHighlight = highlightedArea !== null;
    const handleMouseLeave = (event) => {
      setHighlightedArea(null);
      onMouseLeave?.(event);
    };
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const getStyles = core.useStyles({
      name: "LineChart",
      classes: classes3,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver3
    });
    const id = hooks.useId();
    const gradientId = `line-chart-gradient-${id}`;
    const stops = gradientStops?.map((stop) =>  jsxRuntime.jsx(
      "stop",
      {
        offset: `${stop.offset}%`,
        stopColor: core.getThemeColor(stop.color, theme)
      },
      stop.color
    ));
    const lines = series.map((item) => {
      const color = core.getThemeColor(item.color, theme);
      const dimmed = shouldHighlight && highlightedArea !== item.name;
      return  react.createElement(
        recharts.Line,
        {
          ...getStyles("line"),
          key: item.name,
          name: item.name,
          dataKey: item.name,
          dot: withDots ? {
            fillOpacity: dimmed ? 0 : 1,
            strokeOpacity: dimmed ? 0 : 1,
            strokeWidth: 1,
            fill: type === "gradient" ? "var(--mantine-color-gray-7)" : color,
            stroke: type === "gradient" ? "white" : color,
            ...dotProps
          } : false,
          activeDot: withDots ? {
            fill: type === "gradient" ? "var(--mantine-color-gray-7)" : color,
            stroke: type === "gradient" ? "white" : color,
            ...activeDotProps
          } : false,
          fill: color,
          stroke: type === "gradient" ? `url(#${gradientId})` : color,
          strokeWidth,
          isAnimationActive: false,
          fillOpacity: dimmed ? 0 : fillOpacity,
          strokeOpacity: dimmed ? 0.5 : fillOpacity,
          connectNulls,
          type: curveType,
          strokeDasharray: item.strokeDasharray,
          yAxisId: item.yAxisId || "left",
          label: withPointLabels ?  jsxRuntime.jsx(PointLabel, {}) : void 0,
          ...typeof lineProps === "function" ? lineProps(item) : lineProps
        }
      );
    });
    const referenceLinesItems = referenceLines?.map((line, index) => {
      const color = core.getThemeColor(line.color, theme);
      return  jsxRuntime.jsx(
        recharts.ReferenceLine,
        {
          stroke: line.color ? color : "var(--chart-grid-color)",
          strokeWidth: 1,
          yAxisId: line.yAxisId || "left",
          ...line,
          label: {
            value: line.label,
            fill: line.color ? color : "currentColor",
            fontSize: 12,
            position: line.labelPosition ?? "insideBottomLeft"
          },
          ...getStyles("referenceLine")
        },
        index
      );
    });
    const sharedYAxisProps = {
      axisLine: false,
      ...orientation === "vertical" ? { dataKey, type: "category" } : { type: "number" },
      tickLine: withYTickLine ? { stroke: "currentColor" } : false,
      allowDecimals: true,
      unit,
      tickFormatter: orientation === "vertical" ? void 0 : valueFormatter,
      ...getStyles("axis")
    };
    return  jsxRuntime.jsx(
      core.Box,
      {
        ref,
        ...getStyles("root"),
        onMouseLeave: handleMouseLeave,
        dir: dir || "ltr",
        ...others,
        children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { ...getStyles("container"), children:  jsxRuntime.jsxs(
          recharts.LineChart,
          {
            data,
            layout: orientation,
            margin: {
              bottom: xAxisLabel ? 30 : void 0,
              left: yAxisLabel ? 10 : void 0,
              right: yAxisLabel ? 5 : void 0
            },
            ...lineChartProps,
            children: [
              type === "gradient" &&  jsxRuntime.jsx("defs", { children:  jsxRuntime.jsx("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1", children: stops }) }),
              withLegend &&  jsxRuntime.jsx(
                recharts.Legend,
                {
                  verticalAlign: "top",
                  content: (payload) =>  jsxRuntime.jsx(
                    ChartLegend,
                    {
                      payload: payload.payload,
                      onHighlight: setHighlightedArea,
                      legendPosition: legendProps?.verticalAlign || "top",
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series,
                      showColor: type !== "gradient"
                    }
                  ),
                  ...legendProps
                }
              ),
               jsxRuntime.jsxs(
                recharts.XAxis,
                {
                  hide: !withXAxis,
                  ...orientation === "vertical" ? { type: "number" } : { dataKey },
                  tick: { transform: "translate(0, 10)", fontSize: 12, fill: "currentColor" },
                  stroke: "",
                  interval: "preserveStartEnd",
                  tickLine: withXTickLine ? { stroke: "currentColor" } : false,
                  minTickGap: 5,
                  tickFormatter: orientation === "vertical" ? valueFormatter : void 0,
                  ...getStyles("axis"),
                  ...xAxisProps,
                  children: [
                    xAxisLabel &&  jsxRuntime.jsx(recharts.Label, { position: "insideBottom", offset: -20, fontSize: 12, ...getStyles("axisLabel"), children: xAxisLabel }),
                    xAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  yAxisId: "left",
                  orientation: "left",
                  tick: { transform: "translate(-10, 0)", fontSize: 12, fill: "currentColor" },
                  hide: !withYAxis,
                  ...sharedYAxisProps,
                  ...yAxisProps,
                  children: [
                    yAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideLeft",
                        angle: -90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: yAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  yAxisId: "right",
                  orientation: "right",
                  tick: { transform: "translate(10, 0)", fontSize: 12, fill: "currentColor" },
                  hide: !withRightYAxis,
                  ...sharedYAxisProps,
                  ...rightYAxisProps,
                  children: [
                    rightYAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideRight",
                        angle: 90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: rightYAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsx(
                recharts.CartesianGrid,
                {
                  strokeDasharray,
                  vertical: gridAxis === "y" || gridAxis === "xy",
                  horizontal: gridAxis === "x" || gridAxis === "xy",
                  ...getStyles("grid"),
                  ...gridProps
                }
              ),
              withTooltip &&  jsxRuntime.jsx(
                recharts.Tooltip,
                {
                  animationDuration: tooltipAnimationDuration,
                  isAnimationActive: tooltipAnimationDuration !== 0,
                  position: orientation === "vertical" ? {} : { y: 0 },
                  cursor: {
                    stroke: "var(--chart-grid-color)",
                    strokeWidth: 1,
                    strokeDasharray
                  },
                  content: ({ label, payload }) =>  jsxRuntime.jsx(
                    ChartTooltip,
                    {
                      label,
                      payload,
                      unit,
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series,
                      valueFormatter,
                      showColor: type !== "gradient"
                    }
                  ),
                  ...tooltipProps
                }
              ),
              lines,
              referenceLinesItems,
              children
            ]
          }
        ) })
      }
    );
  });
  LineChart.displayName = "@mantine/charts/LineChart";
  LineChart.classes = classes3;
  var classes4 = {};
  var defaultProps6 = {
    withGradient: true,
    connectNulls: true,
    fillOpacity: 0.6,
    strokeWidth: 2,
    curveType: "linear"
  };
  function getTrendColor(data, trendColors) {
    const first = data[0];
    const last = data[data.length - 1];
    if (first === null || last === null) {
      return trendColors.neutral || trendColors.positive;
    }
    if (first < last) {
      return trendColors.positive;
    }
    if (first > last) {
      return trendColors.negative;
    }
    return trendColors.neutral || trendColors.positive;
  }
  var varsResolver4 = core.createVarsResolver(
    (theme, { color, data, trendColors }) => ({
      root: {
        "--chart-color": trendColors ? core.getThemeColor(getTrendColor(data, trendColors), theme) : color ? core.getThemeColor(color, theme) : void 0
      }
    })
  );
  var Sparkline = core.factory((_props, ref) => {
    const props = core.useProps("Sparkline", defaultProps6, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      withGradient,
      fillOpacity,
      curveType,
      strokeWidth,
      trendColors,
      connectNulls,
      areaProps,
      ...others
    } = props;
    const getStyles = core.useStyles({
      name: "Sparkline",
      classes: classes4,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver4
    });
    const id = react.useId();
    const mappedData = react.useMemo(() => data.map((value, index) => ({ value, index })), [data]);
    return  jsxRuntime.jsx(core.Box, { ref, ...getStyles("root"), ...others, dir: "ltr", children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { children:  jsxRuntime.jsxs(recharts.AreaChart, { data: mappedData, children: [
       jsxRuntime.jsx(
        recharts.Area,
        {
          dataKey: "value",
          type: curveType,
          fill: `url(#${id})`,
          stroke: "var(--chart-color, var(--mantine-color-blue-filled))",
          isAnimationActive: false,
          connectNulls,
          strokeWidth,
          fillOpacity: 1,
          ...areaProps
        }
      ),
       jsxRuntime.jsx("defs", { children:  jsxRuntime.jsx(
        AreaGradient,
        {
          id,
          color: "var(--chart-color, var(--mantine-color-blue-filled))",
          fillOpacity,
          withGradient
        }
      ) })
    ] }) }) });
  });
  Sparkline.displayName = "@mantine/charts/Sparkline";
  Sparkline.classes = classes4;

  var classes5 = { "root": "m_a410e613", "label": "m_ddb0bfe3" };

  var defaultProps7 = {
    withTooltip: true,
    withLabelsLine: true,
    paddingAngle: 0,
    thickness: 20,
    size: 160,
    strokeWidth: 1,
    startAngle: 0,
    endAngle: 360,
    tooltipDataSource: "all"
  };
  var varsResolver5 = core.createVarsResolver(
    (theme, { strokeColor, labelColor, withLabels, size }) => ({
      root: {
        "--chart-stroke-color": strokeColor ? core.getThemeColor(strokeColor, theme) : void 0,
        "--chart-labels-color": labelColor ? core.getThemeColor(labelColor, theme) : void 0,
        "--chart-size": withLabels ? core.rem(size + 80) : core.rem(size)
      }
    })
  );
  var DonutChart = core.factory((_props, ref) => {
    const props = core.useProps("DonutChart", defaultProps7, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      withTooltip,
      tooltipAnimationDuration,
      tooltipProps,
      pieProps,
      paddingAngle,
      withLabels,
      withLabelsLine,
      size,
      thickness,
      strokeWidth,
      startAngle,
      endAngle,
      tooltipDataSource,
      chartLabel,
      children,
      pieChartProps,
      valueFormatter,
      strokeColor,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const getStyles = core.useStyles({
      name: "DonutChart",
      classes: classes5,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver5
    });
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const cells = data.map((item, index) =>  jsxRuntime.jsx(
      recharts.Cell,
      {
        fill: core.getThemeColor(item.color, theme),
        stroke: "var(--chart-stroke-color, var(--mantine-color-body))",
        strokeWidth
      },
      index
    ));
    return  jsxRuntime.jsx(core.Box, { ref, size, ...getStyles("root"), ...others, children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { children:  jsxRuntime.jsxs(recharts.PieChart, { ...pieChartProps, children: [
       jsxRuntime.jsx(
        recharts.Pie,
        {
          data,
          innerRadius: size / 2 - thickness,
          outerRadius: size / 2,
          dataKey: "value",
          isAnimationActive: false,
          paddingAngle,
          startAngle,
          endAngle,
          label: withLabels ? {
            fill: "var(--chart-labels-color, var(--mantine-color-dimmed))",
            fontSize: 12,
            fontFamily: "var(--mantine-font-family)"
          } : false,
          labelLine: withLabelsLine ? {
            stroke: "var(--chart-label-color, var(--mantine-color-dimmed))",
            strokeWidth: 1
          } : false,
          ...pieProps,
          children: cells
        }
      ),
      chartLabel &&  jsxRuntime.jsx(
        "text",
        {
          x: "50%",
          y: "50%",
          textAnchor: "middle",
          dominantBaseline: "middle",
          ...getStyles("label"),
          children: chartLabel
        }
      ),
      withTooltip &&  jsxRuntime.jsx(
        recharts.Tooltip,
        {
          animationDuration: tooltipAnimationDuration,
          isAnimationActive: false,
          content: ({ payload }) =>  jsxRuntime.jsx(
            ChartTooltip,
            {
              payload: data,
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              type: "radial",
              segmentId: tooltipDataSource === "segment" ? payload?.[0]?.name : void 0,
              valueFormatter
            }
          ),
          ...tooltipProps
        }
      ),
      children
    ] }) }) });
  });
  DonutChart.displayName = "@mantine/charts/DonutChart";
  DonutChart.classes = classes5;

  var classes6 = { "root": "m_cd8943fd" };

  var defaultProps8 = {
    withTooltip: false,
    withLabelsLine: true,
    paddingAngle: 0,
    size: 160,
    strokeWidth: 1,
    startAngle: 0,
    endAngle: 360,
    tooltipDataSource: "all",
    labelsPosition: "outside",
    labelsType: "value"
  };
  var varsResolver6 = core.createVarsResolver(
    (theme, { strokeColor, labelColor, withLabels, size, labelsPosition }) => ({
      root: {
        "--chart-stroke-color": strokeColor ? core.getThemeColor(strokeColor, theme) : void 0,
        "--chart-labels-color": labelColor ? core.getThemeColor(labelColor, theme) : void 0,
        "--chart-size": withLabels && labelsPosition === "outside" ? core.rem(size + 80) : core.rem(size)
      }
    })
  );
  var getLabelValue = (labelsType, value, percent, valueFormatter) => {
    if (labelsType === "percent") {
      return `${(percent * 100).toFixed(0)}%`;
    }
    if (typeof valueFormatter === "function") {
      return valueFormatter(value);
    }
    return value;
  };
  var getInsideLabel = (labelsType, valueFormatter) => ({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return  jsxRuntime.jsx(
      "text",
      {
        x,
        y,
        textAnchor: x > cx ? "start" : "end",
        dominantBaseline: "central",
        className: classes6.label,
        children: getLabelValue(labelsType, value, percent, valueFormatter)
      }
    );
  };
  var getOutsideLabel = (labelsType, valueFormatter) => ({ x, y, cx, cy, percent, value }) =>  jsxRuntime.jsx(
    "text",
    {
      x,
      y,
      cx,
      cy,
      textAnchor: x > cx ? "start" : "end",
      fill: "var(--chart-labels-color, var(--mantine-color-dimmed))",
      fontFamily: "var(--mantine-font-family)",
      fontSize: 12,
      children:  jsxRuntime.jsx("tspan", { x, children: getLabelValue(labelsType, value, percent, valueFormatter) })
    }
  );
  var PieChart2 = core.factory((_props, ref) => {
    const props = core.useProps("PieChart", defaultProps8, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      withTooltip,
      tooltipAnimationDuration,
      tooltipProps,
      pieProps,
      paddingAngle,
      withLabels,
      withLabelsLine,
      size,
      strokeWidth,
      startAngle,
      endAngle,
      tooltipDataSource,
      children,
      pieChartProps,
      labelsPosition,
      valueFormatter,
      labelsType,
      strokeColor,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const getStyles = core.useStyles({
      name: "PieChart",
      classes: classes6,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver6
    });
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const cells = data.map((item, index) =>  jsxRuntime.jsx(
      recharts.Cell,
      {
        fill: core.getThemeColor(item.color, theme),
        stroke: "var(--chart-stroke-color, var(--mantine-color-body))",
        strokeWidth
      },
      index
    ));
    return  jsxRuntime.jsx(core.Box, { ref, size, ...getStyles("root"), ...others, children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { children:  jsxRuntime.jsxs(recharts.PieChart, { ...pieChartProps, children: [
       jsxRuntime.jsx(
        recharts.Pie,
        {
          data,
          innerRadius: 0,
          outerRadius: size / 2,
          dataKey: "value",
          isAnimationActive: false,
          paddingAngle,
          startAngle,
          endAngle,
          label: withLabels ? labelsPosition === "inside" ? getInsideLabel(labelsType || "value", valueFormatter) : getOutsideLabel(labelsType || "value", valueFormatter) : false,
          labelLine: withLabelsLine && labelsPosition === "outside" ? {
            stroke: "var(--chart-label-color, var(--mantine-color-dimmed))",
            strokeWidth: 1
          } : false,
          ...pieProps,
          children: cells
        }
      ),
      withTooltip &&  jsxRuntime.jsx(
        recharts.Tooltip,
        {
          animationDuration: tooltipAnimationDuration,
          isAnimationActive: false,
          content: ({ payload }) =>  jsxRuntime.jsx(
            ChartTooltip,
            {
              payload: data,
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              type: "radial",
              segmentId: tooltipDataSource === "segment" ? payload?.[0]?.name : void 0,
              valueFormatter
            }
          ),
          ...tooltipProps
        }
      ),
      children
    ] }) }) });
  });
  PieChart2.displayName = "@mantine/charts/PieChart";
  PieChart2.classes = classes6;

  var classes7 = { "root": "m_1f271cf7", "container": "m_cf06f58c" };

  var defaultProps9 = {
    withPolarGrid: true,
    withPolarAngleAxis: true,
    withPolarRadiusAxis: false
  };
  var varsResolver7 = core.createVarsResolver((theme, { gridColor, textColor }) => ({
    root: {
      "--chart-grid-color": gridColor ? core.getThemeColor(gridColor, theme) : void 0,
      "--chart-text-color": textColor ? core.getThemeColor(textColor, theme) : void 0
    }
  }));
  var RadarChart = core.factory((_props, ref) => {
    const props = core.useProps("RadarChart", defaultProps9, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      series,
      dataKey,
      gridColor,
      textColor,
      radarProps,
      radarChartProps,
      polarGridProps,
      polarAngleAxisProps,
      polarRadiusAxisProps,
      withPolarGrid,
      withPolarAngleAxis,
      withPolarRadiusAxis,
      children,
      withLegend,
      legendProps,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const getStyles = core.useStyles({
      name: "RadarChart",
      classes: classes7,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver7
    });
    const [highlightedArea, setHighlightedArea] = react.useState(null);
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const radars = series.map((item, index) =>  jsxRuntime.jsx(
      recharts.Radar,
      {
        name: item.name,
        dataKey: item.name,
        stroke: core.getThemeColor(item.strokeColor || item.color, theme),
        fill: core.getThemeColor(item.color, theme),
        fillOpacity: highlightedArea ? highlightedArea === item.name ? item.opacity || 0.4 : 0.05 : item.opacity || 0.4,
        strokeOpacity: highlightedArea ? highlightedArea === item.name ? 1 : 0.1 : 1,
        isAnimationActive: false,
        ...typeof radarProps === "function" ? radarProps(item) : radarProps
      },
      index
    ));
    return  jsxRuntime.jsx(core.Box, { ref, ...getStyles("root"), ...others, children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { ...getStyles("container"), children:  jsxRuntime.jsxs(recharts.RadarChart, { data, ...radarChartProps, children: [
      withPolarGrid &&  jsxRuntime.jsx(recharts.PolarGrid, { stroke: "var(--chart-grid-color)", ...polarGridProps }),
      withPolarAngleAxis &&  jsxRuntime.jsx(recharts.PolarAngleAxis, { dataKey, ...polarAngleAxisProps }),
      withPolarRadiusAxis &&  jsxRuntime.jsx(recharts.PolarRadiusAxis, { stroke: "var(--chart-grid-color)", ...polarRadiusAxisProps }),
      radars,
      withLegend &&  jsxRuntime.jsx(
        recharts.Legend,
        {
          verticalAlign: "bottom",
          content: (payload) =>  jsxRuntime.jsx(
            ChartLegend,
            {
              payload: payload.payload,
              onHighlight: setHighlightedArea,
              legendPosition: legendProps?.verticalAlign || "bottom",
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              series,
              centered: true
            }
          ),
          ...legendProps
        }
      ),
      children
    ] }) }) });
  });
  RadarChart.displayName = "@mantine/charts/RadarChart";
  RadarChart.classes = classes7;
  function getAxis(key, dataKey) {
    return key === dataKey.x ? "x" : "y";
  }
  var defaultProps10 = {
    withXAxis: true,
    withYAxis: true,
    withTooltip: true,
    tooltipAnimationDuration: 0,
    tickLine: "y",
    strokeDasharray: "5 5",
    gridAxis: "x"
  };
  var varsResolver8 = core.createVarsResolver((theme, { textColor, gridColor }) => ({
    root: {
      "--chart-text-color": textColor ? core.getThemeColor(textColor, theme) : void 0,
      "--chart-grid-color": gridColor ? core.getThemeColor(gridColor, theme) : void 0
    }
  }));
  var ScatterChart = core.factory((_props, ref) => {
    const props = core.useProps("ScatterChart", defaultProps10, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      referenceLines,
      dir,
      withLegend,
      withTooltip,
      withXAxis,
      withYAxis,
      xAxisProps,
      yAxisProps,
      orientation,
      scatterChartProps,
      legendProps,
      data,
      gridAxis,
      tickLine,
      strokeDasharray,
      gridProps,
      tooltipAnimationDuration,
      tooltipProps,
      children,
      onMouseLeave,
      dataKey,
      textColor,
      gridColor,
      xAxisLabel,
      yAxisLabel,
      unit,
      labels,
      valueFormatter,
      scatterProps,
      pointLabels,
      ...others
    } = props;
    const getFormatter = (axis) => typeof valueFormatter === "function" ? valueFormatter : valueFormatter?.[axis];
    const xFormatter = getFormatter("x");
    const yFormatter = getFormatter("y");
    const theme = core.useMantineTheme();
    const mappedData = data.map((item) => ({
      ...item,
      data: item.data.map((point) => ({ ...point, name: item.name }))
    }));
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const getStyles = core.useStyles({
      name: "ScatterChart",
      classes: classes3,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver8
    });
    const withXTickLine = gridAxis !== "none" && (tickLine === "x" || tickLine === "xy");
    const withYTickLine = gridAxis !== "none" && (tickLine === "y" || tickLine === "xy");
    const [highlightedArea, setHighlightedArea] = react.useState(null);
    const shouldHighlight = highlightedArea !== null;
    const handleMouseLeave = (event) => {
      setHighlightedArea(null);
      onMouseLeave?.(event);
    };
    const referenceLinesItems = referenceLines?.map((line, index) => {
      const color = core.getThemeColor(line.color, theme);
      return  jsxRuntime.jsx(
        recharts.ReferenceLine,
        {
          stroke: line.color ? color : "var(--chart-grid-color)",
          strokeWidth: 1,
          ...line,
          label: {
            value: line.label,
            fill: line.color ? color : "currentColor",
            fontSize: 12,
            position: line.labelPosition ?? "insideBottomLeft"
          },
          ...getStyles("referenceLine")
        },
        index
      );
    });
    const scatters = mappedData.map((item, index) => {
      const dimmed = shouldHighlight && highlightedArea !== item.name;
      return  jsxRuntime.jsxs(
        recharts.Scatter,
        {
          data: item.data,
          fill: core.getThemeColor(item.color, theme),
          isAnimationActive: false,
          fillOpacity: dimmed ? 0.1 : 1,
          ...scatterProps,
          children: [
            pointLabels &&  jsxRuntime.jsx(recharts.LabelList, { dataKey: dataKey[pointLabels], fontSize: 8, dy: 10 }),
            scatterProps?.children
          ]
        },
        index
      );
    });
    return  jsxRuntime.jsx(
      core.Box,
      {
        ref,
        ...getStyles("root"),
        onMouseLeave: handleMouseLeave,
        dir: dir || "ltr",
        ...others,
        children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { ...getStyles("container"), children:  jsxRuntime.jsxs(
          recharts.ScatterChart,
          {
            margin: {
              bottom: xAxisLabel ? 30 : void 0,
              left: yAxisLabel ? 10 : void 0,
              right: yAxisLabel ? 5 : void 0
            },
            ...scatterChartProps,
            children: [
               jsxRuntime.jsx(
                recharts.CartesianGrid,
                {
                  strokeDasharray,
                  vertical: gridAxis === "y" || gridAxis === "xy",
                  horizontal: gridAxis === "x" || gridAxis === "xy",
                  ...getStyles("grid"),
                  ...gridProps
                }
              ),
               jsxRuntime.jsxs(
                recharts.XAxis,
                {
                  type: "number",
                  hide: !withXAxis,
                  dataKey: dataKey.x,
                  tick: { transform: "translate(0, 10)", fontSize: 12, fill: "currentColor" },
                  stroke: "",
                  interval: "preserveStartEnd",
                  tickLine: withXTickLine ? { stroke: "currentColor" } : false,
                  minTickGap: 5,
                  unit: unit?.x,
                  tickFormatter: xFormatter,
                  ...getStyles("axis"),
                  ...xAxisProps,
                  children: [
                    xAxisLabel &&  jsxRuntime.jsx(recharts.Label, { position: "insideBottom", offset: -20, fontSize: 12, ...getStyles("axisLabel"), children: xAxisLabel }),
                    xAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  type: "number",
                  hide: !withYAxis,
                  axisLine: false,
                  dataKey: dataKey.y,
                  tickLine: withYTickLine ? { stroke: "currentColor" } : false,
                  tick: { transform: "translate(-10, 0)", fontSize: 12, fill: "currentColor" },
                  allowDecimals: true,
                  unit: unit?.y,
                  tickFormatter: yFormatter,
                  ...getStyles("axis"),
                  ...yAxisProps,
                  children: [
                    yAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideLeft",
                        angle: -90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: yAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
              withTooltip &&  jsxRuntime.jsx(
                recharts.Tooltip,
                {
                  animationDuration: tooltipAnimationDuration,
                  isAnimationActive: tooltipAnimationDuration !== 0,
                  position: { y: 0 },
                  cursor: {
                    stroke: "var(--chart-grid-color)",
                    strokeWidth: 1,
                    strokeDasharray
                  },
                  content: ({ label, payload }) =>  jsxRuntime.jsx(
                    ChartTooltip,
                    {
                      type: "scatter",
                      label,
                      payload: labels ? payload?.map((item) => ({
                        ...item,
                        name: labels[getAxis(item.name, dataKey)] || item.name,
                        value: getFormatter(getAxis(item.name, dataKey))?.(item.value) ?? item.value
                      })) : payload?.map((item) => ({
                        ...item,
                        value: getFormatter(getAxis(item.name, dataKey))?.(item.value) ?? item.value
                      })),
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series: data
                    }
                  ),
                  ...tooltipProps
                }
              ),
              withLegend &&  jsxRuntime.jsx(
                recharts.Legend,
                {
                  verticalAlign: "top",
                  content: (payload) =>  jsxRuntime.jsx(
                    ChartLegend,
                    {
                      payload: payload.payload?.map((item, index) => ({
                        ...item,
                        dataKey: data[index].name
                      })),
                      onHighlight: setHighlightedArea,
                      legendPosition: legendProps?.verticalAlign || "top",
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series: data
                    }
                  ),
                  height: 44,
                  ...legendProps
                }
              ),
              referenceLinesItems,
              scatters
            ]
          }
        ) })
      }
    );
  });
  ScatterChart.displayName = "@mantine/charts/ScatterChart";
  ScatterChart.classes = classes3;
  function getDomain(data, key) {
    const values = data.map((item) => item[key]);
    return [Math.min(...values), Math.max(...values)];
  }
  function BubbleChartTooltip({
    active,
    payload,
    getStyles,
    dataKey,
    valueFormatter
  }) {
    if (active && payload && payload.length) {
      const data = payload[0] && payload[0].payload;
      return  jsxRuntime.jsx("div", { ...getStyles("tooltip"), children:  jsxRuntime.jsxs(core.Group, { justify: "space-between", children: [
         jsxRuntime.jsx(core.Text, { fz: "sm", children: data[dataKey.x] }),
         jsxRuntime.jsx(core.Text, { fz: "sm", children: valueFormatter ? valueFormatter(data[dataKey.z]) : data[dataKey.z] })
      ] }) });
    }
    return null;
  }
  var defaultProps11 = {
    color: "blue.6",
    withTooltip: true
  };
  var varsResolver9 = core.createVarsResolver((theme, { textColor, gridColor }) => ({
    root: {
      "--chart-text-color": textColor ? core.getThemeColor(textColor, theme) : void 0,
      "--chart-grid-color": gridColor ? core.getThemeColor(gridColor, theme) : void 0
    }
  }));
  var BubbleChart = core.factory((_props, ref) => {
    const props = core.useProps("BubbleChart", defaultProps11, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      xAxisProps,
      yAxisProps,
      zAxisProps,
      tooltipProps,
      scatterProps,
      color,
      label,
      withTooltip,
      dataKey,
      range,
      valueFormatter,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const getStyles = core.useStyles({
      name: "BubbleChart",
      classes: classes3,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver9
    });
    return  jsxRuntime.jsx(core.Box, { ref, ...getStyles("root"), ...others, children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { children:  jsxRuntime.jsxs(recharts.ScatterChart, { children: [
       jsxRuntime.jsx(
        recharts.XAxis,
        {
          type: "category",
          dataKey: dataKey.x,
          interval: 0,
          tick: { fontSize: 12, fill: "currentColor" },
          tickLine: { transform: "translate(0, -6)", stroke: "currentColor" },
          stroke: "currentColor",
          ...getStyles("axis"),
          ...xAxisProps
        }
      ),
       jsxRuntime.jsx(
        recharts.YAxis,
        {
          type: "number",
          dataKey: dataKey.y,
          height: 10,
          width: label ? void 0 : 0,
          tick: false,
          tickLine: false,
          axisLine: false,
          label: { value: label, position: "insideRight", fontSize: 12, fill: "currentColor" },
          ...getStyles("axis"),
          ...yAxisProps
        }
      ),
       jsxRuntime.jsx(
        recharts.ZAxis,
        {
          type: "number",
          dataKey: dataKey.z,
          domain: getDomain(data, dataKey.z),
          range,
          ...zAxisProps
        }
      ),
      withTooltip &&  jsxRuntime.jsx(
        recharts.Tooltip,
        {
          animationDuration: 100,
          isAnimationActive: false,
          cursor: { stroke: "var(--chart-grid-color)", strokeWidth: 1, strokeDasharray: "3 3" },
          content: (payload) =>  jsxRuntime.jsx(
            BubbleChartTooltip,
            {
              dataKey,
              active: payload.active,
              payload: payload.payload,
              getStyles,
              valueFormatter
            }
          ),
          ...tooltipProps
        }
      ),
       jsxRuntime.jsx(
        recharts.Scatter,
        {
          data,
          fill: core.getThemeColor(color, theme),
          isAnimationActive: false,
          ...scatterProps
        }
      )
    ] }) }) });
  });
  BubbleChart.displayName = "@mantine/charts/BubbleChart";
  BubbleChart.classes = classes3;
  var defaultProps12 = {
    withXAxis: true,
    withYAxis: true,
    withTooltip: true,
    tooltipAnimationDuration: 0,
    tickLine: "y",
    strokeDasharray: "5 5",
    gridAxis: "x",
    withDots: true,
    connectNulls: true,
    strokeWidth: 2,
    curveType: "monotone"
  };
  var varsResolver10 = core.createVarsResolver(
    (theme, { textColor, gridColor }) => ({
      root: {
        "--chart-text-color": textColor ? core.getThemeColor(textColor, theme) : void 0,
        "--chart-grid-color": gridColor ? core.getThemeColor(gridColor, theme) : void 0
      }
    })
  );
  var CompositeChart = core.factory((_props, ref) => {
    const props = core.useProps("CompositeChart", defaultProps12, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      withLegend,
      legendProps,
      series,
      onMouseLeave,
      dataKey,
      withTooltip,
      withXAxis,
      withYAxis,
      gridAxis,
      tickLine,
      xAxisProps,
      yAxisProps,
      unit,
      tooltipAnimationDuration,
      strokeDasharray,
      gridProps,
      tooltipProps,
      referenceLines,
      withDots,
      dotProps,
      activeDotProps,
      strokeWidth,
      connectNulls,
      curveType,
      dir,
      valueFormatter,
      children,
      lineProps,
      xAxisLabel,
      yAxisLabel,
      withRightYAxis,
      rightYAxisLabel,
      rightYAxisProps,
      withPointLabels,
      areaProps,
      barProps,
      withBarValueLabel,
      minBarSize,
      maxBarWidth,
      composedChartProps,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const withXTickLine = gridAxis !== "none" && (tickLine === "x" || tickLine === "xy");
    const withYTickLine = gridAxis !== "none" && (tickLine === "y" || tickLine === "xy");
    const [highlightedArea, setHighlightedArea] = react.useState(null);
    const shouldHighlight = highlightedArea !== null;
    const handleMouseLeave = (event) => {
      setHighlightedArea(null);
      onMouseLeave?.(event);
    };
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const getStyles = core.useStyles({
      name: "CompositeChart",
      classes: classes3,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver10
    });
    const lines = series.map((item) => {
      const color = core.getThemeColor(item.color, theme);
      const dimmed = shouldHighlight && highlightedArea !== item.name;
      if (item.type === "line") {
        return  react.createElement(
          recharts.Line,
          {
            ...getStyles("line"),
            key: item.name,
            name: item.name,
            dataKey: item.name,
            dot: withDots ? {
              fillOpacity: dimmed ? 0 : 1,
              strokeOpacity: dimmed ? 0 : 1,
              strokeWidth: 1,
              fill: color,
              stroke: color,
              ...dotProps
            } : false,
            activeDot: withDots ? { fill: "var(--mantine-color-white)", stroke: color, ...activeDotProps } : false,
            fill: color,
            stroke: color,
            strokeWidth,
            isAnimationActive: false,
            fillOpacity: dimmed ? 0 : 1,
            strokeOpacity: dimmed ? 0.5 : 1,
            connectNulls,
            type: curveType,
            strokeDasharray: item.strokeDasharray,
            yAxisId: item.yAxisId || "left",
            label: withPointLabels ?  jsxRuntime.jsx(PointLabel, {}) : void 0,
            ...typeof lineProps === "function" ? lineProps(item) : lineProps
          }
        );
      }
      if (item.type === "area") {
        return  react.createElement(
          recharts.Area,
          {
            ...getStyles("area"),
            key: item.name,
            name: item.name,
            type: curveType,
            dataKey: item.name,
            fill: color,
            strokeWidth,
            stroke: color,
            isAnimationActive: false,
            connectNulls,
            dot: withDots ? {
              fillOpacity: dimmed ? 0 : 1,
              strokeOpacity: dimmed ? 0 : 1,
              strokeWidth: 1,
              fill: color,
              stroke: color,
              ...dotProps
            } : false,
            activeDot: withDots ? {
              fill: theme.white,
              stroke: color,
              strokeWidth: 2,
              r: 4,
              ...activeDotProps
            } : false,
            fillOpacity: dimmed ? 0 : 0.2,
            strokeOpacity: dimmed ? 0.5 : 1,
            strokeDasharray: item.strokeDasharray,
            yAxisId: item.yAxisId || "left",
            label: withPointLabels ?  jsxRuntime.jsx(PointLabel, {}) : void 0,
            ...typeof areaProps === "function" ? areaProps(item) : areaProps
          }
        );
      }
      if (item.type === "bar") {
        return  react.createElement(
          recharts.Bar,
          {
            ...getStyles("bar"),
            key: item.name,
            name: item.name,
            dataKey: item.name,
            fill: color,
            stroke: color,
            isAnimationActive: false,
            fillOpacity: dimmed ? 0.1 : 1,
            strokeOpacity: dimmed ? 0.2 : 0,
            label: withBarValueLabel ?  jsxRuntime.jsx(BarLabel, { valueFormatter }) : void 0,
            yAxisId: item.yAxisId || "left",
            minPointSize: minBarSize,
            ...typeof barProps === "function" ? barProps(item) : barProps
          }
        );
      }
      return null;
    });
    const referenceLinesItems = referenceLines?.map((line, index) => {
      const color = core.getThemeColor(line.color, theme);
      return  jsxRuntime.jsx(
        recharts.ReferenceLine,
        {
          stroke: line.color ? color : "var(--chart-grid-color)",
          strokeWidth: 1,
          yAxisId: line.yAxisId || "left",
          ...line,
          label: {
            value: line.label,
            fill: line.color ? color : "currentColor",
            fontSize: 12,
            position: line.labelPosition ?? "insideBottomLeft"
          },
          ...getStyles("referenceLine")
        },
        index
      );
    });
    const sharedYAxisProps = {
      axisLine: false,
      type: "number",
      tickLine: withYTickLine ? { stroke: "currentColor" } : false,
      allowDecimals: true,
      unit,
      tickFormatter: valueFormatter,
      ...getStyles("axis")
    };
    return  jsxRuntime.jsx(
      core.Box,
      {
        ref,
        ...getStyles("root"),
        onMouseLeave: handleMouseLeave,
        dir: dir || "ltr",
        ...others,
        children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { ...getStyles("container"), children:  jsxRuntime.jsxs(
          recharts.ComposedChart,
          {
            data,
            maxBarSize: maxBarWidth,
            margin: {
              bottom: xAxisLabel ? 30 : void 0,
              left: yAxisLabel ? 10 : void 0,
              right: yAxisLabel ? 5 : void 0
            },
            ...composedChartProps,
            children: [
              withLegend &&  jsxRuntime.jsx(
                recharts.Legend,
                {
                  verticalAlign: "top",
                  content: (payload) =>  jsxRuntime.jsx(
                    ChartLegend,
                    {
                      payload: payload.payload,
                      onHighlight: setHighlightedArea,
                      legendPosition: legendProps?.verticalAlign || "top",
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series
                    }
                  ),
                  ...legendProps
                }
              ),
               jsxRuntime.jsxs(
                recharts.XAxis,
                {
                  hide: !withXAxis,
                  dataKey,
                  tick: { transform: "translate(0, 10)", fontSize: 12, fill: "currentColor" },
                  stroke: "",
                  interval: "preserveStartEnd",
                  tickLine: withXTickLine ? { stroke: "currentColor" } : false,
                  minTickGap: 5,
                  ...getStyles("axis"),
                  ...xAxisProps,
                  children: [
                    xAxisLabel &&  jsxRuntime.jsx(recharts.Label, { position: "insideBottom", offset: -20, fontSize: 12, ...getStyles("axisLabel"), children: xAxisLabel }),
                    xAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  yAxisId: "left",
                  orientation: "left",
                  tick: { transform: "translate(-10, 0)", fontSize: 12, fill: "currentColor" },
                  hide: !withYAxis,
                  ...sharedYAxisProps,
                  ...yAxisProps,
                  children: [
                    yAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideLeft",
                        angle: -90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: yAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsxs(
                recharts.YAxis,
                {
                  yAxisId: "right",
                  orientation: "right",
                  tick: { transform: "translate(10, 0)", fontSize: 12, fill: "currentColor" },
                  hide: !withRightYAxis,
                  ...sharedYAxisProps,
                  ...rightYAxisProps,
                  children: [
                    rightYAxisLabel &&  jsxRuntime.jsx(
                      recharts.Label,
                      {
                        position: "insideRight",
                        angle: 90,
                        textAnchor: "middle",
                        fontSize: 12,
                        offset: -5,
                        ...getStyles("axisLabel"),
                        children: rightYAxisLabel
                      }
                    ),
                    yAxisProps?.children
                  ]
                }
              ),
               jsxRuntime.jsx(
                recharts.CartesianGrid,
                {
                  strokeDasharray,
                  vertical: gridAxis === "y" || gridAxis === "xy",
                  horizontal: gridAxis === "x" || gridAxis === "xy",
                  ...getStyles("grid"),
                  ...gridProps
                }
              ),
              withTooltip &&  jsxRuntime.jsx(
                recharts.Tooltip,
                {
                  animationDuration: tooltipAnimationDuration,
                  isAnimationActive: tooltipAnimationDuration !== 0,
                  position: { y: 0 },
                  cursor: {
                    stroke: "var(--chart-grid-color)",
                    strokeWidth: 1,
                    strokeDasharray
                  },
                  content: ({ label, payload }) =>  jsxRuntime.jsx(
                    ChartTooltip,
                    {
                      label,
                      payload,
                      unit,
                      classNames: resolvedClassNames,
                      styles: resolvedStyles,
                      series,
                      valueFormatter
                    }
                  ),
                  ...tooltipProps
                }
              ),
              lines,
              referenceLinesItems,
              children
            ]
          }
        ) })
      }
    );
  });
  CompositeChart.displayName = "@mantine/charts/CompositeChart";
  CompositeChart.classes = classes3;

  var classes8 = { "root": "m_cd2bd9e5", "tooltip": "m_6bcc3420" };

  var defaultProps13 = {
    barSize: 20,
    startAngle: 90,
    endAngle: -270,
    withBackground: true,
    withTooltip: true
  };
  var varsResolver11 = core.createVarsResolver(
    (theme, { emptyBackgroundColor }) => ({
      root: {
        "--chart-empty-background": emptyBackgroundColor ? core.getThemeColor(emptyBackgroundColor, theme) : void 0
      }
    })
  );
  var RadialBarChart = core.factory((_props, ref) => {
    const props = core.useProps("RadialBarChart", defaultProps13, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      barSize,
      withBackground,
      dataKey,
      radialBarProps,
      radialBarChartProps,
      withLabels,
      withLegend,
      legendProps,
      withTooltip,
      tooltipProps,
      startAngle,
      endAngle,
      ...others
    } = props;
    const [highlightedArea, setHighlightedArea] = react.useState(null);
    const getStyles = core.useStyles({
      name: "RadialBarChart",
      classes: classes8,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver11
    });
    const theme = core.useMantineTheme();
    const dataWithResolvedColor = data.map(({ color, ...item }) => {
      const resolvedColor = core.getThemeColor(color, theme);
      return {
        ...item,
        fill: resolvedColor,
        fillOpacity: highlightedArea ? highlightedArea === item.name ? item.opacity || 1 : 0.05 : item.opacity || 1
      };
    });
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    return  jsxRuntime.jsx(core.Box, { ref, ...getStyles("root"), ...others, children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { children:  jsxRuntime.jsxs(
      recharts.RadialBarChart,
      {
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
        innerRadius: "10%",
        outerRadius: "100%",
        cx: "50%",
        cy: "50%",
        barSize,
        startAngle,
        endAngle,
        data: dataWithResolvedColor,
        ...radialBarChartProps,
        children: [
           jsxRuntime.jsx(
            recharts.RadialBar,
            {
              label: withLabels ? {
                position: "insideStart",
                fill: "var(--mantine-color-white)",
                fontSize: 12
              } : void 0,
              background: withBackground ? { fill: "var(--chart-empty-background)" } : void 0,
              dataKey,
              isAnimationActive: false,
              ...radialBarProps
            }
          ),
          withLegend &&  jsxRuntime.jsx(
            recharts.Legend,
            {
              verticalAlign: "bottom",
              content: (payload) =>  jsxRuntime.jsx(
                ChartLegend,
                {
                  payload: payload.payload?.map((item) => ({
                    ...item,
                    dataKey: item.payload?.name
                  })),
                  onHighlight: setHighlightedArea,
                  legendPosition: legendProps?.verticalAlign || "bottom",
                  classNames: resolvedClassNames,
                  styles: resolvedStyles,
                  centered: true
                }
              ),
              ...legendProps
            }
          ),
          withTooltip &&  jsxRuntime.jsx(
            recharts.Tooltip,
            {
              animationDuration: 0,
              isAnimationActive: false,
              cursor: { stroke: "var(--chart-cursor-color)" },
              content: ({ payload }) =>  jsxRuntime.jsxs(core.Paper, { ...getStyles("tooltip"), children: [
                 jsxRuntime.jsxs(core.Group, { gap: "sm", children: [
                   jsxRuntime.jsx(core.ColorSwatch, { color: payload?.[0]?.payload.fill, size: 12, withShadow: false }),
                   jsxRuntime.jsx("span", { children: payload?.[0]?.payload.name })
                ] }),
                 jsxRuntime.jsx("span", { children: payload?.[0]?.payload[dataKey] })
              ] }),
              ...tooltipProps
            }
          )
        ]
      }
    ) }) });
  });
  RadialBarChart.displayName = "@mantine/core/RadialBarChart";
  RadialBarChart.classes = classes8;

  var classes9 = { "root": "m_80d531e7" };

  var defaultProps14 = {
    withTooltip: true,
    size: 300,
    strokeWidth: 1,
    withLabels: false,
    labelsPosition: "right",
    tooltipDataSource: "all"
  };
  var varsResolver12 = core.createVarsResolver(
    (theme, { strokeColor, labelColor, size }) => ({
      root: {
        "--chart-stroke-color": strokeColor ? core.getThemeColor(strokeColor, theme) : void 0,
        "--chart-labels-color": labelColor ? core.getThemeColor(labelColor, theme) : void 0,
        "--chart-size": core.rem(size)
      }
    })
  );
  var FunnelChart = core.factory((_props, ref) => {
    const props = core.useProps("FunnelChart", defaultProps14, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      data,
      withTooltip,
      tooltipAnimationDuration,
      tooltipProps,
      strokeWidth,
      withLabels,
      size,
      valueFormatter,
      children,
      funnelChartProps,
      funnelProps,
      labelsPosition,
      tooltipDataSource,
      ...others
    } = props;
    const theme = core.useMantineTheme();
    const getStyles = core.useStyles({
      name: "FunnelChart",
      classes: classes9,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver: varsResolver12
    });
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    return  jsxRuntime.jsx(core.Box, { ref, size, ...getStyles("root"), ...others, children:  jsxRuntime.jsx(recharts.ResponsiveContainer, { children:  jsxRuntime.jsxs(recharts.FunnelChart, { ...funnelChartProps, children: [
       jsxRuntime.jsxs(
        recharts.Funnel,
        {
          data,
          dataKey: "value",
          isAnimationActive: false,
          stroke: "var(--chart-stroke-color, var(--mantine-color-body))",
          strokeWidth,
          ...funnelProps,
          children: [
            withLabels &&  jsxRuntime.jsx(
              recharts.LabelList,
              {
                position: labelsPosition,
                fill: labelsPosition === "inside" ? "var(--chart-labels-color, var(--mantine-color-white))" : "var(--chart-labels-color, var(--mantine-color-dimmed))",
                stroke: "none",
                fontFamily: "var(--mantine-font-family)",
                fontSize: 14,
                dataKey: (entry) => {
                  return typeof valueFormatter === "function" ? valueFormatter(entry.value) : entry.value;
                }
              }
            ),
            data.map((entry, index) =>  jsxRuntime.jsx(
              recharts.Cell,
              {
                fill: core.getThemeColor(entry.color, theme),
                stroke: "var(--chart-stroke-color, var(--mantine-color-body))",
                strokeWidth
              },
              index
            ))
          ]
        }
      ),
      withTooltip &&  jsxRuntime.jsx(
        recharts.Tooltip,
        {
          animationDuration: tooltipAnimationDuration,
          isAnimationActive: false,
          content: ({ payload }) =>  jsxRuntime.jsx(
            ChartTooltip,
            {
              payload: data,
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              type: "radial",
              segmentId: tooltipDataSource === "segment" ? payload?.[0]?.name : void 0,
              valueFormatter
            }
          ),
          ...tooltipProps
        }
      ),
      children
    ] }) }) });
  });
  FunnelChart.displayName = "@mantine/charts/FunnelChart";
  FunnelChart.classes = classes9;
  exports.AreaChart = AreaChart;
  exports.AreaGradient = AreaGradient;
  exports.BarChart = BarChart;
  exports.BubbleChart = BubbleChart;
  exports.ChartLegend = ChartLegend;
  exports.ChartTooltip = ChartTooltip;
  exports.CompositeChart = CompositeChart;
  exports.DonutChart = DonutChart;
  exports.FunnelChart = FunnelChart;
  exports.LineChart = LineChart;
  exports.PieChart = PieChart2;
  exports.RadarChart = RadarChart;
  exports.RadialBarChart = RadialBarChart;
  exports.ScatterChart = ScatterChart;
  exports.Sparkline = Sparkline;
  exports.getFilteredChartLegendPayload = getFilteredChartLegendPayload;
  exports.getFilteredChartTooltipPayload = getFilteredChartTooltipPayload;
  exports.getSplitOffset = getSplitOffset;
}));
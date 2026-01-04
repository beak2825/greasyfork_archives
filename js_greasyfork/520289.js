(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-drag'), require('d3-selection'), require('d3-zoom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-drag', 'd3-selection', 'd3-zoom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myBundle = {}, global.d3, global.d3, global.d3));
})(this, (function (exports, d3Drag, d3Selection, d3Zoom) { 'use strict';
  var errorMessages = {
    error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
    error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
    error003: (nodeType) => `Node type "${nodeType}" not found. Using fallback type "default".`,
    error004: () => "The React Flow parent container needs a width and a height to render the graph.",
    error005: () => "Only child nodes can use a parent extent.",
    error006: () => "Can't create edge. An edge needs a source and a target.",
    error007: (id) => `The old edge with id=${id} does not exist.`,
    error009: (type) => `Marker type "${type}" doesn't exist.`,
    error008: (handleType, { id, sourceHandle, targetHandle }) => `Couldn't create edge for ${handleType} handle id: "${handleType === "source" ? sourceHandle : targetHandle}", edge id: ${id}.`,
    error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
    error011: (edgeType) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
    error012: (id) => `Node with id "${id}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
    error013: (lib = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${lib}/dist/style.css' or base.css to make sure everything is working properly.`
  };
  var infiniteExtent = [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ];
  var elementSelectionKeys = ["Enter", " ", "Escape"];
  exports.ConnectionMode = void 0;
  (function(ConnectionMode2) {
    ConnectionMode2["Strict"] = "strict";
    ConnectionMode2["Loose"] = "loose";
  })(exports.ConnectionMode || (exports.ConnectionMode = {}));
  exports.PanOnScrollMode = void 0;
  (function(PanOnScrollMode2) {
    PanOnScrollMode2["Free"] = "free";
    PanOnScrollMode2["Vertical"] = "vertical";
    PanOnScrollMode2["Horizontal"] = "horizontal";
  })(exports.PanOnScrollMode || (exports.PanOnScrollMode = {}));
  exports.SelectionMode = void 0;
  (function(SelectionMode2) {
    SelectionMode2["Partial"] = "partial";
    SelectionMode2["Full"] = "full";
  })(exports.SelectionMode || (exports.SelectionMode = {}));
  var initialConnection = {
    inProgress: false,
    isValid: null,
    from: null,
    fromHandle: null,
    fromPosition: null,
    fromNode: null,
    to: null,
    toHandle: null,
    toPosition: null,
    toNode: null
  };
  exports.ConnectionLineType = void 0;
  (function(ConnectionLineType2) {
    ConnectionLineType2["Bezier"] = "default";
    ConnectionLineType2["Straight"] = "straight";
    ConnectionLineType2["Step"] = "step";
    ConnectionLineType2["SmoothStep"] = "smoothstep";
    ConnectionLineType2["SimpleBezier"] = "simplebezier";
  })(exports.ConnectionLineType || (exports.ConnectionLineType = {}));
  exports.MarkerType = void 0;
  (function(MarkerType2) {
    MarkerType2["Arrow"] = "arrow";
    MarkerType2["ArrowClosed"] = "arrowclosed";
  })(exports.MarkerType || (exports.MarkerType = {}));
  exports.Position = void 0;
  (function(Position2) {
    Position2["Left"] = "left";
    Position2["Top"] = "top";
    Position2["Right"] = "right";
    Position2["Bottom"] = "bottom";
  })(exports.Position || (exports.Position = {}));
  var oppositePosition = {
    [exports.Position.Left]: exports.Position.Right,
    [exports.Position.Right]: exports.Position.Left,
    [exports.Position.Top]: exports.Position.Bottom,
    [exports.Position.Bottom]: exports.Position.Top
  };
  function areConnectionMapsEqual(a, b) {
    if (!a && !b) {
      return true;
    }
    if (!a || !b || a.size !== b.size) {
      return false;
    }
    if (!a.size && !b.size) {
      return true;
    }
    for (const key of a.keys()) {
      if (!b.has(key)) {
        return false;
      }
    }
    return true;
  }
  function handleConnectionChange(a, b, cb) {
    if (!cb) {
      return;
    }
    const diff = [];
    a.forEach((connection, key) => {
      if (!b?.has(key)) {
        diff.push(connection);
      }
    });
    if (diff.length) {
      cb(diff);
    }
  }
  function getConnectionStatus(isValid) {
    return isValid === null ? null : isValid ? "valid" : "invalid";
  }
  var isEdgeBase = (element) => "id" in element && "source" in element && "target" in element;
  var isNodeBase = (element) => "id" in element && "position" in element && !("source" in element) && !("target" in element);
  var isInternalNodeBase = (element) => "id" in element && "internals" in element && !("source" in element) && !("target" in element);
  var getOutgoers = (node, nodes, edges) => {
    if (!node.id) {
      return [];
    }
    const outgoerIds = new Set();
    edges.forEach((edge) => {
      if (edge.source === node.id) {
        outgoerIds.add(edge.target);
      }
    });
    return nodes.filter((n) => outgoerIds.has(n.id));
  };
  var getIncomers = (node, nodes, edges) => {
    if (!node.id) {
      return [];
    }
    const incomersIds = new Set();
    edges.forEach((edge) => {
      if (edge.target === node.id) {
        incomersIds.add(edge.source);
      }
    });
    return nodes.filter((n) => incomersIds.has(n.id));
  };
  var getNodePositionWithOrigin = (node, nodeOrigin = [0, 0]) => {
    const { width, height } = getNodeDimensions(node);
    const origin = node.origin ?? nodeOrigin;
    const offsetX = width * origin[0];
    const offsetY = height * origin[1];
    return {
      x: node.position.x - offsetX,
      y: node.position.y - offsetY
    };
  };
  var getNodesBounds = (nodes, params = { nodeOrigin: [0, 0], nodeLookup: void 0 }) => {
    if (!params.nodeLookup) {
      console.warn("Please use `getNodesBounds` from `useReactFlow`/`useSvelteFlow` hook to ensure correct values for sub flows. If not possible, you have to provide a nodeLookup to support sub flows.");
    }
    if (nodes.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    const box = nodes.reduce((currBox, nodeOrId) => {
      const isId = typeof nodeOrId === "string";
      let currentNode = !params.nodeLookup && !isId ? nodeOrId : void 0;
      if (params.nodeLookup) {
        currentNode = isId ? params.nodeLookup.get(nodeOrId) : !isInternalNodeBase(nodeOrId) ? params.nodeLookup.get(nodeOrId.id) : nodeOrId;
      }
      const nodeBox = currentNode ? nodeToBox(currentNode, params.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
      return getBoundsOfBoxes(currBox, nodeBox);
    }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
    return boxToRect(box);
  };
  var getInternalNodesBounds = (nodeLookup, params = {}) => {
    if (nodeLookup.size === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    let box = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };
    nodeLookup.forEach((node) => {
      if (params.filter === void 0 || params.filter(node)) {
        const nodeBox = nodeToBox(node);
        box = getBoundsOfBoxes(box, nodeBox);
      }
    });
    return boxToRect(box);
  };
  var getNodesInside = (nodes, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, excludeNonSelectableNodes = false) => {
    const paneRect = {
      ...pointToRendererPoint(rect, [tx, ty, tScale]),
      width: rect.width / tScale,
      height: rect.height / tScale
    };
    const visibleNodes = [];
    for (const node of nodes.values()) {
      const { measured, selectable = true, hidden = false } = node;
      if (excludeNonSelectableNodes && !selectable || hidden) {
        continue;
      }
      const width = measured.width ?? node.width ?? node.initialWidth ?? null;
      const height = measured.height ?? node.height ?? node.initialHeight ?? null;
      const overlappingArea = getOverlappingArea(paneRect, nodeToRect(node));
      const area = (width ?? 0) * (height ?? 0);
      const partiallyVisible = partially && overlappingArea > 0;
      const forceInitialRender = !node.internals.handleBounds;
      const isVisible = forceInitialRender || partiallyVisible || overlappingArea >= area;
      if (isVisible || node.dragging) {
        visibleNodes.push(node);
      }
    }
    return visibleNodes;
  };
  var getConnectedEdges = (nodes, edges) => {
    const nodeIds = new Set();
    nodes.forEach((node) => {
      nodeIds.add(node.id);
    });
    return edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
  };
  function getFitViewNodes(nodeLookup, options) {
    const fitViewNodes = new Map();
    const optionNodeIds = options?.nodes ? new Set(options.nodes.map((node) => node.id)) : null;
    nodeLookup.forEach((n) => {
      const isVisible = n.measured.width && n.measured.height && (options?.includeHiddenNodes || !n.hidden);
      if (isVisible && (!optionNodeIds || optionNodeIds.has(n.id))) {
        fitViewNodes.set(n.id, n);
      }
    });
    return fitViewNodes;
  }
  async function fitView({ nodes, width, height, panZoom, minZoom, maxZoom }, options) {
    if (nodes.size === 0) {
      return Promise.resolve(false);
    }
    const bounds = getInternalNodesBounds(nodes);
    const viewport = getViewportForBounds(bounds, width, height, options?.minZoom ?? minZoom, options?.maxZoom ?? maxZoom, options?.padding ?? 0.1);
    await panZoom.setViewport(viewport, { duration: options?.duration });
    return Promise.resolve(true);
  }
  function calculateNodePosition({ nodeId, nextPosition, nodeLookup, nodeOrigin = [0, 0], nodeExtent, onError }) {
    const node = nodeLookup.get(nodeId);
    const parentNode = node.parentId ? nodeLookup.get(node.parentId) : void 0;
    const { x: parentX, y: parentY } = parentNode ? parentNode.internals.positionAbsolute : { x: 0, y: 0 };
    const origin = node.origin ?? nodeOrigin;
    let extent = nodeExtent;
    if (node.extent === "parent" && !node.expandParent) {
      if (!parentNode) {
        onError?.("005", errorMessages["error005"]());
      } else {
        const parentWidth = parentNode.measured.width;
        const parentHeight = parentNode.measured.height;
        if (parentWidth && parentHeight) {
          extent = [
            [parentX, parentY],
            [parentX + parentWidth, parentY + parentHeight]
          ];
        }
      }
    } else if (parentNode && isCoordinateExtent(node.extent)) {
      extent = [
        [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
        [node.extent[1][0] + parentX, node.extent[1][1] + parentY]
      ];
    }
    const positionAbsolute = isCoordinateExtent(extent) ? clampPosition(nextPosition, extent, node.measured) : nextPosition;
    return {
      position: {
        x: positionAbsolute.x - parentX + node.measured.width * origin[0],
        y: positionAbsolute.y - parentY + node.measured.height * origin[1]
      },
      positionAbsolute
    };
  }
  async function getElementsToRemove({ nodesToRemove = [], edgesToRemove = [], nodes, edges, onBeforeDelete }) {
    const nodeIds = new Set(nodesToRemove.map((node) => node.id));
    const matchingNodes = [];
    for (const node of nodes) {
      if (node.deletable === false) {
        continue;
      }
      const isIncluded = nodeIds.has(node.id);
      const parentHit = !isIncluded && node.parentId && matchingNodes.find((n) => n.id === node.parentId);
      if (isIncluded || parentHit) {
        matchingNodes.push(node);
      }
    }
    const edgeIds = new Set(edgesToRemove.map((edge) => edge.id));
    const deletableEdges = edges.filter((edge) => edge.deletable !== false);
    const connectedEdges = getConnectedEdges(matchingNodes, deletableEdges);
    const matchingEdges = connectedEdges;
    for (const edge of deletableEdges) {
      const isIncluded = edgeIds.has(edge.id);
      if (isIncluded && !matchingEdges.find((e) => e.id === edge.id)) {
        matchingEdges.push(edge);
      }
    }
    if (!onBeforeDelete) {
      return {
        edges: matchingEdges,
        nodes: matchingNodes
      };
    }
    const onBeforeDeleteResult = await onBeforeDelete({
      nodes: matchingNodes,
      edges: matchingEdges
    });
    if (typeof onBeforeDeleteResult === "boolean") {
      return onBeforeDeleteResult ? { edges: matchingEdges, nodes: matchingNodes } : { edges: [], nodes: [] };
    }
    return onBeforeDeleteResult;
  }
  var clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
  var clampPosition = (position = { x: 0, y: 0 }, extent, dimensions) => ({
    x: clamp(position.x, extent[0][0], extent[1][0] - (dimensions?.width ?? 0)),
    y: clamp(position.y, extent[0][1], extent[1][1] - (dimensions?.height ?? 0))
  });
  function clampPositionToParent(childPosition, childDimensions, parent) {
    const { width: parentWidth, height: parentHeight } = getNodeDimensions(parent);
    const { x: parentX, y: parentY } = parent.internals.positionAbsolute;
    return clampPosition(childPosition, [
      [parentX, parentY],
      [parentX + parentWidth, parentY + parentHeight]
    ], childDimensions);
  }
  var calcAutoPanVelocity = (value, min, max) => {
    if (value < min) {
      return clamp(Math.abs(value - min), 1, min) / min;
    } else if (value > max) {
      return -clamp(Math.abs(value - max), 1, min) / min;
    }
    return 0;
  };
  var calcAutoPan = (pos, bounds, speed = 15, distance2 = 40) => {
    const xMovement = calcAutoPanVelocity(pos.x, distance2, bounds.width - distance2) * speed;
    const yMovement = calcAutoPanVelocity(pos.y, distance2, bounds.height - distance2) * speed;
    return [xMovement, yMovement];
  };
  var getBoundsOfBoxes = (box1, box2) => ({
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2)
  });
  var rectToBox = ({ x, y, width, height }) => ({
    x,
    y,
    x2: x + width,
    y2: y + height
  });
  var boxToRect = ({ x, y, x2, y2 }) => ({
    x,
    y,
    width: x2 - x,
    height: y2 - y
  });
  var nodeToRect = (node, nodeOrigin = [0, 0]) => {
    const { x, y } = isInternalNodeBase(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
    return {
      x,
      y,
      width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
      height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0
    };
  };
  var nodeToBox = (node, nodeOrigin = [0, 0]) => {
    const { x, y } = isInternalNodeBase(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
    return {
      x,
      y,
      x2: x + (node.measured?.width ?? node.width ?? node.initialWidth ?? 0),
      y2: y + (node.measured?.height ?? node.height ?? node.initialHeight ?? 0)
    };
  };
  var getBoundsOfRects = (rect1, rect2) => boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
  var getOverlappingArea = (rectA, rectB) => {
    const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
    const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
    return Math.ceil(xOverlap * yOverlap);
  };
  var isRectObject = (obj) => isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
  var isNumeric = (n) => !isNaN(n) && isFinite(n);
  var devWarn = (id, message) => {
    {
      console.warn(`[React Flow]: ${message} Help: https://reactflow.dev/error#${id}`);
    }
  };
  var snapPosition = (position, snapGrid = [1, 1]) => {
    return {
      x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
      y: snapGrid[1] * Math.round(position.y / snapGrid[1])
    };
  };
  var pointToRendererPoint = ({ x, y }, [tx, ty, tScale], snapToGrid = false, snapGrid = [1, 1]) => {
    const position = {
      x: (x - tx) / tScale,
      y: (y - ty) / tScale
    };
    return snapToGrid ? snapPosition(position, snapGrid) : position;
  };
  var rendererPointToPoint = ({ x, y }, [tx, ty, tScale]) => {
    return {
      x: x * tScale + tx,
      y: y * tScale + ty
    };
  };
  var getViewportForBounds = (bounds, width, height, minZoom, maxZoom, padding) => {
    const xZoom = width / (bounds.width * (1 + padding));
    const yZoom = height / (bounds.height * (1 + padding));
    const zoom2 = Math.min(xZoom, yZoom);
    const clampedZoom = clamp(zoom2, minZoom, maxZoom);
    const boundsCenterX = bounds.x + bounds.width / 2;
    const boundsCenterY = bounds.y + bounds.height / 2;
    const x = width / 2 - boundsCenterX * clampedZoom;
    const y = height / 2 - boundsCenterY * clampedZoom;
    return { x, y, zoom: clampedZoom };
  };
  var isMacOs = () => typeof navigator !== "undefined" && navigator?.userAgent?.indexOf("Mac") >= 0;
  function isCoordinateExtent(extent) {
    return extent !== void 0 && extent !== "parent";
  }
  function getNodeDimensions(node) {
    return {
      width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
      height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0
    };
  }
  function nodeHasDimensions(node) {
    return (node.measured?.width ?? node.width ?? node.initialWidth) !== void 0 && (node.measured?.height ?? node.height ?? node.initialHeight) !== void 0;
  }
  function evaluateAbsolutePosition(position, dimensions = { width: 0, height: 0 }, parentId, nodeLookup, nodeOrigin) {
    const positionAbsolute = { ...position };
    const parent = nodeLookup.get(parentId);
    if (parent) {
      const origin = parent.origin || nodeOrigin;
      positionAbsolute.x += parent.internals.positionAbsolute.x - (dimensions.width ?? 0) * origin[0];
      positionAbsolute.y += parent.internals.positionAbsolute.y - (dimensions.height ?? 0) * origin[1];
    }
    return positionAbsolute;
  }
  function getPointerPosition(event, { snapGrid = [0, 0], snapToGrid = false, transform, containerBounds }) {
    const { x, y } = getEventPosition(event);
    const pointerPos = pointToRendererPoint({ x: x - (containerBounds?.left ?? 0), y: y - (containerBounds?.top ?? 0) }, transform);
    const { x: xSnapped, y: ySnapped } = snapToGrid ? snapPosition(pointerPos, snapGrid) : pointerPos;
    return {
      xSnapped,
      ySnapped,
      ...pointerPos
    };
  }
  var getDimensions = (node) => ({
    width: node.offsetWidth,
    height: node.offsetHeight
  });
  var getHostForElement = (element) => element.getRootNode?.() || window?.document;
  var inputTags = ["INPUT", "SELECT", "TEXTAREA"];
  function isInputDOMNode(event) {
    const target = event.composedPath?.()?.[0] || event.target;
    const isInput = inputTags.includes(target?.nodeName) || target?.hasAttribute?.("contenteditable");
    return isInput || !!target?.closest(".nokey");
  }
  var isMouseEvent = (event) => "clientX" in event;
  var getEventPosition = (event, bounds) => {
    const isMouse = isMouseEvent(event);
    const evtX = isMouse ? event.clientX : event.touches?.[0].clientX;
    const evtY = isMouse ? event.clientY : event.touches?.[0].clientY;
    return {
      x: evtX - (bounds?.left ?? 0),
      y: evtY - (bounds?.top ?? 0)
    };
  };
  var getHandleBounds = (type, nodeElement, nodeBounds, zoom2, nodeId) => {
    const handles = nodeElement.querySelectorAll(`.${type}`);
    if (!handles || !handles.length) {
      return null;
    }
    return Array.from(handles).map((handle) => {
      const handleBounds = handle.getBoundingClientRect();
      return {
        id: handle.getAttribute("data-handleid"),
        type,
        nodeId,
        position: handle.getAttribute("data-handlepos"),
        x: (handleBounds.left - nodeBounds.left) / zoom2,
        y: (handleBounds.top - nodeBounds.top) / zoom2,
        ...getDimensions(handle)
      };
    });
  };
  function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY }) {
    const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
    const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
    const offsetX = Math.abs(centerX - sourceX);
    const offsetY = Math.abs(centerY - sourceY);
    return [centerX, centerY, offsetX, offsetY];
  }
  function calculateControlOffset(distance2, curvature) {
    if (distance2 >= 0) {
      return 0.5 * distance2;
    }
    return curvature * 25 * Math.sqrt(-distance2);
  }
  function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
    switch (pos) {
      case exports.Position.Left:
        return [x1 - calculateControlOffset(x1 - x2, c), y1];
      case exports.Position.Right:
        return [x1 + calculateControlOffset(x2 - x1, c), y1];
      case exports.Position.Top:
        return [x1, y1 - calculateControlOffset(y1 - y2, c)];
      case exports.Position.Bottom:
        return [x1, y1 + calculateControlOffset(y2 - y1, c)];
    }
  }
  function getBezierPath({ sourceX, sourceY, sourcePosition = exports.Position.Bottom, targetX, targetY, targetPosition = exports.Position.Top, curvature = 0.25 }) {
    const [sourceControlX, sourceControlY] = getControlWithCurvature({
      pos: sourcePosition,
      x1: sourceX,
      y1: sourceY,
      x2: targetX,
      y2: targetY,
      c: curvature
    });
    const [targetControlX, targetControlY] = getControlWithCurvature({
      pos: targetPosition,
      x1: targetX,
      y1: targetY,
      x2: sourceX,
      y2: sourceY,
      c: curvature
    });
    const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourceControlX,
      sourceControlY,
      targetControlX,
      targetControlY
    });
    return [
      `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
      labelX,
      labelY,
      offsetX,
      offsetY
    ];
  }
  function getEdgeCenter({ sourceX, sourceY, targetX, targetY }) {
    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
    return [centerX, centerY, xOffset, yOffset];
  }
  function getElevatedEdgeZIndex({ sourceNode, targetNode, selected = false, zIndex = 0, elevateOnSelect = false }) {
    if (!elevateOnSelect) {
      return zIndex;
    }
    const edgeOrConnectedNodeSelected = selected || targetNode.selected || sourceNode.selected;
    const selectedZIndex = Math.max(sourceNode.internals.z || 0, targetNode.internals.z || 0, 1e3);
    return zIndex + (edgeOrConnectedNodeSelected ? selectedZIndex : 0);
  }
  function isEdgeVisible({ sourceNode, targetNode, width, height, transform }) {
    const edgeBox = getBoundsOfBoxes(nodeToBox(sourceNode), nodeToBox(targetNode));
    if (edgeBox.x === edgeBox.x2) {
      edgeBox.x2 += 1;
    }
    if (edgeBox.y === edgeBox.y2) {
      edgeBox.y2 += 1;
    }
    const viewRect = {
      x: -transform[0] / transform[2],
      y: -transform[1] / transform[2],
      width: width / transform[2],
      height: height / transform[2]
    };
    return getOverlappingArea(viewRect, boxToRect(edgeBox)) > 0;
  }
  var getEdgeId = ({ source, sourceHandle, target, targetHandle }) => `xy-edge__${source}${sourceHandle || ""}-${target}${targetHandle || ""}`;
  var connectionExists = (edge, edges) => {
    return edges.some((el) => el.source === edge.source && el.target === edge.target && (el.sourceHandle === edge.sourceHandle || !el.sourceHandle && !edge.sourceHandle) && (el.targetHandle === edge.targetHandle || !el.targetHandle && !edge.targetHandle));
  };
  var addEdge = (edgeParams, edges) => {
    if (!edgeParams.source || !edgeParams.target) {
      devWarn("006", errorMessages["error006"]());
      return edges;
    }
    let edge;
    if (isEdgeBase(edgeParams)) {
      edge = { ...edgeParams };
    } else {
      edge = {
        ...edgeParams,
        id: getEdgeId(edgeParams)
      };
    }
    if (connectionExists(edge, edges)) {
      return edges;
    }
    if (edge.sourceHandle === null) {
      delete edge.sourceHandle;
    }
    if (edge.targetHandle === null) {
      delete edge.targetHandle;
    }
    return edges.concat(edge);
  };
  var reconnectEdge = (oldEdge, newConnection, edges, options = { shouldReplaceId: true }) => {
    const { id: oldEdgeId, ...rest } = oldEdge;
    if (!newConnection.source || !newConnection.target) {
      devWarn("006", errorMessages["error006"]());
      return edges;
    }
    const foundEdge = edges.find((e) => e.id === oldEdge.id);
    if (!foundEdge) {
      devWarn("007", errorMessages["error007"](oldEdgeId));
      return edges;
    }
    const edge = {
      ...rest,
      id: options.shouldReplaceId ? getEdgeId(newConnection) : oldEdgeId,
      source: newConnection.source,
      target: newConnection.target,
      sourceHandle: newConnection.sourceHandle,
      targetHandle: newConnection.targetHandle
    };
    return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
  };
  function getStraightPath({ sourceX, sourceY, targetX, targetY }) {
    const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
      sourceX,
      sourceY,
      targetX,
      targetY
    });
    return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
  }
  var handleDirections = {
    [exports.Position.Left]: { x: -1, y: 0 },
    [exports.Position.Right]: { x: 1, y: 0 },
    [exports.Position.Top]: { x: 0, y: -1 },
    [exports.Position.Bottom]: { x: 0, y: 1 }
  };
  var getDirection = ({ source, sourcePosition = exports.Position.Bottom, target }) => {
    if (sourcePosition === exports.Position.Left || sourcePosition === exports.Position.Right) {
      return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
    }
    return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
  };
  var distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  function getPoints({ source, sourcePosition = exports.Position.Bottom, target, targetPosition = exports.Position.Top, center, offset }) {
    const sourceDir = handleDirections[sourcePosition];
    const targetDir = handleDirections[targetPosition];
    const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
    const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
    const dir = getDirection({
      source: sourceGapped,
      sourcePosition,
      target: targetGapped
    });
    const dirAccessor = dir.x !== 0 ? "x" : "y";
    const currDir = dir[dirAccessor];
    let points = [];
    let centerX, centerY;
    const sourceGapOffset = { x: 0, y: 0 };
    const targetGapOffset = { x: 0, y: 0 };
    const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getEdgeCenter({
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y
    });
    if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
      centerX = center.x ?? defaultCenterX;
      centerY = center.y ?? defaultCenterY;
      const verticalSplit = [
        { x: centerX, y: sourceGapped.y },
        { x: centerX, y: targetGapped.y }
      ];
      const horizontalSplit = [
        { x: sourceGapped.x, y: centerY },
        { x: targetGapped.x, y: centerY }
      ];
      if (sourceDir[dirAccessor] === currDir) {
        points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
      } else {
        points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
      }
    } else {
      const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
      const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
      if (dirAccessor === "x") {
        points = sourceDir.x === currDir ? targetSource : sourceTarget;
      } else {
        points = sourceDir.y === currDir ? sourceTarget : targetSource;
      }
      if (sourcePosition === targetPosition) {
        const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
        if (diff <= offset) {
          const gapOffset = Math.min(offset - 1, offset - diff);
          if (sourceDir[dirAccessor] === currDir) {
            sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
          } else {
            targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
          }
        }
      }
      if (sourcePosition !== targetPosition) {
        const dirAccessorOpposite = dirAccessor === "x" ? "y" : "x";
        const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
        const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
        const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
        const flipSourceTarget = sourceDir[dirAccessor] === 1 && (!isSameDir && sourceGtTargetOppo || isSameDir && sourceLtTargetOppo) || sourceDir[dirAccessor] !== 1 && (!isSameDir && sourceLtTargetOppo || isSameDir && sourceGtTargetOppo);
        if (flipSourceTarget) {
          points = dirAccessor === "x" ? sourceTarget : targetSource;
        }
      }
      const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
      const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
      const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
      const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));
      if (maxXDistance >= maxYDistance) {
        centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
        centerY = points[0].y;
      } else {
        centerX = points[0].x;
        centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
      }
    }
    const pathPoints = [
      source,
      { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y },
      ...points,
      { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y },
      target
    ];
    return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
  }
  function getBend(a, b, c, size) {
    const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
    const { x, y } = b;
    if (a.x === x && x === c.x || a.y === y && y === c.y) {
      return `L${x} ${y}`;
    }
    if (a.y === y) {
      const xDir2 = a.x < c.x ? -1 : 1;
      const yDir2 = a.y < c.y ? 1 : -1;
      return `L ${x + bendSize * xDir2},${y}Q ${x},${y} ${x},${y + bendSize * yDir2}`;
    }
    const xDir = a.x < c.x ? 1 : -1;
    const yDir = a.y < c.y ? -1 : 1;
    return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
  }
  function getSmoothStepPath({ sourceX, sourceY, sourcePosition = exports.Position.Bottom, targetX, targetY, targetPosition = exports.Position.Top, borderRadius = 5, centerX, centerY, offset = 20 }) {
    const [points, labelX, labelY, offsetX, offsetY] = getPoints({
      source: { x: sourceX, y: sourceY },
      sourcePosition,
      target: { x: targetX, y: targetY },
      targetPosition,
      center: { x: centerX, y: centerY },
      offset
    });
    const path = points.reduce((res, p, i) => {
      let segment = "";
      if (i > 0 && i < points.length - 1) {
        segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
      } else {
        segment = `${i === 0 ? "M" : "L"}${p.x} ${p.y}`;
      }
      res += segment;
      return res;
    }, "");
    return [path, labelX, labelY, offsetX, offsetY];
  }
  function isNodeInitialized(node) {
    return node && !!(node.internals.handleBounds || node.handles?.length) && !!(node.measured.width || node.width || node.initialWidth);
  }
  function getEdgePosition(params) {
    const { sourceNode, targetNode } = params;
    if (!isNodeInitialized(sourceNode) || !isNodeInitialized(targetNode)) {
      return null;
    }
    const sourceHandleBounds = sourceNode.internals.handleBounds || toHandleBounds(sourceNode.handles);
    const targetHandleBounds = targetNode.internals.handleBounds || toHandleBounds(targetNode.handles);
    const sourceHandle = getHandle$1(sourceHandleBounds?.source ?? [], params.sourceHandle);
    const targetHandle = getHandle$1(
      // when connection type is loose we can define all handles as sources and connect source -> source
      params.connectionMode === exports.ConnectionMode.Strict ? targetHandleBounds?.target ?? [] : (targetHandleBounds?.target ?? []).concat(targetHandleBounds?.source ?? []),
      params.targetHandle
    );
    if (!sourceHandle || !targetHandle) {
      params.onError?.("008", errorMessages["error008"](!sourceHandle ? "source" : "target", {
        id: params.id,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle
      }));
      return null;
    }
    const sourcePosition = sourceHandle?.position || exports.Position.Bottom;
    const targetPosition = targetHandle?.position || exports.Position.Top;
    const source = getHandlePosition(sourceNode, sourceHandle, sourcePosition);
    const target = getHandlePosition(targetNode, targetHandle, targetPosition);
    return {
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y,
      sourcePosition,
      targetPosition
    };
  }
  function toHandleBounds(handles) {
    if (!handles) {
      return null;
    }
    const source = [];
    const target = [];
    for (const handle of handles) {
      handle.width = handle.width ?? 1;
      handle.height = handle.height ?? 1;
      if (handle.type === "source") {
        source.push(handle);
      } else if (handle.type === "target") {
        target.push(handle);
      }
    }
    return {
      source,
      target
    };
  }
  function getHandlePosition(node, handle, fallbackPosition = exports.Position.Left, center = false) {
    const x = (handle?.x ?? 0) + node.internals.positionAbsolute.x;
    const y = (handle?.y ?? 0) + node.internals.positionAbsolute.y;
    const { width, height } = handle ?? getNodeDimensions(node);
    if (center) {
      return { x: x + width / 2, y: y + height / 2 };
    }
    const position = handle?.position ?? fallbackPosition;
    switch (position) {
      case exports.Position.Top:
        return { x: x + width / 2, y };
      case exports.Position.Right:
        return { x: x + width, y: y + height / 2 };
      case exports.Position.Bottom:
        return { x: x + width / 2, y: y + height };
      case exports.Position.Left:
        return { x, y: y + height / 2 };
    }
  }
  function getHandle$1(bounds, handleId) {
    if (!bounds) {
      return null;
    }
    return (!handleId ? bounds[0] : bounds.find((d) => d.id === handleId)) || null;
  }
  function getMarkerId(marker, id) {
    if (!marker) {
      return "";
    }
    if (typeof marker === "string") {
      return marker;
    }
    const idPrefix = id ? `${id}__` : "";
    return `${idPrefix}${Object.keys(marker).sort().map((key) => `${key}=${marker[key]}`).join("&")}`;
  }
  function createMarkerIds(edges, { id, defaultColor, defaultMarkerStart, defaultMarkerEnd }) {
    const ids = new Set();
    return edges.reduce((markers, edge) => {
      [edge.markerStart || defaultMarkerStart, edge.markerEnd || defaultMarkerEnd].forEach((marker) => {
        if (marker && typeof marker === "object") {
          const markerId = getMarkerId(marker, id);
          if (!ids.has(markerId)) {
            markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
            ids.add(markerId);
          }
        }
      });
      return markers;
    }, []).sort((a, b) => a.id.localeCompare(b.id));
  }
  function getNodeToolbarTransform(nodeRect, viewport, position, offset, align) {
    let alignmentOffset = 0.5;
    if (align === "start") {
      alignmentOffset = 0;
    } else if (align === "end") {
      alignmentOffset = 1;
    }
    let pos = [
      (nodeRect.x + nodeRect.width * alignmentOffset) * viewport.zoom + viewport.x,
      nodeRect.y * viewport.zoom + viewport.y - offset
    ];
    let shift = [-100 * alignmentOffset, -100];
    switch (position) {
      case exports.Position.Right:
        pos = [
          (nodeRect.x + nodeRect.width) * viewport.zoom + viewport.x + offset,
          (nodeRect.y + nodeRect.height * alignmentOffset) * viewport.zoom + viewport.y
        ];
        shift = [0, -100 * alignmentOffset];
        break;
      case exports.Position.Bottom:
        pos[1] = (nodeRect.y + nodeRect.height) * viewport.zoom + viewport.y + offset;
        shift[1] = 0;
        break;
      case exports.Position.Left:
        pos = [
          nodeRect.x * viewport.zoom + viewport.x - offset,
          (nodeRect.y + nodeRect.height * alignmentOffset) * viewport.zoom + viewport.y
        ];
        shift = [-100, -100 * alignmentOffset];
        break;
    }
    return `translate(${pos[0]}px, ${pos[1]}px) translate(${shift[0]}%, ${shift[1]}%)`;
  }
  var defaultOptions = {
    nodeOrigin: [0, 0],
    nodeExtent: infiniteExtent,
    elevateNodesOnSelect: true,
    defaults: {}
  };
  var adoptUserNodesDefaultOptions = {
    ...defaultOptions,
    checkEquality: true
  };
  function mergeObjects(base, incoming) {
    const result = { ...base };
    for (const key in incoming) {
      if (incoming[key] !== void 0) {
        result[key] = incoming[key];
      }
    }
    return result;
  }
  function updateAbsolutePositions(nodeLookup, parentLookup, options) {
    const _options = mergeObjects(defaultOptions, options);
    for (const node of nodeLookup.values()) {
      if (node.parentId) {
        updateChildNode(node, nodeLookup, parentLookup, _options);
      } else {
        const positionWithOrigin = getNodePositionWithOrigin(node, _options.nodeOrigin);
        const extent = isCoordinateExtent(node.extent) ? node.extent : _options.nodeExtent;
        const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(node));
        node.internals.positionAbsolute = clampedPosition;
      }
    }
  }
  function adoptUserNodes(nodes, nodeLookup, parentLookup, options) {
    const _options = mergeObjects(adoptUserNodesDefaultOptions, options);
    const tmpLookup = new Map(nodeLookup);
    const selectedNodeZ = _options?.elevateNodesOnSelect ? 1e3 : 0;
    nodeLookup.clear();
    parentLookup.clear();
    for (const userNode of nodes) {
      let internalNode = tmpLookup.get(userNode.id);
      if (_options.checkEquality && userNode === internalNode?.internals.userNode) {
        nodeLookup.set(userNode.id, internalNode);
      } else {
        const positionWithOrigin = getNodePositionWithOrigin(userNode, _options.nodeOrigin);
        const extent = isCoordinateExtent(userNode.extent) ? userNode.extent : _options.nodeExtent;
        const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(userNode));
        internalNode = {
          ..._options.defaults,
          ...userNode,
          measured: {
            width: userNode.measured?.width,
            height: userNode.measured?.height
          },
          internals: {
            positionAbsolute: clampedPosition,
            // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
            handleBounds: !userNode.measured ? void 0 : internalNode?.internals.handleBounds,
            z: calculateZ(userNode, selectedNodeZ),
            userNode
          }
        };
        nodeLookup.set(userNode.id, internalNode);
      }
      if (userNode.parentId) {
        updateChildNode(internalNode, nodeLookup, parentLookup, options);
      }
    }
  }
  function updateParentLookup(node, parentLookup) {
    if (!node.parentId) {
      return;
    }
    const childNodes = parentLookup.get(node.parentId);
    if (childNodes) {
      childNodes.set(node.id, node);
    } else {
      parentLookup.set(node.parentId, new Map([[node.id, node]]));
    }
  }
  function updateChildNode(node, nodeLookup, parentLookup, options) {
    const { elevateNodesOnSelect, nodeOrigin, nodeExtent } = mergeObjects(defaultOptions, options);
    const parentId = node.parentId;
    const parentNode = nodeLookup.get(parentId);
    if (!parentNode) {
      console.warn(`Parent node ${parentId} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
      return;
    }
    updateParentLookup(node, parentLookup);
    const selectedNodeZ = elevateNodesOnSelect ? 1e3 : 0;
    const { x, y, z } = calculateChildXYZ(node, parentNode, nodeOrigin, nodeExtent, selectedNodeZ);
    const { positionAbsolute } = node.internals;
    const positionChanged = x !== positionAbsolute.x || y !== positionAbsolute.y;
    if (positionChanged || z !== node.internals.z) {
      node.internals = {
        ...node.internals,
        positionAbsolute: positionChanged ? { x, y } : positionAbsolute,
        z
      };
    }
  }
  function calculateZ(node, selectedNodeZ) {
    return (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0);
  }
  function calculateChildXYZ(childNode, parentNode, nodeOrigin, nodeExtent, selectedNodeZ) {
    const { x: parentX, y: parentY } = parentNode.internals.positionAbsolute;
    const childDimensions = getNodeDimensions(childNode);
    const positionWithOrigin = getNodePositionWithOrigin(childNode, nodeOrigin);
    const clampedPosition = isCoordinateExtent(childNode.extent) ? clampPosition(positionWithOrigin, childNode.extent, childDimensions) : positionWithOrigin;
    let absolutePosition = clampPosition({ x: parentX + clampedPosition.x, y: parentY + clampedPosition.y }, nodeExtent, childDimensions);
    if (childNode.extent === "parent") {
      absolutePosition = clampPositionToParent(absolutePosition, childDimensions, parentNode);
    }
    const childZ = calculateZ(childNode, selectedNodeZ);
    const parentZ = parentNode.internals.z ?? 0;
    return {
      x: absolutePosition.x,
      y: absolutePosition.y,
      z: parentZ > childZ ? parentZ : childZ
    };
  }
  function handleExpandParent(children, nodeLookup, parentLookup, nodeOrigin = [0, 0]) {
    const changes = [];
    const parentExpansions = new Map();
    for (const child of children) {
      const parent = nodeLookup.get(child.parentId);
      if (!parent) {
        continue;
      }
      const parentRect = parentExpansions.get(child.parentId)?.expandedRect ?? nodeToRect(parent);
      const expandedRect = getBoundsOfRects(parentRect, child.rect);
      parentExpansions.set(child.parentId, { expandedRect, parent });
    }
    if (parentExpansions.size > 0) {
      parentExpansions.forEach(({ expandedRect, parent }, parentId) => {
        const positionAbsolute = parent.internals.positionAbsolute;
        const dimensions = getNodeDimensions(parent);
        const origin = parent.origin ?? nodeOrigin;
        const xChange = expandedRect.x < positionAbsolute.x ? Math.round(Math.abs(positionAbsolute.x - expandedRect.x)) : 0;
        const yChange = expandedRect.y < positionAbsolute.y ? Math.round(Math.abs(positionAbsolute.y - expandedRect.y)) : 0;
        const newWidth = Math.max(dimensions.width, Math.round(expandedRect.width));
        const newHeight = Math.max(dimensions.height, Math.round(expandedRect.height));
        const widthChange = (newWidth - dimensions.width) * origin[0];
        const heightChange = (newHeight - dimensions.height) * origin[1];
        if (xChange > 0 || yChange > 0 || widthChange || heightChange) {
          changes.push({
            id: parentId,
            type: "position",
            position: {
              x: parent.position.x - xChange + widthChange,
              y: parent.position.y - yChange + heightChange
            }
          });
          parentLookup.get(parentId)?.forEach((childNode) => {
            if (!children.some((child) => child.id === childNode.id)) {
              changes.push({
                id: childNode.id,
                type: "position",
                position: {
                  x: childNode.position.x + xChange,
                  y: childNode.position.y + yChange
                }
              });
            }
          });
        }
        if (dimensions.width < expandedRect.width || dimensions.height < expandedRect.height || xChange || yChange) {
          changes.push({
            id: parentId,
            type: "dimensions",
            setAttributes: true,
            dimensions: {
              width: newWidth + (xChange ? origin[0] * xChange - widthChange : 0),
              height: newHeight + (yChange ? origin[1] * yChange - heightChange : 0)
            }
          });
        }
      });
    }
    return changes;
  }
  function updateNodeInternals(updates, nodeLookup, parentLookup, domNode, nodeOrigin, nodeExtent) {
    const viewportNode = domNode?.querySelector(".xyflow__viewport");
    let updatedInternals = false;
    if (!viewportNode) {
      return { changes: [], updatedInternals };
    }
    const changes = [];
    const style = window.getComputedStyle(viewportNode);
    const { m22: zoom2 } = new window.DOMMatrixReadOnly(style.transform);
    const parentExpandChildren = [];
    for (const update of updates.values()) {
      const node = nodeLookup.get(update.id);
      if (!node) {
        continue;
      }
      if (node.hidden) {
        node.internals = {
          ...node.internals,
          handleBounds: void 0
        };
        updatedInternals = true;
      } else {
        const dimensions = getDimensions(update.nodeElement);
        const dimensionChanged = node.measured.width !== dimensions.width || node.measured.height !== dimensions.height;
        const doUpdate = !!(dimensions.width && dimensions.height && (dimensionChanged || !node.internals.handleBounds || update.force));
        if (doUpdate) {
          const nodeBounds = update.nodeElement.getBoundingClientRect();
          const extent = isCoordinateExtent(node.extent) ? node.extent : nodeExtent;
          let { positionAbsolute } = node.internals;
          if (node.parentId && node.extent === "parent") {
            positionAbsolute = clampPositionToParent(positionAbsolute, dimensions, nodeLookup.get(node.parentId));
          } else if (extent) {
            positionAbsolute = clampPosition(positionAbsolute, extent, dimensions);
          }
          node.measured = dimensions;
          node.internals = {
            ...node.internals,
            positionAbsolute,
            handleBounds: {
              source: getHandleBounds("source", update.nodeElement, nodeBounds, zoom2, node.id),
              target: getHandleBounds("target", update.nodeElement, nodeBounds, zoom2, node.id)
            }
          };
          if (node.parentId) {
            updateChildNode(node, nodeLookup, parentLookup, { nodeOrigin });
          }
          updatedInternals = true;
          if (dimensionChanged) {
            changes.push({
              id: node.id,
              type: "dimensions",
              dimensions
            });
            if (node.expandParent && node.parentId) {
              parentExpandChildren.push({
                id: node.id,
                parentId: node.parentId,
                rect: nodeToRect(node, nodeOrigin)
              });
            }
          }
        }
      }
    }
    if (parentExpandChildren.length > 0) {
      const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
      changes.push(...parentExpandChanges);
    }
    return { changes, updatedInternals };
  }
  async function panBy({ delta, panZoom, transform, translateExtent, width, height }) {
    if (!panZoom || !delta.x && !delta.y) {
      return Promise.resolve(false);
    }
    const nextViewport = await panZoom.setViewportConstrained({
      x: transform[0] + delta.x,
      y: transform[1] + delta.y,
      zoom: transform[2]
    }, [
      [0, 0],
      [width, height]
    ], translateExtent);
    const transformChanged = !!nextViewport && (nextViewport.x !== transform[0] || nextViewport.y !== transform[1] || nextViewport.k !== transform[2]);
    return Promise.resolve(transformChanged);
  }
  function updateConnectionLookup(connectionLookup, edgeLookup, edges) {
    connectionLookup.clear();
    edgeLookup.clear();
    for (const edge of edges) {
      const { source, target, sourceHandle = null, targetHandle = null } = edge;
      const sourceKey = `${source}-source-${sourceHandle}`;
      const targetKey = `${target}-target-${targetHandle}`;
      const prevSource = connectionLookup.get(sourceKey) || new Map();
      const prevTarget = connectionLookup.get(targetKey) || new Map();
      const connection = { edgeId: edge.id, source, target, sourceHandle, targetHandle };
      edgeLookup.set(edge.id, edge);
      connectionLookup.set(sourceKey, prevSource.set(`${target}-${targetHandle}`, connection));
      connectionLookup.set(targetKey, prevTarget.set(`${source}-${sourceHandle}`, connection));
    }
  }
  function shallowNodeData(a, b) {
    if (a === null || b === null) {
      return false;
    }
    const _a = Array.isArray(a) ? a : [a];
    const _b = Array.isArray(b) ? b : [b];
    if (_a.length !== _b.length) {
      return false;
    }
    for (let i = 0; i < _a.length; i++) {
      if (_a[i].id !== _b[i].id || _a[i].type !== _b[i].type || !Object.is(_a[i].data, _b[i].data)) {
        return false;
      }
    }
    return true;
  }
  function isParentSelected(node, nodeLookup) {
    if (!node.parentId) {
      return false;
    }
    const parentNode = nodeLookup.get(node.parentId);
    if (!parentNode) {
      return false;
    }
    if (parentNode.selected) {
      return true;
    }
    return isParentSelected(parentNode, nodeLookup);
  }
  function hasSelector(target, selector, domNode) {
    let current = target;
    do {
      if (current?.matches(selector))
        return true;
      if (current === domNode)
        return false;
      current = current.parentElement;
    } while (current);
    return false;
  }
  function getDragItems(nodeLookup, nodesDraggable, mousePos, nodeId) {
    const dragItems = new Map();
    for (const [id, node] of nodeLookup) {
      if ((node.selected || node.id === nodeId) && (!node.parentId || !isParentSelected(node, nodeLookup)) && (node.draggable || nodesDraggable && typeof node.draggable === "undefined")) {
        const internalNode = nodeLookup.get(id);
        if (internalNode) {
          dragItems.set(id, {
            id,
            position: internalNode.position || { x: 0, y: 0 },
            distance: {
              x: mousePos.x - internalNode.internals.positionAbsolute.x,
              y: mousePos.y - internalNode.internals.positionAbsolute.y
            },
            extent: internalNode.extent,
            parentId: internalNode.parentId,
            origin: internalNode.origin,
            expandParent: internalNode.expandParent,
            internals: {
              positionAbsolute: internalNode.internals.positionAbsolute || { x: 0, y: 0 }
            },
            measured: {
              width: internalNode.measured.width ?? 0,
              height: internalNode.measured.height ?? 0
            }
          });
        }
      }
    }
    return dragItems;
  }
  function getEventHandlerParams({ nodeId, dragItems, nodeLookup, dragging = true }) {
    const nodesFromDragItems = [];
    for (const [id, dragItem] of dragItems) {
      const node2 = nodeLookup.get(id)?.internals.userNode;
      if (node2) {
        nodesFromDragItems.push({
          ...node2,
          position: dragItem.position,
          dragging
        });
      }
    }
    if (!nodeId) {
      return [nodesFromDragItems[0], nodesFromDragItems];
    }
    const node = nodeLookup.get(nodeId)?.internals.userNode;
    return [
      !node ? nodesFromDragItems[0] : {
        ...node,
        position: dragItems.get(nodeId)?.position || node.position,
        dragging
      },
      nodesFromDragItems
    ];
  }
  function XYDrag({ onNodeMouseDown, getStoreItems, onDragStart, onDrag, onDragStop }) {
    let lastPos = { x: null, y: null };
    let autoPanId = 0;
    let dragItems = new Map();
    let autoPanStarted = false;
    let mousePosition = { x: 0, y: 0 };
    let containerBounds = null;
    let dragStarted = false;
    let d3Selection$1 = null;
    let abortDrag = false;
    function update({ noDragClassName, handleSelector, domNode, isSelectable, nodeId, nodeClickDistance = 0 }) {
      d3Selection$1 = d3Selection.select(domNode);
      function updateNodes({ x, y }, dragEvent) {
        const { nodeLookup, nodeExtent, snapGrid, snapToGrid, nodeOrigin, onNodeDrag, onSelectionDrag, onError, updateNodePositions } = getStoreItems();
        lastPos = { x, y };
        let hasChange = false;
        let nodesBox = { x: 0, y: 0, x2: 0, y2: 0 };
        if (dragItems.size > 1 && nodeExtent) {
          const rect = getInternalNodesBounds(dragItems);
          nodesBox = rectToBox(rect);
        }
        for (const [id, dragItem] of dragItems) {
          if (!nodeLookup.has(id)) {
            continue;
          }
          let nextPosition = { x: x - dragItem.distance.x, y: y - dragItem.distance.y };
          if (snapToGrid) {
            nextPosition = snapPosition(nextPosition, snapGrid);
          }
          let adjustedNodeExtent = [
            [nodeExtent[0][0], nodeExtent[0][1]],
            [nodeExtent[1][0], nodeExtent[1][1]]
          ];
          if (dragItems.size > 1 && nodeExtent && !dragItem.extent) {
            const { positionAbsolute: positionAbsolute2 } = dragItem.internals;
            const x1 = positionAbsolute2.x - nodesBox.x + nodeExtent[0][0];
            const x2 = positionAbsolute2.x + dragItem.measured.width - nodesBox.x2 + nodeExtent[1][0];
            const y1 = positionAbsolute2.y - nodesBox.y + nodeExtent[0][1];
            const y2 = positionAbsolute2.y + dragItem.measured.height - nodesBox.y2 + nodeExtent[1][1];
            adjustedNodeExtent = [
              [x1, y1],
              [x2, y2]
            ];
          }
          const { position, positionAbsolute } = calculateNodePosition({
            nodeId: id,
            nextPosition,
            nodeLookup,
            nodeExtent: adjustedNodeExtent,
            nodeOrigin,
            onError
          });
          hasChange = hasChange || dragItem.position.x !== position.x || dragItem.position.y !== position.y;
          dragItem.position = position;
          dragItem.internals.positionAbsolute = positionAbsolute;
        }
        if (!hasChange) {
          return;
        }
        updateNodePositions(dragItems, true);
        if (dragEvent && (onDrag || onNodeDrag || !nodeId && onSelectionDrag)) {
          const [currentNode, currentNodes] = getEventHandlerParams({
            nodeId,
            dragItems,
            nodeLookup
          });
          onDrag?.(dragEvent, dragItems, currentNode, currentNodes);
          onNodeDrag?.(dragEvent, currentNode, currentNodes);
          if (!nodeId) {
            onSelectionDrag?.(dragEvent, currentNodes);
          }
        }
      }
      async function autoPan() {
        if (!containerBounds) {
          return;
        }
        const { transform, panBy: panBy2, autoPanSpeed } = getStoreItems();
        const [xMovement, yMovement] = calcAutoPan(mousePosition, containerBounds, autoPanSpeed);
        if (xMovement !== 0 || yMovement !== 0) {
          lastPos.x = (lastPos.x ?? 0) - xMovement / transform[2];
          lastPos.y = (lastPos.y ?? 0) - yMovement / transform[2];
          if (await panBy2({ x: xMovement, y: yMovement })) {
            updateNodes(lastPos, null);
          }
        }
        autoPanId = requestAnimationFrame(autoPan);
      }
      function startDrag(event) {
        const { nodeLookup, multiSelectionActive, nodesDraggable, transform, snapGrid, snapToGrid, selectNodesOnDrag, onNodeDragStart, onSelectionDragStart, unselectNodesAndEdges } = getStoreItems();
        dragStarted = true;
        if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
          if (!nodeLookup.get(nodeId)?.selected) {
            unselectNodesAndEdges();
          }
        }
        if (isSelectable && selectNodesOnDrag && nodeId) {
          onNodeMouseDown?.(nodeId);
        }
        const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid, containerBounds });
        lastPos = pointerPos;
        dragItems = getDragItems(nodeLookup, nodesDraggable, pointerPos, nodeId);
        if (dragItems.size > 0 && (onDragStart || onNodeDragStart || !nodeId && onSelectionDragStart)) {
          const [currentNode, currentNodes] = getEventHandlerParams({
            nodeId,
            dragItems,
            nodeLookup
          });
          onDragStart?.(event.sourceEvent, dragItems, currentNode, currentNodes);
          onNodeDragStart?.(event.sourceEvent, currentNode, currentNodes);
          if (!nodeId) {
            onSelectionDragStart?.(event.sourceEvent, currentNodes);
          }
        }
      }
      const d3DragInstance = d3Drag.drag().clickDistance(nodeClickDistance).on("start", (event) => {
        const { domNode: domNode2, nodeDragThreshold, transform, snapGrid, snapToGrid } = getStoreItems();
        containerBounds = domNode2?.getBoundingClientRect() || null;
        abortDrag = false;
        if (nodeDragThreshold === 0) {
          startDrag(event);
        }
        const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid, containerBounds });
        lastPos = pointerPos;
        mousePosition = getEventPosition(event.sourceEvent, containerBounds);
      }).on("drag", (event) => {
        const { autoPanOnNodeDrag, transform, snapGrid, snapToGrid, nodeDragThreshold, nodeLookup } = getStoreItems();
        const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid, containerBounds });
        if (event.sourceEvent.type === "touchmove" && event.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
        nodeId && !nodeLookup.has(nodeId)) {
          abortDrag = true;
        }
        if (abortDrag) {
          return;
        }
        if (!autoPanStarted && autoPanOnNodeDrag && dragStarted) {
          autoPanStarted = true;
          autoPan();
        }
        if (!dragStarted) {
          const x = pointerPos.xSnapped - (lastPos.x ?? 0);
          const y = pointerPos.ySnapped - (lastPos.y ?? 0);
          const distance2 = Math.sqrt(x * x + y * y);
          if (distance2 > nodeDragThreshold) {
            startDrag(event);
          }
        }
        if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems && dragStarted) {
          mousePosition = getEventPosition(event.sourceEvent, containerBounds);
          updateNodes(pointerPos, event.sourceEvent);
        }
      }).on("end", (event) => {
        if (!dragStarted || abortDrag) {
          return;
        }
        autoPanStarted = false;
        dragStarted = false;
        cancelAnimationFrame(autoPanId);
        if (dragItems.size > 0) {
          const { nodeLookup, updateNodePositions, onNodeDragStop, onSelectionDragStop } = getStoreItems();
          updateNodePositions(dragItems, false);
          if (onDragStop || onNodeDragStop || !nodeId && onSelectionDragStop) {
            const [currentNode, currentNodes] = getEventHandlerParams({
              nodeId,
              dragItems,
              nodeLookup,
              dragging: false
            });
            onDragStop?.(event.sourceEvent, dragItems, currentNode, currentNodes);
            onNodeDragStop?.(event.sourceEvent, currentNode, currentNodes);
            if (!nodeId) {
              onSelectionDragStop?.(event.sourceEvent, currentNodes);
            }
          }
        }
      }).filter((event) => {
        const target = event.target;
        const isDraggable = !event.button && (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, domNode)) && (!handleSelector || hasSelector(target, handleSelector, domNode));
        return isDraggable;
      });
      d3Selection$1.call(d3DragInstance);
    }
    function destroy() {
      d3Selection$1?.on(".drag", null);
    }
    return {
      update,
      destroy
    };
  }
  function getNodesWithinDistance(position, nodeLookup, distance2) {
    const nodes = [];
    const rect = {
      x: position.x - distance2,
      y: position.y - distance2,
      width: distance2 * 2,
      height: distance2 * 2
    };
    for (const node of nodeLookup.values()) {
      if (getOverlappingArea(rect, nodeToRect(node)) > 0) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  var ADDITIONAL_DISTANCE = 250;
  function getClosestHandle(position, connectionRadius, nodeLookup, fromHandle) {
    let closestHandles = [];
    let minDistance = Infinity;
    const closeNodes = getNodesWithinDistance(position, nodeLookup, connectionRadius + ADDITIONAL_DISTANCE);
    for (const node of closeNodes) {
      const allHandles = [...node.internals.handleBounds?.source ?? [], ...node.internals.handleBounds?.target ?? []];
      for (const handle of allHandles) {
        if (fromHandle.nodeId === handle.nodeId && fromHandle.type === handle.type && fromHandle.id === handle.id) {
          continue;
        }
        const { x, y } = getHandlePosition(node, handle, handle.position, true);
        const distance2 = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2));
        if (distance2 > connectionRadius) {
          continue;
        }
        if (distance2 < minDistance) {
          closestHandles = [{ ...handle, x, y }];
          minDistance = distance2;
        } else if (distance2 === minDistance) {
          closestHandles.push({ ...handle, x, y });
        }
      }
    }
    if (!closestHandles.length) {
      return null;
    }
    if (closestHandles.length > 1) {
      const oppositeHandleType = fromHandle.type === "source" ? "target" : "source";
      return closestHandles.find((handle) => handle.type === oppositeHandleType) ?? closestHandles[0];
    }
    return closestHandles[0];
  }
  function getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode, withAbsolutePosition = false) {
    const node = nodeLookup.get(nodeId);
    if (!node) {
      return null;
    }
    const handles = connectionMode === "strict" ? node.internals.handleBounds?.[handleType] : [...node.internals.handleBounds?.source ?? [], ...node.internals.handleBounds?.target ?? []];
    const handle = (handleId ? handles?.find((h) => h.id === handleId) : handles?.[0]) ?? null;
    return handle && withAbsolutePosition ? { ...handle, ...getHandlePosition(node, handle, handle.position, true) } : handle;
  }
  function getHandleType(edgeUpdaterType, handleDomNode) {
    if (edgeUpdaterType) {
      return edgeUpdaterType;
    } else if (handleDomNode?.classList.contains("target")) {
      return "target";
    } else if (handleDomNode?.classList.contains("source")) {
      return "source";
    }
    return null;
  }
  function isConnectionValid(isInsideConnectionRadius, isHandleValid) {
    let isValid = null;
    if (isHandleValid) {
      isValid = true;
    } else if (isInsideConnectionRadius && !isHandleValid) {
      isValid = false;
    }
    return isValid;
  }
  var alwaysValid = () => true;
  function onPointerDown(event, { connectionMode, connectionRadius, handleId, nodeId, edgeUpdaterType, isTarget, domNode, nodeLookup, lib, autoPanOnConnect, flowId, panBy: panBy2, cancelConnection, onConnectStart, onConnect, onConnectEnd, isValidConnection = alwaysValid, onReconnectEnd, updateConnection, getTransform, getFromHandle, autoPanSpeed }) {
    const doc = getHostForElement(event.target);
    let autoPanId = 0;
    let closestHandle;
    const { x, y } = getEventPosition(event);
    const clickedHandle = doc?.elementFromPoint(x, y);
    const handleType = getHandleType(edgeUpdaterType, clickedHandle);
    const containerBounds = domNode?.getBoundingClientRect();
    if (!containerBounds || !handleType) {
      return;
    }
    const fromHandleInternal = getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode);
    if (!fromHandleInternal) {
      return;
    }
    let position = getEventPosition(event, containerBounds);
    let autoPanStarted = false;
    let connection = null;
    let isValid = false;
    let handleDomNode = null;
    function autoPan() {
      if (!autoPanOnConnect || !containerBounds) {
        return;
      }
      const [x2, y2] = calcAutoPan(position, containerBounds, autoPanSpeed);
      panBy2({ x: x2, y: y2 });
      autoPanId = requestAnimationFrame(autoPan);
    }
    const fromHandle = {
      ...fromHandleInternal,
      nodeId,
      type: handleType,
      position: fromHandleInternal.position
    };
    const fromNodeInternal = nodeLookup.get(nodeId);
    const from = getHandlePosition(fromNodeInternal, fromHandle, exports.Position.Left, true);
    const newConnection = {
      inProgress: true,
      isValid: null,
      from,
      fromHandle,
      fromPosition: fromHandle.position,
      fromNode: fromNodeInternal,
      to: position,
      toHandle: null,
      toPosition: oppositePosition[fromHandle.position],
      toNode: null
    };
    updateConnection(newConnection);
    let previousConnection = newConnection;
    onConnectStart?.(event, { nodeId, handleId, handleType });
    function onPointerMove(event2) {
      if (!getFromHandle() || !fromHandle) {
        onPointerUp(event2);
        return;
      }
      const transform = getTransform();
      position = getEventPosition(event2, containerBounds);
      closestHandle = getClosestHandle(pointToRendererPoint(position, transform, false, [1, 1]), connectionRadius, nodeLookup, fromHandle);
      if (!autoPanStarted) {
        autoPan();
        autoPanStarted = true;
      }
      const result = isValidHandle(event2, {
        handle: closestHandle,
        connectionMode,
        fromNodeId: nodeId,
        fromHandleId: handleId,
        fromType: isTarget ? "target" : "source",
        isValidConnection,
        doc,
        lib,
        flowId,
        nodeLookup
      });
      handleDomNode = result.handleDomNode;
      connection = result.connection;
      isValid = isConnectionValid(!!closestHandle, result.isValid);
      const newConnection2 = {
        // from stays the same
        ...previousConnection,
        isValid,
        to: closestHandle && isValid ? rendererPointToPoint({ x: closestHandle.x, y: closestHandle.y }, transform) : position,
        toHandle: result.toHandle,
        toPosition: isValid && result.toHandle ? result.toHandle.position : oppositePosition[fromHandle.position],
        toNode: result.toHandle ? nodeLookup.get(result.toHandle.nodeId) : null
      };
      if (isValid && closestHandle && previousConnection.toHandle && newConnection2.toHandle && previousConnection.toHandle.type === newConnection2.toHandle.type && previousConnection.toHandle.nodeId === newConnection2.toHandle.nodeId && previousConnection.toHandle.id === newConnection2.toHandle.id && previousConnection.to.x === newConnection2.to.x && previousConnection.to.y === newConnection2.to.y) {
        return;
      }
      updateConnection(newConnection2);
      previousConnection = newConnection2;
    }
    function onPointerUp(event2) {
      if ((closestHandle || handleDomNode) && connection && isValid) {
        onConnect?.(connection);
      }
      const { inProgress, ...connectionState } = previousConnection;
      const finalConnectionState = {
        ...connectionState,
        toPosition: previousConnection.toHandle ? previousConnection.toPosition : null
      };
      onConnectEnd?.(event2, finalConnectionState);
      if (edgeUpdaterType) {
        onReconnectEnd?.(event2, finalConnectionState);
      }
      cancelConnection();
      cancelAnimationFrame(autoPanId);
      autoPanStarted = false;
      isValid = false;
      connection = null;
      handleDomNode = null;
      doc.removeEventListener("mousemove", onPointerMove);
      doc.removeEventListener("mouseup", onPointerUp);
      doc.removeEventListener("touchmove", onPointerMove);
      doc.removeEventListener("touchend", onPointerUp);
    }
    doc.addEventListener("mousemove", onPointerMove);
    doc.addEventListener("mouseup", onPointerUp);
    doc.addEventListener("touchmove", onPointerMove);
    doc.addEventListener("touchend", onPointerUp);
  }
  function isValidHandle(event, { handle, connectionMode, fromNodeId, fromHandleId, fromType, doc, lib, flowId, isValidConnection = alwaysValid, nodeLookup }) {
    const isTarget = fromType === "target";
    const handleDomNode = handle ? doc.querySelector(`.${lib}-flow__handle[data-id="${flowId}-${handle?.nodeId}-${handle?.id}-${handle?.type}"]`) : null;
    const { x, y } = getEventPosition(event);
    const handleBelow = doc.elementFromPoint(x, y);
    const handleToCheck = handleBelow?.classList.contains(`${lib}-flow__handle`) ? handleBelow : handleDomNode;
    const result = {
      handleDomNode: handleToCheck,
      isValid: false,
      connection: null,
      toHandle: null
    };
    if (handleToCheck) {
      const handleType = getHandleType(void 0, handleToCheck);
      const handleNodeId = handleToCheck.getAttribute("data-nodeid");
      const handleId = handleToCheck.getAttribute("data-handleid");
      const connectable = handleToCheck.classList.contains("connectable");
      const connectableEnd = handleToCheck.classList.contains("connectableend");
      if (!handleNodeId || !handleType) {
        return result;
      }
      const connection = {
        source: isTarget ? handleNodeId : fromNodeId,
        sourceHandle: isTarget ? handleId : fromHandleId,
        target: isTarget ? fromNodeId : handleNodeId,
        targetHandle: isTarget ? fromHandleId : handleId
      };
      result.connection = connection;
      const isConnectable = connectable && connectableEnd;
      const isValid = isConnectable && (connectionMode === exports.ConnectionMode.Strict ? isTarget && handleType === "source" || !isTarget && handleType === "target" : handleNodeId !== fromNodeId || handleId !== fromHandleId);
      result.isValid = isValid && isValidConnection(connection);
      result.toHandle = getHandle(handleNodeId, handleType, handleId, nodeLookup, connectionMode, false);
    }
    return result;
  }
  var XYHandle = {
    onPointerDown,
    isValid: isValidHandle
  };
  function XYMinimap({ domNode, panZoom, getTransform, getViewScale }) {
    const selection = d3Selection.select(domNode);
    function update({ translateExtent, width, height, zoomStep = 10, pannable = true, zoomable = true, inversePan = false }) {
      const zoomHandler = (event) => {
        const transform = getTransform();
        if (event.sourceEvent.type !== "wheel" || !panZoom) {
          return;
        }
        const pinchDelta = -event.sourceEvent.deltaY * (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 2e-3) * zoomStep;
        const nextZoom = transform[2] * Math.pow(2, pinchDelta);
        panZoom.scaleTo(nextZoom);
      };
      let panStart = [0, 0];
      const panStartHandler = (event) => {
        if (event.sourceEvent.type === "mousedown" || event.sourceEvent.type === "touchstart") {
          panStart = [
            event.sourceEvent.clientX ?? event.sourceEvent.touches[0].clientX,
            event.sourceEvent.clientY ?? event.sourceEvent.touches[0].clientY
          ];
        }
      };
      const panHandler = (event) => {
        const transform = getTransform();
        if (event.sourceEvent.type !== "mousemove" && event.sourceEvent.type !== "touchmove" || !panZoom) {
          return;
        }
        const panCurrent = [
          event.sourceEvent.clientX ?? event.sourceEvent.touches[0].clientX,
          event.sourceEvent.clientY ?? event.sourceEvent.touches[0].clientY
        ];
        const panDelta = [panCurrent[0] - panStart[0], panCurrent[1] - panStart[1]];
        panStart = panCurrent;
        const moveScale = getViewScale() * Math.max(transform[2], Math.log(transform[2])) * (inversePan ? -1 : 1);
        const position = {
          x: transform[0] - panDelta[0] * moveScale,
          y: transform[1] - panDelta[1] * moveScale
        };
        const extent = [
          [0, 0],
          [width, height]
        ];
        panZoom.setViewportConstrained({
          x: position.x,
          y: position.y,
          zoom: transform[2]
        }, extent, translateExtent);
      };
      const zoomAndPanHandler = d3Zoom.zoom().on("start", panStartHandler).on("zoom", pannable ? panHandler : null).on("zoom.wheel", zoomable ? zoomHandler : null);
      selection.call(zoomAndPanHandler, {});
    }
    function destroy() {
      selection.on("zoom", null);
    }
    return {
      update,
      destroy,
      pointer: d3Selection.pointer
    };
  }
  var viewChanged = (prevViewport, eventViewport) => prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;
  var transformToViewport = (transform) => ({
    x: transform.x,
    y: transform.y,
    zoom: transform.k
  });
  var viewportToTransform = ({ x, y, zoom: zoom2 }) => d3Zoom.zoomIdentity.translate(x, y).scale(zoom2);
  var isWrappedWithClass = (event, className) => event.target.closest(`.${className}`);
  var isRightClickPan = (panOnDrag, usedButton) => usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
  var getD3Transition = (selection, duration = 0, onEnd = () => {
  }) => {
    const hasDuration = typeof duration === "number" && duration > 0;
    if (!hasDuration) {
      onEnd();
    }
    return hasDuration ? selection.transition().duration(duration).on("end", onEnd) : selection;
  };
  var wheelDelta = (event) => {
    const factor = event.ctrlKey && isMacOs() ? 10 : 1;
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * factor;
  };
  function createPanOnScrollHandler({ zoomPanValues, noWheelClassName, d3Selection: d3Selection$1, d3Zoom, panOnScrollMode, panOnScrollSpeed, zoomOnPinch, onPanZoomStart, onPanZoom, onPanZoomEnd }) {
    return (event) => {
      if (isWrappedWithClass(event, noWheelClassName)) {
        return false;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      const currentZoom = d3Selection$1.property("__zoom").k || 1;
      if (event.ctrlKey && zoomOnPinch) {
        const point = d3Selection.pointer(event);
        const pinchDelta = wheelDelta(event);
        const zoom2 = currentZoom * Math.pow(2, pinchDelta);
        d3Zoom.scaleTo(d3Selection$1, zoom2, point, event);
        return;
      }
      const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
      let deltaX = panOnScrollMode === exports.PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
      let deltaY = panOnScrollMode === exports.PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
      if (!isMacOs() && event.shiftKey && panOnScrollMode !== exports.PanOnScrollMode.Vertical) {
        deltaX = event.deltaY * deltaNormalize;
        deltaY = 0;
      }
      d3Zoom.translateBy(
        d3Selection$1,
        -(deltaX / currentZoom) * panOnScrollSpeed,
        -(deltaY / currentZoom) * panOnScrollSpeed,
        // @ts-ignore
        { internal: true }
      );
      const nextViewport = transformToViewport(d3Selection$1.property("__zoom"));
      clearTimeout(zoomPanValues.panScrollTimeout);
      if (!zoomPanValues.isPanScrolling) {
        zoomPanValues.isPanScrolling = true;
        onPanZoomStart?.(event, nextViewport);
      }
      if (zoomPanValues.isPanScrolling) {
        onPanZoom?.(event, nextViewport);
        zoomPanValues.panScrollTimeout = setTimeout(() => {
          onPanZoomEnd?.(event, nextViewport);
          zoomPanValues.isPanScrolling = false;
        }, 150);
      }
    };
  }
  function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }) {
    return function(event, d) {
      const preventZoom = !preventScrolling && event.type === "wheel" && !event.ctrlKey;
      if (preventZoom || isWrappedWithClass(event, noWheelClassName)) {
        return null;
      }
      event.preventDefault();
      d3ZoomHandler.call(this, event, d);
    };
  }
  function createPanZoomStartHandler({ zoomPanValues, onDraggingChange, onPanZoomStart }) {
    return (event) => {
      if (event.sourceEvent?.internal) {
        return;
      }
      const viewport = transformToViewport(event.transform);
      zoomPanValues.mouseButton = event.sourceEvent?.button || 0;
      zoomPanValues.isZoomingOrPanning = true;
      zoomPanValues.prevViewport = viewport;
      if (event.sourceEvent?.type === "mousedown") {
        onDraggingChange(true);
      }
      if (onPanZoomStart) {
        onPanZoomStart?.(event.sourceEvent, viewport);
      }
    };
  }
  function createPanZoomHandler({ zoomPanValues, panOnDrag, onPaneContextMenu, onTransformChange, onPanZoom }) {
    return (event) => {
      zoomPanValues.usedRightMouseButton = !!(onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0));
      if (!event.sourceEvent?.sync) {
        onTransformChange([event.transform.x, event.transform.y, event.transform.k]);
      }
      if (onPanZoom && !event.sourceEvent?.internal) {
        onPanZoom?.(event.sourceEvent, transformToViewport(event.transform));
      }
    };
  }
  function createPanZoomEndHandler({ zoomPanValues, panOnDrag, panOnScroll, onDraggingChange, onPanZoomEnd, onPaneContextMenu }) {
    return (event) => {
      if (event.sourceEvent?.internal) {
        return;
      }
      zoomPanValues.isZoomingOrPanning = false;
      if (onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) && !zoomPanValues.usedRightMouseButton && event.sourceEvent) {
        onPaneContextMenu(event.sourceEvent);
      }
      zoomPanValues.usedRightMouseButton = false;
      onDraggingChange(false);
      if (onPanZoomEnd && viewChanged(zoomPanValues.prevViewport, event.transform)) {
        const viewport = transformToViewport(event.transform);
        zoomPanValues.prevViewport = viewport;
        clearTimeout(zoomPanValues.timerId);
        zoomPanValues.timerId = setTimeout(
          () => {
            onPanZoomEnd?.(event.sourceEvent, viewport);
          },
          // we need a setTimeout for panOnScroll to supress multiple end events fired during scroll
          panOnScroll ? 150 : 0
        );
      }
    };
  }
  function createFilter({ zoomActivationKeyPressed, zoomOnScroll, zoomOnPinch, panOnDrag, panOnScroll, zoomOnDoubleClick, userSelectionActive, noWheelClassName, noPanClassName, lib }) {
    return (event) => {
      const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
      const pinchZoom = zoomOnPinch && event.ctrlKey;
      if (event.button === 1 && event.type === "mousedown" && (isWrappedWithClass(event, `${lib}-flow__node`) || isWrappedWithClass(event, `${lib}-flow__edge`))) {
        return true;
      }
      if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
        return false;
      }
      if (userSelectionActive) {
        return false;
      }
      if (isWrappedWithClass(event, noWheelClassName) && event.type === "wheel") {
        return false;
      }
      if (isWrappedWithClass(event, noPanClassName) && (event.type !== "wheel" || panOnScroll && event.type === "wheel" && !zoomActivationKeyPressed)) {
        return false;
      }
      if (!zoomOnPinch && event.ctrlKey && event.type === "wheel") {
        return false;
      }
      if (!zoomOnPinch && event.type === "touchstart" && event.touches?.length > 1) {
        event.preventDefault();
        return false;
      }
      if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === "wheel") {
        return false;
      }
      if (!panOnDrag && (event.type === "mousedown" || event.type === "touchstart")) {
        return false;
      }
      if (Array.isArray(panOnDrag) && !panOnDrag.includes(event.button) && event.type === "mousedown") {
        return false;
      }
      const buttonAllowed = Array.isArray(panOnDrag) && panOnDrag.includes(event.button) || !event.button || event.button <= 1;
      return (!event.ctrlKey || event.type === "wheel") && buttonAllowed;
    };
  }
  function XYPanZoom({ domNode, minZoom, maxZoom, paneClickDistance, translateExtent, viewport, onPanZoom, onPanZoomStart, onPanZoomEnd, onDraggingChange }) {
    const zoomPanValues = {
      isZoomingOrPanning: false,
      usedRightMouseButton: false,
      prevViewport: { x: 0, y: 0, zoom: 0 },
      mouseButton: 0,
      timerId: void 0,
      panScrollTimeout: void 0,
      isPanScrolling: false
    };
    const bbox = domNode.getBoundingClientRect();
    const d3ZoomInstance = d3Zoom.zoom().clickDistance(!isNumeric(paneClickDistance) || paneClickDistance < 0 ? 0 : paneClickDistance).scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
    const d3Selection$1 = d3Selection.select(domNode).call(d3ZoomInstance);
    setViewportConstrained({
      x: viewport.x,
      y: viewport.y,
      zoom: clamp(viewport.zoom, minZoom, maxZoom)
    }, [
      [0, 0],
      [bbox.width, bbox.height]
    ], translateExtent);
    const d3ZoomHandler = d3Selection$1.on("wheel.zoom");
    const d3DblClickZoomHandler = d3Selection$1.on("dblclick.zoom");
    d3ZoomInstance.wheelDelta(wheelDelta);
    function setTransform(transform, options) {
      if (d3Selection$1) {
        return new Promise((resolve) => {
          d3ZoomInstance?.transform(getD3Transition(d3Selection$1, options?.duration, () => resolve(true)), transform);
        });
      }
      return Promise.resolve(false);
    }
    function update({ noWheelClassName, noPanClassName, onPaneContextMenu, userSelectionActive, panOnScroll, panOnDrag, panOnScrollMode, panOnScrollSpeed, preventScrolling, zoomOnPinch, zoomOnScroll, zoomOnDoubleClick, zoomActivationKeyPressed, lib, onTransformChange }) {
      if (userSelectionActive && !zoomPanValues.isZoomingOrPanning) {
        destroy();
      }
      const isPanOnScroll = panOnScroll && !zoomActivationKeyPressed && !userSelectionActive;
      const wheelHandler = isPanOnScroll ? createPanOnScrollHandler({
        zoomPanValues,
        noWheelClassName,
        d3Selection: d3Selection$1,
        d3Zoom: d3ZoomInstance,
        panOnScrollMode,
        panOnScrollSpeed,
        zoomOnPinch,
        onPanZoomStart,
        onPanZoom,
        onPanZoomEnd
      }) : createZoomOnScrollHandler({
        noWheelClassName,
        preventScrolling,
        d3ZoomHandler
      });
      d3Selection$1.on("wheel.zoom", wheelHandler, { passive: false });
      if (!userSelectionActive) {
        const startHandler = createPanZoomStartHandler({
          zoomPanValues,
          onDraggingChange,
          onPanZoomStart
        });
        d3ZoomInstance.on("start", startHandler);
        const panZoomHandler = createPanZoomHandler({
          zoomPanValues,
          panOnDrag,
          onPaneContextMenu: !!onPaneContextMenu,
          onPanZoom,
          onTransformChange
        });
        d3ZoomInstance.on("zoom", panZoomHandler);
        const panZoomEndHandler = createPanZoomEndHandler({
          zoomPanValues,
          panOnDrag,
          panOnScroll,
          onPaneContextMenu,
          onPanZoomEnd,
          onDraggingChange
        });
        d3ZoomInstance.on("end", panZoomEndHandler);
      }
      const filter = createFilter({
        zoomActivationKeyPressed,
        panOnDrag,
        zoomOnScroll,
        panOnScroll,
        zoomOnDoubleClick,
        zoomOnPinch,
        userSelectionActive,
        noPanClassName,
        noWheelClassName,
        lib
      });
      d3ZoomInstance.filter(filter);
      if (zoomOnDoubleClick) {
        d3Selection$1.on("dblclick.zoom", d3DblClickZoomHandler);
      } else {
        d3Selection$1.on("dblclick.zoom", null);
      }
    }
    function destroy() {
      d3ZoomInstance.on("zoom", null);
    }
    async function setViewportConstrained(viewport2, extent, translateExtent2) {
      const nextTransform = viewportToTransform(viewport2);
      const contrainedTransform = d3ZoomInstance?.constrain()(nextTransform, extent, translateExtent2);
      if (contrainedTransform) {
        await setTransform(contrainedTransform);
      }
      return new Promise((resolve) => resolve(contrainedTransform));
    }
    async function setViewport(viewport2, options) {
      const nextTransform = viewportToTransform(viewport2);
      await setTransform(nextTransform, options);
      return new Promise((resolve) => resolve(nextTransform));
    }
    function syncViewport(viewport2) {
      if (d3Selection$1) {
        const nextTransform = viewportToTransform(viewport2);
        const currentTransform = d3Selection$1.property("__zoom");
        if (currentTransform.k !== viewport2.zoom || currentTransform.x !== viewport2.x || currentTransform.y !== viewport2.y) {
          d3ZoomInstance?.transform(d3Selection$1, nextTransform, null, { sync: true });
        }
      }
    }
    function getViewport() {
      const transform = d3Selection$1 ? d3Zoom.zoomTransform(d3Selection$1.node()) : { x: 0, y: 0, k: 1 };
      return { x: transform.x, y: transform.y, zoom: transform.k };
    }
    function scaleTo(zoom2, options) {
      if (d3Selection$1) {
        return new Promise((resolve) => {
          d3ZoomInstance?.scaleTo(getD3Transition(d3Selection$1, options?.duration, () => resolve(true)), zoom2);
        });
      }
      return Promise.resolve(false);
    }
    function scaleBy(factor, options) {
      if (d3Selection$1) {
        return new Promise((resolve) => {
          d3ZoomInstance?.scaleBy(getD3Transition(d3Selection$1, options?.duration, () => resolve(true)), factor);
        });
      }
      return Promise.resolve(false);
    }
    function setScaleExtent(scaleExtent) {
      d3ZoomInstance?.scaleExtent(scaleExtent);
    }
    function setTranslateExtent(translateExtent2) {
      d3ZoomInstance?.translateExtent(translateExtent2);
    }
    function setClickDistance(distance2) {
      const validDistance = !isNumeric(distance2) || distance2 < 0 ? 0 : distance2;
      d3ZoomInstance?.clickDistance(validDistance);
    }
    return {
      update,
      destroy,
      setViewport,
      setViewportConstrained,
      getViewport,
      scaleTo,
      scaleBy,
      setScaleExtent,
      setTranslateExtent,
      syncViewport,
      setClickDistance
    };
  }
  exports.ResizeControlVariant = void 0;
  (function(ResizeControlVariant2) {
    ResizeControlVariant2["Line"] = "line";
    ResizeControlVariant2["Handle"] = "handle";
  })(exports.ResizeControlVariant || (exports.ResizeControlVariant = {}));
  var XY_RESIZER_HANDLE_POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"];
  var XY_RESIZER_LINE_POSITIONS = ["top", "right", "bottom", "left"];
  function getResizeDirection({ width, prevWidth, height, prevHeight, affectsX, affectsY }) {
    const deltaWidth = width - prevWidth;
    const deltaHeight = height - prevHeight;
    const direction = [deltaWidth > 0 ? 1 : deltaWidth < 0 ? -1 : 0, deltaHeight > 0 ? 1 : deltaHeight < 0 ? -1 : 0];
    if (deltaWidth && affectsX) {
      direction[0] = direction[0] * -1;
    }
    if (deltaHeight && affectsY) {
      direction[1] = direction[1] * -1;
    }
    return direction;
  }
  function getControlDirection(controlPosition) {
    const isHorizontal = controlPosition.includes("right") || controlPosition.includes("left");
    const isVertical = controlPosition.includes("bottom") || controlPosition.includes("top");
    const affectsX = controlPosition.includes("left");
    const affectsY = controlPosition.includes("top");
    return {
      isHorizontal,
      isVertical,
      affectsX,
      affectsY
    };
  }
  function getLowerExtentClamp(lowerExtent, lowerBound) {
    return Math.max(0, lowerBound - lowerExtent);
  }
  function getUpperExtentClamp(upperExtent, upperBound) {
    return Math.max(0, upperExtent - upperBound);
  }
  function getSizeClamp(size, minSize, maxSize) {
    return Math.max(0, minSize - size, size - maxSize);
  }
  function xor(a, b) {
    return a ? !b : b;
  }
  function getDimensionsAfterResize(startValues, controlDirection, pointerPosition, boundaries, keepAspectRatio, nodeOrigin, extent, childExtent) {
    let { affectsX, affectsY } = controlDirection;
    const { isHorizontal, isVertical } = controlDirection;
    const isDiagonal = isHorizontal && isVertical;
    const { xSnapped, ySnapped } = pointerPosition;
    const { minWidth, maxWidth, minHeight, maxHeight } = boundaries;
    const { x: startX, y: startY, width: startWidth, height: startHeight, aspectRatio } = startValues;
    let distX = Math.floor(isHorizontal ? xSnapped - startValues.pointerX : 0);
    let distY = Math.floor(isVertical ? ySnapped - startValues.pointerY : 0);
    const newWidth = startWidth + (affectsX ? -distX : distX);
    const newHeight = startHeight + (affectsY ? -distY : distY);
    const originOffsetX = -nodeOrigin[0] * startWidth;
    const originOffsetY = -nodeOrigin[1] * startHeight;
    let clampX = getSizeClamp(newWidth, minWidth, maxWidth);
    let clampY = getSizeClamp(newHeight, minHeight, maxHeight);
    if (extent) {
      let xExtentClamp = 0;
      let yExtentClamp = 0;
      if (affectsX && distX < 0) {
        xExtentClamp = getLowerExtentClamp(startX + distX + originOffsetX, extent[0][0]);
      } else if (!affectsX && distX > 0) {
        xExtentClamp = getUpperExtentClamp(startX + newWidth + originOffsetX, extent[1][0]);
      }
      if (affectsY && distY < 0) {
        yExtentClamp = getLowerExtentClamp(startY + distY + originOffsetY, extent[0][1]);
      } else if (!affectsY && distY > 0) {
        yExtentClamp = getUpperExtentClamp(startY + newHeight + originOffsetY, extent[1][1]);
      }
      clampX = Math.max(clampX, xExtentClamp);
      clampY = Math.max(clampY, yExtentClamp);
    }
    if (childExtent) {
      let xExtentClamp = 0;
      let yExtentClamp = 0;
      if (affectsX && distX > 0) {
        xExtentClamp = getUpperExtentClamp(startX + distX, childExtent[0][0]);
      } else if (!affectsX && distX < 0) {
        xExtentClamp = getLowerExtentClamp(startX + newWidth, childExtent[1][0]);
      }
      if (affectsY && distY > 0) {
        yExtentClamp = getUpperExtentClamp(startY + distY, childExtent[0][1]);
      } else if (!affectsY && distY < 0) {
        yExtentClamp = getLowerExtentClamp(startY + newHeight, childExtent[1][1]);
      }
      clampX = Math.max(clampX, xExtentClamp);
      clampY = Math.max(clampY, yExtentClamp);
    }
    if (keepAspectRatio) {
      if (isHorizontal) {
        const aspectHeightClamp = getSizeClamp(newWidth / aspectRatio, minHeight, maxHeight) * aspectRatio;
        clampX = Math.max(clampX, aspectHeightClamp);
        if (extent) {
          let aspectExtentClamp = 0;
          if (!affectsX && !affectsY || affectsX && !affectsY && isDiagonal) {
            aspectExtentClamp = getUpperExtentClamp(startY + originOffsetY + newWidth / aspectRatio, extent[1][1]) * aspectRatio;
          } else {
            aspectExtentClamp = getLowerExtentClamp(startY + originOffsetY + (affectsX ? distX : -distX) / aspectRatio, extent[0][1]) * aspectRatio;
          }
          clampX = Math.max(clampX, aspectExtentClamp);
        }
        if (childExtent) {
          let aspectExtentClamp = 0;
          if (!affectsX && !affectsY || affectsX && !affectsY && isDiagonal) {
            aspectExtentClamp = getLowerExtentClamp(startY + newWidth / aspectRatio, childExtent[1][1]) * aspectRatio;
          } else {
            aspectExtentClamp = getUpperExtentClamp(startY + (affectsX ? distX : -distX) / aspectRatio, childExtent[0][1]) * aspectRatio;
          }
          clampX = Math.max(clampX, aspectExtentClamp);
        }
      }
      if (isVertical) {
        const aspectWidthClamp = getSizeClamp(newHeight * aspectRatio, minWidth, maxWidth) / aspectRatio;
        clampY = Math.max(clampY, aspectWidthClamp);
        if (extent) {
          let aspectExtentClamp = 0;
          if (!affectsX && !affectsY || affectsY && !affectsX && isDiagonal) {
            aspectExtentClamp = getUpperExtentClamp(startX + newHeight * aspectRatio + originOffsetX, extent[1][0]) / aspectRatio;
          } else {
            aspectExtentClamp = getLowerExtentClamp(startX + (affectsY ? distY : -distY) * aspectRatio + originOffsetX, extent[0][0]) / aspectRatio;
          }
          clampY = Math.max(clampY, aspectExtentClamp);
        }
        if (childExtent) {
          let aspectExtentClamp = 0;
          if (!affectsX && !affectsY || affectsY && !affectsX && isDiagonal) {
            aspectExtentClamp = getLowerExtentClamp(startX + newHeight * aspectRatio, childExtent[1][0]) / aspectRatio;
          } else {
            aspectExtentClamp = getUpperExtentClamp(startX + (affectsY ? distY : -distY) * aspectRatio, childExtent[0][0]) / aspectRatio;
          }
          clampY = Math.max(clampY, aspectExtentClamp);
        }
      }
    }
    distY = distY + (distY < 0 ? clampY : -clampY);
    distX = distX + (distX < 0 ? clampX : -clampX);
    if (keepAspectRatio) {
      if (isDiagonal) {
        if (newWidth > newHeight * aspectRatio) {
          distY = (xor(affectsX, affectsY) ? -distX : distX) / aspectRatio;
        } else {
          distX = (xor(affectsX, affectsY) ? -distY : distY) * aspectRatio;
        }
      } else {
        if (isHorizontal) {
          distY = distX / aspectRatio;
          affectsY = affectsX;
        } else {
          distX = distY * aspectRatio;
          affectsX = affectsY;
        }
      }
    }
    const x = affectsX ? startX + distX : startX;
    const y = affectsY ? startY + distY : startY;
    return {
      width: startWidth + (affectsX ? -distX : distX),
      height: startHeight + (affectsY ? -distY : distY),
      x: nodeOrigin[0] * distX * (!affectsX ? 1 : -1) + x,
      y: nodeOrigin[1] * distY * (!affectsY ? 1 : -1) + y
    };
  }
  var initPrevValues = { width: 0, height: 0, x: 0, y: 0 };
  var initStartValues = {
    ...initPrevValues,
    pointerX: 0,
    pointerY: 0,
    aspectRatio: 1
  };
  function nodeToParentExtent(node) {
    return [
      [0, 0],
      [node.measured.width, node.measured.height]
    ];
  }
  function nodeToChildExtent(child, parent, nodeOrigin) {
    const x = parent.position.x + child.position.x;
    const y = parent.position.y + child.position.y;
    const width = child.measured.width ?? 0;
    const height = child.measured.height ?? 0;
    const originOffsetX = nodeOrigin[0] * width;
    const originOffsetY = nodeOrigin[1] * height;
    return [
      [x - originOffsetX, y - originOffsetY],
      [x + width - originOffsetX, y + height - originOffsetY]
    ];
  }
  function XYResizer({ domNode, nodeId, getStoreItems, onChange, onEnd }) {
    const selection = d3Selection.select(domNode);
    function update({ controlPosition, boundaries, keepAspectRatio, onResizeStart, onResize, onResizeEnd, shouldResize }) {
      let prevValues = { ...initPrevValues };
      let startValues = { ...initStartValues };
      const controlDirection = getControlDirection(controlPosition);
      let node = void 0;
      let containerBounds = null;
      let childNodes = [];
      let parentNode = void 0;
      let parentExtent = void 0;
      let childExtent = void 0;
      const dragHandler = d3Drag.drag().on("start", (event) => {
        const { nodeLookup, transform, snapGrid, snapToGrid, nodeOrigin, paneDomNode } = getStoreItems();
        node = nodeLookup.get(nodeId);
        if (!node) {
          return;
        }
        containerBounds = paneDomNode?.getBoundingClientRect() ?? null;
        const { xSnapped, ySnapped } = getPointerPosition(event.sourceEvent, {
          transform,
          snapGrid,
          snapToGrid,
          containerBounds
        });
        prevValues = {
          width: node.measured.width ?? 0,
          height: node.measured.height ?? 0,
          x: node.position.x ?? 0,
          y: node.position.y ?? 0
        };
        startValues = {
          ...prevValues,
          pointerX: xSnapped,
          pointerY: ySnapped,
          aspectRatio: prevValues.width / prevValues.height
        };
        parentNode = void 0;
        if (node.parentId && (node.extent === "parent" || node.expandParent)) {
          parentNode = nodeLookup.get(node.parentId);
          parentExtent = parentNode && node.extent === "parent" ? nodeToParentExtent(parentNode) : void 0;
        }
        childNodes = [];
        childExtent = void 0;
        for (const [childId, child] of nodeLookup) {
          if (child.parentId === nodeId) {
            childNodes.push({
              id: childId,
              position: { ...child.position },
              extent: child.extent
            });
            if (child.extent === "parent" || child.expandParent) {
              const extent = nodeToChildExtent(child, node, child.origin ?? nodeOrigin);
              if (childExtent) {
                childExtent = [
                  [Math.min(extent[0][0], childExtent[0][0]), Math.min(extent[0][1], childExtent[0][1])],
                  [Math.max(extent[1][0], childExtent[1][0]), Math.max(extent[1][1], childExtent[1][1])]
                ];
              } else {
                childExtent = extent;
              }
            }
          }
        }
        onResizeStart?.(event, { ...prevValues });
      }).on("drag", (event) => {
        const { transform, snapGrid, snapToGrid, nodeOrigin: storeNodeOrigin } = getStoreItems();
        const pointerPosition = getPointerPosition(event.sourceEvent, {
          transform,
          snapGrid,
          snapToGrid,
          containerBounds
        });
        const childChanges = [];
        if (!node) {
          return;
        }
        const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues;
        const change = {};
        const nodeOrigin = node.origin ?? storeNodeOrigin;
        const { width, height, x, y } = getDimensionsAfterResize(startValues, controlDirection, pointerPosition, boundaries, keepAspectRatio, nodeOrigin, parentExtent, childExtent);
        const isWidthChange = width !== prevWidth;
        const isHeightChange = height !== prevHeight;
        const isXPosChange = x !== prevX && isWidthChange;
        const isYPosChange = y !== prevY && isHeightChange;
        if (!isXPosChange && !isYPosChange && !isWidthChange && !isHeightChange) {
          return;
        }
        if (isXPosChange || isYPosChange || nodeOrigin[0] === 1 || nodeOrigin[1] === 1) {
          change.x = isXPosChange ? x : prevValues.x;
          change.y = isYPosChange ? y : prevValues.y;
          prevValues.x = change.x;
          prevValues.y = change.y;
          if (childNodes.length > 0) {
            const xChange = x - prevX;
            const yChange = y - prevY;
            for (const childNode of childNodes) {
              childNode.position = {
                x: childNode.position.x - xChange + nodeOrigin[0] * (width - prevWidth),
                y: childNode.position.y - yChange + nodeOrigin[1] * (height - prevHeight)
              };
              childChanges.push(childNode);
            }
          }
        }
        if (isWidthChange || isHeightChange) {
          change.width = isWidthChange ? width : prevValues.width;
          change.height = isHeightChange ? height : prevValues.height;
          prevValues.width = change.width;
          prevValues.height = change.height;
        }
        if (parentNode && node.expandParent) {
          const xLimit = nodeOrigin[0] * (change.width ?? 0);
          if (change.x && change.x < xLimit) {
            prevValues.x = xLimit;
            startValues.x = startValues.x - (change.x - xLimit);
          }
          const yLimit = nodeOrigin[1] * (change.height ?? 0);
          if (change.y && change.y < yLimit) {
            prevValues.y = yLimit;
            startValues.y = startValues.y - (change.y - yLimit);
          }
        }
        const direction = getResizeDirection({
          width: prevValues.width,
          prevWidth,
          height: prevValues.height,
          prevHeight,
          affectsX: controlDirection.affectsX,
          affectsY: controlDirection.affectsY
        });
        const nextValues = { ...prevValues, direction };
        const callResize = shouldResize?.(event, nextValues);
        if (callResize === false) {
          return;
        }
        onResize?.(event, nextValues);
        onChange(change, childChanges);
      }).on("end", (event) => {
        onResizeEnd?.(event, { ...prevValues });
        onEnd?.();
      });
      selection.call(dragHandler);
    }
    function destroy() {
      selection.on(".drag", null);
    }
    return {
      update,
      destroy
    };
  }
  exports.XYDrag = XYDrag;
  exports.XYHandle = XYHandle;
  exports.XYMinimap = XYMinimap;
  exports.XYPanZoom = XYPanZoom;
  exports.XYResizer = XYResizer;
  exports.XY_RESIZER_HANDLE_POSITIONS = XY_RESIZER_HANDLE_POSITIONS;
  exports.XY_RESIZER_LINE_POSITIONS = XY_RESIZER_LINE_POSITIONS;
  exports.addEdge = addEdge;
  exports.adoptUserNodes = adoptUserNodes;
  exports.areConnectionMapsEqual = areConnectionMapsEqual;
  exports.boxToRect = boxToRect;
  exports.calcAutoPan = calcAutoPan;
  exports.calculateNodePosition = calculateNodePosition;
  exports.clamp = clamp;
  exports.clampPosition = clampPosition;
  exports.clampPositionToParent = clampPositionToParent;
  exports.createMarkerIds = createMarkerIds;
  exports.devWarn = devWarn;
  exports.elementSelectionKeys = elementSelectionKeys;
  exports.errorMessages = errorMessages;
  exports.evaluateAbsolutePosition = evaluateAbsolutePosition;
  exports.fitView = fitView;
  exports.getBezierEdgeCenter = getBezierEdgeCenter;
  exports.getBezierPath = getBezierPath;
  exports.getBoundsOfBoxes = getBoundsOfBoxes;
  exports.getBoundsOfRects = getBoundsOfRects;
  exports.getConnectedEdges = getConnectedEdges;
  exports.getConnectionStatus = getConnectionStatus;
  exports.getDimensions = getDimensions;
  exports.getEdgeCenter = getEdgeCenter;
  exports.getEdgePosition = getEdgePosition;
  exports.getElementsToRemove = getElementsToRemove;
  exports.getElevatedEdgeZIndex = getElevatedEdgeZIndex;
  exports.getEventPosition = getEventPosition;
  exports.getFitViewNodes = getFitViewNodes;
  exports.getHandleBounds = getHandleBounds;
  exports.getHandlePosition = getHandlePosition;
  exports.getHostForElement = getHostForElement;
  exports.getIncomers = getIncomers;
  exports.getInternalNodesBounds = getInternalNodesBounds;
  exports.getMarkerId = getMarkerId;
  exports.getNodeDimensions = getNodeDimensions;
  exports.getNodePositionWithOrigin = getNodePositionWithOrigin;
  exports.getNodeToolbarTransform = getNodeToolbarTransform;
  exports.getNodesBounds = getNodesBounds;
  exports.getNodesInside = getNodesInside;
  exports.getOutgoers = getOutgoers;
  exports.getOverlappingArea = getOverlappingArea;
  exports.getPointerPosition = getPointerPosition;
  exports.getSmoothStepPath = getSmoothStepPath;
  exports.getStraightPath = getStraightPath;
  exports.getViewportForBounds = getViewportForBounds;
  exports.handleConnectionChange = handleConnectionChange;
  exports.handleExpandParent = handleExpandParent;
  exports.infiniteExtent = infiniteExtent;
  exports.initialConnection = initialConnection;
  exports.isCoordinateExtent = isCoordinateExtent;
  exports.isEdgeBase = isEdgeBase;
  exports.isEdgeVisible = isEdgeVisible;
  exports.isInputDOMNode = isInputDOMNode;
  exports.isInternalNodeBase = isInternalNodeBase;
  exports.isMacOs = isMacOs;
  exports.isMouseEvent = isMouseEvent;
  exports.isNodeBase = isNodeBase;
  exports.isNumeric = isNumeric;
  exports.isRectObject = isRectObject;
  exports.nodeHasDimensions = nodeHasDimensions;
  exports.nodeToBox = nodeToBox;
  exports.nodeToRect = nodeToRect;
  exports.oppositePosition = oppositePosition;
  exports.panBy = panBy;
  exports.pointToRendererPoint = pointToRendererPoint;
  exports.reconnectEdge = reconnectEdge;
  exports.rectToBox = rectToBox;
  exports.rendererPointToPoint = rendererPointToPoint;
  exports.shallowNodeData = shallowNodeData;
  exports.snapPosition = snapPosition;
  exports.updateAbsolutePositions = updateAbsolutePositions;
  exports.updateConnectionLookup = updateConnectionLookup;
  exports.updateNodeInternals = updateNodeInternals;
}));
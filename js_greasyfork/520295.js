(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('classcat'), require('@xyflow/system'), require('react'), require('zustand/traditional'), require('zustand/shallow'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'classcat', '@xyflow/system', 'react', 'zustand/traditional', 'zustand/shallow', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.XYFlowReact = {}, global.ReactJSXRuntime, global.classcat, global.XYFlowSystem, global.React, global.ZustandTraditional, global.ZustandShallow, global.ReactDOM));
})(this, (function (exports, jsxRuntime, cc, system, react, traditional, shallow, reactDom) { 'use strict';
  var StoreContext = react.createContext(null);
  var Provider$1 = StoreContext.Provider;
  var zustandErrorMessage = system.errorMessages["error001"]();
  function useStore(selector2, equalityFn) {
    const store = react.useContext(StoreContext);
    if (store === null) {
      throw new Error(zustandErrorMessage);
    }
    return traditional.useStoreWithEqualityFn(store, selector2, equalityFn);
  }
  function useStoreApi() {
    const store = react.useContext(StoreContext);
    if (store === null) {
      throw new Error(zustandErrorMessage);
    }
    return react.useMemo(() => ({
      getState: store.getState,
      setState: store.setState,
      subscribe: store.subscribe
    }), [store]);
  }
  var style = { display: "none" };
  var ariaLiveStyle = {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0px, 0px, 0px, 0px)",
    clipPath: "inset(100%)"
  };
  var ARIA_NODE_DESC_KEY = "react-flow__node-desc";
  var ARIA_EDGE_DESC_KEY = "react-flow__edge-desc";
  var ARIA_LIVE_MESSAGE = "react-flow__aria-live";
  var selector$o = (s) => s.ariaLiveMessage;
  function AriaLiveMessage({ rfId }) {
    const ariaLiveMessage = useStore(selector$o);
    return jsxRuntime.jsx("div", { id: `${ARIA_LIVE_MESSAGE}-${rfId}`, "aria-live": "assertive", "aria-atomic": "true", style: ariaLiveStyle, children: ariaLiveMessage });
  }
  function A11yDescriptions({ rfId, disableKeyboardA11y }) {
    return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs("div", { id: `${ARIA_NODE_DESC_KEY}-${rfId}`, style, children: ["Press enter or space to select a node.", !disableKeyboardA11y && "You can then use the arrow keys to move the node around.", " Press delete to remove it and escape to cancel.", " "] }), jsxRuntime.jsx("div", { id: `${ARIA_EDGE_DESC_KEY}-${rfId}`, style, children: "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel." }), !disableKeyboardA11y && jsxRuntime.jsx(AriaLiveMessage, { rfId })] });
  }
  var selector$n = (s) => s.userSelectionActive ? "none" : "all";
  var Panel = react.forwardRef(({ position = "top-left", children, className, style: style2, ...rest }, ref) => {
    const pointerEvents = useStore(selector$n);
    const positionClasses = `${position}`.split("-");
    return jsxRuntime.jsx("div", { className: cc(["react-flow__panel", className, ...positionClasses]), style: { ...style2, pointerEvents }, ref, ...rest, children });
  });
  function Attribution({ proOptions, position = "bottom-right" }) {
    if (proOptions?.hideAttribution) {
      return null;
    }
    return jsxRuntime.jsx(Panel, { position, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev", children: jsxRuntime.jsx("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
  }
  var selector$m = (s) => {
    const selectedNodes = [];
    const selectedEdges = [];
    for (const [, node] of s.nodeLookup) {
      if (node.selected) {
        selectedNodes.push(node.internals.userNode);
      }
    }
    for (const [, edge] of s.edgeLookup) {
      if (edge.selected) {
        selectedEdges.push(edge);
      }
    }
    return { selectedNodes, selectedEdges };
  };
  var selectId = (obj) => obj.id;
  function areEqual(a, b) {
    return shallow.shallow(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) && shallow.shallow(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId));
  }
  function SelectionListenerInner({ onSelectionChange }) {
    const store = useStoreApi();
    const { selectedNodes, selectedEdges } = useStore(selector$m, areEqual);
    react.useEffect(() => {
      const params = { nodes: selectedNodes, edges: selectedEdges };
      onSelectionChange?.(params);
      store.getState().onSelectionChangeHandlers.forEach((fn) => fn(params));
    }, [selectedNodes, selectedEdges, onSelectionChange]);
    return null;
  }
  var changeSelector = (s) => !!s.onSelectionChangeHandlers;
  function SelectionListener({ onSelectionChange }) {
    const storeHasSelectionChangeHandlers = useStore(changeSelector);
    if (onSelectionChange || storeHasSelectionChangeHandlers) {
      return jsxRuntime.jsx(SelectionListenerInner, { onSelectionChange });
    }
    return null;
  }
  var defaultNodeOrigin = [0, 0];
  var defaultViewport = { x: 0, y: 0, zoom: 1 };
  var reactFlowFieldsToTrack = [
    "nodes",
    "edges",
    "defaultNodes",
    "defaultEdges",
    "onConnect",
    "onConnectStart",
    "onConnectEnd",
    "onClickConnectStart",
    "onClickConnectEnd",
    "nodesDraggable",
    "nodesConnectable",
    "nodesFocusable",
    "edgesFocusable",
    "edgesReconnectable",
    "elevateNodesOnSelect",
    "elevateEdgesOnSelect",
    "minZoom",
    "maxZoom",
    "nodeExtent",
    "onNodesChange",
    "onEdgesChange",
    "elementsSelectable",
    "connectionMode",
    "snapGrid",
    "snapToGrid",
    "translateExtent",
    "connectOnClick",
    "defaultEdgeOptions",
    "fitView",
    "fitViewOptions",
    "onNodesDelete",
    "onEdgesDelete",
    "onDelete",
    "onNodeDrag",
    "onNodeDragStart",
    "onNodeDragStop",
    "onSelectionDrag",
    "onSelectionDragStart",
    "onSelectionDragStop",
    "onMoveStart",
    "onMove",
    "onMoveEnd",
    "noPanClassName",
    "nodeOrigin",
    "autoPanOnConnect",
    "autoPanOnNodeDrag",
    "onError",
    "connectionRadius",
    "isValidConnection",
    "selectNodesOnDrag",
    "nodeDragThreshold",
    "onBeforeDelete",
    "debug",
    "autoPanSpeed",
    "paneClickDistance"
  ];
  var fieldsToTrack = [...reactFlowFieldsToTrack, "rfId"];
  var selector$l = (s) => ({
    setNodes: s.setNodes,
    setEdges: s.setEdges,
    setMinZoom: s.setMinZoom,
    setMaxZoom: s.setMaxZoom,
    setTranslateExtent: s.setTranslateExtent,
    setNodeExtent: s.setNodeExtent,
    reset: s.reset,
    setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
    setPaneClickDistance: s.setPaneClickDistance
  });
  var initPrevValues = {
    translateExtent: system.infiniteExtent,
    nodeOrigin: defaultNodeOrigin,
    minZoom: 0.5,
    maxZoom: 2,
    elementsSelectable: true,
    noPanClassName: "nopan",
    rfId: "1",
    paneClickDistance: 0
  };
  function StoreUpdater(props) {
    const { setNodes, setEdges, setMinZoom, setMaxZoom, setTranslateExtent, setNodeExtent, reset, setDefaultNodesAndEdges, setPaneClickDistance } = useStore(selector$l, shallow.shallow);
    const store = useStoreApi();
    react.useEffect(() => {
      setDefaultNodesAndEdges(props.defaultNodes, props.defaultEdges);
      return () => {
        previousFields.current = initPrevValues;
        reset();
      };
    }, []);
    const previousFields = react.useRef(initPrevValues);
    react.useEffect(
      () => {
        for (const fieldName of fieldsToTrack) {
          const fieldValue = props[fieldName];
          const previousFieldValue = previousFields.current[fieldName];
          if (fieldValue === previousFieldValue)
            continue;
          if (typeof props[fieldName] === "undefined")
            continue;
          if (fieldName === "nodes")
            setNodes(fieldValue);
          else if (fieldName === "edges")
            setEdges(fieldValue);
          else if (fieldName === "minZoom")
            setMinZoom(fieldValue);
          else if (fieldName === "maxZoom")
            setMaxZoom(fieldValue);
          else if (fieldName === "translateExtent")
            setTranslateExtent(fieldValue);
          else if (fieldName === "nodeExtent")
            setNodeExtent(fieldValue);
          else if (fieldName === "paneClickDistance")
            setPaneClickDistance(fieldValue);
          else if (fieldName === "fitView")
            store.setState({ fitViewOnInit: fieldValue });
          else if (fieldName === "fitViewOptions")
            store.setState({ fitViewOnInitOptions: fieldValue });
          else
            store.setState({ [fieldName]: fieldValue });
        }
        previousFields.current = props;
      },
      fieldsToTrack.map((fieldName) => props[fieldName])
    );
    return null;
  }
  function getMediaQuery() {
    if (typeof window === "undefined" || !window.matchMedia) {
      return null;
    }
    return window.matchMedia("(prefers-color-scheme: dark)");
  }
  function useColorModeClass(colorMode) {
    const [colorModeClass, setColorModeClass] = react.useState(colorMode === "system" ? null : colorMode);
    react.useEffect(() => {
      if (colorMode !== "system") {
        setColorModeClass(colorMode);
        return;
      }
      const mediaQuery = getMediaQuery();
      const updateColorModeClass = () => setColorModeClass(mediaQuery?.matches ? "dark" : "light");
      updateColorModeClass();
      mediaQuery?.addEventListener("change", updateColorModeClass);
      return () => {
        mediaQuery?.removeEventListener("change", updateColorModeClass);
      };
    }, [colorMode]);
    return colorModeClass !== null ? colorModeClass : getMediaQuery()?.matches ? "dark" : "light";
  }
  var defaultDoc = typeof document !== "undefined" ? document : null;
  function useKeyPress(keyCode = null, options = { target: defaultDoc, actInsideInputWithModifier: true }) {
    const [keyPressed, setKeyPressed] = react.useState(false);
    const modifierPressed = react.useRef(false);
    const pressedKeys = react.useRef( new Set([]));
    const [keyCodes, keysToWatch] = react.useMemo(() => {
      if (keyCode !== null) {
        const keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
        const keys = keyCodeArr.filter((kc) => typeof kc === "string").map((kc) => kc.replace("+", "\n").replace("\n\n", "\n+").split("\n"));
        const keysFlat = keys.reduce((res, item) => res.concat(...item), []);
        return [keys, keysFlat];
      }
      return [[], []];
    }, [keyCode]);
    react.useEffect(() => {
      const target = options?.target || defaultDoc;
      if (keyCode !== null) {
        const downHandler = (event) => {
          modifierPressed.current = event.ctrlKey || event.metaKey || event.shiftKey;
          const preventAction = (!modifierPressed.current || modifierPressed.current && !options.actInsideInputWithModifier) && system.isInputDOMNode(event);
          if (preventAction) {
            return false;
          }
          const keyOrCode = useKeyOrCode(event.code, keysToWatch);
          pressedKeys.current.add(event[keyOrCode]);
          if (isMatchingKey(keyCodes, pressedKeys.current, false)) {
            event.preventDefault();
            setKeyPressed(true);
          }
        };
        const upHandler = (event) => {
          const preventAction = (!modifierPressed.current || modifierPressed.current && !options.actInsideInputWithModifier) && system.isInputDOMNode(event);
          if (preventAction) {
            return false;
          }
          const keyOrCode = useKeyOrCode(event.code, keysToWatch);
          if (isMatchingKey(keyCodes, pressedKeys.current, true)) {
            setKeyPressed(false);
            pressedKeys.current.clear();
          } else {
            pressedKeys.current.delete(event[keyOrCode]);
          }
          if (event.key === "Meta") {
            pressedKeys.current.clear();
          }
          modifierPressed.current = false;
        };
        const resetHandler = () => {
          pressedKeys.current.clear();
          setKeyPressed(false);
        };
        target?.addEventListener("keydown", downHandler);
        target?.addEventListener("keyup", upHandler);
        window.addEventListener("blur", resetHandler);
        window.addEventListener("contextmenu", resetHandler);
        return () => {
          target?.removeEventListener("keydown", downHandler);
          target?.removeEventListener("keyup", upHandler);
          window.removeEventListener("blur", resetHandler);
          window.removeEventListener("contextmenu", resetHandler);
        };
      }
    }, [keyCode, setKeyPressed]);
    return keyPressed;
  }
  function isMatchingKey(keyCodes, pressedKeys, isUp) {
    return keyCodes.filter((keys) => isUp || keys.length === pressedKeys.size).some((keys) => keys.every((k) => pressedKeys.has(k)));
  }
  function useKeyOrCode(eventCode, keysToWatch) {
    return keysToWatch.includes(eventCode) ? "code" : "key";
  }
  var useViewportHelper = () => {
    const store = useStoreApi();
    return react.useMemo(() => {
      return {
        zoomIn: (options) => {
          const { panZoom } = store.getState();
          return panZoom ? panZoom.scaleBy(1.2, { duration: options?.duration }) : Promise.resolve(false);
        },
        zoomOut: (options) => {
          const { panZoom } = store.getState();
          return panZoom ? panZoom.scaleBy(1 / 1.2, { duration: options?.duration }) : Promise.resolve(false);
        },
        zoomTo: (zoomLevel, options) => {
          const { panZoom } = store.getState();
          return panZoom ? panZoom.scaleTo(zoomLevel, { duration: options?.duration }) : Promise.resolve(false);
        },
        getZoom: () => store.getState().transform[2],
        setViewport: async (viewport, options) => {
          const { transform: [tX, tY, tZoom], panZoom } = store.getState();
          if (!panZoom) {
            return Promise.resolve(false);
          }
          await panZoom.setViewport({
            x: viewport.x ?? tX,
            y: viewport.y ?? tY,
            zoom: viewport.zoom ?? tZoom
          }, { duration: options?.duration });
          return Promise.resolve(true);
        },
        getViewport: () => {
          const [x, y, zoom] = store.getState().transform;
          return { x, y, zoom };
        },
        fitView: (options) => {
          const { nodeLookup, minZoom, maxZoom, panZoom, domNode } = store.getState();
          if (!panZoom || !domNode) {
            return Promise.resolve(false);
          }
          const fitViewNodes = system.getFitViewNodes(nodeLookup, options);
          const { width, height } = system.getDimensions(domNode);
          return system.fitView({
            nodes: fitViewNodes,
            width,
            height,
            minZoom,
            maxZoom,
            panZoom
          }, options);
        },
        setCenter: async (x, y, options) => {
          const { width, height, maxZoom, panZoom } = store.getState();
          const nextZoom = typeof options?.zoom !== "undefined" ? options.zoom : maxZoom;
          const centerX = width / 2 - x * nextZoom;
          const centerY = height / 2 - y * nextZoom;
          if (!panZoom) {
            return Promise.resolve(false);
          }
          await panZoom.setViewport({
            x: centerX,
            y: centerY,
            zoom: nextZoom
          }, { duration: options?.duration });
          return Promise.resolve(true);
        },
        fitBounds: async (bounds, options) => {
          const { width, height, minZoom, maxZoom, panZoom } = store.getState();
          const viewport = system.getViewportForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? 0.1);
          if (!panZoom) {
            return Promise.resolve(false);
          }
          await panZoom.setViewport(viewport, { duration: options?.duration });
          return Promise.resolve(true);
        },
        screenToFlowPosition: (clientPosition, options = { snapToGrid: true }) => {
          const { transform, snapGrid, domNode } = store.getState();
          if (!domNode) {
            return clientPosition;
          }
          const { x: domX, y: domY } = domNode.getBoundingClientRect();
          const correctedPosition = {
            x: clientPosition.x - domX,
            y: clientPosition.y - domY
          };
          return system.pointToRendererPoint(correctedPosition, transform, options.snapToGrid, snapGrid);
        },
        flowToScreenPosition: (flowPosition) => {
          const { transform, domNode } = store.getState();
          if (!domNode) {
            return flowPosition;
          }
          const { x: domX, y: domY } = domNode.getBoundingClientRect();
          const rendererPosition = system.rendererPointToPoint(flowPosition, transform);
          return {
            x: rendererPosition.x + domX,
            y: rendererPosition.y + domY
          };
        }
      };
    }, []);
  };
  function applyChanges(changes, elements) {
    const updatedElements = [];
    const changesMap =  new Map();
    const addItemChanges = [];
    for (const change of changes) {
      if (change.type === "add") {
        addItemChanges.push(change);
        continue;
      } else if (change.type === "remove" || change.type === "replace") {
        changesMap.set(change.id, [change]);
      } else {
        const elementChanges = changesMap.get(change.id);
        if (elementChanges) {
          elementChanges.push(change);
        } else {
          changesMap.set(change.id, [change]);
        }
      }
    }
    for (const element of elements) {
      const changes2 = changesMap.get(element.id);
      if (!changes2) {
        updatedElements.push(element);
        continue;
      }
      if (changes2[0].type === "remove") {
        continue;
      }
      if (changes2[0].type === "replace") {
        updatedElements.push({ ...changes2[0].item });
        continue;
      }
      const updatedElement = { ...element };
      for (const change of changes2) {
        applyChange(change, updatedElement);
      }
      updatedElements.push(updatedElement);
    }
    if (addItemChanges.length) {
      addItemChanges.forEach((change) => {
        if (change.index !== void 0) {
          updatedElements.splice(change.index, 0, { ...change.item });
        } else {
          updatedElements.push({ ...change.item });
        }
      });
    }
    return updatedElements;
  }
  function applyChange(change, element) {
    switch (change.type) {
      case "select": {
        element.selected = change.selected;
        break;
      }
      case "position": {
        if (typeof change.position !== "undefined") {
          element.position = change.position;
        }
        if (typeof change.dragging !== "undefined") {
          element.dragging = change.dragging;
        }
        break;
      }
      case "dimensions": {
        if (typeof change.dimensions !== "undefined") {
          element.measured ??= {};
          element.measured.width = change.dimensions.width;
          element.measured.height = change.dimensions.height;
          if (change.setAttributes) {
            element.width = change.dimensions.width;
            element.height = change.dimensions.height;
          }
        }
        if (typeof change.resizing === "boolean") {
          element.resizing = change.resizing;
        }
        break;
      }
    }
  }
  function applyNodeChanges(changes, nodes) {
    return applyChanges(changes, nodes);
  }
  function applyEdgeChanges(changes, edges) {
    return applyChanges(changes, edges);
  }
  function createSelectionChange(id, selected2) {
    return {
      id,
      type: "select",
      selected: selected2
    };
  }
  function getSelectionChanges(items, selectedIds =  new Set(), mutateItem = false) {
    const changes = [];
    for (const [id, item] of items) {
      const willBeSelected = selectedIds.has(id);
      if (!(item.selected === void 0 && !willBeSelected) && item.selected !== willBeSelected) {
        if (mutateItem) {
          item.selected = willBeSelected;
        }
        changes.push(createSelectionChange(item.id, willBeSelected));
      }
    }
    return changes;
  }
  function getElementsDiffChanges({ items = [], lookup }) {
    const changes = [];
    const itemsLookup = new Map(items.map((item) => [item.id, item]));
    for (const [index2, item] of items.entries()) {
      const lookupItem = lookup.get(item.id);
      const storeItem = lookupItem?.internals?.userNode ?? lookupItem;
      if (storeItem !== void 0 && storeItem !== item) {
        changes.push({ id: item.id, item, type: "replace" });
      }
      if (storeItem === void 0) {
        changes.push({ item, type: "add", index: index2 });
      }
    }
    for (const [id] of lookup) {
      const nextNode = itemsLookup.get(id);
      if (nextNode === void 0) {
        changes.push({ id, type: "remove" });
      }
    }
    return changes;
  }
  function elementToRemoveChange(item) {
    return {
      id: item.id,
      type: "remove"
    };
  }
  var isNode = (element) => system.isNodeBase(element);
  var isEdge = (element) => system.isEdgeBase(element);
  function fixedForwardRef(render) {
    return react.forwardRef(render);
  }
  var useIsomorphicLayoutEffect = typeof window !== "undefined" ? react.useLayoutEffect : react.useEffect;
  function useQueue(runQueue) {
    const [serial, setSerial] = react.useState(BigInt(0));
    const [queue] = react.useState(() => createQueue(() => setSerial((n) => n + BigInt(1))));
    useIsomorphicLayoutEffect(() => {
      const queueItems = queue.get();
      if (queueItems.length) {
        runQueue(queueItems);
        queue.reset();
      }
    }, [serial]);
    return queue;
  }
  function createQueue(cb) {
    let queue = [];
    return {
      get: () => queue,
      reset: () => {
        queue = [];
      },
      push: (item) => {
        queue.push(item);
        cb();
      }
    };
  }
  var BatchContext = react.createContext(null);
  function BatchProvider({ children }) {
    const store = useStoreApi();
    const nodeQueueHandler = react.useCallback((queueItems) => {
      const { nodes = [], setNodes, hasDefaultNodes, onNodesChange, nodeLookup } = store.getState();
      let next = nodes;
      for (const payload of queueItems) {
        next = typeof payload === "function" ? payload(next) : payload;
      }
      if (hasDefaultNodes) {
        setNodes(next);
      } else if (onNodesChange) {
        onNodesChange(getElementsDiffChanges({
          items: next,
          lookup: nodeLookup
        }));
      }
    }, []);
    const nodeQueue = useQueue(nodeQueueHandler);
    const edgeQueueHandler = react.useCallback((queueItems) => {
      const { edges = [], setEdges, hasDefaultEdges, onEdgesChange, edgeLookup } = store.getState();
      let next = edges;
      for (const payload of queueItems) {
        next = typeof payload === "function" ? payload(next) : payload;
      }
      if (hasDefaultEdges) {
        setEdges(next);
      } else if (onEdgesChange) {
        onEdgesChange(getElementsDiffChanges({
          items: next,
          lookup: edgeLookup
        }));
      }
    }, []);
    const edgeQueue = useQueue(edgeQueueHandler);
    const value = react.useMemo(() => ({ nodeQueue, edgeQueue }), []);
    return jsxRuntime.jsx(BatchContext.Provider, { value, children });
  }
  function useBatchContext() {
    const batchContext = react.useContext(BatchContext);
    if (!batchContext) {
      throw new Error("useBatchContext must be used within a BatchProvider");
    }
    return batchContext;
  }
  var selector$k = (s) => !!s.panZoom;
  function useReactFlow() {
    const viewportHelper = useViewportHelper();
    const store = useStoreApi();
    const batchContext = useBatchContext();
    const viewportInitialized = useStore(selector$k);
    const generalHelper = react.useMemo(() => {
      const getInternalNode = (id) => store.getState().nodeLookup.get(id);
      const setNodes = (payload) => {
        batchContext.nodeQueue.push(payload);
      };
      const setEdges = (payload) => {
        batchContext.edgeQueue.push(payload);
      };
      const getNodeRect = (node) => {
        const { nodeLookup, nodeOrigin } = store.getState();
        const nodeToUse = isNode(node) ? node : nodeLookup.get(node.id);
        const position = nodeToUse.parentId ? system.evaluateAbsolutePosition(nodeToUse.position, nodeToUse.measured, nodeToUse.parentId, nodeLookup, nodeOrigin) : nodeToUse.position;
        const nodeWithPosition = {
          ...nodeToUse,
          position,
          width: nodeToUse.measured?.width ?? nodeToUse.width,
          height: nodeToUse.measured?.height ?? nodeToUse.height
        };
        return system.nodeToRect(nodeWithPosition);
      };
      const updateNode = (id, nodeUpdate, options = { replace: false }) => {
        setNodes((prevNodes) => prevNodes.map((node) => {
          if (node.id === id) {
            const nextNode = typeof nodeUpdate === "function" ? nodeUpdate(node) : nodeUpdate;
            return options.replace && isNode(nextNode) ? nextNode : { ...node, ...nextNode };
          }
          return node;
        }));
      };
      const updateEdge = (id, edgeUpdate, options = { replace: false }) => {
        setEdges((prevEdges) => prevEdges.map((edge) => {
          if (edge.id === id) {
            const nextEdge = typeof edgeUpdate === "function" ? edgeUpdate(edge) : edgeUpdate;
            return options.replace && isEdge(nextEdge) ? nextEdge : { ...edge, ...nextEdge };
          }
          return edge;
        }));
      };
      return {
        getNodes: () => store.getState().nodes.map((n) => ({ ...n })),
        getNode: (id) => getInternalNode(id)?.internals.userNode,
        getInternalNode,
        getEdges: () => {
          const { edges = [] } = store.getState();
          return edges.map((e) => ({ ...e }));
        },
        getEdge: (id) => store.getState().edgeLookup.get(id),
        setNodes,
        setEdges,
        addNodes: (payload) => {
          const newNodes = Array.isArray(payload) ? payload : [payload];
          batchContext.nodeQueue.push((nodes) => [...nodes, ...newNodes]);
        },
        addEdges: (payload) => {
          const newEdges = Array.isArray(payload) ? payload : [payload];
          batchContext.edgeQueue.push((edges) => [...edges, ...newEdges]);
        },
        toObject: () => {
          const { nodes = [], edges = [], transform } = store.getState();
          const [x, y, zoom] = transform;
          return {
            nodes: nodes.map((n) => ({ ...n })),
            edges: edges.map((e) => ({ ...e })),
            viewport: {
              x,
              y,
              zoom
            }
          };
        },
        deleteElements: async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
          const { nodes, edges, onNodesDelete, onEdgesDelete, triggerNodeChanges, triggerEdgeChanges, onDelete, onBeforeDelete } = store.getState();
          const { nodes: matchingNodes, edges: matchingEdges } = await system.getElementsToRemove({
            nodesToRemove,
            edgesToRemove,
            nodes,
            edges,
            onBeforeDelete
          });
          const hasMatchingEdges = matchingEdges.length > 0;
          const hasMatchingNodes = matchingNodes.length > 0;
          if (hasMatchingEdges) {
            const edgeChanges = matchingEdges.map(elementToRemoveChange);
            onEdgesDelete?.(matchingEdges);
            triggerEdgeChanges(edgeChanges);
          }
          if (hasMatchingNodes) {
            const nodeChanges = matchingNodes.map(elementToRemoveChange);
            onNodesDelete?.(matchingNodes);
            triggerNodeChanges(nodeChanges);
          }
          if (hasMatchingNodes || hasMatchingEdges) {
            onDelete?.({ nodes: matchingNodes, edges: matchingEdges });
          }
          return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
        },
        getIntersectingNodes: (nodeOrRect, partially = true, nodes) => {
          const isRect = system.isRectObject(nodeOrRect);
          const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
          const hasNodesOption = nodes !== void 0;
          if (!nodeRect) {
            return [];
          }
          return (nodes || store.getState().nodes).filter((n) => {
            const internalNode = store.getState().nodeLookup.get(n.id);
            if (internalNode && !isRect && (n.id === nodeOrRect.id || !internalNode.internals.positionAbsolute)) {
              return false;
            }
            const currNodeRect = system.nodeToRect(hasNodesOption ? n : internalNode);
            const overlappingArea = system.getOverlappingArea(currNodeRect, nodeRect);
            const partiallyVisible = partially && overlappingArea > 0;
            return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
          });
        },
        isNodeIntersecting: (nodeOrRect, area, partially = true) => {
          const isRect = system.isRectObject(nodeOrRect);
          const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
          if (!nodeRect) {
            return false;
          }
          const overlappingArea = system.getOverlappingArea(nodeRect, area);
          const partiallyVisible = partially && overlappingArea > 0;
          return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
        },
        updateNode,
        updateNodeData: (id, dataUpdate, options = { replace: false }) => {
          updateNode(id, (node) => {
            const nextData = typeof dataUpdate === "function" ? dataUpdate(node) : dataUpdate;
            return options.replace ? { ...node, data: nextData } : { ...node, data: { ...node.data, ...nextData } };
          }, options);
        },
        updateEdge,
        updateEdgeData: (id, dataUpdate, options = { replace: false }) => {
          updateEdge(id, (edge) => {
            const nextData = typeof dataUpdate === "function" ? dataUpdate(edge) : dataUpdate;
            return options.replace ? { ...edge, data: nextData } : { ...edge, data: { ...edge.data, ...nextData } };
          }, options);
        },
        getNodesBounds: (nodes) => {
          const { nodeLookup, nodeOrigin } = store.getState();
          return system.getNodesBounds(nodes, { nodeLookup, nodeOrigin });
        },
        getHandleConnections: ({ type, id, nodeId }) => Array.from(store.getState().connectionLookup.get(`${nodeId}-${type}-${id ?? null}`)?.values() ?? [])
      };
    }, []);
    return react.useMemo(() => {
      return {
        ...generalHelper,
        ...viewportHelper,
        viewportInitialized
      };
    }, [viewportInitialized]);
  }
  var selected = (item) => item.selected;
  var deleteKeyOptions = { actInsideInputWithModifier: false };
  var win$1 = typeof window !== "undefined" ? window : void 0;
  function useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode }) {
    const store = useStoreApi();
    const { deleteElements } = useReactFlow();
    const deleteKeyPressed = useKeyPress(deleteKeyCode, deleteKeyOptions);
    const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode, { target: win$1 });
    react.useEffect(() => {
      if (deleteKeyPressed) {
        const { edges, nodes } = store.getState();
        deleteElements({ nodes: nodes.filter(selected), edges: edges.filter(selected) });
        store.setState({ nodesSelectionActive: false });
      }
    }, [deleteKeyPressed]);
    react.useEffect(() => {
      store.setState({ multiSelectionActive: multiSelectionKeyPressed });
    }, [multiSelectionKeyPressed]);
  }
  function useResizeHandler(domNode) {
    const store = useStoreApi();
    react.useEffect(() => {
      const updateDimensions = () => {
        if (!domNode.current) {
          return false;
        }
        const size = system.getDimensions(domNode.current);
        if (size.height === 0 || size.width === 0) {
          store.getState().onError?.("004", system.errorMessages["error004"]());
        }
        store.setState({ width: size.width || 500, height: size.height || 500 });
      };
      if (domNode.current) {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        const resizeObserver = new ResizeObserver(() => updateDimensions());
        resizeObserver.observe(domNode.current);
        return () => {
          window.removeEventListener("resize", updateDimensions);
          if (resizeObserver && domNode.current) {
            resizeObserver.unobserve(domNode.current);
          }
        };
      }
    }, []);
  }
  var containerStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
  };
  var selector$j = (s) => ({
    userSelectionActive: s.userSelectionActive,
    lib: s.lib
  });
  function ZoomPane({ onPaneContextMenu, zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = system.PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling = true, children, noWheelClassName, noPanClassName, onViewportChange, isControlledViewport, paneClickDistance }) {
    const store = useStoreApi();
    const zoomPane = react.useRef(null);
    const { userSelectionActive, lib } = useStore(selector$j, shallow.shallow);
    const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
    const panZoom = react.useRef();
    useResizeHandler(zoomPane);
    const onTransformChange = react.useCallback((transform) => {
      onViewportChange?.({ x: transform[0], y: transform[1], zoom: transform[2] });
      if (!isControlledViewport) {
        store.setState({ transform });
      }
    }, [onViewportChange, isControlledViewport]);
    react.useEffect(() => {
      if (zoomPane.current) {
        panZoom.current = system.XYPanZoom({
          domNode: zoomPane.current,
          minZoom,
          maxZoom,
          translateExtent,
          viewport: defaultViewport2,
          paneClickDistance,
          onDraggingChange: (paneDragging) => store.setState({ paneDragging }),
          onPanZoomStart: (event, vp) => {
            const { onViewportChangeStart, onMoveStart } = store.getState();
            onMoveStart?.(event, vp);
            onViewportChangeStart?.(vp);
          },
          onPanZoom: (event, vp) => {
            const { onViewportChange: onViewportChange2, onMove } = store.getState();
            onMove?.(event, vp);
            onViewportChange2?.(vp);
          },
          onPanZoomEnd: (event, vp) => {
            const { onViewportChangeEnd, onMoveEnd } = store.getState();
            onMoveEnd?.(event, vp);
            onViewportChangeEnd?.(vp);
          }
        });
        const { x, y, zoom } = panZoom.current.getViewport();
        store.setState({
          panZoom: panZoom.current,
          transform: [x, y, zoom],
          domNode: zoomPane.current.closest(".react-flow")
        });
        return () => {
          panZoom.current?.destroy();
        };
      }
    }, []);
    react.useEffect(() => {
      panZoom.current?.update({
        onPaneContextMenu,
        zoomOnScroll,
        zoomOnPinch,
        panOnScroll,
        panOnScrollSpeed,
        panOnScrollMode,
        zoomOnDoubleClick,
        panOnDrag,
        zoomActivationKeyPressed,
        preventScrolling,
        noPanClassName,
        userSelectionActive,
        noWheelClassName,
        lib,
        onTransformChange
      });
    }, [
      onPaneContextMenu,
      zoomOnScroll,
      zoomOnPinch,
      panOnScroll,
      panOnScrollSpeed,
      panOnScrollMode,
      zoomOnDoubleClick,
      panOnDrag,
      zoomActivationKeyPressed,
      preventScrolling,
      noPanClassName,
      userSelectionActive,
      noWheelClassName,
      lib,
      onTransformChange
    ]);
    return jsxRuntime.jsx("div", { className: "react-flow__renderer", ref: zoomPane, style: containerStyle, children });
  }
  var selector$i = (s) => ({
    userSelectionActive: s.userSelectionActive,
    userSelectionRect: s.userSelectionRect
  });
  function UserSelection() {
    const { userSelectionActive, userSelectionRect } = useStore(selector$i, shallow.shallow);
    const isActive = userSelectionActive && userSelectionRect;
    if (!isActive) {
      return null;
    }
    return jsxRuntime.jsx("div", { className: "react-flow__selection react-flow__container", style: {
      width: userSelectionRect.width,
      height: userSelectionRect.height,
      transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`
    } });
  }
  var wrapHandler = (handler, containerRef) => {
    return (event) => {
      if (event.target !== containerRef.current) {
        return;
      }
      handler?.(event);
    };
  };
  var selector$h = (s) => ({
    userSelectionActive: s.userSelectionActive,
    elementsSelectable: s.elementsSelectable,
    dragging: s.paneDragging
  });
  function Pane({ isSelecting, selectionKeyPressed, selectionMode = system.SelectionMode.Full, panOnDrag, selectionOnDrag, onSelectionStart, onSelectionEnd, onPaneClick, onPaneContextMenu, onPaneScroll, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, children }) {
    const container = react.useRef(null);
    const store = useStoreApi();
    const prevSelectedNodesCount = react.useRef(0);
    const prevSelectedEdgesCount = react.useRef(0);
    const containerBounds = react.useRef();
    const edgeIdLookup = react.useRef( new Map());
    const { userSelectionActive, elementsSelectable, dragging } = useStore(selector$h, shallow.shallow);
    const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);
    const selectionInProgress = react.useRef(false);
    const selectionStarted = react.useRef(false);
    const resetUserSelection = () => {
      store.setState({ userSelectionActive: false, userSelectionRect: null });
      prevSelectedNodesCount.current = 0;
      prevSelectedEdgesCount.current = 0;
    };
    const onClick = (event) => {
      if (selectionInProgress.current) {
        selectionInProgress.current = false;
        return;
      }
      onPaneClick?.(event);
      store.getState().resetSelectedElements();
      store.setState({ nodesSelectionActive: false });
    };
    const onContextMenu = (event) => {
      if (Array.isArray(panOnDrag) && panOnDrag?.includes(2)) {
        event.preventDefault();
        return;
      }
      onPaneContextMenu?.(event);
    };
    const onWheel = onPaneScroll ? (event) => onPaneScroll(event) : void 0;
    const onPointerDown = (event) => {
      const { resetSelectedElements, domNode, edgeLookup } = store.getState();
      containerBounds.current = domNode?.getBoundingClientRect();
      if (!elementsSelectable || !isSelecting || event.button !== 0 || event.target !== container.current || !containerBounds.current) {
        return;
      }
      event.target?.setPointerCapture?.(event.pointerId);
      selectionStarted.current = true;
      selectionInProgress.current = false;
      edgeIdLookup.current =  new Map();
      for (const [id, edge] of edgeLookup) {
        edgeIdLookup.current.set(edge.source, edgeIdLookup.current.get(edge.source)?.add(id) ||  new Set([id]));
        edgeIdLookup.current.set(edge.target, edgeIdLookup.current.get(edge.target)?.add(id) ||  new Set([id]));
      }
      const { x, y } = system.getEventPosition(event.nativeEvent, containerBounds.current);
      resetSelectedElements();
      store.setState({
        userSelectionRect: {
          width: 0,
          height: 0,
          startX: x,
          startY: y,
          x,
          y
        }
      });
      onSelectionStart?.(event);
    };
    const onPointerMove = (event) => {
      const { userSelectionRect, edgeLookup, transform, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = store.getState();
      if (!containerBounds.current || !userSelectionRect) {
        return;
      }
      selectionInProgress.current = true;
      const { x: mouseX, y: mouseY } = system.getEventPosition(event.nativeEvent, containerBounds.current);
      const { startX, startY } = userSelectionRect;
      const nextUserSelectRect = {
        startX,
        startY,
        x: mouseX < startX ? mouseX : startX,
        y: mouseY < startY ? mouseY : startY,
        width: Math.abs(mouseX - startX),
        height: Math.abs(mouseY - startY)
      };
      const selectedNodes = system.getNodesInside(nodeLookup, nextUserSelectRect, transform, selectionMode === system.SelectionMode.Partial, true);
      const selectedEdgeIds =  new Set();
      const selectedNodeIds =  new Set();
      for (const selectedNode of selectedNodes) {
        selectedNodeIds.add(selectedNode.id);
        const edgeIds = edgeIdLookup.current.get(selectedNode.id);
        if (edgeIds) {
          for (const edgeId of edgeIds) {
            selectedEdgeIds.add(edgeId);
          }
        }
      }
      if (prevSelectedNodesCount.current !== selectedNodeIds.size) {
        prevSelectedNodesCount.current = selectedNodeIds.size;
        const changes = getSelectionChanges(nodeLookup, selectedNodeIds, true);
        triggerNodeChanges(changes);
      }
      if (prevSelectedEdgesCount.current !== selectedEdgeIds.size) {
        prevSelectedEdgesCount.current = selectedEdgeIds.size;
        const changes = getSelectionChanges(edgeLookup, selectedEdgeIds);
        triggerEdgeChanges(changes);
      }
      store.setState({
        userSelectionRect: nextUserSelectRect,
        userSelectionActive: true,
        nodesSelectionActive: false
      });
    };
    const onPointerUp = (event) => {
      if (event.button !== 0 || !selectionStarted.current) {
        return;
      }
      event.target?.releasePointerCapture?.(event.pointerId);
      const { userSelectionRect } = store.getState();
      if (!userSelectionActive && userSelectionRect && event.target === container.current) {
        onClick?.(event);
      }
      if (prevSelectedNodesCount.current > 0) {
        store.setState({ nodesSelectionActive: true });
      }
      resetUserSelection();
      onSelectionEnd?.(event);
      if (selectionKeyPressed || selectionOnDrag) {
        selectionInProgress.current = false;
      }
      selectionStarted.current = false;
    };
    const draggable = panOnDrag === true || Array.isArray(panOnDrag) && panOnDrag.includes(0);
    return jsxRuntime.jsxs("div", { className: cc(["react-flow__pane", { draggable, dragging, selection: isSelecting }]), onClick: hasActiveSelection ? void 0 : wrapHandler(onClick, container), onContextMenu: wrapHandler(onContextMenu, container), onWheel: wrapHandler(onWheel, container), onPointerEnter: hasActiveSelection ? void 0 : onPaneMouseEnter, onPointerDown: hasActiveSelection ? onPointerDown : onPaneMouseMove, onPointerMove: hasActiveSelection ? onPointerMove : onPaneMouseMove, onPointerUp: hasActiveSelection ? onPointerUp : void 0, onPointerLeave: onPaneMouseLeave, ref: container, style: containerStyle, children: [children, jsxRuntime.jsx(UserSelection, {})] });
  }
  function handleNodeClick({ id, store, unselect = false, nodeRef }) {
    const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeLookup, onError } = store.getState();
    const node = nodeLookup.get(id);
    if (!node) {
      onError?.("012", system.errorMessages["error012"](id));
      return;
    }
    store.setState({ nodesSelectionActive: false });
    if (!node.selected) {
      addSelectedNodes([id]);
    } else if (unselect || node.selected && multiSelectionActive) {
      unselectNodesAndEdges({ nodes: [node], edges: [] });
      requestAnimationFrame(() => nodeRef?.current?.blur());
    }
  }
  function useDrag({ nodeRef, disabled = false, noDragClassName, handleSelector, nodeId, isSelectable, nodeClickDistance }) {
    const store = useStoreApi();
    const [dragging, setDragging] = react.useState(false);
    const xyDrag = react.useRef();
    react.useEffect(() => {
      xyDrag.current = system.XYDrag({
        getStoreItems: () => store.getState(),
        onNodeMouseDown: (id) => {
          handleNodeClick({
            id,
            store,
            nodeRef
          });
        },
        onDragStart: () => {
          setDragging(true);
        },
        onDragStop: () => {
          setDragging(false);
        }
      });
    }, []);
    react.useEffect(() => {
      if (disabled) {
        xyDrag.current?.destroy();
      } else if (nodeRef.current) {
        xyDrag.current?.update({
          noDragClassName,
          handleSelector,
          domNode: nodeRef.current,
          isSelectable,
          nodeId,
          nodeClickDistance
        });
        return () => {
          xyDrag.current?.destroy();
        };
      }
    }, [noDragClassName, handleSelector, disabled, isSelectable, nodeRef, nodeId]);
    return dragging;
  }
  var selectedAndDraggable = (nodesDraggable) => (n) => n.selected && (n.draggable || nodesDraggable && typeof n.draggable === "undefined");
  function useMoveSelectedNodes() {
    const store = useStoreApi();
    const moveSelectedNodes = react.useCallback((params) => {
      const { nodeExtent, snapToGrid, snapGrid, nodesDraggable, onError, updateNodePositions, nodeLookup, nodeOrigin } = store.getState();
      const nodeUpdates =  new Map();
      const isSelected = selectedAndDraggable(nodesDraggable);
      const xVelo = snapToGrid ? snapGrid[0] : 5;
      const yVelo = snapToGrid ? snapGrid[1] : 5;
      const xDiff = params.direction.x * xVelo * params.factor;
      const yDiff = params.direction.y * yVelo * params.factor;
      for (const [, node] of nodeLookup) {
        if (!isSelected(node)) {
          continue;
        }
        let nextPosition = {
          x: node.internals.positionAbsolute.x + xDiff,
          y: node.internals.positionAbsolute.y + yDiff
        };
        if (snapToGrid) {
          nextPosition = system.snapPosition(nextPosition, snapGrid);
        }
        const { position, positionAbsolute } = system.calculateNodePosition({
          nodeId: node.id,
          nextPosition,
          nodeLookup,
          nodeExtent,
          nodeOrigin,
          onError
        });
        node.position = position;
        node.internals.positionAbsolute = positionAbsolute;
        nodeUpdates.set(node.id, node);
      }
      updateNodePositions(nodeUpdates);
    }, []);
    return moveSelectedNodes;
  }
  var NodeIdContext = react.createContext(null);
  var Provider = NodeIdContext.Provider;
  NodeIdContext.Consumer;
  var useNodeId = () => {
    const nodeId = react.useContext(NodeIdContext);
    return nodeId;
  };
  var selector$g = (s) => ({
    connectOnClick: s.connectOnClick,
    noPanClassName: s.noPanClassName,
    rfId: s.rfId
  });
  var connectingSelector = (nodeId, handleId, type) => (state) => {
    const { connectionClickStartHandle: clickHandle, connectionMode, connection } = state;
    const { fromHandle, toHandle, isValid } = connection;
    const connectingTo = toHandle?.nodeId === nodeId && toHandle?.id === handleId && toHandle?.type === type;
    return {
      connectingFrom: fromHandle?.nodeId === nodeId && fromHandle?.id === handleId && fromHandle?.type === type,
      connectingTo,
      clickConnecting: clickHandle?.nodeId === nodeId && clickHandle?.id === handleId && clickHandle?.type === type,
      isPossibleEndHandle: connectionMode === system.ConnectionMode.Strict ? fromHandle?.type !== type : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id,
      connectionInProcess: !!fromHandle,
      valid: connectingTo && isValid
    };
  };
  function HandleComponent({ type = "source", position = system.Position.Top, isValidConnection, isConnectable = true, isConnectableStart = true, isConnectableEnd = true, id, onConnect, children, className, onMouseDown, onTouchStart, ...rest }, ref) {
    const handleId = id || null;
    const isTarget = type === "target";
    const store = useStoreApi();
    const nodeId = useNodeId();
    const { connectOnClick, noPanClassName, rfId } = useStore(selector$g, shallow.shallow);
    const { connectingFrom, connectingTo, clickConnecting, isPossibleEndHandle, connectionInProcess, valid } = useStore(connectingSelector(nodeId, handleId, type), shallow.shallow);
    if (!nodeId) {
      store.getState().onError?.("010", system.errorMessages["error010"]());
    }
    const onConnectExtended = (params) => {
      const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();
      const edgeParams = {
        ...defaultEdgeOptions,
        ...params
      };
      if (hasDefaultEdges) {
        const { edges, setEdges } = store.getState();
        setEdges(system.addEdge(edgeParams, edges));
      }
      onConnectAction?.(edgeParams);
      onConnect?.(edgeParams);
    };
    const onPointerDown = (event) => {
      if (!nodeId) {
        return;
      }
      const isMouseTriggered = system.isMouseEvent(event.nativeEvent);
      if (isConnectableStart && (isMouseTriggered && event.button === 0 || !isMouseTriggered)) {
        const currentStore = store.getState();
        system.XYHandle.onPointerDown(event.nativeEvent, {
          autoPanOnConnect: currentStore.autoPanOnConnect,
          connectionMode: currentStore.connectionMode,
          connectionRadius: currentStore.connectionRadius,
          domNode: currentStore.domNode,
          nodeLookup: currentStore.nodeLookup,
          lib: currentStore.lib,
          isTarget,
          handleId,
          nodeId,
          flowId: currentStore.rfId,
          panBy: currentStore.panBy,
          cancelConnection: currentStore.cancelConnection,
          onConnectStart: currentStore.onConnectStart,
          onConnectEnd: currentStore.onConnectEnd,
          updateConnection: currentStore.updateConnection,
          onConnect: onConnectExtended,
          isValidConnection: isValidConnection || currentStore.isValidConnection,
          getTransform: () => store.getState().transform,
          getFromHandle: () => store.getState().connection.fromHandle,
          autoPanSpeed: currentStore.autoPanSpeed
        });
      }
      if (isMouseTriggered) {
        onMouseDown?.(event);
      } else {
        onTouchStart?.(event);
      }
    };
    const onClick = (event) => {
      const { onClickConnectStart, onClickConnectEnd, connectionClickStartHandle, connectionMode, isValidConnection: isValidConnectionStore, lib, rfId: flowId, nodeLookup, connection: connectionState } = store.getState();
      if (!nodeId || !connectionClickStartHandle && !isConnectableStart) {
        return;
      }
      if (!connectionClickStartHandle) {
        onClickConnectStart?.(event.nativeEvent, { nodeId, handleId, handleType: type });
        store.setState({ connectionClickStartHandle: { nodeId, type, id: handleId } });
        return;
      }
      const doc = system.getHostForElement(event.target);
      const isValidConnectionHandler = isValidConnection || isValidConnectionStore;
      const { connection, isValid } = system.XYHandle.isValid(event.nativeEvent, {
        handle: {
          nodeId,
          id: handleId,
          type
        },
        connectionMode,
        fromNodeId: connectionClickStartHandle.nodeId,
        fromHandleId: connectionClickStartHandle.id || null,
        fromType: connectionClickStartHandle.type,
        isValidConnection: isValidConnectionHandler,
        flowId,
        doc,
        lib,
        nodeLookup
      });
      if (isValid && connection) {
        onConnectExtended(connection);
      }
      const connectionClone = structuredClone(connectionState);
      delete connectionClone.inProgress;
      connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
      onClickConnectEnd?.(event, connectionClone);
      store.setState({ connectionClickStartHandle: null });
    };
    return jsxRuntime.jsx("div", { "data-handleid": handleId, "data-nodeid": nodeId, "data-handlepos": position, "data-id": `${rfId}-${nodeId}-${handleId}-${type}`, className: cc([
      "react-flow__handle",
      `react-flow__handle-${position}`,
      "nodrag",
      noPanClassName,
      className,
      {
        source: !isTarget,
        target: isTarget,
        connectable: isConnectable,
        connectablestart: isConnectableStart,
        connectableend: isConnectableEnd,
        clickconnecting: clickConnecting,
        connectingfrom: connectingFrom,
        connectingto: connectingTo,
        valid,
        connectionindicator: isConnectable && (!connectionInProcess || isPossibleEndHandle) && (connectionInProcess ? isConnectableEnd : isConnectableStart)
      }
    ]), onMouseDown: onPointerDown, onTouchStart: onPointerDown, onClick: connectOnClick ? onClick : void 0, ref, ...rest, children });
  }
  var Handle = react.memo(fixedForwardRef(HandleComponent));
  function InputNode({ data, isConnectable, sourcePosition = system.Position.Bottom }) {
    return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [data?.label, jsxRuntime.jsx(Handle, { type: "source", position: sourcePosition, isConnectable })] });
  }
  function DefaultNode({ data, isConnectable, targetPosition = system.Position.Top, sourcePosition = system.Position.Bottom }) {
    return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Handle, { type: "target", position: targetPosition, isConnectable }), data?.label, jsxRuntime.jsx(Handle, { type: "source", position: sourcePosition, isConnectable })] });
  }
  function GroupNode() {
    return null;
  }
  function OutputNode({ data, isConnectable, targetPosition = system.Position.Top }) {
    return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Handle, { type: "target", position: targetPosition, isConnectable }), data?.label] });
  }
  var arrowKeyDiffs = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };
  var builtinNodeTypes = {
    input: InputNode,
    default: DefaultNode,
    output: OutputNode,
    group: GroupNode
  };
  function getNodeInlineStyleDimensions(node) {
    if (node.internals.handleBounds === void 0) {
      return {
        width: node.width ?? node.initialWidth ?? node.style?.width,
        height: node.height ?? node.initialHeight ?? node.style?.height
      };
    }
    return {
      width: node.width ?? node.style?.width,
      height: node.height ?? node.style?.height
    };
  }
  var selector$f = (s) => {
    const { width, height, x, y } = system.getInternalNodesBounds(s.nodeLookup, {
      filter: (node) => !!node.selected
    });
    return {
      width: system.isNumeric(width) ? width : null,
      height: system.isNumeric(height) ? height : null,
      userSelectionActive: s.userSelectionActive,
      transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]}) translate(${x}px,${y}px)`
    };
  };
  function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }) {
    const store = useStoreApi();
    const { width, height, transformString, userSelectionActive } = useStore(selector$f, shallow.shallow);
    const moveSelectedNodes = useMoveSelectedNodes();
    const nodeRef = react.useRef(null);
    react.useEffect(() => {
      if (!disableKeyboardA11y) {
        nodeRef.current?.focus({
          preventScroll: true
        });
      }
    }, [disableKeyboardA11y]);
    useDrag({
      nodeRef
    });
    if (userSelectionActive || !width || !height) {
      return null;
    }
    const onContextMenu = onSelectionContextMenu ? (event) => {
      const selectedNodes = store.getState().nodes.filter((n) => n.selected);
      onSelectionContextMenu(event, selectedNodes);
    } : void 0;
    const onKeyDown = (event) => {
      if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
        event.preventDefault();
        moveSelectedNodes({
          direction: arrowKeyDiffs[event.key],
          factor: event.shiftKey ? 4 : 1
        });
      }
    };
    return jsxRuntime.jsx("div", { className: cc(["react-flow__nodesselection", "react-flow__container", noPanClassName]), style: {
      transform: transformString
    }, children: jsxRuntime.jsx("div", { ref: nodeRef, className: "react-flow__nodesselection-rect", onContextMenu, tabIndex: disableKeyboardA11y ? void 0 : -1, onKeyDown: disableKeyboardA11y ? void 0 : onKeyDown, style: {
      width,
      height
    } }) });
  }
  var win = typeof window !== "undefined" ? window : void 0;
  var selector$e = (s) => {
    return { nodesSelectionActive: s.nodesSelectionActive, userSelectionActive: s.userSelectionActive };
  };
  function FlowRendererComponent({ children, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, paneClickDistance, deleteKeyCode, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll: _panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: _panOnDrag, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, preventScrolling, onSelectionContextMenu, noWheelClassName, noPanClassName, disableKeyboardA11y, onViewportChange, isControlledViewport }) {
    const { nodesSelectionActive, userSelectionActive } = useStore(selector$e);
    const selectionKeyPressed = useKeyPress(selectionKeyCode, { target: win });
    const panActivationKeyPressed = useKeyPress(panActivationKeyCode, { target: win });
    const panOnDrag = panActivationKeyPressed || _panOnDrag;
    const panOnScroll = panActivationKeyPressed || _panOnScroll;
    const _selectionOnDrag = selectionOnDrag && panOnDrag !== true;
    const isSelecting = selectionKeyPressed || userSelectionActive || _selectionOnDrag;
    useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });
    return jsxRuntime.jsx(ZoomPane, { onPaneContextMenu, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: !selectionKeyPressed && panOnDrag, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling, noWheelClassName, noPanClassName, onViewportChange, isControlledViewport, paneClickDistance, children: jsxRuntime.jsxs(Pane, { onSelectionStart, onSelectionEnd, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, panOnDrag, isSelecting: !!isSelecting, selectionMode, selectionKeyPressed, selectionOnDrag: _selectionOnDrag, children: [children, nodesSelectionActive && jsxRuntime.jsx(NodesSelection, { onSelectionContextMenu, noPanClassName, disableKeyboardA11y })] }) });
  }
  FlowRendererComponent.displayName = "FlowRenderer";
  var FlowRenderer = react.memo(FlowRendererComponent);
  var selector$d = (onlyRenderVisible) => (s) => {
    return onlyRenderVisible ? system.getNodesInside(s.nodeLookup, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true).map((node) => node.id) : Array.from(s.nodeLookup.keys());
  };
  function useVisibleNodeIds(onlyRenderVisible) {
    const nodeIds = useStore(react.useCallback(selector$d(onlyRenderVisible), [onlyRenderVisible]), shallow.shallow);
    return nodeIds;
  }
  var selector$c = (s) => s.updateNodeInternals;
  function useResizeObserver() {
    const updateNodeInternals2 = useStore(selector$c);
    const [resizeObserver] = react.useState(() => {
      if (typeof ResizeObserver === "undefined") {
        return null;
      }
      return new ResizeObserver((entries) => {
        const updates =  new Map();
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          updates.set(id, {
            id,
            nodeElement: entry.target,
            force: true
          });
        });
        updateNodeInternals2(updates);
      });
    });
    react.useEffect(() => {
      return () => {
        resizeObserver?.disconnect();
      };
    }, [resizeObserver]);
    return resizeObserver;
  }
  function useNodeObserver({ node, nodeType, hasDimensions, resizeObserver }) {
    const store = useStoreApi();
    const nodeRef = react.useRef(null);
    const observedNode = react.useRef(null);
    const prevSourcePosition = react.useRef(node.sourcePosition);
    const prevTargetPosition = react.useRef(node.targetPosition);
    const prevType = react.useRef(nodeType);
    const isInitialized = hasDimensions && !!node.internals.handleBounds;
    react.useEffect(() => {
      if (nodeRef.current && !node.hidden && (!isInitialized || observedNode.current !== nodeRef.current)) {
        if (observedNode.current) {
          resizeObserver?.unobserve(observedNode.current);
        }
        resizeObserver?.observe(nodeRef.current);
        observedNode.current = nodeRef.current;
      }
    }, [isInitialized, node.hidden]);
    react.useEffect(() => {
      return () => {
        if (observedNode.current) {
          resizeObserver?.unobserve(observedNode.current);
          observedNode.current = null;
        }
      };
    }, []);
    react.useEffect(() => {
      if (nodeRef.current) {
        const typeChanged = prevType.current !== nodeType;
        const sourcePosChanged = prevSourcePosition.current !== node.sourcePosition;
        const targetPosChanged = prevTargetPosition.current !== node.targetPosition;
        if (typeChanged || sourcePosChanged || targetPosChanged) {
          prevType.current = nodeType;
          prevSourcePosition.current = node.sourcePosition;
          prevTargetPosition.current = node.targetPosition;
          store.getState().updateNodeInternals( new Map([[node.id, { id: node.id, nodeElement: nodeRef.current, force: true }]]));
        }
      }
    }, [node.id, nodeType, node.sourcePosition, node.targetPosition]);
    return nodeRef;
  }
  function NodeWrapper({ id, onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onDoubleClick, nodesDraggable, elementsSelectable, nodesConnectable, nodesFocusable, resizeObserver, noDragClassName, noPanClassName, disableKeyboardA11y, rfId, nodeTypes, nodeExtent, nodeClickDistance, onError }) {
    const { node, internals, isParent } = useStore((s) => {
      const node2 = s.nodeLookup.get(id);
      const isParent2 = s.parentLookup.has(id);
      return {
        node: node2,
        internals: node2.internals,
        isParent: isParent2
      };
    }, shallow.shallow);
    let nodeType = node.type || "default";
    let NodeComponent = nodeTypes?.[nodeType] || builtinNodeTypes[nodeType];
    if (NodeComponent === void 0) {
      onError?.("003", system.errorMessages["error003"](nodeType));
      nodeType = "default";
      NodeComponent = builtinNodeTypes.default;
    }
    const isDraggable = !!(node.draggable || nodesDraggable && typeof node.draggable === "undefined");
    const isSelectable = !!(node.selectable || elementsSelectable && typeof node.selectable === "undefined");
    const isConnectable = !!(node.connectable || nodesConnectable && typeof node.connectable === "undefined");
    const isFocusable = !!(node.focusable || nodesFocusable && typeof node.focusable === "undefined");
    const store = useStoreApi();
    const hasDimensions = system.nodeHasDimensions(node);
    const nodeRef = useNodeObserver({ node, nodeType, hasDimensions, resizeObserver });
    const dragging = useDrag({
      nodeRef,
      disabled: node.hidden || !isDraggable,
      noDragClassName,
      handleSelector: node.dragHandle,
      nodeId: id,
      isSelectable,
      nodeClickDistance
    });
    const moveSelectedNodes = useMoveSelectedNodes();
    if (node.hidden) {
      return null;
    }
    const nodeDimensions = system.getNodeDimensions(node);
    const inlineDimensions = getNodeInlineStyleDimensions(node);
    const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
    const onMouseEnterHandler = onMouseEnter ? (event) => onMouseEnter(event, { ...internals.userNode }) : void 0;
    const onMouseMoveHandler = onMouseMove ? (event) => onMouseMove(event, { ...internals.userNode }) : void 0;
    const onMouseLeaveHandler = onMouseLeave ? (event) => onMouseLeave(event, { ...internals.userNode }) : void 0;
    const onContextMenuHandler = onContextMenu ? (event) => onContextMenu(event, { ...internals.userNode }) : void 0;
    const onDoubleClickHandler = onDoubleClick ? (event) => onDoubleClick(event, { ...internals.userNode }) : void 0;
    const onSelectNodeHandler = (event) => {
      const { selectNodesOnDrag, nodeDragThreshold } = store.getState();
      if (isSelectable && (!selectNodesOnDrag || !isDraggable || nodeDragThreshold > 0)) {
        handleNodeClick({
          id,
          store,
          nodeRef
        });
      }
      if (onClick) {
        onClick(event, { ...internals.userNode });
      }
    };
    const onKeyDown = (event) => {
      if (system.isInputDOMNode(event.nativeEvent) || disableKeyboardA11y) {
        return;
      }
      if (system.elementSelectionKeys.includes(event.key) && isSelectable) {
        const unselect = event.key === "Escape";
        handleNodeClick({
          id,
          store,
          unselect,
          nodeRef
        });
      } else if (isDraggable && node.selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
        event.preventDefault();
        store.setState({
          ariaLiveMessage: `Moved selected node ${event.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~internals.positionAbsolute.x}, y: ${~~internals.positionAbsolute.y}`
        });
        moveSelectedNodes({
          direction: arrowKeyDiffs[event.key],
          factor: event.shiftKey ? 4 : 1
        });
      }
    };
    return jsxRuntime.jsx("div", { className: cc([
      "react-flow__node",
      `react-flow__node-${nodeType}`,
      {
        [noPanClassName]: isDraggable
      },
      node.className,
      {
        selected: node.selected,
        selectable: isSelectable,
        parent: isParent,
        draggable: isDraggable,
        dragging
      }
    ]), ref: nodeRef, style: {
      zIndex: internals.z,
      transform: `translate(${internals.positionAbsolute.x}px,${internals.positionAbsolute.y}px)`,
      pointerEvents: hasPointerEvents ? "all" : "none",
      visibility: hasDimensions ? "visible" : "hidden",
      ...node.style,
      ...inlineDimensions
    }, "data-id": id, "data-testid": `rf__node-${id}`, onMouseEnter: onMouseEnterHandler, onMouseMove: onMouseMoveHandler, onMouseLeave: onMouseLeaveHandler, onContextMenu: onContextMenuHandler, onClick: onSelectNodeHandler, onDoubleClick: onDoubleClickHandler, onKeyDown: isFocusable ? onKeyDown : void 0, tabIndex: isFocusable ? 0 : void 0, role: isFocusable ? "button" : void 0, "aria-describedby": disableKeyboardA11y ? void 0 : `${ARIA_NODE_DESC_KEY}-${rfId}`, "aria-label": node.ariaLabel, children: jsxRuntime.jsx(Provider, { value: id, children: jsxRuntime.jsx(NodeComponent, { id, data: node.data, type: nodeType, positionAbsoluteX: internals.positionAbsolute.x, positionAbsoluteY: internals.positionAbsolute.y, selected: node.selected, selectable: isSelectable, draggable: isDraggable, deletable: node.deletable ?? true, isConnectable, sourcePosition: node.sourcePosition, targetPosition: node.targetPosition, dragging, dragHandle: node.dragHandle, zIndex: internals.z, parentId: node.parentId, ...nodeDimensions }) }) });
  }
  var selector$b = (s) => ({
    nodesDraggable: s.nodesDraggable,
    nodesConnectable: s.nodesConnectable,
    nodesFocusable: s.nodesFocusable,
    elementsSelectable: s.elementsSelectable,
    onError: s.onError
  });
  function NodeRendererComponent(props) {
    const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, onError } = useStore(selector$b, shallow.shallow);
    const nodeIds = useVisibleNodeIds(props.onlyRenderVisibleElements);
    const resizeObserver = useResizeObserver();
    return jsxRuntime.jsx("div", { className: "react-flow__nodes", style: containerStyle, children: nodeIds.map((nodeId) => {
      return (
        jsxRuntime.jsx(NodeWrapper, { id: nodeId, nodeTypes: props.nodeTypes, nodeExtent: props.nodeExtent, onClick: props.onNodeClick, onMouseEnter: props.onNodeMouseEnter, onMouseMove: props.onNodeMouseMove, onMouseLeave: props.onNodeMouseLeave, onContextMenu: props.onNodeContextMenu, onDoubleClick: props.onNodeDoubleClick, noDragClassName: props.noDragClassName, noPanClassName: props.noPanClassName, rfId: props.rfId, disableKeyboardA11y: props.disableKeyboardA11y, resizeObserver, nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, nodeClickDistance: props.nodeClickDistance, onError }, nodeId)
      );
    }) });
  }
  NodeRendererComponent.displayName = "NodeRenderer";
  var NodeRenderer = react.memo(NodeRendererComponent);
  function useVisibleEdgeIds(onlyRenderVisible) {
    const edgeIds = useStore(react.useCallback((s) => {
      if (!onlyRenderVisible) {
        return s.edges.map((edge) => edge.id);
      }
      const visibleEdgeIds = [];
      if (s.width && s.height) {
        for (const edge of s.edges) {
          const sourceNode = s.nodeLookup.get(edge.source);
          const targetNode = s.nodeLookup.get(edge.target);
          if (sourceNode && targetNode && system.isEdgeVisible({
            sourceNode,
            targetNode,
            width: s.width,
            height: s.height,
            transform: s.transform
          })) {
            visibleEdgeIds.push(edge.id);
          }
        }
      }
      return visibleEdgeIds;
    }, [onlyRenderVisible]), shallow.shallow);
    return edgeIds;
  }
  var ArrowSymbol = ({ color = "none", strokeWidth = 1 }) => {
    return jsxRuntime.jsx("polyline", { style: {
      stroke: color,
      strokeWidth
    }, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", points: "-5,-4 0,0 -5,4" });
  };
  var ArrowClosedSymbol = ({ color = "none", strokeWidth = 1 }) => {
    return jsxRuntime.jsx("polyline", { style: {
      stroke: color,
      fill: color,
      strokeWidth
    }, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
  };
  var MarkerSymbols = {
    [system.MarkerType.Arrow]: ArrowSymbol,
    [system.MarkerType.ArrowClosed]: ArrowClosedSymbol
  };
  function useMarkerSymbol(type) {
    const store = useStoreApi();
    const symbol = react.useMemo(() => {
      const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type);
      if (!symbolExists) {
        store.getState().onError?.("009", system.errorMessages["error009"](type));
        return null;
      }
      return MarkerSymbols[type];
    }, [type]);
    return symbol;
  }
  var Marker = ({ id, type, color, width = 12.5, height = 12.5, markerUnits = "strokeWidth", strokeWidth, orient = "auto-start-reverse" }) => {
    const Symbol = useMarkerSymbol(type);
    if (!Symbol) {
      return null;
    }
    return jsxRuntime.jsx("marker", { className: "react-flow__arrowhead", id, markerWidth: `${width}`, markerHeight: `${height}`, viewBox: "-10 -10 20 20", markerUnits, orient, refX: "0", refY: "0", children: jsxRuntime.jsx(Symbol, { color, strokeWidth }) });
  };
  var MarkerDefinitions = ({ defaultColor, rfId }) => {
    const edges = useStore((s) => s.edges);
    const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);
    const markers = react.useMemo(() => {
      const markers2 = system.createMarkerIds(edges, {
        id: rfId,
        defaultColor,
        defaultMarkerStart: defaultEdgeOptions?.markerStart,
        defaultMarkerEnd: defaultEdgeOptions?.markerEnd
      });
      return markers2;
    }, [edges, defaultEdgeOptions, rfId, defaultColor]);
    if (!markers.length) {
      return null;
    }
    return jsxRuntime.jsx("svg", { className: "react-flow__marker", children: jsxRuntime.jsx("defs", { children: markers.map((marker) => jsxRuntime.jsx(Marker, { id: marker.id, type: marker.type, color: marker.color, width: marker.width, height: marker.height, markerUnits: marker.markerUnits, strokeWidth: marker.strokeWidth, orient: marker.orient }, marker.id)) }) });
  };
  MarkerDefinitions.displayName = "MarkerDefinitions";
  var MarkerDefinitions$1 = react.memo(MarkerDefinitions);
  function EdgeTextComponent({ x, y, label, labelStyle = {}, labelShowBg = true, labelBgStyle = {}, labelBgPadding = [2, 4], labelBgBorderRadius = 2, children, className, ...rest }) {
    const [edgeTextBbox, setEdgeTextBbox] = react.useState({ x: 1, y: 0, width: 0, height: 0 });
    const edgeTextClasses = cc(["react-flow__edge-textwrapper", className]);
    const edgeTextRef = react.useRef(null);
    react.useEffect(() => {
      if (edgeTextRef.current) {
        const textBbox = edgeTextRef.current.getBBox();
        setEdgeTextBbox({
          x: textBbox.x,
          y: textBbox.y,
          width: textBbox.width,
          height: textBbox.height
        });
      }
    }, [label]);
    if (typeof label === "undefined" || !label) {
      return null;
    }
    return jsxRuntime.jsxs("g", { transform: `translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`, className: edgeTextClasses, visibility: edgeTextBbox.width ? "visible" : "hidden", ...rest, children: [labelShowBg && jsxRuntime.jsx("rect", { width: edgeTextBbox.width + 2 * labelBgPadding[0], x: -labelBgPadding[0], y: -labelBgPadding[1], height: edgeTextBbox.height + 2 * labelBgPadding[1], className: "react-flow__edge-textbg", style: labelBgStyle, rx: labelBgBorderRadius, ry: labelBgBorderRadius }), jsxRuntime.jsx("text", { className: "react-flow__edge-text", y: edgeTextBbox.height / 2, dy: "0.3em", ref: edgeTextRef, style: labelStyle, children: label }), children] });
  }
  EdgeTextComponent.displayName = "EdgeText";
  var EdgeText = react.memo(EdgeTextComponent);
  function BaseEdge({ path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, interactionWidth = 20, ...props }) {
    return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("path", { ...props, d: path, fill: "none", className: cc(["react-flow__edge-path", props.className]) }), interactionWidth && jsxRuntime.jsx("path", { d: path, fill: "none", strokeOpacity: 0, strokeWidth: interactionWidth, className: "react-flow__edge-interaction" }), label && system.isNumeric(labelX) && system.isNumeric(labelY) ? jsxRuntime.jsx(EdgeText, { x: labelX, y: labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius }) : null] });
  }
  function getControl({ pos, x1, y1, x2, y2 }) {
    if (pos === system.Position.Left || pos === system.Position.Right) {
      return [0.5 * (x1 + x2), y1];
    }
    return [x1, 0.5 * (y1 + y2)];
  }
  function getSimpleBezierPath({ sourceX, sourceY, sourcePosition = system.Position.Bottom, targetX, targetY, targetPosition = system.Position.Top }) {
    const [sourceControlX, sourceControlY] = getControl({
      pos: sourcePosition,
      x1: sourceX,
      y1: sourceY,
      x2: targetX,
      y2: targetY
    });
    const [targetControlX, targetControlY] = getControl({
      pos: targetPosition,
      x1: targetX,
      y1: targetY,
      x2: sourceX,
      y2: sourceY
    });
    const [labelX, labelY, offsetX, offsetY] = system.getBezierEdgeCenter({
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
  function createSimpleBezierEdge(params) {
    return react.memo(({ id, sourceX, sourceY, targetX, targetY, sourcePosition = system.Position.Bottom, targetPosition = system.Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth }) => {
      const [path, labelX, labelY] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition
      });
      const _id = params.isInternal ? void 0 : id;
      return jsxRuntime.jsx(BaseEdge, { id: _id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
    });
  }
  var SimpleBezierEdge = createSimpleBezierEdge({ isInternal: false });
  var SimpleBezierEdgeInternal = createSimpleBezierEdge({ isInternal: true });
  SimpleBezierEdge.displayName = "SimpleBezierEdge";
  SimpleBezierEdgeInternal.displayName = "SimpleBezierEdgeInternal";
  function createSmoothStepEdge(params) {
    return react.memo(({ id, sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, sourcePosition = system.Position.Bottom, targetPosition = system.Position.Top, markerEnd, markerStart, pathOptions, interactionWidth }) => {
      const [path, labelX, labelY] = system.getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: pathOptions?.borderRadius,
        offset: pathOptions?.offset
      });
      const _id = params.isInternal ? void 0 : id;
      return jsxRuntime.jsx(BaseEdge, { id: _id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
    });
  }
  var SmoothStepEdge = createSmoothStepEdge({ isInternal: false });
  var SmoothStepEdgeInternal = createSmoothStepEdge({ isInternal: true });
  SmoothStepEdge.displayName = "SmoothStepEdge";
  SmoothStepEdgeInternal.displayName = "SmoothStepEdgeInternal";
  function createStepEdge(params) {
    return react.memo(({ id, ...props }) => {
      const _id = params.isInternal ? void 0 : id;
      return jsxRuntime.jsx(SmoothStepEdge, { ...props, id: _id, pathOptions: react.useMemo(() => ({ borderRadius: 0, offset: props.pathOptions?.offset }), [props.pathOptions?.offset]) });
    });
  }
  var StepEdge = createStepEdge({ isInternal: false });
  var StepEdgeInternal = createStepEdge({ isInternal: true });
  StepEdge.displayName = "StepEdge";
  StepEdgeInternal.displayName = "StepEdgeInternal";
  function createStraightEdge(params) {
    return react.memo(({ id, sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth }) => {
      const [path, labelX, labelY] = system.getStraightPath({ sourceX, sourceY, targetX, targetY });
      const _id = params.isInternal ? void 0 : id;
      return jsxRuntime.jsx(BaseEdge, { id: _id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
    });
  }
  var StraightEdge = createStraightEdge({ isInternal: false });
  var StraightEdgeInternal = createStraightEdge({ isInternal: true });
  StraightEdge.displayName = "StraightEdge";
  StraightEdgeInternal.displayName = "StraightEdgeInternal";
  function createBezierEdge(params) {
    return react.memo(({ id, sourceX, sourceY, targetX, targetY, sourcePosition = system.Position.Bottom, targetPosition = system.Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, pathOptions, interactionWidth }) => {
      const [path, labelX, labelY] = system.getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: pathOptions?.curvature
      });
      const _id = params.isInternal ? void 0 : id;
      return jsxRuntime.jsx(BaseEdge, { id: _id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
    });
  }
  var BezierEdge = createBezierEdge({ isInternal: false });
  var BezierEdgeInternal = createBezierEdge({ isInternal: true });
  BezierEdge.displayName = "BezierEdge";
  BezierEdgeInternal.displayName = "BezierEdgeInternal";
  var builtinEdgeTypes = {
    default: BezierEdgeInternal,
    straight: StraightEdgeInternal,
    step: StepEdgeInternal,
    smoothstep: SmoothStepEdgeInternal,
    simplebezier: SimpleBezierEdgeInternal
  };
  var nullPosition = {
    sourceX: null,
    sourceY: null,
    targetX: null,
    targetY: null,
    sourcePosition: null,
    targetPosition: null
  };
  var shiftX = (x, shift, position) => {
    if (position === system.Position.Left)
      return x - shift;
    if (position === system.Position.Right)
      return x + shift;
    return x;
  };
  var shiftY = (y, shift, position) => {
    if (position === system.Position.Top)
      return y - shift;
    if (position === system.Position.Bottom)
      return y + shift;
    return y;
  };
  var EdgeUpdaterClassName = "react-flow__edgeupdater";
  function EdgeAnchor({ position, centerX, centerY, radius = 10, onMouseDown, onMouseEnter, onMouseOut, type }) {
    return jsxRuntime.jsx("circle", { onMouseDown, onMouseEnter, onMouseOut, className: cc([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${type}`]), cx: shiftX(centerX, radius, position), cy: shiftY(centerY, radius, position), r: radius, stroke: "transparent", fill: "transparent" });
  }
  function EdgeUpdateAnchors({ isReconnectable, reconnectRadius, edge, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, onReconnect, onReconnectStart, onReconnectEnd, setReconnecting, setUpdateHover }) {
    const store = useStoreApi();
    const handleEdgeUpdater = (event, oppositeHandle) => {
      if (event.button !== 0) {
        return;
      }
      const { autoPanOnConnect, domNode, isValidConnection, connectionMode, connectionRadius, lib, onConnectStart, onConnectEnd, cancelConnection, nodeLookup, rfId: flowId, panBy: panBy2, updateConnection } = store.getState();
      const isTarget = oppositeHandle.type === "target";
      setReconnecting(true);
      onReconnectStart?.(event, edge, oppositeHandle.type);
      const _onReconnectEnd = (evt, connectionState) => {
        setReconnecting(false);
        onReconnectEnd?.(evt, edge, oppositeHandle.type, connectionState);
      };
      const onConnectEdge = (connection) => onReconnect?.(edge, connection);
      system.XYHandle.onPointerDown(event.nativeEvent, {
        autoPanOnConnect,
        connectionMode,
        connectionRadius,
        domNode,
        handleId: oppositeHandle.id,
        nodeId: oppositeHandle.nodeId,
        nodeLookup,
        isTarget,
        edgeUpdaterType: oppositeHandle.type,
        lib,
        flowId,
        cancelConnection,
        panBy: panBy2,
        isValidConnection,
        onConnect: onConnectEdge,
        onConnectStart,
        onConnectEnd,
        onReconnectEnd: _onReconnectEnd,
        updateConnection,
        getTransform: () => store.getState().transform,
        getFromHandle: () => store.getState().connection.fromHandle
      });
    };
    const onReconnectSourceMouseDown = (event) => handleEdgeUpdater(event, { nodeId: edge.target, id: edge.targetHandle ?? null, type: "target" });
    const onReconnectTargetMouseDown = (event) => handleEdgeUpdater(event, { nodeId: edge.source, id: edge.sourceHandle ?? null, type: "source" });
    const onReconnectMouseEnter = () => setUpdateHover(true);
    const onReconnectMouseOut = () => setUpdateHover(false);
    return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [(isReconnectable === true || isReconnectable === "source") && jsxRuntime.jsx(EdgeAnchor, { position: sourcePosition, centerX: sourceX, centerY: sourceY, radius: reconnectRadius, onMouseDown: onReconnectSourceMouseDown, onMouseEnter: onReconnectMouseEnter, onMouseOut: onReconnectMouseOut, type: "source" }), (isReconnectable === true || isReconnectable === "target") && jsxRuntime.jsx(EdgeAnchor, { position: targetPosition, centerX: targetX, centerY: targetY, radius: reconnectRadius, onMouseDown: onReconnectTargetMouseDown, onMouseEnter: onReconnectMouseEnter, onMouseOut: onReconnectMouseOut, type: "target" })] });
  }
  function EdgeWrapper({ id, edgesFocusable, edgesReconnectable, elementsSelectable, onClick, onDoubleClick, onContextMenu, onMouseEnter, onMouseMove, onMouseLeave, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, rfId, edgeTypes, noPanClassName, onError, disableKeyboardA11y }) {
    let edge = useStore((s) => s.edgeLookup.get(id));
    const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);
    edge = defaultEdgeOptions ? { ...defaultEdgeOptions, ...edge } : edge;
    let edgeType = edge.type || "default";
    let EdgeComponent = edgeTypes?.[edgeType] || builtinEdgeTypes[edgeType];
    if (EdgeComponent === void 0) {
      onError?.("011", system.errorMessages["error011"](edgeType));
      edgeType = "default";
      EdgeComponent = builtinEdgeTypes.default;
    }
    const isFocusable = !!(edge.focusable || edgesFocusable && typeof edge.focusable === "undefined");
    const isReconnectable = typeof onReconnect !== "undefined" && (edge.reconnectable || edgesReconnectable && typeof edge.reconnectable === "undefined");
    const isSelectable = !!(edge.selectable || elementsSelectable && typeof edge.selectable === "undefined");
    const edgeRef = react.useRef(null);
    const [updateHover, setUpdateHover] = react.useState(false);
    const [reconnecting, setReconnecting] = react.useState(false);
    const store = useStoreApi();
    const { zIndex, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = useStore(react.useCallback((store2) => {
      const sourceNode = store2.nodeLookup.get(edge.source);
      const targetNode = store2.nodeLookup.get(edge.target);
      if (!sourceNode || !targetNode) {
        return {
          zIndex: edge.zIndex,
          ...nullPosition
        };
      }
      const edgePosition = system.getEdgePosition({
        id,
        sourceNode,
        targetNode,
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null,
        connectionMode: store2.connectionMode,
        onError
      });
      const zIndex2 = system.getElevatedEdgeZIndex({
        selected: edge.selected,
        zIndex: edge.zIndex,
        sourceNode,
        targetNode,
        elevateOnSelect: store2.elevateEdgesOnSelect
      });
      return {
        zIndex: zIndex2,
        ...edgePosition || nullPosition
      };
    }, [edge.source, edge.target, edge.sourceHandle, edge.targetHandle, edge.selected, edge.zIndex]), shallow.shallow);
    const markerStartUrl = react.useMemo(() => edge.markerStart ? `url('#${system.getMarkerId(edge.markerStart, rfId)}')` : void 0, [edge.markerStart, rfId]);
    const markerEndUrl = react.useMemo(() => edge.markerEnd ? `url('#${system.getMarkerId(edge.markerEnd, rfId)}')` : void 0, [edge.markerEnd, rfId]);
    if (edge.hidden || sourceX === null || sourceY === null || targetX === null || targetY === null) {
      return null;
    }
    const onEdgeClick = (event) => {
      const { addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();
      if (isSelectable) {
        store.setState({ nodesSelectionActive: false });
        if (edge.selected && multiSelectionActive) {
          unselectNodesAndEdges({ nodes: [], edges: [edge] });
          edgeRef.current?.blur();
        } else {
          addSelectedEdges([id]);
        }
      }
      if (onClick) {
        onClick(event, edge);
      }
    };
    const onEdgeDoubleClick = onDoubleClick ? (event) => {
      onDoubleClick(event, { ...edge });
    } : void 0;
    const onEdgeContextMenu = onContextMenu ? (event) => {
      onContextMenu(event, { ...edge });
    } : void 0;
    const onEdgeMouseEnter = onMouseEnter ? (event) => {
      onMouseEnter(event, { ...edge });
    } : void 0;
    const onEdgeMouseMove = onMouseMove ? (event) => {
      onMouseMove(event, { ...edge });
    } : void 0;
    const onEdgeMouseLeave = onMouseLeave ? (event) => {
      onMouseLeave(event, { ...edge });
    } : void 0;
    const onKeyDown = (event) => {
      if (!disableKeyboardA11y && system.elementSelectionKeys.includes(event.key) && isSelectable) {
        const { unselectNodesAndEdges, addSelectedEdges } = store.getState();
        const unselect = event.key === "Escape";
        if (unselect) {
          edgeRef.current?.blur();
          unselectNodesAndEdges({ edges: [edge] });
        } else {
          addSelectedEdges([id]);
        }
      }
    };
    return jsxRuntime.jsx("svg", { style: { zIndex }, children: jsxRuntime.jsxs("g", { className: cc([
      "react-flow__edge",
      `react-flow__edge-${edgeType}`,
      edge.className,
      noPanClassName,
      {
        selected: edge.selected,
        animated: edge.animated,
        inactive: !isSelectable && !onClick,
        updating: updateHover,
        selectable: isSelectable
      }
    ]), onClick: onEdgeClick, onDoubleClick: onEdgeDoubleClick, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onKeyDown: isFocusable ? onKeyDown : void 0, tabIndex: isFocusable ? 0 : void 0, role: isFocusable ? "button" : "img", "data-id": id, "data-testid": `rf__edge-${id}`, "aria-label": edge.ariaLabel === null ? void 0 : edge.ariaLabel || `Edge from ${edge.source} to ${edge.target}`, "aria-describedby": isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : void 0, ref: edgeRef, children: [!reconnecting && jsxRuntime.jsx(EdgeComponent, { id, source: edge.source, target: edge.target, type: edge.type, selected: edge.selected, animated: edge.animated, selectable: isSelectable, deletable: edge.deletable ?? true, label: edge.label, labelStyle: edge.labelStyle, labelShowBg: edge.labelShowBg, labelBgStyle: edge.labelBgStyle, labelBgPadding: edge.labelBgPadding, labelBgBorderRadius: edge.labelBgBorderRadius, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data: edge.data, style: edge.style, sourceHandleId: edge.sourceHandle, targetHandleId: edge.targetHandle, markerStart: markerStartUrl, markerEnd: markerEndUrl, pathOptions: "pathOptions" in edge ? edge.pathOptions : void 0, interactionWidth: edge.interactionWidth }), isReconnectable && jsxRuntime.jsx(EdgeUpdateAnchors, { edge, isReconnectable, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, setUpdateHover, setReconnecting })] }) });
  }
  var selector$a = (s) => ({
    edgesFocusable: s.edgesFocusable,
    edgesReconnectable: s.edgesReconnectable,
    elementsSelectable: s.elementsSelectable,
    connectionMode: s.connectionMode,
    onError: s.onError
  });
  function EdgeRendererComponent({ defaultMarkerColor, onlyRenderVisibleElements, rfId, edgeTypes, noPanClassName, onReconnect, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeClick, reconnectRadius, onEdgeDoubleClick, onReconnectStart, onReconnectEnd, disableKeyboardA11y }) {
    const { edgesFocusable, edgesReconnectable, elementsSelectable, onError } = useStore(selector$a, shallow.shallow);
    const edgeIds = useVisibleEdgeIds(onlyRenderVisibleElements);
    return jsxRuntime.jsxs("div", { className: "react-flow__edges", children: [jsxRuntime.jsx(MarkerDefinitions$1, { defaultColor: defaultMarkerColor, rfId }), edgeIds.map((id) => {
      return jsxRuntime.jsx(EdgeWrapper, { id, edgesFocusable, edgesReconnectable, elementsSelectable, noPanClassName, onReconnect, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onClick: onEdgeClick, reconnectRadius, onDoubleClick: onEdgeDoubleClick, onReconnectStart, onReconnectEnd, rfId, onError, edgeTypes, disableKeyboardA11y }, id);
    })] });
  }
  EdgeRendererComponent.displayName = "EdgeRenderer";
  var EdgeRenderer = react.memo(EdgeRendererComponent);
  var selector$9 = (s) => `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;
  function Viewport({ children }) {
    const transform = useStore(selector$9);
    return jsxRuntime.jsx("div", { className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform }, children });
  }
  function useOnInitHandler(onInit) {
    const rfInstance = useReactFlow();
    const isInitialized = react.useRef(false);
    react.useEffect(() => {
      if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
        setTimeout(() => onInit(rfInstance), 1);
        isInitialized.current = true;
      }
    }, [onInit, rfInstance.viewportInitialized]);
  }
  var selector$8 = (state) => state.panZoom?.syncViewport;
  function useViewportSync(viewport) {
    const syncViewport = useStore(selector$8);
    const store = useStoreApi();
    react.useEffect(() => {
      if (viewport) {
        syncViewport?.(viewport);
        store.setState({ transform: [viewport.x, viewport.y, viewport.zoom] });
      }
    }, [viewport, syncViewport]);
    return null;
  }
  function storeSelector$1(s) {
    return s.connection.inProgress ? { ...s.connection, to: system.pointToRendererPoint(s.connection.to, s.transform) } : { ...s.connection };
  }
  function getSelector(connectionSelector) {
    if (connectionSelector) {
      const combinedSelector = (s) => {
        const connection = storeSelector$1(s);
        return connectionSelector(connection);
      };
      return combinedSelector;
    }
    return storeSelector$1;
  }
  function useConnection(connectionSelector) {
    const combinedSelector = getSelector(connectionSelector);
    return useStore(combinedSelector, shallow.shallow);
  }
  var selector$7 = (s) => ({
    nodesConnectable: s.nodesConnectable,
    isValid: s.connection.isValid,
    inProgress: s.connection.inProgress,
    width: s.width,
    height: s.height
  });
  function ConnectionLineWrapper({ containerStyle: containerStyle2, style: style2, type, component }) {
    const { nodesConnectable, width, height, isValid, inProgress } = useStore(selector$7, shallow.shallow);
    const renderConnection = !!(width && nodesConnectable && inProgress);
    if (!renderConnection) {
      return null;
    }
    return jsxRuntime.jsx("svg", { style: containerStyle2, width, height, className: "react-flow__connectionline react-flow__container", children: jsxRuntime.jsx("g", { className: cc(["react-flow__connection", system.getConnectionStatus(isValid)]), children: jsxRuntime.jsx(ConnectionLine, { style: style2, type, CustomComponent: component, isValid }) }) });
  }
  var ConnectionLine = ({ style: style2, type = system.ConnectionLineType.Bezier, CustomComponent, isValid }) => {
    const { inProgress, from, fromNode, fromHandle, fromPosition, to, toNode, toHandle, toPosition } = useConnection();
    if (!inProgress) {
      return;
    }
    if (CustomComponent) {
      return jsxRuntime.jsx(CustomComponent, { connectionLineType: type, connectionLineStyle: style2, fromNode, fromHandle, fromX: from.x, fromY: from.y, toX: to.x, toY: to.y, fromPosition, toPosition, connectionStatus: system.getConnectionStatus(isValid), toNode, toHandle });
    }
    let path = "";
    const pathParams = {
      sourceX: from.x,
      sourceY: from.y,
      sourcePosition: fromPosition,
      targetX: to.x,
      targetY: to.y,
      targetPosition: toPosition
    };
    switch (type) {
      case system.ConnectionLineType.Bezier:
        [path] = system.getBezierPath(pathParams);
        break;
      case system.ConnectionLineType.SimpleBezier:
        [path] = getSimpleBezierPath(pathParams);
        break;
      case system.ConnectionLineType.Step:
        [path] = system.getSmoothStepPath({
          ...pathParams,
          borderRadius: 0
        });
        break;
      case system.ConnectionLineType.SmoothStep:
        [path] = system.getSmoothStepPath(pathParams);
        break;
      default:
        [path] = system.getStraightPath(pathParams);
    }
    return jsxRuntime.jsx("path", { d: path, fill: "none", className: "react-flow__connection-path", style: style2 });
  };
  ConnectionLine.displayName = "ConnectionLine";
  var emptyTypes = {};
  function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes = emptyTypes) {
    const typesRef = react.useRef(nodeOrEdgeTypes);
    const store = useStoreApi();
    react.useEffect(() => {
      {
        const usedKeys =  new Set([...Object.keys(typesRef.current), ...Object.keys(nodeOrEdgeTypes)]);
        for (const key of usedKeys) {
          if (typesRef.current[key] !== nodeOrEdgeTypes[key]) {
            store.getState().onError?.("002", system.errorMessages["error002"]());
            break;
          }
        }
        typesRef.current = nodeOrEdgeTypes;
      }
    }, [nodeOrEdgeTypes]);
  }
  function useStylesLoadedWarning() {
    const store = useStoreApi();
    const checked = react.useRef(false);
    react.useEffect(() => {
      {
        if (!checked.current) {
          const pane = document.querySelector(".react-flow__pane");
          if (pane && !(window.getComputedStyle(pane).zIndex === "1")) {
            store.getState().onError?.("013", system.errorMessages["error013"]("react"));
          }
          checked.current = true;
        }
      }
    }, []);
  }
  function GraphViewComponent({ nodeTypes, edgeTypes, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, paneClickDistance, nodeClickDistance, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, noDragClassName, noWheelClassName, noPanClassName, disableKeyboardA11y, nodeExtent, rfId, viewport, onViewportChange }) {
    useNodeOrEdgeTypesWarning(nodeTypes);
    useNodeOrEdgeTypesWarning(edgeTypes);
    useStylesLoadedWarning();
    useOnInitHandler(onInit);
    useViewportSync(viewport);
    return jsxRuntime.jsx(FlowRenderer, { onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, paneClickDistance, deleteKeyCode, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, zoomOnDoubleClick, panOnScroll, panOnScrollSpeed, panOnScrollMode, panOnDrag, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, onSelectionContextMenu, preventScrolling, noDragClassName, noWheelClassName, noPanClassName, disableKeyboardA11y, onViewportChange, isControlledViewport: !!viewport, children: jsxRuntime.jsxs(Viewport, { children: [jsxRuntime.jsx(EdgeRenderer, { edgeTypes, onEdgeClick, onEdgeDoubleClick, onReconnect, onReconnectStart, onReconnectEnd, onlyRenderVisibleElements, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, reconnectRadius, defaultMarkerColor, noPanClassName, disableKeyboardA11y, rfId }), jsxRuntime.jsx(ConnectionLineWrapper, { style: connectionLineStyle, type: connectionLineType, component: connectionLineComponent, containerStyle: connectionLineContainerStyle }), jsxRuntime.jsx("div", { className: "react-flow__edgelabel-renderer" }), jsxRuntime.jsx(NodeRenderer, { nodeTypes, onNodeClick, onNodeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, nodeClickDistance, onlyRenderVisibleElements, noPanClassName, noDragClassName, disableKeyboardA11y, nodeExtent, rfId }), jsxRuntime.jsx("div", { className: "react-flow__viewport-portal" })] }) });
  }
  GraphViewComponent.displayName = "GraphView";
  var GraphView = react.memo(GraphViewComponent);
  var getInitialState = ({ nodes, edges, defaultNodes, defaultEdges, width, height, fitView: fitView2, nodeOrigin, nodeExtent } = {}) => {
    const nodeLookup =  new Map();
    const parentLookup =  new Map();
    const connectionLookup =  new Map();
    const edgeLookup =  new Map();
    const storeEdges = defaultEdges ?? edges ?? [];
    const storeNodes = defaultNodes ?? nodes ?? [];
    const storeNodeOrigin = nodeOrigin ?? [0, 0];
    const storeNodeExtent = nodeExtent ?? system.infiniteExtent;
    system.updateConnectionLookup(connectionLookup, edgeLookup, storeEdges);
    system.adoptUserNodes(storeNodes, nodeLookup, parentLookup, {
      nodeOrigin: storeNodeOrigin,
      nodeExtent: storeNodeExtent,
      elevateNodesOnSelect: false
    });
    let transform = [0, 0, 1];
    if (fitView2 && width && height) {
      const bounds = system.getInternalNodesBounds(nodeLookup, {
        filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
      });
      const { x, y, zoom } = system.getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
      transform = [x, y, zoom];
    }
    return {
      rfId: "1",
      width: 0,
      height: 0,
      transform,
      nodes: storeNodes,
      nodeLookup,
      parentLookup,
      edges: storeEdges,
      edgeLookup,
      connectionLookup,
      onNodesChange: null,
      onEdgesChange: null,
      hasDefaultNodes: defaultNodes !== void 0,
      hasDefaultEdges: defaultEdges !== void 0,
      panZoom: null,
      minZoom: 0.5,
      maxZoom: 2,
      translateExtent: system.infiniteExtent,
      nodeExtent: storeNodeExtent,
      nodesSelectionActive: false,
      userSelectionActive: false,
      userSelectionRect: null,
      connectionMode: system.ConnectionMode.Strict,
      domNode: null,
      paneDragging: false,
      noPanClassName: "nopan",
      nodeOrigin: storeNodeOrigin,
      nodeDragThreshold: 1,
      snapGrid: [15, 15],
      snapToGrid: false,
      nodesDraggable: true,
      nodesConnectable: true,
      nodesFocusable: true,
      edgesFocusable: true,
      edgesReconnectable: true,
      elementsSelectable: true,
      elevateNodesOnSelect: true,
      elevateEdgesOnSelect: false,
      fitViewOnInit: false,
      fitViewDone: false,
      fitViewOnInitOptions: void 0,
      selectNodesOnDrag: true,
      multiSelectionActive: false,
      connection: { ...system.initialConnection },
      connectionClickStartHandle: null,
      connectOnClick: true,
      ariaLiveMessage: "",
      autoPanOnConnect: true,
      autoPanOnNodeDrag: true,
      autoPanSpeed: 15,
      connectionRadius: 20,
      onError: system.devWarn,
      isValidConnection: void 0,
      onSelectionChangeHandlers: [],
      lib: "react",
      debug: false
    };
  };
  var createStore = ({ nodes, edges, defaultNodes, defaultEdges, width, height, fitView: fitView$1, nodeOrigin, nodeExtent }) => traditional.createWithEqualityFn((set, get) => ({
    ...getInitialState({ nodes, edges, width, height, fitView: fitView$1, nodeOrigin, nodeExtent, defaultNodes, defaultEdges }),
    setNodes: (nodes2) => {
      const { nodeLookup, parentLookup, nodeOrigin: nodeOrigin2, elevateNodesOnSelect } = get();
      system.adoptUserNodes(nodes2, nodeLookup, parentLookup, {
        nodeOrigin: nodeOrigin2,
        nodeExtent,
        elevateNodesOnSelect,
        checkEquality: true
      });
      set({ nodes: nodes2 });
    },
    setEdges: (edges2) => {
      const { connectionLookup, edgeLookup } = get();
      system.updateConnectionLookup(connectionLookup, edgeLookup, edges2);
      set({ edges: edges2 });
    },
    setDefaultNodesAndEdges: (nodes2, edges2) => {
      if (nodes2) {
        const { setNodes } = get();
        setNodes(nodes2);
        set({ hasDefaultNodes: true });
      }
      if (edges2) {
        const { setEdges } = get();
        setEdges(edges2);
        set({ hasDefaultEdges: true });
      }
    },
    updateNodeInternals: (updates, params = { triggerFitView: true }) => {
      const { triggerNodeChanges, nodeLookup, parentLookup, fitViewOnInit, fitViewDone, fitViewOnInitOptions, domNode, nodeOrigin: nodeOrigin2, nodeExtent: nodeExtent2, debug, fitViewSync } = get();
      const { changes, updatedInternals } = system.updateNodeInternals(updates, nodeLookup, parentLookup, domNode, nodeOrigin2, nodeExtent2);
      if (!updatedInternals) {
        return;
      }
      system.updateAbsolutePositions(nodeLookup, parentLookup, { nodeOrigin: nodeOrigin2, nodeExtent: nodeExtent2 });
      if (params.triggerFitView) {
        let nextFitViewDone = fitViewDone;
        if (!fitViewDone && fitViewOnInit) {
          nextFitViewDone = fitViewSync({
            ...fitViewOnInitOptions,
            nodes: fitViewOnInitOptions?.nodes
          });
        }
        set({ fitViewDone: nextFitViewDone });
      } else {
        set({});
      }
      if (changes?.length > 0) {
        if (debug) {
          console.log("React Flow: trigger node changes", changes);
        }
        triggerNodeChanges?.(changes);
      }
    },
    updateNodePositions: (nodeDragItems, dragging = false) => {
      const parentExpandChildren = [];
      const changes = [];
      for (const [id, dragItem] of nodeDragItems) {
        const expandParent = !!(dragItem?.expandParent && dragItem?.parentId && dragItem?.position);
        const change = {
          id,
          type: "position",
          position: expandParent ? {
            x: Math.max(0, dragItem.position.x),
            y: Math.max(0, dragItem.position.y)
          } : dragItem.position,
          dragging
        };
        if (expandParent) {
          parentExpandChildren.push({
            id,
            parentId: dragItem.parentId,
            rect: {
              ...dragItem.internals.positionAbsolute,
              width: dragItem.measured.width,
              height: dragItem.measured.height
            }
          });
        }
        changes.push(change);
      }
      if (parentExpandChildren.length > 0) {
        const { nodeLookup, parentLookup, nodeOrigin: nodeOrigin2 } = get();
        const parentExpandChanges = system.handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin2);
        changes.push(...parentExpandChanges);
      }
      get().triggerNodeChanges(changes);
    },
    triggerNodeChanges: (changes) => {
      const { onNodesChange, setNodes, nodes: nodes2, hasDefaultNodes, debug } = get();
      if (changes?.length) {
        if (hasDefaultNodes) {
          const updatedNodes = applyNodeChanges(changes, nodes2);
          setNodes(updatedNodes);
        }
        if (debug) {
          console.log("React Flow: trigger node changes", changes);
        }
        onNodesChange?.(changes);
      }
    },
    triggerEdgeChanges: (changes) => {
      const { onEdgesChange, setEdges, edges: edges2, hasDefaultEdges, debug } = get();
      if (changes?.length) {
        if (hasDefaultEdges) {
          const updatedEdges = applyEdgeChanges(changes, edges2);
          setEdges(updatedEdges);
        }
        if (debug) {
          console.log("React Flow: trigger edge changes", changes);
        }
        onEdgesChange?.(changes);
      }
    },
    addSelectedNodes: (selectedNodeIds) => {
      const { multiSelectionActive, edgeLookup, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get();
      if (multiSelectionActive) {
        const nodeChanges = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
        triggerNodeChanges(nodeChanges);
        return;
      }
      triggerNodeChanges(getSelectionChanges(nodeLookup,  new Set([...selectedNodeIds]), true));
      triggerEdgeChanges(getSelectionChanges(edgeLookup));
    },
    addSelectedEdges: (selectedEdgeIds) => {
      const { multiSelectionActive, edgeLookup, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get();
      if (multiSelectionActive) {
        const changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
        triggerEdgeChanges(changedEdges);
        return;
      }
      triggerEdgeChanges(getSelectionChanges(edgeLookup,  new Set([...selectedEdgeIds])));
      triggerNodeChanges(getSelectionChanges(nodeLookup,  new Set(), true));
    },
    unselectNodesAndEdges: ({ nodes: nodes2, edges: edges2 } = {}) => {
      const { edges: storeEdges, nodes: storeNodes, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get();
      const nodesToUnselect = nodes2 ? nodes2 : storeNodes;
      const edgesToUnselect = edges2 ? edges2 : storeEdges;
      const nodeChanges = nodesToUnselect.map((n) => {
        const internalNode = nodeLookup.get(n.id);
        if (internalNode) {
          internalNode.selected = false;
        }
        return createSelectionChange(n.id, false);
      });
      const edgeChanges = edgesToUnselect.map((edge) => createSelectionChange(edge.id, false));
      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    },
    setMinZoom: (minZoom) => {
      const { panZoom, maxZoom } = get();
      panZoom?.setScaleExtent([minZoom, maxZoom]);
      set({ minZoom });
    },
    setMaxZoom: (maxZoom) => {
      const { panZoom, minZoom } = get();
      panZoom?.setScaleExtent([minZoom, maxZoom]);
      set({ maxZoom });
    },
    setTranslateExtent: (translateExtent) => {
      get().panZoom?.setTranslateExtent(translateExtent);
      set({ translateExtent });
    },
    setPaneClickDistance: (clickDistance) => {
      get().panZoom?.setClickDistance(clickDistance);
    },
    resetSelectedElements: () => {
      const { edges: edges2, nodes: nodes2, triggerNodeChanges, triggerEdgeChanges } = get();
      const nodeChanges = nodes2.reduce((res, node) => node.selected ? [...res, createSelectionChange(node.id, false)] : res, []);
      const edgeChanges = edges2.reduce((res, edge) => edge.selected ? [...res, createSelectionChange(edge.id, false)] : res, []);
      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    },
    setNodeExtent: (nextNodeExtent) => {
      const { nodes: nodes2, nodeLookup, parentLookup, nodeOrigin: nodeOrigin2, elevateNodesOnSelect, nodeExtent: nodeExtent2 } = get();
      if (nextNodeExtent[0][0] === nodeExtent2[0][0] && nextNodeExtent[0][1] === nodeExtent2[0][1] && nextNodeExtent[1][0] === nodeExtent2[1][0] && nextNodeExtent[1][1] === nodeExtent2[1][1]) {
        return;
      }
      system.adoptUserNodes(nodes2, nodeLookup, parentLookup, {
        nodeOrigin: nodeOrigin2,
        nodeExtent: nextNodeExtent,
        elevateNodesOnSelect,
        checkEquality: false
      });
      set({ nodeExtent: nextNodeExtent });
    },
    panBy: (delta) => {
      const { transform, width: width2, height: height2, panZoom, translateExtent } = get();
      return system.panBy({ delta, panZoom, transform, translateExtent, width: width2, height: height2 });
    },
    fitView: (options) => {
      const { panZoom, width: width2, height: height2, minZoom, maxZoom, nodeLookup } = get();
      if (!panZoom) {
        return Promise.resolve(false);
      }
      const fitViewNodes = system.getFitViewNodes(nodeLookup, options);
      return system.fitView({
        nodes: fitViewNodes,
        width: width2,
        height: height2,
        panZoom,
        minZoom,
        maxZoom
      }, options);
    },
    fitViewSync: (options) => {
      const { panZoom, width: width2, height: height2, minZoom, maxZoom, nodeLookup } = get();
      if (!panZoom) {
        return false;
      }
      const fitViewNodes = system.getFitViewNodes(nodeLookup, options);
      system.fitView({
        nodes: fitViewNodes,
        width: width2,
        height: height2,
        panZoom,
        minZoom,
        maxZoom
      }, options);
      return fitViewNodes.size > 0;
    },
    cancelConnection: () => {
      set({
        connection: { ...system.initialConnection }
      });
    },
    updateConnection: (connection) => {
      set({ connection });
    },
    reset: () => set({ ...getInitialState() })
  }), Object.is);
  function ReactFlowProvider({ initialNodes: nodes, initialEdges: edges, defaultNodes, defaultEdges, initialWidth: width, initialHeight: height, fitView: fitView2, nodeOrigin, nodeExtent, children }) {
    const [store] = react.useState(() => createStore({
      nodes,
      edges,
      defaultNodes,
      defaultEdges,
      width,
      height,
      fitView: fitView2,
      nodeOrigin,
      nodeExtent
    }));
    return jsxRuntime.jsx(Provider$1, { value: store, children: jsxRuntime.jsx(BatchProvider, { children }) });
  }
  function Wrapper({ children, nodes, edges, defaultNodes, defaultEdges, width, height, fitView: fitView2, nodeOrigin, nodeExtent }) {
    const isWrapped = react.useContext(StoreContext);
    if (isWrapped) {
      return jsxRuntime.jsx(jsxRuntime.Fragment, { children });
    }
    return jsxRuntime.jsx(ReactFlowProvider, { initialNodes: nodes, initialEdges: edges, defaultNodes, defaultEdges, initialWidth: width, initialHeight: height, fitView: fitView2, nodeOrigin, nodeExtent, children });
  }
  var wrapperStyle = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    zIndex: 0
  };
  function ReactFlow({ nodes, edges, defaultNodes, defaultEdges, className, nodeTypes, edgeTypes, onNodeClick, onEdgeClick, onInit, onMove, onMoveStart, onMoveEnd, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, onNodeDragStart, onNodeDrag, onNodeDragStop, onNodesDelete, onEdgesDelete, onDelete, onSelectionChange, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, onSelectionStart, onSelectionEnd, onBeforeDelete, connectionMode, connectionLineType = system.ConnectionLineType.Bezier, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, deleteKeyCode = "Backspace", selectionKeyCode = "Shift", selectionOnDrag = false, selectionMode = system.SelectionMode.Full, panActivationKeyCode = "Space", multiSelectionKeyCode = system.isMacOs() ? "Meta" : "Control", zoomActivationKeyCode = system.isMacOs() ? "Meta" : "Control", snapToGrid, snapGrid, onlyRenderVisibleElements = false, selectNodesOnDrag, nodesDraggable, nodesConnectable, nodesFocusable, nodeOrigin = defaultNodeOrigin, edgesFocusable, edgesReconnectable, elementsSelectable = true, defaultViewport: defaultViewport$1 = defaultViewport, minZoom = 0.5, maxZoom = 2, translateExtent = system.infiniteExtent, preventScrolling = true, nodeExtent, defaultMarkerColor = "#b1b1b7", zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = system.PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, paneClickDistance = 0, nodeClickDistance = 0, children, onReconnect, onReconnectStart, onReconnectEnd, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, reconnectRadius = 10, onNodesChange, onEdgesChange, noDragClassName = "nodrag", noWheelClassName = "nowheel", noPanClassName = "nopan", fitView: fitView2, fitViewOptions, connectOnClick, attributionPosition, proOptions, defaultEdgeOptions, elevateNodesOnSelect, elevateEdgesOnSelect, disableKeyboardA11y = false, autoPanOnConnect, autoPanOnNodeDrag, autoPanSpeed, connectionRadius, isValidConnection, onError, style: style2, id, nodeDragThreshold, viewport, onViewportChange, width, height, colorMode = "light", debug, ...rest }, ref) {
    const rfId = id || "1";
    const colorModeClassName = useColorModeClass(colorMode);
    return jsxRuntime.jsx("div", { "data-testid": "rf__wrapper", ...rest, style: { ...style2, ...wrapperStyle }, ref, className: cc(["react-flow", className, colorModeClassName]), id, children: jsxRuntime.jsxs(Wrapper, { nodes, edges, width, height, fitView: fitView2, nodeOrigin, nodeExtent, children: [jsxRuntime.jsx(GraphView, { onInit, onNodeClick, onEdgeClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, nodeTypes, edgeTypes, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, deleteKeyCode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, onlyRenderVisibleElements, defaultViewport: defaultViewport$1, translateExtent, minZoom, maxZoom, preventScrolling, zoomOnScroll, zoomOnPinch, zoomOnDoubleClick, panOnScroll, panOnScrollSpeed, panOnScrollMode, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, paneClickDistance, nodeClickDistance, onSelectionContextMenu, onSelectionStart, onSelectionEnd, onReconnect, onReconnectStart, onReconnectEnd, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, reconnectRadius, defaultMarkerColor, noDragClassName, noWheelClassName, noPanClassName, rfId, disableKeyboardA11y, nodeExtent, viewport, onViewportChange }), jsxRuntime.jsx(StoreUpdater, { nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, nodesConnectable, nodesFocusable, edgesFocusable, edgesReconnectable, elementsSelectable, elevateNodesOnSelect, elevateEdgesOnSelect, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, snapToGrid, snapGrid, connectionMode, translateExtent, connectOnClick, defaultEdgeOptions, fitView: fitView2, fitViewOptions, onNodesDelete, onEdgesDelete, onDelete, onNodeDragStart, onNodeDrag, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, onMove, onMoveStart, onMoveEnd, noPanClassName, nodeOrigin, rfId, autoPanOnConnect, autoPanOnNodeDrag, autoPanSpeed, onError, connectionRadius, isValidConnection, selectNodesOnDrag, nodeDragThreshold, onBeforeDelete, paneClickDistance, debug }), jsxRuntime.jsx(SelectionListener, { onSelectionChange }), children, jsxRuntime.jsx(Attribution, { proOptions, position: attributionPosition }), jsxRuntime.jsx(A11yDescriptions, { rfId, disableKeyboardA11y })] }) });
  }
  var index = fixedForwardRef(ReactFlow);
  var selector$6 = (s) => s.domNode?.querySelector(".react-flow__edgelabel-renderer");
  function EdgeLabelRenderer({ children }) {
    const edgeLabelRenderer = useStore(selector$6);
    if (!edgeLabelRenderer) {
      return null;
    }
    return reactDom.createPortal(children, edgeLabelRenderer);
  }
  var selector$5 = (s) => s.domNode?.querySelector(".react-flow__viewport-portal");
  function ViewportPortal({ children }) {
    const viewPortalDiv = useStore(selector$5);
    if (!viewPortalDiv) {
      return null;
    }
    return reactDom.createPortal(children, viewPortalDiv);
  }
  function useUpdateNodeInternals() {
    const store = useStoreApi();
    return react.useCallback((id) => {
      const { domNode, updateNodeInternals: updateNodeInternals2 } = store.getState();
      const updateIds = Array.isArray(id) ? id : [id];
      const updates =  new Map();
      updateIds.forEach((updateId) => {
        const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${updateId}"]`);
        if (nodeElement) {
          updates.set(updateId, { id: updateId, nodeElement, force: true });
        }
      });
      requestAnimationFrame(() => updateNodeInternals2(updates, { triggerFitView: false }));
    }, []);
  }
  var nodesSelector = (state) => state.nodes;
  function useNodes() {
    const nodes = useStore(nodesSelector, shallow.shallow);
    return nodes;
  }
  var edgesSelector = (state) => state.edges;
  function useEdges() {
    const edges = useStore(edgesSelector, shallow.shallow);
    return edges;
  }
  var viewportSelector = (state) => ({
    x: state.transform[0],
    y: state.transform[1],
    zoom: state.transform[2]
  });
  function useViewport() {
    const viewport = useStore(viewportSelector, shallow.shallow);
    return viewport;
  }
  function useNodesState(initialNodes) {
    const [nodes, setNodes] = react.useState(initialNodes);
    const onNodesChange = react.useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    return [nodes, setNodes, onNodesChange];
  }
  function useEdgesState(initialEdges) {
    const [edges, setEdges] = react.useState(initialEdges);
    const onEdgesChange = react.useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    return [edges, setEdges, onEdgesChange];
  }
  function useOnViewportChange({ onStart, onChange, onEnd }) {
    const store = useStoreApi();
    react.useEffect(() => {
      store.setState({ onViewportChangeStart: onStart });
    }, [onStart]);
    react.useEffect(() => {
      store.setState({ onViewportChange: onChange });
    }, [onChange]);
    react.useEffect(() => {
      store.setState({ onViewportChangeEnd: onEnd });
    }, [onEnd]);
  }
  function useOnSelectionChange({ onChange }) {
    const store = useStoreApi();
    react.useEffect(() => {
      const nextOnSelectionChangeHandlers = [...store.getState().onSelectionChangeHandlers, onChange];
      store.setState({ onSelectionChangeHandlers: nextOnSelectionChangeHandlers });
      return () => {
        const nextHandlers = store.getState().onSelectionChangeHandlers.filter((fn) => fn !== onChange);
        store.setState({ onSelectionChangeHandlers: nextHandlers });
      };
    }, [onChange]);
  }
  var selector$4 = (options) => (s) => {
    if (s.nodeLookup.size === 0) {
      return false;
    }
    for (const [, { hidden, internals }] of s.nodeLookup) {
      if (options.includeHiddenNodes || !hidden) {
        if (internals.handleBounds === void 0 || !system.nodeHasDimensions(internals.userNode)) {
          return false;
        }
      }
    }
    return true;
  };
  var defaultOptions = {
    includeHiddenNodes: false
  };
  function useNodesInitialized(options = defaultOptions) {
    const initialized = useStore(selector$4(options));
    return initialized;
  }
  function useHandleConnections({ type, id = null, nodeId, onConnect, onDisconnect }) {
    const _nodeId = useNodeId();
    const currentNodeId = nodeId ?? _nodeId;
    const prevConnections = react.useRef(null);
    const connections = useStore((state) => state.connectionLookup.get(`${currentNodeId}-${type}-${id}`), system.areConnectionMapsEqual);
    react.useEffect(() => {
      if (prevConnections.current && prevConnections.current !== connections) {
        const _connections = connections ??  new Map();
        system.handleConnectionChange(prevConnections.current, _connections, onDisconnect);
        system.handleConnectionChange(_connections, prevConnections.current, onConnect);
      }
      prevConnections.current = connections ??  new Map();
    }, [connections, onConnect, onDisconnect]);
    return react.useMemo(() => Array.from(connections?.values() ?? []), [connections]);
  }
  function useNodesData(nodeIds) {
    const nodesData = useStore(react.useCallback((s) => {
      const data = [];
      const isArrayOfIds = Array.isArray(nodeIds);
      const _nodeIds = isArrayOfIds ? nodeIds : [nodeIds];
      for (const nodeId of _nodeIds) {
        const node = s.nodeLookup.get(nodeId);
        if (node) {
          data.push({
            id: node.id,
            type: node.type,
            data: node.data
          });
        }
      }
      return isArrayOfIds ? data : data[0] ?? null;
    }, [nodeIds]), system.shallowNodeData);
    return nodesData;
  }
  function useInternalNode(id) {
    const node = useStore(react.useCallback((s) => s.nodeLookup.get(id), [id]), shallow.shallow);
    return node;
  }
  function LinePattern({ dimensions, lineWidth, variant, className }) {
    return jsxRuntime.jsx("path", { strokeWidth: lineWidth, d: `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`, className: cc(["react-flow__background-pattern", variant, className]) });
  }
  function DotPattern({ radius, className }) {
    return jsxRuntime.jsx("circle", { cx: radius, cy: radius, r: radius, className: cc(["react-flow__background-pattern", "dots", className]) });
  }
  exports.BackgroundVariant = void 0;
  (function(BackgroundVariant2) {
    BackgroundVariant2["Lines"] = "lines";
    BackgroundVariant2["Dots"] = "dots";
    BackgroundVariant2["Cross"] = "cross";
  })(exports.BackgroundVariant || (exports.BackgroundVariant = {}));
  var defaultSize = {
    [exports.BackgroundVariant.Dots]: 1,
    [exports.BackgroundVariant.Lines]: 1,
    [exports.BackgroundVariant.Cross]: 6
  };
  var selector$3 = (s) => ({ transform: s.transform, patternId: `pattern-${s.rfId}` });
  function BackgroundComponent({
    id,
    variant = exports.BackgroundVariant.Dots,
    gap = 20,
    size,
    lineWidth = 1,
    offset = 0,
    color,
    bgColor,
    style: style2,
    className,
    patternClassName
  }) {
    const ref = react.useRef(null);
    const { transform, patternId } = useStore(selector$3, shallow.shallow);
    const patternSize = size || defaultSize[variant];
    const isDots = variant === exports.BackgroundVariant.Dots;
    const isCross = variant === exports.BackgroundVariant.Cross;
    const gapXY = Array.isArray(gap) ? gap : [gap, gap];
    const scaledGap = [gapXY[0] * transform[2] || 1, gapXY[1] * transform[2] || 1];
    const scaledSize = patternSize * transform[2];
    const offsetXY = Array.isArray(offset) ? offset : [offset, offset];
    const patternDimensions = isCross ? [scaledSize, scaledSize] : scaledGap;
    const scaledOffset = [
      offsetXY[0] * transform[2] || 1 + patternDimensions[0] / 2,
      offsetXY[1] * transform[2] || 1 + patternDimensions[1] / 2
    ];
    const _patternId = `${patternId}${id ? id : ""}`;
    return jsxRuntime.jsxs("svg", { className: cc(["react-flow__background", className]), style: {
      ...style2,
      ...containerStyle,
      "--xy-background-color-props": bgColor,
      "--xy-background-pattern-color-props": color
    }, ref, "data-testid": "rf__background", children: [jsxRuntime.jsx("pattern", { id: _patternId, x: transform[0] % scaledGap[0], y: transform[1] % scaledGap[1], width: scaledGap[0], height: scaledGap[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${scaledOffset[0]},-${scaledOffset[1]})`, children: isDots ? jsxRuntime.jsx(DotPattern, { radius: scaledSize / 2, className: patternClassName }) : jsxRuntime.jsx(LinePattern, { dimensions: patternDimensions, lineWidth, variant, className: patternClassName }) }), jsxRuntime.jsx("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${_patternId})` })] });
  }
  BackgroundComponent.displayName = "Background";
  var Background = react.memo(BackgroundComponent);
  function PlusIcon() {
    return jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: jsxRuntime.jsx("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
  }
  function MinusIcon() {
    return jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: jsxRuntime.jsx("path", { d: "M0 0h32v4.2H0z" }) });
  }
  function FitViewIcon() {
    return jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: jsxRuntime.jsx("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
  }
  function LockIcon() {
    return jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: jsxRuntime.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
  }
  function UnlockIcon() {
    return jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: jsxRuntime.jsx("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
  }
  function ControlButton({ children, className, ...rest }) {
    return jsxRuntime.jsx("button", { type: "button", className: cc(["react-flow__controls-button", className]), ...rest, children });
  }
  var selector$2 = (s) => ({
    isInteractive: s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
    minZoomReached: s.transform[2] <= s.minZoom,
    maxZoomReached: s.transform[2] >= s.maxZoom
  });
  function ControlsComponent({ style: style2, showZoom = true, showFitView = true, showInteractive = true, fitViewOptions, onZoomIn, onZoomOut, onFitView, onInteractiveChange, className, children, position = "bottom-left", orientation = "vertical", "aria-label": ariaLabel = "React Flow controls" }) {
    const store = useStoreApi();
    const { isInteractive, minZoomReached, maxZoomReached } = useStore(selector$2, shallow.shallow);
    const { zoomIn, zoomOut, fitView: fitView2 } = useReactFlow();
    const onZoomInHandler = () => {
      zoomIn();
      onZoomIn?.();
    };
    const onZoomOutHandler = () => {
      zoomOut();
      onZoomOut?.();
    };
    const onFitViewHandler = () => {
      fitView2(fitViewOptions);
      onFitView?.();
    };
    const onToggleInteractivity = () => {
      store.setState({
        nodesDraggable: !isInteractive,
        nodesConnectable: !isInteractive,
        elementsSelectable: !isInteractive
      });
      onInteractiveChange?.(!isInteractive);
    };
    const orientationClass = orientation === "horizontal" ? "horizontal" : "vertical";
    return jsxRuntime.jsxs(Panel, { className: cc(["react-flow__controls", orientationClass, className]), position, style: style2, "data-testid": "rf__controls", "aria-label": ariaLabel, children: [showZoom && jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(ControlButton, { onClick: onZoomInHandler, className: "react-flow__controls-zoomin", title: "zoom in", "aria-label": "zoom in", disabled: maxZoomReached, children: jsxRuntime.jsx(PlusIcon, {}) }), jsxRuntime.jsx(ControlButton, { onClick: onZoomOutHandler, className: "react-flow__controls-zoomout", title: "zoom out", "aria-label": "zoom out", disabled: minZoomReached, children: jsxRuntime.jsx(MinusIcon, {}) })] }), showFitView && jsxRuntime.jsx(ControlButton, { className: "react-flow__controls-fitview", onClick: onFitViewHandler, title: "fit view", "aria-label": "fit view", children: jsxRuntime.jsx(FitViewIcon, {}) }), showInteractive && jsxRuntime.jsx(ControlButton, { className: "react-flow__controls-interactive", onClick: onToggleInteractivity, title: "toggle interactivity", "aria-label": "toggle interactivity", children: isInteractive ? jsxRuntime.jsx(UnlockIcon, {}) : jsxRuntime.jsx(LockIcon, {}) }), children] });
  }
  ControlsComponent.displayName = "Controls";
  var Controls = react.memo(ControlsComponent);
  function MiniMapNodeComponent({ id, x, y, width, height, style: style2, color, strokeColor, strokeWidth, className, borderRadius, shapeRendering, selected: selected2, onClick }) {
    const { background, backgroundColor } = style2 || {};
    const fill = color || background || backgroundColor;
    return jsxRuntime.jsx("rect", { className: cc(["react-flow__minimap-node", { selected: selected2 }, className]), x, y, rx: borderRadius, ry: borderRadius, width, height, style: {
      fill,
      stroke: strokeColor,
      strokeWidth
    }, shapeRendering, onClick: onClick ? (event) => onClick(event, id) : void 0 });
  }
  var MiniMapNode = react.memo(MiniMapNodeComponent);
  var selectorNodeIds = (s) => s.nodes.map((node) => node.id);
  var getAttrFunction = (func) => func instanceof Function ? func : () => func;
  function MiniMapNodes({
    nodeStrokeColor,
    nodeColor,
    nodeClassName = "",
    nodeBorderRadius = 5,
    nodeStrokeWidth,
    nodeComponent: NodeComponent = MiniMapNode,
    onClick
  }) {
    const nodeIds = useStore(selectorNodeIds, shallow.shallow);
    const nodeColorFunc = getAttrFunction(nodeColor);
    const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
    const nodeClassNameFunc = getAttrFunction(nodeClassName);
    const shapeRendering = typeof window === "undefined" || !!window.chrome ? "crispEdges" : "geometricPrecision";
    return jsxRuntime.jsx(jsxRuntime.Fragment, { children: nodeIds.map((nodeId) => (
      jsxRuntime.jsx(NodeComponentWrapper, { id: nodeId, nodeColorFunc, nodeStrokeColorFunc, nodeClassNameFunc, nodeBorderRadius, nodeStrokeWidth, NodeComponent, onClick, shapeRendering }, nodeId)
    )) });
  }
  function NodeComponentWrapperInner({ id, nodeColorFunc, nodeStrokeColorFunc, nodeClassNameFunc, nodeBorderRadius, nodeStrokeWidth, shapeRendering, NodeComponent, onClick }) {
    const { node, x, y, width, height } = useStore((s) => {
      const node2 = s.nodeLookup.get(id);
      const { x: x2, y: y2 } = node2.internals.positionAbsolute;
      const { width: width2, height: height2 } = system.getNodeDimensions(node2);
      return {
        node: node2,
        x: x2,
        y: y2,
        width: width2,
        height: height2
      };
    }, shallow.shallow);
    if (!node || node.hidden || !system.nodeHasDimensions(node)) {
      return null;
    }
    return jsxRuntime.jsx(NodeComponent, { x, y, width, height, style: node.style, selected: !!node.selected, className: nodeClassNameFunc(node), color: nodeColorFunc(node), borderRadius: nodeBorderRadius, strokeColor: nodeStrokeColorFunc(node), strokeWidth: nodeStrokeWidth, shapeRendering, onClick, id: node.id });
  }
  var NodeComponentWrapper = react.memo(NodeComponentWrapperInner);
  var MiniMapNodes$1 = react.memo(MiniMapNodes);
  var defaultWidth = 200;
  var defaultHeight = 150;
  var selector$1 = (s) => {
    const viewBB = {
      x: -s.transform[0] / s.transform[2],
      y: -s.transform[1] / s.transform[2],
      width: s.width / s.transform[2],
      height: s.height / s.transform[2]
    };
    return {
      viewBB,
      boundingRect: s.nodeLookup.size > 0 ? system.getBoundsOfRects(system.getInternalNodesBounds(s.nodeLookup), viewBB) : viewBB,
      rfId: s.rfId,
      panZoom: s.panZoom,
      translateExtent: s.translateExtent,
      flowWidth: s.width,
      flowHeight: s.height
    };
  };
  var ARIA_LABEL_KEY = "react-flow__minimap-desc";
  function MiniMapComponent({
    style: style2,
    className,
    nodeStrokeColor,
    nodeColor,
    nodeClassName = "",
    nodeBorderRadius = 5,
    nodeStrokeWidth,
    nodeComponent,
    bgColor,
    maskColor,
    maskStrokeColor,
    maskStrokeWidth,
    position = "bottom-right",
    onClick,
    onNodeClick,
    pannable = false,
    zoomable = false,
    ariaLabel = "React Flow mini map",
    inversePan,
    zoomStep = 10,
    offsetScale = 5
  }) {
    const store = useStoreApi();
    const svg = react.useRef(null);
    const { boundingRect, viewBB, rfId, panZoom, translateExtent, flowWidth, flowHeight } = useStore(selector$1, shallow.shallow);
    const elementWidth = style2?.width ?? defaultWidth;
    const elementHeight = style2?.height ?? defaultHeight;
    const scaledWidth = boundingRect.width / elementWidth;
    const scaledHeight = boundingRect.height / elementHeight;
    const viewScale = Math.max(scaledWidth, scaledHeight);
    const viewWidth = viewScale * elementWidth;
    const viewHeight = viewScale * elementHeight;
    const offset = offsetScale * viewScale;
    const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
    const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
    const width = viewWidth + offset * 2;
    const height = viewHeight + offset * 2;
    const labelledBy = `${ARIA_LABEL_KEY}-${rfId}`;
    const viewScaleRef = react.useRef(0);
    const minimapInstance = react.useRef();
    viewScaleRef.current = viewScale;
    react.useEffect(() => {
      if (svg.current && panZoom) {
        minimapInstance.current = system.XYMinimap({
          domNode: svg.current,
          panZoom,
          getTransform: () => store.getState().transform,
          getViewScale: () => viewScaleRef.current
        });
        return () => {
          minimapInstance.current?.destroy();
        };
      }
    }, [panZoom]);
    react.useEffect(() => {
      minimapInstance.current?.update({
        translateExtent,
        width: flowWidth,
        height: flowHeight,
        inversePan,
        pannable,
        zoomStep,
        zoomable
      });
    }, [pannable, zoomable, inversePan, zoomStep, translateExtent, flowWidth, flowHeight]);
    const onSvgClick = onClick ? (event) => {
      const [x2, y2] = minimapInstance.current?.pointer(event) || [0, 0];
      onClick(event, { x: x2, y: y2 });
    } : void 0;
    const onSvgNodeClick = onNodeClick ? react.useCallback((event, nodeId) => {
      const node = store.getState().nodeLookup.get(nodeId);
      onNodeClick(event, node);
    }, []) : void 0;
    return jsxRuntime.jsx(Panel, { position, style: {
      ...style2,
      "--xy-minimap-background-color-props": typeof bgColor === "string" ? bgColor : void 0,
      "--xy-minimap-mask-background-color-props": typeof maskColor === "string" ? maskColor : void 0,
      "--xy-minimap-mask-stroke-color-props": typeof maskStrokeColor === "string" ? maskStrokeColor : void 0,
      "--xy-minimap-mask-stroke-width-props": typeof maskStrokeWidth === "number" ? maskStrokeWidth * viewScale : void 0,
      "--xy-minimap-node-background-color-props": typeof nodeColor === "string" ? nodeColor : void 0,
      "--xy-minimap-node-stroke-color-props": typeof nodeStrokeColor === "string" ? nodeStrokeColor : void 0,
      "--xy-minimap-node-stroke-width-props": typeof nodeStrokeWidth === "string" ? nodeStrokeWidth : void 0
    }, className: cc(["react-flow__minimap", className]), "data-testid": "rf__minimap", children: jsxRuntime.jsxs("svg", { width: elementWidth, height: elementHeight, viewBox: `${x} ${y} ${width} ${height}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": labelledBy, ref: svg, onClick: onSvgClick, children: [ariaLabel && jsxRuntime.jsx("title", { id: labelledBy, children: ariaLabel }), jsxRuntime.jsx(MiniMapNodes$1, { onClick: onSvgNodeClick, nodeColor, nodeStrokeColor, nodeBorderRadius, nodeClassName, nodeStrokeWidth, nodeComponent }), jsxRuntime.jsx("path", { className: "react-flow__minimap-mask", d: `M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
  }
  MiniMapComponent.displayName = "MiniMap";
  var MiniMap = react.memo(MiniMapComponent);
  function ResizeControl({ nodeId, position, variant = system.ResizeControlVariant.Handle, className, style: style2 = {}, children, color, minWidth = 10, minHeight = 10, maxWidth = Number.MAX_VALUE, maxHeight = Number.MAX_VALUE, keepAspectRatio = false, shouldResize, onResizeStart, onResize, onResizeEnd }) {
    const contextNodeId = useNodeId();
    const id = typeof nodeId === "string" ? nodeId : contextNodeId;
    const store = useStoreApi();
    const resizeControlRef = react.useRef(null);
    const defaultPosition = variant === system.ResizeControlVariant.Line ? "right" : "bottom-right";
    const controlPosition = position ?? defaultPosition;
    const resizer = react.useRef(null);
    react.useEffect(() => {
      if (!resizeControlRef.current || !id) {
        return;
      }
      if (!resizer.current) {
        resizer.current = system.XYResizer({
          domNode: resizeControlRef.current,
          nodeId: id,
          getStoreItems: () => {
            const { nodeLookup, transform, snapGrid, snapToGrid, nodeOrigin, domNode } = store.getState();
            return {
              nodeLookup,
              transform,
              snapGrid,
              snapToGrid,
              nodeOrigin,
              paneDomNode: domNode
            };
          },
          onChange: (change, childChanges) => {
            const { triggerNodeChanges, nodeLookup, parentLookup, nodeOrigin } = store.getState();
            const changes = [];
            const nextPosition = { x: change.x, y: change.y };
            const node = nodeLookup.get(id);
            if (node && node.expandParent && node.parentId) {
              const origin = node.origin ?? nodeOrigin;
              const width = change.width ?? node.measured.width;
              const height = change.height ?? node.measured.height;
              const child = {
                id: node.id,
                parentId: node.parentId,
                rect: {
                  width,
                  height,
                  ...system.evaluateAbsolutePosition({
                    x: change.x ?? node.position.x,
                    y: change.y ?? node.position.y
                  }, { width, height }, node.parentId, nodeLookup, origin)
                }
              };
              const parentExpandChanges = system.handleExpandParent([child], nodeLookup, parentLookup, nodeOrigin);
              changes.push(...parentExpandChanges);
              nextPosition.x = change.x ? Math.max(origin[0] * width, change.x) : void 0;
              nextPosition.y = change.y ? Math.max(origin[1] * height, change.y) : void 0;
            }
            if (nextPosition.x !== void 0 && nextPosition.y !== void 0) {
              const positionChange = {
                id,
                type: "position",
                position: { ...nextPosition }
              };
              changes.push(positionChange);
            }
            if (change.width !== void 0 && change.height !== void 0) {
              const dimensionChange = {
                id,
                type: "dimensions",
                resizing: true,
                setAttributes: true,
                dimensions: {
                  width: change.width,
                  height: change.height
                }
              };
              changes.push(dimensionChange);
            }
            for (const childChange of childChanges) {
              const positionChange = {
                ...childChange,
                type: "position"
              };
              changes.push(positionChange);
            }
            triggerNodeChanges(changes);
          },
          onEnd: () => {
            const dimensionChange = {
              id,
              type: "dimensions",
              resizing: false
            };
            store.getState().triggerNodeChanges([dimensionChange]);
          }
        });
      }
      resizer.current.update({
        controlPosition,
        boundaries: {
          minWidth,
          minHeight,
          maxWidth,
          maxHeight
        },
        keepAspectRatio,
        onResizeStart,
        onResize,
        onResizeEnd,
        shouldResize
      });
      return () => {
        resizer.current?.destroy();
      };
    }, [
      controlPosition,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      keepAspectRatio,
      onResizeStart,
      onResize,
      onResizeEnd,
      shouldResize
    ]);
    const positionClassNames = controlPosition.split("-");
    const colorStyleProp = variant === system.ResizeControlVariant.Line ? "borderColor" : "backgroundColor";
    const controlStyle = color ? { ...style2, [colorStyleProp]: color } : style2;
    return jsxRuntime.jsx("div", { className: cc(["react-flow__resize-control", "nodrag", ...positionClassNames, variant, className]), ref: resizeControlRef, style: controlStyle, children });
  }
  var NodeResizeControl = react.memo(ResizeControl);
  function NodeResizer({ nodeId, isVisible = true, handleClassName, handleStyle, lineClassName, lineStyle, color, minWidth = 10, minHeight = 10, maxWidth = Number.MAX_VALUE, maxHeight = Number.MAX_VALUE, keepAspectRatio = false, shouldResize, onResizeStart, onResize, onResizeEnd }) {
    if (!isVisible) {
      return null;
    }
    return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [system.XY_RESIZER_LINE_POSITIONS.map((position) => jsxRuntime.jsx(NodeResizeControl, { className: lineClassName, style: lineStyle, nodeId, position, variant: system.ResizeControlVariant.Line, color, minWidth, minHeight, maxWidth, maxHeight, onResizeStart, keepAspectRatio, shouldResize, onResize, onResizeEnd }, position)), system.XY_RESIZER_HANDLE_POSITIONS.map((position) => jsxRuntime.jsx(NodeResizeControl, { className: handleClassName, style: handleStyle, nodeId, position, color, minWidth, minHeight, maxWidth, maxHeight, onResizeStart, keepAspectRatio, shouldResize, onResize, onResizeEnd }, position))] });
  }
  var selector = (state) => state.domNode?.querySelector(".react-flow__renderer");
  function NodeToolbarPortal({ children }) {
    const wrapperRef = useStore(selector);
    if (!wrapperRef) {
      return null;
    }
    return reactDom.createPortal(children, wrapperRef);
  }
  var nodeEqualityFn = (a, b) => a?.internals.positionAbsolute.x !== b?.internals.positionAbsolute.x || a?.internals.positionAbsolute.y !== b?.internals.positionAbsolute.y || a?.measured.width !== b?.measured.width || a?.measured.height !== b?.measured.height || a?.selected !== b?.selected || a?.internals.z !== b?.internals.z;
  var nodesEqualityFn = (a, b) => {
    if (a.size !== b.size) {
      return false;
    }
    for (const [key, node] of a) {
      if (nodeEqualityFn(node, b.get(key))) {
        return false;
      }
    }
    return true;
  };
  var storeSelector = (state) => ({
    x: state.transform[0],
    y: state.transform[1],
    zoom: state.transform[2],
    selectedNodesCount: state.nodes.filter((node) => node.selected).length
  });
  function NodeToolbar({ nodeId, children, className, style: style2, isVisible, position = system.Position.Top, offset = 10, align = "center", ...rest }) {
    const contextNodeId = useNodeId();
    const nodesSelector2 = react.useCallback((state) => {
      const nodeIds = Array.isArray(nodeId) ? nodeId : [nodeId || contextNodeId || ""];
      const internalNodes = nodeIds.reduce((res, id) => {
        const node = state.nodeLookup.get(id);
        if (node) {
          res.set(node.id, node);
        }
        return res;
      },  new Map());
      return internalNodes;
    }, [nodeId, contextNodeId]);
    const nodes = useStore(nodesSelector2, nodesEqualityFn);
    const { x, y, zoom, selectedNodesCount } = useStore(storeSelector, shallow.shallow);
    const isActive = typeof isVisible === "boolean" ? isVisible : nodes.size === 1 && nodes.values().next().value.selected && selectedNodesCount === 1;
    if (!isActive || !nodes.size) {
      return null;
    }
    const nodeRect = system.getInternalNodesBounds(nodes);
    const nodesArray = Array.from(nodes.values());
    const zIndex = Math.max(...nodesArray.map((node) => node.internals.z + 1));
    const wrapperStyle2 = {
      position: "absolute",
      transform: system.getNodeToolbarTransform(nodeRect, { x, y, zoom }, position, offset, align),
      zIndex,
      ...style2
    };
    return jsxRuntime.jsx(NodeToolbarPortal, { children: jsxRuntime.jsx("div", { style: wrapperStyle2, className: cc(["react-flow__node-toolbar", className]), ...rest, "data-id": nodesArray.reduce((acc, node) => `${acc}${node.id} `, "").trim(), children }) });
  }

  Object.defineProperty(exports, "ConnectionLineType", {
    enumerable: true,
    get: function () { return system.ConnectionLineType; }
  });
  Object.defineProperty(exports, "ConnectionMode", {
    enumerable: true,
    get: function () { return system.ConnectionMode; }
  });
  Object.defineProperty(exports, "MarkerType", {
    enumerable: true,
    get: function () { return system.MarkerType; }
  });
  Object.defineProperty(exports, "PanOnScrollMode", {
    enumerable: true,
    get: function () { return system.PanOnScrollMode; }
  });
  Object.defineProperty(exports, "Position", {
    enumerable: true,
    get: function () { return system.Position; }
  });
  Object.defineProperty(exports, "SelectionMode", {
    enumerable: true,
    get: function () { return system.SelectionMode; }
  });
  Object.defineProperty(exports, "addEdge", {
    enumerable: true,
    get: function () { return system.addEdge; }
  });
  Object.defineProperty(exports, "getBezierEdgeCenter", {
    enumerable: true,
    get: function () { return system.getBezierEdgeCenter; }
  });
  Object.defineProperty(exports, "getBezierPath", {
    enumerable: true,
    get: function () { return system.getBezierPath; }
  });
  Object.defineProperty(exports, "getConnectedEdges", {
    enumerable: true,
    get: function () { return system.getConnectedEdges; }
  });
  Object.defineProperty(exports, "getEdgeCenter", {
    enumerable: true,
    get: function () { return system.getEdgeCenter; }
  });
  Object.defineProperty(exports, "getIncomers", {
    enumerable: true,
    get: function () { return system.getIncomers; }
  });
  Object.defineProperty(exports, "getNodesBounds", {
    enumerable: true,
    get: function () { return system.getNodesBounds; }
  });
  Object.defineProperty(exports, "getOutgoers", {
    enumerable: true,
    get: function () { return system.getOutgoers; }
  });
  Object.defineProperty(exports, "getSmoothStepPath", {
    enumerable: true,
    get: function () { return system.getSmoothStepPath; }
  });
  Object.defineProperty(exports, "getStraightPath", {
    enumerable: true,
    get: function () { return system.getStraightPath; }
  });
  Object.defineProperty(exports, "getViewportForBounds", {
    enumerable: true,
    get: function () { return system.getViewportForBounds; }
  });
  Object.defineProperty(exports, "reconnectEdge", {
    enumerable: true,
    get: function () { return system.reconnectEdge; }
  });
  exports.Background = Background;
  exports.BaseEdge = BaseEdge;
  exports.BezierEdge = BezierEdge;
  exports.ControlButton = ControlButton;
  exports.Controls = Controls;
  exports.EdgeLabelRenderer = EdgeLabelRenderer;
  exports.EdgeText = EdgeText;
  exports.Handle = Handle;
  exports.MiniMap = MiniMap;
  exports.NodeResizeControl = NodeResizeControl;
  exports.NodeResizer = NodeResizer;
  exports.NodeToolbar = NodeToolbar;
  exports.Panel = Panel;
  exports.ReactFlow = index;
  exports.ReactFlowProvider = ReactFlowProvider;
  exports.SimpleBezierEdge = SimpleBezierEdge;
  exports.SmoothStepEdge = SmoothStepEdge;
  exports.StepEdge = StepEdge;
  exports.StraightEdge = StraightEdge;
  exports.ViewportPortal = ViewportPortal;
  exports.applyEdgeChanges = applyEdgeChanges;
  exports.applyNodeChanges = applyNodeChanges;
  exports.getSimpleBezierPath = getSimpleBezierPath;
  exports.isEdge = isEdge;
  exports.isNode = isNode;
  exports.useConnection = useConnection;
  exports.useEdges = useEdges;
  exports.useEdgesState = useEdgesState;
  exports.useHandleConnections = useHandleConnections;
  exports.useInternalNode = useInternalNode;
  exports.useKeyPress = useKeyPress;
  exports.useNodeId = useNodeId;
  exports.useNodes = useNodes;
  exports.useNodesData = useNodesData;
  exports.useNodesInitialized = useNodesInitialized;
  exports.useNodesState = useNodesState;
  exports.useOnSelectionChange = useOnSelectionChange;
  exports.useOnViewportChange = useOnViewportChange;
  exports.useReactFlow = useReactFlow;
  exports.useStore = useStore;
  exports.useStoreApi = useStoreApi;
  exports.useUpdateNodeInternals = useUpdateNodeInternals;
  exports.useViewport = useViewport;
}));
// ==UserScript==
// @name         Microsoft Power Platform/Dynamics 365 CE - Generate TypeScript Definitions
// @namespace    https://github.com/gncnpk/xrm-generate-ts-overloads
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @version      1.998
// @license      MIT
// @description  Automatically creates TypeScript type definitions compatible with @types/xrm by extracting form attributes and controls from Dynamics 365/Power Platform model-driven applications.
// @match        https://*.dynamics.com/main.aspx?appid=*&pagetype=entityrecord&etn=*&id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529631/Microsoft%20Power%20PlatformDynamics%20365%20CE%20-%20Generate%20TypeScript%20Definitions.user.js
// @updateURL https://update.greasyfork.org/scripts/529631/Microsoft%20Power%20PlatformDynamics%20365%20CE%20-%20Generate%20TypeScript%20Definitions.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const groupItemsByType = (items) => {
    return Object.entries(items).reduce((acc, [itemName, itemType]) => {
      if (!acc[itemType]) {
        acc[itemType] = [];
      }
      acc[itemType].push(itemName);
      return acc;
    }, {});
  };
  const stripNonAlphaNumeric = (str) => {
    return str.replace(/\W/g, "");
  };
  // Create a button element and style it to be fixed in the bottom-right corner.
  const btn = document.createElement("button");
  btn.textContent = "Generate TypeScript Definitions";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.padding = "10px";
  btn.style.backgroundColor = "#007ACC";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.cursor = "pointer";
  btn.style.zIndex = 10000;
  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    // Mapping objects for Xrm attribute and control types.
    var attributeTypeMapping = {
      boolean: "Xrm.Attributes.BooleanAttribute",
      datetime: "Xrm.Attributes.DateAttribute",
      decimal: "Xrm.Attributes.NumberAttribute",
      double: "Xrm.Attributes.NumberAttribute",
      integer: "Xrm.Attributes.NumberAttribute",
      lookup: "Xrm.Attributes.LookupAttribute",
      memo: "Xrm.Attributes.StringAttribute",
      money: "Xrm.Attributes.NumberAttribute",
      multiselectoptionset: "Xrm.Attributes.MultiselectOptionSetAttribute",
      optionset: "Xrm.Attributes.OptionSetAttribute",
      string: "Xrm.Attributes.StringAttribute",
    };

    var controlTypeMapping = {
      standard: "Xrm.Controls.StandardControl",
      iframe: "Xrm.Controls.IframeControl",
      lookup: "Xrm.Controls.LookupControl",
      optionset: "Xrm.Controls.OptionSetControl",
      "customsubgrid:MscrmControls.Grid.GridControl":
        "Xrm.Controls.GridControl",
      subgrid: "Xrm.Controls.GridControl",
      timelinewall: "Xrm.Controls.TimelineWall",
      quickform: "Xrm.Controls.QuickFormControl",
      formcomponent: "Xrm.FormContext",
    };

    var specificControlTypeMapping = {
      boolean: "Xrm.Controls.BooleanControl",
      datetime: "Xrm.Controls.DateControl",
      decimal: "Xrm.Controls.NumberControl",
      double: "Xrm.Controls.NumberControl",
      integer: "Xrm.Controls.NumberControl",
      lookup: "Xrm.Controls.LookupControl",
      memo: "Xrm.Controls.StringControl",
      money: "Xrm.Controls.NumberControl",
      multiselectoptionset: "Xrm.Controls.MultiselectOptionSetControl",
      optionset: "Xrm.Controls.OptionSetControl",
      string: "Xrm.Controls.StringControl",
    };

    // Object to hold the type information.
    const typeInfo = {
      subGrids: {},
      quickViews: {},
      formAttributes: {},
      formControls: {},
      subForms: {},
      possibleEnums: [],
      formTabs: {},
      formEnums: {},
    };

    class Form {
      constructor() {
        this.attributes = {};
        this.controls = {};
        this.enums = {};
        this.subGrids = {};
        this.quickViews = {};
      }
    }
    class Subgrid {
      constructor() {
        this.attributes = {};
        this.enums = {};
      }
    }
    class QuickForm {
      constructor() {
        this.attributes = {};
        this.controls = {};
        this.enums = {};
      }
    }

    class Tab {
      constructor() {
        this.sections = {};
      }
    }

    const currentFormName = stripNonAlphaNumeric(
      Xrm.Page.ui.formSelector.getCurrentItem().getLabel()
    );

    // Loop through all controls on the form.
    function getControls(formContext, controlObject) {
      if (
        typeof formContext !== "undefined" &&
        formContext &&
        typeof formContext.getControl === "function"
      ) {
        formContext.getControl().forEach((ctrl) => {
          const ctrlType = ctrl.getControlType();
          const mappedType = controlTypeMapping[ctrlType];
          if (mappedType) {
            controlObject[ctrl.getName()] = mappedType;
          }
        });
      } else {
        alert("Xrm.Page is not available on this page.");
        return;
      }
    }

    getControls(Xrm.Page, typeInfo.formControls);

    // Loop through all tabs and sections on the form.
    if (typeof Xrm.Page.ui.tabs.get === "function") {
      Xrm.Page.ui.tabs.get().forEach((tab) => {
        let formTab = (typeInfo.formTabs[stripNonAlphaNumeric(tab.getName())] =
          new Tab());
        tab.sections.forEach((section) => {
          formTab.sections[
            stripNonAlphaNumeric(section.getName())
          ] = `${stripNonAlphaNumeric(section.getName())}_section`;
        });
      });
    }

    // Loop through all attributes on the form.
    function getAttributes(
      formContext,
      attributesObject,
      controlsObject,
      enumsObject
    ) {
      if (typeof formContext.getAttribute === "function") {
        formContext.getAttribute().forEach((attr) => {
          const attrType = attr.getAttributeType();
          const attrName = attr.getName();
          const mappedType = attributeTypeMapping[attrType];
          const mappedControlType = specificControlTypeMapping[attrType];
          if (mappedType) {
            attributesObject[attrName] = mappedType;
            attr.controls.forEach((ctrl) => {
              controlsObject[ctrl.getName()] = mappedControlType;
            });
          }
          if (
            attr.getAttributeType() === "optionset" &&
            attr.controls.get().length > 0
          ) {
            const enumValues = attr.getOptions();
            if (enumValues) {
              enumsObject[attrName] = { attribute: "", values: [] };
              enumsObject[attrName].values = enumValues;
              enumsObject[attrName].attribute = attrName;
              attributesObject[attrName] = `${attrName}_attribute`;
            }
          }
        });
      }
    }
    getAttributes(
      Xrm.Page,
      typeInfo.formAttributes,
      typeInfo.formControls,
      typeInfo.formEnums
    );

    // Loop through all subgrids on the form.
    function getSubGrids(formContext, subGridsObject, controlsObject) {
      if (typeof formContext.getControl === "function") {
        formContext.getControl().forEach((ctrl) => {
          if (
            ctrl.getControlType() === "subgrid" ||
            ctrl.getControlType() ===
              "customsubgrid:MscrmControls.Grid.GridControl"
          ) {
            const gridRow = ctrl.getGrid().getRows().get(0);
            const gridName = ctrl.getName();
            let subgrid = (subGridsObject[gridName] = new Subgrid());
            controlsObject[gridName] = `${gridName}_gridcontrol`;
            if (gridRow !== null) {
              gridRow.data.entity.attributes.forEach((attr) => {
                const attrType = attr.getAttributeType();
                const attrName = attr.getName();
                const mappedType = attributeTypeMapping[attrType];
                if (mappedType) {
                  subgrid.attributes[attrName] = mappedType;
                }
                if (
                  attr.getAttributeType() === "optionset" &&
                  attr.controls.get().length > 0
                ) {
                  const enumValues = attr.getOptions();
                  if (enumValues) {
                    subgrid.enums[attrName] = { attribute: "", values: [] };
                    subgrid.enums[attrName].values = enumValues;
                    subgrid.enums[attrName].attribute = attrName;
                    subgrid.attributes[attrName] = `${attrName}_attribute`;
                  }
                }
              });
            }
          }
        });
      }
    }
    getSubGrids(Xrm.Page, typeInfo.subGrids, typeInfo.formControls);

    if (typeof Xrm.Page.getControl === "function") {
      Xrm.Page.getControl().forEach((ctrl) => {
        if (ctrl.getControlType() === "formcomponent") {
          let formObject = (typeInfo.subForms[`${ctrl.getName()}`] =
            new Form());
          try {
            getControls(ctrl, formObject.controls);
            getAttributes(
              ctrl,
              formObject.attributes,
              formObject.controls,
              formObject.enums
            );
            getSubGrids(ctrl, formObject.subGrids, formObject.controls);
            getQuickViews(ctrl, formObject.quickViews, formObject.controls);
          } catch {}
        }
      });
    }
    function generateEnums(possibleEnums, enumsObject) {
      for (const [originalEnumName, enumValues] of Object.entries(
        enumsObject
      )) {
        if (possibleEnums.includes(originalEnumName)) {
          continue;
        }
        possibleEnums.push(originalEnumName);
        let enumName = `${originalEnumName}_enum`;
        let enumTemplate = [];
        let textLiteralTypes = [];
        let valueLiteralTypes = [];
        for (const enumValue of enumValues.values) {
          enumTemplate.push(
            `   ${enumValue.text.replace(/\W/g, "").replace(/[0-9]/g, "")} = ${
              enumValue.value
            }`
          );
          textLiteralTypes.push(`"${enumValue.text}"`);
          valueLiteralTypes.push(
            `${enumName}.${enumValue.text
              .replace(/\W/g, "")
              .replace(/[0-9]/g, "")}`
          );
        }
        outputTS += `
const enum ${enumName} {
${enumTemplate.join(",\n")}
}
`;
        outputTS += `
interface ${enumValues.attribute}_value extends Xrm.OptionSetValue {
text: ${textLiteralTypes.join(" | ")};
value: ${valueLiteralTypes.join(" | ")};  
}
`;
        outputTS += `
interface ${enumValues.attribute}_attribute extends Xrm.Attributes.OptionSetAttribute<${enumName}> {
   `;
        valueLiteralTypes.forEach((value, index) => {
          outputTS += `getOption(value: ${value}): {text: ${textLiteralTypes[index]}, value: ${value}};\n`;
        });
        outputTS += `getOption(value: ${enumValues.attribute}_value['value']): ${enumValues.attribute}_value | null;
  getOptions(): ${enumValues.attribute}_value[];
  getSelectedOption(): ${enumValues.attribute}_value | null;
  getValue(): ${enumName} | null;
  setValue(value: ${enumName} | null): void;
  getText(): ${enumValues.attribute}_value['text'] | null;
}
`;
      }
    }

    function generateLiteralsTypesUnionsAndCollection(
      unionAndCollectionName,
      literalsAndTypesObject,
      defaultType = "unknown",
      generateCollection = true,
      useLiteralAndAppendToType = ""
    ) {
      if (generateCollection) {
        outputTS += `
  interface ${unionAndCollectionName} extends Xrm.Collection.ItemCollection<${unionAndCollectionName}_types> {`;
        if (useLiteralAndAppendToType) {
          for (const [literal, type] of Object.entries(
            literalsAndTypesObject
          )) {
            outputTS += `get(itemName: "${literal}"): ${literal}${useLiteralAndAppendToType};\n`;
          }
        } else {
          for (const [type, literal] of Object.entries(
            groupItemsByType(literalsAndTypesObject)
          )) {
            outputTS += `get(itemName: "${literal.join('" | "')}"): ${type};\n`;
          }
        }
        outputTS += `
      get(itemName: ${unionAndCollectionName}_literals): ${unionAndCollectionName}_types;
      get(itemNameOrIndex: string | number): ${unionAndCollectionName} | null;
      get(delegate?): ${unionAndCollectionName}_types[];
      }
  `;
      }
      if (useLiteralAndAppendToType) {
        outputTS += `
  type ${unionAndCollectionName}_types = ${new Set(
          Object.keys(literalsAndTypesObject)
        )
          .map((literal) => `${literal}${useLiteralAndAppendToType}`)
          .join(" | ")}${
          Object.keys(literalsAndTypesObject).length === 0 ? defaultType : ""
        };\n`;
      } else {
        outputTS += `
  type ${unionAndCollectionName}_types = ${new Set(
          Object.values(literalsAndTypesObject)
        )
          .map((type) => `${type}`)
          .join(" | ")}${
          Object.keys(literalsAndTypesObject).length === 0 ? defaultType : ""
        };\n`;
      }

      outputTS += `
  type ${unionAndCollectionName}_literals = ${new Set(
        Object.keys(literalsAndTypesObject)
      )
        .map((literal) => `"${literal}"`)
        .join(" | ")}${
        Object.keys(literalsAndTypesObject).length === 0 ? '""' : ""
      };\n`;
    }

    function generateSubgridTypes(subgridName) {
      outputTS += `
  interface ${subgridName}_entity extends Xrm.Entity {
    attributes: ${subgridName}_attributes;
  }
  interface ${subgridName}_data extends Xrm.Data {
    entity: ${subgridName}_entity;
  }
  
  interface ${subgridName}_gridrow extends Xrm.Controls.Grid.GridRow {
    data: ${subgridName}_data;
  }
  
  interface ${subgridName}_grid extends Xrm.Controls.Grid {
    getRows(): Xrm.Collection.ItemCollection<${subgridName}_gridrow>;
  }
  
  interface ${subgridName}_gridcontrol extends Xrm.Controls.GridControl {
    getGrid(): ${subgridName}_grid;
  }`;
    }
    function generateContext(
      formName,
      contextType,
      attributesObject,
      controlsObject,
      uiType = null
    ) {
      let contextSuffix;
      if (contextType === "Xrm.FormContext") {
        contextSuffix = `context`;
      } else if (contextType === "Xrm.Controls.QuickFormControl") {
        contextSuffix = `quickformcontrol`;
      }
      outputTS += `
      interface ${formName}_${contextSuffix} extends ${contextType} {`;
      if (uiType) {
        outputTS += `ui: ${uiType};`;
      }
      if (attributesObject) {
        for (const [attrType, attrNames] of Object.entries(
          groupItemsByType(attributesObject)
        )) {
          outputTS += `getAttribute(attributeName: "${attrNames.join(
            '" | "'
          )}"): ${attrType};\n`;
        }
        outputTS += `getAttribute(attributeName: ${formName}_attributes_literals): ${formName}_attributes_types;`;
        outputTS += `getAttribute(attributeNameOrIndex: string | number): Xrm.Attributes.Attribute | null;`;
        outputTS += `getAttribute(delegateFunction?): ${formName}_attributes[];`;
      }
      if (controlsObject) {
        for (const [controlType, controlNames] of Object.entries(
          groupItemsByType(controlsObject)
        )) {
          outputTS += `getControl(controlName: "${controlNames.join(
            '" | "'
          )}"): ${controlType};\n`;
        }
        outputTS += `getControl(controlName: ${formName}_controls_literals): ${formName}_controls_types;`;
        outputTS += `getControl(controlNameOrIndex: string | number): Xrm.Controls.Control | null;`;
        outputTS += `getControl(delegateFunction?): ${formName}_controls_types[];`;
      }
      outputTS += `}`;
      outputTS += `
  interface ${formName}_eventcontext extends Xrm.Events.EventContext {
    getFormContext(): ${formName}_${contextSuffix};
}`;
    }
    // Loop through all Quick View controls and attributes on the form.
    function getQuickViews(formContext, quickViewsObject, controlsObject) {
      if (typeof formContext.ui.quickForms.get === "function") {
        formContext.ui.quickForms.get().forEach((ctrl) => {
          const quickViewName = ctrl.getName();
          let quickView = (quickViewsObject[quickViewName] = new QuickForm());
          controlsObject[quickViewName] = `${quickViewName}_quickformcontrol`;
          ctrl.getControl().forEach((subCtrl) => {
            if (typeof subCtrl.getAttribute !== "function") {
              return;
            }
            const subCtrlAttrType = subCtrl.getAttribute().getAttributeType();
            const mappedControlType =
              specificControlTypeMapping[subCtrlAttrType] ??
              controlTypeMapping[subCtrl.getControlType()];
            if (mappedControlType) {
              quickView.controls[subCtrl.getName()] = mappedControlType;
            }
          });
          ctrl.getAttribute().forEach((attr) => {
            const attrType = attr.getAttributeType();
            const attrName = attr.getName();
            const mappedType = attributeTypeMapping[attrType];
            if (mappedType) {
              quickView.attributes[attrName] = mappedType;
            }
            if (attrType === "optionset" && attr.controls.get().length > 0) {
              const enumValues = attr.getOptions();
              if (enumValues) {
                quickView.enums[attrName] = { attribute: "", values: [] };
                quickView.enums[attrName].values = enumValues;
                quickView.enums[attrName].attribute = attrName;
                quickView.attributes[attrName] = `${attrName}_attribute`;
              }
            }
          });
        });
      }
    }
    getQuickViews(Xrm.Page, typeInfo.quickViews, typeInfo.formControls);

    // Build the TypeScript overload string.
    let outputTS = `// These TypeScript definitions were generated automatically on: ${new Date().toDateString()}\n`;
    generateEnums(typeInfo.possibleEnums, typeInfo.formEnums);
    for (let [subgridName, subgrid] of Object.entries(typeInfo.subGrids)) {
      subgridName = subgridName.replace(/\W/g, "");
      generateEnums(typeInfo.possibleEnums, subgrid.enums);
      generateLiteralsTypesUnionsAndCollection(
        `${subgridName}_attributes`,
        subgrid.attributes,
        "Xrm.Attributes.Attribute",
        true
      );
      generateSubgridTypes(subgridName);
      generateContext(`${subgridName}`, `Xrm.FormContext`, subgrid.attributes);
    }
    for (const [quickViewName, quickView] of Object.entries(
      typeInfo.quickViews
    )) {
      generateEnums(typeInfo.possibleEnums, quickView.enums);
      generateLiteralsTypesUnionsAndCollection(
        `${quickViewName}_attributes`,
        quickView.attributes,
        "Xrm.Attributes.Attribute",
        false
      );
      generateLiteralsTypesUnionsAndCollection(
        `${quickViewName}_controls`,
        quickView.controls,
        "Xrm.Controls.Control",
        false
      );
      generateContext(
        `${quickViewName}`,
        `Xrm.Controls.QuickFormControl`,
        quickView.attributes,
        quickView.controls
      );
    }

    for (const [tabName, tab] of Object.entries(typeInfo.formTabs)) {
      outputTS += `
      type ${tabName}_sections_literals = ${new Set(Object.keys(tab.sections))
        .map((sectionName) => `"${sectionName}"`)
        .join(" | ")}${Object.keys(tab.sections).length === 0 ? '""' : ""};\n`;
      outputTS += `
interface ${tabName}_sections extends Xrm.Collection.ItemCollection<Xrm.Controls.Section> {`;
      outputTS += `get(itemName: ${tabName}_sections_literals): Xrm.Controls.Section;\n`;
      outputTS += `get(itemNameOrIndex: string | number): Xrm.Controls.Section | null;\n`;
      outputTS += `get(delegate?): Xrm.Controls.Section[];\n`;
      outputTS += `}`;

      outputTS += `
interface ${tabName}_tab extends Xrm.Controls.Tab {
  sections: ${tabName}_sections;
    }`;
    }
    generateLiteralsTypesUnionsAndCollection(
      `${currentFormName}_tabs`,
      typeInfo.formTabs,
      "Xrm.Controls.Tab",
      true,
      "_tab"
    );
    generateLiteralsTypesUnionsAndCollection(
      `${currentFormName}_quickforms`,
      typeInfo.quickViews,
      "Xrm.Controls.QuickFormControl",
      true,
      "_quickformcontrol"
    );
    generateLiteralsTypesUnionsAndCollection(
      `${currentFormName}_controls`,
      typeInfo.formControls,
      "Xrm.Controls.Control",
      false
    );
    generateLiteralsTypesUnionsAndCollection(
      `${currentFormName}_attributes`,
      typeInfo.formAttributes,
      "Xrm.Attributes.Attribute",
      false
    );
    outputTS += `
    interface ${currentFormName}_ui extends Xrm.Ui {
      quickForms: ${currentFormName}_quickforms | null;
      tabs: ${currentFormName}_tabs;
    }
    `;
    generateContext(
      currentFormName,
      `Xrm.FormContext`,
      typeInfo.formAttributes,
      typeInfo.formControls,
      `${currentFormName}_ui`
    );

    for (const [formName, formObject] of Object.entries(typeInfo.subForms)) {
      generateEnums(typeInfo.possibleEnums, formObject.enums);
      for (let [subgridName, subgrid] of Object.entries(formObject.subGrids)) {
        subgridName = subgridName.replace(/\W/g, "");
        generateEnums(typeInfo.possibleEnums, subgrid.enums);
        generateLiteralsTypesUnionsAndCollection(
          `${subgridName}_attributes`,
          subgrid.attributes,
          "Xrm.Attributes.Attribute",
          true
        );
        generateSubgridTypes(subgridName);
        generateContext(
          `${subgridName}`,
          `Xrm.FormContext`,
          subgrid.attributes
        );
      }
      for (const [quickViewName, quickView] of Object.entries(
        formObject.quickViews
      )) {
        generateEnums(typeInfo.possibleEnums, quickView.enums);
        generateLiteralsTypesUnionsAndCollection(
          `${quickViewName}_attributes`,
          quickView.attributes,
          "Xrm.Attributes.Attribute",
          false
        );
        generateLiteralsTypesUnionsAndCollection(
          `${quickViewName}_controls`,
          quickView.controls,
          "Xrm.Controls.Control",
          false
        );
        generateContext(
          `${quickViewName}`,
          `Xrm.Controls.QuickFormControl`,
          quickView.attributes,
          quickView.controls
        );
      }
      generateLiteralsTypesUnionsAndCollection(
        `${formName}_attributes`,
        formObject.attributes,
        "Xrm.Attributes.Attribute",
        false
      );
      generateLiteralsTypesUnionsAndCollection(
        `${formName}_controls`,
        formObject.controls,
        "Xrm.Controls.Control",
        false
      );
      generateContext(
        formName,
        `Xrm.FormContext`,
        formObject.attributes,
        formObject.controls
      );
    }

    // Create a new window with a textarea showing the output.
    // The textarea is set to readonly to prevent editing.
    const w = window.open(
      "",
      "_blank",
      "width=600,height=400,menubar=no,toolbar=no,location=no,resizable=yes"
    );
    if (w) {
      w.document.write(
        "<html><head><title>TypeScript Definitions</title></head><body>"
      );
      w.document.write(
        '<textarea readonly style="width:100%; height:90%;">' +
          outputTS +
          "</textarea>"
      );
      w.document.write("</body></html>");
      w.document.close();
    } else {
      // Fallback to prompt if popups are blocked.
      prompt("Copy the TypeScript definition:", outputTS);
    }
  });
})();
